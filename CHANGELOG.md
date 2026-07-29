# Changelog

## 0.1.1 - 2026-07-28

- Add compatibility with Dart Sass 1.102.0 and the future removal of global
  built-in functions in Dart Sass 3.0.
- Preserve falsey theme values when a theme mapping is registered again.
- Fix `$sameClass` selectors when CSS Modules support is enabled.
- Add regression fixtures for generated CSS and make global built-in
  deprecations fatal in tests.
- Correct documentation and package scripts.
