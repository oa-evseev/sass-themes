import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as sass from 'sass';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const root = join(testDirectory, '..');
const successCases = [
  'class',
  'css-modules',
  'data-theme',
  'lifecycle-apply-first',
  'lifecycle-variables-first',
  'reordered-tokens',
  'variable-name',
];

for (const name of successCases) {
  const result = sass.compile(join(testDirectory, 'fixtures', `${name}.scss`), {
    fatalDeprecations: ['global-builtin'],
    style: 'expanded',
  });
  const expected = await readFile(join(testDirectory, 'expected', `${name}.css`), 'utf8');
  assert.equal(result.css.trimEnd(), expected.trimEnd(), `Generated CSS changed for ${name}`);
  console.log(`✓ ${name}`);
}

const failures = [
  ['duplicate theme', `@use 'themes'; @include themes.register(light, (a: 1)); @include themes.register(light, (a: 2));`, 'already registered'],
  ['late registration after variables', `@use 'themes'; @include themes.register(light, (a: 1)); :root { @include themes.emit-variables(); } @include themes.register(dark, (a: 2));`, 'registry is sealed'],
  ['late registration after apply', `@use 'themes'; @include themes.register(light, (a: 1)); x { @include themes.apply(color, a); } @include themes.register(dark, (a: 2));`, 'registry is sealed'],
  ['late registration after wrapper', `@use 'themes'; @include themes.register(light, (a: 1, text-on-a: 2)); x { @include themes.theme-bg-tx(a); } @include themes.register(dark, (a: 3, text-on-a: 4));`, 'registry is sealed'],
  ['non-map tokens', `@use 'themes'; @include themes.register(light, (a b));`, 'must be a non-empty map'],
  ['empty tokens', `@use 'themes'; @include themes.register(light, ());`, 'must be a non-empty map'],
  ['missing token', `@use 'themes'; @include themes.register(light, (a: 1, b: 2)); @include themes.register(dark, (a: 3));`, 'missing canonical token'],
  ['extra token', `@use 'themes'; @include themes.register(light, (a: 1)); @include themes.register(dark, (a: 2, b: 3));`, 'extra token'],
  ['null value', `@use 'themes'; @include themes.register(light, (a: null));`, 'must not be null'],
  ['invalid theme type', `@use 'themes'; @include themes.register(12, (a: 1));`, 'Theme name must match'],
  ['invalid theme name', `@use 'themes'; @include themes.register('bad name', (a: 1));`, 'Theme name must match'],
  ['invalid token name', `@use 'themes'; @include themes.register(light, ('1a': 1));`, 'Token name must match'],
  ['invalid token type', `@use 'themes'; @include themes.register(light, (12: 1));`, 'Token name must match'],
  ['invalid mode', `@use 'themes' with ($selector-mode: other); @include themes.register(light, (a: 1)); x { @include themes.apply(color, a); }`, '$selector-mode must be class or data-theme'],
  ['invalid css modules flag', `@use 'themes' with ($css-modules: yes); @include themes.register(light, (a: 1)); x { @include themes.apply(color, a); }`, '$css-modules must be a boolean'],
  ['invalid same-element flag', `@use 'themes'; @include themes.register(light, (a: 1)); x { @include themes.apply(color, a, $same-element: yes); }`, '$same-element must be a boolean'],
  ['empty registry variables', `@use 'themes'; :root { @include themes.emit-variables(); }`, 'no themes are registered'],
  ['empty registry apply', `@use 'themes'; x { @include themes.apply(color, a); }`, 'no themes are registered'],
  ['unknown token', `@use 'themes'; @include themes.register(light, (a: 1)); x { @include themes.apply(color, b); }`, 'Unknown theme token'],
  ['invalid variable fragment', `@use 'themes'; x { value: themes.variable-name(light, 'bad token'); }`, 'Token name must match'],
];

for (const [name, source, message] of failures) {
  assert.throws(
    () => sass.compileString(source, {loadPaths: [root], fatalDeprecations: ['global-builtin']}),
    (error) => error.message.includes(message),
    `Expected ${name} to fail with ${JSON.stringify(message)}`,
  );
  console.log(`✓ ${name}`);
}

const privateMembers = [`themes.$-registry`, `themes.-validated-output()`];
for (const member of privateMembers) {
  assert.throws(
    () => sass.compileString(`@use 'themes'; x { value: ${member}; }`, {loadPaths: [root]}),
    /Private members can't be accessed/,
  );
}
console.log('✓ registry and helpers are private');
