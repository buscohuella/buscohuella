-- FP-015B: fotografías editables en borradores y avisos ACTIVE/PAUSED.

DROP POLICY IF EXISTS "report photos owner insert" ON storage.objects;
CREATE POLICY "report photos owner insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'report-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1
    FROM public.reports r
    WHERE r.id::text = (storage.foldername(name))[2]
      AND r.created_by = auth.uid()
      AND r.status IN ('DRAFT', 'ACTIVE', 'PAUSED')
  )
);

DROP POLICY IF EXISTS "report photos owner delete" ON storage.objects;
CREATE POLICY "report photos owner delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'report-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1
    FROM public.reports r
    WHERE r.id::text = (storage.foldername(name))[2]
      AND r.created_by = auth.uid()
      AND r.status IN ('DRAFT', 'ACTIVE', 'PAUSED')
  )
);

CREATE OR REPLACE FUNCTION public.set_report_primary_photo(
  target_photo_id uuid
)
RETURNS public.report_photos
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target public.report_photos;
BEGIN
  SELECT rp.*
  INTO target
  FROM public.report_photos rp
  JOIN public.reports r ON r.id = rp.report_id
  WHERE rp.id = target_photo_id
    AND r.created_by = auth.uid()
    AND r.status IN ('DRAFT', 'ACTIVE', 'PAUSED');

  IF target.id IS NULL THEN
    RAISE EXCEPTION 'REPORT_PHOTO_NOT_FOUND';
  END IF;

  UPDATE public.report_photos
  SET is_primary = false
  WHERE report_id = target.report_id;

  UPDATE public.report_photos
  SET is_primary = true
  WHERE id = target_photo_id
  RETURNING * INTO target;

  RETURN target;
END;
$$;

REVOKE ALL ON FUNCTION public.set_report_primary_photo(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.set_report_primary_photo(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.reorder_report_photos(
  target_report_id uuid,
  ordered_photo_ids uuid[]
)
RETURNS SETOF public.report_photos
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected_count integer;
  supplied_count integer;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.reports r
    WHERE r.id = target_report_id
      AND r.created_by = auth.uid()
      AND r.status IN ('DRAFT', 'ACTIVE', 'PAUSED')
  ) THEN
    RAISE EXCEPTION 'REPORT_FORBIDDEN';
  END IF;

  SELECT count(*)
  INTO expected_count
  FROM public.report_photos
  WHERE report_id = target_report_id;

  supplied_count := coalesce(array_length(ordered_photo_ids, 1), 0);

  IF expected_count <> supplied_count THEN
    RAISE EXCEPTION 'REPORT_PHOTO_ORDER_MISMATCH';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM unnest(ordered_photo_ids) photo_id
    LEFT JOIN public.report_photos rp
      ON rp.id = photo_id
      AND rp.report_id = target_report_id
    WHERE rp.id IS NULL
  ) THEN
    RAISE EXCEPTION 'REPORT_PHOTO_ORDER_MISMATCH';
  END IF;

  UPDATE public.report_photos rp
  SET position = ordered.ordinality - 1
  FROM unnest(ordered_photo_ids)
    WITH ORDINALITY AS ordered(photo_id, ordinality)
  WHERE rp.id = ordered.photo_id
    AND rp.report_id = target_report_id;

  RETURN QUERY
  SELECT *
  FROM public.report_photos
  WHERE report_id = target_report_id
  ORDER BY position, created_at;
END;
$$;

REVOKE ALL ON FUNCTION public.reorder_report_photos(uuid, uuid[]) FROM public;
GRANT EXECUTE ON FUNCTION public.reorder_report_photos(uuid, uuid[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.record_report_photo_update(
  target_report_id uuid,
  target_change text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_status text;
BEGIN
  SELECT r.status
  INTO target_status
  FROM public.reports r
  WHERE r.id = target_report_id
    AND r.created_by = auth.uid();

  IF target_status IS NULL THEN
    RAISE EXCEPTION 'REPORT_NOT_FOUND';
  END IF;

  IF target_status NOT IN ('DRAFT', 'ACTIVE', 'PAUSED') THEN
    RAISE EXCEPTION 'REPORT_EDIT_STATE_INVALID';
  END IF;

  IF target_status IN ('ACTIVE', 'PAUSED') THEN
    INSERT INTO public.report_events (
      report_id,
      actor_id,
      event_type,
      from_status,
      to_status,
      metadata
    )
    VALUES (
      target_report_id,
      auth.uid(),
      'UPDATED',
      target_status,
      target_status,
      jsonb_build_object(
        'changed_fields', jsonb_build_array('photos'),
        'photo_change', target_change
      )
    );
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.record_report_photo_update(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.record_report_photo_update(uuid, text) TO authenticated;
