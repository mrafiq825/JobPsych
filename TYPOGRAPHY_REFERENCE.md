# Typography and Color Reference

This file is a reusable typography reference extracted from the current JobPsych codebase. It is written so another application can copy the same color logic, semantic text hierarchy, and background surfaces without depending on JobPsych-specific wording.

## Design Intent

The visual system uses a warm light base with earthy text colors for content pages, plus slate-based elevated surfaces for panels, cards, and dialogs. Headings are high-contrast, body text is muted but readable, and interactive elements use a caramel link color with optional indigo and sage accents.

## Semantic Typography Tokens

| Token               | Hex / Value | Purpose                                    |
| ------------------- | ----------- | ------------------------------------------ |
| `--color-h1`        | `#2c2416`   | Primary page titles and strongest headings |
| `--color-h2`        | `#3d3426`   | Section headings and major divisions       |
| `--color-h3`        | `#5a4e3c`   | Subsection titles and category labels      |
| `--color-body`      | `#6b5f4e`   | Main paragraph text                        |
| `--color-secondary` | `#8a7f6e`   | Captions, metadata, helper text            |
| `--color-link`      | `#7a6340`   | Links, CTAs, and interactive emphasis      |
| `--color-accent`    | `#5c7a5f`   | Accent text and optional highlight color   |

## Background Palette

| Token / Utility                                           | Hex / Value               | Typical Use                                       |
| --------------------------------------------------------- | ------------------------- | ------------------------------------------------- |
| `--bg-color`                                              | `#e2dfd2`                 | Global page background and light content sections |
| `bg-slate-800/50`                                         | Slate overlay             | Primary elevated panel background                 |
| `bg-slate-800/70`                                         | Slate overlay             | Buttons, controls, dense UI surfaces              |
| `bg-slate-700/50`                                         | Slate overlay             | Nested cards, grouped content blocks              |
| `bg-slate-800/30`                                         | Slate overlay             | Soft secondary panels and list items              |
| `bg-white` / `bg-white/95`                                | White / translucent white | Light overlays, chat surfaces, error states       |
| `bg-gray-50`                                              | Very light gray           | Informational panels and message bubbles          |
| `bg-indigo-500/5`, `bg-indigo-500/10`, `bg-indigo-500/20` | Indigo wash               | Decorative glows, badges, and callouts            |
| `bg-purple-500/5`, `bg-blue-500/5`                        | Purple / blue wash        | Supporting decorative backgrounds                 |
| `bg-emerald-500/20`, `bg-cyan-500/10`                     | Accent wash               | Status or feature highlights                      |

## Text Colors In Practice

| Usage Context             | Color / Utility                                     | Notes                                        |
| ------------------------- | --------------------------------------------------- | -------------------------------------------- |
| Light-page body text      | `#0f172a` / `var(--text-color)`                     | Default readable text on the warm background |
| Light-page muted text     | `rgba(15, 23, 42, 0.7)` / `var(--muted-text-color)` | Secondary text, hints, captions              |
| Dark-panel primary text   | `text-white`                                        | Main headings, labels, and strong emphasis   |
| Dark-panel secondary text | `text-gray-300`, `text-slate-300`                   | Standard copy on dark cards                  |
| Dark-panel tertiary text  | `text-slate-400`, `text-slate-500`                  | Metadata, timestamps, helper copy            |
| Bright CTA text           | `text-slate-950`                                    | Text on bright gradient buttons              |
| Accent text               | `text-indigo-300`, `text-indigo-400`                | Links and emphasis in dark sections          |
| Positive accent text      | `text-emerald-300`, `text-cyan-300`                 | Status, feature, and progress emphasis       |

## How To Apply It

Use the semantic heading and text classes when the element meaning matters:

```jsx
<h1 className="text-h1">Page Title</h1>
<h2 className="text-h2">Section Title</h2>
<h3 className="text-h3">Subsection Title</h3>
<p className="text-body">Main body text</p>
<p className="text-secondary">Supporting information</p>
<a className="text-link" href="/learn-more">Learn more</a>
<button className="text-cta">Continue</button>
```

For other applications, keep the same token names or map them to your own design system variables. The important part is preserving the hierarchy:

1. H1 and H2 should be the darkest, highest-contrast text.
2. Body text should stay readable but softer than headings.
3. Secondary text should be reserved for helper content.
4. Links and buttons should use one consistent accent color.
5. Backgrounds should separate global pages from elevated panels.

## Light Theme Mapping

The current codebase uses a light root background and a `page-force-light` wrapper to normalize legacy dark utilities on light pages.

- `text-white` and `text-slate-100` map to `var(--text-color)`.
- `text-gray-300`, `text-slate-200`, `text-slate-300`, and `text-slate-400` map to `var(--muted-text-color)`.
- Component panels can keep their slate or white backgrounds when they need separation from the page.

## Recommended Copy-Paste Tokens

```css
:root {
  --font-tinos: "Tinos", Georgia, serif;
  --bg-color: #e2dfd2;
  --text-color: #0f172a;
  --muted-text-color: rgba(15, 23, 42, 0.7);
  --color-h1: #2c2416;
  --color-h2: #3d3426;
  --color-h3: #5a4e3c;
  --color-body: #6b5f4e;
  --color-secondary: #8a7f6e;
  --color-link: #7a6340;
  --color-accent: #5c7a5f;
}
```

## Accessibility Notes

- Use the darker heading colors on light backgrounds for strong contrast.
- Keep `--color-secondary` for smaller text only, not long-form paragraphs.
- Use `text-slate-950` or equivalent for gradient buttons and bright fills.
- Preserve enough contrast when applying translucent overlays on top of the warm base background.

## Migration Checklist

When adapting this system to another application:

1. Define the color tokens in a global stylesheet or theme file.
2. Add semantic utility classes for headings, body text, and secondary text.
3. Use one root background token and one panel background family.
4. Replace scattered color utilities with the semantic tokens where possible.
5. Verify contrast on every page state, especially dark cards and translucent banners.
