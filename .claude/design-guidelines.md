# ACT-ON Group Design Guidelines

Design system derived from actongroup.com, adapted for this Astro + Tailwind CSS v4 project.

## Brand Identity

Tone: Professional, tech-forward, modern. Clean lines, generous whitespace, high contrast.

## Color Palette

### Primary (navy scale)

- navy-950: #141720 — Deepest backgrounds, button fills
- navy-900: #1A1E2A — Page backgrounds, dark sections
- navy-800: #1F2533 — Card backgrounds, text on light
- navy-700: #2A3045 — Borders, dividers
- navy-600: #3D4560 — Secondary text, muted
- navy-500: #566480 — Mid-range
- navy-400: #7080A0 — Placeholder, disabled
- navy-300: #94A3BB — Subtle borders on dark
- navy-200: #B0BDD0 — Body text on dark
- navy-100: #D4DCE8 — Primary text on dark
- navy-50: #EEF1F6 — Light backgrounds

### Accent

- acton-700: #5E00AB — Dark purple (hover states)
- acton-600: #7A00DF — Primary brand purple
- acton-500: #9B33F0 — Purple mid
- acton-400: #B366F5 — Light purple (text on dark)
- acton-300: #CC99F8 — Lightest purple

### Semantic

- green-600: #00A86B — Dark success
- green-500: #00D084 — Success states
- green-400: #33DB9D — Light success
- red-600: #C53030 — Dark error
- red-500: #E53E3E — Error states
- red-400: #FC8181 — Light error
- blue-600: #0574B4 — Dark info
- blue-500: #0693E3 — Info/secondary accent
- blue-400: #34A9EA — Light info
- cyan-500: #34E2E4 — Highlight accent
- cyan-400: #66EAE9 — Light highlight

### Usage Rules

- Dark mode is the default (navy-950 background, navy-100 text)
- acton-600 (#7A00DF) is the primary interactive color
- One accent color per section maximum
- green only for success, red only for errors
- Text on dark: white or navy-200, never mid-range grays

## Typography

### Fonts

- Primary: DM Sans (400, 500, 700) — all UI text
- Secondary: Inter (400, 500, 600, 700) — data-dense, long-form
- Mono: JetBrains Mono — code, technical data

### Scale

- Hero: 42px / 700 / DM Sans
- Section heading: 32px / 700
- Card heading: 20px / 700
- Body: 16px / 400 / line-height 1.6
- Small: 14px / 400
- Button: 1.125em / 500

### Rules

- No serif fonts
- text-balance on headings, text-pretty on body
- tabular-nums for data

## Components

### Buttons

- Pill shape: border-radius 9999px
- Primary: navy-950 bg, white text, no shadow
- Ghost: transparent bg, 1px navy-700 border
- Hover: subtle bg change or border-color to acton-600
- Padding: calc(0.667em + 2px) calc(1.333em + 2px)

### Cards

- Border radius: 12px
- Background: navy-800 on dark, white on light
- Border: 1px solid navy-700/50
- No shadows

### Border Radius Scale

- Buttons/badges: 9999px
- Cards: 12px
- Inputs: 4px
- Modals: 16px

## Visual Style

- Flat design — no shadows for hierarchy, use color contrast
- Gradients only on small accents (badges, decorative lines), never on backgrounds
- Standard gradient angle: 135deg
- Animation: 200ms for interactions, ease-out entrances
- Respect prefers-reduced-motion
