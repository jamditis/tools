# Anime.js - Complete Documentation Extract

## Overview

**Anime.js** is a fast, multipurpose and lightweight JavaScript animation library with a simple, yet powerful API. It works with CSS properties, SVG, DOM attributes and JavaScript Objects.

- **Current Version:** 4.2.2
- **Author:** Julian Garnier
- **License:** MIT
- **Homepage:** https://animejs.com
- **Repository:** https://github.com/juliangarnier/anime
- **GitHub Stars:** 65.8k
- **Forks:** 4.4k
- **Bundle Size:** 24.50 KB (modular components available separately)

## Key Features

- **Intuitive API** with per-property parameters, flexible keyframes, and built-in easings
- **Enhanced transforms** supporting individual CSS properties and function-based values
- **Scroll Observer** with synchronization modes, advanced thresholds, and callbacks
- **Advanced staggering** for time, values, and timeline positions
- **SVG toolset** enabling shape morphing, line drawing, and motion paths
- **Draggable API** with springs, flick/throw functionality, and comprehensive callbacks
- **Timeline API** for orchestrating sequences and synchronizing animations
- **Responsive animations** through Scope API with media query support
- **Works with:** CSS properties, SVG, DOM attributes, JavaScript Objects, Canvas, WebGL
- **Supports:** Loop and alternate capabilities, customizable duration and delay, multiple easing options

---

## Installation Methods

### 1. NPM Installation

```bash
npm install animejs
```

After installation, import using either ES Modules or CommonJS syntax:

**ES Modules:**
```javascript
import { animate } from 'animejs';
```

**CommonJS:**
```javascript
const { animate } = require('animejs');
```

### 2. CDN - ES Modules

Two providers offer ES module bundles:

**esm.sh:**
```javascript
import { animate } from 'https://esm.sh/animejs';
```

**jsDelivr:**
```javascript
import { animate } from 'https://cdn.jsdelivr.net/npm/animejs/+esm';
```

### 3. CDN - UMD Global Object

Load the minified UMD bundle from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
<script>
  const { animate } = anime;
</script>
```

### 4. Direct Download from GitHub

The repository provides six distribution files in the `/dist` directory:

- `dist/modules/index.js` (ES modules entry)
- `dist/modules/index.cjs` (CommonJS entry)
- `dist/bundles/anime.esm.js` and `.min.js` variants
- `dist/bundles/anime.umd.js` and `.min.js` variants

These support local ES module or UMD global object implementation patterns.

---

## Basic Usage

Anime.js V4 works by importing ES modules:

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

---

## Core Modules and Imports

### Available Subpath Imports

Anime.js v4 provides modular imports for specific functionality:

```javascript
// Main module
import { animate } from 'animejs';

// Specific subpaths
import { animate } from 'animejs/animation';
import { createTimer } from 'animejs/timer';
import { createTimeline } from 'animejs/timeline';
import { createDraggable } from 'animejs/draggable';
import { createScope } from 'animejs/scope';
import { morphTo, createMotionPath, createDrawable } from 'animejs/svg';
import { splitText } from 'animejs/text';
import { eases, cubicBezier, spring } from 'animejs/easings';
import { waapi } from 'animejs/waapi';
import { utils } from 'animejs/utils';
```

### Package.json Keywords

The library supports:
- anime, animejs, anime.js
- timer, animation, timeline
- animatable, draggable, scope
- engine, scroll, easings
- cubic-bezier, spring, splitText
- CSS, SVG, WAAPI, Canvas, WebGL

---

## Animation API

### Core Animation Method

The `animate()` function is the primary way to create animations:

```javascript
import { animate } from 'animejs';

const animation = animate(targets, parameters);
```

### Parameters

The `animate()` method accepts two arguments:

1. **targets**: CSS selectors, DOM elements, JavaScript objects, or arrays of targets
2. **parameters**: An object containing:
   - Animatable properties (CSS, transforms, variables, object properties, HTML/SVG attributes)
   - Tween parameters (to, from, delay, duration, ease, composition, modifier)
   - Playback settings (loop, delay, duration, alternate, reversed, autoplay, frameRate, playbackRate)
   - Callbacks (onBegin, onComplete, onUpdate, onLoop, onPause, then())

### Example with Text Animation

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

### WAAPI Alternative

A lightweight 3KB version powered by the Web Animation API is available:

```javascript
import { waapi } from 'animejs';

const animation = waapi.animate(targets, parameters);
```

---

## Timeline API

Timelines in Anime.js synchronize animations, timers, and callbacks together.

### Creation Methods

**From main module:**
```javascript
import { createTimeline } from 'animejs';
const timeline = createTimeline(parameters);
```

**From subpath:**
```javascript
import { createTimeline } from 'animejs/timeline';
```

### Core Timeline Methods

```javascript
timeline.add(target, animationParameters, position);
timeline.add(timerParameters, position);
timeline.sync(timelineB, position);
timeline.call(callbackFunction, position);
timeline.label(labelName, position);
```

### Example Implementation

```javascript
const tl = createTimeline({ defaults: { duration: 750 } });

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

---

## Timer API

Timers are used to schedule and control timed callbacks as an alternative to `setTimeout()` or `setInterval()` while maintaining synchronization with animations.

### Implementation

**Main module:**
```javascript
import { createTimer } from 'animejs';
const timer = createTimer(parameters);
```

**Standalone subpath:**
```javascript
import { createTimer } from 'animejs/timer';
```

### Example

```javascript
import { createTimer } from 'animejs';

const [ $time, $count ] = utils.$('.value');

createTimer({
  duration: 1000,
  loop: true,
  frameRate: 30,
  onUpdate: self => $time.innerHTML = self.currentTime,
  onLoop: self => $count.innerHTML = self._currentIteration
});
```

### Key Features

- Playback settings (duration, loop, delay, etc.)
- Multiple callback options (onUpdate, onLoop, onBegin, etc.)
- Control methods (play, pause, reset, seek, etc.)
- Properties for monitoring timer state

---

## Easing Functions

### Available Easing Types

- **Built-in eases** (e.g., 'inOut(3)', 'inQuad', 'outQuad', 'inOutQuint')
- **Cubic Bézier curves** - customizable with parameters
- **Linear easing**
- **Steps easing**
- **Irregular easing**
- **Spring physics** - configurable bounce parameter

### Import Methods

**1. From easings object:**
```javascript
import { easings } from 'animejs';
easings.eases.inOut(3);
easings.cubicBezier(.7, .1, .5, .9);
easings.spring({ bounce: .35 });
```

**2. Direct imports from main module:**
```javascript
import { eases, cubicBezier, spring } from 'animejs';
eases.inOut(3);
cubicBezier(.7, .1, .5, .9);
spring({ bounce: .35 });
```

**3. Subpath import:**
```javascript
import { eases, cubicBezier, spring } from 'animejs/easings';
```

### Usage in Animations

```javascript
animate(target, { x: 100, ease: 'inOut(3)' });
animate(target, { x: 100, ease: cubicBezier(.7, .1, .5, .9) });
animate(target, { x: 100, ease: spring({ bounce: .35 }) });
```

---

## SVG Animation

Anime.js provides a dedicated SVG module with three primary animation utilities for advanced vector graphics effects.

### Available Functions

```javascript
import { svg } from 'animejs';
svg.morphTo();
svg.createMotionPath();
svg.createDrawable();
```

Alternatively, import directly:

```javascript
import { morphTo, createMotionPath, createDrawable } from 'animejs';
```

Or as a standalone subpath module:

```javascript
import { morphTo, createMotionPath, createDrawable } from 'animejs/svg';
```

### Core SVG Animation Tools

1. **morphTo()** — Enables shape morphing between different SVG paths, allowing smooth transitions between distinct vector geometries.

2. **createDrawable()** — Facilitates line drawing animations, creating the effect of paths being drawn or revealed progressively across the screen.

3. **createMotionPath()** — Supports motion path animations, allowing elements to follow predefined SVG paths as they animate through space.

---

## Text Animation

Anime.js provides utility functions specifically designed for text animations through its `text` module.

### Import Options

**1. Via the text namespace:**
```javascript
import { text } from 'animejs';
text.splitText();
```

**2. Direct import from main module:**
```javascript
import { splitText } from 'animejs';
```

**3. Standalone subpath import:**
```javascript
import { splitText } from 'animejs/text';
```

### splitText() Function

The primary text animation utility that helps with text animations.

**Settings:**
- lines, words, chars
- debug, includeSpaces, accessible

**Split Parameters:**
- class, wrap, clone

**Methods:**
- `addEffect()` - Apply effects to split text
- `revert()` - Restore original text
- `refresh()` - Update split text

---

## Draggable API

The Draggable feature adds draggable capabilities to DOM Elements.

### Import Methods

**Main module:**
```javascript
import { createDraggable } from 'animejs';
const draggable = createDraggable(target, parameters);
```

**Standalone subpath:**
```javascript
import { createDraggable } from 'animejs/draggable';
```

### Parameters

| Parameter | Type |
|-----------|------|
| `target` | CSS Selector or DOM Element |
| `parameters` (optional) | Object containing axes parameters, settings, and callbacks |

### Basic Usage Example

```javascript
import { createDraggable } from 'animejs';
createDraggable('.square');
```

```html
<div class="large row centered">
  <div class="square draggable"></div>
</div>
```

### Configuration Categories

1. **Axes parameters** — Control x/y positioning, snapping, and mapping
2. **Settings** — Configure triggers, containers, friction, velocity, and cursor behavior
3. **Callbacks** — Handle drag lifecycle events (grab, drag, release, settle, resize)

---

## Scope API (Responsive Animations)

The Scope API enables instances to respond to media queries, use custom root elements, and share default parameters. This is particularly useful for responsive and component-based environments.

### Creation

Scopes are instantiated via `createScope()` from either the main module or the `'animejs/scope'` subpath.

### Media Query Integration

Scopes support a `mediaQueries` parameter that binds CSS media query conditions to readable properties through `self.matches`. This allows animations to adapt dynamically based on viewport size, user preferences (like reduced motion), and other responsive criteria.

### Core Methods

- `add()` - Register constructor functions that execute when the scope initializes
- `addOnce()` - Execute functions once only
- `keepTime()` - Maintain animation timing across scope instances
- `revert()` - Clear all animations and revert DOM changes in batch
- `refresh()` - Update scope state

### Example

```javascript
const { isSmall, reduceMotion } = self.matches;
animate('.square', {
  x: isSmall ? 0 : ['-35vw', '35vw'],
  duration: reduceMotion ? 0 : isSmall ? 750 : 1250
});
```

---

## Migration Guide (v3 to v4)

### Core API Changes

**Import Statement:**
```javascript
// v3
import anime from 'animejs';

// v4
import { animate } from 'animejs';
```

**Animation Syntax:**
```javascript
// v3
anime({
  targets: 'div',
  opacity: 0.5
});

// v4
animate('div', {
  opacity: 0.5
});
```

### Parameter Renames

| v3 | v4 | Notes |
|----|----|-------|
| `targets` | First function argument | Now mandatory |
| `endDelay` | `loopDelay` | Only applies between loops, not after final iteration |
| `easing` | `ease` | Function names shortened (e.g., "easeOutQuad" → "outQuad") |
| `value` | `to` | In object syntax for specific properties |

### Animation Parameters

**Direction Changes:**
```javascript
// v3
anime({ direction: 'reverse' });
anime({ direction: 'alternate' });

// v4
animate(target, { reversed: true });
animate(target, { alternate: true });
```

**Loop Behavior:** The `loop` parameter now defines repetitions rather than total iterations.

**Round/Modifier:**
```javascript
// v3
anime({ round: 100 });

// v4
animate(target, { modifier: utils.round(2) });
```

### Timeline Creation

```javascript
// v3
const tl = anime.timeline();

// v4
import { createTimeline } from 'animejs';
const tl = createTimeline();
```

**Timeline Defaults:**
```javascript
// v3
anime.timeline({ easing: 'easeOutQuad', duration: 250 })

// v4
createTimeline({ defaults: { ease: 'outQuad', duration: 250 } })
```

### Callback Renames

All callbacks now use the `on` prefix:

| v3 | v4 |
|----|-----|
| `update` | `onUpdate` |
| `begin` | `onBegin` |
| `complete` | `onComplete` |
| `loopBegin`/`loopComplete` | `onLoop` |
| `change` | `onRender` |

**Promise Handling:**
```javascript
// v3
anime({ targets: target }).finished.then = () => {};

// v4
animate(target, options).then(() => {});
```

### SVG Utilities

```javascript
// v3
anime.path(selector);
anime.setDashoffset();

// v4
import { svg } from 'animejs';
svg.createMotionPath(selector);
svg.createDrawable();
```

Motion path property names changed: `x`, `y`, `angle` → `translateX`, `translateY`, `rotate`

### Control Methods

- `play()` now always plays forwards; use `resume()` to continue in previous direction
- `reverse()` always plays backwards; use `alternate()` for opposite direction

### Utility Functions

All helpers moved to `utils` import:

```javascript
import { utils } from 'animejs';

utils.remove(targets);
utils.get(target, 'property');
utils.set(target, { prop: value });
utils.random(50, 100);
```

### Spring Easing

```javascript
// v3
easing: 'spring(1, 80, 10, 0)'

// v4
import { createSpring } from 'animejs';
ease: createSpring({ mass: 1, stiffness: 80, damping: 10, velocity: 0 })
```

### Manual Animation Loop

```javascript
import { engine } from 'animejs';

engine.useDefaultMainLoop = false;
engine.pauseOnDocumentHidden = true; // Replaces suspendWhenDocumentHidden

function render() {
  engine.update();
}
renderer.setAnimationLoop(render);
```

**Removed:** `anime.running`, `animation.tick()` method

---

## NPM Development Scripts

First, run `npm i` to install all the necessary packages.
Then, execute the following scripts with `npm run <script>`.

| Script | Action |
| ------ | ------ |
| `dev` | Watches for changes in `src/**/*.js`, bundles the ESM version to `lib/` and creates type declarations in `types/` |
| `dev:test` | Runs `dev` and `test:browser` concurrently |
| `build` | Bundles ESM / UMD / CJS / IIFE versions to `lib/` and creates type declarations in `types/` |
| `test:browser` | Starts a local server and runs all browser-related tests |
| `test:node` | Starts Node-related tests |
| `open:examples` | Starts a local server to browse the examples locally |

---

## Documentation & Resources

- **Full Documentation:** https://animejs.com/documentation
- **Official Website:** https://animejs.com
- **GitHub Repository:** https://github.com/juliangarnier/anime
- **Migration Guide (v3 to v4):** https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4
- **Issues:** https://github.com/juliangarnier/anime/issues

---

## Sponsorship

Anime.js is 100% free and is only made possible with the help of sponsors. Help the project become sustainable by sponsoring on [GitHub Sponsors](https://github.com/sponsors/juliangarnier).

### Platinum Sponsors
- [Ice Open Network](https://ice.io/?ref=animejs)
- [Warp](https://go.warp.dev/anime)
- [Hyperswitch by Juspay](https://hyperswitch.io/?utm_source=julian&utm_medium=github&utm_campaign=animejs_sponsorship)

### Silver Sponsors
- [LambdaTest](https://www.lambdatest.com?utm_source=animeJS&utm_medium=organic&utm_campaign=july_08&utm_term=sk&utm_content=opensource)
- [Inspatial](https://inspatialapp.com/?ref=animejs)

---

## License

© [Julian Garnier](http://juliangarnier.com) | [MIT License](https://github.com/juliangarnier/anime/blob/master/LICENSE.md)

---

## Browser Support

While explicit browser compatibility information is not specified in the documentation, Anime.js v4 uses modern JavaScript features (ES modules) and supports:
- Modern browsers with ES6+ support
- Node.js environments
- Web Animation API (WAAPI) integration for enhanced performance

---

*Document compiled from https://github.com/juliangarnier/anime and https://animejs.com/documentation on 2026-01-06*
