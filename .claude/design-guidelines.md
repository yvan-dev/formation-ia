# AOT Academy Design Guidelines

The accepted design system for this application is documented in [docs/design-system.md](../docs/design-system.md). Its semantic tokens live in `src/styles/global.css`; reuse those tokens and the existing components for every page.

- Graphite / violet identity, dark by default, persistent light theme.
- DM Sans for identity and UI, Inter for lessons, JetBrains Mono for code. Fonts are self-hosted with licenses.
- Editorial spacing, flat surfaces, discreet separators, no gradients or shadows for hierarchy.
- One violet accent; green only for successfully saved completion. Controls need contrast, native semantics and visible keyboard focus.
- Responsive layout from 320 px; long-form reading stays within 650 px. Headings use balanced wrapping, paragraphs pretty wrapping, data tabular numerals.
- Use the approved illustrations with responsive sizes. The homepage artwork has no visible explanatory text; team images have discreet captions only.
- Animation is confined to the approved hero SVG overlays. Animate transform/opacity only; provide pause, suspend offscreen/inactive, respect reduced motion. Other artwork stays static.
- Preserve lesson content, routes, completion persistence and the full quiz diagnostic when changing presentation.

Also follow [ui-constraints.md](ui-constraints.md). Native HTML controls are preferred for disclosure, progress, selection and keyboard behavior.
