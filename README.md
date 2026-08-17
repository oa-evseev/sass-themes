# sass-themes

A generic build-time theme compiler for Sass. It registers complete token maps,
emits deterministic CSS, and creates a stable custom-property contract for
runtime overrides. It contains no palette, resolver, or design-system data.

## Usage

```scss
@use 'themes';

@include themes.register(light, (
  surface: #fff,
  text-on-surface: #111,
  shadow: 0 2px 8px rgb(0 0 0 / 15%),
));

@include themes.register(dark, (
  surface: #111,
  text-on-surface: #fff,
  shadow: 0 2px 8px rgb(0 0 0 / 50%),
));

:root {
  @include themes.emit-variables();
}

.card {
  @include themes.apply(background-color, surface);
  @include themes.apply(box-shadow, shadow);
  @include themes.theme-bg-tx(surface);
}
```

`apply()` emits a static fallback followed by the runtime override:

```css
.light .card {
  background-color: #fff;
  background-color: var(--theme-light-surface, #fff);
}
```

The consumer owns the variable scope. `emit-variables()` creates declarations,
not a selector, so it may be placed in `:root`, a preview container, or omitted.
`apply()` still works without it because every `var()` includes a fallback.
Inline styles or more-specific selectors can override the emitted variables.

`variable-name($theme, $token)` returns the unquoted stable name
`--theme-<theme>-<token>` and does not require a registered theme.

## Registry lifecycle and validation

The registry begins in `collecting` state. The first successful
`emit-variables()` or `apply()` seals it; `theme-bg-tx()` seals it through
`apply()`. Output mixins may be called repeatedly after sealing, but further
registration is an error.

The first registered theme establishes the canonical token set and order. Every
later theme must provide exactly those keys, although its input key order may
differ. Theme and token names must match
`[a-zA-Z_][a-zA-Z0-9_-]*`. Maps must be non-empty and values may be any final
CSS value except `null`, including `false`, `0`, quoted strings, lists, shadows,
borders, font families, keywords, and functions. An invalid operation errors
before registry mutation or CSS output.

## Selectors

Class selectors are the default. Configuration uses the Sass module system:

```scss
@use 'themes' with (
  $selector-mode: class,
  $css-modules: true,
);
```

The available contracts are:

| Configuration | Descendant | Same element |
| --- | --- | --- |
| class | `.light .card` | `.light.card` |
| class + CSS Modules | `:global(.light) .card` | `:global(.light).card` |
| data-theme | `[data-theme="light"] .card` | `[data-theme="light"].card` |

Pass `$same-element: true` to `apply()` for the second form. `$css-modules`
only affects class mode; `data-theme` emits attribute selectors exclusively.
Use `$before` and `$after` to surround the themed value, for example:

```scss
.card {
  @include themes.apply(border, surface, 1px solid, !important);
}
```

## Migrating from 0.1.1

Version 1.0.0 intentionally removes the legacy mutable mapping API. Replace
mapping generation with `register()`, variable generation with
`emit-variables()`, and property application with `apply()`. The old public
state, lookup helpers, and general legacy theme mixin have no aliases or
deprecated wrappers. CSS Modules configuration is now `$css-modules`.

## Development

The clean-worktree contract installs the committed dependencies and runs both
test modes:

```sh
make test
```

The equivalent explicit commands are `npm ci`, `npm test`, and
`npm run test:deprecations`. Dart Sass global built-in deprecations are fatal.
