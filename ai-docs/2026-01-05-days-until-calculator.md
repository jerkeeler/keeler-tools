# Days Until Calculator - Implementation Plan

## Overview

A tool that calculates and displays the time remaining until a selected date. Users can pick dates, optionally label them, and view recent date selections.

## Requirements

1. **Date picker** - Allow users to select a future date
2. **Display calculations:**
    - Days until the selected date
    - Weeks until (decimal)
    - Months until (decimal)
3. **Local storage:**
    - Store last 20 selected dates with timestamps
    - FIFO eviction when exceeding 20 entries
    - Each entry stores: date, label (optional), timestamp of selection
4. **Recent dates list:**
    - Show recently input dates
    - Click to re-select and display
    - Show label if one exists
5. **Optional label input:**
    - Text input for naming dates
    - Displayed alongside the countdown

## Technical Implementation

### Files to Create/Modify

1. **Create:** `src/pages/tools/days-until-calculator.astro`
2. **Modify:** `src/data/tools.ts` - Add tool registration
3. **Modify:** `public/sw.js` - Add to precache URLs, increment cache version

### Data Structure (localStorage)

```typescript
interface SavedDate {
    date: string; // ISO date string (YYYY-MM-DD)
    label?: string; // Optional user label
    savedAt: number; // Timestamp when saved
}

// Key: 'keeler-days-until-dates'
// Value: SavedDate[] (max 20, sorted by savedAt desc)
```

### UI Components

1. **Header** - Using ToolHeader component
2. **Main Card** - Contains:
    - Date picker input
    - Optional label input
    - "Calculate" button
    - Results display (days/weeks/months)
3. **Recent Dates Section** - List of clickable recent dates

### Calculation Logic

```javascript
// Days until
const diffTime = targetDate - today;
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// Weeks until (decimal, 1 decimal place)
const diffWeeks = (diffDays / 7).toFixed(1);

// Months until (approximation using 30.44 days/month)
const diffMonths = (diffDays / 30.44).toFixed(1);
```

### Edge Cases

- Past dates: Show "X days ago" (or disable selection)
- Today: Show "Today!" or "0 days"
- Invalid input: Graceful error handling
- Duplicate dates: Update existing entry's label and timestamp

## UI Design

Following existing patterns:

- `rounded-3xl` card with `border-slate-200`
- Brand colors for primary actions (`bg-brand`)
- Decorative radial gradients
- Responsive layout with `sm:` breakpoints

### Layout Structure

```
+------------------------------------------+
| ToolHeader (Days Until Calculator)       |
+------------------------------------------+
| Main Card                                |
| +--------------------------------------+ |
| | Date: [date picker]  Label: [input] | |
| | [Calculate Button]                   | |
| +--------------------------------------+ |
| | RESULTS                              | |
| | Days: 45                             | |
| | Weeks: 6.4                           | |
| | Months: 1.5                          | |
| | (Optional: Label display)            | |
| +--------------------------------------+ |
+------------------------------------------+
| Recent Dates                             |
| +--------------------------------------+ |
| | Jan 14, 2026 - "Birthday"   [click] | |
| | Feb 20, 2026                [click] | |
| | ...                                  | |
| +--------------------------------------+ |
+------------------------------------------+
```

## Implementation Steps

1. Create the Astro page with Layout and ToolHeader
2. Build the HTML structure for date input, label input, and results
3. Add recent dates section
4. Implement JavaScript logic:
    - Date calculations
    - localStorage management (save, load, evict)
    - Event handlers for form submission
    - Recent date click handlers
5. Style with Tailwind (matching existing tools)
6. Register in tools.ts
7. Update service worker cache

## Success Criteria

- [ ] Date picker allows date selection
- [ ] Days, weeks, months calculated correctly
- [ ] Results display clearly with proper formatting
- [ ] Label input works (optional)
- [ ] Recent dates persist in localStorage
- [ ] Maximum 20 dates stored (oldest evicted)
- [ ] Recent dates clickable to re-calculate
- [ ] Labels displayed when present
- [ ] Responsive design works on mobile
- [ ] Follows existing tool patterns

---

**Implementation Date:** January 5, 2026
**Status:** Planning Complete
