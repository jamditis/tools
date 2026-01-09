# Anime.js V4 - Complete Documentation Reference

**Version:** 4.2.2 (Latest as of January 2026)
**Author:** Julian Garnier
**License:** MIT
**Homepage:** https://animejs.com
**Repository:** https://github.com/juliangarnier/anime
**Bundle Size:** 24.50 KB (modular components available separately)

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Animation API](#animation-api)
5. [Timer API](#timer-api)
6. [Timeline API](#timeline-api)
7. [Animatable](#animatable)
8. [Draggable API](#draggable-api)
9. [ScrollObserver](#scrollobserver)
10. [Scope API](#scope-api)
11. [SVG Utilities](#svg-utilities)
12. [Text Animation](#text-animation)
13. [Stagger Utility](#stagger-utility)
14. [Easing Functions](#easing-functions)
15. [Web Animation API (WAAPI)](#web-animation-api-waapi)
16. [Utilities](#utilities)
17. [Migration Guide (V3 to V4)](#migration-guide-v3-to-v4)
18. [Code Examples](#code-examples)
19. [Resources](#resources)

---

## Overview

Anime.js is a fast, multipurpose and lightweight JavaScript animation library with a simple, yet powerful API. It works with CSS properties, SVG, DOM attributes and JavaScript Objects.

### Key Features

- **Intuitive API** with per-property parameters, flexible keyframes, and built-in easings
- **Enhanced transforms** supporting individual CSS properties and function-based values
- **Scroll Observer** with synchronization modes, advanced thresholds, and callbacks
- **Advanced staggering** for time, values, and timeline positions
- **SVG toolset** enabling shape morphing, line drawing, and motion paths
- **Draggable API** with springs, flick/throw functionality, and comprehensive callbacks
- **Timeline API** for orchestrating sequences and synchronizing animations
- **Responsive animations** through Scope API with media query support
- **WAAPI version** - lightweight 3KB alternative using Web Animation API
- **Works with:** CSS properties, SVG, DOM attributes, JavaScript Objects, Canvas, WebGL

---

## Installation

### NPM Installation

```bash
npm install animejs
```

**ES Modules Import:**
```javascript
import { animate } from 'animejs';
```

**CommonJS Import:**
```javascript
const { animate } = require('animejs');
```

### CDN Options

**ES Modules via CDN:**
```javascript
import { animate } from 'https://esm.sh/animejs';
// or
import { animate } from 'https://cdn.jsdelivr.net/npm/animejs';
```

**UMD Global Object:**
```html
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
<script>
  const { animate } = anime;
</script>
```

### Modular Imports (V4.2.0+)

All modules can be imported individually with subpaths:

```javascript
import { animate } from 'animejs/animate';
import { createTimeline } from 'animejs/timeline';
import { createTimer } from 'animejs/timer';
import { createDraggable } from 'animejs/draggable';
import { createScope } from 'animejs/scope';
import { morphTo, createMotionPath, createDrawable } from 'animejs/svg';
import { splitText } from 'animejs/text';
import { eases, cubicBezier, spring } from 'animejs/easings';
import { waapi } from 'animejs/waapi';
import { stagger, utils } from 'animejs/utils';
```

---

## Getting Started

### Basic Animation Example

```javascript
import { animate } from 'animejs';

animate('.square', {
  translateX: 100,
  scale: 2,
  opacity: .5,
  duration: 400,
  delay: 250,
  ease: 'out(3)',
  loop: 3,
  alternate: true,
  autoplay: false,
  onBegin: () => {},
  onLoop: () => {},
  onUpdate: () => {},
});
```

### Text Animation Example

```javascript
import { animate, stagger, splitText } from 'animejs';

const { chars } = splitText('h2', { words: false, chars: true });

animate(chars, {
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  rotate: { from: '-1turn', delay: 0 },
  delay: stagger(50),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});
```

---

## Animation API

### Core Function

```javascript
import { animate } from 'animejs';
const animation = animate(targets, parameters);
```

### Targets

Four main ways to specify targets:

```javascript
// 1. CSS Selector
animate('.square', { x: 100 });

// 2. DOM Elements
const element = document.querySelector('.square');
animate(element, { x: 100 });

// 3. JavaScript Objects
const obj = { value: 0 };
animate(obj, { value: 100 });

// 4. Array of targets
animate(['.square', '.circle'], { x: 100 });
```

### Animatable Properties

Six categories of animatable properties:

1. **CSS Properties** - Standard CSS styling properties
2. **CSS Transforms** - `translateX`, `translateY`, `scale`, `rotate`, etc.
3. **CSS Variables** - Custom CSS variables
4. **JavaScript Object Properties** - Properties of plain JavaScript objects
5. **HTML Attributes** - Standard HTML element attributes
6. **SVG Attributes** - SVG-specific properties

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

### Tween Value Types

```javascript
// Numerical
animate('.element', { x: 100, opacity: 0.5 });

// Unit Conversion
animate('.element', { width: '100%', height: '50vh', fontSize: '2rem' });

// Relative Values
animate('.element', {
  x: '+=100',   // Add 100
  y: '-=50',    // Subtract 50
  rotate: '*=2' // Multiply by 2
});

// Color
animate('.element', {
  backgroundColor: '#FF0000',
  color: 'rgb(255, 0, 0)',
  borderColor: 'hsl(0, 100%, 50%)'
});

// Function-based Values
animate('.element', {
  x: (el, i, total) => i * 100,
  delay: (el, i) => i * 100
});

// From-To
animate('.element', {
  x: { from: 0, to: 100 },
  opacity: { from: 0, to: 1, duration: 500 }
});
```

### Keyframes

**Property Value Keyframes:**
```javascript
// Tween Values Array
animate('.square', {
  x: [0, 100, 200],
  y: [0, 100, 200],
  duration: 3000,
});

// Tween Parameters Array
animate('.square', {
  x: [{to: 100}, {to: 200}],
  y: [{to: 100}, {to: 200}],
  duration: 3000,
});
```

**Animation-Level Keyframes:**
```javascript
// Duration Based
animate('.square', {
  keyframes: [
    { x: 100, y: 100 },
    { x: 200, y: 200 },
  ],
  duration: 3000,
});

// Percentage Based
animate('.square', {
  keyframes: {
    '0%'  : { x: 0,   y: 0   },
    '50%' : { x: 100, y: 100 },
    '100%': { x: 200, y: 200 },
  },
  duration: 3000,
});
```

### Playback Settings

| Setting | Description |
|---------|-------------|
| `delay` | Initial timing before animation starts |
| `duration` | Animation length in milliseconds |
| `loop` | Number of repetitions (true for infinite) |
| `loopDelay` | Pause between loop iterations |
| `alternate` | Reverse direction on each cycle |
| `reversed` | Invert playback direction |
| `autoplay` | Begin automatically upon creation |
| `frameRate` | Define refresh rate |
| `playbackRate` | Adjust playback speed |

### Animation Callbacks

```javascript
animate('.square', {
  x: 100,
  onBegin: () => console.log('Animation started'),
  onUpdate: (self) => console.log('Progress:', self.progress),
  onComplete: () => console.log('Animation finished'),
  onLoop: () => console.log('Loop iteration'),
  onPause: () => console.log('Animation paused'),
  onRender: () => console.log('Frame rendered'),
  onBeforeUpdate: () => console.log('Before update'),
}).then(() => console.log('Promise resolved'));
```

### Animation Methods

```javascript
const animation = animate(target, parameters);

animation.play();      // Start playback
animation.pause();     // Halt animation
animation.reverse();   // Play backwards
animation.restart();   // Reset and restart
animation.alternate(); // Toggle direction
animation.resume();    // Continue from paused state
animation.complete();  // Jump to end
animation.cancel();    // Stop and remove
animation.revert();    // Restore original state
animation.reset();     // Return to initial state
animation.seek(500);   // Jump to 500ms
animation.stretch(2000); // Change duration
animation.refresh();   // Recalculate values
```

---

## Timer API

### Overview

The `createTimer()` function schedules and controls timed callbacks as an alternative to `setTimeout()` or `setInterval()`.

```javascript
import { createTimer } from 'animejs';

const timer = createTimer({
  duration: 1000,
  loop: true,
  frameRate: 30,
  onUpdate: self => console.log(self.currentTime),
  onLoop: self => console.log('Loop:', self._currentIteration)
});
```

### Timer Settings

- `delay`, `duration`, `loop`, `loopDelay`
- `alternate`, `reversed`, `autoplay`
- `frameRate`, `playbackRate`

### Timer Methods

`play()`, `pause()`, `reverse()`, `restart()`, `alternate()`, `resume()`, `complete()`, `reset()`, `cancel()`, `revert()`, `seek()`, `stretch()`

---

## Timeline API

### Overview

Timelines coordinate multiple animations and timers in sequence or parallel.

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({
  defaults: { duration: 750, ease: 'outQuad' },
  loop: true,
  loopDelay: 500
});
```

### Core Methods

**add() - Adding Animations:**
```javascript
tl.add('.circle', { x: '15rem' })
  .add('.triangle', { x: '15rem', rotate: '1turn', duration: 500 })
  .add('.square', { x: '15rem' });
```

**sync() - Synchronizing:**
```javascript
const circleAnimation = animate('.circle', { x: '15rem' });
tl.sync(circleAnimation)
  .add('.square', { x: '15rem' });
```

**call() - Executing Functions:**
```javascript
tl.call(() => console.log('Checkpoint A'), 500)
  .call(() => console.log('Checkpoint B'), 1200);
```

**label() - Creating Position Markers:**
```javascript
tl.label('start', 0)
  .add('.square', { x: '17rem' }, 'start')
  .add('.circle', { x: '13rem' }, 'start+=500');
```

**set() - Instant Value Setting:**
```javascript
tl.set('.circle', { x: '15rem' })
  .set('.triangle', { x: '15rem' }, 500);
```

### Time Position Syntax

```javascript
// Absolute positioning
.add(animation, 500)           // Start at 500ms

// Relative positioning
.add(animation, '+=100')       // 100ms after previous
.add(animation, '-=100')       // Overlap by 100ms
.add(animation, '*=.5')        // At half duration

// Previous element references
.add(animation, '<')           // When previous ends
.add(animation, '<<')          // When previous starts
.add(animation, '<<+=250')     // 250ms after previous starts

// Label references
.add(animation, 'myLabel')
.add(animation, 'myLabel+=500')

// Stagger
.add('.elements', { x: 100 }, stagger(10))
```

### Complete Timeline Example

```javascript
const tl = createTimeline({
  defaults: { duration: 750, ease: 'outQuad' },
  loop: 2,
  loopDelay: 500,
  alternate: true,
  onLoop: self => self.refresh()
});

tl.label('start', 0)
  .add('.circle', { x: '15rem' }, 'start')
  .call(() => console.log('Checkpoint'), 500)
  .add('.square', { x: '17rem', rotate: 360 }, 'start+=250')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500')
  .init();
```

---

## Animatable

### Overview

`createAnimatable()` creates instances designed for efficient frequent property animation.

```javascript
import { createAnimatable } from 'animejs';

const animatableSquare = createAnimatable('.square', {
  x: 500,  // x duration: 500ms
  y: 500,  // y duration: 500ms
  ease: 'out(3)',
});

// Getter/Setter pattern
animatableSquare.x(newValue);      // Animate to new value
const currentX = animatableSquare.x();  // Get current value
```

---

## Draggable API

### Overview

The Draggable feature adds drag capabilities to DOM Elements.

```javascript
import { createDraggable } from 'animejs';

createDraggable('.square', {
  container: '.grid',
  snap: 56,
  x: { snap: [0, 200] },
  containerPadding: 10,
  releaseStiffness: 40,
  releaseEase: 'out(3)',
  onGrab: () => console.log('Grabbed'),
  onDrag: () => console.log('Dragging'),
  onRelease: () => console.log('Released'),
});
```

### Axes Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `x` | Boolean/Object | Horizontal axis control |
| `y` | Boolean/Object | Vertical axis control |
| `snap` | Number/Array/Function | Snap to values |
| `modifier` | Function | Value transformation |
| `mapTo` | String | Map drag to other properties |

**mapTo Example (3D Effects):**
```javascript
createDraggable('.square', {
  x: { mapTo: 'rotateY' },  // Horizontal drag rotates
  y: { mapTo: 'z' },        // Vertical drag changes depth
});
```

### Settings

| Setting | Description |
|---------|-------------|
| `trigger` | Separate grab handle element |
| `container` | Boundary constraints |
| `containerPadding` | Padding within bounds |
| `containerFriction` | Friction during drag |
| `releaseContainerFriction` | Friction after release |
| `releaseMass`, `releaseStiffness`, `releaseDamping` | Physics parameters |
| `velocityMultiplier`, `minVelocity`, `maxVelocity` | Velocity controls |
| `releaseEase` | Easing function for release |
| `dragSpeed` | Drag responsiveness multiplier |
| `dragThreshold` | Minimum distance to start drag |
| `scrollThreshold`, `scrollSpeed` | Auto-scrolling |
| `cursor` | Custom cursor styles |

### Callbacks

`onGrab`, `onDrag`, `onUpdate`, `onRelease`, `onSnap`, `onSettle`, `onResize`, `onAfterResize`

### Methods

`disable()`, `enable()`, `setX()`, `setY()`, `animateInView()`, `scrollInView()`, `stop()`, `reset()`, `revert()`, `refresh()`

### Spring Physics Example

```javascript
import { createDraggable, spring } from 'animejs';

createDraggable('.logo', {
  container: [0, 0, 0, 0],
  releaseEase: spring({ bounce: .7 })
});
```

---

## ScrollObserver

### Overview

The `onScroll()` function creates ScrollObserver instances that trigger and synchronize animations on scroll.

```javascript
import { animate, onScroll } from 'animejs';

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,
    debug: true,
  })
});
```

### Settings

| Setting | Description |
|---------|-------------|
| `container` | Scroll container element |
| `target` | Observed element |
| `axis` | Scroll direction ('x' or 'y') |
| `repeat` | Continue after completion |
| `debug` | Visual threshold markers |

### Thresholds

```javascript
// Object format
enter: { target: 'top', container: 'bottom' }

// String format
enter: 'bottom top'
leave: 'top bottom'

// Numeric values
enter: '80% 20%'

// Position shorthands
enter: 'center top'

// Relative values
enter: 'center+=1em top-=100%'
```

### Synchronization Modes

```javascript
// Method names - trigger animation methods
sync: 'play pause'
sync: 'resume pause reverse reset'

// Playback progress - direct scroll sync
sync: true  // or sync: 1

// Smooth scroll - damped tracking
sync: 0.25

// Eased scroll
sync: 'inOutCirc'
```

### Callbacks

| Callback | Description |
|----------|-------------|
| `onEnter` | Threshold entry (any direction) |
| `onEnterForward` | Entry while scrolling forward |
| `onEnterBackward` | Entry while scrolling backward |
| `onLeave` | Threshold exit (any direction) |
| `onLeaveForward` | Exit while scrolling forward |
| `onLeaveBackward` | Exit while scrolling backward |
| `onUpdate` | Continuous scroll updates |
| `onSyncComplete` | Synchronization completion |

### Methods

`link()`, `refresh()`, `revert()`

---

## Scope API

### Overview

The Scope feature enables animations to react to media queries and batch revert operations.

```javascript
import { createScope, animate, utils } from 'animejs';

createScope({
  mediaQueries: {
    isSmall: '(max-width: 200px)',
    reduceMotion: '(prefers-reduced-motion)',
  }
})
.add(self => {
  const { isSmall, reduceMotion } = self.matches;

  if (isSmall) {
    utils.set('.square', { scale: .5 });
  }

  animate('.square', {
    x: isSmall ? 0 : ['-35vw', '35vw'],
    duration: reduceMotion ? 0 : isSmall ? 750 : 1250
  });
});
```

### Methods

| Method | Description |
|--------|-------------|
| `add()` | Add constructor function |
| `addOnce()` | Single-execution constructor |
| `keepTime()` | Maintain animation timing |
| `revert()` | Batch revert all animations |
| `refresh()` | Refresh scope state |

---

## SVG Utilities

### Overview

Anime.js provides three primary SVG utility functions.

```javascript
import { svg } from 'animejs';
svg.morphTo();
svg.createDrawable();
svg.createMotionPath();

// Or direct imports
import { morphTo, createMotionPath, createDrawable } from 'animejs/svg';
```

### morphTo() - Shape Morphing

```javascript
animate('.circuit-a', {
  d: morphTo('.circuit-b'),
});

// With precision
animate($path1, {
  points: svg.morphTo($path2, 0.5),  // precision 0-1
  ease: 'inOutCirc',
  duration: 500
});
```

### createDrawable() - Line Drawing

```javascript
import { animate, svg } from 'animejs';

animate(svg.createDrawable('.line'), {
  draw: ['0 0', '0 1', '1 1'],
  ease: 'inOutQuad',
  duration: 2000,
  delay: stagger(100),
  loop: true
});
```

**Draw property values:**
- `'0 1'` - Full line visible
- `'0 .5'` - First half visible
- `'.25 .75'` - Middle section visible
- `'1 1'` - No visible line (endpoint only)

### createMotionPath() - Motion Path Animation

```javascript
import { animate, svg } from 'animejs';

const { translateX, translateY, rotate } = svg.createMotionPath('.path');

animate('.car', {
  ...svg.createMotionPath('.circuit'),
  ease: 'linear',
  duration: 5000,
  loop: true
});

// With offset
animate('.element', {
  ...svg.createMotionPath('.path'),
  offset: 0.5  // Start at middle of path
});
```

---

## Text Animation

### splitText()

```javascript
import { splitText, animate, stagger } from 'animejs';

const { chars, words, lines } = splitText('.text', {
  by: 'chars',        // 'chars', 'words', 'lines'
  separator: ' ',
  charsClass: 'char',
  wordsClass: 'word',
  linesClass: 'line'
});

animate(chars, {
  opacity: [0, 1],
  translateY: [50, 0],
  delay: stagger(50),
  duration: 800,
  ease: 'outExpo'
});
```

---

## Stagger Utility

### Overview

The `stagger()` function creates sequential effects by distributing values progressively across multiple targets.

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  x: '17rem',
  scale: stagger([1, .1]),
  delay: stagger(100),
});
```

### Stagger Modes

**1. Time Staggering:**
```javascript
animate('.square', {
  x: '17rem',
  delay: stagger(100),
  duration: stagger(200, { start: 500 }),
});
```

**2. Values Staggering:**
```javascript
animate('.square', {
  y: stagger(['-2.75rem', '2.75rem']),
  rotate: { from: stagger('-.125turn') },
});
```

**3. Timeline Staggering:**
```javascript
createTimeline()
  .add('.tick', { y: '-=6' }, stagger(10));
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `start` | `0` | Initial offset value |
| `from` | `0` | Starting position ('first', 'center', 'last', 'random', or index) |
| `reversed` | `false` | Reverse stagger order |
| `ease` | `'linear'` | Easing for distribution |
| `grid` | `null` | 2D grid layout [columns, rows] |
| `axis` | `null` | Grid axis direction ('x' or 'y') |
| `modifier` | `noop` | Custom value transformation |
| `use` | `null` | Custom element attribute for ordering |
| `total` | `null` | Override total element count |

### Examples

```javascript
// From center
delay: stagger(100, { from: 'center' })

// Grid stagger
delay: stagger(100, { grid: [10, 5], from: 'center' })

// With easing
delay: stagger(100, { ease: 'inOutQuad' })

// Reversed
delay: stagger(100, { reversed: true })

// Custom modifier
boxShadow: stagger([1, 0], { modifier: v => `0 0 ${v*20}px currentColor` })

// Range values
scale: stagger([1, 0.5])

// Random from
delay: stagger(100, { from: 'random' })

// Custom ordering
delay: stagger(250, { use: 'data-index' })
```

---

## Easing Functions

### Built-in Easings

| Type | Parameters | Variants |
|------|-----------|----------|
| **Linear** | — | `'linear'` |
| **Power** | power = 1.675 | `'in'`, `'out'`, `'inOut'`, `'outIn'` |
| **Quad** | — | `'inQuad'`, `'outQuad'`, `'inOutQuad'`, `'outInQuad'` |
| **Cubic** | — | `'inCubic'`, `'outCubic'`, `'inOutCubic'`, `'outInCubic'` |
| **Quart** | — | `'inQuart'`, `'outQuart'`, `'inOutQuart'`, `'outInQuart'` |
| **Quint** | — | `'inQuint'`, `'outQuint'`, `'inOutQuint'`, `'outInQuint'` |
| **Sine** | — | `'inSine'`, `'outSine'`, `'inOutSine'`, `'outInSine'` |
| **Expo** | — | `'inExpo'`, `'outExpo'`, `'inOutExpo'`, `'outInExpo'` |
| **Circ** | — | `'inCirc'`, `'outCirc'`, `'inOutCirc'`, `'outInCirc'` |
| **Bounce** | — | `'inBounce'`, `'outBounce'`, `'inOutBounce'`, `'outInBounce'` |
| **Back** | overshoot = 1.70158 | `'inBack'`, `'outBack'`, `'inOutBack'`, `'outInBack'` |
| **Elastic** | amplitude = 1, period = .3 | `'inElastic'`, `'outElastic'`, `'inOutElastic'`, `'outInElastic'` |

### Usage Examples

```javascript
// String notation
animate(target, { x: 100, ease: 'outQuad' });
animate(target, { x: 100, ease: 'outElastic(.8, 1.2)' });
animate(target, { x: 100, ease: 'inOut(3)' });

// Via eases object
import { eases } from 'animejs';
eases.outQuad;
eases.outElastic(.8, 1.2);
```

### Cubic Bezier

```javascript
import { cubicBezier } from 'animejs';
animate(target, { x: 100, ease: cubicBezier(.7, .1, .5, .9) });
```

### Linear (Multi-point)

```javascript
import { linear } from 'animejs';
animate(target, { x: 100, ease: linear(0, '0.5 50%', '0.3 75%', 1) });
```

### Steps

```javascript
import { steps } from 'animejs';
animate(target, { x: 100, ease: steps(5) });
animate(target, { x: 100, ease: steps(4, true) });  // fromStart
```

### Irregular

```javascript
import { irregular } from 'animejs';
animate(target, { x: 100, ease: irregular(10, 1.5) });  // steps, randomness
```

### Spring Physics

```javascript
import { spring, createSpring } from 'animejs';

// Perceived parameters (intuitive)
animate(target, {
  x: 100,
  ease: spring({ bounce: 0.5, duration: 350 })
});

// Physics parameters (direct control)
animate(target, {
  x: 100,
  ease: createSpring({
    mass: 2,
    stiffness: 150,
    damping: 15,
    velocity: 5,
    onComplete: () => console.log('Perceived completion')
  })
});
```

**Spring Parameters:**

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| `bounce` | -1 to 1 | 0.5 | Bounciness (perceived) |
| `duration` | 10-10000ms | 628ms | Perceived completion time |
| `mass` | 1-10000 | 1 | Inertia (physics) |
| `stiffness` | 0-10000 | 100 | Spring tightness (physics) |
| `damping` | 0-10000 | 10 | Oscillation decay (physics) |
| `velocity` | -10000 to 10000 | 0 | Initial momentum (physics) |

---

## Web Animation API (WAAPI)

### Overview

Anime.js offers a lightweight 3KB alternative using the Web Animation API.

```javascript
import { waapi } from 'animejs';

waapi.animate('.square', {
  x: '17rem',
  rotate: 360,
  ease: 'inOutExpo',
});
```

### Bundle Size Comparison

| Method | Bundle Size |
|--------|-------------|
| `animate()` | 10KB |
| `waapi.animate()` | 3KB (70% smaller) |

### Improvements Over Native WAAPI

1. **Sensible defaults** - Intelligent preset values
2. **Multi-targets animation** - Animate multiple elements
3. **Default units** - Auto unit assignment
4. **Function-based values** - Dynamic value generation
5. **Individual transforms** - Direct manipulation
6. **Individual property parameters** - Per-property config
7. **Spring and custom easings** - Extended easing support

### Example

```javascript
import { waapi, stagger, splitText } from 'animejs';

const { chars } = splitText('h2', { words: false, chars: true });

waapi.animate(chars, {
  translate: '0 -2rem',
  delay: stagger(100),
  duration: 600,
  loop: true,
  alternate: true,
  ease: 'inOut(2)',
});
```

---

## Utilities

### DOM Utilities

```javascript
import { utils } from 'animejs';

utils.$('.selector');                    // Query selector
utils.get(target, 'property');           // Get property value
utils.set(target, { prop: value });      // Set property value
utils.cleanInlineStyles();               // Remove inline styles
utils.remove(targets);                   // Remove elements
```

### Random Utilities

```javascript
utils.random(50, 100);                   // Random number (int)
utils.random(0, 1, 2);                   // Random with decimals
utils.randomPick([1, 2, 3]);             // Random array element
utils.shuffle([1, 2, 3]);                // Shuffle array
utils.createSeededRandom();              // Seeded random generator
```

### Math Utilities

```javascript
utils.round(value, decimals);            // Round numbers
utils.clamp(value, min, max);            // Constrain to range
utils.snap(value, increment);            // Snap to values
utils.wrap(value, min, max);             // Wrap values
utils.mapRange(value, inMin, inMax, outMin, outMax);  // Map ranges
utils.lerp(start, end, progress);        // Linear interpolation
utils.damp(current, target, lambda, dt); // Damping function
utils.degToRad(degrees);                 // Degrees to radians
utils.radToDeg(radians);                 // Radians to degrees
```

---

## Migration Guide (V3 to V4)

### Import Changes

```javascript
// V3
import anime from 'animejs';

// V4
import { animate } from 'animejs';
```

### Function Signature

```javascript
// V3
anime({ targets: 'div', opacity: 1 });

// V4
animate('div', { opacity: 1 });
```

### Parameter Renames

| V3 | V4 |
|----|-----|
| `targets` | First function argument |
| `endDelay` | `loopDelay` |
| `easing` | `ease` |
| `value` | `to` |
| `direction: 'reverse'` | `reversed: true` |
| `direction: 'alternate'` | `alternate: true` |
| `round: 100` | `modifier: utils.round(2)` |

### Easing Names

```javascript
// V3
easing: 'easeOutQuad'

// V4
ease: 'outQuad'
```

### Callback Renames

| V3 | V4 |
|----|-----|
| `update` | `onUpdate` |
| `begin` | `onBegin` |
| `complete` | `onComplete` |
| `change` | `onRender` |
| `loopBegin`/`loopComplete` | `onLoop` |

### Timeline Creation

```javascript
// V3
const tl = anime.timeline({ easing: 'easeOutQuad', duration: 250 });

// V4
const tl = createTimeline({ defaults: { ease: 'outQuad', duration: 250 } });
```

### SVG Methods

```javascript
// V3
anime.path(selector);
anime.setDashoffset();

// V4
svg.createMotionPath(selector);
svg.createDrawable();
```

### Spring Easing

```javascript
// V3
easing: 'spring(1, 80, 10, 0)'

// V4
ease: createSpring({ mass: 1, stiffness: 80, damping: 10, velocity: 0 })
```

### Utility Functions

```javascript
// V3
anime.random(50, 100);
anime.get(target, 'property');
anime.set(target, { prop: value });

// V4
utils.random(50, 100);
utils.get(target, 'property');
utils.set(target, { prop: value });
```

### Control Methods

- `play()` now always plays forward; use `resume()` to continue in previous direction
- `reverse()` always plays backward; use `alternate()` for opposite direction

---

## Code Examples

### Basic Animation

```javascript
import { animate } from 'animejs';

animate('.square', {
  translateX: 100,
  scale: 2,
  opacity: 0.5,
  duration: 400,
  delay: 250,
  ease: 'out(3)',
  loop: 3,
  alternate: true
});
```

### Keyframe Animation

```javascript
animate('.element', {
  keyframes: [
    { translateX: 0, translateY: 0, scale: 1 },
    { translateX: 100, translateY: 0, scale: 1.2 },
    { translateX: 100, translateY: 100, scale: 1 },
    { translateX: 0, translateY: 100, scale: 0.8 },
    { translateX: 0, translateY: 0, scale: 1 }
  ],
  duration: 2000,
  ease: 'inOutQuad',
  loop: true
});
```

### Staggered Grid Animation

```javascript
import { animate, stagger } from 'animejs';

animate('.grid-item', {
  scale: [0, 1],
  opacity: [0, 1],
  translateY: [50, 0],
  delay: stagger(100, { grid: [5, 5], from: 'center' }),
  duration: 800,
  ease: 'outExpo'
});
```

### Timeline Sequence

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({
  loop: true,
  loopDelay: 500
});

tl.add('.box1', { translateX: 250, duration: 1000, ease: 'outExpo' })
  .add('.box2', { translateX: 250, duration: 1000, ease: 'outExpo' }, '-=800')
  .add('.box3', { translateX: 250, duration: 1000, ease: 'outExpo' }, '-=800');
```

### Spring Animation

```javascript
import { animate, spring } from 'animejs';

animate('.element', {
  translateY: -100,
  rotate: 360,
  ease: spring({ bounce: 0.4, duration: 800 })
});
```

### Scroll-Triggered Animation

```javascript
import { animate, onScroll } from 'animejs';

animate('.reveal', {
  opacity: [0, 1],
  translateY: [100, 0],
  duration: 1000,
  ease: 'outQuad',
  autoplay: onScroll({
    threshold: 0.5,
    sync: true
  })
});
```

### Responsive Animation

```javascript
import { createScope, animate, utils } from 'animejs';

createScope({
  mediaQueries: {
    isSmall: '(max-width: 768px)',
    reduceMotion: '(prefers-reduced-motion)',
  }
}).add(self => {
  const { isSmall, reduceMotion } = self.matches;

  animate('.element', {
    x: isSmall ? 0 : ['-35vw', '35vw'],
    duration: reduceMotion ? 0 : 1000
  });
});
```

### SVG Line Drawing + Motion Path

```javascript
import { animate, svg } from 'animejs';

// Draw the path
animate(svg.createDrawable('.circuit'), {
  draw: '0 1',
  duration: 3000,
  ease: 'linear'
});

// Move element along path
animate('.car', {
  ...svg.createMotionPath('.circuit'),
  duration: 3000,
  ease: 'linear',
  loop: true
});
```

---

## Resources

- **Official Documentation:** https://animejs.com/documentation
- **Homepage:** https://animejs.com
- **GitHub Repository:** https://github.com/juliangarnier/anime
- **NPM Package:** https://www.npmjs.com/package/animejs
- **Migration Guide:** https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4
- **V4 Changes:** https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4

---

## Development Commands

```bash
npm run dev          # Watch and bundle to lib/
npm run build        # Build all versions (ESM/UMD/CJS/IIFE)
npm run test:browser # Run browser tests
npm run test:node    # Run Node tests
npm run open:examples # Browse examples locally
```

---

*Documentation compiled from https://animejs.com and https://github.com/juliangarnier/anime*
*Last Updated: January 2026*
*Based on Anime.js V4.2.2*
