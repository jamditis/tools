# Anime.js Web Animation API (WAAPI) Integration - Complete Documentation

## Table of Contents
- [Overview](#overview)
- [Method Syntax and Import](#method-syntax-and-import)
- [Parameters](#parameters)
- [Supported Configuration](#supported-configuration)
- [Code Examples](#code-examples)
- [Improvements to Web Animation API](#improvements-to-web-animation-api)
- [Performance Benefits](#performance-benefits)
- [Integration Capabilities](#integration-capabilities)
- [API Differences from Native WAAPI](#api-differences-from-native-waapi)
- [Return Value](#return-value)

---

## Overview

Anime.js provides a lightweight alternative to its standard `animate()` method through Web Animation API integration. According to the documentation:

> "Anime.js offers a even more lightweight alternative (3KB versus 10KB) to the `animate()` method that uses the Web Animation `Element.animate()` API under the hood."

**Key Benefits:**
- **Smaller bundle size**: 3KB vs 10KB (70% reduction)
- **Native browser API**: Leverages built-in `Element.animate()`
- **Enhanced functionality**: Significant improvements over native WAAPI
- **Full integration**: Works with Anime.js utilities and features

---

## Method Syntax and Import

The `waapi.animate()` method can be imported in two ways:

### From Main Module

```javascript
import { waapi } from 'animejs';
const animation = waapi.animate(targets, parameters);
```

### From Standalone Subpath

```javascript
import { waapi } from 'animejs/waapi';
```

**Method Signature:**
```javascript
waapi.animate(targets, parameters)
```

---

## Parameters

The method accepts two required arguments:

| Parameter | Type | Description |
|-----------|------|-------------|
| **targets** | CSS selector(s), DOM element(s), JavaScript object(s), or arrays | The element(s) or object(s) to animate |
| **parameters** | Object | Configuration object containing animatable properties and settings |

### Targets Accepts:
- CSS selectors (string)
- DOM elements
- JavaScript objects
- Arrays of any combination of the above

---

## Supported Configuration

The `parameters` object supports comprehensive configuration options:

### 1. Animatable Properties
- CSS properties
- Transforms
- CSS variables
- Object properties
- HTML attributes
- SVG attributes

### 2. Tween Parameters
- `to` - Target value
- `from` - Starting value
- `delay` - Animation delay
- `duration` - Animation duration
- `ease` - Easing function
- `composition` - Animation composition mode
- `modifier` - Value modifier function

### 3. Playback Settings
- `loop` - Number of times to repeat
- `alternate` - Alternate direction on loop
- `reversed` - Play animation in reverse
- `autoplay` - Start animation automatically
- `frameRate` - Animation frame rate
- `playbackRate` - Speed multiplier

### 4. Callbacks
- `onBegin` - Fires when animation starts
- `onComplete` - Fires when animation completes
- `onUpdate` - Fires on each frame update
- `onLoop` - Fires on each loop iteration
- `onPause` - Fires when animation pauses
- `then()` - Promise-based completion handler

---

## Code Examples

### Basic Example with Text Animation

```javascript
import { waapi, stagger, splitText } from 'animejs';

const { chars } = splitText('h2', { words: false, chars: true });

waapi.animate(chars, {
  translate: `0 -2rem`,
  delay: stagger(100),
  duration: 600,
  loop: true,
  alternate: true,
  ease: 'inOut(2)',
});
```

### ScrollObserver Integration

```javascript
waapi.animate('.square', {
  translate: '100px',
  autoplay: onScroll()
});
```

---

## Improvements to Web Animation API

Anime.js version 4.0.0 introduces the `waapi.animate()` method with **seven major improvements** to the native Web Animation API experience:

### 1. Sensible Defaults
Streamlined parameter handling with intelligent preset values that reduce boilerplate code.

### 2. Multi-Targets Animation
Ability to animate multiple elements simultaneously with a single method call.

**Example:**
```javascript
// Animate multiple elements at once
waapi.animate(['.box1', '.box2', '.box3'], {
  translate: '100px',
  duration: 1000
});
```

### 3. Default Units
Automatic unit assignment for numeric values - no need to manually specify 'px', 'deg', etc.

**Example:**
```javascript
// Automatically interprets as pixels
waapi.animate('.element', {
  translate: 100,  // Interpreted as '100px'
  rotate: 45       // Interpreted as '45deg'
});
```

### 4. Function-Based Values
Dynamic value generation during animation execution for each target.

**Example:**
```javascript
waapi.animate('.item', {
  translate: (el, i) => i * 50,  // Different value per element
  duration: 1000
});
```

### 5. Individual Transforms
Direct manipulation of individual CSS transform properties without affecting others.

**Example:**
```javascript
// Animate translateX without affecting translateY, rotate, etc.
waapi.animate('.element', {
  translateX: 100,
  scale: 1.5
});
```

### 6. Individual Property Parameters
Per-property configuration options for fine-grained control.

**Example:**
```javascript
waapi.animate('.element', {
  translateX: {
    to: 100,
    duration: 1000,
    ease: 'inOut(2)'
  },
  opacity: {
    to: 0,
    duration: 500,
    ease: 'linear'
  }
});
```

### 7. Spring and Custom Easings
Support for spring physics and custom easing functions beyond standard CSS easings.

**Example:**
```javascript
// Spring-based easing
waapi.animate('.element', {
  translate: 100,
  ease: 'spring(1, 80, 10, 0)'
});

// Custom easing functions
waapi.animate('.element', {
  translate: 100,
  ease: 'inOut(2)'
});
```

---

## Performance Benefits

### Bundle Size Comparison

| Method | Bundle Size | Reduction |
|--------|-------------|-----------|
| `animate()` | 10KB | - |
| `waapi.animate()` | 3KB | **70% smaller** |

### Performance Advantages

1. **Smaller footprint**: Significantly reduced JavaScript payload
2. **Native browser optimization**: Leverages browser's built-in animation engine
3. **Hardware acceleration**: Automatic GPU acceleration for transforms and opacity
4. **Reduced JavaScript overhead**: Less parsing and execution time

---

## Integration Capabilities

The enhanced WAAPI implementation seamlessly integrates with other Anime.js features:

### ScrollObserver Integration
```javascript
waapi.animate('.square', {
  translate: '100px',
  autoplay: onScroll()
});
```

### Scope Support
- Media queries handling
- Component cleanup via `createScope()`

**Example:**
```javascript
import { createScope } from 'animejs';

const scope = createScope();

scope.waapi.animate('.element', {
  translate: 100,
  duration: 1000
});

// Clean up when component unmounts
scope.revert();
```

### Utility Functions
Works with all Anime.js utilities:
- `stagger()` - Staggered delays
- `splitText()` - Text manipulation
- `convertEase()` - Easing conversion

---

## API Differences from Native WAAPI

The Anime.js `waapi.animate()` implementation differs from native Web Animation API in specific areas:

### 1. Iterations Handling
Enhanced loop behavior with `loop` parameter instead of native `iterations`.

### 2. Direction Control
Simplified direction control with `alternate` and `reversed` parameters.

### 3. Easing Handling
Extended easing support including:
- Spring physics: `spring(mass, stiffness, damping, velocity)`
- Custom easings: `inOut(power)`, `out(power)`, `in(power)`
- Conversion utility: `convertEase()` function

### 4. Finished Promise Behavior
Modified promise resolution behavior for better integration with Anime.js animation system.

---

## Return Value

The method returns a `WAAPIAnimation` object for controlling the animation programmatically.

### WAAPIAnimation Object

The returned object provides standard animation control methods:

```javascript
const animation = waapi.animate('.element', {
  translate: 100,
  duration: 1000
});

// Control methods
animation.play();
animation.pause();
animation.reverse();
animation.restart();
animation.seek(time);
```

### Control Methods
- `play()` - Play the animation
- `pause()` - Pause the animation
- `reverse()` - Reverse playback direction
- `restart()` - Restart from beginning
- `seek(time)` - Jump to specific time

---

## Utilities

### convertEase()

Utility function for converting between different easing formats.

```javascript
import { convertEase } from 'animejs/waapi';

// Convert Anime.js easing to WAAPI-compatible format
const converted = convertEase('inOut(2)');
```

---

## Summary

Anime.js's `waapi.animate()` method provides:

✅ **70% smaller bundle size** (3KB vs 10KB)
✅ **Native browser performance** via Element.animate()
✅ **Enhanced developer experience** with 7 major improvements
✅ **Full Anime.js integration** with utilities and features
✅ **Backward compatible** with familiar Anime.js syntax
✅ **Spring physics and custom easings**
✅ **Multi-target support**
✅ **Individual transform control**

Perfect for projects requiring:
- Minimal bundle size
- Maximum performance
- Modern browser environments
- Web Animation API compatibility
