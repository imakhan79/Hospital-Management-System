# HIMS Design System & UI Specification

## 1. Design Tokens

### Colors
- **Primary (Sidebar):** Deep Medical Blue (`#006699` / HSL `201 100% 36%`)
- **Secondary:** Healthcare Cyan (`#1aa3ff`)
- **Backgrounds:**
  - App Background: Soft Gray (`#f8fafc`)
  - Surface/Card: Pure White (`#ffffff`)
  - Submenu Panel: White (`#ffffff`) with subtle shadow.
- **Status Colors (Pastels):**
  - Success (Completed): Emerald (`#f0fdf4` bg, `#10b981` text)
  - Info (Active/Queue): Blue (`#eff6ff` bg, `#3b82f6` text)
  - Warning (Urgent/Medium): Orange (`#fff7ed` bg, `#f97316` text)
  - Danger (Emergency/SLA Breach): Red (`#fef2f2` bg, `#ef4444` text)
  - Special (Gynecology): Purple (`#faf5ff` bg, `#a855f7` text)

### Typography
- **Primary Font:** Inter / SF Pro
- **Heading Font:** Poppins (for brand/module titles)
- **Scale:**
  - **Large Title:** 28px Semi-bold (Tracking -0.5px)
  - **Module Title:** 24px Bold
  - **Section Heading:** 18px Bold
  - **Body Text:** 14px Regular / 11px for Meta-labels (Bold uppercase)
  - **KPI Numbers:** 28px-32px Extra-bold

### Spacing & Layout
- **Base Grid:** 8px system
- **Padding:** 16px (Dense) to 24px (Comfortable)
- **Border Radius:**
  - **Cards:** 16px (`rounded-2xl`)
  - **Buttons/Inputs:** 12px (`rounded-xl`)
  - **Chips/Pills:** 9999px (`rounded-full`)

### Shadows
- **Soft Shadow:** `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **Side Panel Shadow (Right-cast):** `4px 0 24px rgba(0,0,0,0.02)`
- **Card Hover:** Elevation lift of 2px + Shadow increase.

---

## 2. Component Inventory (OPD)

### Sidebar (Column 1)
- Deep blue background.
- Left edge accent border on active items.
- Minimal iconography with high contrast white/blue-tint text.

### Submenu Panel (Column 2)
- Fixed width (72px scaled or 280px standard).
- White background.
- Left-accent border on active list items.
- Grouping of module-specific sub-routes.

### KPI Card
- Soft pastel background fill matching status.
- High-intensity number.
- Quantitative trend indicator or descriptive meta-label.

### Department Queue Card (Premium)
- Soft square background for department-specific icons.
- Large number for "In Queue".
- Live pulse indicator (Green dot).
- Action buttons disguised as ghost buttons until hover.

---

## 3. Experience & Interactions
- **Live Sync:** Dashboard updates automatically without full page reload.
- **Workflow Continuity:** A persistent top-bar (glassmorphism) appears when a patient is "active", guiding the staff to the next logical step (e.g., from Vitals to Queue).
- **Responsive:** 
  - Tablet: Sidebar collapses to icons.
  - Mobile: Bottom bar navigation for primary modules.

---

## 4. States
### Loading State
- Centered pulse animation (Medical cross or blue circle).
- Shimmer skeleton effects for cards.
### Empty State
- Centered illustration or icon (`Users` / `Activity`).
- Clear "No data" message with a "Retry/Sync" quick action.
### Error State
- Soft red background toast notification (`sonner`).
- Retain previous cached data if available.
