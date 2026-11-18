# Employee Web Application Skills

A curated suite of 39 developer and agent skills designed for building modern, accessible, and user-friendly web applications and employee portals.

## Overview

This repository provides pre-configured skill instructions and tools covering the full lifecycle of frontend web development:

- **UI & UX Design:** Layouts, aesthetic guidance, design reasoning, and design systems.
- **Frontend Architecture:** Modern React, Next.js, TypeScript, and clean component APIs.
- **Styling & Tokens:** Tailwind CSS patterns, design tokens, and scalable component compositions.
- **Motion & Micro-Interactions:** Smooth UI transitions, accessible animations, and responsive feedback.
- **Web Performance:** Core Web Vitals optimization, bundle reduction, and fast rendering.
- **Accessibility (A11y):** WCAG compliance, keyboard navigation, and screen reader readiness.
- **Testing & Verification:** Browser automation, DevTools inspection, and test suites.

## Repository Structure

```text
├── skills/                      # 39 specialized skills with SKILL.md specifications
│   ├── ui-ux-pro-max/           # UI styling and design reasoning intelligence
│   ├── frontend-design/         # Aesthetic direction and typography guidance
│   ├── frontend-ui-engineering/ # Architecture, state management, and accessibility
│   ├── design-system-tailwind/  # Tailwind token systems and component variants
│   ├── vercel-react-best-practices/ # Re-rendering, waterfall elimination, and optimization
│   └── ...                      # Additional motion, testing, and architecture skills
├── search.py                    # Local search CLI to find skills and design patterns
├── skills.json                  # Metadata catalog of all included skills
└── .gitignore                   # Standard workspace ignore rules
```

## Quick Start

### 1. Searching the Catalog

Use the bundled `search.py` script to explore skills by topic or category:

```bash
# List all skills by category
python search.py --list

# Search for specific capabilities (e.g., animation, responsive, forms)
python search.py "animation"

# Search UI design patterns
python search.py --uipro "dashboard" --domain style
```

### 2. Using with AI Coding Assistants

Each folder inside `skills/` contains a standard `SKILL.md` specification. Coding agents (such as Antigravity, Claude Code, Codex, or Cursor) can read these files to apply production-grade design and engineering standards to your code.

## License

This project is licensed under the MIT License.
