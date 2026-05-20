# AI Agent Instruction — Refactor Existing App Using Warm Parchment Typography System

## Objective

You are redesigning an already-built application.

Do NOT rebuild the app from scratch.

Your task is to refactor the existing UI layer only while preserving:

- current functionality
- business logic
- API integrations
- routing
- state management
- backend behavior
- database structure

Only modify:

- typography
- spacing
- color hierarchy
- buttons
- cards
- visual hierarchy
- component styling
- layout polish
- UI consistency

---

# Design Direction

The visual direction should feel:

- editorial
- warm parchment
- elegant minimalism
- refined reading experience
- calm and sophisticated
- modern vintage aesthetic

The UI should resemble:

- premium publishing platforms
- elegant documentation systems
- refined dashboards
- luxury editorial layouts

Avoid:

- neon colors
- sharp contrasts
- glassmorphism
- futuristic cyber UI
- excessive shadows
- cartoonish rounded UI
- bright gradients
- saturated colors

---

# 1. Global Design System

Implement the following global CSS variables.

```css
:root {
  /* Backgrounds */
  --bg: #e2dfd2;

  --card-primary: #f5f2ea;
  --card-linen: #ece9de;
  --card-sand: #d6d2c4;
  --card-ivory: #fff8ee;
  --card-clay: #c8bfaa;
  --card-dark: #3d3426;

  /* Typography */
  --h1: #2c2416;
  --h2: #3d3426;
  --h3: #5a4e3c;
  --h4: #6b5f4e;

  --lead: #5a4e3c;
  --body: #6b5f4e;

  --span: #7a6340;
  --link: #7a6340;

  --caption: #8a7f6e;
  --placeholder: #b0a494;

  /* Buttons */
  --btn-primary: #5a4e3c;
  --btn-primary-text: #f0ebe0;
  --btn-primary-hover: #3d3426;
  --btn-primary-active: #2c2416;

  --btn-accent: #7a6340;
  --btn-accent-text: #fff8ee;

  --btn-dark: #2c2416;
  --btn-dark-text: #e8dfc8;

  --btn-light: #f5f2ea;
  --btn-light-text: #3d3426;

  --btn-disabled: #c8bfaa;
  --btn-disabled-text: #a09080;

  --btn-danger: #8c3a2a;
  --btn-danger-text: #fce8e4;

  --btn-success: #4a6b3a;
  --btn-success-text: #eaf4e2;

  /* Borders */
  --border-subtle: rgba(0, 0, 0, 0.08);
  --border-mid: rgba(0, 0, 0, 0.13);
  --divider: rgba(0, 0, 0, 0.1);
}
```
