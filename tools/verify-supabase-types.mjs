import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, '..');

const requireFromReportData = createRequire(join(root, 'packages', 'report-data', 'package.json'));
const ts = requireFromReportData('typescript');

const petTypesPath = join(root, 'packages', 'pet-data', 'src', 'database.types.ts');

const reportTypesPath = join(root, 'packages', 'report-data', 'src', 'database.types.ts');

const supabaseCommand = process.platform === 'win32' ? 'supabase.exe' : 'supabase';

const generation = spawnSync(
  supabaseCommand,
  ['gen', 'types', 'typescript', '--local', '--schema', 'public', '--workdir', root],
  {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  },
);

if (generation.error) {
  throw generation.error;
}

if (generation.status !== 0) {
  process.stderr.write(generation.stderr || 'Supabase LOCAL type generation failed.\n');
  process.exit(generation.status ?? 1);
}

const generatedText = generation.stdout;

if (!generatedText.includes('export type Database')) {
  throw new Error('Supabase LOCAL did not generate a Database type.');
}

function parseSource(label, text) {
  const source = ts.createSourceFile(label, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  if (source.parseDiagnostics.length > 0) {
    const diagnostics = source.parseDiagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
      .join('\n');

    throw new Error(`${label} contains parse errors:\n${diagnostics}`);
  }

  return source;
}

const generatedSource = parseSource('supabase-local.generated.ts', generatedText);

const petSource = parseSource(petTypesPath, readFileSync(petTypesPath, 'utf8'));

const reportSource = parseSource(reportTypesPath, readFileSync(reportTypesPath, 'utf8'));

function getDatabaseType(source) {
  const declaration = source.statements.find(
    (statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === 'Database',
  );

  if (!declaration) {
    throw new Error(`${source.fileName}: Database type not found.`);
  }

  return declaration.type;
}

function memberName(member) {
  if (!member.name) {
    return null;
  }

  if (
    ts.isIdentifier(member.name) ||
    ts.isStringLiteral(member.name) ||
    ts.isNumericLiteral(member.name)
  ) {
    return member.name.text;
  }

  return null;
}

function resolveTypeNode(source, node) {
  let current = node;
  const seen = new Set();

  while (
    ts.isTypeReferenceNode(current) &&
    ts.isIdentifier(current.typeName) &&
    !current.typeArguments?.length
  ) {
    const name = current.typeName.text;

    if (seen.has(name)) {
      throw new Error(`${source.fileName}: circular type alias "${name}".`);
    }

    const declaration = source.statements.find(
      (statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === name,
    );

    if (!declaration) {
      break;
    }

    seen.add(name);
    current = declaration.type;
  }

  return current;
}

function getPropertyType(container, name, context) {
  if (!ts.isTypeLiteralNode(container)) {
    throw new Error(`${context}: expected type literal before "${name}".`);
  }

  const member = container.members.find(
    (candidate) => ts.isPropertySignature(candidate) && memberName(candidate) === name,
  );

  if (!member?.type) {
    throw new Error(`${context}: property "${name}" not found.`);
  }

  return member.type;
}

function getPath(source, path) {
  let current = getDatabaseType(source);
  const walked = ['Database'];

  for (const part of path) {
    walked.push(part);

    current = resolveTypeNode(source, current);

    current = getPropertyType(current, part, `${source.fileName}:${walked.join('.')}`);
  }

  return resolveTypeNode(source, current);
}

const printer = ts.createPrinter({
  removeComments: true,
  newLine: ts.NewLineKind.LineFeed,
});

function normalize(node, source) {
  return printer.printNode(ts.EmitHint.Unspecified, node, source).replace(/\s+/g, ' ').trim();
}

const failures = [];

function comparePath(label, curatedSource, path) {
  const generatedNode = getPath(generatedSource, path);

  const curatedNode = getPath(curatedSource, path);

  const generated = normalize(generatedNode, generatedSource);

  const curated = normalize(curatedNode, curatedSource);

  if (generated !== curated) {
    failures.push({
      label,
      generated,
      curated,
    });
  }
}

function getIndexedDatabasePath(node) {
  const parts = [];
  let current = node;

  while (ts.isIndexedAccessTypeNode(current)) {
    const index = current.indexType;

    if (!ts.isLiteralTypeNode(index) || !ts.isStringLiteral(index.literal)) {
      return null;
    }

    parts.unshift(index.literal.text);
    current = current.objectType;
  }

  if (
    !ts.isTypeReferenceNode(current) ||
    !ts.isIdentifier(current.typeName) ||
    current.typeName.text !== 'Database'
  ) {
    return null;
  }

  return parts;
}

function verifyPartialInsertUpdate(label, source, tableName) {
  const update = getPath(source, ['public', 'Tables', tableName, 'Update']);

  const argument =
    ts.isTypeReferenceNode(update) &&
    ts.isIdentifier(update.typeName) &&
    update.typeName.text === 'Partial' &&
    update.typeArguments?.length === 1
      ? update.typeArguments[0]
      : null;

  const actualPath = argument ? getIndexedDatabasePath(argument) : null;

  const expectedPath = ['public', 'Tables', tableName, 'Insert'];

  if (
    !actualPath ||
    actualPath.length !== expectedPath.length ||
    actualPath.some((part, index) => part !== expectedPath[index])
  ) {
    failures.push({
      label,
      generated: `Partial<Database['public']['Tables']['${tableName}']['Insert']>`,
      curated: normalize(update, source),
    });
  }
}

function getFunctionNames(source) {
  const functions = getPath(source, ['public', 'Functions']);

  if (!ts.isTypeLiteralNode(functions)) {
    throw new Error(`${source.fileName}: Functions is not a type literal.`);
  }

  return functions.members.filter(ts.isPropertySignature).map(memberName).filter(Boolean).sort();
}

function verifyFunctionInventory(label, source, expected) {
  const actual = getFunctionNames(source);
  const wanted = [...expected].sort();

  if (actual.length !== wanted.length || actual.some((name, index) => name !== wanted[index])) {
    failures.push({
      label,
      generated: wanted.join(', '),
      curated: actual.join(', '),
    });
  }
}

function typeLiteralValue(node) {
  if (!ts.isLiteralTypeNode(node)) {
    return { ok: false };
  }

  const literal = node.literal;

  if (ts.isStringLiteral(literal) || ts.isNumericLiteral(literal)) {
    return {
      ok: true,
      value: literal.text,
    };
  }

  if (literal.kind === ts.SyntaxKind.TrueKeyword) {
    return {
      ok: true,
      value: true,
    };
  }

  if (literal.kind === ts.SyntaxKind.FalseKeyword) {
    return {
      ok: true,
      value: false,
    };
  }

  return { ok: false };
}

function verifySetofOptions(label, curatedSource, functionName) {
  const path = ['public', 'Functions', functionName, 'SetofOptions'];

  const generated = getPath(generatedSource, path);

  const curated = getPath(curatedSource, path);

  const fields = ['from', 'to', 'isOneToOne', 'isSetofReturn'];

  for (const field of fields) {
    const generatedType = getPropertyType(generated, field, `${label}.generated`);

    const curatedType = getPropertyType(curated, field, `${label}.curated`);

    const generatedValue = typeLiteralValue(generatedType);

    const curatedValue = typeLiteralValue(curatedType);

    if (!generatedValue.ok || !curatedValue.ok || generatedValue.value !== curatedValue.value) {
      failures.push({
        label: `${label}.${field}`,
        generated: normalize(generatedType, generatedSource),
        curated: normalize(curatedType, curatedSource),
      });
    }
  }
}

function verifyTableRowReturn(label, curatedSource, functionName, tableName, expectArray) {
  const returnPath = ['public', 'Functions', functionName, 'Returns'];

  const generatedReturn = getPath(generatedSource, returnPath);

  const curatedReturn = getPath(curatedSource, returnPath);

  let generatedTarget = generatedReturn;
  let curatedTarget = curatedReturn;

  if (expectArray) {
    if (!ts.isArrayTypeNode(generatedReturn) || !ts.isArrayTypeNode(curatedReturn)) {
      failures.push({
        label,
        generated: normalize(generatedReturn, generatedSource),
        curated: normalize(curatedReturn, curatedSource),
      });

      return;
    }

    generatedTarget = generatedReturn.elementType;

    curatedTarget = curatedReturn.elementType;
  }

  const curatedPath = getIndexedDatabasePath(curatedTarget);

  const expectedPath = ['public', 'Tables', tableName, 'Row'];

  if (
    !curatedPath ||
    curatedPath.length !== expectedPath.length ||
    curatedPath.some((part, index) => part !== expectedPath[index])
  ) {
    failures.push({
      label,
      generated: `Database['public']['Tables']['${tableName}']['Row']${expectArray ? '[]' : ''}`,
      curated: normalize(curatedReturn, curatedSource),
    });

    return;
  }

  const generatedRow = getPath(generatedSource, expectedPath);

  if (normalize(generatedTarget, generatedSource) !== normalize(generatedRow, generatedSource)) {
    failures.push({
      label,
      generated: normalize(generatedReturn, generatedSource),
      curated: normalize(curatedReturn, curatedSource),
    });
  }
}

const petFunctions = [
  'reorder_pet_photos',
  'repair_pet_photo_collection',
  'set_pet_primary_photo',
  'user_can_delete_pet_photo_for_storage',
  'user_owns_active_pet_for_storage',
  'user_owns_pet_for_storage',
];

const reportFunctions = [
  'can_manage_sighting_photo_storage',
  'create_report_sighting',
  'get_my_notification_preferences',
  'get_my_notifications_page',
  'get_my_sighting',
  'get_my_sighting_timeline',
  'get_my_sightings',
  'get_my_sightings_page',
  'get_owned_sighting_archive_state',
  'get_owned_sightings',
  'get_owned_sightings_page',
  'get_owned_sightings_summary',
  'get_public_report',
  'get_public_reports',
  'get_unread_notification_count',
  'manage_report_lifecycle',
  'mark_all_notifications_read',
  'mark_notification_read',
  'publish_report_draft',
  'record_report_photo_update',
  'reorder_report_photos',
  'review_owned_report_sighting',
  'set_owned_sighting_archived',
  'set_report_primary_photo',
  'update_my_notification_preferences',
  'update_owned_report_content',
];

verifyFunctionInventory('pet-data RPC inventory', petSource, petFunctions);

verifyFunctionInventory('report-data RPC inventory', reportSource, reportFunctions);

for (const name of petFunctions) {
  const usesPetPhotoRow = name === 'reorder_pet_photos' || name === 'set_pet_primary_photo';

  if (!usesPetPhotoRow) {
    comparePath(`pet-data RPC ${name}`, petSource, ['public', 'Functions', name]);

    continue;
  }

  comparePath(`pet-data RPC ${name}.Args`, petSource, ['public', 'Functions', name, 'Args']);

  verifySetofOptions(`pet-data RPC ${name}.SetofOptions`, petSource, name);

  verifyTableRowReturn(
    `pet-data RPC ${name}.Returns`,
    petSource,
    name,
    'pet_photos',
    name === 'reorder_pet_photos',
  );
}

for (const name of reportFunctions) {
  const functionPath = ['public', 'Functions', name];

  const generatedFunction = getPath(generatedSource, functionPath);

  const curatedFunction = getPath(reportSource, functionPath);

  if (!ts.isTypeLiteralNode(generatedFunction) || !ts.isTypeLiteralNode(curatedFunction)) {
    throw new Error(`report-data RPC ${name}: expected function contracts to be type literals.`);
  }

  const hasGeneratedSetofOptions = generatedFunction.members.some(
    (member) => ts.isPropertySignature(member) && memberName(member) === 'SetofOptions',
  );

  const hasCuratedSetofOptions = curatedFunction.members.some(
    (member) => ts.isPropertySignature(member) && memberName(member) === 'SetofOptions',
  );

  comparePath(`report-data RPC ${name}.Args`, reportSource, [...functionPath, 'Args']);

  comparePath(`report-data RPC ${name}.Returns`, reportSource, [...functionPath, 'Returns']);

  if (hasGeneratedSetofOptions !== hasCuratedSetofOptions) {
    failures.push({
      label: `report-data RPC ${name}.SetofOptions presence`,
      generated: String(hasGeneratedSetofOptions),
      curated: String(hasCuratedSetofOptions),
    });

    continue;
  }

  if (hasGeneratedSetofOptions) {
    verifySetofOptions(`report-data RPC ${name}.SetofOptions`, reportSource, name);
  }
}

for (const section of ['Row', 'Insert']) {
  for (const field of ['public_show_avatar', 'public_show_municipality']) {
    comparePath(`profiles.${section}.${field}`, petSource, [
      'public',
      'Tables',
      'profiles',
      section,
      field,
    ]);
  }
}

for (const section of ['Row', 'Insert']) {
  comparePath(`public_profiles.${section}`, petSource, [
    'public',
    'Tables',
    'public_profiles',
    section,
  ]);
}

verifyPartialInsertUpdate('profiles.Update uses Partial<Insert>', petSource, 'profiles');

verifyPartialInsertUpdate(
  'public_profiles.Update uses Partial<Insert>',
  petSource,
  'public_profiles',
);

verifyPartialInsertUpdate('sightings.Update uses Partial<Insert>', reportSource, 'sightings');

for (const section of ['Row', 'Insert']) {
  for (const field of ['location_label', 'location_source']) {
    comparePath(`sightings.${section}.${field}`, reportSource, [
      'public',
      'Tables',
      'sightings',
      section,
      field,
    ]);
  }
}

if (failures.length > 0) {
  console.error(`Supabase contract verification FAILED (${failures.length} mismatch(es)).`);

  for (const failure of failures) {
    console.error(`\n[${failure.label}]`);
    console.error(`LOCAL generated: ${failure.generated}`);
    console.error(`Curated types:   ${failure.curated}`);
  }

  process.exit(1);
}

console.log('Supabase LOCAL type generation: PASS');

console.log(`pet-data RPC contracts: ${petFunctions.length}/${petFunctions.length} PASS`);

console.log(`report-data RPC contracts: ${reportFunctions.length}/${reportFunctions.length} PASS`);

console.log('Profile visibility contracts: PASS');

console.log('public_profiles contract: PASS');

console.log('Sighting location contracts: PASS');

console.log('Supabase curated contract verification: PASS');
