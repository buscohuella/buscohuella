import sharp, { type Metadata } from 'sharp';

const MAX_INPUT_PIXELS = 25_000_000;
const MAX_INPUT_SIDE = 10_000;
const MIN_INPUT_SIDE = 300;
const MAX_OUTPUT_SIDE = 2_048;
const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
const OUTPUT_QUALITIES = [82, 76, 70, 64] as const;

export type PetPhotoProcessingErrorCode =
  | 'INVALID_IMAGE'
  | 'UNSUPPORTED_IMAGE'
  | 'IMAGE_TOO_SMALL'
  | 'IMAGE_TOO_LARGE'
  | 'ANIMATED_IMAGE'
  | 'OUTPUT_TOO_LARGE';

export class PetPhotoProcessingError extends Error {
  constructor(
    public readonly code: PetPhotoProcessingErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'PetPhotoProcessingError';
  }
}

export interface ProcessedPetPhoto {
  bytes: ArrayBuffer;
  mimeType: 'image/webp';
  fileSizeBytes: number;
  width: number;
  height: number;
}

export async function processPetPhoto(
  input: ArrayBuffer,
): Promise<ProcessedPetPhoto> {
  const source = Buffer.from(input);

  let metadata: Metadata;

  try {
    metadata = await sharp(source, {
      animated: false,
      failOn: 'warning',
      limitInputPixels: MAX_INPUT_PIXELS,
      limitInputChannels: 4,
      sequentialRead: true,
    }).metadata();
  } catch {
    throw new PetPhotoProcessingError(
      'INVALID_IMAGE',
      'No se ha podido procesar la imagen.',
    );
  }

  if (
    metadata.format !== 'jpeg' &&
    metadata.format !== 'png' &&
    metadata.format !== 'webp'
  ) {
    throw new PetPhotoProcessingError(
      'UNSUPPORTED_IMAGE',
      'El formato de la imagen no está permitido.',
    );
  }

  if ((metadata.pages ?? 1) > 1) {
    throw new PetPhotoProcessingError(
      'ANIMATED_IMAGE',
      'No se permiten imágenes animadas.',
    );
  }

  const orientedWidth =
    metadata.autoOrient?.width ?? metadata.width ?? 0;
  const orientedHeight =
    metadata.autoOrient?.height ?? metadata.height ?? 0;

  if (!orientedWidth || !orientedHeight) {
    throw new PetPhotoProcessingError(
      'INVALID_IMAGE',
      'No se han podido leer las dimensiones.',
    );
  }

  if (
    orientedWidth < MIN_INPUT_SIDE ||
    orientedHeight < MIN_INPUT_SIDE
  ) {
    throw new PetPhotoProcessingError(
      'IMAGE_TOO_SMALL',
      `La imagen debe medir al menos ${MIN_INPUT_SIDE} × ${MIN_INPUT_SIDE} píxeles.`,
    );
  }

  if (
    orientedWidth > MAX_INPUT_SIDE ||
    orientedHeight > MAX_INPUT_SIDE ||
    orientedWidth * orientedHeight > MAX_INPUT_PIXELS
  ) {
    throw new PetPhotoProcessingError(
      'IMAGE_TOO_LARGE',
      'La imagen tiene unas dimensiones demasiado grandes.',
    );
  }

  for (const quality of OUTPUT_QUALITIES) {
    try {
      const { data, info } = await sharp(source, {
        animated: false,
        failOn: 'warning',
        limitInputPixels: MAX_INPUT_PIXELS,
        limitInputChannels: 4,
        sequentialRead: true,
      })
        .autoOrient()
        .resize({
          width: MAX_OUTPUT_SIDE,
          height: MAX_OUTPUT_SIDE,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality,
          effort: 4,
          smartSubsample: true,
        })
        .toBuffer({ resolveWithObject: true });

      if (data.byteLength <= MAX_OUTPUT_BYTES) {
        return {
          bytes: data.buffer.slice(
            data.byteOffset,
            data.byteOffset + data.byteLength,
          ),
          mimeType: 'image/webp',
          fileSizeBytes: data.byteLength,
          width: info.width,
          height: info.height,
        };
      }
    } catch {
      throw new PetPhotoProcessingError(
        'INVALID_IMAGE',
        'La imagen está dañada o no se puede procesar.',
      );
    }
  }

  throw new PetPhotoProcessingError(
    'OUTPUT_TOO_LARGE',
    'No se ha podido optimizar la imagen por debajo de 2 MB.',
  );
}
