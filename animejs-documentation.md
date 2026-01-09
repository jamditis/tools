# Anime.js Complete Documentation

**Version:** 4.0.0
**Description:** JavaScript Animation Engine
**Website:** https://animejs.com
**GitHub:** https://github.com/juliangarnier/anime

---

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Animation](#animation)
4. [Timer](#timer)
5. [Timeline](#timeline)
6. [Animatable](#animatable)
7. [Draggable](#draggable)
8. [Scope](#scope)
9. [SVG Features](#svg-features)
10. [Utilities](#utilities)
11. [Easings](#easings)
12. [Web Animation API (WAAPI)](#web-animation-api-waapi)
13. [Code Examples](#code-examples)

---

## Installation

Anime.js is available through multiple installation methods.

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

### Direct Download

Available distribution files from GitHub repository:

- **ES modules**: `dist/modules/index.js` and `.cjs`
- **Bundled formats**: `anime.esm.js`, `anime.umd.js`
- **Minified versions**: `.min.js` variants available

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

## Animation

### Core Function

The `animate()` function creates animations.

**Function Signature:**
```javascript
import { animate } from 'animejs';
const animation = animate(targets, parameters);
```

**Alternative Import:**
```javascript
import { animate } from 'animejs/animation';
```

### Parameters

| Parameter | Accepts |
|-----------|---------|
| **targets** | CSS selectors, DOM elements, JS objects, or arrays of targets |
| **parameters** | Object containing animatable properties, tween parameters, playback settings, and callbacks |

**Return Value:** Returns a `JSAnimation` object (or `WAAPIAnimation` for the lightweight WAAPI version).

### Animation Targets

Four main ways to specify targets:

1. **CSS Selector** - Target elements using standard CSS selectors
```javascript
animate('.square', { x: 100 });
```

2. **DOM Elements** - Direct references to DOM node objects
```javascript
const element = document.querySelector('.square');
animate(element, { x: 100 });
```

3. **JavaScript Objects** - Plain JavaScript objects with animatable properties
```javascript
const obj = { value: 0 };
animate(obj, { value: 100 });
```

4. **Array of targets** - Multiple targets animated simultaneously
```javascript
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

**Example:**
```javascript
animate('.square', {
  translateX: 100,
  scale: 2,
  opacity: .5,
  duration: 400,
});
```

### Keyframes

#### Property Value Keyframes

**Tween Values Array:**
```javascript
animate('.square', {
  x: [0, 100, 200],
  y: [0, 100, 200],
  duration: 3000,
})
```

**Tween Parameters Array:**
```javascript
animate('.square', {
  x: [{to: 100}, {to: 200}],
  y: [{to: 100}, {to: 200}],
  duration: 3000,
})
```

#### Animation-Level Keyframes

**Duration Based (Array of Objects):**
```javascript
animate('.square', {
  keyframes: [
    { x: 100, y: 100 },
    { x: 200, y: 200 },
  ],
  duration: 3000,
})
```

**Percentage Based (Object with Time Keys):**
```javascript
animate('.square', {
  keyframes: {
    '0%'  : { x: 0,   y: 0   },
    '50%' : { x: 100, y: 100 },
    '100%': { x: 200, y: 200 },
  },
  duration: 3000,
})
```

### Playback Settings

- `delay` - Controls initial timing before animation starts
- `duration` - Specifies animation length
- `loop` - Enables repeating behavior (true for infinite, number for specific count)
- `loopDelay` - Sets pause between loop iterations
- `alternate` - Reverses direction on each cycle
- `reversed` - Inverts playback direction
- `autoplay` - Begins automatically upon creation
- `frameRate` - Defines refresh rate (accepts boolean or numeric value)
- `playbackRate` - Adjusts playback speed

### Animation Callbacks

Execute functions at specific points during animation playback:

1. **onBegin** - Triggers at animation start
2. **onComplete** - Triggers when animation finishes
3. **onBeforeUpdate** - Triggers before each update
4. **onUpdate** - Triggers during animation updates
5. **onRender** - Triggers on each render frame
6. **onLoop** - Triggers when loop iteration completes
7. **onPause** - Triggers when animation pauses
8. **then()** - Promise-based callback method

**Example:**
```javascript
animate('.square', {
  x: 100,
  onBegin: () => console.log('Animation started'),
  onUpdate: (self) => console.log('Progress:', self.progress),
  onComplete: () => console.log('Animation finished'),
});
```

### Animation Methods

Available methods on Animation instances:

1. **play()** - Start animation playback
2. **reverse()** - Play animation backwards
3. **pause()** - Halt animation without resetting
4. **restart()** - Reset and restart from beginning
5. **alternate()** - Toggle between forward/backward direction
6. **resume()** - Continue from paused state
7. **complete()** - Jump to animation end
8. **cancel()** - Stop and remove animation
9. **revert()** - Restore original element state
10. **reset()** - Return to initial state
11. **seek()** - Jump to specific time position
12. **stretch()** - Extend animation duration
13. **refresh()** - Recalculate animation values

**Usage Pattern:**
```javascript
const animation = animate(target, parameters);
animation.play();
animation.pause();
animation.restart();
```

---

## Timer

### Overview

The `createTimer()` function schedules and controls timed callbacks as an alternative to `setTimeout()` or `setInterval()`, keeping animations and callbacks synchronized.

### Import Methods

**From main module:**
```javascript
import { createTimer } from 'animejs';
const timer = createTimer(parameters);
```

**From subpath:**
```javascript
import { createTimer } from 'animejs/timer';
```

### Parameters

Accepts an object containing Timer playback settings and Timer callbacks.

**Return Value:** Returns a `Timer` instance.

### Code Example

```javascript
import { createTimer, utils } from 'animejs';

const [ $time, $count ] = utils.$('.value');

createTimer({
  duration: 1000,
  loop: true,
  frameRate: 30,
  onUpdate: self => $time.innerHTML = self.currentTime,
  onLoop: self => $count.innerHTML = self._currentIteration
});
```

### Timer Playback Settings

Nine configuration options available:

1. **delay** - Controls initial timing before timer starts
2. **duration** - Specifies timer length
3. **loop** - Enables repeating behavior
4. **loopDelay** - Sets pause between loop iterations
5. **alternate** - Reverses direction on each cycle
6. **reversed** - Inverts playback direction
7. **autoplay** - Begins automatically upon creation
8. **frameRate** - Defines refresh rate (accepts boolean or numeric value)
9. **playbackRate** - Adjusts playback speed

**Configuration Example:**
```javascript
createTimer({
  duration: 1000,
  frameRate: true,
  loop: true,
  onBegin: () => {},
  onLoop: () => {},
  onUpdate: () => {},
});
```

### Timer Callbacks

- `onBegin` - Triggers at timer start
- `onComplete` - Triggers when timer finishes
- `onUpdate` - Triggers during timer updates
- `onLoop` - Triggers when loop iteration completes
- `onPause` - Triggers when timer pauses
- `then()` - Promise-based callback method

### Timer Methods

- `play()` - Start timer
- `reverse()` - Play timer backwards
- `pause()` - Halt timer
- `restart()` - Reset and restart
- `alternate()` - Toggle direction
- `resume()` - Continue from paused state
- `complete()` - Jump to end
- `reset()` - Return to initial state
- `cancel()` - Stop and cancel timer
- `revert()` - Revert changes
- `seek()` - Jump to specific time
- `stretch()` - Adjust duration

### Timer Properties

- `currentTime` - Current playback time
- `progress` - Animation progress (0-1)
- `state` - Current state of the timer
- Related timing data

---

## Timeline

### Overview

Timelines coordinate multiple animations and timers in sequence or parallel.

### Timeline Creation

```javascript
import { createTimeline } from 'animejs';
const timeline = createTimeline(parameters);
```

**Alternative Import:**
```javascript
import { createTimeline } from 'animejs/timeline';
```

### Core Methods

**Adding Content:**
- `add()` - Adds animations or timers to the timeline
- `sync()` - Synchronizes WAAPI animations or other timelines
- `call()` - Executes callback functions at specific positions
- `label()` - Creates named position markers
- `set()` - Sets property values
- `remove()` - Removes items from the timeline

**Playback Control:**
- `play()`, `pause()`, `resume()`, `reverse()`, `restart()`, `alternate()`
- `complete()` - Jumps to the end
- `cancel()` - Stops and cancels animation
- `reset()` - Returns to initial state
- `revert()` - Reverts property changes
- `seek()` - Moves to a specific time position
- `stretch()` - Adjusts duration
- `refresh()` - Recalculates values
- `init()` - Initializes the timeline

### Playback Settings

Configure via parameters object:
- `defaults` - Default animation settings
- `delay`, `duration`, `loop`, `loopDelay`
- `alternate`, `reversed`, `autoplay`
- `frameRate`, `playbackRate`, `playbackEase`

### Callbacks

Timeline events include:
- `onBegin`, `onComplete`
- `onBeforeUpdate`, `onUpdate`, `onRender`
- `onLoop`, `onPause`
- `then()`

### Example Usage

```javascript
const tl = createTimeline({ defaults: { duration: 750 } });

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

---

## Animatable

### Overview

The `createAnimatable()` function creates instances designed to efficiently animate target properties, making it an ideal replacement for `animate()` and `utils.set()` in situations where values change frequently.

### Import Methods

**From main module:**
```javascript
import { createAnimatable } from 'animejs';
```

**From standalone subpath:**
```javascript
import { createAnimatable } from 'animejs/animatable';
```

### Function Signature

```javascript
const animatable = createAnimatable(targets, parameters);
```

### Parameters

| Parameter | Accepts |
|-----------|---------|
| `targets` | CSS selectors, DOM elements, JS objects, or arrays |
| `parameters` | Object of Animatable settings |

### Returns

An `Animatable` instance with property functions supporting both getters and setters:

```javascript
animatable.propertyName(value, duration, ease); // Triggers animation
animatable.propertyName(); // Returns current value
```

**Important:** Only `Number` or `Array<Number>` types are accepted for performance optimization.

### Practical Example

```javascript
const animatableSquare = createAnimatable('.square', {
  x: 500, // x duration: 500ms
  y: 500, // y duration: 500ms
  ease: 'out(3)',
});

animatableSquare.x(x); // Animate x value
animatableSquare.y(y); // Animate y value
```

---

## Draggable

### Overview

The Draggable feature adds draggable capabilities to DOM Elements.

### Import Methods

**From main module:**
```javascript
import { createDraggable } from 'animejs';
const draggable = createDraggable(target, parameters);
```

**From subpath:**
```javascript
import { createDraggable } from 'animejs/draggable';
```

### Basic Usage

```javascript
createDraggable('.square');
```

### Parameters

The `createDraggable()` function accepts:
- **target**: CSS Selector or DOM Element
- **parameters** (optional): Object containing axes parameters, settings, and callbacks

### Configuration Categories

**Axes Parameters:**
- `x`, `y` - Axis constraints
- `snap` - Snap to values
- `modifier` - Value transformation
- `mapTo` - Map drag to other properties

**Settings:**
- `trigger` - Drag trigger element
- `container` - Constraint container
- `containerPadding` - Container padding
- `containerFriction` - Container friction
- `releaseContainerFriction` - Release friction
- `releaseMass` - Release mass
- `releaseStiffness` - Release stiffness
- `releaseDamping` - Release damping
- `velocityMultiplier` - Velocity multiplier
- `minVelocity` - Minimum velocity
- `maxVelocity` - Maximum velocity
- `releaseEase` - Release easing
- `dragSpeed` - Drag speed
- `dragThreshold` - Drag threshold
- `scrollThreshold` - Scroll threshold
- `scrollSpeed` - Scroll speed
- `cursor` - Cursor style

**Callbacks:**
- `onGrab` - Triggered when grabbed
- `onDrag` - Triggered during drag
- `onUpdate` - Triggered on update
- `onRelease` - Triggered on release
- `onSnap` - Triggered on snap
- `onSettle` - Triggered when settled
- `onResize` - Triggered on resize
- `onAfterResize` - Triggered after resize

### Methods

- `disable()` - Disable dragging
- `enable()` - Enable dragging
- `setX()` - Set X position
- `setY()` - Set Y position
- `animateInView()` - Animate into view
- `scrollInView()` - Scroll into view
- `stop()` - Stop dragging
- `reset()` - Reset position
- `revert()` - Revert changes
- `refresh()` - Refresh draggable

### Return Value

Returns a `Draggable` instance with full API access to properties and methods.

---

## Scope

### Overview

The Scope feature enables instances to react to media queries, use custom root elements, share default parameters, and be reverted in batch.

### Creating a Scope

```javascript
import { createScope } from 'animejs';
const scope = createScope(parameters);
```

**Alternative Import:**
```javascript
import { createScope } from 'animejs/scope';
```

### Parameters

Accepts optional Scope parameters including:
- `mediaQueries` - Define responsive breakpoints
- `root` - Specify custom root element
- `defaults` - Share default animation settings

### Core Methods

- **add()** - Add constructor function
- **addOnce()** - Add single-execution constructor
- **keepTime()** - Maintain animation timing
- **revert()** - Batch revert all animations
- **refresh()** - Refresh scope state

### Code Example

```javascript
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

The scope automatically reacts to media query changes and accessibility preferences.

---

## SVG Features

### Overview

Anime.js provides three primary SVG utility functions for advanced SVG animations.

### Import Methods

**From the svg object:**
```javascript
import { svg } from 'animejs';
svg.morphTo();
svg.createMotionPath();
svg.createDrawable();
```

**Directly from main module:**
```javascript
import { morphTo, createMotionPath, createDrawable } from 'animejs';
```

**From subpath:**
```javascript
import { morphTo, createMotionPath, createDrawable } from 'animejs/svg';
```

### The Three SVG Functions

1. **morphTo()** - Enables morphing animations between SVG shapes
2. **createDrawable()** - Creates drawable SVG elements for line-drawing animations
3. **createMotionPath()** - Generates motion path animations along SVG paths

---

## Utilities

### Overview

Anime.js provides extensive utility functions for DOM manipulation, random generation, mathematical operations, and animation helpers.

### Import Methods

**From utils object:**
```javascript
import { utils } from 'animejs';
utils.stagger();
```

**Direct imports:**
```javascript
import { stagger, $, get, set } from 'animejs';
```

**Subpath imports:**
```javascript
import { stagger, $ } from 'animejs/utils';
```

### stagger() Utility

Creates sequential effects by distributing values progressively across multiple targets.

**Basic Syntax:**
```javascript
import { stagger } from 'animejs';
const functionValue = stagger(value, parameters);
```

**Parameters:**
- **value**: Stagger value (numerical or range)
- **parameters** (optional): Configuration object

**Return Value:** Function-based value for use in animations

**Usage Example:**
```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  x: '17rem',
  scale: stagger([1, .1]),
  delay: stagger(100),
});
```

**Key Capabilities:**

1. **Time Staggering** - Distributes delays across sequential targets
2. **Values Staggering** - Progressively assigns different values to each target
3. **Timeline Staggering** - Controls position timing across multiple animations

**Stagger Parameters:**
- `start` - Initial stagger point
- `from` - Stagger direction origin
- `reversed` - Reverses stagger order
- `ease` - Easing function for distribution
- `grid` - 2D grid-based staggering
- `axis` - Grid axis specification
- `modifier` - Custom value transformation
- `use` - Value application method
- `total` - Total target count

### DOM & Animation Utilities

- `$()` - DOM selector utility
- `get()` - Get property values
- `set()` - Set property values
- `cleanInlineStyles()` - Remove inline styles
- `remove()` - Remove elements
- `sync()` - Synchronize animations
- `keepTime()` - Time keeper functionality

### Random Utilities

**random()**

Generates a random number within a specified range with optional decimal precision.

**Signature:**
```javascript
const randomValue = utils.random(min, max, decimalLength);
```

**Parameters:**
- `min` (Number): Minimum value
- `max` (Number): Maximum value
- `decimalLength` (Number, optional): Decimal places (default: 0)

**Returns:** Number

**Example:**
```javascript
import { utils } from 'animejs';

utils.set('.square', {
  x: () => utils.random(2, 18, 2) + 'rem',
  rotate: () => utils.random(0, 180),
  scale: () => utils.random(.25, 1.5, 3),
});
```

**Other Random Utilities:**
- `createSeededRandom()` - Create seeded random generator
- `randomPick()` - Pick random items
- `shuffle()` - Shuffle arrays

### Math Utilities

- `round()` - Round numbers
- `clamp()` - Constrain values within range
- `snap()` - Snap to values
- `wrap()` - Wrap values
- `mapRange()` - Map value between ranges
- `lerp()` - Linear interpolation
- `damp()` - Damping function
- `roundPad()` - Round with padding
- `padStart()` - Pad string start
- `padEnd()` - Pad string end
- `degToRad()` - Convert degrees to radians
- `radToDeg()` - Convert radians to degrees
- **Chain-able utilities** - Functions supporting method chaining

---

## Easings

### Overview

Anime.js provides several easing function categories for controlling animation timing curves.

### Available Easing Types

1. **Built-in eases** - Pre-configured easing curves
2. **Cubic Bézier** - Custom curve-based easing
3. **Linear** - Constant rate of change
4. **Steps** - Discrete step-based transitions
5. **Irregular** - Custom non-standard easing patterns
6. **Spring** - Physics-based spring animations

### Import Syntax

```javascript
// From main module via easings object
import { easings } from 'animejs';
easings.eases.inOut(3);

// Direct imports from main module
import { eases, cubicBezier, spring } from 'animejs';

// Standalone subpath import
import { eases, cubicBezier, spring } from 'animejs/easings';
```

### Built-in Easing Functions

Complete list of available easings:

| Type | Parameters | Variants |
|------|-----------|----------|
| **Linear** | — | `'linear'` |
| **Power** | power = `1.675` | `'in'`, `'out'`, `'inOut'`, `'outIn'` |
| **Quad** | — | `'inQuad'`, `'outQuad'`, `'inOutQuad'`, `'outInQuad'` |
| **Cubic** | — | `'inCubic'`, `'outCubic'`, `'inOutCubic'`, `'outInCubic'` |
| **Quart** | — | `'inQuart'`, `'outQuart'`, `'inOutQuart'`, `'outInQuart'` |
| **Quint** | — | `'inQuint'`, `'outQuint'`, `'inOutQuint'`, `'outInQuint'` |
| **Sine** | — | `'inSine'`, `'outSine'`, `'inOutSine'`, `'outInSine'` |
| **Exponential** | — | `'inExpo'`, `'outExpo'`, `'inOutExpo'`, `'outInExpo'` |
| **Circular** | — | `'inCirc'`, `'outCirc'`, `'inOutCirc'`, `'outInCirc'` |
| **Bounce** | — | `'inBounce'`, `'outBounce'`, `'inOutBounce'`, `'outInBounce'` |
| **Back** | overshoot = `1.70158` | `'inBack'`, `'outBack'`, `'inOutBack'`, `'outInBack'` |
| **Elastic** | amplitude = `1`, period = `.3` | `'inElastic'`, `'outElastic'`, `'inOutElastic'`, `'outInElastic'` |

### Usage Examples

**String notation:**
```javascript
animate(target, { x: 100, ease: 'outQuad' });
animate(target, { x: 100, ease: 'outElastic(.8, 1.2)' });
```

**Via eases object:**
```javascript
import { eases } from 'animejs';

eases.outQuad;
eases.outElastic(.8, 1.2);
```

**Code example:**
```javascript
import { animate, waapi } from 'animejs';

animate('.row:nth-child(1) .square', {
  x: '17rem',
  rotate: 360,
  ease: 'inOut',
});

animate('.row:nth-child(2) .square', {
  x: '17rem',
  rotate: 360,
  ease: 'inOut(3)',
});

waapi.animate('.row:nth-child(3) .square', {
  x: '17rem',
  rotate: 360,
  ease: 'inOutExpo',
});
```

### Cubic Bézier

Custom curve-based easing:

```javascript
animate(target, { x: 100, ease: cubicBezier(.7, .1, .5, .9) });
```

**Parameters:** Accepts four decimal control point values (x1, y1, x2, y2)

### Spring Easing

Physics-based spring animations with automatic duration calculation.

```javascript
animate(target, { x: 100, ease: spring({ bounce: .35 }) });
```

#### Perceived Parameters (Intuitive Controls)

Uses Apple's SwiftUI spring model for visual feel:

- **bounce** (Number): Range -1 to 1, default 0.5
  - Values 0-1 create bouncy effects
  - Negative values create over-damped curves
  - Recommended range: -0.5 to 0.5

- **duration** (Number): Perceived completion time in milliseconds
  - Range: 10-10,000ms, default 628ms
  - Represents when animation appears visually complete

#### Physics Parameters (Direct Control)

For precise physics simulation:

- **mass** (Number): Range 1-10,000, default 1
  - Higher values increase inertia and slow motion

- **stiffness** (Number): Range 0-10,000, default 100
  - Higher values create tighter, faster-responding springs

- **damping** (Number): Range 0-10,000, default 10
  - Higher values reduce oscillation bounce

- **velocity** (Number): Range -10,000 to 10,000, default 0
  - Positive values provide initial momentum in target direction

#### Perceived onComplete Callback

A separate spring-level callback fires when perceived duration is reached, rather than actual settling completion. This synchronizes callback timing with visual completion.

---

## Web Animation API (WAAPI)

### Overview

A lightweight 3KB version exists: `waapi.animate()` for Web Animation API support, though with reduced features compared to the full Anime.js version.

### Usage

```javascript
import { waapi } from 'animejs';

waapi.animate('.square', {
  x: '17rem',
  rotate: 360,
  ease: 'inOutExpo',
});
```

### When to Use

- For simpler animations with hardware acceleration
- When file size is critical (3KB vs 10KB)
- For better performance on supported browsers

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
import { animate } from 'animejs';

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

### Staggered Animation

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

### Timeline Animation

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({
  loop: true,
  loopDelay: 500
});

tl.add('.box1', {
    translateX: 250,
    duration: 1000,
    ease: 'outExpo'
  })
  .add('.box2', {
    translateX: 250,
    duration: 1000,
    ease: 'outExpo'
  }, '-=800')  // Overlap by 800ms
  .add('.box3', {
    translateX: 250,
    duration: 1000,
    ease: 'outExpo'
  }, '-=800');
```

### Spring Animation

```javascript
import { animate, spring } from 'animejs';

animate('.element', {
  translateY: -100,
  rotate: 360,
  ease: spring({
    bounce: 0.4,
    duration: 800
  })
});
```

### Text Animation

```javascript
import { animate, stagger, splitText } from 'animejs';

const { chars } = splitText('h1', {
  words: false,
  chars: true
});

animate(chars, {
  translateY: [-100, 0],
  opacity: [0, 1],
  delay: stagger(50),
  duration: 800,
  ease: 'outExpo'
});
```

### Grid-Based Stagger

```javascript
import { animate, stagger } from 'animejs';

// Grid-based stagger
animate('.square', {
  scale: stagger([0.5, 1], {
    grid: [5, 5],
    from: 'center',
    ease: 'outQuad'
  }),
  delay: stagger(100, {
    grid: [5, 5],
    from: 'center'
  })
});
```

### Random Values

```javascript
import { animate, utils } from 'animejs';

utils.set('.square', {
  x: () => utils.random(2, 18, 2) + 'rem',
  rotate: () => utils.random(0, 180),
  scale: () => utils.random(.25, 1.5, 3),
});
```

### Responsive Animations with Scope

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

---

## Additional Resources

- **CodePen Examples:** Collection of live examples
- **GitHub Repository:** https://github.com/juliangarnier/anime
- **Easing Editor Tool:** Interactive easing function editor at https://animejs.com/easing-editor
- **Migration Guide:** Available on GitHub for upgrading from v3

---

## Version History

- **4.0.0** - Current version with enhanced features
- **3.2.2** - Legacy version
- **2.1.0** - Legacy version

---

*Documentation compiled from https://animejs.com/documentation/ - January 2026*
