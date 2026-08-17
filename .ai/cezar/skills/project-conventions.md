# RGN Admin project conventions

## Git workflow

- `main` is the production branch. Never push directly to `main`.
- Never create or merge a pull request targeting `main`.
- `dev` is the integration branch.
- Every task must start from the current `origin/dev`.
- Task branches must use the `cez/*` namespace.
- Never push directly to `dev`.
- Push task branches to `origin`.
- Open pull requests only from `cez/*` into `dev`.
- During implementation and verification, do not push, create pull requests, or merge anything.
- GitHub publication is performed only by the dedicated `Publish` workflow step after local verification has passed.
- Use squash merge.
- Enable auto-merge only after the pull request has been opened.
- Required GitHub status check: `test`.
- Do not bypass repository rules or required checks.

## Development

- Keep changes narrowly scoped to the requested task.
- Add or update tests for behaviour introduced or changed by the task.
- Do not modify repository rules, GitHub secrets, deployment credentials, or production configuration unless explicitly requested.
- Keep the lifecycle boundary explicit: `Implement` edits and reasons with cheap feedback; `Verify` performs reproducible authoritative validation.
- During `Implement`, use only cheap, local, dependency-free checks directly useful while editing, such as syntax or compile checks, `git diff --check`, formatting checks, and targeted static inspection.
- During `Implement`, run a targeted test only when its required environment already exists and the test is explicitly useful for the implementation step.
- During `Implement`, do not install dependencies or construct a project environment solely for authoritative verification.
- If a useful local check cannot run in the existing environment, continue implementing and delegate authoritative validation to `Verify`.
- The dedicated `Verify` step is authoritative. In a fresh task worktree it invokes exactly `make test`; it does not first run setup, install requirements, initialize submodules, select a project runtime, or perform any other hidden preparation.
- The repository's `make test` target must work from a clean worktree. It must initialize required submodules, install deterministic and pinned project dependencies, prepare any project-owned environment, and run the complete validation suite.
- RGN supplies the configured base worker toolchain and runtime. The repository declares its runtime constraints and owns reproducible project dependency installation and setup behind `make test`.
- When `Verify` fails and returns structured diagnostics to `Implement`, respond to those diagnostics without independently reconstructing the `Verify` environment.
- Do not weaken or remove tests merely to make verification or CI pass.
