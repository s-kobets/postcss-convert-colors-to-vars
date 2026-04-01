# postcss-convert-colors-to-vars

PostCSS plugin to replace hardcoded CSS colors with design token CSS variables.

## Why

This plugin is useful when you want to migrate existing CSS to design tokens without rewriting every stylesheet by hand.

It is especially useful for theming. Your component CSS stays the same, while light and dark themes only change token values:

```css
.badge {
  color: var(--color-text-primary);
  background: var(--color-surface-accent);
}
```

Then your themes can redefine only the tokens:

```css
:root {
  --color-text-primary: #111111;
  --color-surface-accent: #aabbcc;
}

[data-theme="dark"] {
  --color-text-primary: #f5f5f5;
  --color-surface-accent: #335577;
}
```

This package helps you get there from existing literal colors.

## Use Case

If your token source already looks like this:

```ts
const colors = {
  "yellow-90": "#aabbcc",
  "green-500": "#00594c",
}
```

you can keep existing CSS during migration and compile matching literals to CSS custom properties:

```css
.badge {
  color: #00594c;
  background: #aabbcc;
}
```

becomes:

```css
.badge {
  color: var(--sk-color-green-500);
  background: var(--sk-color-yellow-90);
}
```

That means:

- designers and token pipelines control theme values in one place
- component CSS no longer needs to change when light or dark theme values change
- teams can migrate incrementally instead of rewriting all styles at once

## Install

```bash
npm install postcss postcss-convert-colors-to-vars
```

## Usage

```ts
import postcss from "postcss"
import convertColorsToVars from "postcss-convert-colors-to-vars"

const result = await postcss([
  convertColorsToVars({
    colors: {
      "yellow-90": "#aabbcc",
      "green-500": "#00594c",
    },
    variablePrefix: "--sk-color-",
    exclude: ["white", "black"],
    skipFiles: ["global.css", /\.tokens\.css$/],
  }),
]).process(inputCss, { from: "button.module.css" })
```

## Works Well For

- migrating hardcoded colors to design tokens
- moving a codebase to CSS custom properties
- keeping component CSS stable across light and dark themes
- design systems where token values come from a separate source of truth

## Options

`colors`

Map of token name to color value.

`variablePrefix`

Prefix used to build CSS variable names. Default: `"--"`.

`exclude`

Token names that should not be converted.

`skipFiles`

List of string or `RegExp` patterns used to skip files.

`getVariableName`

Advanced override for custom variable naming.

`shouldSkipFile`

Advanced override for custom skip logic. If provided, it takes precedence over `skipFiles`.

## Notes

- Matching is case-insensitive.
- The plugin only replaces colors that exactly match provided token values.
- If two tokens share the same color value, the first one wins.
- Works with PostCSS 8.
- Package exports support both ESM and CommonJS consumers.
