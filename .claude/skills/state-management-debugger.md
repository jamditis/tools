# State Management Debugger

The LLM Advisor's state lives in closure variables with no centralized state object. Understanding where state lives and how it mutates is critical for debugging.

## State location

All state is declared at the top of the IIFE in `/resource-kit/docs/llm-advisor/app.js` (~line 48):

```javascript
let currentStep = 'start';        // Current node ID in decision tree
let history = [];                 // Array of navigation history
let selectedTools = [];           // Tools for recommendation view
let compareTools = [];            // Tools selected for comparison (max 3)
let showRecommendation = false;   // Which view to render
let currentTrack = 'research';    // Current track for color coding
```

## State variable details

### `currentStep` (string)
- Points to a node ID in `decisionTree`
- Must be a valid key in `decision-tree.json`
- Starts as `'start'`

### `history` (array)
- Tracks navigation for back button and breadcrumbs
- Each item: `{ step, question, selection, track }`
- Grows via `push()`, shrinks via `pop()`

### `selectedTools` (array)
- Populated when user reaches a recommendation
- Contains tool objects from decision tree
- Replaced wholesale, not mutated

### `compareTools` (array)
- Tools selected for side-by-side comparison
- Maximum 3 items enforced in code
- Toggled via `push()` and `filter()`

### `showRecommendation` (boolean)
- `false` → render question view
- `true` → render recommendation view

### `currentTrack` (string)
- One of: `research`, `content`, `data`, `editing`, `sources`, `multimedia`
- Determines accent colors via `getTrackColor()`

## State mutation patterns

```javascript
// Navigate to next question
currentStep = option.next;
history.push({ step: currentStep, question, selection, track });

// Navigate back
const previous = history.pop();
currentStep = previous.step;
showRecommendation = false;

// Reach recommendation
showRecommendation = true;
selectedTools = option.tools;

// Toggle comparison tool
if (compareTools.includes(tool)) {
    compareTools = compareTools.filter(t => t !== tool);
} else if (compareTools.length < 3) {
    compareTools.push(tool);
}

// Full reset (restart button)
currentStep = 'start';
history = [];
selectedTools = [];
compareTools = [];
showRecommendation = false;
currentTrack = 'research';
```

## Debugging state

Add temporary logging to `renderApp()`:

```javascript
function renderApp() {
    console.log('STATE:', {
        currentStep,
        historyLength: history.length,
        historyLast: history[history.length - 1],
        selectedTools: selectedTools.map(t => t.name),
        showRecommendation,
        currentTrack,
        compareTools
    });
    // ... rest of function
}
```

## Invalid states to watch for

| Invalid State | Symptom | Cause |
|--------------|---------|-------|
| `currentStep` not in tree | Crash on render | Bad `next` value in JSON |
| `showRecommendation=true` with empty `selectedTools` | Blank recommendation | Missing `tools` in JSON |
| `history` doesn't match navigation | Wrong breadcrumbs | State mutation bug |
| `compareTools.length > 3` | UI overflow | Missing max check |

## Recovery patterns

**Soft reset (back to start):**
```javascript
currentStep = 'start';
history = [];
showRecommendation = false;
// Keep compareTools and selectedTools
```

**Hard reset (full restart):**
```javascript
currentStep = 'start';
history = [];
selectedTools = [];
compareTools = [];
showRecommendation = false;
currentTrack = 'research';
```

## State flow diagram

```
User clicks option
    ↓
Extract: next, text, tools, track from button.dataset
    ↓
Update currentTrack = track
    ↓
If tools present:
    selectedTools = parsed JSON
    ↓
Push to history: { step, question, selection, track }
    ↓
If next === "recommendation":
    showRecommendation = true
Else:
    currentStep = next
    ↓
renderApp() → Reads all state, renders appropriate view
```

## Common debugging scenarios

**"Navigation is broken"**
1. Check `currentStep` points to valid node
2. Check `history` has correct entries
3. Verify JSON has valid `next` values

**"Recommendation shows wrong tools"**
1. Check `selectedTools` contains expected data
2. Trace which option was clicked
3. Verify `tools` array in decision-tree.json

**"Back button doesn't work"**
1. Check `history.length > 0`
2. Verify `pop()` returns expected previous state
3. Check `showRecommendation` resets to false

**"Colors are wrong"**
1. Check `currentTrack` value
2. Verify track in decision-tree.json options
3. Check `getTrackColor()` mapping
