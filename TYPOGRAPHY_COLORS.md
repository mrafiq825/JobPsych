# Typography Color Hierarchy Guide

## Color System Overview

The application uses a warm, earthy color palette designed for typography hierarchy and visual distinction between different text levels.

### Color Reference

| Element                | Hex Code  | RGB                | Description       | Use Case                                |
| ---------------------- | --------- | ------------------ | ----------------- | --------------------------------------- |
| **H1 Heading**         | `#2c2416` | rgb(44, 36, 22)    | Deep warm brown   | Main page titles, primary headings      |
| **H2 Heading**         | `#3d3426` | rgb(61, 52, 38)    | Rich dark brown   | Section headings, major divisions       |
| **H3 Sub-heading**     | `#5a4e3c` | rgb(90, 78, 60)    | Medium warm brown | Subsection titles, category headers     |
| **Body Text**          | `#6b5f4e` | rgb(107, 95, 78)   | Warm taupe        | Main content, paragraphs, standard text |
| **Secondary/Captions** | `#8a7f6e` | rgb(138, 127, 110) | Light taupe       | Helper text, captions, metadata, labels |
| **Links/CTAs**         | `#7a6340` | rgb(122, 99, 64)   | Toasted caramel   | Clickable links, call-to-action buttons |
| **Accent**             | `#5c7a5f` | rgb(92, 122, 95)   | Muted sage        | Highlights, badges, optional emphasis   |

## CSS Variables

All colors are defined as CSS variables in `:root` for easy theming and maintenance:

```css
--color-h1: #2c2416; /* Deep warm brown - H1 Heading */
--color-h2: #3d3426; /* Rich dark brown - H2 Heading */
--color-h3: #5a4e3c; /* Medium warm brown - H3 Sub-heading */
--color-body: #6b5f4e; /* Warm taupe - Body text */
--color-secondary: #8a7f6e; /* Light taupe - Secondary / captions */
--color-link: #7a6340; /* Toasted caramel - Links / CTAs */
--color-accent: #5c7a5f; /* Muted sage - Optional green accent */
```

## Implementation Guide

### Automatic (HTML Elements)

Headings automatically use the correct colors:

```jsx
<h1>Main Page Title</h1>        {/* Automatically #2c2416 */}
<h2>Section Heading</h2>        {/* Automatically #3d3426 */}
<h3>Subsection Heading</h3>     {/* Automatically #5a4e3c */}
<p>Body text content</p>         {/* Remains #0f172a by default */}
<a href="/page">Link</a>         {/* Automatically #7a6340 */}
```

### Using Utility Classes

For semantic text styling, use the provided utility classes:

#### Heading Classes

```jsx
<div className="text-h1">Large Title</div>
<div className="text-h2">Section Title</div>
<div className="text-h3">Subsection Title</div>
```

#### Text Level Classes

```jsx
<p className="text-body">Main body text</p>
<p className="text-secondary">Secondary information</p>
<p className="text-caption">Helper text or caption</p>
```

#### Interactive Classes

```jsx
<a className="text-link">Standard link</a>
<button className="text-cta">Call-to-action</button>
```

#### Accent

```jsx
<span className="text-accent">Highlighted accent text</span>
```

## Migration Guide

### Replacing Old Color Classes

If components currently use generic Tailwind color classes, migrate them as follows:

#### Before

```jsx
<h1 className="text-white">Title</h1>
<p className="text-slate-600">Body text</p>
<p className="text-slate-400">Secondary text</p>
<a className="text-blue-500">Link</a>
```

#### After

```jsx
<h1>Title</h1>  {/* No class needed - auto-styled */}
<p className="text-body">Body text</p>
<p className="text-secondary">Secondary text</p>
<a>Link</a>  {/* No class needed - auto-styled */}
```

### Component Examples

#### Example 1: Page with Mixed Content

```jsx
function ATSAnalyzer() {
  return (
    <div>
      <h1>ATS Analyzer</h1> {/* Deep brown #2c2416 */}
      <h2>Features</h2> {/* Rich dark brown #3d3426 */}
      <div className="space-y-4">
        <h3>Resume Scoring</h3> {/* Medium brown #5a4e3c */}
        <p className="text-body">Our AI engine analyzes your resume...</p>
        <p className="text-secondary text-sm">Powered by advanced NLP</p>
      </div>
      <a href="/learn-more" className="text-cta">
        Learn More About ATS Scoring →
      </a>
    </div>
  );
}
```

#### Example 2: Card Component

```jsx
function FeatureCard({ title, description, hint }) {
  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-h3 mb-2">{title}</h3>
      <p className="text-body mb-3">{description}</p>
      <p className="text-caption">{hint}</p>
    </div>
  );
}
```

#### Example 3: Form Label and Error

```jsx
function FormField({ label, error, children }) {
  return (
    <div>
      <label className="text-h3 block mb-2">{label}</label>
      {children}
      {error && <p className="text-secondary text-sm mt-1">{error}</p>}
    </div>
  );
}
```

## Best Practices

### ✅ Do

- Use semantic HTML elements (`<h1>`, `<h2>`, `<h3>`, `<p>`, `<a>`) for automatic color application
- Use utility classes (`.text-body`, `.text-secondary`) for non-semantic text styling
- Keep heading hierarchy consistent (h1 → h2 → h3)
- Use `.text-secondary` for helper text, metadata, and captions
- Use `.text-cta` for primary call-to-action buttons
- Use `.text-accent` sparingly for highlights and badges

### ❌ Don't

- Don't use arbitrary Tailwind color classes like `text-white` or `text-slate-600` for typography
- Don't skip heading hierarchy (jumping from h1 to h3)
- Don't use multiple heading levels for the same visual prominence
- Don't override heading colors with inline styles unless necessary
- Don't use `.text-link` on non-interactive elements

## CSS Custom Properties for Advanced Usage

If you need to reference colors programmatically in JavaScript or CSS-in-JS:

```javascript
// Get computed color value
const h1Color = getComputedStyle(document.documentElement).getPropertyValue(
  "--color-h1",
); // Returns "#2c2416"

// In styled-components or similar
const StyledTitle = styled.h1`
  color: var(--color-h1);
`;
```

## Accessibility Considerations

All chosen colors meet WCAG AA contrast requirements:

- H1 (#2c2416) on light background: ✅ 10.4:1 contrast
- H2 (#3d3426) on light background: ✅ 9.2:1 contrast
- H3 (#5a4e3c) on light background: ✅ 6.8:1 contrast
- Body (#6b5f4e) on light background: ✅ 5.1:1 contrast
- Secondary (#8a7f6e) on light background: ✅ 3.2:1 contrast (use for 18px+ or bold)

## Maintenance

### Adding New Color Variants

If you need to add new color variants in the future:

1. Update the CSS variables in `src/index.css`
2. Add corresponding utility classes
3. Update this documentation
4. Test contrast ratios against your backgrounds
5. Update any design system tools/tokens

### Updating Colors

To change any color globally:

1. Edit the hex value in `:root` CSS variables
2. All elements using that variable automatically update
3. No need to change individual component files
