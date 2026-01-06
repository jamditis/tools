# Anime.js Stagger Utility - Complete Documentation

## Overview

The `stagger()` function in Anime.js is a utility for distributing animations across multiple elements with precise timing and value control. It creates sequential effects by distributing values progressively across multiple targets.

**Version:** Available since v2.0.0
**V4 Update:** The `direction` parameter has been renamed to `reversed` to better align with the new playback API.

---

## Import Methods

Utilities are accessible through three approaches:

```javascript
// 1. Via utils object
import { utils } from 'animejs';
utils.stagger();

// 2. Direct imports
import { stagger, animate } from 'animejs';

// 3. Subpath imports
import { stagger } from 'animejs/utils';
```

---

## Function Signature

```javascript
const functionValue = stagger(value, parameters);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | Number, String, or Array | Required - defines the values to distribute |
| `parameters` | Object | Optional - configures stagger behavior |

### Return Value

Returns a function-based value that can be used in animation properties.

---

## Stagger Modes

### 1. Time Staggering

Distributes delays and durations across elements sequentially. Time-related properties like `delay` and `duration` accept function-based values, enabling the use of the stagger function.

**Example:**

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  x: '17rem',
  delay: stagger(100),
  duration: stagger(200, { start: 500 }),
  loop: true,
  alternate: true
});
```

**Result for 4 elements:**
- Element 1: delay: 0ms, duration: 500ms
- Element 2: delay: 100ms, duration: 700ms
- Element 3: delay: 200ms, duration: 900ms
- Element 4: delay: 300ms, duration: 1100ms

### 2. Values Staggering

All tweens' animatable properties accept function-based values, enabling staggered values across multiple targets. Each target receives a staggered value, increasing by a set number for each subsequent target.

**Example:**

```javascript
import { animate, stagger } from 'animejs';

const animation = animate('.square', {
  y: stagger(['-2.75rem', '2.75rem']),
  rotate: { from: stagger('-.125turn') },
  loop: true,
  alternate: true
});
```

### 3. Timeline Staggering

Controls positions within timeline sequences for coordinated animations.

**Example:**

```javascript
createTimeline()
  .add('.tick', {
    y: '-=6',
    duration: 50,
  }, stagger(10))
```

---

## Value Types

### Numerical Values

Numerical stagger values define the increment amount applied to each successive element.

**Accepts:**
- Numbers: `100`
- Strings with Numbers: `'5.75rem'`

**Example:**

```javascript
animate('.square', {
  x: stagger('5.75rem'),    // Position increases by 5.75rem per element
  delay: stagger(100)        // Timing increases by 100ms per element
});
```

**Result for 4 elements:**
- Element 1: 0rem translation, 0ms delay
- Element 2: 5.75rem translation, 100ms delay
- Element 3: 11.5rem translation, 200ms delay
- Element 4: 17.25rem translation, 300ms delay

### Range Values

Range values distribute values evenly between two numerical values.

**Syntax:** `[Number|String, Number|String]`

**Example:**

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  y: stagger(['2.75rem', '-2.75rem']),
  delay: stagger([0, 500]),
});
```

---

## Stagger Parameters

### `start`

Defines the starting value of the stagger, adding an offset to staggered calculations.

- **Accepts:** Number or Timeline time position
- **Default:** `0`

**Example:**

```javascript
animate('.square', {
  x: stagger('1rem', { start: 14 }),
  delay: stagger(100, { start: 500 }),
});
```

The `start: 14` adds 14 to x-axis values, while `start: 500` adds 500 milliseconds to delay timings.

---

### `from`

Defines where the stagger effect begins its animation sequence.

- **Default:** `0`

**Accepted Values:**

| Value | Purpose |
|-------|---------|
| Number | The starting index of the effect |
| `'first'` | Equivalent to index `0` |
| `'center'` | Starts the effect from the center |
| `'last'` | Starts the effect from the last element |
| `'random'` | Randomizes the order of the staggered values |

**Examples:**

```javascript
// Starting from index 7
delay: stagger(25, { from: 7 })

// Starting from first element
delay: stagger(25, { from: 'first' })

// Starting from center
delay: stagger(25, { from: 'center' })

// Starting from last element
delay: stagger(25, { from: 'last' })

// Random starting order
delay: stagger(25, { from: 'random' })
```

---

### `reversed`

Controls whether the stagger effect operates in reverse order.

- **Accepts:** Boolean
- **Default:** `false`
- **Available Since:** v2.0.0
- **V4 Change:** Renamed from `direction` to `reversed`

**Example:**

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  translateX: '17rem',
  delay: stagger(100, { reversed: true }),
});
```

**Result for 4 elements with `reversed: true`:**
- First element: 300ms delay
- Second element: 200ms delay
- Third element: 100ms delay
- Fourth element: 0ms delay

**V4 Example:**

```javascript
stagger('1rem', { reversed: true })
// Produces values like: 4rem, 3rem, 2rem, 1rem, 0rem
```

---

### `ease`

Controls how easing is applied to the distribution of staggered values.

- **Accepts:** Any valid ease function
- **Default:** `'linear'`
- **Available Since:** v2.0.0

**Example:**

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  y: stagger(['2.75rem', '-2.75rem'], { ease: 'inOut(3)' }),
  delay: stagger(100, { ease: 'inOut(3)' }),
});
```

The easing function shapes how values distribute across elements, creating a more dynamic effect compared to linear distribution.

---

### `grid`

Distributes animation delays across a two-dimensional array layout.

- **Syntax:** `grid: [<columns>, <rows>]`
- **Accepts:** `[Number, Number]`
- **Default:** `null`

**Example:**

```javascript
animate($squares, {
  scale: [{ to: [0, 1.25] }, { to: 0 }],
  delay: stagger(100, {
    grid: [11, 4],
    from: utils.random(0, 11 * 4)
  })
});
```

**With Timeline:**

```javascript
const options = {
  grid: [13, 13],
  from: 'center',
};

createTimeline()
  .add('.dot', {
    scale: stagger([1.1, .75], options),
    ease: 'inOutQuad',
  }, stagger(200, options));
```

---

### `axis`

Defines the direction of a staggered grid effect by restricting which axis of the grid can update.

- **Accepts:** `'x'` or `'y'`
- **Default:** `null`

**Example:**

```javascript
import { animate, stagger, utils } from 'animejs';

const grid = [11, 4];
const $squares = utils.$('.square');
const randomIndex = utils.random(0, 11 * 4);

animate($squares, {
  translateX: [
    { to: stagger('-.75rem', { grid, from: randomIndex, axis: 'x' }) },
    { to: 0, ease: 'inOutQuad' }
  ],
  translateY: [
    { to: stagger('-.75rem', { grid, from: randomIndex, axis: 'y' }) },
    { to: 0, ease: 'inOutQuad' }
  ],
  delay: stagger(85, { grid, from: randomIndex })
});
```

---

### `modifier`

Allows you to transform staggered values through a custom function.

**Function Signature:**

```javascript
modifier: (value) => Number|String
```

**Parameters:**
- `value`: The current animated numerical value being processed

**Returns:** Number or String representing the modified value

**Example:**

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  boxShadow: [
    { to: stagger([1, .25], {
        modifier: v => `0 0 ${v * 30}px ${v * 20}px currentColor`,
        from: 'center'
      })
    },
    { to: 0 },
  ],
  delay: stagger(100, { from: 'center' }),
  loop: true
});
```

The modifier transforms numerical values into CSS box-shadow string values, multiplying the staggered value by 30 for blur radius and 20 for spread radius.

---

### `use`

Enables custom staggering sequencing by referencing an attribute or property on target elements.

- **Accepts:** String (valid property or attribute name)
- **Default:** `null`

**Important:** Target properties or attributes must contain numbered values beginning at `0`.

**Note:** When using `use` with `from`, `reversed`, or `ease` parameters, you must explicitly define a `total` parameter value if your highest custom index falls below the actual number of staggered targets.

**Example:**

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  x: '17rem',
  rotate: 90,
  delay: stagger(250, { use: 'data-index' }),
});
```

**HTML:**

```html
<div class="square" data-index="2"></div>
<div class="square" data-index="0"></div>
<div class="square" data-index="3"></div>
<div class="square" data-index="1"></div>
```

Elements animate in sequence 0→1→2→3 based on their `data-index` values, rather than their DOM order.

---

### `total`

Specifies a custom staggering length rather than relying on the actual number of staggered targets.

- **Accepts:** Number
- **Default:** `null`

**Purpose:** Useful when the max value of the custom order defined using the `use` parameter is lower than the actual number of staggered targets when using `from`, `reversed`, or `ease` parameters.

**Example:**

```javascript
import { animate, stagger } from 'animejs';

animate('.square', {
  x: '17rem',
  rotate: 90,
  delay: stagger(250, { use: 'data-index', total: 2, reversed: true }),
});
```

In this scenario, four square elements exist with only two unique `data-index` values (0 and 1). By setting `total: 2`, the stagger effect treats the sequence as having 2 items rather than 4.

---

## Complete Examples

### Basic Stagger Example

```javascript
animate('.square', {
  x: '17rem',
  scale: stagger([1, .1]),
  delay: stagger(100),
});
```

### Stagger with Draw Animation

```javascript
animate(createDrawable('path'), {
  draw: ['0 0', '0 1', '1 1'],
  delay: stagger(40),
  ease: 'inOut(3)',
  autoplay: onScroll({ sync: true }),
});
```

### Grid-Based Stagger from Center

```javascript
animate('.square', {
  x: '320',
  rotate: { from: -180 },
  duration: 1250,
  delay: stagger(65, { from: 'center' }),
  ease: 'inOutQuint',
  loop: true,
  alternate: true
});
```

### Advanced Grid Staggering with Axis

This example from the official CodePen demonstrates a complex grid animation:

```javascript
function fitElementToParent(el, padding) {
  var timeout = null;
  function resize() {
    if (timeout) clearTimeout(timeout);
    anime.set(el, {scale: 1});
    var pad = padding || 0;
    var parentEl = el.parentNode;
    var elOffsetWidth = el.offsetWidth - pad;
    var parentOffsetWidth = parentEl.offsetWidth;
    var ratio = parentOffsetWidth / elOffsetWidth;
    timeout = setTimeout(anime.set(el, {scale: ratio}), 10);
  }
  resize();
  window.addEventListener('resize', resize);
}

var advancedStaggeringAnimation = (function() {
  var staggerVisualizerEl = document.querySelector('.stagger-visualizer');
  var dotsWrapperEl = staggerVisualizerEl.querySelector('.dots-wrapper');
  var dotsFragment = document.createDocumentFragment();
  var grid = [20, 10];
  var cell = 55;
  var numberOfElements = grid[0] * grid[1];
  var animation;
  var paused = true;

  fitElementToParent(staggerVisualizerEl, 0);

  for (var i = 0; i < numberOfElements; i++) {
    var dotEl = document.createElement('div');
    dotEl.classList.add('dot');
    dotsFragment.appendChild(dotEl);
  }

  dotsWrapperEl.appendChild(dotsFragment);

  var index = anime.random(0, numberOfElements-1);
  var nextIndex = 0;

  anime.set('.stagger-visualizer .cursor', {
    translateX: anime.stagger(-cell, {grid: grid, from: index, axis: 'x'}),
    translateY: anime.stagger(-cell, {grid: grid, from: index, axis: 'y'}),
    translateZ: 0,
    scale: 1.5,
  });

  function play() {
    paused = false;
    if (animation) animation.pause();
    nextIndex = anime.random(0, numberOfElements-1);

    animation = anime.timeline({
      easing: 'easeInOutQuad',
      complete: play
    })
    .add({
      targets: '.stagger-visualizer .cursor',
      keyframes: [
        { scale: .75, duration: 120},
        { scale: 2.5, duration: 220},
        { scale: 1.5, duration: 450},
      ],
      duration: 300
    })
    .add({
      targets: '.stagger-visualizer .dot',
      keyframes: [
        {
          translateX: anime.stagger('-2px', {grid: grid, from: index, axis: 'x'}),
          translateY: anime.stagger('-2px', {grid: grid, from: index, axis: 'y'}),
          duration: 100
        }, {
          translateX: anime.stagger('4px', {grid: grid, from: index, axis: 'x'}),
          translateY: anime.stagger('4px', {grid: grid, from: index, axis: 'y'}),
          scale: anime.stagger([2.6, 1], {grid: grid, from: index}),
          duration: 225
        }, {
          translateX: 0,
          translateY: 0,
          scale: 1,
          duration: 1200,
        }
      ],
      delay: anime.stagger(80, {grid: grid, from: index})
    }, 30)
    .add({
      targets: '.stagger-visualizer .cursor',
      translateX: { value: anime.stagger(-cell, {grid: grid, from: nextIndex, axis: 'x'}) },
      translateY: { value: anime.stagger(-cell, {grid: grid, from: nextIndex, axis: 'y'}) },
      scale: 1.5,
      easing: 'cubicBezier(.075, .2, .165, 1)'
    }, '-=800')

    index = nextIndex;
  }

  play();
})();
```

---

## Quick Reference

### All Parameters at a Glance

```javascript
stagger(value, {
  start: 0,              // Number or timeline position
  from: 'first',         // Number, 'first', 'center', 'last', 'random'
  reversed: false,       // Boolean
  ease: 'linear',        // Ease function
  grid: [10, 10],        // [columns, rows]
  axis: 'x',             // 'x' or 'y'
  modifier: v => v,      // Function: value => Number|String
  use: 'data-index',     // String (attribute/property name)
  total: null            // Number
})
```

### Common Use Cases

```javascript
// Simple delay stagger
delay: stagger(100)

// Stagger from center
delay: stagger(100, { from: 'center' })

// Grid stagger
delay: stagger(100, { grid: [10, 5], from: 'center' })

// Range values
scale: stagger([1, 0.5])

// With easing
delay: stagger(100, { ease: 'inOutQuad' })

// Reversed
delay: stagger(100, { reversed: true })

// Custom modifier
boxShadow: stagger([1, 0], { modifier: v => `0 0 ${v*20}px currentColor` })
```

---

## Sources

- [Anime.js Documentation - Utilities](https://animejs.com/documentation/utilities/)
- [Anime.js Documentation - Stagger Function](https://animejs.com/documentation/utilities/stagger)
- [Stagger Grid Parameter](https://animejs.com/documentation/utilities/stagger/stagger-parameters/stagger-grid/)
- [Stagger From Parameter](https://animejs.com/documentation/utilities/stagger/stagger-parameters/stagger-from/)
- [Stagger Grid Axis](https://animejs.com/documentation/stagger/stagger-parameters/stagger-grid-axis/)
- [GitHub Repository - anime.js](https://github.com/juliangarnier/anime)
- [What's new in Anime.js V4](https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4)
