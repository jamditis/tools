# Anime.js ScrollObserver Documentation

Complete documentation for Anime.js ScrollObserver feature (version 4.0.0+)

## Table of Contents

1. [Overview](#overview)
2. [Creation & Basic Usage](#creation--basic-usage)
3. [ScrollObserver Settings](#scrollobserver-settings)
4. [Thresholds](#thresholds)
5. [Synchronisation Modes](#synchronisation-modes)
6. [Callbacks](#callbacks)
7. [Methods](#methods)
8. [Properties](#properties)

---

## Overview

The `onScroll()` function creates ScrollObserver instances that trigger and synchronise Timer, Animation and Timeline instances on scroll. It's available since version 4.0.0 and can be imported from the main `'animejs'` module or the `'animejs/events'` subpath.

### Import Syntax

```javascript
import { onScroll } from 'animejs';
// or
import { onScroll } from 'animejs/events';
```

---

## Creation & Basic Usage

### Creation Syntax

```javascript
import { onScroll } from 'animejs';

onScroll(parameters);
```

### Direct Declaration in autoplay

ScrollObservers can be declared directly in the `autoplay` parameter:

```javascript
animate(targets, {
  x: 100,
  autoplay: onScroll(parameters)
});
```

### Basic Usage Example

```javascript
import { animate, onScroll, utils } from 'animejs';

const [container] = utils.$('.scroll-container');

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  autoplay: onScroll({
    container,
    debug: true
  })
});
```

### Configuration Parameters

The `onScroll()` function accepts an object containing:

- **ScrollObserver settings** (container, target, debug, axis, repeat)
- **Thresholds** (numeric values, position shorthands, relative values, min/max)
- **Synchronisation modes** (method names, playback progress, smooth scroll, eased scroll)
- **Callbacks** (onEnter, onEnterForward, onEnterBackward, onLeave, onLeaveForward, onLeaveBackward, onUpdate, onSyncComplete)

### Return Value

The function returns a `ScrollObserver` instance with access to methods and properties.

---

## ScrollObserver Settings

ScrollObserver settings properties are defined directly within the `onScroll()` parameters object.

### Settings Overview Example

```javascript
animate('.square', {
  x: 100,
  autoplay: onScroll({
    container: '.container',
    target: '.section',
    axis: 'y',
    repeat: true,
    debug: false,
    enter: 'bottom top',
    leave: 'top bottom',
    sync: true,
    onEnter: () => {},
    onLeave: () => {},
    onUpdate: () => {},
  })
});
```

---

### container

The `container` parameter specifies which HTMLElement will trigger the scroll event for the ScrollObserver.

**Accepted Values:**
- **CSS Selector**: String targeting an element (e.g., `'.scroll-container'`)
- **DOM Element**: Direct reference to an HTMLElement object

**Default Value:** `null`

**Example:**

```javascript
import { animate, onScroll } from 'animejs';

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  alternate: true,
  loop: true,
  ease: 'inOutQuad',
  autoplay: onScroll({
    container: '.scroll-container'
  })
});
```

---

### target

The `target` parameter specifies which HTMLElement initiates the scroll event observation. This determines what element's position triggers the ScrollObserver callbacks.

**Accepted Values:**
- **CSS Selector**: String path to target element(s)
- **DOM Element**: Direct reference to an HTMLElement object

**Default Behavior:**
- When defined within an animation: defaults to the first targeted element of that animation
- When defined outside an animation: defaults to `null`

**Example:**

```javascript
import { createTimer, utils, onScroll } from 'animejs';

const [ $timer ] = utils.$('.timer');

createTimer({
  duration: 2000,
  alternate: true,
  loop: true,
  onUpdate: self => {
    $timer.innerHTML = self.iterationCurrentTime
  },
  autoplay: onScroll({
    target: $timer,
    container: '.scroll-container',
  })
});
```

---

### debug

The `debug` setting displays visual markers to help developers better understand the `enter` and `leave` threshold values during scroll observation. Each ScrollObserver instance gets its own unique color for the markers.

The left side of the ruler represents the container threshold, and the right side the target threshold values.

**Syntax:** Boolean

**Default Value:** `false`

**Example:**

```javascript
import { animate, onScroll } from 'animejs';

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  alternate: true,
  loop: true,
  ease: 'inOutQuad',
  autoplay: onScroll({
    container: '.scroll-container',
    debug: true,
  })
});
```

**Key Points:**
- Accepts boolean values only (`true` or `false`)
- Each ScrollObserver instance displays its markers in a distinct color
- Helpful for visualizing threshold positions and debugging scroll-based animations

---

### axis

The `axis` parameter determines which scroll direction triggers the ScrollObserver.

**Syntax:** `'x' | 'y'`

**Accepted Values:**
- `'x'` - Horizontal scrolling
- `'y'` - Vertical scrolling

**Default Value:** `'y'` (vertical scrolling)

**Example:**

```javascript
animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  alternate: true,
  loop: true,
  ease: 'inOutQuad',
  autoplay: onScroll({
    container: '.scroll-container',
    axis: 'x',  // responds to horizontal scroll
  })
});
```

---

### repeat

The `repeat` property controls whether scroll synchronization should continue cycling after a linked animation completes.

**Type:** Boolean
**Default Value:** `true`

**Behavior:**
- **`true` (default):** The scroll synchronization loops continuously, retriggering the animation each time the target element enters the specified scroll threshold
- **`false`:** After the animation completes once, the ScrollObserver instance is reverted and no longer responds to scroll events

**Example:**

```javascript
import { createTimer, onScroll, utils } from 'animejs';

const [ $repeat ] = utils.$('.repeat .value');

createTimer({
  duration: 1000,
  autoplay: onScroll({
    container: '.scroll-container',
    target: '.repeat',
    enter: 'bottom-=40 top',
    leave: 'top+=60 bottom',
    repeat: true,  // Animation re-triggers on each scroll
    debug: true,
  })
});
```

**Use Cases:**
- **`repeat: true`:** Ideal for scroll-triggered animations that should respond every time users scroll through a section
- **`repeat: false`:** Suitable for one-time animations that only execute during the initial scroll encounter

---

## Thresholds

ScrollObserver thresholds determine when actions trigger based on a target element's scrolling position within a container. They're defined using `enter` and `leave` properties in the `onScroll()` parameters.

### How Thresholds Work

The system compares two pairs of values—target and container `start` and `end` positions—to establish trigger conditions.

### Syntax Options

**Object format:** Explicitly specify target and container positions
```javascript
enter: { target: 'top', container: 'bottom' }
leave: { target: 'bottom', container: 'top' }
```

**Container value string:** Container value only; target defaults automatically
```javascript
enter: 'bottom'
leave: 'top'
```

**Shorthand string:** Both values combined
```javascript
enter: 'bottom top'
leave: 'top bottom'
```

### Default Values
- **Enter threshold:** `'end start'`
- **Leave threshold:** `'start end'`

---

### Numeric Values

Numeric values define an offset measurement from the top of either the target element or container when setting ScrollObserver thresholds.

**Accepted Value Types:**

- **Number (pixels):** `100` represents 100px from the top
- **Unit-based:** `'1rem'` specifies 1rem from the top
- **Percentage:** `'10%'` equals 10% of the target or container height, measured from the top

**Default Unit:** `px` when no unit is explicitly specified

**Example:**

```javascript
import { animate, onScroll } from 'animejs';

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  alternate: true,
  loop: true,
  ease: 'inOutQuad',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: '80% 20%',  // 80% from container top, 20% from target top
    leave: '50 -25',   // 50px from container top, -25px from target top
    debug: true
  })
});
```

---

### Position Shorthands

Position shorthands provide a convenient way to define target and container positions using named values rather than numeric coordinates.

**Available Shorthands:**

| Shorthand | Returns |
|-----------|---------|
| `'top'` | The top y value |
| `'bottom'` | The bottom y value |
| `'left'` | The left x value |
| `'right'` | The right x value |
| `'center'` | The center x or y value |
| `'start'` | Equivalent to `'top'` and `'left'` depending on axis |
| `'end'` | Equivalent to `'bottom'` and `'right'` depending on axis |

**Example:**

```javascript
import { animate, onScroll } from 'animejs';

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  alternate: true,
  loop: true,
  ease: 'inOutQuad',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'center top',     // When center of target reaches top of container
    leave: 'center bottom',  // When center of target reaches bottom of container
    debug: true
  })
});
```

---

### Relative Position Values

Relative position values allow you to define threshold positions relative to the target and container using a syntax similar to relative value animations in Anime.js.

**Syntax and Operators:**

| Operator | Function | Example |
|----------|----------|---------|
| `+=` | Addition | `'+=45'` |
| `-=` | Subtraction | `'-=50%'` |
| `*=` | Multiplication | `'*=.5'` |

**Example:**

```javascript
autoplay: onScroll({
  container: '.scroll-container',
  enter: 'center+=1em top-=100%',   // Center + 1em vs top - 100%
  leave: 'center-=1em bottom+=100%', // Center - 1em vs bottom + 100%
  debug: true
})
```

---

### Min/Max Thresholds

Min/max thresholds define scroll position limits for triggering enter/leave conditions in the ScrollObserver. They're useful when target elements have positions too extreme to naturally trigger standard conditions.

**Accepted Values:**

- **`'min'`** — Represents the minimum scrollable space value needed to satisfy enter or leave requirements
- **`'max'`** — Represents the maximum scrollable space value needed to satisfy enter or leave requirements

**Example:**

```javascript
animate($square, {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  alternate: true,
  ease: 'inOutQuad',
  autoplay: onScroll({
    container: '.scroll-container',
    sync: 1,
    enter: 'max bottom',  // Max scrollable space vs bottom
    leave: 'min top',     // Min scrollable space vs top
    debug: true
  })
});
```

---

## Synchronisation Modes

ScrollObserver synchronisation modes determine how animations behave and synchronize relative to scroll progress or threshold conditions. These modes are configured via the `sync` property in the `onScroll()` parameters object.

As stated in the documentation: "Determines the behaviour of the animation and how it is synchronised relative to the scroll progress or by meeting certain thresholds."

---

### Method Names

The method names synchronisation mode enables triggering specific Animation, Timer, or Timeline method calls based on scroll-triggered callbacks.

**Description:** "Defines a list of method names of the linked Object to be called when specific callbacks are triggered."

**Accepted Values:** String containing space-separated method names from Animation, Timer, or Timeline methods (play, pause, reverse, reset, etc.)

**Callback Definition Order:**

- **Single callback:** `'enter'` - triggers one method when entering the threshold
- **Two callbacks:** `'enter leave'` - triggers separate methods for entering and leaving (default: `'play pause'`)
- **Four callbacks:** `'enterForward leaveForward enterBackward leaveBackward'` - handles directional scrolling with distinct methods for each direction

**Example:**

```javascript
animate('.square', {
  x: '15rem',
  rotate: '1turn',
  duration: 2000,
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: 'resume pause reverse reset',
    debug: true
  })
});
```

This configuration calls:
- `resume()` on forward entry
- `pause()` on exit
- `reverse()` on backward entry
- `reset()` on backward exit

---

### Playback Progress

The playback progress synchronisation mode creates a direct link between scroll position and animation playback, enabling scroll-driven animations that progress in real-time with user scrolling.

**Accepted Values:**
- `1` (numeric)
- `true` (boolean)

**Functionality:** "Perfectly synchronises the playback progress of the linked object to the scroll position." This means the animation's timeline advances proportionally with scrolling—when the user scrolls halfway through the defined region, the animation plays at its 50% mark.

**Example:**

```javascript
import { animate, onScroll } from 'animejs';

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,  // or sync: 1
    debug: true,
  })
});
```

**Key Configuration:**
- **container**: The scrollable element to observe
- **enter/leave**: Threshold positions defining when synchronisation begins and ends
- **debug**: Optional visual feedback for threshold boundaries

---

### Smooth Scroll

The smooth scroll synchronisation mode enables fluid animation playback that tracks scroll position through progressive easing rather than direct synchronisation.

**Description:** "Smoothly animate the playback progress of the linked object to the scroll position by passing a value between `0` and `1`." The lower the numeric value approaches zero, the more extended the animation duration becomes to align with current scroll positioning.

**Accepted Values:**
- **Type**: Number
- **Range**: Between 0 (inclusive) and 1 (inclusive)
- **Behavior**: Lower values create longer catch-up animations; higher values create tighter tracking

**Example:**

```javascript
animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: .25,  // Quarter-intensity damping factor
    debug: true,
  })
});
```

---

### Eased Scroll

The eased scroll mode applies easing functions to control how linked animations respond to scroll position changes.

**Description:** "Applies an easing function to the synchronised playback progress of the linked object relative to the scroll position."

This means instead of a linear relationship between scroll position and animation progress, you can apply easing curves to create more dynamic, refined scroll-driven animations.

**Accepted Parameters:** Any valid Anime.js easing function (linear, easeInOutCirc, spring functions, cubic-bezier curves, etc.)

**Example:**

```javascript
animate('.square', {
  x: '12rem',
  rotate: '1turn',
  ease: 'linear',
  delay: stagger(100, { from: 'last' }),
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: 'inOutCirc',  // Easing function applied to scroll sync
    debug: true,
  })
});
```

**Key Characteristics:**
- Requires the `sync` property within `onScroll` configuration
- Accepts any valid Anime.js easing function as the sync value
- Creates non-linear scroll-to-animation-progress mapping for more sophisticated effects

---

## Callbacks

ScrollObserver callbacks are functions defined directly within the `onScroll()` parameters object. They trigger at specific points during scroll events, enabling synchronized animations based on scroll position.

### Available Callbacks

1. **onEnter** - Triggers when the target enters the threshold
2. **onEnterForward** - Triggers when entering while scrolling forward
3. **onEnterBackward** - Triggers when entering while scrolling backward
4. **onLeave** - Triggers when the target leaves the threshold
5. **onLeaveForward** - Triggers when leaving while scrolling forward
6. **onLeaveBackward** - Triggers when leaving while scrolling backward
7. **onUpdate** - Triggers during scroll updates
8. **onSyncComplete** - Triggers when synchronization completes

**Key Characteristics:**
- Callbacks provide directional awareness (forward/backward scrolling detection)
- The `onUpdate` callback fires continuously during scroll
- Directional callbacks execute based on scroll direction
- Integration with threshold and synchronization modes enables precise animation control

---

### onEnter

Triggers a function every time the `enter` threshold is met.

**Parameters:** A Function whose first argument is the ScrollObserver instance itself

**Default Value:** `noop` (no operation)

**Example:**

```javascript
import { animate, onScroll, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let entered = 0;

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,
    debug: true,
    onEnter: () => $value.textContent = ++entered,
  })
});
```

---

### onEnterForward

Triggers a function every time the `enter` threshold is met by scrolling forward.

**Parameters:** A Function whose first argument is the ScrollObserver instance

**Default Value:** `noop`

**When It Triggers:**
- The user scrolls in a forward direction
- The element crosses the defined `enter` threshold
- This distinguishes it from `onEnter`, which triggers regardless of scroll direction

**Example:**

```javascript
import { animate, onScroll, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let entered = 0;

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,
    debug: true,
    onEnterForward: () => $value.textContent = ++entered,
  })
});
```

---

### onEnterBackward

Triggers a function when the enter threshold is crossed by scrolling in the backward direction.

**Parameters:** A Function where the first argument is the ScrollObserver instance

**Default Value:** `noop`

**Trigger Condition:** Activates specifically when the user scrolls backward and crosses the designated "enter" threshold.

**Example:**

```javascript
import { animate, onScroll, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let entered = 0;

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,
    debug: true,
    onEnterBackward: () => $value.textContent = ++entered,
  })
});
```

---

### onLeave

Triggers a function every time the `leave` threshold is met.

**Parameters:** A function whose initial parameter is the ScrollObserver instance

**Default Value:** `noop`

**Trigger Condition:** Executes whenever the user scrolls past the designated `leave` threshold position within the scroll container.

**Example:**

```javascript
import { animate, onScroll, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let exits = 0;

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,
    debug: true,
    onLeave: () => $value.textContent = ++exits,
  })
});
```

---

### onLeaveForward

Triggers a function whenever the user scrolls past the defined `leave` threshold in the forward direction.

**Parameters:** A Function whose first parameter is the ScrollObserver instance

**Default Value:** `noop`

**When It Triggers:** The callback activates every time the scroll position crosses the `leave` threshold while scrolling forward (downward on vertical scrolls).

**Example:**

```javascript
import { animate, onScroll, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let exits = 0;

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,
    debug: true,
    onLeaveForward: () => $value.textContent = ++exits,
  })
});
```

---

### onLeaveBackward

Triggers a function when scrolling backward past the "leave" threshold.

**Parameters:** A function whose initial parameter is the ScrollObserver instance

**Default Value:** `noop`

**When It Triggers:** Activates specifically when the user scrolls backward (upward/leftward depending on axis) and crosses the designated leave threshold boundary.

**Example:**

```javascript
animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: true,
    debug: true,
    onLeaveBackward: () => $value.textContent = ++exits,
  })
});
```

---

### onUpdate

Executes a function each time the linked object's progress updates during scroll synchronization.

**Parameters:** A Function whose first argument is the ScrollObserver instance

**Default Value:** `noop`

**When It Triggers:** Activates whenever the linked animation's progress value changes in response to scroll events, enabling real-time monitoring of scroll-driven animation synchronization.

**Example:**

```javascript
import { animate, onScroll, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let updates = 0;

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: .5,
    debug: true,
    onUpdate: () => $value.textContent = ++updates,
  })
});
```

---

### onSyncComplete

Triggers a function when the linked object synchronisation completes.

**Parameters:** A Function whose first argument is the ScrollObserver instance

**Default Value:** `noop`

**When It Triggers:** This callback fires upon completion of synchronization between a scroll-linked animation and the ScrollObserver's tracking behavior.

**Example:**

```javascript
animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom top',
    leave: 'center bottom',
    sync: .5,
    debug: true,
    onSyncComplete: () => $value.textContent = ++completions,
  })
});
```

---

## Methods

The `ScrollObserver` instance returned by an `onScroll()` function provides three methods for managing scroll-based animations.

```javascript
const scrollObserver = onScroll(parameters);
scrollObserver.link();
scrollObserver.refresh();
scrollObserver.revert();
```

---

### link()

Connects an Animation, Timer, or Timeline to a ScrollObserver instance, synchronizing playback with scroll position.

**Description:** "Connects an Animation, Timer or Timeline to a ScrollObserver instance. This is equivalent to defining an onScroll() instance on the autoplay parameter."

**Important Note:** Only one object can be linked at a time—subsequent calls override the previous link.

**Parameters:** Animation | Timer | Timeline

**Return Value:** Returns the ScrollObserver itself, enabling method chaining.

**Example:**

```javascript
import { animate, onScroll } from 'animejs';

const animation = animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
});

const scrollObserver = onScroll({
  container: '.scroll-container',
  enter: 'bottom-=50 top',
  leave: 'top+=60 bottom',
  sync: true,
  debug: true,
});

scrollObserver.link(animation);
```

---

### refresh()

Updates the bounding values, and re-compute the Function based value of a ScrollObserver instance.

**Description:** "Updates the bounding values, and re-compute the Function based value of a ScrollObserver instance."

**Parameters That Can Be Refreshed:**
- `repeat`
- `axis`
- `enter`
- `leave`

**Important Note:** "No need to call `.refresh()` when the container size changes, this is already handled internally."

**Return Value:** Returns the ScrollObserver instance itself, allowing for method chaining.

**Example:**

```javascript
animate(scrollSettings, {
  enter: 90,
  leave: 100,
  loop: true,
  alternate: true,
  modifier: utils.round(0),
  onUpdate: () => animation._autoplay.refresh()
});
```

---

### revert()

Disables the ScrollObserver, removes all EventListener and removes the debug HTMLElement if necessary.

**Return Value:** Returns the ScrollObserver itself, allowing for method chaining.

**Example:**

```javascript
import { animate, onScroll } from 'animejs';

animate('.square', {
  x: '15rem',
  rotate: '1turn',
  ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: 1,
    debug: true,
    onSyncComplete: self => self.revert()
  })
});
```

**HTML Example:**

```html
<div class="scroll-container scroll-y">
  <div class="scroll-content grid square-grid">
    <div class="scroll-section padded">
      <div class="large row">
        <div class="label">scroll down</div>
      </div>
    </div>
    <div class="scroll-section padded">
      <div class="large row">
        <div class="square"></div>
      </div>
    </div>
    <div class="scroll-section"></div>
  </div>
</div>
```

---

## Properties

The `ScrollObserver` instance returned by an `onScroll()` function provides access to multiple properties for monitoring scroll behavior and linked animations.

### Available Properties

| Property | Type | Description |
|----------|------|-------------|
| **id** | Number | Unique identifier for the ScrollObserver instance |
| **container** | ScrollContainer | The scroll container being monitored |
| **target** | HTMLElement | The DOM element under observation |
| **linked** | Animation\|Timer\|Timeline | The connected animation or timing object |
| **repeat** | Boolean | Whether observation repeats after completion |
| **horizontal** | Boolean | Indicates if scrolling direction is horizontal |
| **enter** | String\|Number | Threshold value for entering the observed zone |
| **leave** | String\|Number | Threshold value for exiting the observed zone |
| **sync** | Boolean | Whether synchronisation with scroll is active |
| **velocity** | Number | Current scrolling speed measurement |
| **backward** | Boolean | Whether scroll direction is backward |
| **scroll** | Number | Current scroll position value |
| **progress** | Number | Observation progress from 0 to 1 |
| **completed** | Boolean | Whether observation phase has finished |
| **began** | Boolean | Whether observation phase has started |
| **isInView** | Boolean | Current visibility status of observed element |
| **offset** | Number | Calculated offset of the observed element |
| **offsetStart** | Number | Starting offset boundary |
| **offsetEnd** | Number | Ending offset boundary |
| **distance** | Number | Total scroll distance for the element |

---

## Complete Reference Example

Here's a comprehensive example showcasing multiple ScrollObserver features:

```javascript
import { animate, onScroll, utils } from 'animejs';

const [ $container ] = utils.$('.scroll-container');
const [ $counter ] = utils.$('.counter');
let count = 0;

const animation = animate('.element', {
  x: '20rem',
  y: '10rem',
  rotate: '2turn',
  scale: 1.5,
  duration: 3000,
  ease: 'inOutQuad',
});

const scrollObserver = onScroll({
  // Settings
  container: $container,
  target: '.element',
  axis: 'y',
  repeat: true,
  debug: true,

  // Thresholds
  enter: 'bottom-=100 top+=50',
  leave: 'top-=50 bottom-=100',

  // Synchronization
  sync: true,  // or use smooth: .25, or eased: 'inOutCirc'

  // Callbacks
  onEnter: (observer) => {
    console.log('Entered threshold', observer.progress);
  },
  onEnterForward: () => {
    console.log('Scrolling down, entering');
  },
  onEnterBackward: () => {
    console.log('Scrolling up, entering');
  },
  onLeave: () => {
    console.log('Left threshold');
  },
  onLeaveForward: () => {
    console.log('Scrolling down, leaving');
  },
  onLeaveBackward: () => {
    console.log('Scrolling up, leaving');
  },
  onUpdate: (observer) => {
    $counter.textContent = observer.progress.toFixed(2);
  },
  onSyncComplete: () => {
    console.log('Synchronization complete');
  }
});

// Link the animation
scrollObserver.link(animation);

// Later, you can refresh or revert
// scrollObserver.refresh();
// scrollObserver.revert();
```

---

## Summary

Anime.js ScrollObserver provides a powerful and flexible system for creating scroll-driven animations with:

- **Precise control** over when animations trigger via customizable thresholds
- **Multiple synchronization modes** for different animation behaviors
- **Rich callback system** for directional scroll awareness
- **Debug mode** for visual feedback during development
- **Flexible threshold syntax** supporting numeric values, position shorthands, relative values, and min/max
- **Chainable methods** for dynamic animation management
- **Comprehensive properties** for monitoring scroll state

All features are available since Anime.js version 4.0.0.
