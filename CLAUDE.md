# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VPG Frontend is a Next.js 16 public-facing website that consumes content from the Assymo admin CMS via its Content API. It's a headless CMS consumer site - all content (pages, solutions/projects, navigation, site parameters) is fetched from `admin.assymo.be/api/content`.

## Commands

```bash
pnpm dev          # Start dev server on port 3001 (uses Turbopack)
pnpm build        # Run tests then build (tests must pass)
pnpm lint         # Run ESLint
pnpm test         # Run Vitest in watch mode
pnpm test:run     # Run tests once (used in build)
```

## Architecture

### Content Flow
- All content is fetched server-side from `lib/content.ts` using the Content API
- The API base URL auto-detects: localhost:3000 in dev, assymo.be in production
- Site slug is configured via `SITE_SLUG` env var (defaults to "vpg")
- Data is cached for 1 hour via Next.js fetch cache

### Section-Based Page Composition
Pages are composed of sections defined in the CMS. The `SectionRenderer` component (`components/shared/SectionRenderer.tsx`) maps section `_type` to components:
- `pageHeader` → `PageHeader`
- `slideshow` → `SlideshowSection`
- `splitSection` → `SplitSection`
- `uspSection` → `UspSection`
- `solutionsScroller` → `SolutionsScroller`
- `flexibleSection` → `FlexibleSection`

### Layout Grid System
Uses CSS custom properties for a responsive grid (`app/globals.css`):
- Mobile: 2 columns, 90vw width
- Desktop (≥46em): 9 columns, 75vw width
- Grid class: `o-grid` with `grid-cols-subgrid` on children

### Theming
Brand colors via CSS variables in `:root`:
- `--c-accent-light` / `--c-accent-dark` / `--c-accent-lightest` / `--c-accent-darkest`
- UI colors use OKLch color scale (Tailwind v4 pattern)

## Key Files

- `lib/content.ts` - Content API client with all fetch functions
- `types/content.ts` - Types for pages, solutions, navigation, filters
- `types/sections.ts` - Section type definitions
- `components/shared/SectionRenderer.tsx` - Maps section types to components
- `components/layout/Header.tsx` / `Footer.tsx` - Server components that fetch navigation
- `app/globals.css` - Grid system, theme variables, typography

## Routes

- `/` - Homepage (fetches via `getHomepage()`)
- `/[slug]` - Dynamic pages (fetches via `getPageBySlug()`)
- `/realisaties` - Projects grid with filtering
- `/realisaties/[slug]` - Individual project detail
- `/contact` - Contact page with form
- `/api/contact` - Contact form submission (uses Resend)

## Environment Variables

```bash
CONTENT_API_URL=    # Override API URL (auto-detects if not set)
SITE_SLUG=vpg       # Site identifier for Content API
RESEND_API_KEY=     # For contact form emails
CONTACT_EMAIL=      # Recipient for contact form
```

## Conventions

- Dutch language for UI text ("Realisaties", "Bericht verzonden")
- Uses Instrument Sans font via next/font
- Radix UI primitives for interactive components
- Motion library for animations (not Framer Motion)
- `cn()` utility for className merging (clsx + tailwind-merge)

## Git Commits

Use conventional commit prefixes:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks, dependencies
- `refactor:` - Code restructuring without behavior change
- `style:` - Formatting, whitespace
- `test:` - Adding or updating tests
- `perf:` - Performance improvements
