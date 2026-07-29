# sass-themes

A small Sass library for defining themes, generating matching CSS custom
properties, and applying themed property values.

The implementation was inspired by
[Stuart Roskelley's article about theming in Sass](https://medium.com/@sroskelley/theming-in-sass-67b8c0265e3f).

## Usage

```scss
@use 'themes';

@include themes.generateThemeMappings('light', (
  surface: #fff,
  text-on-surface: #111,
));

@include themes.generateThemeMappings('dark', (
  surface: #111,
  text-on-surface: #fff,
));

:root {
  @include themes.generateThemeVariables;
}

.card {
  @include themes.theme-bg-tx(surface);
}
```

Set `$useCssModules` when loading the module if the generated selectors need
the CSS Modules `:global()` syntax:

```scss
@use 'themes' with (
  $useCssModules: true
);
```

## Development

Install dependencies and run the regression build with Dart Sass 1.102.0:

```sh
npm install
npm test
npm run test:deprecations
```

The deprecation check uses `--fatal-deprecation=global-builtin`, so a global
built-in function cannot be reintroduced unnoticed.
