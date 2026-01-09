# Anime.js V4 - Comprehensive Documentation

## Overview

Anime.js V4 is a fast, multipurpose, and lightweight JavaScript animation library with a simple yet powerful API. It works with CSS properties, SVG, DOM attributes, and JavaScript Objects.

**Latest Version:** v4.2.2 (October 7, 2024)
**Major V4 Release:** v4.0.2 (April 24, 2024)
**License:** MIT
**Official Documentation:** https://animejs.com/documentation
**Repository:** https://github.com/juliangarnier/anime

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Breaking Changes from V3](#breaking-changes-from-v3)
3. [Migration Guide](#migration-guide)
4. [New Features in V4](#new-features-in-v4)
5. [Core API Reference](#core-api-reference)
6. [Release History](#release-history)
7. [Advanced Features](#advanced-features)

---

## Getting Started

### Installation

```bash
npm install animejs
```

### Basic Import and Usage

```javascript
import {
  animate,
  stagger,
} from 'animejs';

animate('.square', {
  x: 320,
  rotate: { from: -180 },
  duration: 1250,
  delay: stagger(65, { from: 'center' }),
  ease: 'inOutQuint',
  loop: true,
  alternate: true
});
```

### Modular Imports (V4.2.0+)

All modules can now be imported individually with subpaths for granular bundling control:

```javascript
// Import specific modules
import { animate } from 'animejs/animate';
import { createTimeline } from 'animejs/timeline';
import { createSpring } from 'animejs/easing';
```

---

## Breaking Changes from V3

### 1. Import Structure

**V3:**
```javascript
import anime from 'animejs';
```

**V4:**
```javascript
import { animate } from 'animejs';
```

### 2. Function Signature

Targets moved from a parameter to the first argument:

**V3:**
```javascript
anime({ targets: 'div', opacity: 1 });
```

**V4:**
```javascript
animate('div', { opacity: 1 });
```

### 3. Easing Changes

- **Renamed:** `easing` → `ease`
- **Prefix removed:** `'easeOutQuad'` → `'outQuad'`
- **New default:** `'out(2)'` (previously `'easeOutElastic'`)

**V3:**
```javascript
easing: 'easeOutQuad'
```

**V4:**
```javascript
ease: 'outQuad'
```

### 4. Property Parameter Updates

#### endDelay → loopDelay

The `endDelay` used to add an extra delay between loops and also at the end of the last iteration. The `loopDelay` only adds a delay between loops, and won't add any delay at the end of the last iteration.

**V3:**
```javascript
endDelay: 1000
```

**V4:**
```javascript
loopDelay: 1000
```

#### Object Syntax: value → to

**V3:**
```javascript
opacity: { value: 0.5, duration: 250 }
```

**V4:**
```javascript
opacity: { to: 1, duration: 250 }
```

#### round → modifier

**V3:**
```javascript
round: 100
```

**V4:**
```javascript
modifier: utils.round(2)
```

### 5. Direction Handling

Replaced with boolean flags:

**V3:**
```javascript
direction: 'reverse'
direction: 'alternate'
```

**V4:**
```javascript
reversed: true
alternate: true
```

### 6. Loop Behavior Change

**IMPORTANT:** The `loop` parameter behavior has changed. It now defines the number of times the animation repeats, instead of defining the actual number of iterations.

**V3:**
```javascript
loop: 1  // Meant one iteration
```

**V4:**
```javascript
loop: 1  // Means repeat once (2 total iterations)
```

### 7. Keyframe Syntax

Property keyframes now use `to`:

**V3:**
```javascript
opacity: [{ value: 0.5 }, { value: 1 }, { value: 0.5 }]
```

**V4:**
```javascript
opacity: [{ to: 0.5 }, { to: 1 }, { to: 0.5 }]
```

---

## Migration Guide

### Timeline Creation

**V3:**
```javascript
const tl = anime.timeline()
```

**V4:**
```javascript
const tl = createTimeline()
```

#### Timeline Defaults Parameter

**V3:**
```javascript
anime.timeline({ easing: 'easeOutQuad', duration: 250 })
```

**V4:**
```javascript
createTimeline({ defaults: { ease: 'outQuad', duration: 250 } })
```

### Control Methods

Key differences in playback control:

- `play()` now always plays forward
- `reverse()` always plays backward
- Use `.alternate()` to reverse direction
- Use `.resume()` to continue in previous direction

### Callback Naming

All callbacks now use the `on` prefix:

**V3:**
```javascript
update: () => {}
begin: () => {}
complete: () => {}
change: () => {}
```

**V4:**
```javascript
onUpdate: () => {}
onBegin: () => {}
onComplete: () => {}
onRender: () => {}
```

#### Begin Timing

**IMPORTANT:** `onBegin` is now called after the animation's delay has completed (unlike v3's immediate execution).

#### Loop Callbacks

Combined into single callback:

**V3:**
```javascript
loopBegin: () => {}
loopComplete: () => {}
```

**V4:**
```javascript
onLoop: () => {}
```

#### Promise Pattern

**V3:**
```javascript
animation.finished.then(() => {})
```

**V4:**
```javascript
animate(target, options).then(() => {})
```

### SVG Methods

Methods moved to `svg` module with renamed functions:

**V3:**
```javascript
anime.path(selector)
anime.setDashoffset()
```

**V4:**
```javascript
svg.createMotionPath(selector)
svg.createDrawable()
```

#### Motion Path Properties

**V3:**
```javascript
const { x, y, angle } = anime.path(el)
```

**V4:**
```javascript
const { translateX, translateY, rotate } = createMotionPath(el)
```

#### Line Drawing

**V3:**
```javascript
strokeDashoffset: [anime.setDashoffset, 0]
```

**V4:**
```javascript
draw: '0 1'
```

### Spring Easing

Spring now requires explicit creation:

**V3:**
```javascript
easing: 'spring(1, 80, 10, 0)'
```

**V4:**
```javascript
ease: createSpring({ mass: 1, stiffness: 80, damping: 10, velocity: 0 })
```

### Custom Easing Functions

Function-based values no longer need wrapping:

**V3:**
```javascript
easing: () => t => 1 - Math.sqrt(1 - t * t)
```

**V4:**
```javascript
ease: t => 1 - Math.sqrt(1 - t * t)
```

### Utility Functions

All helpers moved to `utils` import:

**V3:**
```javascript
animation.remove(targets)
anime.get(target, 'property')
anime.set(target, { prop: value })
anime.random(50, 100)
```

**V4:**
```javascript
utils.remove(targets)
utils.get(target, 'property')
utils.set(target, { prop: value })
utils.random(50, 100)
```

### Engine Control

Manual animation loop:

```javascript
import { engine } from 'animejs';

engine.useDefaultMainLoop = false;

function render() {
  engine.update();
}
```

#### Document Visibility

**V3:**
```javascript
anime.suspendWhenDocumentHidden = true
```

**V4:**
```javascript
engine.pauseOnDocumentHidden = true
```

### Removed Features

- `anime.running` property removed
- `changeBegin` and `changeComplete` callbacks removed
- `animation.tick()` replaced by `engine.update()`
- Function-based easing wrappers no longer needed

---

## New Features in V4

### V4.2.0 Features (September 29, 2024)

#### Modular Import System

All modules can now be imported individually with subpaths, enabling granular bundling control:

```javascript
// Import specific modules as needed
import { animate } from 'animejs/animate';
import { createTimeline } from 'animejs/timeline';
import { stagger } from 'animejs/utils';
```

#### Spring Physics Enhancements

Enhanced spring animations with new parameters:

```javascript
ease: createSpring({
  mass: 1,
  stiffness: 80,
  damping: 10,
  velocity: 0,
  bounce: 0.5,      // NEW: Spring strength control
  duration: 1000,   // NEW: Perceived spring timing
  onComplete: () => {} // NEW: Callback when currentTime reaches perceived duration
})
```

**New Capabilities:**
- `bounce` parameter for spring strength control
- `duration` parameter for perceived spring timing
- `onComplete` callback when currentTime reaches perceived duration
- Over-damped spring support (stiffness below 30)

#### CSS Variable Support

Animations now accept CSS variable values:

```javascript
animate('.element', {
  x: 'var(--x, 100px)',
  opacity: 'var(--opacity, 1)'
});
```

#### WAAPI Improvements

- Built-in eases now match JS `animate()` method parity
- Added `persist` parameter for cancellation control

```javascript
animate('.element', {
  x: 100,
  persist: true // Controls cancellation behavior
});
```

#### Seeded Random Generator

```javascript
import { createSeededRandom } from 'animejs/utils';

const random = createSeededRandom();
const value = random(0, 100);
```

### V4.1.0 Features (July 23, 2024)

#### Text Splitter

Split text by characters, words, and lines with 7KB footprint:

```javascript
import { splitText } from 'animejs';

splitText('.text', {
  by: 'chars',        // 'chars', 'words', 'lines'
  separator: ' ',     // Custom separator
  linesClass: 'line', // Custom class for lines
  wordsClass: 'word', // Custom class for words
  charsClass: 'char'  // Custom class for characters
});
```

**Features:**
- Supports non-space languages (Chinese, Japanese)
- Responsive behavior
- Accessibility features
- ~7KB footprint

#### Scope Enhancements

```javascript
import { createScope } from 'animejs';

const scope = createScope();

// Single-execution constructors
scope.addOnce('myAnimation', () => {
  return animate('.element', { x: 100 });
});

// Parameter updates without playback interruption
scope.keepTime(true);
```

**New Methods:**
- `scope.addOnce()`: Single-execution constructors
- `scope.keepTime()`: Parameter updates without playback interruption

#### Stagger Improvements

```javascript
animate('.items', {
  x: 100,
  delay: stagger(100, {
    use: [2, 4, 6],      // NEW: Custom ordering
    total: 10,            // NEW: Total count override
    from: 'random'        // NEW: Random starting point
  })
});
```

**New Parameters:**
- `use` parameter for custom ordering
- `total` parameter for total count override
- Random `from` parameter option

### V4.1.3 Features (August 12, 2024)

**Improvements:**
- Spring stiffness and velocity parameter limits increased
- Scroll threshold calculations improved for transformed parent elements

### V4.2.1 Features (October 5, 2024)

#### SVG Motion Path Offsets

```javascript
const motionPath = svg.createMotionPath('.path');

animate('.element', {
  ...motionPath,
  offset: 0.5 // NEW: Start from middle of path
});
```

#### Draggable Threshold

```javascript
draggable('.element', {
  dragThreshold: 10 // NEW: Minimum pixels before drag starts
});
```

**Notable Changes:**
- `softReset` parameter converted from integer to Boolean type
- Touch threshold increased to 7px (mouse remains 3px)

---

## Core API Reference

### Animation

#### Supported Target Types

- CSS Selector strings
- DOM Elements
- JavaScript Objects
- Arrays of targets

```javascript
// CSS Selector
animate('.class', { x: 100 });

// DOM Element
const el = document.querySelector('.element');
animate(el, { x: 100 });

// JavaScript Object
const obj = { value: 0 };
animate(obj, { value: 100 });

// Array of targets
animate(['.el1', '.el2', document.querySelector('.el3')], { x: 100 });
```

#### Animatable Properties

- CSS properties
- CSS transforms
- CSS variables
- JavaScript object properties
- HTML attributes
- SVG attributes

```javascript
animate('.element', {
  // CSS properties
  opacity: 0.5,
  backgroundColor: '#FF0000',

  // Transforms
  translateX: 100,
  rotate: 180,
  scale: 1.5,

  // CSS variables
  '--custom-prop': 100,

  // Attributes (use quotes)
  'data-value': 50
});
```

#### Tween Value Types

**Numerical:**
```javascript
animate('.element', {
  x: 100,
  opacity: 0.5
});
```

**Unit Conversion:**
```javascript
animate('.element', {
  width: '100%',
  height: '50vh',
  fontSize: '2rem'
});
```

**Relative Values:**
```javascript
animate('.element', {
  x: '+=100',  // Add 100
  y: '-=50',   // Subtract 50
  rotate: '*=2' // Multiply by 2
});
```

**Color:**
```javascript
animate('.element', {
  backgroundColor: '#FF0000',
  color: 'rgb(255, 0, 0)',
  borderColor: 'hsl(0, 100%, 50%)'
});
```

**Function-based Values:**
```javascript
animate('.element', {
  x: (el, i, total) => i * 100,
  delay: (el, i) => i * 100
});
```

**From-To:**
```javascript
animate('.element', {
  x: { from: 0, to: 100 },
  opacity: { from: 0, to: 1, duration: 500 }
});
```

### Timer Settings

```javascript
animate('.element', {
  x: 100,

  // Timing
  delay: 1000,           // Delay before animation starts (ms)
  duration: 2000,        // Animation duration (ms)
  loopDelay: 500,        // Delay between loops (ms)

  // Playback
  loop: 3,               // Number of repeats (3 = 4 total iterations)
  alternate: true,       // Reverse direction on alternate loops
  reversed: false,       // Start in reverse
  autoplay: true,        // Start immediately
  frameRate: 60,         // Target frame rate
  playbackRate: 1,       // Speed multiplier (2 = 2x speed)

  // Easing
  ease: 'outQuad',       // Easing function

  // Callbacks
  onBegin: (animation) => {},
  onComplete: (animation) => {},
  onUpdate: (animation) => {},
  onLoop: (animation) => {},
  onPause: (animation) => {},
});
```

### Timeline

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({
  defaults: {
    ease: 'outQuad',
    duration: 1000
  },
  loop: true,
  autoplay: false
});

// Add animations
tl.add('.el1', { x: 100 })
  .add('.el2', { y: 100 }, '-=500') // Overlap by 500ms
  .add('.el3', { rotate: 180 }, '+=200'); // Add 200ms gap

// Control timeline
tl.play();
tl.pause();
tl.reverse();
tl.restart();
tl.seek(1000); // Seek to 1 second
```

#### Timeline Position

```javascript
// Absolute time
.add(animation, 100)         // Start at 100ms

// Relative to previous
.add(animation, '+=500')     // 500ms after previous
.add(animation, '-=200')     // Overlap by 200ms

// Labels
tl.add(animation, 'start')
  .add(animation2, 'start+=500')
```

### Easings

#### Built-in Easings

```javascript
// Linear
ease: 'linear'

// Quadratic
ease: 'inQuad'
ease: 'outQuad'
ease: 'inOutQuad'

// Cubic
ease: 'inCubic'
ease: 'outCubic'
ease: 'inOutCubic'

// Quartic
ease: 'inQuart'
ease: 'outQuart'
ease: 'inOutQuart'

// Quintic
ease: 'inQuint'
ease: 'outQuint'
ease: 'inOutQuint'

// Sinusoidal
ease: 'inSine'
ease: 'outSine'
ease: 'inOutSine'

// Exponential
ease: 'inExpo'
ease: 'outExpo'
ease: 'inOutExpo'

// Circular
ease: 'inCirc'
ease: 'outCirc'
ease: 'inOutCirc'

// Back
ease: 'inBack'
ease: 'outBack'
ease: 'inOutBack'

// Elastic
ease: 'inElastic'
ease: 'outElastic'
ease: 'inOutElastic'

// Bounce
ease: 'inBounce'
ease: 'outBounce'
ease: 'inOutBounce'

// Power function
ease: 'in(3)'      // inCubic
ease: 'out(4)'     // outQuart
ease: 'inOut(5)'   // inOutQuint
```

#### Cubic Bézier

```javascript
import { cubicBezier } from 'animejs/easing';

ease: cubicBezier(0.42, 0, 0.58, 1)
```

#### Steps

```javascript
import { steps } from 'animejs/easing';

ease: steps(5)  // 5 equal steps
```

#### Linear Points

```javascript
import { linear } from 'animejs/easing';

ease: linear([0, 0.25, 0.75, 1])
```

#### Irregular

```javascript
import { irregular } from 'animejs/easing';

ease: irregular([
  [0, 0],
  [0.25, 0.5],
  [0.75, 0.25],
  [1, 1]
])
```

#### Spring

```javascript
import { createSpring } from 'animejs/easing';

ease: createSpring({
  mass: 1,
  stiffness: 100,
  damping: 10,
  velocity: 0,
  bounce: 0.5,
  duration: 1000,
  onComplete: () => {}
})
```

### SVG

#### Motion Path

```javascript
import { svg } from 'animejs';

const path = svg.createMotionPath('.path-element');

animate('.circle', {
  ...path,
  duration: 2000,
  ease: 'linear',
  loop: true
});
```

**With Offset (V4.2.1+):**
```javascript
const path = svg.createMotionPath('.path-element');

animate('.circle', {
  ...path,
  offset: 0.5 // Start from middle of path
});
```

#### Drawable (Line Drawing)

```javascript
import { svg } from 'animejs';

const drawable = svg.createDrawable('.path');

animate('.path', {
  draw: '0 1',  // Draw from 0% to 100%
  duration: 2000,
  ease: 'linear'
});
```

#### Morph

```javascript
import { svg } from 'animejs';

svg.morphTo('.shape1', '.shape2');
```

### Draggable

```javascript
import { draggable } from 'animejs';

draggable('.element', {
  // Constraints
  container: '.container',
  axis: 'x',  // 'x', 'y', or undefined for both

  // Physics
  friction: 0.8,
  maxVelocity: 1000,

  // Threshold (V4.2.1+)
  dragThreshold: 10,

  // Callbacks
  onGrab: (info) => {},
  onDrag: (info) => {},
  onRelease: (info) => {},
  onSnap: (info) => {},
  onSettle: (info) => {}
});
```

### ScrollObserver

```javascript
import { createScrollObserver } from 'animejs';

const observer = createScrollObserver({
  container: window,
  threshold: 0.5,  // Trigger at 50% visibility
  onEnter: (element) => {
    animate(element, { opacity: 1, x: 0 });
  },
  onLeave: (element) => {
    animate(element, { opacity: 0, x: -100 });
  }
});

observer.observe('.element');
```

### Utilities

```javascript
import { utils } from 'animejs';

// Stagger
delay: utils.stagger(100, { from: 'center' })

// Random
utils.random(50, 100)           // Random number
utils.randomPick([1, 2, 3])     // Random array element

// Math
utils.clamp(value, min, max)
utils.snap(value, increment)
utils.wrap(value, min, max)
utils.mapRange(value, inMin, inMax, outMin, outMax)
utils.lerp(start, end, progress)
utils.damp(current, target, lambda, deltaTime)

// Angle conversion
utils.degToRad(degrees)
utils.radToDeg(radians)

// DOM
utils.$('.selector')            // Query selector
utils.get(target, 'property')   // Get property value
utils.set(target, { prop: value }) // Set property value
utils.remove(targets)           // Remove targets

// Modifiers
modifier: utils.round(2)        // Round to 2 decimal places
```

### Scope

```javascript
import { createScope } from 'animejs';

const scope = createScope();

// Register animation constructor
scope.add('fadeIn', (targets, vars) => {
  return animate(targets, {
    opacity: [0, 1],
    ...vars
  });
});

// Use registered animation
scope.fadeIn('.element', { duration: 1000 });

// Add once (single execution)
scope.addOnce('init', () => {
  return animate('.element', { x: 100 });
});

// Keep time during updates
scope.keepTime(true);
```

### WAAPI Integration

```javascript
import { waapi } from 'animejs';

// Enhanced Web Animation API with Anime.js features
waapi('.element', {
  x: 100,
  ease: 'outQuad',  // Anime.js easing
  persist: true,    // Control cancellation
  onComplete: () => {}
});
```

### Engine

```javascript
import { engine } from 'animejs';

// Configuration
engine.timeUnit = 'ms';           // 'ms' or 's'
engine.speed = 1;                 // Global speed multiplier
engine.fps = 60;                  // Target FPS
engine.precision = 0.001;         // Calculation precision
engine.pauseOnDocumentHidden = true;  // Auto-pause when tab hidden

// Manual control
engine.useDefaultMainLoop = false;

function customLoop() {
  engine.update();
  requestAnimationFrame(customLoop);
}
customLoop();
```

---

## Release History

### V4.2.2 (October 7, 2024)

**Bug Fixes:**
- SVG `createMotionPath()` corrected a regression from v4.2.1 that improperly wrapped targets back to 0 upon reaching 1

### V4.2.1 (October 5, 2024)

**New Features:**
- SVG motion paths gained offset parameter functionality
- Draggable component introduced `dragThreshold` parameter option

**Changes:**
- `softReset` parameter converted from integer to Boolean type
- Touch threshold increased to 7px (mouse remains 3px)

**Bug Fixes:**
- Fixed onScroll offset miscalculations with scaled containers
- Resolved TypeScript error when awaiting `animate()` function

### V4.2.0 (September 29, 2024)

**Breaking Changes:**
- Deprecated `interpolate()` utility; use simplified `lerp()` alternative
- Removed clock parameter from `lerp()` function
- CSS variable assignment via `utils.set()` now computes values instead of setting variable names
- Core easing functions (`linear()`, `irregular()`, `steps()`, `cubicBezier()`) require separate imports

**Major Features:**
- Modular import system with individual subpaths
- Spring physics enhancements (bounce, duration, onComplete, over-damped support)
- WAAPI improvements (built-in eases, persist parameter)
- CSS variable support in animations
- `createSeededRandom()` utility

**Bug Fixes:**
- Draggable component now functions within Shadow DOM
- Animation reversion properly handles multi-target styles
- Hyphenated inline styles correctly revert
- WAAPI animation cancellation and reversion improved
- Scroll-controlled WAAPI animations no longer disconnect
- Timeline `call()` method firing inconsistencies resolved

### V4.1.4 (September 22, 2024)

**Fix:** onScroll callback prevented from triggering when viewport targets exist outside active regions

### V4.1.3 (August 12, 2024)

**Improvements:**
- Spring stiffness and velocity parameter limits increased
- Scroll threshold calculations improved for transformed parent elements

**Fixes:**
- Non-browser environment compatibility restored
- Draggable callbacks properly trigger for single-axis updates
- Container removal from DOM no longer causes errors
- Multiple type exports added to public API

### V4.1.0 (July 23, 2024)

**Major Features:**
- Text splitter (~7KB, supports non-space languages, responsive, accessible)
- Scope enhancements (`addOnce()`, `keepTime()`)
- Stagger improvements (`use`, `total`, random `from` parameter)

### V4.0.2 (April 24, 2024)

**Initial V4 Release Corrections:**
- Timer floating-point accuracy with `.stretch()` method
- SVG stroke-linecap stylesheet override prevention
- WAAPI Promise handling before animation playback
- Draggable reversion style persistence eliminated

---

## Advanced Features

### Keyframes

```javascript
animate('.element', {
  x: [
    { to: 100, duration: 500 },
    { to: 200, duration: 300, ease: 'inQuad' },
    { to: 0, duration: 800, ease: 'outBounce' }
  ]
});
```

### Stagger Examples

```javascript
// Basic stagger
delay: stagger(100)

// Start from center
delay: stagger(100, { from: 'center' })

// Start from specific index
delay: stagger(100, { from: 5 })

// Start from first/last
delay: stagger(100, { from: 'first' })
delay: stagger(100, { from: 'last' })

// Random start (V4.1.0+)
delay: stagger(100, { from: 'random' })

// Grid stagger
delay: stagger(100, { grid: [3, 4], from: 'center' })

// Custom ordering (V4.1.0+)
delay: stagger(100, { use: [2, 4, 6, 8] })

// Override total (V4.1.0+)
delay: stagger(100, { total: 10 })

// Easing
delay: stagger(100, { ease: 'outQuad' })

// Range
delay: stagger([500, 1000])
```

### Function-based Values

```javascript
animate('.element', {
  x: (el, i, total) => {
    return (i + 1) * 100;
  },
  delay: (el, i, total) => {
    return i * 100;
  },
  duration: (el, i, total) => {
    return 1000 + (i * 100);
  }
});
```

### Property-specific Parameters

```javascript
animate('.element', {
  x: {
    to: 100,
    duration: 1000,
    ease: 'outQuad',
    delay: 500
  },
  y: {
    to: 200,
    duration: 2000,
    ease: 'inOutCubic'
  }
});
```

### Multiple Targets with Different Values

```javascript
animate(['.el1', '.el2', '.el3'], {
  x: (el, i) => i * 100,
  backgroundColor: (el, i) => {
    const colors = ['#FF0000', '#00FF00', '#0000FF'];
    return colors[i];
  }
});
```

### Animation Control

```javascript
const animation = animate('.element', {
  x: 100,
  autoplay: false
});

// Control methods
animation.play();
animation.pause();
animation.restart();
animation.reverse();
animation.seek(500);         // Seek to 500ms
animation.stretch(2000);     // Change duration to 2000ms
animation.reset();           // Reset to initial state
animation.cancel();          // Cancel animation
animation.revert();          // Revert to pre-animation state

// Promise
animation.then(() => {
  console.log('Animation complete!');
});

// Or with await
await animation;
console.log('Animation complete!');
```

### Timeline Advanced Usage

```javascript
const tl = createTimeline({
  defaults: {
    ease: 'outQuad',
    duration: 1000
  }
});

// Add with position
tl.add('.el1', { x: 100 })
  .add('.el2', { y: 100 }, 500)      // Start at 500ms
  .add('.el3', { rotate: 180 }, '+=200')  // 200ms after previous
  .add('.el4', { scale: 1.5 }, '-=500');  // Overlap by 500ms

// Add function call
tl.call(() => {
  console.log('Midpoint reached!');
}, 1000);

// Control timeline
tl.play();
tl.pause();
tl.seek(2000);
tl.stretch(5000);
```

### Text Animation

```javascript
import { splitText, animate, stagger } from 'animejs';

// Split text
splitText('.text', {
  by: 'chars',
  charsClass: 'char'
});

// Animate characters
animate('.char', {
  opacity: [0, 1],
  translateY: [50, 0],
  delay: stagger(50),
  ease: 'outQuad'
});
```

### Scroll-triggered Animation

```javascript
import { createScrollObserver, animate } from 'animejs';

const observer = createScrollObserver({
  threshold: 0.5,
  onEnter: (element) => {
    animate(element, {
      opacity: [0, 1],
      translateY: [100, 0],
      duration: 1000,
      ease: 'outQuad'
    });
  }
});

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});
```

### CSS Variable Animation

```javascript
// Set CSS variables
document.documentElement.style.setProperty('--x', '0px');
document.documentElement.style.setProperty('--opacity', '0');

// Animate CSS variables
animate(':root', {
  '--x': '100px',
  '--opacity': 1,
  duration: 1000
});

// Use in CSS
// .element {
//   transform: translateX(var(--x));
//   opacity: var(--opacity);
// }
```

---

## Performance Tips

1. **Use transforms instead of position properties** for better performance:
   ```javascript
   // Better
   animate('.el', { translateX: 100 });

   // Avoid
   animate('.el', { left: '100px' });
   ```

2. **Batch similar animations** into a single call:
   ```javascript
   // Better
   animate('.items', { x: 100 });

   // Avoid
   document.querySelectorAll('.items').forEach(el => {
     animate(el, { x: 100 });
   });
   ```

3. **Use `will-change` for complex animations**:
   ```css
   .animated {
     will-change: transform, opacity;
   }
   ```

4. **Disable autoplay** for better control:
   ```javascript
   const animation = animate('.el', { x: 100, autoplay: false });
   animation.play();  // Play when ready
   ```

5. **Use modular imports** to reduce bundle size (V4.2.0+):
   ```javascript
   import { animate } from 'animejs/animate';
   // Instead of importing everything from 'animejs'
   ```

---

## Development Commands

```bash
# Watch and bundle to lib/
npm run dev

# Build all versions (ESM/UMD/CJS/IIFE)
npm run build

# Run browser tests
npm run test:browser

# Run Node tests
npm run test:node

# Open examples locally
npm run open:examples
```

---

## Resources

- **Official Documentation:** https://animejs.com/documentation
- **GitHub Repository:** https://github.com/juliangarnier/anime
- **Migration Guide:** https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4
- **Examples:** https://animejs.com
- **npm Package:** https://www.npmjs.com/package/animejs

---

*Last Updated: January 6, 2026*
*Based on Anime.js V4.2.2*
