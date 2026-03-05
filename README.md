# Formation IA - Frontend

Astro-based frontend for the Formation IA project, using React, MDX, and Tailwind CSS v4.

## Prerequisites

- Node.js (v18 or later recommended)
- npm

## Getting Started

1. Install dependencies:

```sh
npm install
```

2. Start the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:4321/formation-ia/`.

## Available Commands

| Command           | Action                                                          |
| :---------------- | :-------------------------------------------------------------- |
| `npm install`     | Install dependencies                                            |
| `npm run dev`     | Start local dev server at `localhost:4321`                      |
| `npm run build`   | Build production site to `./dist/` (includes Pagefind indexing) |
| `npm run preview` | Preview the production build locally                            |

## Project Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Astro and React components
│   ├── content/       # MDX content files
│   ├── layouts/       # Page layouts
│   ├── pages/         # File-based routing
│   └── styles/        # Global styles (Tailwind)
├── astro.config.mjs   # Astro configuration
├── tsconfig.json      # TypeScript configuration
└── package.json
```

## Tech Stack

- [Astro](https://astro.build) - Static site framework
- [React](https://react.dev) - UI components
- [MDX](https://mdxjs.com) - Markdown with JSX
- [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS
- [Pagefind](https://pagefind.app) - Static search (runs at build time)
