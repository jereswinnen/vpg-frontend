# VPG Website Build Prompt

This document provides a comprehensive guide for building the VPG website - a Next.js 16 public-facing site that consumes content from the Assymo admin CMS via its Content API.

## Project Overview

Build a **public-facing Next.js 16 website** for VPG that:
- Fetches all content from the Assymo Content API (`https://admin.assymo.be/api/content`)
- Mirrors the Assymo frontend architecture (sections-based page composition)
- Uses the same component library and styling patterns
- Does NOT include: chatbot, appointments, admin panel, or authentication

The site should be designed for easy theming (colors, typography, logo) via CSS variables.

---

## Phase 1: Project Setup & Configuration

> **Note:** Next.js is already initialized. This phase covers installing additional dependencies and configuration.

### 1.1 Install Dependencies

**Core UI & Components:**
```bash
pnpm add @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-tooltip
pnpm add lucide-react
pnpm add class-variance-authority clsx tailwind-merge
pnpm add motion
```

**Content & Styling:**
```bash
pnpm add dompurify
pnpm add -D @types/dompurify
pnpm add next-themes
pnpm add tw-animate-css
```

**Utilities:**
```bash
pnpm add zod
pnpm add sonner
pnpm add resend
```

**Analytics (optional):**
```bash
pnpm add @vercel/speed-insights
```

**Dev Dependencies:**
```bash
pnpm add -D vitest @testing-library/react @testing-library/dom jsdom @vitejs/plugin-react
```

### 1.2 Configure Tailwind CSS v4

Update `postcss.config.mjs`:
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

Create `src/app/globals.css` with the following structure:

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  /* ============================================
   * CUSTOMIZE THESE FOR VPG BRANDING
   * ============================================ */

  /* Primary accent colors - UPDATE FOR VPG */
  --c-accent-lightest: #ebf4f3;
  --c-accent-light: #22df90;
  --c-accent-dark: #1f3632;
  --c-accent-darkest: #1a2322;

  /* Layout */
  --u-site-w: 90vw;
  --u-grid-columns: 2;
  --u-grid-gap: 2rem;
  --radius: 0.625rem;

  @media (width >= 48rem) {
    --u-site-w: 70vw;
    --u-grid-columns: 9;
    --u-grid-gap: 4rem;
  }

  /* OKLch Color Scale (Tailwind v4) */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0 0);
  --color-secondary-foreground: oklch(0.205 0 0);
  --color-muted: oklch(0.97 0 0);
  --color-muted-foreground: oklch(0.556 0 0);
  --color-accent: oklch(0.97 0 0);
  --color-accent-foreground: oklch(0.205 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: oklch(0.577 0.245 27.325);
  --color-border: oklch(0.922 0 0);
  --color-input: oklch(0.922 0 0);
  --color-ring: oklch(0.708 0 0);
}

/* Grid System */
.o-grid {
  display: grid;
  width: var(--u-site-w);
  max-width: 100rem;
  margin-inline: auto;
  grid-template-columns: repeat(var(--u-grid-columns), 1fr);
  gap: var(--u-grid-gap);
}

.o-grid--bleed {
  width: 100%;
  max-width: none;
  padding-inline: calc((100vw - var(--u-site-w)) / 2);
}

/* Base Typography */
html {
  font-size: 1.125rem;
  line-height: 1.5;
  text-wrap: pretty;
}

h1 {
  font-size: 2.4rem;
  font-weight: 520;
  line-height: 1.2;
  text-wrap: balance;
}

h2 {
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.2;
  text-wrap: balance;
}

@media (width >= 48rem) {
  h1 { font-size: 3rem; }
  h2 { font-size: 2.35rem; }
}

/* Prose styling for rich text */
.prose {
  h2 { margin-block: 1.5em 0.5em; }
  h3 { margin-block: 1.25em 0.5em; }
  p { margin-block: 0.75em; }
  ul, ol { margin-block: 0.75em; padding-inline-start: 1.5em; }
  li { margin-block: 0.25em; }
  a { text-decoration: underline; text-underline-offset: 2px; }
  a:hover { text-decoration-thickness: 2px; }
}
```

### 1.3 Configure Font

In `src/app/layout.tsx`, set up Google Fonts:

```typescript
import { Instrument_Sans } from "next/font/google";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Apply: className={instrumentSans.variable}
```

### 1.4 Environment Variables

Create `.env.local`:
```bash
# Content API (Assymo Admin)
CONTENT_API_URL=https://admin.assymo.be/api/content
SITE_SLUG=vpg

# Email (for contact form) - VPG's own Resend account
# You'll need to set up a Resend account for VPG and verify the vpg.be domain
RESEND_API_KEY=your_vpg_resend_api_key
CONTACT_EMAIL=info@vpg.be
```

---

## Phase 2: Core Utilities & Types

### 2.1 Create Utility Functions

Create `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create `src/lib/format.ts`:
```typescript
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
```

### 2.2 Create Content Types

Create `src/types/content.ts`:
```typescript
export interface ContentImage {
  url: string;
  alt?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  is_homepage?: boolean;
  header_image?: ContentImage;
  sections: Section[];
  meta_title?: string;
  meta_description?: string;
}

export interface Solution {
  id: string;
  name: string;
  subtitle?: string;
  slug: string;
  header_image?: ContentImage;
  sections?: Section[];
  filters?: SolutionFilter[];
  order_rank?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface SolutionListItem {
  id: string;
  name: string;
  subtitle?: string;
  slug: string;
  header_image?: ContentImage;
  order_rank?: number;
  filters?: SolutionFilter[];
}

export interface SolutionFilter {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export interface FilterCategory {
  id: string;
  name: string;
  slug: string;
  order_rank: number;
  filters: Filter[];
}

export interface Filter {
  id: string;
  name: string;
  slug: string;
}

export interface NavigationLink {
  id: string;
  label: string;
  url: string;
  location: "header" | "footer";
  order_rank: number;
  sub_items?: NavigationSubItem[];
}

export interface NavigationSubItem {
  id: string;
  solution?: {
    name: string;
    slug: string;
    header_image?: ContentImage;
  };
}

export interface SiteParameters {
  id: string;
  site_id: string;
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  vat_number?: string;
}
```

### 2.3 Create Section Types

Create `src/types/sections.ts`:
```typescript
export type SectionType =
  | "pageHeader"
  | "slideshow"
  | "splitSection"
  | "uspSection"
  | "solutionsScroller"
  | "flexibleSection";

export interface BaseSection {
  _key: string;
  _type: SectionType;
}

export interface PageHeaderSection extends BaseSection {
  _type: "pageHeader";
  title?: string;
  subtitle?: string;
  buttons?: ActionButton[];
  image?: { url: string; alt?: string };
}

export interface SlideshowSection extends BaseSection {
  _type: "slideshow";
  slides: Array<{
    image: { url: string; alt?: string };
    caption?: string;
  }>;
}

export interface SplitSection extends BaseSection {
  _type: "splitSection";
  blockLeft: SplitBlock;
  blockRight: SplitBlock;
}

export interface SplitBlock {
  type: "text" | "image" | "empty";
  title?: string;
  subtitle?: string;
  actions?: ActionButton[];
  images?: Array<{ url: string; alt?: string }>;
}

export interface UspSection extends BaseSection {
  _type: "uspSection";
  items: UspItem[];
}

export interface UspItem {
  icon?: string;
  title: string;
  description?: string;
}

export interface SolutionsScrollerSection extends BaseSection {
  _type: "solutionsScroller";
  title?: string;
  filterCategoryId?: string;
  filterSlug?: string;
}

export interface FlexibleSection extends BaseSection {
  _type: "flexibleSection";
  layout: "1-col" | "2-col-equal" | "2-col-left-wide" | "2-col-right-wide";
  blockMain: FlexBlock;
  blockLeft?: FlexBlock;
  blockRight?: FlexBlock;
}

export interface FlexBlock {
  type: "text" | "image" | "map" | "form";
  title?: string;
  content?: string;
  button?: ActionButton;
  image?: { url: string; alt?: string };
}

export interface ActionButton {
  label: string;
  url?: string;
  icon?: string;
  variant?: "primary" | "secondary";
  action?: "openChatbot" | "link";
}

export type Section =
  | PageHeaderSection
  | SlideshowSection
  | SplitSection
  | UspSection
  | SolutionsScrollerSection
  | FlexibleSection;

export function getSectionLabel(type: SectionType): string {
  const labels: Record<SectionType, string> = {
    pageHeader: "Page Header",
    slideshow: "Slideshow",
    splitSection: "Split Section",
    uspSection: "USP Section",
    solutionsScroller: "Solutions Scroller",
    flexibleSection: "Flexible Section",
  };
  return labels[type];
}
```

### 2.4 Create Icon Configuration

Create `src/lib/icons.ts`:
```typescript
import {
  ArrowRightIcon,
  Calendar1Icon,
  DownloadIcon,
  EyeIcon,
  HardHatIcon,
  InfoIcon,
  LeafIcon,
  ListTreeIcon,
  MailIcon,
  PhoneIcon,
  RulerDimensionLineIcon,
  WarehouseIcon,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  arrow: ArrowRightIcon,
  calendar: Calendar1Icon,
  download: DownloadIcon,
  eye: EyeIcon,
  hardhat: HardHatIcon,
  info: InfoIcon,
  leaf: LeafIcon,
  list: ListTreeIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  ruler: RulerDimensionLineIcon,
  warehouse: WarehouseIcon,
};

export const iconOptions = Object.entries(iconMap).map(([key]) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1),
}));

export function getIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] || null;
}
```

---

## Phase 3: Content API Client

### 3.1 Create Content Fetching Library

Create `src/lib/content.ts`:
```typescript
import type {
  Page,
  Solution,
  SolutionListItem,
  FilterCategory,
  NavigationLink,
  SiteParameters,
} from "@/types/content";

const API_BASE = process.env.CONTENT_API_URL || "https://admin.assymo.be/api/content";
const SITE = process.env.SITE_SLUG || "vpg";

// Cache configuration for Next.js
const CACHE_OPTIONS = {
  next: { revalidate: 3600 }, // 1 hour
};

async function fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  const searchParams = new URLSearchParams({ site: SITE, ...params });
  const url = `${API_BASE}${endpoint}?${searchParams}`;

  try {
    const res = await fetch(url, CACHE_OPTIONS);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

// Pages
export async function getHomepage(): Promise<Page | null> {
  const data = await fetchAPI<{ page: Page }>("/homepage");
  return data?.page || null;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const data = await fetchAPI<{ page: Page }>("/page", { slug });
  return data?.page || null;
}

// Solutions
export async function getAllSolutions(): Promise<SolutionListItem[]> {
  const data = await fetchAPI<{ solutions: SolutionListItem[] }>("/solutions");
  return data?.solutions || [];
}

export async function getSolutionBySlug(slug: string): Promise<Solution | null> {
  const data = await fetchAPI<{ solution: Solution }>("/solutions", { slug });
  return data?.solution || null;
}

// Navigation & Filters
export async function getNavigation(location: "header" | "footer"): Promise<NavigationLink[]> {
  const data = await fetchAPI<{ navigation: NavigationLink[] }>("/navigation", { location });
  return data?.navigation || [];
}

export async function getFilterCategories(): Promise<FilterCategory[]> {
  const data = await fetchAPI<{ categories: FilterCategory[] }>("/filters");
  return data?.categories || [];
}

// Site Parameters
export async function getSiteParameters(): Promise<SiteParameters | null> {
  const data = await fetchAPI<{ parameters: SiteParameters }>("/parameters");
  return data?.parameters || null;
}
```

---

## Phase 4: UI Components

### 4.1 Create Base UI Components

Create the following components in `src/components/ui/`. These are Radix UI primitives styled with Tailwind:

**`src/components/ui/button.tsx`:**
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Create similar components for:**
- `src/components/ui/input.tsx` - Text input
- `src/components/ui/textarea.tsx` - Multiline input
- `src/components/ui/select.tsx` - Radix Select
- `src/components/ui/checkbox.tsx` - Radix Checkbox
- `src/components/ui/popover.tsx` - Radix Popover
- `src/components/ui/dialog.tsx` - Radix Dialog
- `src/components/ui/separator.tsx` - Radix Separator
- `src/components/ui/card.tsx` - Card container
- `src/components/ui/badge.tsx` - Badge/tag
- `src/components/ui/spinner.tsx` - Loading spinner

### 4.2 Create Shared Components

**`src/components/shared/Action.tsx`:**
```typescript
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import type { ActionButton } from "@/types/sections";

interface ActionProps {
  action: ActionButton;
  className?: string;
}

export function Action({ action, className }: ActionProps) {
  const Icon = getIcon(action.icon);
  const isPrimary = action.variant !== "secondary";

  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors",
    isPrimary
      ? "bg-[var(--c-accent-light)] text-[var(--c-accent-dark)] hover:bg-[var(--c-accent-light)]/90"
      : "bg-stone-200 text-stone-800 hover:bg-stone-300",
    className
  );

  // Skip chatbot actions for VPG (no chatbot)
  if (action.action === "openChatbot") {
    return null;
  }

  return (
    <Link href={action.url || "#"} className={classes}>
      {action.label}
      {Icon && <Icon className="size-5" />}
    </Link>
  );
}
```

**`src/components/shared/RichText.tsx`:**
```typescript
"use client";

import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

interface RichTextProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextProps) {
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      className={cn("prose", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
```

**`src/components/shared/SectionRenderer.tsx`:**
```typescript
import type { Section } from "@/types/sections";
import { PageHeader } from "@/components/sections/PageHeader";
import { SlideshowSection } from "@/components/sections/SlideshowSection";
import { SplitSection } from "@/components/sections/SplitSection";
import { UspSection } from "@/components/sections/UspSection";
import { SolutionsScroller } from "@/components/sections/SolutionsScroller";
import { FlexibleSection } from "@/components/sections/FlexibleSection";

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "pageHeader":
            return <PageHeader key={section._key} section={section} />;
          case "slideshow":
            return <SlideshowSection key={section._key} section={section} />;
          case "splitSection":
            return <SplitSection key={section._key} section={section} />;
          case "uspSection":
            return <UspSection key={section._key} section={section} />;
          case "solutionsScroller":
            return <SolutionsScroller key={section._key} section={section} />;
          case "flexibleSection":
            return <FlexibleSection key={section._key} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
```

---

## Phase 5: Section Components

Create each section component in `src/components/sections/`:

### 5.1 PageHeader

**`src/components/sections/PageHeader.tsx`:**
```typescript
import Image from "next/image";
import { Action } from "@/components/shared/Action";
import { RichText } from "@/components/shared/RichText";
import type { PageHeaderSection } from "@/types/sections";

interface PageHeaderProps {
  section: PageHeaderSection;
}

export function PageHeader({ section }: PageHeaderProps) {
  return (
    <section className="o-grid o-grid--bleed bg-[var(--c-accent-dark)] py-16 text-white md:py-24">
      <div className="col-span-full grid grid-cols-subgrid items-center gap-y-8">
        <div className="col-span-full md:col-span-4">
          {section.title && <h1>{section.title}</h1>}
          {section.subtitle && (
            <RichText html={section.subtitle} className="mt-4 text-white/80" />
          )}
          {section.buttons && section.buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {section.buttons.map((button, i) => (
                <Action key={i} action={button} />
              ))}
            </div>
          )}
        </div>
        {section.image?.url && (
          <div className="col-span-full md:col-span-5">
            <Image
              src={section.image.url}
              alt={section.image.alt || ""}
              width={800}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
```

### 5.2 Create Remaining Section Components

Create similar components for:
- `SlideshowSection.tsx` - Image carousel with captions
- `SplitSection.tsx` - Two-column layout with text/images
- `UspSection.tsx` - Grid of USP items with icons
- `SolutionsScroller.tsx` - Horizontal solution cards carousel
- `FlexibleSection.tsx` - Flexible grid with text/image/map/form blocks

Each should follow the pattern of receiving a typed section prop and rendering the appropriate content using the grid system.

---

## Phase 6: Layout Components

### 6.1 Header Component

**`src/components/layout/Header.tsx`:**
```typescript
import Link from "next/link";
import Image from "next/image";
import { getNavigation, getSiteParameters } from "@/lib/content";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const [navigation, parameters] = await Promise.all([
    getNavigation("header"),
    getSiteParameters(),
  ]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="o-grid py-4">
        <div className="col-span-full flex items-center justify-between">
          <Link href="/">
            {/* TODO: Add VPG logo */}
            <span className="text-xl font-bold">VPG</span>
          </Link>
          <HeaderClient navigation={navigation} parameters={parameters} />
        </div>
      </div>
    </header>
  );
}
```

**`src/components/layout/HeaderClient.tsx`:**
```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { NavigationLink, SiteParameters } from "@/types/content";

interface HeaderClientProps {
  navigation: NavigationLink[];
  parameters: SiteParameters | null;
}

export function HeaderClient({ navigation }: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-8 md:flex">
        {navigation.map((item) => (
          <div key={item.id} className="group relative">
            <Link
              href={item.url}
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              {item.label}
            </Link>
            {item.sub_items && item.sub_items.length > 0 && (
              <div className="invisible absolute left-0 top-full z-50 min-w-64 rounded-lg bg-white p-4 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <div className="grid gap-2">
                  {item.sub_items.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={`/realisaties/${subItem.solution?.slug}`}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100"
                    >
                      {subItem.solution?.header_image?.url && (
                        <Image
                          src={subItem.solution.header_image.url}
                          alt={subItem.solution.header_image.alt || ""}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      )}
                      <span>{subItem.solution?.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white md:hidden">
          <nav className="flex flex-col p-4">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="border-b py-4 text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
```

### 6.2 Footer Component

**`src/components/layout/Footer.tsx`:**
```typescript
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { getNavigation, getSiteParameters } from "@/lib/content";

export async function Footer() {
  const [navigation, parameters] = await Promise.all([
    getNavigation("footer"),
    getSiteParameters(),
  ]);

  return (
    <footer className="bg-[var(--c-accent-dark)] py-16 text-white">
      <div className="o-grid">
        <div className="col-span-full grid gap-12 md:grid-cols-3">
          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-semibold">Navigatie</h3>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="text-white/70 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          {parameters && (
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <div className="flex flex-col gap-3 text-white/70">
                {parameters.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 size-4 shrink-0" />
                    <span>{parameters.address}</span>
                  </div>
                )}
                {parameters.phone && (
                  <a href={`tel:${parameters.phone}`} className="flex items-center gap-2 hover:text-white">
                    <Phone className="size-4" />
                    <span>{parameters.phone}</span>
                  </a>
                )}
                {parameters.email && (
                  <a href={`mailto:${parameters.email}`} className="flex items-center gap-2 hover:text-white">
                    <Mail className="size-4" />
                    <span>{parameters.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Juridisch</h3>
            {parameters?.vat_number && (
              <p className="text-white/70">BTW: {parameters.vat_number}</p>
            )}
          </div>
        </div>

        <div className="col-span-full mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} VPG. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}
```

---

## Phase 7: Page Routes

### 7.1 Root Layout

**`src/app/layout.tsx`:**
```typescript
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VPG",
  description: "VPG - Your trusted partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={instrumentSans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
```

### 7.2 Homepage

**`src/app/page.tsx`:**
```typescript
import { notFound } from "next/navigation";
import { getHomepage } from "@/lib/content";
import { SectionRenderer } from "@/components/shared/SectionRenderer";

export default async function HomePage() {
  const page = await getHomepage();

  if (!page) {
    notFound();
  }

  return <SectionRenderer sections={page.sections} />;
}
```

### 7.3 Dynamic Page Route

**`src/app/[slug]/page.tsx`:**
```typescript
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { SectionRenderer } from "@/components/shared/SectionRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <SectionRenderer sections={page.sections} />;
}
```

### 7.4 Solutions Grid Page

**`src/app/realisaties/page.tsx`:**
```typescript
import { getAllSolutions, getFilterCategories } from "@/lib/content";
import { ProjectsGrid } from "@/components/shared/ProjectsGrid";
import { FilterBar } from "@/components/forms/FilterBar";

export default async function RealisatiesPage() {
  const [solutions, filterCategories] = await Promise.all([
    getAllSolutions(),
    getFilterCategories(),
  ]);

  return (
    <div className="py-16">
      <div className="o-grid">
        <div className="col-span-full">
          <h1 className="mb-8">Realisaties</h1>
          <FilterBar categories={filterCategories} />
          <ProjectsGrid solutions={solutions} categories={filterCategories} />
        </div>
      </div>
    </div>
  );
}
```

### 7.5 Solution Detail Page

**`src/app/realisaties/[slug]/page.tsx`:**
```typescript
import { notFound } from "next/navigation";
import { getSolutionBySlug } from "@/lib/content";
import { SectionRenderer } from "@/components/shared/SectionRenderer";

interface SolutionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  return (
    <>
      {solution.sections && <SectionRenderer sections={solution.sections} />}
    </>
  );
}
```

### 7.6 Contact Page

**`src/app/contact/page.tsx`:**
```typescript
import { getPageBySlug } from "@/lib/content";
import { SectionRenderer } from "@/components/shared/SectionRenderer";
import { ContactForm } from "@/components/forms/ContactForm";

export default async function ContactPage() {
  const page = await getPageBySlug("contact");

  return (
    <>
      {page?.sections && <SectionRenderer sections={page.sections} />}
      <div className="o-grid py-16">
        <div className="col-span-full md:col-span-6">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
```

---

## Phase 8: Forms & Filtering

### 8.1 Contact Form

**`src/components/forms/ContactForm.tsx`:**
```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Bericht verzonden!");
        e.currentTarget.reset();
      } else {
        toast.error("Er ging iets mis. Probeer opnieuw.");
      }
    } catch {
      toast.error("Er ging iets mis. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Naam
        </label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          E-mail
        </label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Bericht
        </label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Verzenden..." : "Versturen"}
      </Button>
    </form>
  );
}
```

### 8.2 Filter Bar

**`src/components/forms/FilterBar.tsx`:**
```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { FilterCategory } from "@/types/content";

interface FilterBarProps {
  categories: FilterCategory[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function getActiveFilters(categorySlug: string): string[] {
    const value = searchParams.get(categorySlug);
    return value ? value.split(",") : [];
  }

  function toggleFilter(categorySlug: string, filterSlug: string) {
    const params = new URLSearchParams(searchParams);
    const active = getActiveFilters(categorySlug);

    if (active.includes(filterSlug)) {
      const updated = active.filter((f) => f !== filterSlug);
      if (updated.length === 0) {
        params.delete(categorySlug);
      } else {
        params.set(categorySlug, updated.join(","));
      }
    } else {
      params.set(categorySlug, [...active, filterSlug].join(","));
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = getActiveFilters(category.slug);
        return (
          <Popover key={category.id}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                {category.name}
                {active.length > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {active.length}
                  </span>
                )}
                <ChevronDown className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              {category.filters.map((filter) => {
                const isActive = active.includes(filter.slug);
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(category.slug, filter.slug)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent",
                      isActive && "font-medium"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        isActive && "border-primary bg-primary text-primary-foreground"
                      )}
                    >
                      {isActive && <Check className="size-3" />}
                    </span>
                    {filter.name}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
```

### 8.3 Projects Grid

**`src/components/shared/ProjectsGrid.tsx`:**
```typescript
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { SolutionListItem, FilterCategory } from "@/types/content";

interface ProjectsGridProps {
  solutions: SolutionListItem[];
  categories: FilterCategory[];
}

export function ProjectsGrid({ solutions, categories }: ProjectsGridProps) {
  const searchParams = useSearchParams();

  // Build active filters map
  const activeFilters: Record<string, string[]> = {};
  categories.forEach((cat) => {
    const value = searchParams.get(cat.slug);
    if (value) {
      activeFilters[cat.id] = value.split(",");
    }
  });

  // Filter solutions
  const filtered = solutions.filter((solution) => {
    // Must match ALL categories (AND between categories)
    return Object.entries(activeFilters).every(([categoryId, filterSlugs]) => {
      // Must match ANY filter in category (OR within category)
      const solutionFiltersInCategory = solution.filters?.filter(
        (f) => f.category_id === categoryId
      );
      return solutionFiltersInCategory?.some((f) =>
        filterSlugs.includes(f.slug)
      );
    });
  });

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Geen realisaties gevonden met de huidige filters.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((solution) => (
        <Link
          key={solution.id}
          href={`/realisaties/${solution.slug}`}
          className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          {solution.header_image?.url && (
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={solution.header_image.url}
                alt={solution.header_image.alt || solution.name}
                width={400}
                height={300}
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold">{solution.name}</h3>
            {solution.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {solution.subtitle}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
```

---

## Phase 9: API Routes

### 9.1 Contact Form API

> **Note:** This requires VPG's own Resend account with the `vpg.be` domain verified. The `RESEND_API_KEY` environment variable should use VPG's API key, not Assymo's.

**`src/app/api/contact/route.ts`:**
```typescript
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "VPG Website <noreply@vpg.be>",
      to: process.env.CONTACT_EMAIL || "info@vpg.be",
      subject: `Nieuw contactformulier bericht van ${name}`,
      text: `Naam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

---

## Phase 10: Testing & Polish

### 10.1 Configure Vitest

**`vitest.config.ts`:**
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 10.2 Add Test Scripts

Update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "pnpm test --run && next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:run": "vitest --run"
  }
}
```

### 10.3 Write Basic Tests

Create tests for utility functions and key components following the patterns in the Assymo frontend.

---

## Phase 11: Deployment

### 11.1 Vercel Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `CONTENT_API_URL` - Assymo Content API URL
   - `SITE_SLUG` - `vpg`
   - `RESEND_API_KEY` - VPG's own Resend API key (requires vpg.be domain verification)
   - `CONTACT_EMAIL` - Where contact form submissions go

### 11.2 Domain Configuration

Configure the VPG domain in Vercel and update CORS settings on the Assymo Content API if needed.

---

## Summary Checklist

- [ ] **Phase 1**: Project setup with all dependencies
- [ ] **Phase 2**: Utils, types, and icon configuration
- [ ] **Phase 3**: Content API client
- [ ] **Phase 4**: UI components (Button, Input, Popover, etc.)
- [ ] **Phase 5**: Section components (PageHeader, SplitSection, etc.)
- [ ] **Phase 6**: Layout components (Header, Footer)
- [ ] **Phase 7**: Page routes (Home, Pages, Realisaties)
- [ ] **Phase 8**: Forms and filtering
- [ ] **Phase 9**: API routes (Contact form)
- [ ] **Phase 10**: Testing setup
- [ ] **Phase 11**: Deployment

## Notes for Implementation

1. **Skip chatbot-related code**: Any `openChatbot` actions should be hidden or converted to contact page links
2. **Image optimization**: Use Next.js Image component with appropriate sizes
3. **Error handling**: Add proper error boundaries and 404 pages
4. **SEO**: Implement metadata using `generateMetadata` functions
5. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
6. **Performance**: Use React Server Components where possible

---

## Content API Reference

See `/docs/CONTENT-API.md` for the complete API documentation. Key endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /homepage?site=vpg` | Homepage content |
| `GET /page?slug=about&site=vpg` | Page by slug |
| `GET /solutions?site=vpg` | All solutions |
| `GET /solutions?slug=name&site=vpg` | Single solution |
| `GET /filters?site=vpg` | Filter categories |
| `GET /navigation?location=header&site=vpg` | Navigation links |
| `GET /parameters?site=vpg` | Site parameters |
