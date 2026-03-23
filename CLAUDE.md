# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Development mode build
npm run lint         # ESLint check
npm run preview      # Preview production build locally
npm run test         # Run Vitest (single run)
npm run test:watch   # Run Vitest in watch mode
```

## Architecture

This is a single-page marketing/services website built with **Vite + React + TypeScript**.

**Entry flow:** `main.tsx` → `App.tsx` (React Query + Router setup) → `pages/Index.tsx` (assembles all section components) → individual section components in `src/components/`.

**Routing:** React Router v6 with only two routes — `/` (Index) and `*` (NotFound). All "navigation" is scroll-based within the single page.

**Backend:** Vercel serverless functions in `/api/`. `api/contact.ts` handles the enquiry form by sending email via Brevo (Sendinblue) SMTP API. Requires `BREVO_API_KEY` and `VITE_CONTACT_EMAIL` in the Vercel environment.

**Frontend env vars** (Vite prefix `VITE_`): `VITE_CONTACT_EMAIL`, `VITE_INSTAGRAM_URL`. Constants are re-exported from `src/lib/constants.ts`.

## Styling Conventions

- **Tailwind CSS** is the primary styling method — use utility classes directly in JSX.
- **CSS variables** for theming are defined in `src/index.css` under `:root`. Accent color is `#389494` (teal). Do not hardcode this color — reference `text-accent` or the CSS variable.
- **Fonts:** `Plus Jakarta Sans` for headings (`font-heading`), `Inter` for body (`font-body`).
- **`cn()` utility** from `src/lib/utils.ts` — always use this when merging conditional Tailwind classes (wraps `clsx` + `tailwind-merge`).
- **shadcn-ui** components live in `src/components/ui/`. These are Radix UI primitives styled with Tailwind and CVA. Extend these rather than creating raw HTML equivalents.
- **Framer-motion** is used for scroll-triggered entrance animations (`whileInView`, `viewport={{ once: true }}`). Follow this pattern for new animated sections.
- **Responsive breakpoints:** Mobile-first; use `sm:` and `lg:` prefixes. Grid layouts typically go `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.

## Component Patterns

- Section components are self-contained and imported directly into `pages/Index.tsx`.
- The contact modal state (`isContactModalOpen`) lives in `Index.tsx` and is passed down via the `onScheduleCall` callback prop.
- Form validation uses **Zod schemas** + manual `useState` (not react-hook-form) in `ContactFormModal.tsx` — follow this pattern for any new forms.
- `ProjectCard.tsx` uses a `ProjectStatus` enum for the `status` prop. Add new status values to the enum rather than using raw strings.
- Project preview images are imported from `src/assets/images/projects/` (not from `public/`).

## TypeScript

TypeScript is configured with loose checking (`noImplicitAny: false`, `strictNullChecks: false`). Don't tighten these settings. Path alias `@/*` maps to `src/*`.
