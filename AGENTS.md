# Project instructions

Before planning or modifying files, read:

`~/projects/AGENTS.md`

If the workspace policy cannot be read, stop and report that it is unavailable.

The rules below supplement or tighten the workspace policy for this repository.

## Project boundary

- Preserve this library's Sass API and generated selector behavior.
- Use npm and the committed lockfile. Do not replace local Dart Sass or perform unrelated dependency upgrades.
- Keep corporate styling, credentials, and private data out of this reusable package.

## Commands and done criteria

- Setup: `npm ci`.
- Regression suite: `npm test`.
- Deprecation compatibility: `npm run test:deprecations`.
- `npm run build:examples` generates example output and should run only when relevant.
- Clean-worktree verification: `make test` (runs `npm ci`, regression, and deprecation checks).
- The GitHub `test` workflow uses the same `make test` contract.
- Changes are complete when regression and deprecation checks pass and public mixin/function behavior remains backward compatible or the requested breaking change is documented.
- Any change to a public variable, function, mixin, or its contract must update
  its `///` annotations, `docs/index.html`, and README documentation when relevant
  in the same change.
