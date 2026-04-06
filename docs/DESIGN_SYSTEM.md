# SalesTracker — Design System

This document is the single source of truth for the design system used in the SalesTracker frontend.  
It covers semantic tokens, wrapper components, and the rules that govern their usage.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Semantic Tokens](#semantic-tokens)
   - [Colors](#colors)
   - [Typography](#typography)
   - [Spacing](#spacing)
   - [Border Radius](#border-radius)
   - [Animations](#animations)
3. [Dark Mode](#dark-mode)
4. [Wrapper Components](#wrapper-components)
   - [AppButton](#appbutton)
   - [ProgressCard](#progresscard)
   - [BadgeAchievement](#badgeachievement)
5. [Usage Rules](#usage-rules)
6. [Adding New Tokens or Components](#adding-new-tokens-or-components)

---

## Philosophy

> **Rules live in the system, not in every view.**

Raw Tailwind utilities (`bg-blue-500`, `text-sm`) are **not allowed** for anything covered by this design system. Every color, size, and interactive state must trace back to a semantic token or a wrapper component. This ensures:

- A single token change propagates everywhere.
- Dark mode works automatically via CSS variables.
- New contributors cannot accidentally introduce inconsistent colors or sizes.

---

## Semantic Tokens

Tokens are defined in two places that must stay in sync:

| Layer | File | Purpose |
|---|---|---|
| CSS variables | `src/index.css` | Actual values; swap light ↔ dark here |
| Tailwind aliases | `tailwind.config.js` | Maps CSS variables to utility class names |

### Colors

#### Brand

| Token | Tailwind class | Light value | Dark value | When to use |
|---|---|---|---|---|
| `brand-primary` | `bg-brand-primary`, `text-brand-primary`, `border-brand-primary` | `#2563EB` | `#60A5FA` | Primary actions, active states, links, progress fill |
| `brand-secondary` | `bg-brand-secondary`, `text-brand-secondary` | `#7C3AED` | `#A78BFA` | Secondary accents, unit-type badges |

#### Semantic feedback

| Token | Tailwind class | Light value | Dark value | When to use |
|---|---|---|---|---|
| `success-base` | `bg-success-base`, `text-success-base` | `#16A34A` | `#4ADE80` | Completed goals, unlocked achievements, positive values |
| `success-subtle` | `bg-success-subtle` | `#DCFCE7` | `#14532D` | Background tint for success states |
| `warning-base` | `bg-warning-base`, `text-warning-base` | `#D97706` | `#FCD34D` | Partial progress (50–79%), caution notices |
| `warning-subtle` | `bg-warning-subtle` | `#FEF3C7` | `#451A03` | Background tint for warning states |
| `error-base` | `bg-error-base`, `text-error-base` | `#DC2626` | `#F87171` | Validation errors, destructive actions |

> **Rule:** Never use `warning-base` for errors or `error-base` for warnings. The names describe intent, not just color.

#### Surface & Neutral

| Token | Tailwind class | Light value | Dark value | When to use |
|---|---|---|---|---|
| `surface` | `bg-surface` | `#FFFFFF` | `#1E293B` | Card and panel backgrounds |
| `neutral-100` | `bg-neutral-100`, `text-neutral-100` | `#F3F4F6` | `#0F172A` | Subtle backgrounds, skeleton loaders |
| `neutral-200` | `bg-neutral-200`, `border-neutral-200` | `#E5E7EB` | `#334155` | Borders, dividers, inactive tracks |
| `neutral-300` | `bg-neutral-300` | `#D1D5DB` | `#475569` | Disabled input borders |
| `neutral-400` | `text-neutral-400` | `#9CA3AF` | `#94A3B8` | Placeholder text, locked/inactive labels |
| `neutral-500` | `text-neutral-500` | `#6B7280` | `#CBD5E1` | Secondary text, captions, hints |
| `neutral-700` | `text-neutral-700` | `#374151` | `#E2E8F0` | Section headings, label text |
| `neutral-900` | `text-neutral-900` | `#111827` | `#F1F5F9` | Primary body text |

> **Rule:** The neutral scale is **inverted** in dark mode — `neutral-100` is the darkest shade, `neutral-900` is the lightest. Do **not** use `dark:` prefixed overrides for neutral colors; the CSS variables handle the inversion automatically.

---

### Typography

All type sizes are defined as Tailwind `fontSize` extensions with bundled `lineHeight` and `fontWeight`.  
Use the named scale — never `text-sm`, `text-lg`, or raw pixel values.

| Token | Class | Size | Line Height | Weight | When to use |
|---|---|---|---|---|---|
| Heading LG | `text-heading-lg` | 2rem | 2.5rem | 700 | Page-level titles (rare) |
| Heading MD | `text-heading-md` | 1.5rem | 2rem | 600 | Form titles, modal headings |
| Heading SM | `text-heading-sm` | 1.25rem | 1.75rem | 600 | Card headings, section titles |
| Body MD | `text-body-md` | 1rem | 1.5rem | 400 | Main content text, input values |
| Body SM | `text-body-sm` | 0.875rem | 1.25rem | 400 | Labels, list items, secondary content |
| Caption | `text-caption` | 0.75rem | 1rem | 400 | Dates, badges, tooltips, metadata |

> **Rule:** Do not mix type tokens with manual `font-semibold` overrides unless intentionally adding weight on top of a body token (e.g. a label that uses `text-body-sm font-semibold`).

---

### Spacing

The spacing scale is restricted to these steps. Do not use arbitrary values like `p-5`, `mt-7`, or `gap-9` — if a step is missing, add it to `tailwind.config.js`.

| Token | Value | Common usage |
|---|---|---|
| `1` | 0.25rem | Icon padding, tight gaps |
| `2` | 0.5rem | Inline gaps, small padding |
| `3` | 0.75rem | List item gaps |
| `4` | 1rem | Default inner padding, form gaps |
| `6` | 1.5rem | Card padding, section spacing |
| `8` | 2rem | Large section gaps |
| `10` | 2.5rem | — |
| `12` | 3rem | — |
| `16` | 4rem | Page-level vertical rhythm |
| `20` | 5rem | — |
| `24` | 6rem | Hero/page top padding |

---

### Border Radius

| Token | Class | Value | When to use |
|---|---|---|---|
| `sm` | `rounded-sm` | 4px | Inline badges, small pills |
| `md` | `rounded-md` | 8px | Inputs, buttons, small cards |
| `lg` | `rounded-lg` | 12px | Panels, modals, large cards |
| `full` | `rounded-full` | 9999px | Avatar circles, progress bars, toggle pills |

---

### Animations

| Token | Class | Duration | When to use |
|---|---|---|---|
| Slide up | `animate-slide-up` | 350ms, spring easing | Modals, drawers, panels entering from below |
| Fade in | `animate-fade-in` | 200ms, ease-out | Toast notifications, overlays fading in |

---

## Dark Mode

Dark mode is toggled by adding the `dark` class to `<html>` (managed by `ThemeContext`).  
All token values swap automatically via CSS variable redefinition in `.dark {}` — **no component code should need `dark:` prefixed classes** for anything covered by the token system.

The only exception is when you need to override a non-tokenized Tailwind utility (e.g. `dark:text-white` on a component that uses a hardcoded external library color).

---

## Wrapper Components

These components encapsulate all styling variants and internal logic. Consumers pass intent, not classes.

---

### AppButton

**File:** `src/components/AppButton.tsx`

The primary interactive element. Wraps `<button>` with consistent variant, size, loading, and disabled states.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual intent |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Physical size |
| `loading` | `boolean` | `false` | Shows "Loading…" text and disables the button |
| `disabled` | `boolean` | `false` | Native disabled state (also disables when `loading`) |
| `children` | `ReactNode` | — | Button label |
| `...rest` | `ButtonHTMLAttributes` | — | All native button props (`type`, `onClick`, etc.) |

#### Variants

| Variant | Background | Text | Use for |
|---|---|---|---|
| `primary` | `brand-primary` | white | Main CTAs: Save, Submit, Confirm |
| `secondary` | `brand-secondary` | white | Secondary CTAs: alternative actions |
| `ghost` | transparent | `brand-primary` | Cancel, Back, low-emphasis actions |
| `danger` | `error-base` | white | Destructive actions: Delete, Remove |

#### Sizes

| Size | Padding | Font token | Radius | Use for |
|---|---|---|---|---|
| `sm` | `px-3 py-1.5` | `text-body-sm` | `rounded-sm` | Inline actions inside cards/tables |
| `md` | `px-4 py-2` | `text-body-md` | `rounded-md` | Standard form buttons |
| `lg` | `px-6 py-3` | `text-heading-sm` | `rounded-md` | Hero / prominent CTA |

#### Usage examples

```tsx
// Standard form submit
<AppButton type="submit" variant="primary" loading={isLoading}>
  Save Sale
</AppButton>

// Inline card action
<AppButton variant="ghost" size="sm" onClick={handleCancel}>
  Cancel
</AppButton>

// Destructive
<AppButton variant="danger" onClick={handleDelete}>
  Delete Goal
</AppButton>
```

> **Rule:** Never add `bg-*` or `text-*` classes directly to `<button>`. Use `AppButton` with the appropriate `variant`. If no existing variant fits, add a new variant to `AppButton` rather than overriding in the view.

---

### ProgressCard

**File:** `src/components/ProgressCard.tsx`

Displays a single goal's progress: title, type badge, active/inactive status, date range, progress bar, and current/target values.

#### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✅ | Goal name |
| `current` | `number` | ✅ | Accumulated sales value |
| `target` | `number` | ✅ | Goal target value |
| `percentage` | `number` | ✅ | Pre-calculated `(current / target) × 100` |
| `type` | `'monetary' \| 'units'` | ✅ | Determines formatting and badge color |
| `unitLabel` | `string` | ✅ | Unit name (e.g. `"contracts"`, `"units"`) |
| `isActive` | `boolean` | ✅ | Shows Active/Inactive badge |
| `startDate` | `string` | — | ISO date `YYYY-MM-DD`; shown as range if both provided |
| `endDate` | `string` | — | ISO date `YYYY-MM-DD` |

#### Progress bar color rules (internal)

| Percentage | Color token | Meaning |
|---|---|---|
| ≥ 100% | `success-base` | Goal reached |
| 80–99% | `brand-primary` | On track |
| 50–79% | `warning-base` | Needs attention |
| < 50% | `neutral-400` | Behind |

#### Usage example

```tsx
<ProgressCard
  title="Monthly Revenue Goal"
  current={7500}
  target={10000}
  percentage={75}
  type="monetary"
  unitLabel="units"
  isActive={true}
  startDate="2026-04-01"
  endDate="2026-04-30"
/>
```

> **Rule:** `percentage` must be passed pre-calculated from the API — do not compute it in the view. The component clamps the bar at 100% internally but displays the real percentage in the label.

---

### BadgeAchievement

**File:** `src/components/BadgeAchievement.tsx`

Displays a single achievement badge with locked/unlocked state, icon, name, unlock date, and a hover tooltip with the description.

#### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Localized achievement name |
| `description` | `string` | ✅ | Localized description shown on hover |
| `icon` | `string` | ✅ | Emoji or icon string |
| `unlocked` | `boolean` | ✅ | Controls visual state |
| `achievedAt` | `string \| null` | — | ISO datetime; shown as formatted date when unlocked |

#### Visual states

| State | Border | Background | Text |
|---|---|---|---|
| Unlocked | `success-base` | `success-subtle` | `success-base` |
| Locked | `neutral-200` | `neutral-100` | `neutral-400` |

#### Usage example

```tsx
<BadgeAchievement
  name={t('achievements.names.goal_completed')}
  description={t('achievements.descriptions.goal_completed')}
  icon="🏆"
  unlocked={achievement.unlocked}
  achievedAt={achievement.achieved_at}
/>
```

> **Rule:** Always pass localized strings for `name` and `description` via `t()`. The component does not call `useTranslation` for these values — localization is the caller's responsibility.  
> **Rule:** Icons are managed in `src/constants/achievements.ts`. Add new icons there, do not hardcode them at call sites.

---

## Usage Rules

### What requires a token

✅ Always use a token for:
- Any color applied to text, background, or border
- Any font size or weight that represents hierarchy
- Any spacing value that creates layout rhythm
- Any border radius on interactive or card elements

❌ Never use:
- Raw Tailwind palette classes: `bg-blue-500`, `text-gray-300`, `red-600`
- Arbitrary values: `text-[13px]`, `p-[7px]`, `w-[420px]` (unless absolutely forced by an external constraint)
- Hardcoded hex values in JSX: `style={{ color: '#2563EB' }}`

---

### When to create a new wrapper component

Create a new wrapper component when **any two of these are true**:

1. The element appears in **3 or more places**
2. It has **2 or more visual variants** (state, size, type)
3. It contains **internal logic** (formatting, color thresholds, conditional rendering)
4. It would otherwise require **copying className strings** between files

If only one is true, a shared utility function or a simple extracted component without variants is sufficient.

---

### Adding a new token

1. Add the CSS variable to both `:root` and `.dark` in `src/index.css`
2. Add the Tailwind alias to `tailwind.config.js` under `theme.extend`
3. Document it in the table in this file with its intended usage

Do not introduce a new color by hardcoding a value in a component. If a new semantic need arises (e.g. `info-base`), add a token first.

---

### Adding a new achievement icon

Icons are centralized in `src/constants/achievements.ts`, keyed by achievement `id`. To add a new achievement icon:

```ts
// src/constants/achievements.ts
export const ACHIEVEMENT_ICONS: Record<number, string> = {
  1: '🏆',
  2: '⚡',
  3: '💰',
  4: '🌩️',
  5: '🆕', // new achievement
};
```

Do **not** pass the icon string directly at call sites — always look it up from this map.
