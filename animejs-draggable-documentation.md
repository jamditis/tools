# Anime.js Draggable Documentation

Complete documentation for the `createDraggable()` function in Anime.js v4.0.0+

## Table of Contents
1. [Overview](#overview)
2. [Installation & Import](#installation--import)
3. [Basic Usage](#basic-usage)
4. [Axes Parameters](#axes-parameters)
5. [Settings](#settings)
6. [Callbacks](#callbacks)
7. [Methods](#methods)
8. [Properties](#properties)
9. [Code Examples](#code-examples)

---

## Overview

The `createDraggable()` function enables interactive drag functionality for DOM elements in Anime.js. It provides comprehensive control over drag behavior, physics, snapping, and boundaries.

**Availability:** Anime.js v4.0.0 and later

---

## Installation & Import

### Primary Import
```javascript
import { createDraggable } from 'animejs';
const draggable = createDraggable(target, parameters);
```

### Subpath Import (Standalone)
```javascript
import { createDraggable } from 'animejs/draggable';
```

---

## Basic Usage

### Minimal Example
```javascript
import { createDraggable } from 'animejs';

// Simple draggable element
createDraggable('.square');
```

```html
<div class="large row centered">
  <div class="square draggable"></div>
</div>
```

### Basic Syntax
```javascript
createDraggable(target, parameters)
```

**Parameters:**
- `target`: CSS selector string or DOM Element reference
- `parameters` (optional): Configuration object containing axes parameters, settings, and callbacks

**Returns:** Draggable instance

---

## Axes Parameters

Axes parameters control X/Y movement, snapping, and value mapping. They can be specified globally to all axes or specifically to an axis by passing it an object.

### Configuration Structure
```javascript
createDraggable('.square', {
  x: { snap: 100 },
  y: { snap: 50 },
  modifier: utils.wrap(-200, 0),
  containerPadding: 10,
  releaseStiffness: 40,
  releaseEase: 'out(3)',
  onGrab: () => {},
  onDrag: () => {},
  onRelease: () => {},
});
```

---

### x (X-Axis)

**Type:** `Boolean` | `Object` (Draggable axes parameters)
**Default:** `true`
**Version:** v4.0.0+

Controls horizontal dragging behavior.

**Example:**
```javascript
import { createDraggable } from 'animejs';

// Enable x-axis dragging
createDraggable('.square.enabled', {
  x: true
});

// Disable x-axis dragging
createDraggable('.square.disabled', {
  x: false
});
```

```html
<div class="large spaced-evenly row">
  <div class="square enabled draggable"></div>
  <div class="square disabled draggable"></div>
</div>
<div class="large spaced-evenly row">
  <div class="label">x enabled</div>
  <div class="label">x disabled</div>
</div>
```

---

### y (Y-Axis)

**Type:** `Boolean` | `Object` (Draggable axes parameters)
**Default:** `true`
**Version:** v4.0.0+

Controls vertical dragging behavior.

**Example:**
```javascript
// Enable y-axis dragging
createDraggable('.square.enabled', {
  y: true
});

// Disable y-axis dragging
createDraggable('.square.disabled', {
  y: false
});
```

---

### snap

**Type:** `Number` | `Array<Number>` | `Function`
**Default:** `0` (no snapping)
**Version:** v4.0.0+

Rounds the final value of either both axes or one specific axis to the nearest specified increment.

**Input Types:**
1. **Number** - A fixed increment value for snapping
2. **Array of Numbers** - Selects the closest value from provided options
3. **Function** - Dynamically computes snap values, automatically refreshing on resize

**Example:**
```javascript
createDraggable('.square', {
  container: '.grid',
  snap: 56,              // Applied globally to both axes
  x: { snap: [0, 200] }  // Axis-specific array of snap points
});
```

**Key Characteristics:**
- When using a function-based approach, values refresh automatically during container or target resizing
- Manual refresh is available through the `refresh()` method
- Axis-specific configuration overrides global settings
- Array-based snapping finds the nearest matching value rather than using fixed increments

---

### modifier

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Applies transformation functions to drag values on one or both axes. Alters or modifies the value of either both axes or one specific axis.

**Example:**
```javascript
createDraggable('.square', {
  modifier: utils.wrap(-32, 32),        // Applied to both x and y
  x: { modifier: utils.wrap(-128, 128) } // Applied only to x axis
});
```

**Practical Application:**
Modifier functions are useful for constraining or transforming dragged values. The example uses `utils.wrap()` to create wrapping behavior—values cycle within specified ranges rather than stopping at boundaries. This enables creative interaction patterns like circular or looping drag mechanics.

---

### mapTo

**Type:** `String`
**Default:** `null`
**Version:** v4.0.0+

Remaps a drag axis to animate a different property instead of the default X or Y positioning.

**Functionality:**
Rather than constraining dragging to standard positional movement, `mapTo` enables developers to connect drag input to transform properties or other animatable attributes. This proves useful for creating interactive effects where dragging controls rotation, scale, or custom properties.

**Example:**
```javascript
import { createDraggable, utils } from 'animejs';

utils.set('.square', { z: 100 });

createDraggable('.square', {
  x: { mapTo: 'rotateY' },  // Horizontal drag controls rotation
  y: { mapTo: 'z' },        // Vertical drag controls z-depth
});
```

In this pattern, horizontal dragging modifies the `rotateY` transform, while vertical dragging affects the `z` property (3D depth positioning).

---

## Settings

Configure drag behavior, friction, velocity, and interaction thresholds.

### trigger

**Type:** `String` (CSS Selector) | `HTMLElement`
**Default:** `null`
**Version:** v4.0.0+

Designates a different element than the target to initiate drag interactions. Useful when you want the draggable functionality applied to one element but activated by user interaction with another element.

**Example:**
```javascript
import { createDraggable } from 'animejs';

createDraggable('.row', {
  trigger: '.circle',
});
```

```html
<div class="large centered row">
  <div class="square"></div>
  <div class="circle draggable"></div>
  <div class="square"></div>
</div>
```

In this example, the `.row` element becomes draggable when the user interacts with the `.circle` element.

---

### container

**Type:** `String` (CSS Selector) | `HTMLElement` | `Array<Number>` | `Function`
**Default:** `null` (no container restrictions)
**Version:** v4.0.0+

Defines boundaries that prevent draggable elements from being moved outside specified limits.

**Accepted Input Types:**
1. **CSS Selector String** - targets an HTMLElement using selector syntax
2. **HTMLElement** - direct DOM element reference
3. **Array of Numbers** - `[top, right, bottom, left]` boundary values in pixels
4. **Function** - returns boundary array, automatically refreshes on window/element resize

**Key Features:**
- When using a function-based container, boundaries will be automatically refreshed every time the window or target element is resized
- Manual refresh available via the `refresh()` method

**Example:**
```javascript
import { createDraggable } from 'animejs';

// Using CSS selector
createDraggable('.square', {
  container: '.grid',
});

// Using pixel boundaries
createDraggable('.circle', {
  container: [-16, 80, 16, 0],  // [top, right, bottom, left]
});

// React example with tight bounds
createDraggable('.logo', {
  container: [0, 0, 0, 0],
  releaseEase: spring({ bounce: .7 })
});
```

The array format `[-16, 80, 16, 0]` represents top, right, bottom, and left padding values that constrain drag movement within those pixel offsets.

---

### containerPadding

**Type:** `Number` | `Array<Number>` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Adds padding within the container boundaries. Specifies padding values for the container `[top, right, bottom, left]`.

**Example:**
```javascript
createDraggable('.square', {
  container: '.grid',
  containerPadding: 10,  // 10px padding on all sides
});
```

---

### containerFriction

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Controls friction value applied within the container during dragging.

---

### releaseContainerFriction

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Friction applied after release when element is moving.

---

### releaseMass

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Mass parameter for release physics simulation.

---

### releaseStiffness

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Stiffness of the release animation. Higher values create faster, more responsive release animations.

**Example:**
```javascript
createDraggable('.square', {
  releaseStiffness: 40,
  releaseEase: 'out(3)',
});
```

---

### releaseDamping

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Damping for release motion. Controls how quickly the element settles after release.

---

### releaseEase

**Type:** `String` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Easing function applied to the draggable element animations after release.

**Examples:**
```javascript
// Using string ease
createDraggable('.square', {
  releaseEase: 'out(3)',
});

// Using spring physics
createDraggable('.logo', {
  releaseEase: spring({ bounce: .7 })
});

// Using createSpring
createDraggable('.circle', {
  releaseEase: createSpring({
    stiffness: 120,
    damping: 6,
  })
});
```

---

### velocityMultiplier

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Multiplier applied to velocity calculations during drag and release.

---

### minVelocity

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Minimum velocity threshold for the draggable element.

---

### maxVelocity

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Maximum velocity cap for the draggable element.

---

### dragSpeed

**Type:** `Number` | `Function`
**Default:** `1`
**Version:** v4.0.0+

Controls how quickly an element moves when dragged. It's a multiplier for dragging velocity.

**Behavior:**
- **Values greater than 1:** Increase drag responsiveness
- **Value of 1:** Standard drag speed (default)
- **Values between 0 and 1:** Slow down dragging
- **Value of 0:** Prevents dragging entirely
- **Negative values:** Invert the drag direction

**Function-Based Implementation:**
When defined as a function, the returned value automatically refreshes upon container or target element resize. Manual refresh is available through the `refresh()` method.

**Example:**
```javascript
createDraggable('.square', {
  container: '.grid',
  dragSpeed: 2,  // Faster dragging
});

createDraggable('.circle', {
  container: '.grid',
  dragSpeed: 0.5,  // Slower dragging
});
```

---

### dragThreshold

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Minimum distance (in pixels) to initiate drag interaction.

---

### scrollThreshold

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Distance threshold from container edges before auto-scrolling begins.

---

### scrollSpeed

**Type:** `Number` | `Function`
**Default:** Not specified
**Version:** v4.0.0+

Speed value at which the draggable container auto scrolls.

---

### cursor

**Type:** `Boolean` | `String` | `Object` (DraggableCursorParams)
**Default:** Not specified
**Version:** v4.0.0+

CSS cursor style during drag interaction.

---

## Callbacks

All callbacks are specified directly in the `createDraggable()` parameters Object.

### General Callback Signature

All callbacks accept the draggable instance as their first argument:

```javascript
callback: (draggable) => {
  // draggable is the Draggable instance
}
```

---

### onGrab

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes when the user begins dragging an element (on grab/click).

**Example:**
```javascript
createDraggable('.square', {
  onGrab: (draggable) => {
    console.log('Grabbed!', draggable);
  }
});
```

---

### onDrag

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes during the dragging motion (continuously while dragging).

**Example:**
```javascript
import { createDraggable, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let drags = 0;

createDraggable('.square', {
  container: '.grid',
  onDrag: () => $value.textContent = ++drags
});
```

This example counts and displays the number of drag events triggered while moving an element within a grid container.

---

### onUpdate

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes when values update while dragging (on any position update).

---

### onRelease

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes when the user stops dragging (on release).

**Example:**
```javascript
createDraggable('.square', {
  onRelease: (draggable) => {
    console.log('Released at:', draggable.x, draggable.y);
  }
});
```

---

### onSnap

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes when the element snaps to a defined position.

---

### onSettle

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes when the element finishes settling after release (when movement settles).

---

### onResize

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes when the container or element resizes.

---

### onAfterResize

**Type:** `Function`
**Default:** `noop` (no operation)
**Version:** v4.0.0+

Executes after the container finishes resizing and after resize handling completes.

---

## Methods

All methods are available on the Draggable instance returned by `createDraggable()`.

### disable()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Disables draggable functionality.

**Example:**
```javascript
const draggable = createDraggable('.square');
draggable.disable();
```

---

### enable()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Enables draggable functionality.

**Example:**
```javascript
draggable.enable();
```

---

### setX()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Sets the X position programmatically.

---

### setY()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Sets the Y position programmatically.

---

### animateInView()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Animates element into view.

---

### scrollInView()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Scrolls element into view.

---

### stop()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Stops current dragging action.

---

### reset()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Resets to initial state.

---

### revert()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Restores the draggable element to its initial state and deactivates it.

**Example:**
```javascript
import { createDraggable, utils } from 'animejs';

const [ $revertButton ] = utils.$('.revert');
const draggable = createDraggable('.square');

function revertDraggable() {
  draggable.revert();
  $revertButton.disabled = true;
}

$revertButton.addEventListener('click', revertDraggable);
```

**Key Points:**
- Resets the draggable element to its starting position and state
- Deactivates the draggable functionality
- Returns the draggable object for chaining additional methods
- Useful when you need to programmatically reset user interactions with draggable elements

---

### refresh()

**Returns:** Draggable instance (chainable)
**Version:** v4.0.0+

Refreshes draggable instance. Useful for manually updating boundaries when using function-based container, snap, or other dynamic parameters.

---

## Properties

Properties available on the Draggable instance.

### Configurable Properties

| Property | Description | Type | Read/Write |
|----------|-------------|------|------------|
| `snapX` | Gets and sets the snap value of the x axis | `Number` \| `Array<Number>` | Read/Write |
| `snapY` | Gets and sets the snap value of the y axis | `Number` \| `Array<Number>` | Read/Write |
| `scrollSpeed` | Gets and sets the speed value at which the draggable container auto scrolls | `Number` | Read/Write |
| `scrollThreshold` | Gets and sets the threshold distance from container edges before auto-scrolling begins | `Number` | Read/Write |
| `dragSpeed` | Gets and sets the speed value at which the draggable element gets dragged | `Number` | Read/Write |
| `maxVelocity` | Gets and sets the maximum velocity limit for the draggable element | `Number` | Read/Write |
| `minVelocity` | Gets and sets the minimum velocity limit for the draggable element | `Number` | Read/Write |
| `velocityMultiplier` | Gets and sets the multiplier applied to velocity calculations | `Number` | Read/Write |
| `releaseEase` | Gets and sets the easing function applied to the draggable element animations | `Function` | Read/Write |
| `containerPadding` | Gets and sets padding values for the container [top, right, bottom, left] | `Array<Number>` | Read/Write |
| `containerFriction` | Gets and sets the friction value applied within the container | `Number` | Read/Write |
| `$container` | Gets and sets the container element | `HTMLElement` | Read/Write |
| `$target` | Gets and sets the target element | `HTMLElement` | Read/Write |
| `x` | Gets and sets the x position | `Number` | Read/Write |
| `y` | Gets and sets the y position of the dragged element | `Number` | Read/Write |
| `progressX` | Gets and sets the progress (0-1) of the x position relative to the container | `Number` | Read/Write |
| `progressY` | Gets and sets the progress (0-1) of the y position relative to the container | `Number` | Read/Write |
| `cursor` | Gets and sets cursor behavior | `Boolean` \| `DraggableCursorParams` | Read/Write |

### Read-Only Properties

| Property | Description | Type |
|----------|-------------|------|
| `releaseSpring` | Gets the internal spring used to move the draggable element after release | `Spring` |
| `containerBounds` | Gets the bounds of the container [top, right, bottom, left] | `Array<Number>` |
| `containerArray` | Gets array of container elements if multiple containers were provided | `Array<HTMLElement>` \| `null` |
| `$trigger` | Gets the trigger element | `HTMLElement` |
| `$scrollContainer` | Gets the scroll container (window or container element) | `Window` \| `HTMLElement` |
| `velocity` | Gets the current velocity of the draggable element | `Number` |
| `angle` | Gets the current angle in radians of the draggable element | `Number` |
| `xProp` | Gets the mapped x property name | `String` |
| `yProp` | Gets the mapped y property name | `String` |
| `destX` | Gets the currently defined destination of the x axis | `Number` |
| `destY` | Gets the currently defined destination of the y axis | `Number` |
| `deltaX` | Gets the current delta of the x axis | `Number` |
| `deltaY` | Gets the current delta of the y axis | `Number` |
| `enabled` | Returns true if enabled | `Boolean` |
| `grabbed` | Returns true if currently being grabbed | `Boolean` |
| `dragged` | Returns true if currently being dragged | `Boolean` |
| `disabled` | Gets the disabled state for [x, y] axes | `Array<Number>` |
| `fixed` | Returns true if the target element has position:fixed | `Boolean` |
| `useWin` | Returns true if window is container | `Boolean` |
| `isFinePointer` | Gets and sets whether fine pointer (e.g. mouse) is being used | `Boolean` |
| `initialized` | Returns true if initialized | `Boolean` |
| `canScroll` | Returns true if auto-scrolling possible | `Boolean` |
| `contained` | Returns true if within bounds | `Boolean` |
| `manual` | Returns true if in manual control mode | `Boolean` |
| `released` | Returns true if just released | `Boolean` |
| `updated` | Returns true if position just updated | `Boolean` |
| `scroll` | Gets the current scroll position {x, y} | `Object` |
| `coords` | Gets the current and previous coordinates [x, y, prevX, prevY] | `Array<Number>` |
| `snapped` | Gets the snap state for [x, y] axes | `Array<Number>` |
| `pointer` | Gets current and previous pointer positions [x, y, prevX, prevY] | `Array<Number>` |
| `scrollView` | Gets the scroll view dimensions [width, height] | `Array<Number>` |
| `dragArea` | Gets the drag area bounds [x, y, width, height] | `Array<Number>` |
| `scrollBounds` | Gets the scroll container bounds [top, right, bottom, left] | `Array<Number>` |
| `targetBounds` | Gets the target element bounds [top, right, bottom, left] | `Array<Number>` |
| `window` | Gets the window dimensions [width, height] | `Array<Number>` |
| `pointerVelocity` | Gets the current pointer velocity | `Number` |
| `pointerAngle` | Gets the current pointer angle in radians | `Number` |
| `activeProp` | Gets the active property being animated | `String` |

### Callback Properties

| Property | Description | Type |
|----------|-------------|------|
| `onGrab` | Gets and sets the callback fired when element is grabbed | `Function` |
| `onDrag` | Gets and sets the callback fired while dragging | `Function` |
| `onRelease` | Gets and sets the callback fired on release | `Function` |
| `onUpdate` | Gets and sets the callback fired on any position update | `Function` |
| `onSettle` | Gets and sets the callback fired when movement settles | `Function` |
| `onSnap` | Gets and sets the callback fired when element snaps | `Function` |
| `onResize` | Gets and sets the callback fired when container/element resizes | `Function` |
| `onAfterResize` | Gets and sets the callback fired after resize handling completes | `Function` |

---

## Code Examples

### Complete Examples

#### 1. Basic Draggable with Container and Snap
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

#### 2. React Integration
```javascript
import { animate, createScope, spring, createDraggable } from 'animejs';

// Make the logo draggable with spring physics
createDraggable('.logo', {
  container: [0, 0, 0, 0],
  releaseEase: spring({ bounce: .7 })
});
```

#### 3. Vanilla JavaScript with Spring
```javascript
import { animate, utils, createDraggable, spring } from 'animejs';

createDraggable('.logo.js', {
  container: [0, 0, 0, 0],
  releaseEase: spring({ bounce: .7 })
});
```

#### 4. Custom Spring Configuration
```javascript
createDraggable('.circle', {
  releaseEase: createSpring({
    stiffness: 120,
    damping: 6,
  })
});
```

#### 5. Mapping to Transform Properties (3D Effects)
```javascript
import { createDraggable, utils } from 'animejs';

utils.set('.square', { z: 100 });

createDraggable('.square', {
  x: { mapTo: 'rotateY' },  // Horizontal drag rotates
  y: { mapTo: 'z' },        // Vertical drag changes depth
});
```

#### 6. Different Drag Speeds
```javascript
createDraggable('.square', {
  container: '.grid',
  dragSpeed: 2,  // Faster
});

createDraggable('.circle', {
  container: '.grid',
  dragSpeed: 0.5,  // Slower
});
```

#### 7. Modifier Functions (Wrapping Behavior)
```javascript
createDraggable('.square', {
  modifier: utils.wrap(-32, 32),        // Applied to both axes
  x: { modifier: utils.wrap(-128, 128) } // Applied only to x
});
```

#### 8. Trigger Element (Different Grab Handle)
```javascript
createDraggable('.row', {
  trigger: '.circle',  // Drag .row by grabbing .circle
});
```

```html
<div class="large centered row">
  <div class="square"></div>
  <div class="circle draggable"></div>
  <div class="square"></div>
</div>
```

#### 9. Drag Counter with Callback
```javascript
import { createDraggable, utils } from 'animejs';

const [ $value ] = utils.$('.value');
let drags = 0;

createDraggable('.square', {
  container: '.grid',
  onDrag: () => $value.textContent = ++drags
});
```

#### 10. Revert Button
```javascript
import { createDraggable, utils } from 'animejs';

const [ $revertButton ] = utils.$('.revert');
const draggable = createDraggable('.square');

function revertDraggable() {
  draggable.revert();
  $revertButton.disabled = true;
}

$revertButton.addEventListener('click', revertDraggable);
```

#### 11. Axis-Specific Enable/Disable
```javascript
// X-axis enabled
createDraggable('.square.enabled', {
  x: true,
  y: false  // Vertical dragging disabled
});

// Y-axis enabled
createDraggable('.square.disabled', {
  x: false,  // Horizontal dragging disabled
  y: true
});
```

#### 12. Container with Pixel Boundaries
```javascript
// Using CSS selector
createDraggable('.square', {
  container: '.grid',
});

// Using pixel boundaries [top, right, bottom, left]
createDraggable('.circle', {
  container: [-16, 80, 16, 0],
});
```

---

## Summary

The `createDraggable()` function in Anime.js v4.0.0+ provides:

**Core Features:**
- ✅ Full axis control (x, y) with enable/disable
- ✅ Container boundaries (CSS selector, element, pixel array, or function)
- ✅ Snapping to grid or specific points
- ✅ Value modifiers for custom behavior (wrapping, clamping, etc.)
- ✅ Property mapping (drag to control rotation, scale, etc.)

**Physics & Feel:**
- ✅ Spring-based release animations
- ✅ Customizable friction, mass, stiffness, damping
- ✅ Velocity control (min, max, multiplier)
- ✅ Drag speed adjustment
- ✅ Easing functions

**Interaction:**
- ✅ Trigger element (separate grab handle)
- ✅ Drag and scroll thresholds
- ✅ Auto-scrolling containers
- ✅ Custom cursor styles

**Lifecycle Callbacks:**
- ✅ onGrab, onDrag, onUpdate
- ✅ onRelease, onSnap, onSettle
- ✅ onResize, onAfterResize

**Control Methods:**
- ✅ enable(), disable()
- ✅ setX(), setY()
- ✅ stop(), reset(), revert()
- ✅ animateInView(), scrollInView()
- ✅ refresh()

**Rich Properties:**
- ✅ Position (x, y, progressX, progressY)
- ✅ State (grabbed, dragged, enabled, disabled)
- ✅ Velocity and angle
- ✅ Bounds and coordinates
- ✅ All configurable properties can be read/written dynamically

---

## Sources

- [Anime.js Official Documentation - Draggable](https://animejs.com/documentation/draggable/)
- [Draggable Settings](https://animejs.com/documentation/draggable/draggable-settings/)
- [Draggable Axes Parameters](https://animejs.com/documentation/draggable/draggable-axes-parameters/)
- [Draggable Callbacks](https://animejs.com/documentation/draggable/draggable-callbacks/)
- [Draggable Methods](https://animejs.com/documentation/draggable/draggable-methods/)
- [Draggable Properties](https://animejs.com/documentation/draggable/draggable-properties/)
- [mapTo Parameter](https://animejs.com/documentation/draggable/draggable-axes-parameters/mapto/)
- [snap Parameter](https://animejs.com/documentation/draggable/draggable-axes-parameters/snap/)
- [modifier Parameter](https://animejs.com/documentation/draggable/draggable-axes-parameters/modifier/)
- [container Setting](https://animejs.com/documentation/draggable/draggable-settings/container/)
- [dragSpeed Setting](https://animejs.com/documentation/draggable/draggable-settings/dragspeed/)
- [trigger Setting](https://animejs.com/documentation/draggable/draggable-settings/trigger/)
- [onDrag Callback](https://animejs.com/documentation/draggable/draggable-callbacks/ondrag/)
- [revert() Method](https://animejs.com/documentation/draggable/draggable-methods/revert/)
- [Using with React](https://animejs.com/documentation/getting-started/using-with-react/)
- [Using with Vanilla JS](https://animejs.com/documentation/getting-started/using-with-vanilla-js/)
- [Anime.js Homepage](https://animejs.com/)
