# Anime.js Timeline Documentation

## Table of Contents
- [Overview](#overview)
- [Timeline Creation](#timeline-creation)
- [Core Timeline Methods](#core-timeline-methods)
  - [add() - Adding Animations](#add---adding-animations)
  - [add() - Adding Timers](#add---adding-timers)
  - [sync() - Synchronizing Animations](#sync---synchronizing-animations)
  - [sync() - Synchronizing Timelines](#sync---synchronizing-timelines)
  - [sync() - Synchronizing WAAPI Animations](#sync---synchronizing-waapi-animations)
  - [call() - Calling Functions](#call---calling-functions)
  - [label() - Creating Labels](#label---creating-labels)
  - [set() - Setting Values](#set---setting-values)
  - [remove() - Removing Elements](#remove---removing-elements)
- [Time Position Syntax](#time-position-syntax)
- [Playback Control Methods](#playback-control-methods)
  - [play()](#play)
  - [pause()](#pause)
  - [reverse()](#reverse)
  - [restart()](#restart)
  - [resume()](#resume)
  - [complete()](#complete)
  - [cancel()](#cancel)
  - [reset()](#reset)
  - [seek()](#seek)
  - [alternate()](#alternate)
  - [stretch()](#stretch)
  - [init()](#init)
  - [refresh()](#refresh)
- [Timeline Parameters](#timeline-parameters)
- [Timeline Callbacks](#timeline-callbacks)

---

## Overview

Timelines in Anime.js synchronize animations, timers, and callbacks together. They enable complex sequencing by coordinating multiple animation sources and nested timeline hierarchies.

---

## Timeline Creation

Timelines are instantiated using the `createTimeline()` method from the main module:

```javascript
import { createTimeline } from 'animejs';
const timeline = createTimeline(parameters);
```

Alternatively, import as a standalone subpath:

```javascript
import { createTimeline } from 'animejs/timeline';
```

**Parameters:** An object containing timeline playback settings and callbacks (optional).

**Returns:** A Timeline instance with methods for adding animations, timers, callbacks, and labels.

---

## Core Timeline Methods

### add() - Adding Animations

The `add()` method creates and incorporates animations directly into the timeline, enabling tween value composition with existing timeline children.

#### Syntax
```javascript
timeline.add(targets, parameters, position);
```

#### Parameters

| Parameter | Accepts | Details |
|-----------|---------|---------|
| `targets` | Targets | DOM elements, CSS selectors, or JavaScript objects |
| `parameters` | Object | Includes animatable properties, tween settings, playback options, and callbacks |
| `position` | Time position | Optional timing placement |

#### Example
```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline()
  .add('.circle', { x: '15rem' })
  .add('.triangle', {
    x: '15rem',
    rotate: '1turn',
    duration: 500,
    alternate: true,
    loop: 2,
  })
  .add('.square', { x: '15rem' });
```

---

### add() - Adding Timers

Timers can be integrated into timelines using the `add()` method for direct timer creation.

#### Syntax
```javascript
timeline.add(parameters, position);
```

#### Parameters
- `parameters`: An object containing Timer playback settings and callbacks
- `position` (optional): Specifies where the timer should be placed on the timeline using time position notation

#### Example
```javascript
import { createTimer, createTimeline } from 'animejs';

const timer1 = createTimer({
  duration: 1500,
  onUpdate: self => $timer01.innerHTML = self.currentTime,
});

const tl = createTimeline()
  .sync(timer1)
  .add({ duration: 500, onUpdate: self => $timer02.innerHTML = self.currentTime })
  .add({ duration: 1000, onUpdate: self => $timer03.innerHTML = self.currentTime });
```

---

### sync() - Synchronizing Animations

The `sync()` method adds a pre-existing animation to the timeline without affecting tween composition for other children already in the timeline.

#### Syntax
```javascript
timeline.sync(animation, position);
```

#### Parameters

| Parameter | Accepts | Details |
|-----------|---------|---------|
| `animation` | Animation | Previously created animation instance |
| `position` | Time position | Optional placement timing |

**Returns:** The timeline instance (chainable)

#### Example
```javascript
import { createTimeline, animate } from 'animejs';

const circleAnimation = animate('.circle', {
  x: '15rem'
});

const tl = createTimeline()
  .sync(circleAnimation)
  .add('.triangle', {
    x: '15rem',
    rotate: '1turn',
    duration: 500,
    alternate: true,
    loop: 2,
  })
  .add('.square', { x: '15rem' });
```

---

### sync() - Synchronizing Timelines

Timelines can be synchronized to other timelines using the `sync()` method, allowing you to coordinate multiple timeline animations.

#### Syntax
```javascript
timelineA.sync(timelineB, position);
```

#### Parameters

| Name | Accepts |
|------|---------|
| `synced` | Animation, Timer, or Timeline object |
| `position` (optional) | Time position value |

**Returns:** The timeline itself, enabling method chaining.

#### Example
```javascript
import { createTimeline, animate } from 'animejs';

const circleAnimation = animate('.circle', { x: '15rem' });

const tlA = createTimeline()
  .sync(circleAnimation)
  .add('.triangle', { x: '15rem', duration: 2000 })
  .add('.square', { x: '15rem' });

const tlB = createTimeline({ defaults: { duration: 2000 } })
  .add(['.triangle', '.square'], { rotate: 360 }, 0)
  .add('.circle', { scale: [1, 1.5, 1] }, 0);

const tlMain = createTimeline()
  .sync(tlA)
  .sync(tlB, '-=2000');
```

---

### sync() - Synchronizing WAAPI Animations

Web Animation API (WAAPI) animations can be integrated into Anime.js timelines using the `sync()` method.

#### Syntax
```javascript
timeline.sync(animation, position);
```

#### Parameters

| Parameter | Accepts | Description |
|-----------|---------|-------------|
| `synced` | Animation, Timer, or Timeline | The animation to synchronize |
| `position` (optional) | Time position value | When to start the synced animation |

**Returns:** The timeline itself, enabling method chaining.

#### Example
```javascript
import { createTimeline, waapi } from 'animejs';

const circle = waapi.animate('.circle', { x: '15rem' });
const triangle = waapi.animate('.triangle', {
  x: '15rem',
  y: [0, '-1.5rem', 0],
  ease: 'out(4)',
  duration: 750,
});
const square = waapi.animate('.square', {
  x: '15rem',
  rotateZ: 360,
});

const tl = createTimeline()
  .sync(circle, 0)
  .sync(triangle, 350)
  .sync(square, 250);
```

---

### call() - Calling Functions

Functions are integrated into timelines using the `call()` method.

#### Syntax
```javascript
timeline.call(callback, position);
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `callback` | Function | The function to execute |
| `position` (optional) | Time position | When the function should be called within the timeline |

**Returns:** The timeline instance, enabling method chaining.

#### Example
```javascript
const tl = createTimeline()
  .call(() => $functionA.innerHTML = 'A', 0)
  .call(() => $functionB.innerHTML = 'B', 800)
  .call(() => $functionC.innerHTML = 'C', 1200);
```

This demonstrates how callbacks execute at specified millisecond positions (0ms, 800ms, and 1200ms respectively) within the timeline's duration.

---

### label() - Creating Labels

The `label()` method associates specific time positions with named labels within a timeline for easy reference. Once added, labels can be used as time position parameters.

#### Syntax
```javascript
timeline.label(labelName, position);
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `labelName` | String | The name identifier for the label |
| `position` (optional) | Time position | The timeline position where the label is set |

**Returns:** The timeline instance, allowing method chaining.

#### Example
```javascript
const tl = createTimeline()
  .label('circle', 0)
  .label('square', 500)
  .label('triangle', 1000)
  .add('.square', { x: '17rem', duration: 500 }, 'square')
  .add('.circle', { x: '13rem', duration: 1000 }, 'circle')
  .add('.triangle', { x: '15rem', rotate: '1turn', duration: 500 }, 'triangle');
```

#### Usage with Position Syntax
```javascript
const tl = createTimeline({ defaults: { duration: 750 } });

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

---

### set() - Setting Values

The `set()` method instantly sets target property values at a specific time of the timeline without animation.

#### Syntax
```javascript
timeline.set(targets, parameters, position);
```

#### Parameters

| Parameter | Type | Details |
|-----------|------|---------|
| `targets` | Targets | DOM elements, CSS selectors, or JavaScript objects to animate |
| `parameters` | Animatable properties | CSS properties, transforms, variables, or object properties |
| `position` (optional) | Time position | When in the timeline the values should be set |

**Returns:** The timeline itself, enabling method chaining.

#### Key Differences from add()
Unlike the `add()` method which animates properties over a duration, `set()` applies values instantaneously at a specified timeline position without animation.

#### Example
```javascript
const tl = createTimeline()
  .set('.circle', { x: '15rem' })
  .set('.triangle', { x: '15rem' }, 500)
  .set('.square', { x: '15rem' }, 1000);
```

---

### remove() - Removing Elements

The `remove()` method eliminates animations, timers, timelines, targets, or specific tween properties from a timeline.

#### Syntax

**Removing animations, timers, or timelines:**
```javascript
timeline.remove([animation, timer, timeline]);
```
- `object`: Animation, Timer, or Timeline instance
- `position` (optional): Time position reference

**Removing targets:**
```javascript
timeline.remove(targets);
```
- `targets`: CSS selectors, DOM elements, or target objects

**Removing specific properties:**
```javascript
timeline.remove(targets, propertyName);
```
- `targets`: Target reference
- `propertyName`: Valid animatable property name string

**Returns:** The timeline itself, enabling method chaining.

#### Key Behavior
Removing items from a timeline doesn't affect its duration. To restructure a timeline's shape and duration, create a new timeline instead.

**Important:** The timeline automatically pauses once all content is removed.

---

## Time Position Syntax

The timeline time position parameter determines when a child element is inserted into a timeline. If omitted, the child positions at the timeline's end.

### Position Types

#### Absolute Positioning
Places an element at an exact time.

```javascript
timeline.add('.element', { x: 100 }, 500); // Inserts at 500ms
```

#### Relative Positioning
Uses operators to position relative to the previous element's end:

- `'+=100'` - positions 100ms after the last element
- `'-=100'` - positions 100ms before the last element's end
- `'*=.5'` - positions at half the total element duration

```javascript
timeline.add('.element1', { x: 100 })
  .add('.element2', { x: 200 }, '+=100')  // 100ms after element1 ends
  .add('.element3', { x: 300 }, '-=50');  // 50ms before element2 ends
```

#### Previous Element References

- `'<'` - aligns with the previous element's end position
- `'<<'` - aligns with the previous element's start position
- `'<<+=250'` - combines operators: 250ms after the previous element's start

```javascript
timeline.add('.element1', { x: 100 })
  .add('.element2', { x: 200 }, '<')      // Starts when element1 ends
  .add('.element3', { x: 300 }, '<<')     // Starts when element2 starts
  .add('.element4', { x: 400 }, '<<+=250'); // 250ms after element3 starts
```

#### Label References
Use string names to reference previously defined labels:

```javascript
timeline.label('myLabel', 500)
  .add('.element', { x: 100 }, 'myLabel'); // Positions at the label
```

#### Stagger Utility
Distributes multiple elements with spacing:

```javascript
timeline.add('.elements', { x: 100 }, stagger(10)); // Spaces elements 10ms apart
```

### Combined Syntax
Position parameters can combine multiple operators for flexibility:

```javascript
timeline.add('.element', { x: 100 }, '<<+=250'); // 250ms after previous element's start
```

---

## Playback Control Methods

Timeline instances expose standard playback methods for controlling animation flow.

### play()
Initiates timeline playback from the current position.

```javascript
timeline.play();
```

---

### pause()
Halts timeline progression without resetting position.

```javascript
timeline.pause();
```

---

### reverse()
Changes playback direction to backwards.

```javascript
timeline.reverse();
```

---

### restart()
Stops and resets timeline to beginning, then starts playback.

```javascript
timeline.restart();
```

---

### resume()
Continues playback from paused state.

```javascript
timeline.resume();
```

---

### complete()
Advances timeline to final frame immediately.

```javascript
timeline.complete();
```

---

### cancel()
Halts and clears all active animations within the timeline.

```javascript
timeline.cancel();
```

---

### reset()
Returns timeline to initial state without playing.

```javascript
timeline.reset();
```

---

### seek()
Updates the `currentTime` of the timeline to a specific time.

#### Syntax
```javascript
timeline.seek(time, muteCallbacks);
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `time` | Number | The new currentTime in milliseconds |
| `muteCallbacks` | Boolean | Optional (defaults to false); when true, prevents callbacks from executing |

**Returns:** The timeline instance, allowing method chaining.

#### Use Case
The method is particularly useful with range sliders to control timeline playback position. As users adjust the slider, `seek()` repositions the animation to the corresponding time without triggering callbacks during input events, then executes callbacks on completion or pause.

---

### alternate()
Toggles the playback direction while adjusting the `currentTime` position to reflect the new time progress.

#### Syntax
```javascript
timeline.alternate();
```

**Returns:** The timeline instance, enabling method chaining.

#### Example
```javascript
const tl = createTimeline({ loop: true })
  .add('.circle',   { x: '15rem' })
  .add('.triangle', { x: '15rem' }, 500)
  .add('.square',   { x: '15rem' }, 1000);

const alternateTimeline = () => tl.alternate();
```

---

### stretch()
Modifies a timeline's total duration to fit a specific timeframe. It recalculates the duration of all child elements proportionally.

#### Syntax
```javascript
timeline.stretch(duration);
```

#### Parameters
- `duration` (Number): The new total duration in milliseconds for the timeline

**Returns:** The timeline instance, allowing method chaining.

#### Key Concept
The total duration equals the iteration duration multiplied by the total number of iterations. For example, a 1000ms timeline looping twice (3 total iterations) has a 3000ms total duration.

#### Example
```javascript
const tl = createTimeline({ loop: 1, alternate: true })
  .add('.circle', { x: '15rem' })
  .add('.triangle', { x: '15rem' }, 500)
  .add('.square', { x: '15rem' }, 1000);

tl.stretch(2000).restart(); // Stretches entire timeline to 2000ms
```

#### Use Case
This method is particularly useful when you need to synchronize animation durations with user input, scroll events, or other dynamic timeline adjustments without manually recalculating individual animation timings.

---

### init()
Initializes the starting values of all elements within a timeline.

#### Purpose
When animations with specific initial values are added to a timeline, they don't automatically render to their starting state like a standard `animate()` call would. Instead, initialization occurs when the timeline playhead reaches each element. The `init()` method forces rendering of all child elements' initial states and updates their values immediately.

#### Syntax
```javascript
timeline.init();
```

**Returns:** The timeline instance, enabling method chaining.

#### Example
```javascript
const tl = createTimeline()
  .add('.square',   { x: { from: '15rem' } })
  .add('.triangle', { x: { from: '15rem' } }, 500)
  .add('.circle',   { x: { from: '15rem' } }, 1000)
  .init();
```

---

### refresh()
Recalculates animated values in a timeline that use function-based values. It updates "from" values to current target values and "to" values to newly computed values.

#### Key Details
- Only animatable property values are recalculated
- Duration and delay parameters cannot be refreshed
- Particularly useful with loops to generate new values each iteration

#### Syntax
```javascript
timeline.refresh();
```

**Returns:** The timeline itself, allowing method chaining.

#### Example
```javascript
const tl = createTimeline({
  loop: true,
  onLoop: self => self.refresh()
})
.add('.circle',   { x: () => utils.random(0, 15) + 'rem' }, 0)
.add('.triangle', { x: () => utils.random(0, 15) + 'rem' }, 0)
.add('.square',   { x: () => utils.random(0, 15) + 'rem' }, 0);
```

This automatically refreshes the timeline each loop cycle, recalculating random x-position targets for the shapes.

---

## Timeline Parameters

Timeline configuration parameters can be passed to `createTimeline()`:

```javascript
const timeline = createTimeline(parameters);
```

### Available Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `defaults` | Object | Establishes baseline animation settings applied to all items added to the timeline |
| `delay` | Number | Sets initial wait time before timeline execution begins |
| `loop` | Number/Boolean | Enables repeating the entire timeline sequence |
| `loopDelay` | Number | Specifies pause duration between loop cycles |
| `alternate` | Boolean | Reverses direction on each loop iteration |
| `reversed` | Boolean | Inverts playback direction from the start |
| `autoplay` | Boolean | Determines whether timeline automatically begins upon creation |
| `frameRate` | Number | Controls animation frame refresh frequency |
| `playbackRate` | Number | Adjusts timeline speed (values >1 accelerate, <1 decelerate) |
| `playbackEase` | String/Function | Applies easing functions to playback speed changes |

### Example with Defaults
```javascript
const tl = createTimeline({
  defaults: { duration: 750, ease: 'outQuad' },
  loop: true,
  loopDelay: 500
});

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

---

## Timeline Callbacks

Timeline callbacks allow you to execute functions at specific points during a timeline playback. These callbacks are defined directly in the `createTimeline()` parameters object.

### Available Callbacks

| Callback | Description |
|----------|-------------|
| `onBegin` | Triggered when the timeline starts |
| `onComplete` | Triggered when the timeline finishes |
| `onBeforeUpdate` | Triggered before each update cycle |
| `onUpdate` | Triggered during each update |
| `onRender` | Triggered on render events |
| `onLoop` | Triggered when a loop iteration completes |
| `onPause` | Triggered when the timeline is paused |
| `then()` | A chainable promise-like callback method |

### Implementation Pattern

Callbacks are structured within the timeline configuration:

```javascript
const tl = createTimeline({
  defaults: { duration: 500 },
  onBegin: () => console.log('Timeline started'),
  onLoop: (self) => {
    console.log('Loop completed');
    self.refresh(); // Recalculate values for next loop
  },
  onUpdate: (self) => {
    console.log('Current time:', self.currentTime);
  },
  onComplete: () => console.log('Timeline completed')
});
```

### Callback with Parameters

Callbacks receive the timeline instance as their parameter, allowing access to timeline properties and methods:

```javascript
const tl = createTimeline({
  loop: true,
  onLoop: self => self.refresh(),
  onUpdate: self => {
    progressBar.style.width = (self.currentTime / self.duration * 100) + '%';
  }
})
.add('.circle',   { x: () => utils.random(0, 15) + 'rem' }, 0)
.add('.triangle', { x: () => utils.random(0, 15) + 'rem' }, 0)
.add('.square',   { x: () => utils.random(0, 15) + 'rem' }, 0);
```

---

## Complete Example

Here's a comprehensive example demonstrating multiple timeline features:

```javascript
import { createTimeline, animate, createTimer } from 'animejs';

// Pre-create some animations
const circleAnimation = animate('.circle', {
  x: '15rem',
  duration: 1000
});

// Create main timeline with configuration
const tl = createTimeline({
  defaults: {
    duration: 750,
    ease: 'outQuad'
  },
  loop: 2,
  loopDelay: 500,
  alternate: true,
  onBegin: () => console.log('Timeline started'),
  onLoop: self => {
    console.log('Loop completed');
    self.refresh();
  },
  onComplete: () => console.log('Timeline completed')
});

// Build timeline sequence
tl
  .label('start', 0)
  .sync(circleAnimation, 'start')
  .call(() => console.log('Checkpoint A'), 500)
  .label('middle', 1000)
  .add('.square', {
    x: '17rem',
    rotate: 360,
    duration: 500
  }, 'middle')
  .set('.triangle', { opacity: 0 }, 'middle')
  .add('.triangle', {
    x: '15rem',
    rotate: '1turn',
    opacity: 1
  }, '<<+=250')
  .call(() => console.log('Checkpoint B'), 2000)
  .init();

// Playback control
document.querySelector('#play').addEventListener('click', () => tl.play());
document.querySelector('#pause').addEventListener('click', () => tl.pause());
document.querySelector('#restart').addEventListener('click', () => tl.restart());
document.querySelector('#reverse').addEventListener('click', () => tl.reverse());

// Seek with slider
document.querySelector('#slider').addEventListener('input', (e) => {
  tl.seek(e.target.value, true); // true = mute callbacks during scrubbing
});
```

---

## Version Notes

Most timeline features are available since Anime.js version 4.0.0. The `alternate()` method was introduced in version 2.0.0.

---

## Related Documentation

- [Animation Documentation](https://animejs.com/documentation/animation/)
- [Timer Documentation](https://animejs.com/documentation/timer/)
- [Targets Documentation](https://animejs.com/documentation/animation/targets)
- [Animatable Properties](https://animejs.com/documentation/animation/animatable-properties)
- [Easing Functions](https://animejs.com/documentation/animation/easing)
