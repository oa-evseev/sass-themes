# Changelog

## 1.0.0 - 2026-08-17

- Replace the 0.1.1 mapping API with the generic `register`, `variable-name`,
  `emit-variables`, and `apply` API.
- Add a validated collecting-to-sealed registry lifecycle and deterministic
  theme/token output ordering.
- Add class, CSS Modules, and `data-theme` selector modes with descendant and
  same-element forms.
- Preserve static fallbacks and arbitrary final CSS values in runtime `var()`
  declarations.
- Retain `theme-bg-tx` only as the `text-on-<token>` convention wrapper.
- Remove all legacy public state, lookup helpers, mapping generators, and the
  legacy general theme mixin. This is an intentional breaking change with no
  compatibility aliases.
- Make `make test` install locked dependencies and run regression and
  deprecation checks from a clean worktree.
- Replace the generated SassDoc site and its vulnerable dependency tree with a
  dependency-free, manually maintained static HTML reference.

## 0.1.1 - 2026-07-28

- Add compatibility with Dart Sass 1.102.0 and the future removal of global
  built-in functions in Dart Sass 3.0.
- Preserve falsey theme values when a theme mapping is registered again.
- Fix same-element selectors when CSS Modules support is enabled.
- Add regression fixtures and fatal global built-in deprecation checks.
