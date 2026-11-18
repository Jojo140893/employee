---
name: fast-animation-motion-graphics
description: >-
  Builds rapid kinetic typography, spring-damped micro-interactions, whip transitions, and glitch effects.
  Use when designing fast-paced motion design, tech commercials, and energetic product animations.
---

# Fast Animation & Motion Graphics Skill

Reference for snappy UI motion graphics, kinetic text, and transitions.

## Snappy Animation Timing Rules

- **Micro-interactions (badges, buttons, icons)**: 120ms – 240ms (4–8 frames @ 30fps).
- **Card entrances / Slide-ins**: 250ms – 400ms (8–12 frames @ 30fps).
- **Scene transitions**: 150ms – 300ms (5–10 frames @ 30fps).

## Spring Physics Presets (Remotion / CSS / Framer)

```tsx
// 1. Snappy / Pop (Badges, Buttons, Numbers)
const snappySpring = { damping: 10, mass: 0.4, stiffness: 180 };

// 2. Heavy / Cinematic (Cards, Windows, Hardware Mockups)
const heavySpring = { damping: 14, mass: 1.0, stiffness: 100 };

// 3. Elastic / Bouncy (Notifications, Icons)
const bounceSpring = { damping: 8, mass: 0.3, stiffness: 220 };
```

## Easing Curves

- **Aggressive Out (Recommended)**: `cubic-bezier(0.16, 1, 0.3, 1)` (easeOutExpo) — starts immediately at peak velocity and snaps into resting position.
- **Punchy In-Out**: `cubic-bezier(0.87, 0, 0.13, 1)` (easeInOutExpo).

## Whip-Pan & Flash Transition (FFmpeg)

```bash
# High-speed whip-pan horizontal motion blur
ffmpeg -i clip1.mp4 -i clip2.mp4 -filter_complex \
"[0:v]crop=iw:ih:0:0[v0];[1:v]crop=iw:ih:0:0[v1]; \
 [v0][v1]xfade=transition=wipeleft:duration=0.18:offset=4.82" \
whip_cut.mp4
```

