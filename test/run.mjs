import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import * as sass from 'sass';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const cases = ['default', 'css-modules', 'false-value'];

for (const name of cases) {
  const result = sass.compile(join(testDirectory, 'fixtures', `${name}.scss`), {
    fatalDeprecations: ['global-builtin'],
    style: 'expanded',
  });
  const expected = await readFile(
    join(testDirectory, 'expected', `${name}.css`),
    'utf8',
  );

  assert.equal(
    result.css.trimEnd(),
    expected.trimEnd(),
    `Generated CSS changed for ${name}`,
  );
  console.log(`✓ ${name}`);
}
