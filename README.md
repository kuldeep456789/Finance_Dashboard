# Finance Board

A responsive finance dashboard built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## What This Project Includes
- Dashboard cards and visual summaries
- Transactions page with filtering, searching, and sorting
- Insights page with charts and spending highlights
- Settings page with profile and preferences UI
- Mobile bottom navigation and desktop sidebar layout
- Theme support and role-based UI behavior (frontend simulation)

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4 + custom global CSS
- React Context API for shared state

## Project Structure
```text
src/
  app/
    layout.tsx
    globals.css
    page.tsx
    transactions/page.tsx
    insights/page.tsx
    settings/page.tsx
  components/
    AppLayoutHandler.tsx
    TopHeader.tsx
    Sidebar.tsx
    MobileNav.tsx
    BarChart.tsx
    PortfolioChart.tsx
    DoughnutChart.tsx
  context/
    ThemeContext.tsx
    RoleContext.tsx
    LayoutContext.tsx
    NotificationContext.tsx
```

## Getting Started
```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts
- `npm run dev` - Start local development server
- `npm run lint` - Run ESLint
- `npm run build` - Build for production

## Architecture Notes
- Global providers are configured in `src/app/layout.tsx`.
- App-level layout logic (header, sidebar, mobile nav) lives in `src/components/AppLayoutHandler.tsx`.
- Theme, layout, role, and toast state are managed through dedicated context files in `src/context`.
- Data shown in the dashboard is currently mock/static (no backend integration).
