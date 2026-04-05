Build a Sales Goals Tracking Module where a promoter can:
• Authenticate and log in
• Record their daily sales
• View their progress toward the monthly goal
• See unlocked recognitions after surpassing key milestones: 50%, 80%, 100%

# Deliverables:
## API with at least 3 endpoints:
POST /ventas Register a sale
GET /progreso/:userId Get current progress, goal, and unlocked achievements
GET /ventas/:userId User sales history

API requirements:
• Explicit error handling — not just a generic 500
• Separation of responsibilities in the project structure
• Real business logic: progress percentage calculation and automatic milestone triggering
• In-memory database or SQLite — what matters is the logic, not the engine

## Frontend connected to API
Build the interface by consuming the endpoints you implemented. Hardcoded mock data is not accepted.

Required screens:
• Promoter dashboard — progress toward the goal, daily sales, and unlocked milestones as a visual component within this same view
• Sales registration form

Choose the library you prefer (HeroUI, Shadcn, Radix, Material, Ant Design, or another) and configure it as if it were Cody's design system.

Define tokens with proper semantic names in your configuration file:
• Colors: brand-primary, success-subtle, warning-base — not blue-500
• Typography: named scale (text-heading-lg, text-body-md)
• Spacing and border radii consistent across the project

### 4b. Wrapper components
Create at least 2 components that encapsulate your system variants:

// Not a design system
<Button color="primary" size="md" radius="sm" className="font-semibold">

// This is a design system
<AppButton variant="primary" /> // rules live here, not in every view

Component suggestions: AppButton and ProgressCard or BadgeAchievement.

### Format
+-- backend/
+-- frontend/
+-- docs/

## Notes
Project must be deployed to a URL (Vercel, Netlify, Railway, Render, or similar)

Frontend preferences: React with TypeScript, also have experience with Redux
database experience: Mysql