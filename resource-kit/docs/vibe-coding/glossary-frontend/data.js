const GLOSSARY_META = {
    title: "Frontend engineering glossary",
    description: "From hydration to CRDT — the deep vocabulary of modern browser, framework, and web platform engineering.",
    categories: [
        { id: "rendering", label: "Rendering & hydration", icon: "monitor" },
        { id: "state",     label: "State management",     icon: "layers" },
        { id: "browser",   label: "Browser internals",    icon: "cpu" },
        { id: "performance", label: "Performance & vitals", icon: "zap" },
        { id: "bundling",  label: "Bundling & modules",   icon: "package" },
        { id: "data",      label: "Data & caching",       icon: "database" },
        { id: "security",  label: "Security & policies",  icon: "shield" },
        { id: "architecture", label: "Architecture patterns", icon: "git-branch" }
    ]
};

const TERMS = [

// ── Rendering & hydration (12) ────────────────────────────────────────────────

{
    id: "hydration",
    term: "Hydration",
    tagline: "Attaching event listeners to server-rendered HTML to make it interactive",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes drop{0%{opacity:0;transform:translateY(-8px)}60%{opacity:1}100%{opacity:0;transform:translateY(28px)}}</style><rect x="20" y="65" width="80" height="38" rx="4" fill="var(--diagram-ink)" opacity=".18" stroke="var(--diagram-ink)" stroke-width="2"/><ellipse cx="40" cy="32" rx="5" ry="7" fill="var(--diagram-ink)" style="animation:drop 1.8s 0s infinite"/><ellipse cx="60" cy="22" rx="5" ry="7" fill="var(--diagram-ink)" style="animation:drop 1.8s .5s infinite"/><ellipse cx="80" cy="32" rx="5" ry="7" fill="var(--diagram-ink)" style="animation:drop 1.8s 1s infinite"/></svg>`,
    definition: `Hydration is the process by which a JS framework takes over a server-rendered HTML document and attaches event listeners, making static markup interactive. The browser receives fully-formed HTML immediately, then downloads and executes the JS bundle which traverses the existing DOM to wire up the component tree.\n\nHydration cost is easy to underestimate. Even though no new DOM nodes are created, the framework must re-run every component's render logic to reconcile its virtual state with the existing markup. On large pages this traversal can block the main thread for hundreds of milliseconds after the content is already visible.`,
    analogy: `Think of a mannequin dressed in real clothes (server HTML). Hydration is the process of replacing the mannequin's rigid arms with articulated ones — the outfit looks the same the whole time, but only once the swap is done can the arms actually move.`,
    examples: [
        { title: "ReactDOM.hydrateRoot", text: "hydrateRoot(container, <App />) tells React to reuse server-rendered markup rather than creating fresh nodes. Mismatches between server and client output cause hydration errors." },
        { title: "Next.js page transition", text: "Next.js ships pre-rendered HTML so content appears before JS loads, then hydrates the page enabling client-side navigation and event handling." }
    ],
    useCases: ["SSR frameworks (Next.js, Remix, Nuxt)", "Static site generators with interactive widgets", "Progressive enhancement scenarios"],
    tradeoffs: {
        pros: ["Faster first contentful paint", "SEO-friendly server-rendered HTML", "Content visible before JS executes"],
        cons: ["Double rendering cost — server generates HTML, client traverses it again", "Hydration mismatches cause hard-to-debug errors", "JS bundle must download before the page is fully interactive"]
    },
    related: ["partial-hydration", "selective-hydration", "streaming-ssr", "server-components"]
},

{
    id: "partial-hydration",
    term: "Partial hydration",
    tagline: "Hydrating only the components that actually need interactivity",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes glow{0%,100%{opacity:.35}50%{opacity:1}}</style><rect x="10" y="15" width="45" height="40" rx="3" fill="var(--diagram-ink)" style="animation:glow 2s infinite"/><rect x="65" y="15" width="45" height="40" rx="3" fill="var(--diagram-ink)" opacity=".18" stroke="var(--diagram-ink)" stroke-width="1.5"/><rect x="10" y="65" width="45" height="40" rx="3" fill="var(--diagram-ink)" opacity=".18" stroke="var(--diagram-ink)" stroke-width="1.5"/><rect x="65" y="65" width="45" height="40" rx="3" fill="var(--diagram-ink)" style="animation:glow 2s .9s infinite"/></svg>`,
    definition: `Partial hydration hydrates only the components that require client-side interactivity, leaving the rest as inert server-rendered HTML. Components like a search bar or carousel receive JS; static sections like article text or a footer do not. This avoids traversing and wiring up components that will never receive user input.\n\nFrameworks implement this via explicit annotations (Astro's client:load directive) or static analysis that detects event handler usage. The result is a drastically smaller JS footprint and less main-thread work on page load, since the browser skips hydration for the majority of the page.`,
    analogy: `Installing electricity in a historic building: you only run wires to the rooms that need outlets. The unelectrified rooms still look fine and serve their purpose — wiring everything would just waste material and time.`,
    examples: [
        { title: "Astro client directives", text: "<Counter client:load /> hydrates immediately while <ArticleBody /> stays as static HTML. Only the Counter component downloads and executes JavaScript." },
        { title: "Marko compiler", text: "Marko's compiler statically identifies stateful template sections and only ships JS for those components, with no manual annotation required." }
    ],
    useCases: ["Content-heavy pages with a few interactive widgets", "Marketing sites with a single CTA", "News articles with an embedded comments section"],
    tradeoffs: {
        pros: ["Less JS shipped to client", "Faster Time to Interactive", "Static sections incur zero hydration cost"],
        cons: ["Requires framework support or explicit annotations", "Inter-component communication across hydrated/non-hydrated boundary is complex", "Debugging can be harder when components behave differently based on hydration status"]
    },
    related: ["hydration", "islands-architecture", "selective-hydration", "server-components"]
},

{
    id: "islands-architecture",
    term: "Islands architecture",
    tagline: "Interactive component islands surrounded by static HTML oceans",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}</style><rect x="5" y="72" width="110" height="42" rx="4" fill="var(--diagram-ink)" opacity=".12" stroke="var(--diagram-ink)" stroke-width="1.5"/><ellipse cx="30" cy="68" rx="20" ry="11" fill="var(--diagram-ink)" opacity=".7" style="animation:bob 3s ease-in-out infinite"/><ellipse cx="90" cy="65" rx="24" ry="13" fill="var(--diagram-ink)" style="animation:bob 3s 1.1s ease-in-out infinite"/><ellipse cx="60" cy="70" rx="13" ry="7" fill="var(--diagram-ink)" opacity=".3"/></svg>`,
    definition: `Islands architecture describes a page structure where interactive "islands" (hydrated components) are embedded in a sea of static, non-interactive HTML. Coined by Katie Sylor-Miller and popularized by Astro, each island is independently hydrated and can have its own loading priority. Everything outside an island is pure markup with no associated JS.\n\nUnlike SPAs, there is no app-level runtime connecting all components. Each island is isolated — it cannot directly communicate with another island without going through a shared state mechanism like a URL parameter, localStorage, or a global store. This isolation is both the key benefit (no framework overhead) and the key constraint.`,
    analogy: `A printed magazine with interactive QR codes: the page itself is static, but each QR code links to a small, self-contained interactive experience. The magazine as a whole requires no special reader software — only the QR code scanner needs to run.`,
    examples: [
        { title: "Astro islands", text: "A single Astro page can host a React <SearchBar client:load />, a Vue <Carousel client:visible />, and a Svelte <Newsletter client:idle /> — three isolated frameworks, each downloading its own JS." },
        { title: "Fresh (Deno)", text: "Fresh ships zero JS by default. You opt individual components into interactivity by placing them in the islands/ directory." }
    ],
    useCases: ["Documentation sites with a search widget", "E-commerce pages with an add-to-cart island", "Multi-framework migrations (strangler fig pattern)"],
    tradeoffs: {
        pros: ["Near-zero JS for static content", "Independent island loading priorities", "Mix frameworks freely on one page"],
        cons: ["No shared component tree — inter-island communication is awkward", "Different mental model from SPA development", "Potential duplication if multiple islands need the same shared logic"]
    },
    related: ["partial-hydration", "hydration", "micro-frontends", "server-components"]
},

{
    id: "streaming-ssr",
    term: "Streaming SSR",
    tagline: "Sending HTML to the browser in progressive chunks as it's generated",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes flow{0%{stroke-dashoffset:80}100%{stroke-dashoffset:0}}.ln{stroke:var(--diagram-ink);stroke-width:2.5;fill:none;stroke-dasharray:80;stroke-linecap:round;animation:flow 1.6s linear infinite}</style><path class="ln" d="M10 30 Q40 30 110 30"/><path class="ln" d="M10 50 Q40 50 110 50" style="animation-delay:.35s"/><path class="ln" d="M10 70 Q40 70 110 70" style="animation-delay:.7s"/><path class="ln" d="M10 90 Q40 90 110 90" style="animation-delay:1.05s"/></svg>`,
    definition: `Streaming SSR sends HTML to the browser incrementally as the server generates it, rather than waiting for the entire page before transmitting. The browser can start parsing and rendering the document top while the server is still computing the bottom, significantly reducing the time to first byte for visible content.\n\nReact 18's renderToPipeableStream integrates with Suspense: when a component suspends waiting for data, React sends a placeholder and continues streaming the rest of the page. Once the data resolves, React streams a small inline script that replaces the placeholder with the real content — no client re-render required.`,
    analogy: `A restaurant that brings each course as it's ready, rather than waiting until the entire meal is plated. You start eating bread while the chef finishes the main course.`,
    examples: [
        { title: "React renderToPipeableStream", text: "Wrapping a slow data-fetching component in <Suspense fallback={<Spinner/>}> lets React stream the rest of the page and flush that section later when data arrives." },
        { title: "Next.js App Router loading.tsx", text: "loading.tsx files render as Suspense fallbacks — Next.js streams the shell and navigation instantly while server segments load asynchronously." }
    ],
    useCases: ["Pages with data-dependent sections that load at different speeds", "Improving perceived performance on content-heavy SSR pages", "Reducing TTFB for large document responses"],
    tradeoffs: {
        pros: ["Browser starts rendering before full page is ready", "Better perceived performance on slow pages", "Works with HTTP/1.1 chunked transfer encoding"],
        cons: ["Complicates error handling — headers are committed before errors in streamed sections", "Requires Suspense-aware data fetching patterns", "Status codes must be set before streaming begins"]
    },
    related: ["hydration", "selective-hydration", "suspense-boundaries", "server-components"]
},

{
    id: "concurrent-rendering",
    term: "Concurrent rendering",
    tagline: "Interruptible, prioritized rendering that keeps the UI responsive",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.9}}</style><rect x="10" y="20" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s 0s infinite"/><rect x="10" y="44" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s .3s infinite"/><rect x="10" y="68" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s .6s infinite"/><rect x="10" y="92" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s .9s infinite"/><rect x="68" y="20" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s .15s infinite"/><rect x="68" y="44" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s .45s infinite"/><rect x="68" y="68" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s .75s infinite"/><rect x="68" y="92" width="42" height="14" rx="2" fill="var(--diagram-ink)" style="animation:pulse 1.4s 1.05s infinite"/></svg>`,
    definition: `Concurrent rendering (React 18+) allows React to prepare multiple versions of the UI simultaneously and to pause, interrupt, or abandon in-progress renders when higher-priority work arrives. Previously a render ran to completion on the main thread; concurrent mode makes renders interruptible work units.\n\nWork marked as a transition (startTransition or useTransition) can be interrupted if user input arrives mid-render. React abandons the in-progress work, responds to the input first, and restarts the transition when the thread is free. This prevents the UI from freezing during expensive state-driven re-renders.`,
    analogy: `A chef who can pause a complex sauce mid-preparation to handle a fire alarm, deal with the emergency, and return to the sauce without losing progress. The sauce is interruptible work; the alarm is urgent input.`,
    examples: [
        { title: "startTransition", text: "Wrapping setSearchQuery in startTransition marks it as deferrable. Typing remains snappy even if rendering the search results list is expensive." },
        { title: "useDeferredValue", text: "useDeferredValue(query) returns a lagged copy — the expensive results list renders with the old value while a new transition is prepared, preventing jank." }
    ],
    useCases: ["Search-as-you-type with expensive result rendering", "Tab switching between heavy views", "Keeping animations smooth during data-driven re-renders"],
    tradeoffs: {
        pros: ["UI stays responsive during expensive renders", "Urgent and non-urgent work are explicitly prioritized", "Foundation for time slicing and selective hydration"],
        cons: ["Requires React 18+ and concurrent-compatible libraries", "Render functions must be pure — they may be invoked multiple times", "State updates inside transitions behave differently from synchronous updates"]
    },
    related: ["time-slicing", "fiber-architecture", "scheduler-priorities", "tearing"]
},

{
    id: "time-slicing",
    term: "Time slicing",
    tagline: "Splitting render work into small chunks spread across multiple frames",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes rotate{100%{transform:rotate(360deg)}}</style><circle cx="60" cy="60" r="44" fill="none" stroke="var(--diagram-ink)" stroke-width="2" opacity=".25"/><path d="M60 60 L60 16 A44 44 0 0 1 98 82 Z" fill="var(--diagram-ink)" opacity=".55"/><path d="M60 60 L98 82 A44 44 0 0 1 27 93 Z" fill="var(--diagram-ink)" opacity=".3"/><path d="M60 60 L27 93 A44 44 0 0 1 60 16 Z" fill="var(--diagram-ink)" opacity=".15"/></svg>`,
    definition: `Time slicing breaks a large computation into small units of work, each running within a single frame budget (~5ms). Between units, control is yielded back to the browser to handle input events and animations. React's internal scheduler implements time slicing when concurrent features are used.\n\nThe browser event loop processes tasks serially — a 200ms JS task blocks everything for 200ms. Time slicing converts that into 40 × 5ms slices interleaved with the browser's own work. The user experiences the page as responsive during long renders because the main thread is never held for more than a few milliseconds at a stretch.`,
    analogy: `Mowing a large lawn by cutting one row at a time and pausing after each to check for urgent messages, rather than pushing nonstop for two hours. Each row is a time slice. You can respond to an urgent call between rows without losing your place.`,
    examples: [
        { title: "React scheduler", text: "React's scheduler uses MessageChannel to yield after each ~5ms work loop, checking for higher-priority tasks (user events) before continuing with the render." },
        { title: "Manual slicing with generators", text: "Custom implementations can use generator functions and requestIdleCallback to process large arrays in chunks, yielding between iterations to stay within frame budgets." }
    ],
    useCases: ["Rendering large lists incrementally", "Heavy computation without blocking the main thread", "Complex canvas drawing broken into steps"],
    tradeoffs: {
        pros: ["Input remains responsive during heavy work", "Enables prioritization — urgent events preempt slices", "Composable with memoization to skip unchanged slices"],
        cons: ["Total work takes longer than uninterrupted execution", "Shared mutable state between slices can cause consistency issues", "Requires careful design to avoid visible partial-render artifacts"]
    },
    related: ["concurrent-rendering", "fiber-architecture", "scheduler-priorities", "event-loop-tasks"]
},

{
    id: "reconciliation-algorithm",
    term: "Reconciliation algorithm",
    tagline: "How React determines what DOM updates to make after a state change",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes dash{0%{stroke-dashoffset:20}100%{stroke-dashoffset:0}}.dc{stroke:var(--diagram-ink);stroke-width:1.5;fill:none;stroke-dasharray:20;animation:dash 1.5s linear infinite}</style><circle cx="30" cy="28" r="11" fill="var(--diagram-ink)" opacity=".6"/><circle cx="90" cy="28" r="11" fill="var(--diagram-ink)" opacity=".3"/><circle cx="15" cy="76" r="8" fill="var(--diagram-ink)" opacity=".6"/><circle cx="45" cy="76" r="8" fill="var(--diagram-ink)" opacity=".6"/><circle cx="75" cy="76" r="8" fill="var(--diagram-ink)" opacity=".3"/><circle cx="105" cy="76" r="8" fill="var(--diagram-ink)" opacity=".6"/><line class="dc" x1="30" y1="39" x2="15" y2="68"/><line class="dc" x1="30" y1="39" x2="45" y2="68" style="animation-delay:.3s"/><line class="dc" x1="90" y1="39" x2="75" y2="68" style="animation-delay:.6s"/><line class="dc" x1="90" y1="39" x2="105" y2="68" style="animation-delay:.9s"/></svg>`,
    definition: `React's reconciliation algorithm determines the minimum set of DOM operations needed to update the UI after a state change. Diffing two arbitrary trees naively is O(n³), but React uses a heuristic O(n) algorithm based on two assumptions: elements of different types produce entirely different trees, and keyed list items can be matched across renders.\n\nWhen a component's type changes at a position in the tree, React unmounts the old subtree and mounts the new one from scratch. When the type is stable, React updates the existing instance. The key prop is critical for lists — without stable keys, any reorder forces React to assume the worst case and update every node.`,
    analogy: `A moving company that inventories both apartments before the move. Rather than transporting every item, they compare the lists, move only what changed rooms, and leave the rest in place. The comparison (diffing) is what makes it efficient.`,
    examples: [
        { title: "Key prop on lists", text: "Without a key, reordering a list causes React to update every DOM node. With stable keys, React matches old nodes to new positions and only applies the minimal set of moves." },
        { title: "Type mismatch unmount", text: "Changing from <Input /> to <Select /> at the same tree position triggers a full unmount/remount — all Input state is lost." }
    ],
    useCases: ["Understanding performance of large dynamic lists", "Diagnosing unexpected component resets", "Optimizing component tree structure"],
    tradeoffs: {
        pros: ["O(n) complexity via heuristics makes it practical", "Existing component instances are reused when type is stable", "Keys allow efficient list reordering"],
        cons: ["Heuristics fail when elements at the same position change type frequently", "Array index as key causes correctness bugs on reordering", "Still proportional to tree depth"]
    },
    related: ["vdom-diffing", "fiber-architecture", "structural-sharing", "referential-equality"]
},

{
    id: "fiber-architecture",
    term: "Fiber architecture",
    tagline: "React's linked-list work unit model that makes rendering interruptible",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes weave{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}.wv{stroke:var(--diagram-ink);stroke-width:2;fill:none;stroke-dasharray:100;stroke-linecap:round;animation:weave 2.5s linear infinite}</style><path class="wv" d="M15 20 Q35 55 15 90"/><path class="wv" d="M38 20 Q58 55 38 90" style="animation-delay:.5s"/><path class="wv" d="M61 20 Q81 55 61 90" style="animation-delay:1s"/><path class="wv" d="M84 20 Q104 55 84 90" style="animation-delay:1.5s"/><path class="wv" d="M107 20 Q107 55 107 90" style="animation-delay:2s" opacity=".3"/></svg>`,
    definition: `React Fiber is the reconciler rewrite introduced in React 16. Each component instance maps to a "fiber" — a JS object with pointers to its parent, child, and sibling fibers. This linked list structure allows React to pause traversal, resume it later, and work on different subtrees in different priority lanes.\n\nBefore Fiber, React's recursive call stack approach meant a render ran until the entire component tree was evaluated — it could not be interrupted. Fiber decouples the render phase (pure computation, can be abandoned) from the commit phase (DOM mutations, runs to completion), which is the structural prerequisite for all concurrent features.`,
    analogy: `Replacing a stack of to-do cards you must process top-to-bottom (old reconciler) with a web of indexed cards where any card can pause itself and hand off to a higher-priority card. Each card remembers exactly where it left off via pointers.`,
    examples: [
        { title: "Work loop with shouldYield", text: "React's work loop calls performUnitOfWork on one fiber at a time, checks shouldYield() to see if the frame deadline has passed, and yields back to the browser if so." },
        { title: "Two-phase commit", text: "The render phase traverses fibers and computes an effect list; the commit phase applies DOM mutations from that list in a single synchronous pass, preventing partial renders." }
    ],
    useCases: ["Foundation for all React 16+ features (implicit)", "Understanding React DevTools Profiler output", "Building custom React renderers (react-three-fiber, ink)"],
    tradeoffs: {
        pros: ["Enables interruptible, prioritized rendering", "Separates computation (pure) from mutation (committed)", "Supports priority lanes for fine-grained scheduling"],
        cons: ["Higher memory overhead than call-stack approach", "More complex lifecycle — effects run after commit, not during render", "Strict Mode double-invokes render to surface impure code"]
    },
    related: ["reconciliation-algorithm", "concurrent-rendering", "time-slicing", "scheduler-priorities"]
},

{
    id: "vdom-diffing",
    term: "Virtual DOM diffing complexity",
    tagline: "The algorithmic cost of comparing two virtual trees to produce a DOM patch",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes scan{0%{transform:translateY(0);opacity:0}40%{opacity:.9}100%{transform:translateY(70px);opacity:0}}.sc{animation:scan 2s ease-in-out infinite}</style><rect x="12" y="18" width="38" height="84" rx="3" fill="none" stroke="var(--diagram-ink)" stroke-width="2" opacity=".45"/><rect x="70" y="18" width="38" height="84" rx="3" fill="none" stroke="var(--diagram-ink)" stroke-width="2" opacity=".45"/><rect class="sc" x="15" y="18" width="32" height="3" rx="1" fill="var(--diagram-ink)"/><rect class="sc" x="73" y="18" width="32" height="3" rx="1" fill="var(--diagram-ink)" style="animation-delay:.3s"/><line x1="50" y1="60" x2="70" y2="60" stroke="var(--diagram-ink)" stroke-width="1.5" stroke-dasharray="4 3"/></svg>`,
    definition: `Diffing two arbitrary trees is O(n³) — for every node in tree A, you'd need to find the best match in tree B and compute edit distances. This is impractical for UIs with hundreds of nodes. React reduces this to O(n) using two heuristics: same type at the same position means update in place, and keyed list items are matched by key not by position.\n\nFrameworks like Svelte and Solid.js avoid the virtual DOM entirely by compiling templates to direct DOM mutations at build time. For simple, granular updates this is faster since there's no diff step. The trade-off is that a compiled approach is less flexible than a runtime virtual DOM — it can't easily support cross-platform rendering or dynamic component composition.`,
    analogy: `Comparing two sorted phone books simultaneously (O(n)) versus reading every entry in one against every entry in the other (O(n²)). The heuristic assumption — same type, same position — is the sorting key that makes the linear scan possible.`,
    examples: [
        { title: "Key-based list matching", text: "React builds a Map of key → fiber, then looks up each new item's key. This converts O(n²) list diffing into O(n) key lookups." },
        { title: "Svelte vs React for simple updates", text: "A Svelte counter compiles to count.textContent = value — one targeted DOM write. React reconciles through a vdom tree first. For granular updates, the compiled approach wins." }
    ],
    useCases: ["Understanding when memo() and useMemo() pay off", "Benchmarking framework choices for specific workloads", "Evaluating compiler-based vs. runtime-based frameworks"],
    tradeoffs: {
        pros: ["O(n) heuristic makes virtual DOM practical at scale", "Enables cross-platform renderers (web, native, terminal)", "Centralizes mutation — easier to batch and optimize"],
        cons: ["Per-render object allocation creates GC pressure", "Same-position type changes trigger expensive remount", "Fine-grained reactive updates are more efficient without a vdom layer"]
    },
    related: ["reconciliation-algorithm", "fiber-architecture", "structural-sharing", "memoization-pitfalls"]
},

{
    id: "selective-hydration",
    term: "Selective hydration",
    tagline: "Prioritizing hydration of the component the user is currently interacting with",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes spotlight{0%,100%{r:12;opacity:.5}50%{r:18;opacity:.9}}</style><rect x="8" y="8" width="104" height="104" rx="5" fill="var(--diagram-ink)" opacity=".08" stroke="var(--diagram-ink)" stroke-width="1.5"/><rect x="20" y="20" width="34" height="34" rx="3" fill="var(--diagram-ink)" opacity=".18"/><rect x="66" y="20" width="34" height="34" rx="3" fill="var(--diagram-ink)" opacity=".18"/><rect x="20" y="66" width="34" height="34" rx="3" fill="var(--diagram-ink)" opacity=".18"/><rect x="66" y="66" width="34" height="34" rx="3" fill="var(--diagram-ink)" opacity=".15" stroke="var(--diagram-ink)" stroke-width="1.5"/><circle cx="83" cy="83" r="12" fill="var(--diagram-ink)" style="animation:spotlight 2s ease-in-out infinite"/></svg>`,
    definition: `Selective hydration (React 18) lets the browser interrupt background hydration to prioritize the component a user just interacted with. Before this, clicking a button before hydration was complete would silently drop the click — hydration had to finish from the top of the document before any component could respond.\n\nWith selective hydration, React queues the interaction, immediately hydrates the target component, replays the event, and resumes background hydration of the remaining tree. The page becomes interactive where the user is rather than in document order, even before the full JS bundle finishes.`,
    analogy: `A hotel check-in where one desk processes rooms sequentially (background hydration) and another can fast-track a specific guest who is standing and waiting (selective hydration on click). The waiting guest doesn't have to stand in line.`,
    examples: [
        { title: "Click replay", text: "With hydrateRoot, clicking a <Button> before hydration completes causes React to prioritize that subtree, hydrate it synchronously, and replay the click — instead of silently dropping it." },
        { title: "Multiple Suspense trees", text: "Separate <Suspense> boundaries let React hydrate each subtree independently and pick the highest-priority one based on where user attention lands." }
    ],
    useCases: ["Large SSR pages where hydration takes more than one second", "Pages with critical CTAs that may be clicked before full hydration", "Reducing time-to-interactive for above-the-fold content"],
    tradeoffs: {
        pros: ["Prevents lost interactions during slow hydration", "Hydration order adapts to user behavior", "Combines with streaming SSR for optimal perceived performance"],
        cons: ["Requires React 18 concurrent mode", "Event replay is not safe for all event types", "Understanding hydration order becomes more complex"]
    },
    related: ["hydration", "partial-hydration", "streaming-ssr", "suspense-boundaries"]
},

{
    id: "server-components",
    term: "Server components",
    tagline: "Components that execute only on the server and never ship JS to the client",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes send{0%{transform:translateX(0);opacity:1}80%{opacity:1}100%{transform:translateX(44px);opacity:0}}.ar{animation:send 1.6s ease-in infinite}</style><rect x="5" y="32" width="52" height="56" rx="5" fill="var(--diagram-ink)" opacity=".7"/><text x="22" y="67" font-size="22" fill="white" font-family="monospace" opacity=".9">S</text><rect x="68" y="32" width="47" height="56" rx="5" fill="none" stroke="var(--diagram-ink)" stroke-width="2" opacity=".45"/><g class="ar"><line x1="57" y1="60" x2="70" y2="60" stroke="var(--diagram-ink)" stroke-width="2"/><polygon points="68,56 75,60 68,64" fill="var(--diagram-ink)"/></g></svg>`,
    definition: `React Server Components (RSC) execute only on the server (or at build time) and send their rendered output to the client as serialized HTML or a component description. Unlike SSR, server components are never hydrated — their code is never included in the client bundle. They can directly access databases, file systems, and secrets without an API layer.\n\nServer and client components coexist in the same tree. The boundary is explicit: files marked "use client" become client components; everything else is a server component by default. Client components cannot import server components (that would pull server-only code into the bundle), but can receive server components as children via prop composition.`,
    analogy: `A restaurant that prints the menu in the kitchen (server component) and sends it as a physical card. The customer sees the menu but never needs the kitchen's recipe database. The interactive parts — ordering via a waiter — are client-side. The printed card needs no JS.`,
    examples: [
        { title: "Direct database access", text: "A server component calls db.query() directly and passes results as props to a client component. No API route, no useEffect, no loading state." },
        { title: "Zero bundle impact", text: "A server component importing a 500KB date formatting library adds zero bytes to the client bundle — that library only runs on the server." }
    ],
    useCases: ["Data-fetching layouts that don't need interactivity", "Content that uses backend secrets or direct DB access", "Navigation, sidebars, and static sections of a page"],
    tradeoffs: {
        pros: ["No client bundle cost for server-only code", "Direct data access — no intermediate API layer", "Can compose with client components via children prop"],
        cons: ["Cannot use hooks, browser APIs, or attach event listeners", "Cannot hold client-side state", "The server/client boundary adds conceptual overhead"]
    },
    related: ["hydration", "streaming-ssr", "selective-hydration", "islands-architecture"]
},

{
    id: "suspense-boundaries",
    term: "Suspense boundaries",
    tagline: "Declarative loading states for async component subtrees",
    category: "rendering",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes spin{100%{transform:rotate(360deg)}}</style><circle cx="60" cy="60" r="38" fill="none" stroke="var(--diagram-ink)" stroke-width="2.5" opacity=".18"/><path d="M60 22 A38 38 0 0 1 98 60" fill="none" stroke="var(--diagram-ink)" stroke-width="3" stroke-linecap="round" style="transform-origin:60px 60px;animation:spin 1.1s linear infinite"/><circle cx="60" cy="60" r="5" fill="var(--diagram-ink)" opacity=".4"/></svg>`,
    definition: `Suspense boundaries let you declaratively specify a loading fallback for a subtree of components that aren't ready to render. A component signals it's not ready by throwing a Promise during render; React catches it at the nearest Suspense boundary, renders the fallback, and retries the component when the Promise resolves.\n\nIn React 18, Suspense integrates with streaming SSR, selective hydration, and concurrent rendering. Suspense boundaries define the unit of "async readiness" — how coarsely or finely you wrap them determines how granular loading states are and how independently different sections of a page can stream and hydrate.`,
    analogy: `An automatic door that opens when someone approaches (thrown Promise) and closes again once they've passed (data resolved). The door shows the fallback; the approach triggers it; the resolved data clears it.`,
    examples: [
        { title: "Code splitting with React.lazy", text: "const LazyChart = React.lazy(() => import('./Chart')). Wrapping it in <Suspense fallback={<Skeleton/>}> shows a skeleton while the chunk downloads and executes." },
        { title: "React 19 use() hook", text: "use(promise) reads a Promise inside render. If it's pending, React suspends the component at the nearest boundary and shows the fallback until the Promise resolves." }
    ],
    useCases: ["Code-split route boundaries", "Data-dependent components with async reads", "Nested loading states with different granularity"],
    tradeoffs: {
        pros: ["Collocates loading state with the component that needs it", "Composes — nest Suspense boundaries for granular control", "Works with streaming SSR and selective hydration"],
        cons: ["Nested Suspense boundaries waterfall by default — use parallel data fetching to avoid", "Error handling requires separate ErrorBoundary components", "Libraries must explicitly integrate with the Suspense protocol"]
    },
    related: ["streaming-ssr", "selective-hydration", "concurrent-rendering", "render-waterfalls"]
},
// ── State management (10) ──────────────────────────────────────────────────

{
    id: "structural-sharing",
    term: "Structural sharing",
    tagline: "Reuse unchanged parts of data structures across versions",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .node { fill: var(--diagram-ink); }
    .edge { stroke: var(--diagram-ink); stroke-width: 2; fill: none; }
    .shared { fill: var(--diagram-ink); opacity: 0.45; }
    .new-node { fill: var(--diagram-ink); opacity: 1; }
    @keyframes highlight { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
    .pulse { animation: highlight 2s ease-in-out infinite; }
  </style>
  <circle class="node pulse" cx="30" cy="20" r="8"/>
  <line class="edge" x1="30" y1="28" x2="18" y2="52"/>
  <line class="edge" x1="30" y1="28" x2="42" y2="52"/>
  <circle class="shared" cx="18" cy="60" r="8"/>
  <circle class="shared" cx="42" cy="60" r="8"/>
  <circle class="new-node" cx="90" cy="20" r="8"/>
  <line class="edge" x1="90" y1="28" x2="78" y2="52"/>
  <line class="edge" x1="90" y1="28" x2="42" y2="52" stroke-dasharray="4 2"/>
  <circle class="new-node" cx="78" cy="60" r="8"/>
  <line class="edge" x1="50" y1="60" x2="56" y2="60" marker-end="url(#arr)"/>
  <defs>
    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <text x="8" y="95" font-size="9" fill="var(--diagram-ink)">old</text>
  <text x="82" y="95" font-size="9" fill="var(--diagram-ink)">new</text>
  <text x="30" y="110" font-size="8" fill="var(--diagram-ink)" opacity="0.7">shared subtree</text>
</svg>`,
    definition: `Structural sharing is a technique where a new version of a data structure reuses unchanged subtrees from the previous version instead of copying them. Only the nodes along the path of the mutation are replaced; everything else is aliased by reference.\n\nThis makes immutable updates memory-efficient. Rather than cloning an entire object tree on every change, you pay only for the path length — O(log n) for balanced trees. Libraries like Immer and Immutable.js rely on this to make immutability practical at scale.`,
    analogy: `Think of a Git commit. When you change one file, Git does not re-store every other file — it records a new tree object that points to the same blobs for unchanged files and only a new blob for the edited one. Whole repository history shares unchanged content, so it stays compact.`,
    examples: [
        { title: "Immer draft", text: "When you mutate a draft inside produce(), Immer copies only the nodes on the path to the changed property. Sibling subtrees remain the same object references as before." },
        { title: "Redux Toolkit slice", text: "createSlice wraps Immer, so reducers that touch state.user.name leave state.settings as the exact same reference — no re-render for components subscribed only to settings." }
    ],
    useCases: [
        "Immutable state management in Redux or Zustand without full deep clones",
        "Undo/redo stacks where storing every historical state must stay affordable",
        "Persistent data structures in compilers and language runtimes"
    ],
    tradeoffs: {
        pros: [
            "Memory usage grows with change path length, not total data size",
            "Old and new versions can safely coexist — no defensive copying needed",
            "Enables cheap equality checks: unchanged subtrees are referentially identical"
        ],
        cons: [
            "Pointer-heavy structures carry GC overhead compared to flat arrays",
            "Cache locality suffers because nodes are scattered across the heap",
            "Requires discipline or library support — easy to accidentally mutate shared nodes"
        ]
    },
    related: ["immutable-data", "referential-equality", "memoization-pitfalls"]
},

{
    id: "immutable-data",
    term: "Immutable data patterns",
    tagline: "Treat state as values that are replaced, never mutated",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes cross-in { 0% { opacity: 0 } 100% { opacity: 1 } }
    .lock { fill: var(--diagram-ink); }
    .box { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .forbidden { stroke: var(--diagram-ink); stroke-width: 3; opacity: 0.7; }
  </style>
  <rect class="box" x="10" y="30" width="40" height="36" rx="4"/>
  <text x="18" y="53" font-size="10" fill="var(--diagram-ink)">{a:1}</text>
  <line x1="54" y1="48" x2="66" y2="48" stroke="var(--diagram-ink)" stroke-width="2"/>
  <line class="forbidden" x1="56" y1="42" x2="64" y2="54"/>
  <line class="forbidden" x1="64" y1="42" x2="56" y2="54"/>
  <rect class="box" x="70" y="30" width="40" height="36" rx="4"/>
  <text x="78" y="53" font-size="10" fill="var(--diagram-ink)">{a:2}</text>
  <rect class="lock" x="18" y="18" width="12" height="9" rx="2" opacity="0.8"/>
  <path d="M20,18 Q24,12 28,18" stroke="var(--diagram-ink)" stroke-width="2" fill="none"/>
  <text x="14" y="80" font-size="8" fill="var(--diagram-ink)">frozen</text>
  <text x="74" y="80" font-size="8" fill="var(--diagram-ink)">new copy</text>
  <text x="20" y="100" font-size="8" fill="var(--diagram-ink)" opacity="0.7">never mutate — always replace</text>
</svg>`,
    definition: `Immutable data patterns mean every state update produces a new value rather than modifying an existing one. The original object is never changed; consumers holding old references see a consistent snapshot.\n\nIn JavaScript, true immutability requires discipline (Object.freeze, Immer, or Immutable.js) because the language is mutable by default. The payoff is predictable change detection: if a reference changed, the data changed; if it did not, nothing needs to re-render.`,
    analogy: `A bank statement is immutable — when a transaction posts, the bank does not erase last month's balance and write a new one in the same cell. It appends a new record. The ledger grows; old entries are never touched. You can always audit any point in history.`,
    examples: [
        { title: "Object.freeze", text: "Object.freeze({count: 0}) prevents direct mutation. Any attempt to set a property silently fails in sloppy mode or throws in strict mode — forcing callers to spread into a new object." },
        { title: "Immer produce", text: "produce(state, draft => { draft.count++ }) lets you write mutation-style code inside a draft proxy; Immer applies structural sharing and returns a new frozen object." }
    ],
    useCases: [
        "React state updates where reference equality drives re-render decisions",
        "Time-travel debugging where you need reliable snapshots of past state",
        "Concurrent rendering where multiple reads of the same snapshot must stay consistent"
    ],
    tradeoffs: {
        pros: [
            "Change detection reduces to a single reference comparison",
            "Eliminates entire classes of bugs caused by shared mutable state",
            "Enables undo/redo and state snapshots at near-zero cost"
        ],
        cons: [
            "Produces GC pressure from many short-lived intermediate objects",
            "Deep update syntax is verbose without a helper library",
            "Object.freeze is shallow — nested objects still need manual handling"
        ]
    },
    related: ["structural-sharing", "referential-equality", "tearing", "event-sourcing"]
},

{
    id: "referential-equality",
    term: "Referential equality",
    tagline: "Two values are equal only if they point to the same object in memory",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .eq { fill: var(--diagram-ink); }
    .box { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a2); }
  </style>
  <defs>
    <marker id="a2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="box" x="45" y="50" width="36" height="26" rx="3"/>
  <text x="52" y="67" font-size="9" fill="var(--diagram-ink)">{x:1}</text>
  <rect class="box" x="5" y="20" width="24" height="18" rx="2"/>
  <text x="10" y="33" font-size="9" fill="var(--diagram-ink)">ref A</text>
  <path class="arrow" d="M29,29 Q40,29 45,58"/>
  <rect class="box" x="5" y="56" width="24" height="18" rx="2"/>
  <text x="10" y="69" font-size="9" fill="var(--diagram-ink)">ref B</text>
  <path class="arrow" d="M29,65 L45,65"/>
  <text x="55" y="95" font-size="11" fill="var(--diagram-ink)" style="animation:blink 2s infinite">A===B</text>
  <text x="53" y="108" font-size="8" fill="var(--diagram-ink)" opacity="0.7">same address</text>
</svg>`,
    definition: `Referential equality (===) checks whether two variables point to the same object in memory, not whether their contents are equivalent. Two objects with identical properties are not referentially equal unless they are literally the same allocation.\n\nIn React, referential equality drives memoization decisions. React.memo, useMemo, and useCallback all skip re-computation only when their inputs pass a === check. Accidentally breaking referential stability — by recreating objects or functions on every render — silently defeats these optimizations.`,
    analogy: `Two printed copies of the same contract are content-equal but not referentially equal. If you write your signature on one, the other is unaffected. Referential equality is like checking whether both people are holding the exact same physical piece of paper, not whether the text matches.`,
    examples: [
        { title: "Broken React.memo", text: "Passing style={{color:'red'}} as a prop creates a new object literal every render. React.memo always sees a new reference and re-renders the child, making the memoization pointless." },
        { title: "Stable selector", text: "A Zustand selector that returns state.user avoids re-renders when other slices change because the user object reference stays the same until user data actually mutates." }
    ],
    useCases: [
        "Deciding whether memoized components need to re-render in React",
        "Detecting changed dependencies in useEffect and useCallback dependency arrays",
        "Optimizing Redux selectors with reselect to avoid unnecessary recalculations"
    ],
    tradeoffs: {
        pros: [
            "O(1) equality check — no deep traversal needed",
            "Framework-level memoization hooks depend on it for correctness",
            "Encourages stable data shapes that compose predictably"
        ],
        cons: [
            "Easy to break accidentally with inline object or array literals",
            "Content equality often requires a manual deep-equal or normalization step",
            "Over-memoizing to preserve references adds code complexity without benefit"
        ]
    },
    related: ["immutable-data", "structural-sharing", "memoization-pitfalls"]
},

{
    id: "memoization-pitfalls",
    term: "Memoization pitfalls",
    tagline: "Caching results for the same inputs — until the cache becomes the bug",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
    .warn { fill: var(--diagram-ink); }
    .cache { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
  </style>
  <rect class="cache" x="20" y="30" width="80" height="40" rx="4"/>
  <text x="30" y="47" font-size="8" fill="var(--diagram-ink)">memo cache</text>
  <text x="30" y="60" font-size="8" fill="var(--diagram-ink)">key: [a, b] -&gt; val</text>
  <polygon class="warn" points="60,8 76,30 44,30" opacity="0.85" style="animation:shake 1.5s ease-in-out infinite"/>
  <text x="57" y="24" font-size="9" fill="white" font-weight="bold">!</text>
  <rect class="cache" x="28" y="78" width="64" height="18" rx="3"/>
  <text x="36" y="91" font-size="9" fill="var(--diagram-ink)">stale hit returned</text>
  <text x="22" y="112" font-size="7.5" fill="var(--diagram-ink)" opacity="0.7">wrong deps = wrong output</text>
</svg>`,
    definition: `Memoization caches a function's return value keyed on its inputs, returning the cached result when inputs repeat. The pitfall is that "inputs" in JavaScript are checked by reference, not value — so a memoized selector or component may receive a semantically identical input but treat it as changed (or, worse, miss a real change because a stale reference survived).\n\nCommon failure modes: over-memoizing cheap functions adds cache lookup overhead; under-specifying dependencies causes stale returns; recreating dependency objects on every render makes the cache miss every time.`,
    analogy: `A memoized lookup is like a receptionist who checks a guest list by matching the exact ticket stub. If you reprinted the ticket with the same text, they would say "I have never seen you before" and re-do all the work. If you snuck in a guest whose stub is identical to someone already checked in, they would wave you through without checking.`,
    examples: [
        { title: "useMemo with missing dep", text: "useMemo(() => compute(props.id), []) runs once and never updates. If props.id changes, the memo returns a value computed from the original id — a silent correctness bug." },
        { title: "reselect cache size 1", text: "Reselect's default memoization has a cache size of 1. Alternating between two different inputs on consecutive renders causes a cache miss every time, making memoization pure overhead." }
    ],
    useCases: [
        "Caching expensive derived data in Redux selectors with reselect",
        "Stabilizing callback references with useCallback to prevent child re-renders",
        "Avoiding repeated regex compilation or data transformation inside render"
    ],
    tradeoffs: {
        pros: [
            "Eliminates redundant computation for expensive pure functions",
            "Preserves referential stability to prevent unnecessary downstream renders",
            "Reduces CPU time in hot render paths when inputs genuinely repeat"
        ],
        cons: [
            "Cache comparisons add overhead that can exceed savings for cheap functions",
            "Stale closures inside memoized callbacks are a persistent source of bugs",
            "Increases cognitive load — developers must track all relevant dependencies"
        ]
    },
    related: ["referential-equality", "stale-closure", "structural-sharing"]
},

{
    id: "stale-closure",
    term: "Stale closure problem",
    tagline: "A function captures a variable's value at creation time, not at call time",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes fade-old { 0%,60%{opacity:1} 100%{opacity:0.25} }
    .box { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .val { fill: var(--diagram-ink); font-size: 10px; }
    .stale { fill: var(--diagram-ink); opacity: 0.35; }
  </style>
  <rect class="box" x="10" y="20" width="44" height="28" rx="3"/>
  <text class="val" x="16" y="36">count=0</text>
  <text class="val" x="16" y="46" font-size="8">render 1</text>
  <rect x="10" y="62" width="44" height="28" rx="3" fill="var(--diagram-ink)" opacity="0.12" stroke="var(--diagram-ink)" stroke-width="2"/>
  <text class="stale" x="14" y="78" font-size="9">fn() {</text>
  <text class="stale" x="14" y="89" font-size="9">  count=0</text>
  <line x1="34" y1="48" x2="34" y2="62" stroke="var(--diagram-ink)" stroke-width="1.5" marker-end="url(#a3)"/>
  <defs>
    <marker id="a3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="box" x="66" y="20" width="44" height="28" rx="3"/>
  <text class="val" x="72" y="36">count=5</text>
  <text class="val" x="72" y="46" font-size="8">render 6</text>
  <text x="20" y="106" font-size="8" fill="var(--diagram-ink)" opacity="0.75">fn sees 0, state is 5</text>
</svg>`,
    definition: `A closure captures variables from its enclosing scope at the time it is created. In React, a function defined during render — an event handler, a useEffect callback, a setTimeout — closes over the state and props values from that render. If state updates later, the old function still references the old values.\n\nThis is the stale closure problem. It surfaces most often in useEffect with an empty dependency array: the effect runs once and its callback forever reads the initial state, ignoring all subsequent updates.`,
    analogy: `Imagine writing yourself a note that says "call back at 555-0100." You read and follow the note a week later, but the number changed two days ago. The note captured the number at writing time, not at reading time. A stale closure is that outdated note inside your code.`,
    examples: [
        { title: "setInterval stale read", text: "setInterval(() => console.log(count), 1000) inside useEffect([]) always logs the initial count. The interval callback closed over count=0 and never got a fresh reference." },
        { title: "useRef as escape hatch", text: "Storing state in a ref (countRef.current = count) and reading the ref inside the callback solves staleness: refs are mutable and always point to the current value." }
    ],
    useCases: [
        "Diagnosing event handlers that read outdated state despite state having changed",
        "Explaining why useEffect cleanup functions see the values at effect creation time",
        "Understanding why useCallback must list all state it reads in its dependency array"
    ],
    tradeoffs: {
        pros: [
            "Closures enable functional composition and clean encapsulation",
            "Predictable capture semantics simplify reasoning in short-lived functions",
            "React's exhaustive-deps ESLint rule catches most stale closure bugs at lint time"
        ],
        cons: [
            "Easy to miss in async callbacks, timers, and event listeners with long lifetimes",
            "useRef workarounds add indirection and can obscure data flow",
            "Over-specified dependency arrays trigger excessive re-subscriptions"
        ]
    },
    related: ["memoization-pitfalls", "race-conditions", "event-sourcing"]
},

{
    id: "race-conditions",
    term: "Race conditions in UI state",
    tagline: "Two async operations compete to write state, and the loser arrives last",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes move-a { 0%{transform:translateX(0)} 100%{transform:translateX(52px)} }
    @keyframes move-b { 0%{transform:translateX(0)} 60%{transform:translateX(62px)} 100%{transform:translateX(62px)} }
    .track { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; opacity: 0.3; }
    .req { fill: var(--diagram-ink); }
  </style>
  <line class="track" x1="10" y1="44" x2="110" y2="44"/>
  <line class="track" x1="10" y1="70" x2="110" y2="70"/>
  <circle class="req" cx="18" cy="44" r="8" style="animation:move-a 1.2s ease-in infinite alternate"/>
  <text x="12" y="47" font-size="7" fill="white">A</text>
  <circle class="req" cx="18" cy="70" r="8" opacity="0.55" style="animation:move-b 1.8s ease-in infinite alternate"/>
  <text x="12" y="73" font-size="7" fill="white">B</text>
  <rect x="90" y="30" width="24" height="52" rx="3" fill="none" stroke="var(--diagram-ink)" stroke-width="2"/>
  <text x="93" y="57" font-size="7" fill="var(--diagram-ink)">state</text>
  <text x="10" y="98" font-size="8" fill="var(--diagram-ink)">B sent later,</text>
  <text x="10" y="109" font-size="8" fill="var(--diagram-ink)">arrives last = stale</text>
</svg>`,
    definition: `A race condition in UI state occurs when two overlapping async operations (fetches, debounced inputs, concurrent effects) both try to commit results, and the one that should have "won" arrives after the one that should have "lost." The UI ends up displaying stale or mismatched data.\n\nThe classic case: a user types quickly into a search box, each keystroke fires a fetch, and the response to keystroke N-1 arrives after the response to keystroke N — overwriting the correct result with an outdated one.`,
    analogy: `Two taxi drivers both racing to pick up the same passenger who has moved. The first driver to complete the journey gets credited the fare. If the driver who picked up the old address arrives at the airport just after the driver with the correct terminal, the passenger is dropped at the wrong door — and no one knows.`,
    examples: [
        { title: "AbortController cancel", text: "In useEffect, create an AbortController on each keystroke and call abort() in the cleanup function. In-flight fetches from previous keystrokes throw an AbortError and their results are ignored." },
        { title: "Request ID guard", text: "Track a monotonically increasing requestId in a ref. On fetch resolution, only commit state if the resolved request's id matches the current ref value — all older responses are discarded." }
    ],
    useCases: [
        "Search-as-you-type UIs where each character fires a network request",
        "Tab panels that lazy-load content and can be rapidly switched",
        "Concurrent state updates from WebSocket messages and optimistic UI writes"
    ],
    tradeoffs: {
        pros: [
            "AbortController solutions are native, lightweight, and cancel at the network level",
            "Request ID guards work even for non-cancellable async operations",
            "React Query and SWR handle cancellation automatically when properly configured"
        ],
        cons: [
            "Requires explicit cancellation logic in every async effect — easy to forget",
            "Abort handling adds error boundary complexity since AbortError must be ignored",
            "Harder to detect in testing because timing depends on real or mocked latency"
        ]
    },
    related: ["stale-closure", "tearing", "optimistic-rollback", "abortcontroller"]
},

{
    id: "tearing",
    term: "Tearing in concurrent UI",
    tagline: "Different components read different versions of the same store in one frame",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .panel { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .val { fill: var(--diagram-ink); font-size: 11px; font-weight: bold; }
  </style>
  <rect class="panel" x="5" y="20" width="48" height="80" rx="4"/>
  <text class="val" x="18" y="58">v1</text>
  <text x="10" y="72" font-size="8" fill="var(--diagram-ink)">component A</text>
  <rect class="panel" x="67" y="20" width="48" height="80" rx="4"/>
  <text class="val" x="80" y="58">v2</text>
  <text x="72" y="72" font-size="8" fill="var(--diagram-ink)">component B</text>
  <path d="M60,15 Q57,40 62,60 Q57,80 60,105" stroke="var(--diagram-ink)" stroke-width="2.5" fill="none" stroke-dasharray="4 3" opacity="0.7"/>
  <text x="18" y="112" font-size="7.5" fill="var(--diagram-ink)" opacity="0.8">same store, two snapshots</text>
</svg>`,
    definition: `Tearing happens when React's concurrent rendering renders different components reading from the same external store but sees different values — because the store was updated mid-render. In synchronous rendering this cannot happen; React commits atomically. But in concurrent mode, renders are interruptible, so a store write arriving during a suspended render can be picked up by later components while earlier ones used the old value.\n\nThe fix is useSyncExternalStore, which forces the store read to be synchronous and consistent across a single render pass.`,
    analogy: `Imagine printing a spreadsheet while someone is editing it. The first page prints with the old totals, but by page 2 the values have been updated. The printed report has consistent-looking rows but the subtotals do not add up. Tearing is that inconsistency mid-document.`,
    examples: [
        { title: "Redux before React 18", text: "Legacy react-redux used context and subscriptions that could produce tearing in concurrent mode. React-redux v8 switched to useSyncExternalStore to solve this." },
        { title: "Zustand tearing risk", text: "Zustand's vanilla store can tear if components subscribe independently without useSyncExternalStore. The Zustand React adapter uses it internally to guarantee consistency." }
    ],
    useCases: [
        "Any external state store (Redux, Zustand, Jotai) consumed in a React 18+ concurrent app",
        "Custom store implementations that need to be safe under time-slicing",
        "Diagnosing UI inconsistencies where sibling components show different data"
    ],
    tradeoffs: {
        pros: [
            "useSyncExternalStore is a first-class React API designed exactly for this problem",
            "Awareness prevents subtle visual bugs that only appear under heavy CPU load",
            "Most popular state libraries have already adopted it — apps using them are safe"
        ],
        cons: [
            "useSyncExternalStore forces synchronous renders, partially opting out of concurrent benefits",
            "Custom stores require extra implementation work to integrate it correctly",
            "Tearing bugs are non-deterministic and hard to reproduce in tests"
        ]
    },
    related: ["race-conditions", "immutable-data", "concurrent-rendering", "time-slicing"]
},

{
    id: "finite-state-modeling",
    term: "Finite state modeling",
    tagline: "Represent UI as a fixed set of mutually exclusive states with defined transitions",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .state { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .active { fill: var(--diagram-ink); opacity: 0.15; stroke: var(--diagram-ink); stroke-width: 2; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a4); }
  </style>
  <defs>
    <marker id="a4" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <circle class="active" cx="24" cy="36" r="16"/>
  <text class="label" x="24" y="39">idle</text>
  <circle class="state" cx="96" cy="36" r="14"/>
  <text class="label" x="96" y="39">loading</text>
  <circle class="state" cx="24" cy="88" r="14"/>
  <text class="label" x="24" y="91">error</text>
  <circle class="state" cx="96" cy="88" r="14"/>
  <text class="label" x="96" y="91">success</text>
  <path class="arrow" d="M40,36 L82,36"/>
  <path class="arrow" d="M96,50 L96,74"/>
  <path class="arrow" d="M82,80 L38,80"/>
  <path class="arrow" d="M82,88 Q60,100 38,88"/>
</svg>`,
    definition: `Finite state modeling explicitly enumerates every valid state a UI component can be in and the transitions allowed between them. Rather than tracking multiple boolean flags (isLoading, isError, isSuccess) that can contradict each other, you define a single state machine where exactly one state is active at a time.\n\nThis eliminates impossible states like {isLoading: true, isSuccess: true}. Libraries like XState provide runtime machines; even a plain string enum ('idle' | 'loading' | 'error' | 'success') captures the core idea.`,
    analogy: `A traffic light has three possible states and strict rules about which transitions are legal: green to yellow to red to green. It cannot be both green and red. Finite state modeling applies the same discipline to UI: define the states up front and specify exactly what events move between them.`,
    examples: [
        { title: "String state enum", text: "type FetchState = 'idle'|'loading'|'success'|'error'. A single switch on this value renders the right UI for each phase, making it impossible to render a spinner and an error simultaneously." },
        { title: "XState machine", text: "An XState fetchMachine defines states, events (FETCH, RESOLVE, REJECT), and transitions. The machine rejects invalid transitions instead of silently allowing broken flag combinations." }
    ],
    useCases: [
        "Multi-step form wizards where each step has strict entry and exit conditions",
        "Network request lifecycle (idle to loading to success/error to retry)",
        "Authentication flows with distinct logged-out, authenticating, and logged-in states"
    ],
    tradeoffs: {
        pros: [
            "Eliminates impossible UI states caused by conflicting boolean flags",
            "Makes all valid transitions explicit and reviewable in one place",
            "Visual state charts generated from XState aid design and documentation"
        ],
        cons: [
            "More upfront modeling work than ad-hoc flags, especially for simple components",
            "XState's API surface is substantial — overkill for trivial toggle states",
            "Teams unfamiliar with state machine theory face a learning curve"
        ]
    },
    related: ["event-sourcing", "optimistic-rollback", "race-conditions", "deterministic-rendering"]
},

{
    id: "event-sourcing",
    term: "Event sourcing in frontend",
    tagline: "Derive current state by replaying an ordered log of past events",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes slide-in { 0%{opacity:0;transform:translateY(-6px)} 100%{opacity:1;transform:translateY(0)} }
    .ev { fill: none; stroke: var(--diagram-ink); stroke-width: 1.5; }
    .label { fill: var(--diagram-ink); font-size: 7.5px; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; marker-end: url(#a5); fill: none; }
  </style>
  <defs>
    <marker id="a5" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="ev" x="5" y="10" width="54" height="16" rx="2"/>
  <text class="label" x="10" y="21">ADD item A</text>
  <rect class="ev" x="5" y="30" width="54" height="16" rx="2"/>
  <text class="label" x="10" y="41">ADD item B</text>
  <rect class="ev" x="5" y="50" width="54" height="16" rx="2"/>
  <text class="label" x="10" y="61">REMOVE A</text>
  <rect class="ev" x="5" y="70" width="54" height="16" rx="2"/>
  <text class="label" x="10" y="81">UPDATE B</text>
  <path class="arrow" d="M59,52 L74,52"/>
  <rect fill="none" stroke="var(--diagram-ink)" stroke-width="2" x="74" y="36" width="42" height="38" rx="4"/>
  <text class="label" x="80" y="54">{B: v2}</text>
  <text class="label" x="80" y="65">current</text>
  <text x="15" y="100" font-size="7.5" fill="var(--diagram-ink)" opacity="0.8">replay log to get current state</text>
</svg>`,
    definition: `Event sourcing stores state as an append-only log of events rather than as a mutable current value. The current state is always derived by replaying events from the beginning (or from a snapshot). Redux is a mild form of this: actions are events, the reducer is the replay function.\n\nFrontend event sourcing is useful when you need undo/redo, audit trails, offline sync, or the ability to derive different projections from the same event history. CRDTs take the idea further for collaborative editing.`,
    analogy: `A bank account balance is not stored directly — it is derived from the transaction log. If you need the balance at any point in time, you replay transactions up to that date. The events are the truth; the current state is a computed view of them.`,
    examples: [
        { title: "Redux action log", text: "Redux DevTools can replay every dispatched action from the start of a session. This is event sourcing: the action log is the source of truth, and the store is a derived projection." },
        { title: "Offline-first sync", text: "An offline app stores user actions locally as events. When back online, it sends the event log to the server, which replays them in order to reconcile with the canonical state." }
    ],
    useCases: [
        "Undo/redo in collaborative editors by replaying or truncating the event log",
        "Offline-first apps that queue local events and sync on reconnect",
        "Audit logs where regulators need a record of every state-changing action"
    ],
    tradeoffs: {
        pros: [
            "Complete history enables time-travel debugging and audit logging for free",
            "Different projections of state can be derived from the same event log",
            "Append-only writes are safe and easy to replicate"
        ],
        cons: [
            "Replaying large event logs on startup requires snapshots for performance",
            "Schema changes to events require migration strategies for old log entries",
            "More complex than direct state mutation — overkill for simple CRUD UIs"
        ]
    },
    related: ["finite-state-modeling", "optimistic-rollback", "immutable-data", "crdt", "offline-conflict"]
},

{
    id: "optimistic-rollback",
    term: "Optimistic UI rollback strategy",
    tagline: "Apply a state change immediately, then undo it if the server disagrees",
    category: "state",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes rollback { 0%,40%{transform:translateX(0)} 60%,100%{transform:translateX(-28px)} }
    .box { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .label { fill: var(--diagram-ink); font-size: 8px; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a6); }
  </style>
  <defs>
    <marker id="a6" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="box" x="5" y="28" width="38" height="26" rx="3"/>
  <text class="label" x="12" y="44">state A</text>
  <rect class="box" x="56" y="28" width="38" height="26" rx="3" opacity="0.5"/>
  <text class="label" x="60" y="44" opacity="0.5">state B*</text>
  <text x="60" y="72" font-size="16" fill="var(--diagram-ink)" opacity="0.75">&#10007;</text>
  <text class="label" x="54" y="86">server error</text>
  <path class="arrow" d="M56,42 Q40,20 22,42" stroke-dasharray="4 2"/>
  <text class="label" x="25" y="18">rollback</text>
  <text x="5" y="108" font-size="7.5" fill="var(--diagram-ink)" opacity="0.8">apply fast, revert if server rejects</text>
</svg>`,
    definition: `Optimistic UI applies a state change to the local UI immediately — before the server confirms it — giving the user instant feedback. If the server later rejects the operation, the app rolls back to the previous state and shows an error. If the server confirms, the optimistic state is replaced with the canonical server response.\n\nThe pattern requires storing a snapshot of pre-mutation state (or the mutation's inverse) so that rollback is deterministic. React Query and SWR both support onMutate/onError hooks for this lifecycle.`,
    analogy: `A cafe that lets regulars take their coffee immediately and pay at the end of the month. Most of the time no one defaults, and the experience is frictionless. If a customer fails to pay, the cafe marks it as a loss and stops the arrangement. The optimistic trust makes service fast; the rollback handles the failure case.`,
    examples: [
        { title: "React Query mutation", text: "In onMutate, snapshot previousData from the query cache and update it optimistically. In onError, call queryClient.setQueryData with the snapshot to revert. In onSettled, invalidate to refetch." },
        { title: "Like button", text: "Increment the like count in local state on click. Fire the POST in the background. If it fails, decrement back to the original count and show a toast. The click feels instant either way." }
    ],
    useCases: [
        "Social interactions (likes, follows, reactions) where latency would feel sluggish",
        "Inline edits in tables or lists where waiting for round-trips breaks flow",
        "Drag-and-drop reordering that must feel immediate even over slow networks"
    ],
    tradeoffs: {
        pros: [
            "Perceived performance is near-instant regardless of network latency",
            "Failure cases are handled gracefully with rollback rather than blocking the user",
            "Standard libraries (React Query, SWR) provide the scaffolding out of the box"
        ],
        cons: [
            "Conflicts between concurrent optimistic updates require careful resolution logic",
            "Rollback UX (toast + visual revert) can confuse users if it happens frequently",
            "Stale optimistic state can compound with race conditions under poor connectivity"
        ]
    },
    related: ["race-conditions", "event-sourcing", "finite-state-modeling", "stale-while-revalidate", "offline-conflict"]
},

// ── Browser (13) ────────────────────────────────────────────────────────────

{
    id: "event-loop-tasks",
    term: "Event loop (macro vs microtasks)",
    tagline: "How the browser decides what to run and when between frames",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes spin { from{transform-origin:60px 60px;transform:rotate(0deg)} to{transform-origin:60px 60px;transform:rotate(360deg)} }
    .ring { fill: none; stroke: var(--diagram-ink); stroke-width: 3; }
    .dot { fill: var(--diagram-ink); }
    .label { fill: var(--diagram-ink); font-size: 7px; text-anchor: middle; }
  </style>
  <circle class="ring" cx="60" cy="60" r="44" stroke-dasharray="8 6" opacity="0.5"/>
  <circle class="ring" cx="60" cy="60" r="26" stroke-dasharray="4 3" opacity="0.85"/>
  <circle class="dot" cx="60" cy="60" r="6"/>
  <circle class="dot" cx="104" cy="60" r="5" opacity="0.5"/>
  <circle class="dot" cx="60" cy="16" r="5" opacity="0.5"/>
  <circle class="dot" cx="86" cy="35" r="4" opacity="0.8"/>
  <text class="label" x="60" y="114">macrotasks (setTimeout, I/O)</text>
  <text class="label" x="60" y="104">microtasks (Promise, queueMicrotask)</text>
</svg>`,
    definition: `The event loop processes tasks one at a time. Each iteration picks the oldest macrotask (setTimeout callback, I/O event, MessageChannel) from the task queue, runs it to completion, then drains the entire microtask queue before returning control to the browser for rendering.\n\nMicrotasks (Promise.then, queueMicrotask, MutationObserver callbacks) always run before the next macrotask and before paint. This means a long chain of Promise callbacks can delay rendering just as much as a single long task — the browser cannot paint until the microtask queue is empty.`,
    analogy: `A server processes one table's order at a time (macrotask). Before seating the next party, the server handles all immediate requests from the current table — refills, condiments, the check — even if new parties keep arriving. Those immediate requests are microtasks: they run to exhaustion before moving on.`,
    examples: [
        { title: "setTimeout vs Promise ordering", text: "console.log('a'); Promise.resolve().then(()=>console.log('b')); setTimeout(()=>console.log('c'),0) prints a, b, c — Promise microtask runs before the 0ms timeout macrotask." },
        { title: "MutationObserver timing", text: "MutationObserver callbacks are microtasks. They fire synchronously after the DOM mutation, before the next macrotask — useful for batching DOM reads right after a write without yielding." }
    ],
    useCases: [
        "Understanding why Promise.then callbacks run before setTimeout with 0ms delay",
        "Scheduling low-priority work with setTimeout(0) or scheduler.postTask",
        "Diagnosing why a long async chain blocks rendering despite being non-blocking"
    ],
    tradeoffs: {
        pros: [
            "Deterministic ordering of microtasks enables predictable async sequencing",
            "Macrotask yielding allows the browser to paint between long operations when used correctly",
            "queueMicrotask() provides explicit control over micro-scheduling without Promises"
        ],
        cons: [
            "An uncapped microtask loop (recursive Promise chaining) starves rendering permanently",
            "Mental model requires understanding two separate queues, which confuses many developers",
            "Browser-specific edge cases (navigation, input events) can alter expected task ordering"
        ]
    },
    related: ["task-starvation", "long-tasks", "scheduler-priorities", "mutationobserver-cost"]
},

{
    id: "task-starvation",
    term: "Task starvation",
    tagline: "Lower-priority tasks never run because higher-priority work never yields",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes fill-bar { 0%{width:0} 100%{width:88px} }
    .bar-bg { fill: var(--diagram-ink); opacity: 0.15; }
    .bar-fg { fill: var(--diagram-ink); }
    .label { fill: var(--diagram-ink); font-size: 8px; }
    .waiting { fill: var(--diagram-ink); opacity: 0.35; }
  </style>
  <rect class="bar-bg" x="8" y="20" width="104" height="20" rx="3"/>
  <rect class="bar-fg" x="8" y="20" width="88" height="20" rx="3" style="animation:fill-bar 2s ease-out infinite"/>
  <text class="label" x="12" y="34">long task running...</text>
  <rect class="waiting" x="8" y="50" width="28" height="14" rx="2"/>
  <text x="11" y="61" font-size="7" fill="var(--diagram-ink)">task B</text>
  <rect class="waiting" x="42" y="50" width="28" height="14" rx="2"/>
  <text x="45" y="61" font-size="7" fill="var(--diagram-ink)">task C</text>
  <rect class="waiting" x="76" y="50" width="28" height="14" rx="2"/>
  <text x="79" y="61" font-size="7" fill="var(--diagram-ink)">task D</text>
  <text x="8" y="84" font-size="8" fill="var(--diagram-ink)">B, C, D wait indefinitely</text>
  <text x="8" y="96" font-size="7.5" fill="var(--diagram-ink)" opacity="0.7">paint also starved — UI freezes</text>
</svg>`,
    definition: `Task starvation occurs when the event loop is perpetually occupied with high-priority or continuous work, preventing lower-priority tasks from ever executing. In the browser, this shows up as a frozen UI: the rendering pipeline cannot paint because the main thread is never yielded.\n\nThe microtask queue is a common culprit — because it is fully drained before every paint, an unbounded microtask chain starves everything. Long synchronous tasks have the same effect. The solution is to explicitly yield via setTimeout, scheduler.yield(), or scheduler.postTask.`,
    analogy: `An emergency room that processes only critical patients can prevent stable patients from ever being seen. If new critical cases keep arriving faster than they resolve, everyone else waits forever. The system needs a policy that occasionally serves lower-priority patients even when higher-priority ones exist.`,
    examples: [
        { title: "Recursive microtask starvation", text: "function loop() { Promise.resolve().then(loop); } loop() starves the browser completely. The microtask queue is never empty, so the browser never paints and user input never fires." },
        { title: "Chunked work with yield", text: "Processing a 100,000-item array in chunks of 1,000 with await new Promise(r=>setTimeout(r,0)) between chunks yields to the browser between each chunk, allowing frames to paint." }
    ],
    useCases: [
        "Diagnosing frozen UIs where long synchronous loops block input handling",
        "Designing background data processing that respects the browser's render budget",
        "Understanding why unbounded Promise chains degrade perceived performance"
    ],
    tradeoffs: {
        pros: [
            "Explicit yielding via scheduler.yield() gives precise control over work chunking",
            "Web Workers offload work entirely from the main thread, eliminating starvation risk",
            "isInputPending() API lets long tasks self-interrupt when user input arrives"
        ],
        cons: [
            "Chunked work adds async complexity and state management between chunks",
            "Yielding too frequently increases overhead from task queue round-trips",
            "scheduler.postTask() has limited browser support and requires a polyfill"
        ]
    },
    related: ["event-loop-tasks", "long-tasks", "scheduler-priorities", "workers-vs-service-workers", "time-slicing"]
},

{
    id: "shadow-dom",
    term: "Shadow DOM",
    tagline: "An isolated DOM subtree with its own scoped styles and event boundaries",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .host { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .shadow { fill: var(--diagram-ink); opacity: 0.1; stroke: var(--diagram-ink); stroke-width: 1.5; stroke-dasharray: 5 3; }
    .inner { fill: none; stroke: var(--diagram-ink); stroke-width: 1.5; }
    .label { fill: var(--diagram-ink); font-size: 8px; }
  </style>
  <rect class="host" x="10" y="10" width="100" height="100" rx="6"/>
  <text class="label" x="14" y="24">host element</text>
  <rect class="shadow" x="22" y="30" width="76" height="72" rx="4"/>
  <text class="label" x="26" y="44">shadow root</text>
  <rect class="inner" x="32" y="50" width="28" height="18" rx="2"/>
  <text class="label" x="36" y="62">slot</text>
  <rect class="inner" x="68" y="50" width="24" height="18" rx="2"/>
  <text class="label" x="72" y="62">style</text>
  <text class="label" x="26" y="106" opacity="0.7">styles scoped — outside CSS cannot leak in</text>
</svg>`,
    definition: `The Shadow DOM is an encapsulated DOM subtree attached to a host element. Styles defined inside a shadow root do not leak out to the document, and document styles do not leak in — unless CSS custom properties or ::part selectors are used deliberately. Event retargeting means that events fired from inside the shadow appear to originate from the host when observed outside.\n\nShadow DOM is the isolation layer that makes Web Components truly encapsulated. It solves the global CSS problem without build-time transformations — scope is enforced by the browser at runtime.`,
    analogy: `A shadow DOM is like a stage set inside a theater. The theater audience sees the actor (the host element), but the rigging, props, and backstage lighting (shadow internals) are invisible from the house. The set's lighting will not spill into the audience's seats, and house lighting will not reach the backstage area.`,
    examples: [
        { title: "Attaching a shadow root", text: "el.attachShadow({mode:'open'}) returns a shadow root. Appending a style tag and child elements to it gives fully scoped CSS that document.querySelectorAll cannot reach." },
        { title: "CSS custom property theming", text: "Shadow DOM blocks most CSS inheritance but custom properties (--primary-color) pierce the boundary. The host defines custom properties; shadow internals consume them for theming without exposing full style control." }
    ],
    useCases: [
        "Web Component encapsulation where style isolation is required by design",
        "Embeddable third-party widgets that must not be styled by the host page",
        "Design systems where component styles must be fully predictable regardless of document context"
    ],
    tradeoffs: {
        pros: [
            "Genuine CSS scope enforcement without build-time hashing or naming conventions",
            "Prevents accidental global style conflicts in large codebases",
            "Slots provide flexible content projection without losing encapsulation"
        ],
        cons: [
            "Server-side rendering requires Declarative Shadow DOM syntax, which has incomplete adoption",
            "Accessibility tree traversal across shadow boundaries requires explicit ARIA management",
            "Styling from outside requires deliberate ::part or custom property APIs — less flexible for theming"
        ]
    },
    related: ["custom-elements-lifecycle", "web-components-interop", "accessibility-tree", "css-containment"]
},

{
    id: "custom-elements-lifecycle",
    term: "Custom Elements lifecycle",
    tagline: "Built-in browser callbacks that fire as a custom element moves through the DOM",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .node { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .dot { fill: var(--diagram-ink); }
    .label { fill: var(--diagram-ink); font-size: 7.5px; text-anchor: middle; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a7); }
  </style>
  <defs>
    <marker id="a7" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <circle class="node" cx="60" cy="16" r="12"/>
  <text class="label" x="60" y="20">ctor</text>
  <circle class="node" cx="24" cy="54" r="13"/>
  <text class="label" x="24" y="52">con-</text>
  <text class="label" x="24" y="62">nected</text>
  <circle class="node" cx="96" cy="54" r="13"/>
  <text class="label" x="96" y="52">attr</text>
  <text class="label" x="96" y="62">changed</text>
  <circle class="node" cx="60" cy="96" r="13"/>
  <text class="label" x="60" y="94">dis-</text>
  <text class="label" x="60" y="104">connected</text>
  <path class="arrow" d="M50,26 L33,42"/>
  <path class="arrow" d="M70,26 L87,42"/>
  <path class="arrow" d="M33,66 L51,84"/>
  <path class="arrow" d="M87,66 L69,84"/>
</svg>`,
    definition: `The Custom Elements API defines four lifecycle callbacks: constructor (setup, must call super()), connectedCallback (element inserted into document), disconnectedCallback (element removed), and attributeChangedCallback (an observed attribute changed). A fifth, adoptedCallback, fires when the element is moved to a new document.\n\nThese callbacks are synchronous and fire in document order. connectedCallback is the right place to set up subscriptions and timers; disconnectedCallback must clean them up to avoid memory leaks.`,
    analogy: `A custom element lifecycle is like a hotel guest's journey: check-in (constructor), room entry (connectedCallback), room service requests (attributeChangedCallback), and check-out (disconnectedCallback). The hotel tracks each stage and has procedures for what happens at each step.`,
    examples: [
        { title: "Subscription cleanup", text: "In connectedCallback, subscribe to a store and store the unsubscribe function on this. In disconnectedCallback, call the stored unsubscribe to prevent memory leaks when the element leaves the DOM." },
        { title: "observedAttributes", text: "static get observedAttributes() {return ['src','disabled']} makes attributeChangedCallback fire only for those attributes. The callback receives name, oldValue, newValue." }
    ],
    useCases: [
        "Building framework-agnostic UI components that integrate anywhere HTML is valid",
        "Migrating legacy UI libraries to a standards-based component model",
        "Creating widgets with predictable setup and teardown for SPAs with frequent DOM changes"
    ],
    tradeoffs: {
        pros: [
            "Standardized lifecycle is portable — works in every modern browser without a framework",
            "Cleanup hooks prevent resource leaks for long-lived single-page apps",
            "Observed attributes bridge the declarative HTML attribute model to imperative JS"
        ],
        cons: [
            "Constructor limitations (no children, no attributes accessible) trip up new developers",
            "Synchronous callbacks can cause layout thrashing if DOM reads follow DOM writes",
            "SSR support is incomplete without Declarative Shadow DOM and careful hydration"
        ]
    },
    related: ["shadow-dom", "web-components-interop", "detached-dom-nodes", "browser-memory-leaks"]
},

{
    id: "web-components-interop",
    term: "Web Components interoperability",
    tagline: "Using native custom elements inside and alongside framework-managed trees",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .fw { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .wc { fill: var(--diagram-ink); opacity: 0.15; stroke: var(--diagram-ink); stroke-width: 2; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a8); }
  </style>
  <defs>
    <marker id="a8" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="fw" x="8" y="20" width="44" height="40" rx="4"/>
  <text class="label" x="30" y="38">React</text>
  <text class="label" x="30" y="50">component</text>
  <rect class="wc" x="68" y="20" width="44" height="40" rx="4"/>
  <text class="label" x="90" y="38">my-</text>
  <text class="label" x="90" y="50">widget</text>
  <path class="arrow" d="M52,32 L68,32"/>
  <text x="53" y="28" font-size="7" fill="var(--diagram-ink)">props</text>
  <path class="arrow" d="M68,46 L52,46"/>
  <text x="53" y="56" font-size="7" fill="var(--diagram-ink)">events</text>
  <text class="label" x="60" y="82" font-size="7.5">properties not attributes</text>
  <text class="label" x="60" y="93" font-size="7">for complex data</text>
</svg>`,
    definition: `Web Components interoperability covers the friction points between custom elements and JavaScript frameworks. Frameworks like React pass data as attributes (strings), but complex data (objects, arrays) must go through element properties. Custom events bubble through shadow boundaries via composed:true, but React's synthetic event system does not listen to custom event names — requiring addEventListener on the ref.\n\nThe Custom Elements Everywhere test suite documents framework-specific gaps. React 19 significantly improved its handling, but property vs attribute and event registration remain integration points requiring explicit code.`,
    analogy: `Mixing web components into a framework is like installing a foreign-brand appliance in a kitchen designed for another brand's system. The electricity standard is shared, but the connectors may not match. You can make it work, but you need an adapter for each connection type — properties, events, styles.`,
    examples: [
        { title: "React ref for properties", text: "To pass an array to a web component from React: useRef on the element, then in useEffect set ref.current.items = myArray. React cannot serialize arrays as HTML attributes." },
        { title: "Custom event in React", text: "React's onClick does not catch custom events. Use ref.current.addEventListener('my-event', handler) in useEffect, and return a cleanup that calls removeEventListener." }
    ],
    useCases: [
        "Embedding web component design systems into React or Vue applications",
        "Gradually migrating a legacy web-component-based app toward a modern framework",
        "Sharing UI components across teams using different frameworks"
    ],
    tradeoffs: {
        pros: [
            "Web components are framework-agnostic — one implementation works everywhere",
            "Shadow DOM isolation prevents style conflicts between the component and host framework",
            "React 19 added first-class support for custom element properties and events"
        ],
        cons: [
            "Property-vs-attribute impedance mismatch requires boilerplate in framework wrappers",
            "SSR support for custom elements with shadow DOM is still maturing",
            "Custom event handling bypasses framework synthetic event systems, requiring manual wiring"
        ]
    },
    related: ["shadow-dom", "custom-elements-lifecycle", "accessibility-tree"]
},

{
    id: "workers-vs-service-workers",
    term: "Web Workers vs Service Workers",
    tagline: "Two off-main-thread APIs with completely different scopes and lifetimes",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .box { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .label { fill: var(--diagram-ink); font-size: 7.5px; text-anchor: middle; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a9); }
  </style>
  <defs>
    <marker id="a9" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="box" x="35" y="8" width="50" height="26" rx="3"/>
  <text class="label" x="60" y="24">page</text>
  <rect class="box" x="5" y="54" width="46" height="26" rx="3"/>
  <text class="label" x="28" y="65">web worker</text>
  <text class="label" x="28" y="74">CPU tasks</text>
  <rect class="box" x="69" y="54" width="46" height="26" rx="3"/>
  <text class="label" x="92" y="65">service</text>
  <text class="label" x="92" y="74">worker</text>
  <rect class="box" x="35" y="92" width="50" height="20" rx="3"/>
  <text class="label" x="60" y="105">network</text>
  <path class="arrow" d="M50,34 L28,54"/>
  <path class="arrow" d="M70,34 L92,54"/>
  <path class="arrow" d="M92,80 L78,92"/>
</svg>`,
    definition: `Web Workers run JavaScript on a background thread scoped to a page. They share no global scope with the page; communication is via postMessage. They are created and destroyed by the page that spawned them.\n\nService Workers sit between the browser and the network for an entire origin. They are installed and updated independently of any tab, can intercept any fetch, and remain registered even after all tabs close. They power offline caching, push notifications, and background sync — use cases that span page lifecycle.`,
    analogy: `A Web Worker is a private assistant you hire to run errands while you work — they help you personally and leave when you do. A Service Worker is a building concierge who works for the entire building, intercepts all deliveries, caches packages, and stays on shift even when you are not home.`,
    examples: [
        { title: "Web Worker for parsing", text: "Offload a 10MB JSON parse or a wasm computation to a Worker with new Worker('./worker.js'). The result comes back via postMessage, keeping the main thread free to handle user input." },
        { title: "Service Worker cache-first", text: "In the fetch handler: return cached response if present, else fetch and cache the response. This turns the service worker into a programmable CDN for the origin." }
    ],
    useCases: [
        "Web Worker: CPU-intensive tasks (image processing, parsing, cryptography) off main thread",
        "Service Worker: offline-first caching, background sync, and push notification delivery",
        "Service Worker: intercepting and transforming network requests for A/B testing or monitoring"
    ],
    tradeoffs: {
        pros: [
            "Both keep heavy work off the main thread, eliminating frame drops during computation",
            "Service Workers enable reliable offline experiences previously requiring a native app",
            "Web Workers can use SharedArrayBuffer for zero-copy data sharing with the page"
        ],
        cons: [
            "No DOM access in either worker type — UI updates must still happen on the main thread",
            "Service Worker update lifecycle is nuanced and can cause stale-version bugs on deploy",
            "Debugging workers requires dedicated DevTools panels and is more complex than main-thread code"
        ]
    },
    related: ["sharedarraybuffer", "transferable-objects", "offscreencanvas", "service-worker-lifecycle", "task-starvation"]
},

{
    id: "sharedarraybuffer",
    term: "SharedArrayBuffer",
    tagline: "A fixed-size raw binary buffer shared between the main thread and workers without copying",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes write-pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
    .buf { fill: var(--diagram-ink); opacity: 0.15; stroke: var(--diagram-ink); stroke-width: 2; }
    .cell { fill: none; stroke: var(--diagram-ink); stroke-width: 1; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a10); }
  </style>
  <defs>
    <marker id="a10" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="buf" x="18" y="50" width="84" height="22" rx="2"/>
  <line class="cell" x1="39" y1="50" x2="39" y2="72"/>
  <line class="cell" x1="60" y1="50" x2="60" y2="72"/>
  <line class="cell" x1="81" y1="50" x2="81" y2="72"/>
  <text class="label" x="28" y="64" style="animation:write-pulse 1.5s infinite">42</text>
  <text class="label" x="49" y="64">7</text>
  <text class="label" x="70" y="64">99</text>
  <text class="label" x="91" y="64">0</text>
  <path class="arrow" d="M40,48 L40,30"/>
  <text class="label" x="40" y="24">main</text>
  <path class="arrow" d="M80,48 L80,30"/>
  <text class="label" x="80" y="24">worker</text>
  <text class="label" x="60" y="90">Atomics.add / load / store</text>
  <text class="label" x="60" y="102" font-size="7">requires COOP/COEP headers</text>
</svg>`,
    definition: `SharedArrayBuffer provides a raw binary buffer that multiple threads (main thread and Web Workers) can read and write simultaneously. Unlike postMessage transfers, the buffer is not copied — all threads hold a view into the same memory, making it the only true shared-memory primitive in the browser.\n\nBecause concurrent writes cause data races, SharedArrayBuffer is used with Atomics — a set of atomic read-modify-write operations. It requires cross-origin isolation (COOP + COEP response headers) because Spectre-class attacks could exploit timing via a shared high-resolution timer.`,
    analogy: `SharedArrayBuffer is a shared whiteboard in a conference room that multiple people can write on at once. Without rules, people overwrite each other's work. Atomics is the convention of raising your hand before erasing — it serializes access so only one person touches a given spot at a time.`,
    examples: [
        { title: "Atomics.wait / notify", text: "A worker calls Atomics.wait(int32, 0, 0) to block until the main thread calls Atomics.notify(int32, 0) after writing new data — a mutex-like coordination pattern for tight producer-consumer loops." },
        { title: "Parallel wasm workers", text: "WebAssembly modules compiled with WASM threads use SharedArrayBuffer for the wasm linear memory heap, letting multiple Web Workers run the same wasm module concurrently on separate thread stacks." }
    ],
    useCases: [
        "High-performance wasm applications (video codecs, physics engines) using multithreaded wasm",
        "Real-time audio processing shared between the main thread and AudioWorklet",
        "Zero-copy data pipelines between workers processing large binary datasets"
    ],
    tradeoffs: {
        pros: [
            "Eliminates postMessage serialization cost for large binary payloads shared across threads",
            "Enables true parallelism for CPU-bound computation within the browser sandbox",
            "Atomics provides safe, standard concurrency primitives without OS threads"
        ],
        cons: [
            "Requires COOP + COEP headers, breaking many third-party embeds (iframes, OAuth popups)",
            "Data races are silent and hard to debug — incorrect Atomics usage corrupts data",
            "Not suitable for structured JavaScript objects — only raw typed array views"
        ]
    },
    related: ["workers-vs-service-workers", "transferable-objects", "offscreencanvas"]
},

{
    id: "transferable-objects",
    term: "Transferable objects",
    tagline: "Move ownership of large data between threads in O(1) without copying",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes move-buf { 0%{transform:translateX(0)} 60%{transform:translateX(48px)} 100%{transform:translateX(48px)} }
    @keyframes fade-out { 0%,50%{opacity:1} 80%,100%{opacity:0.15} }
    .box { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .buf { fill: var(--diagram-ink); opacity: 0.7; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 2; fill: none; marker-end: url(#a11); }
  </style>
  <defs>
    <marker id="a11" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="box" x="5" y="30" width="40" height="34" rx="3"/>
  <text class="label" x="25" y="50">main</text>
  <rect class="buf" x="12" y="36" width="26" height="10" rx="4" style="animation:move-buf 2s ease-in-out infinite; transform-origin:25px 41px"/>
  <path class="arrow" d="M45,47 L75,47"/>
  <rect class="box" x="75" y="30" width="40" height="34" rx="3"/>
  <text class="label" x="95" y="50">worker</text>
  <text class="label" x="25" y="80" font-size="7.5" style="animation:fade-out 2s ease-in-out infinite">detached</text>
  <text class="label" x="60" y="100">ArrayBuffer, MessagePort,</text>
  <text class="label" x="60" y="111">ImageBitmap, OffscreenCanvas</text>
</svg>`,
    definition: `Transferable objects are types that can be moved between threads via postMessage with zero-copy semantics. Instead of structuring-cloning (serializing and deserializing) the entire buffer, the browser transfers ownership: the sender's reference is neutered (becomes a 0-byte detached buffer) and the receiver gets the original memory.\n\nTransferables include ArrayBuffer, MessagePort, ImageBitmap, OffscreenCanvas, and ReadableStream. The transfer list is passed as the second argument to postMessage.`,
    analogy: `Transferring an ArrayBuffer is like handing over a physical USB drive. The person who had it no longer has it — they gave it away. Contrast with a structured clone, which is like photocopying the drive's contents and keeping the original. Transfer is O(1) pointer swap; clone is O(n) copy.`,
    examples: [
        { title: "Typed array transfer", text: "worker.postMessage({buf: arrayBuffer}, [arrayBuffer]) transfers the buffer. After the call, arrayBuffer.byteLength === 0 — the main thread's reference is detached. The worker receives the original memory intact." },
        { title: "ImageBitmap pipeline", text: "createImageBitmap(blob) resolves an ImageBitmap. postMessage({frame}, [frame]) transfers it to a rendering worker. No pixel data is copied — just the pointer." }
    ],
    useCases: [
        "Sending large typed arrays (audio samples, pixel data) to Web Workers without copy overhead",
        "Passing ImageBitmap frames from a capture thread to a rendering or encoding thread",
        "Moving MessagePort ends between workers to set up direct peer-to-peer worker communication"
    ],
    tradeoffs: {
        pros: [
            "O(1) data handoff regardless of buffer size — critical for real-time audio/video pipelines",
            "Prevents accidental concurrent access: the original thread's reference is invalidated",
            "Structured cloning fallback means postMessage works even for non-transferable types"
        ],
        cons: [
            "Original reference is detached — code that checks the buffer after transfer reads 0 bytes",
            "Transferable types are a limited set — plain objects require structured clone (slow for large data)",
            "Transferring back requires another postMessage, adding a round-trip for bidirectional workflows"
        ]
    },
    related: ["sharedarraybuffer", "workers-vs-service-workers", "offscreencanvas"]
},

{
    id: "offscreencanvas",
    term: "OffscreenCanvas",
    tagline: "Render to a canvas element from a Web Worker, entirely off the main thread",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes draw { 0%{stroke-dashoffset:80} 100%{stroke-dashoffset:0} }
    .canvas { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .line { stroke: var(--diagram-ink); stroke-width: 2; stroke-dasharray: 80; fill: none; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .arrow { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; marker-end: url(#a12); }
  </style>
  <defs>
    <marker id="a12" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--diagram-ink)"/>
    </marker>
  </defs>
  <rect class="canvas" x="5" y="10" width="50" height="30" rx="3"/>
  <text class="label" x="30" y="28">web worker</text>
  <rect class="canvas" x="10" y="50" width="50" height="40" rx="3"/>
  <path class="line" d="M18,82 Q30,58 42,74 L52,62" style="animation:draw 2s ease-in-out infinite"/>
  <text class="label" x="35" y="100">offscreen canvas</text>
  <path class="arrow" d="M60,70 L80,70"/>
  <rect class="canvas" x="80" y="50" width="34" height="40" rx="3"/>
  <text class="label" x="97" y="74">screen</text>
  <text class="label" x="60" y="114" font-size="7">canvas.transferControlToOffscreen()</text>
</svg>`,
    definition: `OffscreenCanvas transfers rendering control of a canvas element to a Web Worker. The worker gets a full Canvas2D or WebGL context and can draw frames independently of the main thread. Completed frames are composited to screen by the browser's compositor.\n\nThis is the standard approach for heavy canvas workloads — games, data visualizations, video processing — where main-thread frame rendering competes with event handling and React's reconciler.`,
    analogy: `OffscreenCanvas is like a backstage painting crew that prepares each scene on a hidden canvas. The main stage (main thread) just signals "scene change" and the crew swaps in the pre-painted backdrop instantly. The audience never sees the painting happening.`,
    examples: [
        { title: "Transfer and draw", text: "const offscreen = canvas.transferControlToOffscreen(); worker.postMessage({canvas: offscreen}, [offscreen]). In the worker: self.onmessage fires with the canvas, then call getContext('2d') and draw." },
        { title: "WebGL in worker", text: "OffscreenCanvas supports WebGL contexts, enabling full 3D rendering off the main thread. Three.js and Babylon.js both have experimental worker rendering modes using this API." }
    ],
    useCases: [
        "60fps canvas games that cannot share the main thread with React rendering",
        "Real-time data visualization (charts, oscilloscopes) that update independently of UI",
        "Video frame compositing where pixel manipulation must not block user interaction"
    ],
    tradeoffs: {
        pros: [
            "Rendering and interaction handling are fully decoupled — neither blocks the other",
            "WebGL context in a worker enables GPU-accelerated computation off the main thread",
            "commitImageBitmap() gives explicit control over when frames are committed to screen"
        ],
        cons: [
            "Once transferred, the main thread loses all access to the canvas element",
            "Browser support is good but not universal — Safari added it in 2023",
            "Worker canvas context lacks access to DOM measurements needed for responsive sizing"
        ]
    },
    related: ["workers-vs-service-workers", "transferable-objects", "sharedarraybuffer", "gpu-acceleration-css"]
},

{
    id: "browser-memory-leaks",
    term: "Browser memory leak detection",
    tagline: "Finding and fixing allocations that grow without bound over a page session",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes drip { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(20px);opacity:0} }
    .bucket { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .fill { fill: var(--diagram-ink); opacity: 0.3; }
    .fill2 { fill: var(--diagram-ink); opacity: 0.55; }
    .drop { fill: var(--diagram-ink); opacity: 0.7; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
  </style>
  <path class="bucket" d="M25,20 L20,90 L95,90 L90,20 Z"/>
  <rect class="fill" x="21" y="68" width="72" height="21"/>
  <rect class="fill2" x="21" y="50" width="72" height="18"/>
  <ellipse class="drop" cx="60" cy="20" rx="5" ry="3" style="animation:drip 1.8s ease-in infinite"/>
  <ellipse class="drop" cx="48" cy="20" rx="3" ry="2" style="animation:drip 2.4s ease-in 0.6s infinite"/>
  <text class="label" x="60" y="106">heap growing</text>
  <text class="label" x="60" y="116" font-size="7">detached nodes, retained closures</text>
</svg>`,
    definition: `A browser memory leak is an allocation the garbage collector cannot reclaim because at least one live reference holds it. Common causes: event listeners registered on global objects (window, document) and never removed; closures over large objects kept alive by long-lived callbacks; detached DOM nodes still referenced by JavaScript; and growing caches with no eviction policy.\n\nDetection uses Chrome DevTools: take a heap snapshot, interact with the page, take another, and compare retained object counts. The Allocation instrumentation timeline shows where objects are allocated and whether they survive GC.`,
    analogy: `A memory leak is like a filing cabinet where nobody ever removes old files. New files keep arriving, old ones are never purged, and eventually there is no room for anything else. Garbage collection can only purge files that nothing references — a forgotten sticky note pointing to an old file prevents its removal.`,
    examples: [
        { title: "Global event listener", text: "window.addEventListener('resize', this.handler) in a component's mount with no corresponding removeEventListener on unmount retains the component's entire closure — including state and child references — forever." },
        { title: "Map cache without eviction", text: "A module-level Map used as a cache grows indefinitely if keys are object references that are never deleted. Replacing with WeakMap allows the GC to collect entries when the key objects become unreachable." }
    ],
    useCases: [
        "Long-running SPAs where memory grows across many route transitions",
        "Diagnosing dashboards that slow down over hours of continuous use",
        "Auditing component libraries for cleanup discipline in lifecycle teardown"
    ],
    tradeoffs: {
        pros: [
            "Chrome DevTools heap snapshots provide direct evidence of retained objects",
            "WeakRef and FinalizationRegistry enable cache patterns that cooperate with GC",
            "React StrictMode double-invokes effects, exposing missing cleanup on development builds"
        ],
        cons: [
            "Heap profiling requires reproducing the leak in a controlled session — hard in complex apps",
            "GC timing is non-deterministic, making leak confirmation require multiple snapshot comparisons",
            "Framework abstractions (context, subscriptions) can retain closures in non-obvious ways"
        ]
    },
    related: ["detached-dom-nodes", "gc-timing", "custom-elements-lifecycle", "stale-closure"]
},

{
    id: "detached-dom-nodes",
    term: "Detached DOM nodes",
    tagline: "DOM nodes removed from the document but still held in memory by JavaScript references",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .tree { stroke: var(--diagram-ink); stroke-width: 1.5; fill: none; }
    .node { fill: var(--diagram-ink); opacity: 0.85; }
    .ghost { fill: var(--diagram-ink); opacity: 0.2; stroke: var(--diagram-ink); stroke-width: 1.5; stroke-dasharray: 4 2; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .ref-line { stroke: var(--diagram-ink); stroke-width: 1.5; stroke-dasharray: 3 2; }
  </style>
  <circle class="node" cx="36" cy="20" r="8"/>
  <line class="tree" x1="36" y1="28" x2="24" y2="50"/>
  <circle class="node" cx="24" cy="58" r="8"/>
  <circle class="ghost" cx="72" cy="58" r="12"/>
  <text class="label" x="72" y="62">detached</text>
  <rect x="72" y="90" width="40" height="18" rx="2" fill="none" stroke="var(--diagram-ink)" stroke-width="1.5"/>
  <text class="label" x="92" y="102" font-size="7.5">let cached</text>
  <line class="ref-line" x1="92" y1="90" x2="80" y2="70"/>
  <text class="label" x="60" y="115" font-size="7">GC cannot collect — ref alive</text>
</svg>`,
    definition: `A detached DOM node is a node that has been removed from the live document tree but is still referenced by a JavaScript variable, closure, or data structure. The GC cannot collect it because the reference is still reachable, even though the node is no longer visible or active in the page.\n\nDetached nodes accumulate silently in SPAs that remove and replace UI sections. A common pattern: a click handler closes over a reference to a removed element; a cache stores removed list items; or a WeakMap-less event delegation map holds removed nodes as keys.`,
    analogy: `A detached DOM node is like a demolished building that still appears in the city's filing system because a permit was never closed. The building is gone from the street, but the city's records still reference it — so the city cannot reclaim the lot number for a new structure.`,
    examples: [
        { title: "Cached removed element", text: "const oldList = document.getElementById('list'); container.textContent = ''; — oldList still holds the removed element. If oldList is a module-level variable, the entire subtree is retained in memory." },
        { title: "DevTools detection", text: "In Chrome DevTools Memory tab, take a heap snapshot and filter by 'Detached'. Each 'Detached HTMLElement' entry shows what is holding the reference in its retainer path." }
    ],
    useCases: [
        "SPA navigation that swaps route components — previous route's DOM can linger",
        "Infinite scroll lists that remove off-screen rows but forget to clear cached references",
        "Event delegation maps that store removed nodes as keys without WeakMap"
    ],
    tradeoffs: {
        pros: [
            "WeakMap keyed on DOM nodes automatically releases entries when nodes are GC'd",
            "React's reconciler manages its own fiber tree — framework-managed nodes are cleaned up automatically",
            "DevTools retainer path view makes the leak source identifiable without guessing"
        ],
        cons: [
            "Subtle when mixed with caching patterns — the reference often looks intentional",
            "Full subtree retention: holding one parent node retains all descendants and their closures",
            "Non-deterministic GC timing means the leak may not be visible in short test sessions"
        ]
    },
    related: ["browser-memory-leaks", "gc-timing", "custom-elements-lifecycle"]
},

{
    id: "gc-timing",
    term: "Garbage collection timing",
    tagline: "When the browser chooses to reclaim memory and how it affects frame timing",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes spike { 0%,80%,100%{height:6px;y:62px;opacity:0.4} 85%,95%{height:28px;y:40px;opacity:1} }
    .bar { fill: var(--diagram-ink); width: 10px; }
    .spike { fill: var(--diagram-ink); width: 10px; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .axis { stroke: var(--diagram-ink); stroke-width: 1.5; }
  </style>
  <line class="axis" x1="10" y1="68" x2="110" y2="68"/>
  <rect class="bar" x="12" y="52" height="16" opacity="0.5"/>
  <rect class="bar" x="26" y="54" height="14" opacity="0.5"/>
  <rect class="bar" x="40" y="50" height="18" opacity="0.5"/>
  <rect class="bar" x="54" y="55" height="13" opacity="0.5"/>
  <rect class="spike" x="68" y="40" height="28" style="animation:spike 3s ease-in-out infinite"/>
  <rect class="bar" x="82" y="52" height="16" opacity="0.5"/>
  <rect class="bar" x="96" y="53" height="15" opacity="0.5"/>
  <text class="label" x="73" y="84">GC</text>
  <text class="label" x="60" y="98">frame spike</text>
  <text class="label" x="60" y="110" font-size="7">non-deterministic pause</text>
</svg>`,
    definition: `JavaScript GC in browsers is generational: short-lived objects are collected cheaply in the minor GC (nursery) while long-lived objects are promoted to old space and collected by major GC, which involves a more expensive mark-and-sweep. Both pause the main thread, but major GC pauses can last 10-50ms — enough to miss multiple frames.\n\nV8 uses incremental and concurrent marking to spread the work across frames and background threads, but allocation pressure from object-heavy rendering can force synchronous GC pauses. Performance traces in Chrome DevTools show GC events as gray blocks in the main thread timeline.`,
    analogy: `Think of GC as a building maintenance crew that needs to shut down the elevator to inspect it. Minor maintenance (quick checks) happens in seconds between floors. Major inspections require closing the elevator for an entire floor cycle. If the building generates maintenance tasks faster than the crew resolves them, elevator downtime becomes unpredictable.`,
    examples: [
        { title: "Allocation pressure in animation", text: "Creating a new {x, y, z} vector object every requestAnimationFrame floods the nursery. Even with fast minor GC, the promoted survivors accumulate in old space, triggering major GC at unpredictable intervals." },
        { title: "Object pool pattern", text: "Preallocate a fixed array of vector objects at startup and reuse them each frame by overwriting properties. No new allocations means no GC pressure means consistent frame timing." }
    ],
    useCases: [
        "Game loops and animations where frame-time consistency is critical",
        "Audio processing where a GC pause causes audible glitches",
        "High-frequency data feeds where jitter from GC pauses disrupts perceived smoothness"
    ],
    tradeoffs: {
        pros: [
            "V8's incremental GC spreads most work off the critical path with minimal visible pauses",
            "Object pools and typed arrays eliminate allocation pressure for performance-critical loops",
            "Chrome Performance panel shows GC events with duration — measurable and diagnosable"
        ],
        cons: [
            "GC timing is non-deterministic — pauses appear unpredictably under real-world load",
            "Object pools require manual lifecycle management, reintroducing complexity GC was meant to eliminate",
            "WebAssembly avoids JS GC entirely, but passing JS objects across the wasm boundary still triggers it"
        ]
    },
    related: ["browser-memory-leaks", "detached-dom-nodes", "long-tasks", "task-starvation"]
},

{
    id: "pointer-events",
    term: "Pointer events",
    tagline: "A unified input API that handles mouse, touch, and stylus through one event model",
    category: "browser",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes tap { 0%,100%{r:6;opacity:0.8} 50%{r:12;opacity:0.3} }
    .device { fill: none; stroke: var(--diagram-ink); stroke-width: 2; }
    .cursor { fill: var(--diagram-ink); opacity: 0.85; }
    .label { fill: var(--diagram-ink); font-size: 8px; text-anchor: middle; }
    .ripple { fill: none; stroke: var(--diagram-ink); stroke-width: 1.5; }
  </style>
  <circle class="ripple" cx="60" cy="60" r="6" style="animation:tap 1.5s ease-out infinite"/>
  <circle class="cursor" cx="60" cy="60" r="5"/>
  <text class="label" x="60" y="18">mouse</text>
  <text class="label" x="20" y="90">touch</text>
  <text class="label" x="100" y="90">pen</text>
  <line x1="60" y1="22" x2="60" y2="54" stroke="var(--diagram-ink)" stroke-width="1" opacity="0.5"/>
  <line x1="28" y1="84" x2="54" y2="64" stroke="var(--diagram-ink)" stroke-width="1" opacity="0.5"/>
  <line x1="92" y1="84" x2="66" y2="64" stroke="var(--diagram-ink)" stroke-width="1" opacity="0.5"/>
  <text class="label" x="60" y="106" font-size="7.5">pointerdown / move / up / cancel</text>
  <text class="label" x="60" y="116" font-size="7">setPointerCapture, pressure, tilt</text>
</svg>`,
    definition: `The Pointer Events API unifies mouse, touch, and stylus input into a single event model. A pointerdown event fires whether the user clicks a mouse button, touches a screen, or presses a stylus — with additional properties (pressure, tiltX, tiltY, pointerType, width, height) providing input-specific detail.\n\nsetPointerCapture routes all pointer events to a specific element even after the pointer leaves its bounds — essential for drag interactions. Pointer events replace the need to write separate mousedown/touchstart handlers, eliminating event duplication bugs on hybrid touch/mouse devices.`,
    analogy: `Pointer Events is like a universal power adapter: whatever plug the device uses (mouse, touch, stylus), it gets normalized to the same output your code expects. You write one handler for "user is pressing on the screen" and the API handles the input type differences.`,
    examples: [
        { title: "Unified drag handler", text: "el.addEventListener('pointerdown', startDrag); el.setPointerCapture(e.pointerId) ensures pointermove fires even when the pointer leaves the element — no mouseleave or touchcancel split logic needed." },
        { title: "Pressure-sensitive drawing", text: "e.pressure (0.0-1.0) in a pointermove handler lets a canvas drawing app vary stroke width based on how hard a stylus is pressed, with no special-casing for different input devices." }
    ],
    useCases: [
        "Drag-and-drop and custom gesture implementations that work on both desktop and mobile",
        "Canvas drawing apps that support mouse, touch, and stylus from one code path",
        "Games and interactive visualizations that need unified hit detection across input types"
    ],
    tradeoffs: {
        pros: [
            "One event model replaces three (mouse, touch, stylus) eliminating duplicated handler logic",
            "setPointerCapture solves drag boundary tracking that previously required document-level listeners",
            "Rich input metadata (pressure, tilt, contact geometry) enables natural drawing and gaming inputs"
        ],
        cons: [
            "Some older browser behaviors (tap highlight, scroll) require explicit touch-action CSS to suppress defaults",
            "Coalesced and predicted events (getCoalescedEvents, getPredictedEvents) add API complexity for high-frequency use",
            "Legacy code using touch events alongside pointer events can fire duplicate handlers on touch devices"
        ]
    },
    related: ["event-loop-tasks", "custom-elements-lifecycle", "layout-thrashing"]
},
// ── Performance & vitals (18) ──────────────────────────────────────────────

{
    id: "layout-thrashing",
    term: "Layout thrashing",
    tagline: "Forcing the browser to recalculate layout repeatedly in a single frame",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bar { animation: thrash 0.6s ease-in-out infinite alternate; transform-origin: bottom center; }
    .bar:nth-child(2) { animation-delay: 0.1s; }
    .bar:nth-child(3) { animation-delay: 0.2s; }
    .bar:nth-child(4) { animation-delay: 0.3s; }
  </style>
  <rect x="10" y="100" width="20" height="10" fill="var(--diagram-ink)" class="bar"/>
  <rect x="35" y="85" width="20" height="25" fill="var(--diagram-ink)" class="bar"/>
  <rect x="60" y="70" width="20" height="40" fill="var(--diagram-ink)" class="bar"/>
  <rect x="85" y="55" width="20" height="55" fill="var(--diagram-ink)" class="bar"/>
  <line x1="10" y1="110" x2="110" y2="110" stroke="var(--diagram-ink)" stroke-width="2"/>
</svg>`,
    definition: `Layout thrashing happens when JavaScript reads layout properties (like offsetWidth or getBoundingClientRect) immediately after writing DOM styles, forcing the browser to synchronously recalculate layout before the current frame completes. Each read-after-write pair triggers a separate layout pass, multiplying the work per frame.\n\nThe browser normally batches layout work and runs it once per frame. Interleaving reads and writes breaks this batching. A loop that reads and writes layout properties on every iteration can cause dozens of forced synchronous layouts, dropping frame rates well below 60fps.`,
    analogy: `It's like a chef who slices one vegetable, immediately asks how many are left in the bin, slices another, asks again — instead of slicing everything first and counting once at the end. Each question interrupts the flow and adds overhead.`,
    examples: [
        { title: "Read-write interleaving", text: "Calling element.offsetHeight inside a loop that also sets element.style.height forces a layout recalculation on every iteration rather than once at the end." },
        { title: "Batching with requestAnimationFrame", text: "Reading all layout values before the rAF callback and writing all updates inside it lets the browser handle one layout pass per frame." }
    ],
    useCases: ["Animating multiple elements based on their current dimensions", "Building drag-and-drop interfaces that track element positions", "Implementing custom scroll-linked animations"],
    tradeoffs: {
        pros: ["Awareness leads to measurable frame-rate improvements", "Batching reads and writes is a straightforward refactor", "Tools like FastDOM enforce the pattern automatically"],
        cons: ["Batching logic can make code harder to follow", "Some third-party libraries trigger thrashing internally", "Detecting it requires profiler tooling, not just code review"]
    },
    related: ["critical-rendering-path", "paint-composite-layout", "long-tasks", "render-blocking"]
},

{
    id: "critical-rendering-path",
    term: "Critical rendering path",
    tagline: "The sequence the browser must complete before showing any pixels",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .step { animation: fadein 0.5s ease forwards; opacity: 0; }
    .step:nth-child(1) { animation-delay: 0s; }
    .step:nth-child(2) { animation-delay: 0.3s; }
    .step:nth-child(3) { animation-delay: 0.6s; }
    .step:nth-child(4) { animation-delay: 0.9s; }
    @keyframes fadein { to { opacity: 1; } }
  </style>
  <rect x="10" y="10" width="25" height="20" rx="3" fill="var(--diagram-ink)" class="step"/>
  <text x="22" y="24" font-size="7" fill="white" text-anchor="middle" class="step">DOM</text>
  <rect x="45" y="10" width="25" height="20" rx="3" fill="var(--diagram-ink)" class="step"/>
  <text x="57" y="24" font-size="7" fill="white" text-anchor="middle" class="step">CSSOM</text>
  <rect x="80" y="10" width="25" height="20" rx="3" fill="var(--diagram-ink)" class="step"/>
  <text x="92" y="24" font-size="7" fill="white" text-anchor="middle" class="step">Render</text>
  <line x1="35" y1="20" x2="45" y2="20" stroke="var(--diagram-ink)" stroke-width="2" marker-end="url(#arr)"/>
  <line x1="70" y1="20" x2="80" y2="20" stroke="var(--diagram-ink)" stroke-width="2"/>
  <rect x="10" y="50" width="95" height="50" rx="4" fill="none" stroke="var(--diagram-ink)" stroke-width="1.5"/>
  <text x="57" y="70" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">Layout</text>
  <text x="57" y="82" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">Paint</text>
  <text x="57" y="94" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">Composite</text>
</svg>`,
    definition: `The critical rendering path is the ordered set of steps a browser must complete to display the first frame: parse HTML to build the DOM, parse CSS to build the CSSOM, combine them into a render tree, run layout to compute geometry, paint pixels, and composite layers. Any resource that blocks these steps delays first contentful paint.\n\nOptimising the path means reducing the number or size of render-blocking resources, inlining critical CSS, deferring non-essential scripts, and minimising the payload that must load before the first visible frame renders.`,
    analogy: `Building a stage set before the curtain rises. Every prop and backdrop must be in place before the audience sees anything. If a single piece of scenery is late, the whole show waits.`,
    examples: [
        { title: "Render-blocking stylesheet", text: "A <link rel='stylesheet'> in <head> blocks the browser from rendering until the full CSS file is downloaded and parsed into the CSSOM." },
        { title: "Inlining critical CSS", text: "Extracting above-the-fold styles into a <style> tag eliminates one render-blocking network round trip, letting the first frame paint sooner." }
    ],
    useCases: ["Diagnosing slow first-paint on content sites", "Prioritising which assets to preload", "Auditing third-party scripts that delay LCP"],
    tradeoffs: {
        pros: ["Direct correlation between optimising this path and LCP scores", "Well-understood tooling (Lighthouse, WebPageTest)", "Most gains come from a small set of changes"],
        cons: ["Inlined critical CSS increases HTML payload and complicates build pipelines", "Over-aggressively deferring scripts can break functionality", "Gains diminish quickly on fast networks"]
    },
    related: ["render-blocking", "lcp", "paint-composite-layout", "speculative-prerendering", "browser-compositing"]
},

{
    id: "render-blocking",
    term: "Render blocking resources",
    tagline: "Resources that pause all rendering until they finish loading",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .svg-block { animation: pulse 1s ease-in-out infinite alternate; }
    @keyframes pulse { from { opacity: 1; } to { opacity: 0.3; } }
  </style>
  <rect x="15" y="45" width="90" height="30" rx="4" fill="var(--diagram-ink)" class="svg-block"/>
  <text x="60" y="65" font-size="9" fill="white" text-anchor="middle">BLOCKED</text>
  <rect x="5" y="10" width="30" height="20" rx="3" fill="var(--diagram-ink)" opacity="0.4"/>
  <text x="20" y="24" font-size="7" fill="white" text-anchor="middle">HTML</text>
  <rect x="45" y="10" width="30" height="20" rx="3" fill="var(--diagram-ink)"/>
  <text x="60" y="24" font-size="7" fill="white" text-anchor="middle">CSS</text>
  <rect x="85" y="10" width="30" height="20" rx="3" fill="var(--diagram-ink)"/>
  <text x="100" y="24" font-size="7" fill="white" text-anchor="middle">JS</text>
  <line x1="60" y1="30" x2="60" y2="45" stroke="var(--diagram-ink)" stroke-width="2"/>
  <line x1="100" y1="30" x2="100" y2="45" stroke="var(--diagram-ink)" stroke-width="2" stroke-dasharray="3,2"/>
  <rect x="20" y="90" width="80" height="20" rx="3" fill="var(--diagram-ink)" opacity="0.3"/>
  <text x="60" y="104" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">paint (waiting)</text>
</svg>`,
    definition: `Render-blocking resources are files the browser must fully download and process before it can paint any content to the screen. Stylesheets linked in <head> block rendering because the browser needs the complete CSSOM before it can calculate styles. Parser-blocking scripts block both DOM construction and rendering until they execute.\n\nNon-critical CSS and JavaScript can be made non-blocking using media queries, async/defer attributes on scripts, and link rel=preload with onload swapping. Reducing render-blocking resources is one of the highest-impact LCP optimisations available.`,
    analogy: `A traffic light that stays red until every single delivery truck on a side street has cleared the intersection — even trucks heading somewhere the main road cars don't need to go.`,
    examples: [
        { title: "Parser-blocking script", text: "A <script src='app.js'> without defer or async pauses HTML parsing entirely until the script downloads and runs." },
        { title: "Media-queried stylesheet", text: "Adding media='print' to a print stylesheet tells the browser it's not needed for the initial render, removing the blocking behavior." }
    ],
    useCases: ["Auditing third-party tag managers that inject synchronous scripts", "Splitting CSS into critical and deferred bundles", "Diagnosing waterfall bottlenecks in WebPageTest"],
    tradeoffs: {
        pros: ["Eliminating even one blocking resource meaningfully improves LCP", "defer and async are zero-risk for most analytics scripts", "Tooling (Lighthouse) flags these automatically"],
        cons: ["Deferring stylesheets can cause a flash of unstyled content", "async scripts execute out of order, breaking dependencies", "Detecting dynamically injected blocking resources requires runtime profiling"]
    },
    related: ["critical-rendering-path", "lcp", "speculative-prerendering", "paint-composite-layout"]
},

{
    id: "browser-compositing",
    term: "Browser compositing layers",
    tagline: "How the browser assembles independent painted layers into the final frame",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .layer { animation: stack 1.2s ease-in-out infinite alternate; }
    .layer:nth-child(1) { animation-delay: 0s; }
    .layer:nth-child(2) { animation-delay: 0.2s; }
    .layer:nth-child(3) { animation-delay: 0.4s; }
    @keyframes stack { from { transform: translateY(0); } to { transform: translateY(-4px); } }
  </style>
  <rect x="20" y="80" width="80" height="18" rx="3" fill="var(--diagram-ink)" opacity="0.4" class="layer"/>
  <rect x="20" y="58" width="80" height="18" rx="3" fill="var(--diagram-ink)" opacity="0.65" class="layer"/>
  <rect x="20" y="36" width="80" height="18" rx="3" fill="var(--diagram-ink)" opacity="0.9" class="layer"/>
  <text x="60" y="91" font-size="7" fill="white" text-anchor="middle">base layer</text>
  <text x="60" y="69" font-size="7" fill="white" text-anchor="middle">scroll layer</text>
  <text x="60" y="47" font-size="7" fill="white" text-anchor="middle">overlay layer</text>
  <text x="60" y="22" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">GPU composite</text>
  <line x1="60" y1="25" x2="60" y2="36" stroke="var(--diagram-ink)" stroke-width="1.5"/>
</svg>`,
    definition: `Compositing is the final stage of the rendering pipeline where the browser's compositor thread combines independently painted layer bitmaps into the final screen image. Certain CSS properties (transform, opacity, will-change) promote elements to their own compositor layers, allowing them to be moved or faded by the GPU without triggering layout or paint.\n\nComposited animations avoid the main thread entirely, which is why transform-based animations stay smooth even when JavaScript is busy. However, each layer consumes GPU memory, and too many layers cause memory pressure and slower composite times — a trade-off between paint isolation and resource cost.`,
    analogy: `Editing a Photoshop file: each layer can be moved independently without redrawing the whole canvas. But too many layers make the file slow to save and eat up RAM.`,
    examples: [
        { title: "Composited slide animation", text: "Animating transform: translateX() runs entirely on the compositor thread — no layout or paint — keeping the animation at 60fps even under main-thread load." },
        { title: "Layer explosion", text: "Applying will-change: transform to every list item in a 500-row list creates 500 GPU texture uploads, overwhelming VRAM on mobile devices." }
    ],
    useCases: ["Smooth scroll-linked parallax effects", "Fixed-position navigation bars", "CSS-based entrance animations for UI elements"],
    tradeoffs: {
        pros: ["Compositor-only animations are immune to main thread jank", "GPU can interpolate transforms at native refresh rates", "Layer promotion is transparent to layout and paint"],
        cons: ["Each layer allocates a GPU texture — memory adds up fast", "Over-promotion causes layer thrashing on low-end devices", "will-change hints must be removed after animation ends"]
    },
    related: ["gpu-acceleration-css", "paint-composite-layout", "css-containment", "layout-thrashing"]
},

{
    id: "paint-composite-layout",
    term: "Paint vs composite vs layout",
    tagline: "The three rendering stages and which CSS changes trigger each",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ring { animation: spin 2s linear infinite; transform-origin: 60px 60px; }
    .ring:nth-child(2) { animation-duration: 3s; animation-direction: reverse; }
  </style>
  <circle cx="60" cy="60" r="40" fill="none" stroke="var(--diagram-ink)" stroke-width="3" stroke-dasharray="10,5" class="ring"/>
  <circle cx="60" cy="60" r="25" fill="none" stroke="var(--diagram-ink)" stroke-width="2" stroke-dasharray="6,4" class="ring"/>
  <circle cx="60" cy="60" r="10" fill="var(--diagram-ink)"/>
  <text x="60" y="108" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">layout / paint / composite</text>
</svg>`,
    definition: `Layout, paint, and composite are the three phases of rendering, each triggered by different CSS property changes. Layout recalculates geometry when size or position changes (width, margin, top). Paint rasterises pixels when visual appearance changes without affecting geometry (color, background, box-shadow). Composite only moves or blends existing layer bitmaps when transform or opacity changes — the cheapest operation by far.\n\nTriggering layout also forces paint and composite. Triggering paint forces composite. CSS Triggers (now csstriggers.com archive) documents which properties hit which phases. Optimal animations touch only composite-stage properties.`,
    analogy: `Renovating a room: layout is moving walls (expensive, affects everything), paint is repainting a wall (moderate effort, contained), composite is rearranging furniture without touching the walls (fast, no structural work).`,
    examples: [
        { title: "Layout-triggering width change", text: "Animating width forces layout recalculation on every frame because the geometry of surrounding elements may change, making it expensive." },
        { title: "Composite-only opacity fade", text: "Animating opacity on a composited layer skips layout and paint entirely; the GPU adjusts the layer's alpha channel directly." }
    ],
    useCases: ["Choosing between left/top and transform for position animation", "Auditing CSS animations for jank", "Explaining why box-shadow animation is slower than opacity"],
    tradeoffs: {
        pros: ["Composite-only animations are the fastest possible path", "Understanding phases prevents accidental expensive animations", "Profiler flame charts directly show which phase was triggered"],
        cons: ["Not all desired effects are achievable with composite-only properties", "Developers must learn per-property cost tables", "Some browsers differ in which properties skip paint"]
    },
    related: ["browser-compositing", "gpu-acceleration-css", "layout-thrashing", "critical-rendering-path", "css-containment"]
},

{
    id: "gpu-acceleration-css",
    term: "GPU acceleration in CSS",
    tagline: "Offloading rendering work to the GPU via compositor layer promotion",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .glow { animation: glow 1s ease-in-out infinite alternate; }
    @keyframes glow { from { opacity: 0.5; } to { opacity: 1; } }
  </style>
  <rect x="20" y="30" width="80" height="60" rx="6" fill="none" stroke="var(--diagram-ink)" stroke-width="2"/>
  <rect x="28" y="38" width="64" height="44" rx="3" fill="var(--diagram-ink)" opacity="0.15"/>
  <text x="60" y="56" font-size="8" fill="var(--diagram-ink)" text-anchor="middle" class="glow">GPU</text>
  <text x="60" y="70" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">transform</text>
  <text x="60" y="82" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">opacity</text>
  <line x1="40" y1="100" x2="40" y2="108" stroke="var(--diagram-ink)" stroke-width="1.5"/>
  <line x1="60" y1="100" x2="60" y2="108" stroke="var(--diagram-ink)" stroke-width="1.5"/>
  <line x1="80" y1="100" x2="80" y2="108" stroke="var(--diagram-ink)" stroke-width="1.5"/>
</svg>`,
    definition: `GPU acceleration in CSS happens when the browser promotes an element to its own compositor layer and hands rendering of that layer to the GPU. The GPU can apply transforms and opacity changes by rearranging or blending texture quads at the hardware level, entirely bypassing the CPU-bound layout and paint stages.\n\nPromotion is triggered by animating transform or opacity, or by adding will-change: transform as a hint. The benefit is main-thread independence: GPU compositing continues even when JavaScript is executing heavy work. The cost is GPU memory for each layer texture, which can be significant on mobile.`,
    analogy: `Delegating a slide presentation to a projector — the projector handles zooming and fading slides without involving your laptop's CPU at all, as long as the slides are already uploaded.`,
    examples: [
        { title: "will-change hint", text: "Adding will-change: transform to an element before an animation starts lets the browser upload the layer texture to the GPU ahead of time, avoiding a jank spike at animation start." },
        { title: "3D transform hack", text: "Historically, translateZ(0) or translate3d(0,0,0) forced GPU promotion in older browsers as a hack before will-change existed." }
    ],
    useCases: ["Smooth entrance/exit animations for modals and panels", "Scroll-jacking effects where layers must move independently", "Video overlays that need opacity transitions"],
    tradeoffs: {
        pros: ["Compositor animations run at 60fps regardless of main thread load", "will-change allows pre-upload of textures before animation starts", "Eliminates paint work for opacity and transform changes"],
        cons: ["Each layer holds a full RGBA texture in GPU VRAM", "Over-promotion causes GPU memory exhaustion on mobile", "will-change must be removed post-animation or the layer stays promoted permanently"]
    },
    related: ["browser-compositing", "paint-composite-layout", "css-containment", "layout-thrashing"]
},

{
    id: "css-containment",
    term: "CSS containment",
    tagline: "Isolating subtrees so the browser can skip rendering work outside them",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .box { animation: contain 1.5s ease-in-out infinite alternate; }
    @keyframes contain { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 20; } }
  </style>
  <rect x="15" y="15" width="90" height="90" rx="6" fill="none" stroke="var(--diagram-ink)" stroke-width="2" stroke-dasharray="6,3" class="box"/>
  <rect x="25" y="25" width="30" height="30" rx="3" fill="var(--diagram-ink)" opacity="0.5"/>
  <rect x="65" y="25" width="30" height="30" rx="3" fill="var(--diagram-ink)" opacity="0.5"/>
  <rect x="25" y="65" width="30" height="30" rx="3" fill="var(--diagram-ink)" opacity="0.5"/>
  <rect x="65" y="65" width="30" height="30" rx="3" fill="var(--diagram-ink)" opacity="0.2"/>
  <text x="80" y="84" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">skip</text>
</svg>`,
    definition: `CSS containment (the contain property) lets developers declare that a subtree is independent from the rest of the document for layout, paint, style, or size calculations. The browser can skip re-rendering the contained subtree when changes happen outside it, and skip re-rendering the rest of the page when changes happen inside it.\n\nThe contain: content shorthand (combining layout and paint) is the most broadly useful value. It prevents overflow from affecting outside elements and isolates stacking contexts. contain: strict adds size containment, telling the browser the element's size is unaffected by its children — enabling more aggressive optimisations in virtualized lists.`,
    analogy: `Filing documents in labeled boxes: when you need to search for something, you only open the relevant box rather than emptying the entire cabinet.`,
    examples: [
        { title: "Virtualized list rows", text: "Applying contain: strict to each row in a virtual scroller tells the browser that row size changes don't affect siblings, enabling independent layout calculations." },
        { title: "Widget isolation", text: "contain: content on a third-party widget prevents its internal mutations from triggering style recalculations in the host page." }
    ],
    useCases: ["Large lists or grids with independent row content", "Embedded widgets or iframe-like components", "Frequently updating dashboard tiles that shouldn't invalidate surrounding layout"],
    tradeoffs: {
        pros: ["Reduces scope of layout and style recalculations", "content-visibility: auto combines containment with lazy rendering", "Zero JavaScript required — pure CSS optimization"],
        cons: ["contain: size requires knowing the element's size in advance", "Breaks some CSS features that depend on overflow or z-index stacking", "Browser support for all values is modern-only"]
    },
    related: ["layout-thrashing", "paint-composite-layout", "browser-compositing", "gpu-acceleration-css", "long-tasks"]
},

{
    id: "subpixel-rendering",
    term: "Subpixel rendering",
    tagline: "Using partial pixel positions for smoother rendering — and why it causes problems",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .pixel { animation: flicker 0.8s step-start infinite; }
    @keyframes flicker { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  </style>
  <rect x="10" y="10" width="14" height="14" fill="var(--diagram-ink)"/>
  <rect x="24" y="10" width="14" height="14" fill="var(--diagram-ink)" opacity="0.6" class="pixel"/>
  <rect x="38" y="10" width="14" height="14" fill="var(--diagram-ink)" opacity="0.3"/>
  <rect x="10" y="24" width="14" height="14" fill="var(--diagram-ink)" opacity="0.7"/>
  <rect x="24" y="24" width="14" height="14" fill="var(--diagram-ink)"/>
  <rect x="38" y="24" width="14" height="14" fill="var(--diagram-ink)" opacity="0.5" class="pixel"/>
  <text x="60" y="70" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">subpixel</text>
  <text x="60" y="82" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">anti-aliasing</text>
  <rect x="10" y="90" width="100" height="8" rx="2" fill="var(--diagram-ink)" opacity="0.2"/>
  <rect x="10" y="90" width="55" height="8" rx="2" fill="var(--diagram-ink)" opacity="0.6"/>
</svg>`,
    definition: `Subpixel rendering refers to positioning and sizing elements at non-integer pixel values (e.g., 10.5px). Browsers apply anti-aliasing to smooth the result, blending neighbouring pixels to approximate the fractional position. This produces sharper-looking text and lines on standard displays but can cause blurry edges, 1px alignment gaps, and inconsistent rendering across browsers.\n\nSubpixel positioning interacts with compositing layers in unexpected ways. When an element is promoted to a compositor layer, its position is snapped to an integer pixel boundary on some browsers, causing a visible jump. CSS transforms that result in fractional pixel values (like translateX(50%) on an odd-width container) are a common source of blurry images and hairline gaps.`,
    analogy: `Trying to hang a picture perfectly centred on a wall where the stud spacing doesn't divide evenly — you end up splitting the difference, and the result looks slightly off no matter which way you lean.`,
    examples: [
        { title: "Blurry image after centering", text: "An image inside a flexbox centered with margin: auto on a container with an odd pixel width ends up at a 0.5px offset, causing the browser to blur it to anti-alias the fractional position." },
        { title: "Hairline gaps in grids", text: "A CSS grid where column widths are calculated as percentages can produce 0.33px gaps between cells due to subpixel rounding differences across browsers." }
    ],
    useCases: ["Pixel-perfect icon alignment in SVG and canvas", "Diagnosing blurry images in responsive layouts", "Fixing hairline gaps in tile-based UI grids"],
    tradeoffs: {
        pros: ["Subpixel anti-aliasing produces smoother text on standard-DPI screens", "High-DPI (Retina) displays largely eliminate subpixel issues by having smaller physical pixels", "Understanding the issue helps write layouts that avoid it"],
        cons: ["Fractional positions cause blurring, not sharpness, for images and borders", "Behaviour varies between browsers and operating systems", "Fixes (like rounding to integers) can cause layout jitter during animation"]
    },
    related: ["browser-compositing", "paint-composite-layout", "gpu-acceleration-css", "cls"]
},

{
    id: "intersectionobserver",
    term: "IntersectionObserver internals",
    tagline: "How the browser detects element visibility without scroll event polling",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .elem { animation: slide 2s ease-in-out infinite alternate; }
    @keyframes slide { from { transform: translateY(0); } to { transform: translateY(-30px); } }
  </style>
  <rect x="20" y="20" width="80" height="80" rx="4" fill="none" stroke="var(--diagram-ink)" stroke-width="2"/>
  <text x="60" y="16" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">viewport</text>
  <rect x="30" y="50" width="60" height="25" rx="3" fill="var(--diagram-ink)" opacity="0.7" class="elem"/>
  <text x="60" y="66" font-size="7" fill="white" text-anchor="middle">observed element</text>
  <line x1="20" y1="60" x2="10" y2="60" stroke="var(--diagram-ink)" stroke-width="1.5" stroke-dasharray="3,2"/>
  <line x1="100" y1="60" x2="110" y2="60" stroke="var(--diagram-ink)" stroke-width="1.5" stroke-dasharray="3,2"/>
</svg>`,
    definition: `IntersectionObserver fires callbacks asynchronously when an observed element's intersection with the viewport (or a specified root element) crosses defined thresholds. Internally the browser batches intersection calculations on the main thread after layout, so callbacks are delivered once per frame at most — not on every scroll event tick.\n\nBecause the calculations are deferred and batched, IntersectionObserver is far cheaper than scroll listener polling. However, the asynchronous delivery means there is always a one-frame lag between the element entering the viewport and the callback firing. The root margin and threshold options let you trigger early (negative threshold, positive root margin) to pre-load content before it becomes visible.`,
    analogy: `A motion sensor on a door rather than a person watching through a peephole every second — the sensor triggers once on crossing the threshold, then resets, using no power between events.`,
    examples: [
        { title: "Lazy image loading", text: "Observing <img> elements with a rootMargin of '200px' fires the callback 200px before they enter the viewport, giving time to start the network request before the image is visible." },
        { title: "Infinite scroll trigger", text: "Observing a sentinel div at the bottom of a list fires once when it becomes visible, triggering the next page fetch without any scroll listener." }
    ],
    useCases: ["Lazy loading images and iframes below the fold", "Triggering CSS animations when elements scroll into view", "Implementing infinite scroll and ad viewability tracking"],
    tradeoffs: {
        pros: ["Zero cost between threshold crossings — no continuous polling", "Batched delivery prevents callback storms during fast scrolling", "root and rootMargin support nested scroll containers"],
        cons: ["One-frame lag makes it unsuitable for pixel-perfect scroll-linked effects", "Doesn't report exact intersection position, only threshold crossings", "Entries accumulate if the callback is slow, causing delayed processing"]
    },
    related: ["resizeobserver-loops", "mutationobserver-cost", "performanceobserver", "layout-thrashing", "long-tasks"]
},

{
    id: "resizeobserver-loops",
    term: "ResizeObserver loop limits",
    tagline: "Why ResizeObserver silently skips callbacks that would cause infinite resize loops",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .arrow { animation: rotate 2s linear infinite; transform-origin: 60px 60px; }
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  </style>
  <circle cx="60" cy="60" r="35" fill="none" stroke="var(--diagram-ink)" stroke-width="2" stroke-dasharray="8,4" class="arrow"/>
  <polygon points="60,25 55,35 65,35" fill="var(--diagram-ink)" class="arrow"/>
  <rect x="45" y="50" width="30" height="20" rx="3" fill="var(--diagram-ink)" opacity="0.7"/>
  <text x="60" y="64" font-size="7" fill="white" text-anchor="middle">resize</text>
  <line x1="60" y1="95" x2="60" y2="108" stroke="var(--diagram-ink)" stroke-width="2"/>
  <text x="60" y="118" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">loop blocked</text>
</svg>`,
    definition: `ResizeObserver delivers callbacks when an element's size changes. To prevent infinite loops — where a callback resizes the element, triggering another callback — the browser only delivers callbacks for elements deeper in the DOM tree than the shallowest element that triggered a resize in the same frame. Elements at a shallower depth are skipped and an error is thrown to the console: "ResizeObserver loop completed with undelivered notifications."\n\nThis is a safety mechanism, not a bug. The error means the observer and the callback are creating a resize cycle. The fix is to defer the resize-causing side effect using requestAnimationFrame, breaking the synchronous loop.`,
    analogy: `A thermostat that won't respond to its own heating output during the same cycle — it only reads the room temperature at the next check-in, preventing the heat from endlessly chasing its own tail.`,
    examples: [
        { title: "Chart re-render loop", text: "A ResizeObserver on a chart container that re-renders and changes the container's height inside the callback creates a loop. Wrapping the re-render in rAF defers it past the current frame." },
        { title: "Accordion height calculation", text: "Measuring an accordion panel's height inside a ResizeObserver then setting max-height on the same element triggers the loop error; reading before writing and using CSS transitions avoids it." }
    ],
    useCases: ["Responsive charts and data visualizations that resize with their containers", "Text overflow detection that truncates content based on available width", "Custom layout engines that compute element sizes at runtime"],
    tradeoffs: {
        pros: ["Built-in loop protection prevents browser freezes from naive implementations", "More reliable than polling offsetWidth in rAF loops", "Works across cross-origin iframes for contained elements"],
        cons: ["The loop error is confusing — it looks like a browser bug but is a code issue", "The depth-based delivery rule is subtle and poorly documented", "rAF deferral adds one frame of latency to size-dependent updates"]
    },
    related: ["intersectionobserver", "mutationobserver-cost", "layout-thrashing", "long-tasks"]
},

{
    id: "mutationobserver-cost",
    term: "MutationObserver cost",
    tagline: "The hidden overhead of watching the DOM for changes at scale",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .dot { animation: ping 1s ease-out infinite; }
    .dot:nth-child(2) { animation-delay: 0.3s; }
    .dot:nth-child(3) { animation-delay: 0.6s; }
    @keyframes ping { 0% { r: 3; opacity: 1; } 100% { r: 12; opacity: 0; } }
  </style>
  <rect x="40" y="45" width="40" height="30" rx="4" fill="var(--diagram-ink)"/>
  <text x="60" y="64" font-size="7" fill="white" text-anchor="middle">DOM</text>
  <circle cx="60" cy="60" r="3" fill="none" stroke="var(--diagram-ink)" stroke-width="1.5" class="dot"/>
  <circle cx="60" cy="60" r="3" fill="none" stroke="var(--diagram-ink)" stroke-width="1.5" class="dot"/>
  <circle cx="60" cy="60" r="3" fill="none" stroke="var(--diagram-ink)" stroke-width="1.5" class="dot"/>
  <text x="60" y="108" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">mutation records</text>
</svg>`,
    definition: `MutationObserver batches DOM mutation records and delivers them asynchronously via a microtask after the current task completes. The cost comes from two places: the browser must record and queue every mutation that matches the observer's configuration (subtree, childList, attributes, characterData), and the callback must process potentially large batches of records.\n\nObserving a large subtree with subtree: true and all mutation types is expensive — a single innerHTML replacement can generate thousands of records. The cost also grows if callbacks trigger further mutations, creating secondary batches. Fine-grained configuration (observing only what you need) and disconnecting observers when no longer needed are the primary mitigations.`,
    analogy: `Hiring a secretary to log every change to every document in a filing room — useful when targeted, but overwhelming if they're recording every Post-it adjustment in the whole building.`,
    examples: [
        { title: "Attribute watch on large table", text: "Observing attributes: true with subtree: true on a 1000-row table generates a record for every class change on every cell during a sort, flooding the callback queue." },
        { title: "Disconnecting after one-time detection", text: "A lazy-load observer that watches for an element to be added to the DOM should call observer.disconnect() inside the callback once the element is found." }
    ],
    useCases: ["Custom component lifecycle hooks that react to DOM insertion", "Third-party script sandboxing that watches for injected nodes", "Accessibility tools that announce dynamic content changes"],
    tradeoffs: {
        pros: ["Async microtask delivery avoids blocking rendering", "Batching reduces callback overhead compared to synchronous DOM events", "Works on shadow DOM subtrees unlike older mutation events"],
        cons: ["Broad subtree observation generates massive record volumes", "Callbacks are called after every microtask checkpoint — can delay rendering", "No built-in rate limiting; fast DOM mutations can deliver very large batches"]
    },
    related: ["intersectionobserver", "resizeobserver-loops", "performanceobserver", "long-tasks", "detached-dom-nodes"]
},

{
    id: "performanceobserver",
    term: "PerformanceObserver API",
    tagline: "Streaming access to browser performance timeline entries as they happen",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .tick { animation: draw 2s linear infinite; stroke-dasharray: 60; stroke-dashoffset: 60; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
  </style>
  <polyline points="10,90 25,70 40,80 55,50 70,60 85,30 100,40" fill="none" stroke="var(--diagram-ink)" stroke-width="2.5" class="tick"/>
  <line x1="10" y1="95" x2="110" y2="95" stroke="var(--diagram-ink)" stroke-width="1.5"/>
  <line x1="10" y1="10" x2="10" y2="95" stroke="var(--diagram-ink)" stroke-width="1.5"/>
  <text x="60" y="112" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">performance timeline</text>
</svg>`,
    definition: `PerformanceObserver subscribes to performance timeline entries as the browser generates them, rather than requiring a polling call to performance.getEntries(). It supports entry types including largest-contentful-paint, layout-shift, longtask, element, resource, navigation, and paint, among others.\n\nThe observer callback receives a PerformanceObserverEntryList with the new entries. Using buffered: true in the observe() options lets late-registering observers see entries that occurred before the observer was created — essential for LCP and CLS measurement, which begin immediately at page load.`,
    analogy: `Subscribing to a news feed instead of refreshing a news site every few seconds — entries arrive as events happen rather than requiring constant polling.`,
    examples: [
        { title: "Real user LCP measurement", text: "Observing largest-contentful-paint entries with buffered: true collects all candidate LCP elements from page load, letting you report the final LCP value after the user starts interacting." },
        { title: "Long task attribution", text: "Observing longtask entries captures script execution over 50ms with a TaskAttributionTiming entry that identifies the script source and container frame." }
    ],
    useCases: ["Real user monitoring (RUM) for Core Web Vitals", "Detecting long tasks caused by third-party scripts", "Building performance dashboards that track resource timing"],
    tradeoffs: {
        pros: ["Push-based delivery eliminates polling overhead", "buffered option captures entries before observer creation", "Unified API across all performance entry types"],
        cons: ["Some entry types (e.g., element timing) require explicit markup attributes to populate", "longtask attribution is coarse — identifies script URL, not call stack", "Not all entry types are supported in all browsers"]
    },
    related: ["long-tasks", "lcp", "cls", "inp", "fid", "intersectionobserver", "mutationobserver-cost"]
},

{
    id: "long-tasks",
    term: "Long tasks API",
    tagline: "Detecting JavaScript execution that blocks the main thread for over 50ms",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bar { animation: grow 1.5s ease-in-out infinite alternate; transform-origin: left center; }
    @keyframes grow { from { transform: scaleX(1); } to { transform: scaleX(1.3); } }
  </style>
  <rect x="10" y="30" width="40" height="12" rx="2" fill="var(--diagram-ink)" opacity="0.4"/>
  <rect x="10" y="50" width="90" height="12" rx="2" fill="var(--diagram-ink)" class="bar"/>
  <rect x="10" y="70" width="25" height="12" rx="2" fill="var(--diagram-ink)" opacity="0.4"/>
  <line x1="60" y1="20" x2="60" y2="95" stroke="var(--diagram-ink)" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="62" y="18" font-size="6" fill="var(--diagram-ink)">50ms</text>
  <text x="10" y="105" font-size="7" fill="var(--diagram-ink)">long task</text>
  <line x1="10" y1="95" x2="110" y2="95" stroke="var(--diagram-ink)" stroke-width="1.5"/>
</svg>`,
    definition: `The Long Tasks API (via PerformanceObserver with type 'longtask') reports any main thread task that takes longer than 50ms. Tasks longer than this block user input processing, causing FID and INP degradation. Each longtask entry includes a duration and a TaskAttributionTiming array that identifies the browsing context (script URL, iframe) responsible.\n\nLong tasks are typically caused by large synchronous JavaScript execution — parsing and executing large bundles, complex DOM operations, or synchronous data processing. The 50ms threshold corresponds to the human perception limit for input delay: tasks shorter than this feel instantaneous, tasks longer feel sluggish.`,
    analogy: `A customer service line where the agent handling the person ahead of you is on a 3-minute call — you're blocked no matter how simple your question is.`,
    examples: [
        { title: "Third-party script long task", text: "An analytics script that processes session replay data in a single synchronous chunk often shows up as a 200–400ms long task, delaying every user interaction during that window." },
        { title: "Bundle parse long task", text: "A large JavaScript bundle (>500KB uncompressed) triggers a long task during parse and compile on initial load, delaying Time to Interactive." }
    ],
    useCases: ["Identifying which scripts are causing input delay in real user sessions", "Setting performance budgets for JavaScript execution time", "Comparing long task frequency before and after code splitting"],
    tradeoffs: {
        pros: ["Directly correlates with user-perceived input delay", "TaskAttributionTiming helps pin blame on specific scripts", "buffered: true catches tasks that ran before observer setup"],
        cons: ["Attribution is script-level, not function-level — needs profiler for detail", "Tasks inside web workers are not reported", "Doesn't distinguish between types of work (parse vs. execution vs. forced layout)"]
    },
    related: ["inp", "fid", "performanceobserver", "layout-thrashing", "css-containment", "event-loop-tasks", "task-starvation"]
},

{
    id: "fid",
    term: "First Input Delay (FID)",
    tagline: "The delay between a user's first interaction and when the browser can respond",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cursor { animation: click 1.2s ease-in-out infinite; }
    @keyframes click { 0%,100% { transform: scale(1); } 50% { transform: scale(0.85); } }
  </style>
  <rect x="10" y="40" width="100" height="20" rx="3" fill="var(--diagram-ink)" opacity="0.2"/>
  <rect x="10" y="40" width="60" height="20" rx="3" fill="var(--diagram-ink)" opacity="0.6"/>
  <text x="40" y="54" font-size="7" fill="white" text-anchor="middle">input delay</text>
  <polygon points="80,70 75,85 80,82 80,95 85,95 85,82 90,85" fill="var(--diagram-ink)" class="cursor"/>
  <text x="60" y="112" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">FID measures first tap only</text>
</svg>`,
    definition: `First Input Delay measures the time from when a user first interacts with the page (click, tap, key press) to when the browser is able to begin processing that event handler. It does not measure how long the handler takes to run — only the waiting time caused by a busy main thread. FID is a field metric, measured only in real user sessions via the PerformanceObserver event entry type.\n\nFID was replaced by INP as a Core Web Vitals metric in March 2024. FID measured only the first interaction, which could be unrepresentative of overall responsiveness. A good FID is under 100ms; above 300ms is poor. Its replacement, INP, measures the worst interaction across the full session.`,
    analogy: `Pressing the elevator button and waiting for the button to light up — you've pressed it, but the elevator hasn't acknowledged yet because it's finishing a previous task.`,
    examples: [
        { title: "Blocked first click", text: "A user taps a button 2 seconds after load while a large script is still parsing — the click event is queued and FID is the duration of the remaining parse task." },
        { title: "First keypress delay", text: "Typing into an input field immediately after page load while an analytics initialization script is running produces FID equal to the script's remaining execution time." }
    ],
    useCases: ["Historical Core Web Vitals analysis (pre-March 2024)", "Correlating bundle size with interaction delay at page load", "Setting baseline for comparing INP migration impact"],
    tradeoffs: {
        pros: ["Simple to understand: one number representing first-interaction wait time", "Strongly correlated with user perception of page interactivity", "Collected automatically by web-vitals library"],
        cons: ["Only measures the first interaction — misses slow interactions later in session", "No lab equivalent — cannot be measured with Lighthouse", "Replaced by INP; measuring FID alone is insufficient for CWV compliance"]
    },
    related: ["inp", "long-tasks", "performanceobserver", "event-loop-tasks", "lcp"]
},

{
    id: "inp",
    term: "Interaction to Next Paint (INP)",
    tagline: "The worst interaction delay across a user's full session",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bar { animation: highlight 2s ease-in-out infinite; }
    @keyframes highlight { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
  </style>
  <rect x="10" y="80" width="15" height="15" rx="2" fill="var(--diagram-ink)" opacity="0.4"/>
  <rect x="30" y="70" width="15" height="25" rx="2" fill="var(--diagram-ink)" opacity="0.4"/>
  <rect x="50" y="50" width="15" height="45" rx="2" fill="var(--diagram-ink)" class="bar"/>
  <rect x="70" y="65" width="15" height="30" rx="2" fill="var(--diagram-ink)" opacity="0.4"/>
  <rect x="90" y="75" width="15" height="20" rx="2" fill="var(--diagram-ink)" opacity="0.4"/>
  <text x="57" y="42" font-size="6" fill="var(--diagram-ink)" text-anchor="middle">worst INP</text>
  <line x1="10" y1="95" x2="110" y2="95" stroke="var(--diagram-ink)" stroke-width="1.5"/>
  <text x="60" y="112" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">all interactions tracked</text>
</svg>`,
    definition: `Interaction to Next Paint measures the latency of every click, tap, and keyboard interaction during a page session, then reports the worst one (or near-worst, using the 98th percentile for pages with many interactions). It spans from the user's input event to the next paint commit — covering input delay, event handler execution, and rendering update time.\n\nINP replaced FID as a Core Web Vitals metric in March 2024. A good INP is under 200ms; above 500ms is poor. Because it captures the worst interaction, it is much harder to game than FID and better reflects the user's overall experience of a page's responsiveness throughout a session.`,
    analogy: `A restaurant rated not on the speed of taking your order, but on the slowest moment across the entire meal — any sluggish response at any point in the visit affects the score.`,
    examples: [
        { title: "Slow click handler", text: "A button that triggers a synchronous filter and re-render of a large list produces high INP because the main thread is blocked from painting until the filter completes." },
        { title: "Improving with scheduler", text: "Breaking the filter work into smaller chunks with scheduler.postTask() yields to the browser between chunks, allowing an intermediate paint and reducing INP." }
    ],
    useCases: ["Core Web Vitals compliance (replaced FID March 2024)", "Identifying specific interactions that cause session-level jank", "Prioritising rendering work in complex SPAs"],
    tradeoffs: {
        pros: ["Covers the full session, not just first interaction", "Correlates strongly with user satisfaction and task completion", "98th percentile approach is resistant to single outlier interactions"],
        cons: ["Harder to improve than FID — requires optimizing all slow interactions", "No single fix: may require code splitting, scheduler API, or React concurrent mode", "Lab simulation is approximate; real user sessions vary widely"]
    },
    related: ["fid", "long-tasks", "performanceobserver", "scheduler-priorities", "concurrent-rendering", "event-loop-tasks"]
},

{
    id: "cls",
    term: "Cumulative Layout Shift (CLS)",
    tagline: "A score measuring unexpected visual instability during page load and use",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .svg-shift { animation: shift 1.5s ease-in-out infinite alternate; }
    @keyframes shift { from { transform: translateY(0); } to { transform: translateY(20px); } }
  </style>
  <rect x="15" y="20" width="90" height="15" rx="3" fill="var(--diagram-ink)" opacity="0.5"/>
  <rect x="15" y="42" width="60" height="12" rx="3" fill="var(--diagram-ink)" opacity="0.5"/>
  <rect x="15" y="60" width="90" height="20" rx="3" fill="var(--diagram-ink)" class="svg-shift"/>
  <rect x="15" y="88" width="70" height="12" rx="3" fill="var(--diagram-ink)" opacity="0.3"/>
  <line x1="112" y1="60" x2="112" y2="80" stroke="var(--diagram-ink)" stroke-width="1.5" marker-end="url(#arr2)"/>
  <text x="60" y="112" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">unexpected shift</text>
</svg>`,
    definition: `Cumulative Layout Shift scores visual instability by summing the impact of unexpected layout shifts throughout the page's life. Each shift is scored as the product of the impact fraction (proportion of viewport affected) and the distance fraction (how far elements moved). Only shifts without a 500ms user-input grace period count — scrolling and intentional interactions are excluded.\n\nCLS is a Core Web Vitals metric. A good score is under 0.1; above 0.25 is poor. Common causes include images and embeds without explicit dimensions, dynamically injected banners, web fonts causing FOUT that shifts text, and late-loading ads that push content down.`,
    analogy: `Reading a book where someone keeps quietly swapping pages beneath your finger while you read — your place jumps and you lose context, even if the content itself is unchanged.`,
    examples: [
        { title: "Image without dimensions", text: "An <img> without width and height attributes causes a layout shift when it loads, because the browser couldn't reserve space for it during initial layout." },
        { title: "Late-injected cookie banner", text: "A cookie consent bar injected after the DOM loads pushes all page content down, generating a CLS score proportional to the bar's height and the amount of viewport content it displaces." }
    ],
    useCases: ["Auditing e-commerce pages where late-loading product images cause shift", "Fixing ad slots that resize after initial render", "Diagnosing font-swap CLS from web font loading"],
    tradeoffs: {
        pros: ["Directly measurable in lab and field", "Most causes are fixable with CSS (aspect-ratio, explicit dimensions, font-display: optional)", "Lighthouse flags specific elements contributing to CLS"],
        cons: ["Animated transforms that move content score 0 even if visually jarring", "The 500ms input grace window can mask real UX issues after interactions", "Score is session-wide, so a single bad ad can dominate an otherwise stable page"]
    },
    related: ["lcp", "inp", "performanceobserver", "layout-thrashing", "subpixel-rendering", "critical-rendering-path"]
},

{
    id: "lcp",
    term: "Largest Contentful Paint (LCP)",
    tagline: "When the largest visible content element finishes rendering",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .reveal { animation: wipe 2s ease-in-out infinite; clip-path: inset(0 100% 0 0); }
    @keyframes wipe { 0% { clip-path: inset(0 100% 0 0); } 80%,100% { clip-path: inset(0 0% 0 0); } }
  </style>
  <rect x="10" y="10" width="100" height="70" rx="4" fill="var(--diagram-ink)" opacity="0.15"/>
  <rect x="10" y="10" width="100" height="70" rx="4" fill="var(--diagram-ink)" opacity="0.6" class="reveal"/>
  <text x="60" y="50" font-size="9" fill="white" text-anchor="middle">hero image</text>
  <rect x="10" y="88" width="60" height="8" rx="2" fill="var(--diagram-ink)" opacity="0.4"/>
  <rect x="10" y="100" width="40" height="8" rx="2" fill="var(--diagram-ink)" opacity="0.3"/>
</svg>`,
    definition: `Largest Contentful Paint marks the time when the largest image, video poster, or block-level text element visible in the viewport finishes rendering. The browser continuously updates the LCP candidate as larger elements load; the final value is recorded when the user first interacts or the page is backgrounded. LCP is the primary Core Web Vitals metric for perceived load speed.\n\nA good LCP is under 2.5 seconds; above 4 seconds is poor. Common causes of poor LCP include render-blocking resources delaying the critical path, server slow TTFB, unoptimised hero images, and client-side rendering requiring JavaScript execution before the element appears.`,
    analogy: `The moment a cinema screen is fully lit with the opening frame — everything before that is darkness and anticipation, and the audience judges how quickly the show started based on that moment.`,
    examples: [
        { title: "Hero image LCP", text: "A <img> hero photo above the fold is typically the LCP element. Adding fetchpriority='high' and preloading the image URL in <head> moves the network request earlier in the waterfall." },
        { title: "SSR vs CSR LCP", text: "A server-rendered page delivers the LCP element in initial HTML; a client-rendered equivalent must download, parse, and execute JavaScript before the element appears, increasing LCP by hundreds of milliseconds." }
    ],
    useCases: ["Core Web Vitals field score improvement for Google Search ranking", "Measuring impact of CDN or image optimisation changes on real users", "Comparing SSR and CSR rendering strategies for content-heavy pages"],
    tradeoffs: {
        pros: ["Correlates strongly with user perception of page load speed", "Measurable in both lab (Lighthouse) and field (CrUX)", "fetchpriority=high and preload <link> directly address LCP resource delay"],
        cons: ["LCP candidate can change as page loads, making attribution complex", "Text-based LCP elements are hard to optimize beyond server response time", "Client-rendered pages have structurally poor LCP without SSR or streaming"]
    },
    related: ["cls", "inp", "fid", "critical-rendering-path", "render-blocking", "performanceobserver", "streaming-ssr", "speculative-prerendering"]
},

{
    id: "speculative-prerendering",
    term: "Speculative prerendering",
    tagline: "Pre-loading and pre-rendering the next page before the user navigates",
    category: "performance",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ghost { animation: fade 2s ease-in-out infinite alternate; }
    @keyframes fade { from { opacity: 0.15; } to { opacity: 0.55; } }
  </style>
  <rect x="10" y="20" width="45" height="70" rx="4" fill="var(--diagram-ink)"/>
  <text x="32" y="58" font-size="7" fill="white" text-anchor="middle">current</text>
  <rect x="65" y="20" width="45" height="70" rx="4" fill="var(--diagram-ink)" class="ghost"/>
  <text x="87" y="58" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">next page</text>
  <line x1="55" y1="55" x2="65" y2="55" stroke="var(--diagram-ink)" stroke-width="2" stroke-dasharray="3,2"/>
  <polygon points="63,51 63,59 70,55" fill="var(--diagram-ink)"/>
</svg>`,
    definition: `Speculative prerendering uses the browser's Speculation Rules API (or legacy rel=prerender) to fully load and render a likely next page in a hidden browsing context before the user clicks. When the user does navigate, the pre-rendered page activates instantly — appearing to load in near-zero milliseconds.\n\nThe Speculation Rules API (Chrome 108+) replaces the unreliable link rel=prerender with a JSON-based rule set that supports eagerness levels (immediate, eager, moderate, conservative) and URL matching. Unlike prefetch, which only downloads resources, prerender executes JavaScript and runs the full page lifecycle, so it must only be used for pages the user is highly likely to visit.`,
    analogy: `A hotel that has your room completely made up and your preferred temperature set before you even check in, based on your booking history — you walk in and it's immediately ready.`,
    examples: [
        { title: "Speculation Rules for search results", text: "Adding a speculation rules script that prerenders the top search result URL on hover reduces navigation latency to near-zero for users who click the first result." },
        { title: "Eager prerender for single next step", text: "A multi-step checkout where 95% of users proceed to the next step is an ideal candidate for eager prerender — the next step loads before the user clicks." }
    ],
    useCases: ["E-commerce product pages linked from a category listing", "Documentation sites with strong sequential reading patterns", "Single-funnel flows like onboarding or checkout"],
    tradeoffs: {
        pros: ["Effectively eliminates navigation latency for predicted pages", "Speculation Rules API supports fine-grained eagerness and URL matching", "Activates instantly on navigation — no visible load time"],
        cons: ["Wastes bandwidth and CPU if the user doesn't navigate to the prerendered page", "JavaScript runs in the hidden context — analytics and side effects must handle prerender activation", "Chrome-only (as of 2025); other browsers support prefetch but not full prerender"]
    },
    related: ["critical-rendering-path", "render-blocking", "lcp", "preload-prefetch-preconnect", "service-worker-lifecycle"]
},
// ── Bundling & modules (5) ──────────────────────────────────────────────────

{
    id: "tree-shaking",
    term: "Tree shaking internals",
    tagline: "Removing dead exports from a bundle at build time",
    category: "bundling",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes shake{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}</style><g style="transform-origin:60px 60px;animation:shake 2s ease-in-out infinite"><polygon points="60,12 90,55 75,55 88,85 65,85 65,108 55,108 55,85 32,85 45,55 30,55" fill="var(--diagram-ink)" opacity="0.85"/><line x1="38" y1="42" x2="25" y2="30" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.5"/><line x1="82" y1="42" x2="95" y2="30" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.5"/><circle cx="22" cy="27" r="5" fill="var(--diagram-ink)" opacity="0.4"/><circle cx="98" cy="27" r="5" fill="var(--diagram-ink)" opacity="0.4"/></g></svg>`,
    definition: `Tree shaking is a dead-code elimination technique used by bundlers like Rollup and webpack to remove exports that are never imported anywhere in the application. It relies on the static structure of ES modules — \`import\` and \`export\` statements must appear at the top level, which lets the bundler build a complete dependency graph before executing any code.\n\nFor tree shaking to work, modules must be marked as side-effect-free (via \`"sideEffects": false\` in package.json), written as ES modules rather than CommonJS, and their exports must not be accessed dynamically. Bundlers mark unreachable exports, then minifiers like Terser strip them. CommonJS and dynamic property access both defeat this analysis.`,
    analogy: `It's like shaking a real tree — only the leaves that aren't firmly attached fall off. Dead exports are the loose leaves: if nothing holds onto them (imports them), they drop out of the final bundle. Leaves with strong connections (actual usages) stay attached.`,
    examples: [
        { title: "Named export elimination", text: "A utility library exports 40 helpers but your app only imports 3. With proper ES module authoring and sideEffects:false, the bundler emits only those 3 functions — the other 37 never appear in the output." },
        { title: "CommonJS defeats tree shaking", text: "Importing from a CJS module like `const _ = require('lodash')` bundles the entire library because bundlers can't statically determine which properties are used at runtime." }
    ],
    useCases: [
        "Reducing bundle size when using large utility libraries with named exports",
        "Library authoring — shipping ES module builds so consumers can tree-shake your code",
        "Auditing dead code in a codebase by checking what a bundler eliminates"
    ],
    tradeoffs: {
        pros: [
            "Can dramatically shrink bundle size with minimal developer effort",
            "Works automatically once modules are authored correctly",
            "Combines well with code splitting for further size reduction"
        ],
        cons: [
            "Side-effectful modules (CSS-in-JS, polyfills) break the analysis and must be explicitly marked",
            "CommonJS interop prevents elimination — many npm packages still ship only CJS",
            "Dynamic access patterns like `obj[key]` prevent the static analysis tree shaking needs"
        ]
    },
    related: ["code-splitting", "dynamic-import", "module-federation"]
},

{
    id: "code-splitting",
    term: "Code splitting strategies",
    tagline: "Dividing a bundle into chunks loaded on demand",
    category: "bundling",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes split{0%,100%{transform:translateX(0)}50%{transform:translateX(8px)}}@keyframes splitL{0%,100%{transform:translateX(0)}50%{transform:translateX(-8px)}}</style><rect x="20" y="20" width="80" height="30" rx="4" fill="var(--diagram-ink)" opacity="0.8"/><rect x="20" y="65" width="36" height="22" rx="4" fill="var(--diagram-ink)" opacity="0.7" style="transform-origin:38px 76px;animation:splitL 2s ease-in-out infinite"/><rect x="64" y="65" width="36" height="22" rx="4" fill="var(--diagram-ink)" opacity="0.7" style="transform-origin:82px 76px;animation:split 2s ease-in-out infinite"/><rect x="20" y="95" width="16" height="14" rx="3" fill="var(--diagram-ink)" opacity="0.5" style="transform-origin:28px 102px;animation:splitL 2s ease-in-out infinite"/><rect x="40" y="95" width="16" height="14" rx="3" fill="var(--diagram-ink)" opacity="0.5" style="transform-origin:48px 102px;animation:splitL 2.2s ease-in-out infinite"/><rect x="64" y="95" width="16" height="14" rx="3" fill="var(--diagram-ink)" opacity="0.5" style="transform-origin:72px 102px;animation:split 2s ease-in-out infinite"/><rect x="84" y="95" width="16" height="14" rx="3" fill="var(--diagram-ink)" opacity="0.5" style="transform-origin:92px 102px;animation:split 2.2s ease-in-out infinite"/></svg>`,
    definition: `Code splitting breaks a monolithic JavaScript bundle into smaller chunks that can be loaded independently. The browser only downloads the code it needs for the current view, reducing initial parse and execution time. Bundlers support several splitting strategies: route-based (a chunk per page), component-based (lazy-load heavy UI), and vendor splitting (third-party libraries in a separate long-cached chunk).\n\nEffective splitting requires understanding the dependency graph. Splitting too aggressively creates waterfall requests; splitting too coarsely wastes the gain. Most frameworks handle route-level splitting automatically; component-level splitting is done manually with \`React.lazy\` or equivalent. Preloading adjacent route chunks on hover bridges the gap between lazy loading and perceived speed.`,
    analogy: `Think of a restaurant menu split into sections — appetizers, mains, desserts. You don't need to read the dessert section to order a starter. Code splitting lets the browser fetch only the "section" it needs right now, then grab others when the user navigates there.`,
    examples: [
        { title: "Route-based splitting in Next.js", text: "Each page component in a Next.js app automatically becomes its own chunk. Navigating to /dashboard only downloads dashboard code — the /settings chunk stays unloaded until needed." },
        { title: "Heavy component lazy loading", text: "A rich text editor imported via React.lazy loads its chunk only when the user opens an editor pane. The landing page parse time drops because the editor's dependencies never load on initial visit." }
    ],
    useCases: [
        "Improving initial load time for large single-page applications",
        "Separating rarely-visited admin or settings pages from the critical path",
        "Isolating third-party vendor libraries into a separately-cached chunk"
    ],
    tradeoffs: {
        pros: [
            "Reduces initial bundle parse and execution time",
            "Enables parallel chunk downloads in HTTP/2 environments",
            "Vendor chunks cache independently across deployments"
        ],
        cons: [
            "Too many small chunks can increase request overhead, especially on HTTP/1.1",
            "Lazy-loaded chunks cause a visible loading state unless preloaded",
            "Chunk boundary decisions require ongoing tuning as the app grows"
        ]
    },
    related: ["tree-shaking", "dynamic-import", "render-blocking", "preload-prefetch-preconnect"]
},

{
    id: "dynamic-import",
    term: "Dynamic import chunking",
    tagline: "Using import() to load modules at runtime and control chunk boundaries",
    category: "bundling",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes drop{0%{transform:translateY(-18px);opacity:0}60%{opacity:1}100%{transform:translateY(0);opacity:1}}</style><rect x="30" y="65" width="60" height="40" rx="5" fill="var(--diagram-ink)" opacity="0.75"/><rect x="42" y="75" width="36" height="6" rx="2" fill="var(--diagram-ink)" opacity="0.35"/><rect x="42" y="87" width="24" height="6" rx="2" fill="var(--diagram-ink)" opacity="0.35"/><g style="animation:drop 2s ease-in-out infinite"><polygon points="60,15 72,38 66,38 66,58 54,58 54,38 48,38" fill="var(--diagram-ink)" opacity="0.9"/></g></svg>`,
    definition: `The dynamic \`import()\` expression is a browser-native API that returns a Promise resolving to a module's exports. Unlike static \`import\` declarations, it can appear anywhere in code and accept runtime-computed paths. Bundlers detect \`import()\` calls and automatically create a separate chunk for the imported module and all its dependencies, which the browser fetches only when that call executes.\n\nThe chunk boundary is implicit — whatever you put inside \`import()\` becomes the root of a new chunk. Bundler magic comments like \`/* webpackChunkName: "editor" */\` and \`/* @vite-ignore */\` let you name chunks or suppress warnings. Misuse — such as calling \`import()\` inside a loop with dynamic keys — generates one chunk per unique path and can balloon the number of network requests.`,
    analogy: `It's like ordering a book from a library rather than carrying the whole library in your bag. You walk in with just what you need, and only retrieve the specific volume when you're ready to read it. The library (bundler) already split the collection into individual books (chunks) so retrieval is fast.`,
    examples: [
        { title: "React.lazy under the hood", text: "React.lazy(() => import('./HeavyChart')) wraps the dynamic import in a Suspense-aware wrapper. The bundler splits HeavyChart and all its dependencies into a separate chunk fetched only when the component first renders." },
        { title: "Conditional feature loading", text: "A map feature only used by logged-in users can be loaded with `if (user.hasMapAccess) { const { Map } = await import('./MapFeature') }` — anonymous visitors never download map code." }
    ],
    useCases: [
        "Lazy-loading heavy UI components that are not needed on initial render",
        "Loading polyfills conditionally only for browsers that need them",
        "Feature-flagging large modules so only eligible users pay the download cost"
    ],
    tradeoffs: {
        pros: [
            "Natively supported in modern browsers — no bundler required for the split itself",
            "Precise control over exactly when a module loads",
            "Works well with Suspense and loading-state patterns"
        ],
        cons: [
            "Creates a network waterfall if the trigger is itself inside a lazy-loaded component",
            "Dynamic string expressions in import() prevent static analysis and chunk naming",
            "Each split point adds at least one additional round trip on a cold cache"
        ]
    },
    related: ["code-splitting", "tree-shaking", "render-blocking", "preload-prefetch-preconnect", "suspense-boundaries"]
},

{
    id: "module-federation",
    term: "Module federation",
    tagline: "Sharing live code between separately deployed JavaScript applications at runtime",
    category: "bundling",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes pulse{0%,100%{r:5}50%{r:7}}</style><circle cx="60" cy="60" r="10" fill="var(--diagram-ink)" opacity="0.9"/><circle cx="20" cy="30" r="8" fill="var(--diagram-ink)" opacity="0.7"/><circle cx="100" cy="30" r="8" fill="var(--diagram-ink)" opacity="0.7"/><circle cx="20" cy="90" r="8" fill="var(--diagram-ink)" opacity="0.7"/><circle cx="100" cy="90" r="8" fill="var(--diagram-ink)" opacity="0.7"/><line x1="28" y1="35" x2="52" y2="54" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.5"/><line x1="92" y1="35" x2="68" y2="54" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.5"/><line x1="28" y1="85" x2="52" y2="66" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.5"/><line x1="92" y1="85" x2="68" y2="66" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.5"/><circle cx="60" cy="60" r="5" fill="var(--diagram-ink)" style="animation:pulse 2s ease-in-out infinite"/></svg>`,
    definition: `Module Federation, introduced in webpack 5, allows independently deployed JavaScript applications to expose and consume each other's modules at runtime. Each app declares what it shares (remotes) and what it exposes (modules), and the consuming app fetches those chunks directly from the provider's CDN or server — no re-bundling required. This makes it possible to update a shared component in one app without redeploying all consumers.\n\nFederation is the primary technical mechanism behind many micro-frontend architectures. Shared dependencies (like React) can be declared as singletons to prevent version conflicts and duplicate downloads. The main challenge is version negotiation: mismatched shared library versions can silently load two copies or throw at runtime if strict version ranges are configured.`,
    analogy: `It's like a network of stores that share a common stockroom. Each store manages its own storefront, but they all pull certain products from the same central warehouse rather than stocking their own copies. Restocking the warehouse updates every store simultaneously.`,
    examples: [
        { title: "Shared design system", text: "A company's header and nav component is maintained in one repo, exposed as a federated module, and consumed by five separate product apps. Updating the nav in the host app immediately changes the nav in all consumers without any redeployment." },
        { title: "Independent team deploys", text: "A checkout app team deploys their widget independently and exposes it as a remote. The shell app fetches the checkout chunk at runtime — teams ship on their own schedules with no build-time coupling." }
    ],
    useCases: [
        "Micro-frontend architectures where teams deploy independently",
        "Sharing a design system or component library across multiple apps without npm publish cycles",
        "A/B testing different implementations of a module served from different remotes"
    ],
    tradeoffs: {
        pros: [
            "Enables true independent deployment for different parts of a large frontend",
            "Shared singletons prevent duplicate React or other framework instances",
            "No need to republish npm packages to propagate shared component updates"
        ],
        cons: [
            "Runtime errors can occur if a remote is unavailable or returns an incompatible module",
            "Version mismatches in shared dependencies are subtle and hard to debug",
            "Increases operational complexity — each remote is now a runtime dependency"
        ]
    },
    related: ["code-splitting", "dynamic-import", "micro-frontends", "tree-shaking"]
},

{
    id: "webassembly",
    term: "WebAssembly integration",
    tagline: "Running near-native binary code in the browser alongside JavaScript",
    category: "bundling",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes scan{0%{transform:translateY(0)}50%{transform:translateY(50px)}100%{transform:translateY(0)}}</style><rect x="18" y="18" width="84" height="84" rx="6" fill="none" stroke="var(--diagram-ink)" stroke-width="4" opacity="0.7"/><text x="28" y="52" font-family="monospace" font-size="13" fill="var(--diagram-ink)" opacity="0.9">01 10</text><text x="28" y="68" font-family="monospace" font-size="13" fill="var(--diagram-ink)" opacity="0.9">11 00</text><text x="28" y="84" font-family="monospace" font-size="13" fill="var(--diagram-ink)" opacity="0.9">10 01</text><rect x="18" y="18" width="84" height="6" rx="3" fill="var(--diagram-ink)" opacity="0.35" style="animation:scan 3s ease-in-out infinite"/></svg>`,
    definition: `WebAssembly (Wasm) is a binary instruction format that browsers execute at near-native speed inside a sandboxed virtual machine. Code written in C, C++, Rust, Go, or other compiled languages is compiled to a \`.wasm\` binary, which the browser loads via the \`WebAssembly\` JS API or \`<script type="module">\`. Wasm modules export functions that JavaScript can call directly, and vice versa.\n\nIntegrating Wasm into a frontend build requires a toolchain step (Emscripten for C/C++, wasm-pack for Rust) to produce the \`.wasm\` file plus a JS glue file. Modern bundlers like webpack and Vite treat \`.wasm\` as a module type and handle the async instantiation. The performance gain is most pronounced for CPU-bound tasks — image processing, codecs, cryptography, physics simulations — but Wasm has no direct DOM access and must communicate with JS through its linear memory.`,
    analogy: `It's like hiring a specialist contractor for a task your general crew isn't fast at. JavaScript handles the overall project coordination, but when you need a wall drilled through concrete, the Wasm specialist does that part in a fraction of the time.`,
    examples: [
        { title: "Image codec in the browser", text: "Squoosh uses a Wasm-compiled image encoder to run AVIF and WebP compression fully client-side at speeds comparable to native tooling, without any server round trip." },
        { title: "Rust-powered parser", text: "A markdown editor compiles its parsing and syntax-highlighting logic to Wasm via wasm-pack. Keypress-to-highlight latency drops from ~40ms (JS) to ~4ms on large documents." }
    ],
    useCases: [
        "CPU-intensive tasks: image/video processing, audio codecs, compression, cryptography",
        "Porting existing native libraries (FFmpeg, SQLite, OpenCV) to run in the browser",
        "Game engines and physics simulations that require deterministic, high-throughput computation"
    ],
    tradeoffs: {
        pros: [
            "Executes at near-native speed for compute-bound workloads",
            "Sandboxed — no direct filesystem or OS access beyond what JS grants it",
            "Language-agnostic: reuse existing C/C++/Rust libraries without rewriting in JS"
        ],
        cons: [
            "No direct DOM access — all UI interaction must go through a JS bridge, adding overhead",
            "Binary format is opaque — debugging requires source maps and specialized devtools",
            "Toolchain complexity is high; build times grow with large native codebases"
        ]
    },
    related: ["code-splitting", "dynamic-import", "offscreencanvas", "workers-vs-service-workers"]
},

// ── Data & caching (14) ─────────────────────────────────────────────────────

{
    id: "indexeddb",
    term: "IndexedDB",
    tagline: "A low-level transactional key-value store built into the browser",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes stack{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}</style><ellipse cx="60" cy="32" rx="38" ry="12" fill="var(--diagram-ink)" opacity="0.8"/><rect x="22" y="32" width="76" height="18" fill="var(--diagram-ink)" opacity="0.65"/><ellipse cx="60" cy="50" rx="38" ry="12" fill="var(--diagram-ink)" opacity="0.65"/><rect x="22" y="50" width="76" height="18" fill="var(--diagram-ink)" opacity="0.5"/><ellipse cx="60" cy="68" rx="38" ry="12" fill="var(--diagram-ink)" opacity="0.5"/><rect x="22" y="68" width="76" height="18" fill="var(--diagram-ink)" opacity="0.35"/><ellipse cx="60" cy="86" rx="38" ry="12" fill="var(--diagram-ink)" opacity="0.35" style="animation:stack 2s ease-in-out infinite"/></svg>`,
    definition: `IndexedDB is a browser-native object store for structured data. Unlike localStorage, it holds arbitrary JavaScript values (including Blobs and ArrayBuffers), supports indexes for fast queries, and wraps every operation in ACID transactions. Storage quotas are generous — typically 50–80% of available disk — making it suitable for caching API responses, storing user-generated content, and enabling offline-first apps.\n\nAll IndexedDB operations are asynchronous and callback-based in the raw API, which makes it verbose. Libraries like Dexie.js or idb provide Promise-based wrappers. Schema migrations happen through the \`onupgradeneeded\` event, which fires only when the database version number increases. Failing to handle version upgrades correctly can leave users with a corrupted or inaccessible database across app updates.`,
    analogy: `Think of IndexedDB as a filing cabinet inside the browser. Each drawer (object store) holds folders (records) you can label with indexes for quick retrieval. Unlike a sticky note (localStorage), the cabinet can hold whole documents, photos, and binary files.`,
    examples: [
        { title: "Offline document cache", text: "A note-taking app stores all notes in IndexedDB on every save. When the user opens the app offline, it reads directly from the local store and queues sync operations for when connectivity returns." },
        { title: "Large dataset pagination", text: "A data tool caches a 50MB JSON dataset in IndexedDB after the first fetch. Subsequent sessions skip the network and query the local index directly, reducing load time from 3s to under 100ms." }
    ],
    useCases: [
        "Offline-first applications that need to persist structured data between sessions",
        "Caching large API payloads or binary assets (images, PDFs) to avoid repeat fetches",
        "Storing user preferences, draft content, or form state that survives page reload"
    ],
    tradeoffs: {
        pros: [
            "Large storage quota with support for binary data and complex object types",
            "Transactional — concurrent reads/writes are safe and consistent",
            "Available in workers, enabling background sync without blocking the main thread"
        ],
        cons: [
            "Raw API is verbose and callback-heavy; always use a wrapper library in production",
            "Blocked by same-origin policy — inaccessible across subdomains without deliberate setup",
            "Schema migrations require careful versioning or users may lose their local data"
        ]
    },
    related: ["service-worker-lifecycle", "cache-invalidation", "offline-conflict", "stale-while-revalidate"]
},

{
    id: "service-worker-lifecycle",
    term: "Service worker lifecycle traps",
    tagline: "The install, activate, and fetch phases that trip up most implementations",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style><circle cx="60" cy="60" r="28" fill="none" stroke="var(--diagram-ink)" stroke-width="5" opacity="0.7" stroke-dasharray="44 44" style="animation:spin 4s linear infinite;transform-origin:60px 60px"/><circle cx="60" cy="60" r="12" fill="var(--diagram-ink)" opacity="0.8"/><circle cx="60" cy="32" r="6" fill="var(--diagram-ink)" opacity="0.9"/><circle cx="83" cy="74" r="6" fill="var(--diagram-ink)" opacity="0.9"/><circle cx="37" cy="74" r="6" fill="var(--diagram-ink)" opacity="0.9"/></svg>`,
    definition: `A service worker moves through three lifecycle phases: install, activate, and fetch interception. The most common trap is the waiting state — a new service worker installs but won't activate until all tabs using the old worker are closed, because the old worker holds a claim over open clients. Calling \`self.skipWaiting()\` in the install event bypasses this, but can cause a client running old app code to receive responses cached by new worker logic.\n\nA second trap is stale cache on activation: the activate phase is the correct place to delete old caches (not install), because other open tabs may still need the old cache until they reload. A third trap is scope — a worker registered at \`/admin/sw.js\` only intercepts requests under \`/admin/\`. Missing the correct scope silently leaves requests unintercepted with no error.`,
    analogy: `It's like rotating security guards at a building. The new guard (install) arrives and waits in the lobby. The old guard stays on duty until all visitors from their shift leave. Only then does the new guard take over (activate) and change the access rules.`,
    examples: [
        { title: "skipWaiting mismatch", text: "An app deploys a new worker that changes cache key prefixes. Using skipWaiting activates it immediately, but tabs still running old HTML request cached assets under old keys — they get fetch misses and broken pages until reloaded." },
        { title: "Cache cleanup timing", text: "Deleting old caches in the install phase causes active tabs to lose their cached assets mid-session. Moving the cleanup to activate ensures old caches persist until the new worker fully takes control." }
    ],
    useCases: [
        "Offline-first PWAs that need to serve cached assets when the network is unavailable",
        "Background sync: queuing failed requests during offline periods and replaying them on reconnect",
        "Push notifications: keeping the worker registered to receive push events even when the app is closed"
    ],
    tradeoffs: {
        pros: [
            "Full control over request interception, caching strategy, and offline fallbacks",
            "Runs in a separate thread — caching logic never blocks the main thread",
            "Enables background sync and push notifications independent of app lifetime"
        ],
        cons: [
            "Lifecycle complexity is high — waiting, claiming, and scope bugs are easy to introduce silently",
            "Requires HTTPS (or localhost) — can't be tested over plain HTTP in production",
            "Stale service worker bugs are hard to reproduce locally but common in production deploys"
        ]
    },
    related: ["cache-invalidation", "stale-while-revalidate", "indexeddb", "offline-conflict", "workers-vs-service-workers"]
},

{
    id: "cache-invalidation",
    term: "Cache invalidation strategies",
    tagline: "Deciding when cached data is stale enough to discard or refresh",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes cross{0%,100%{opacity:1}50%{opacity:0.3}}</style><rect x="20" y="25" width="80" height="55" rx="6" fill="var(--diagram-ink)" opacity="0.6"/><rect x="30" y="35" width="60" height="8" rx="3" fill="var(--diagram-ink)" opacity="0.35"/><rect x="30" y="49" width="40" height="8" rx="3" fill="var(--diagram-ink)" opacity="0.35"/><line x1="75" y1="65" x2="100" y2="95" stroke="var(--diagram-ink)" stroke-width="5" stroke-linecap="round" opacity="0.8" style="animation:cross 2s ease-in-out infinite"/><line x1="100" y1="65" x2="75" y2="95" stroke="var(--diagram-ink)" stroke-width="5" stroke-linecap="round" opacity="0.8" style="animation:cross 2s ease-in-out infinite"/></svg>`,
    definition: `Cache invalidation decides when a stored response should be considered stale and replaced. The main strategies are: time-based expiry (TTL), where the cache discards entries after a fixed duration; event-based invalidation, where a mutation explicitly purges related cache keys; and versioned URLs, where changing the URL (with a content hash) makes the old entry unreachable without explicit deletion. Each strategy has different consistency guarantees and operational overhead.\n\nPurging by key is simple but requires knowing exactly which keys a mutation affects — hard in systems with complex dependencies. Versioned URLs work perfectly for immutable assets but can't be used for API responses. Stale-while-revalidate blends TTL and freshness by serving the stale entry immediately while fetching a replacement in the background.`,
    analogy: `Imagine a whiteboard full of last week's meeting notes. Time-based expiry is erasing the board every Friday. Event-based invalidation is erasing specific notes the moment a decision changes. Versioned URLs are writing the meeting date on each note — the old notes don't vanish, they're just never referenced again.`,
    examples: [
        { title: "Content-hash asset URLs", text: "Webpack appends a hash to bundle filenames (`main.a3f9c2.js`). CDNs cache these forever with `Cache-Control: max-age=31536000, immutable` — a new deploy generates a new hash, making old URLs obsolete without any purge." },
        { title: "Mutation-triggered purge", text: "A CMS API clears the Redis cache key `page:/blog/post-slug` when a post is published. All subsequent requests hit origin once, then cache the fresh response." }
    ],
    useCases: [
        "Static asset delivery — content-hash URLs with immutable cache headers",
        "API response caching — TTL or ETag-based revalidation to balance freshness and performance",
        "Full-page CDN caching — event-driven purge on publish to serve stale content rarely"
    ],
    tradeoffs: {
        pros: [
            "Correct invalidation means users always see consistent data without sacrificing speed",
            "Immutable versioned URLs allow infinite CDN TTLs, maximally reducing origin load",
            "Event-driven invalidation provides real-time consistency for mutation-heavy data"
        ],
        cons: [
            "Key dependency tracking is error-prone — missing one key causes stale data bugs",
            "TTL-based strategies always have a staleness window regardless of how short the TTL",
            "Distributed caches (CDN + browser + service worker) require purging at every layer"
        ]
    },
    related: ["stale-while-revalidate", "etag-cache-control", "service-worker-lifecycle", "indexeddb"]
},

{
    id: "stale-while-revalidate",
    term: "Stale-while-revalidate",
    tagline: "Serve a cached response immediately while fetching a fresh one in the background",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes refresh{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style><rect x="22" y="42" width="52" height="36" rx="5" fill="var(--diagram-ink)" opacity="0.8"/><rect x="30" y="50" width="36" height="6" rx="2" fill="var(--diagram-ink)" opacity="0.35"/><rect x="30" y="62" width="22" height="6" rx="2" fill="var(--diagram-ink)" opacity="0.35"/><path d="M88,38 A20,20 0 1 1 68,58" fill="none" stroke="var(--diagram-ink)" stroke-width="4" stroke-linecap="round" opacity="0.7" style="transform-origin:88px 58px;animation:refresh 3s linear infinite"/><polygon points="88,34 82,44 94,44" fill="var(--diagram-ink)" opacity="0.7"/></svg>`,
    definition: `Stale-while-revalidate (SWR) is a caching strategy where the cache returns the stored response immediately — even if it is past its freshness threshold — and simultaneously issues a background request to fetch a new version. When the fresh response arrives, the cache updates for the next request. This trades perfect freshness for zero additional latency on the critical path.\n\nIt is expressed in HTTP headers as \`Cache-Control: max-age=60, stale-while-revalidate=300\`, meaning the browser treats responses as fresh for 60 seconds, serves stale responses for up to 5 more minutes while revalidating in the background, and only blocks on a network request after 6 minutes. The pattern is also the namesake of the SWR and React Query data-fetching libraries, which apply it to client-side API requests.`,
    analogy: `It's like a newspaper delivered to your door each morning. You read yesterday's edition immediately while today's is still being printed. By the time you'd normally feel the information gap, the fresh edition has arrived — and you never had to wait at the door.`,
    examples: [
        { title: "HTTP cache header", text: "A news site serves article lists with `Cache-Control: max-age=30, stale-while-revalidate=86400`. Users get an instant cache hit and see content at most 30 seconds old. Background revalidation keeps the cache warm without ever blocking page load." },
        { title: "React Query default behavior", text: "React Query's `staleTime` defaults to 0 and `cacheTime` to 5 minutes. Navigating back to a cached query shows old data instantly while refetching silently — the UI updates when the fresh data resolves." }
    ],
    useCases: [
        "Content that changes periodically but where showing data seconds out of date is acceptable",
        "Client-side data fetching libraries (SWR, React Query) for fast perceived navigation",
        "CDN configurations for frequently-read, rarely-updated API endpoints"
    ],
    tradeoffs: {
        pros: [
            "Eliminates perceived latency — users always get an immediate response",
            "Background revalidation keeps data fresh without blocking the user",
            "Simple to configure via a single Cache-Control directive"
        ],
        cons: [
            "Users may act on stale data during the revalidation window (e.g., see an old price)",
            "Background requests still consume server and network resources",
            "Not suitable for data requiring strict consistency (financial balances, inventory)"
        ]
    },
    related: ["cache-invalidation", "etag-cache-control", "service-worker-lifecycle", "offline-conflict"]
},

{
    id: "etag-cache-control",
    term: "ETag vs Cache-Control",
    tagline: "The two independent axes of HTTP caching: when to reuse vs. how to revalidate",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}</style><rect x="15" y="25" width="40" height="30" rx="5" fill="var(--diagram-ink)" opacity="0.8"/><text x="24" y="46" font-family="monospace" font-size="11" fill="white" opacity="0.9">ETag</text><rect x="65" y="25" width="40" height="30" rx="5" fill="var(--diagram-ink)" opacity="0.6"/><text x="68" y="46" font-family="monospace" font-size="9" fill="white" opacity="0.9">Cache-C</text><line x1="55" y1="40" x2="65" y2="40" stroke="var(--diagram-ink)" stroke-width="2" stroke-dasharray="4 2" opacity="0.6"/><rect x="30" y="72" width="60" height="26" rx="5" fill="var(--diagram-ink)" opacity="0.45"/><text x="38" y="90" font-family="monospace" font-size="10" fill="white" opacity="0.85">304 / 200</text><line x1="35" y1="55" x2="48" y2="72" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.5" style="animation:blink 2s ease-in-out infinite"/><line x1="85" y1="55" x2="72" y2="72" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.5" style="animation:blink 2s ease-in-out infinite"/></svg>`,
    definition: `Cache-Control headers tell the browser and CDN how long a response may be reused without contacting the origin (\`max-age\`), whether it may be shared across users (\`public\` / \`private\`), and whether it should never be stored (\`no-store\`). ETags are a separate mechanism for conditional revalidation: the server attaches a hash of the response body; on subsequent requests the browser sends \`If-None-Match: <etag>\` and the server returns 304 Not Modified if the content hasn't changed, saving response body transfer.\n\nThey operate independently. Cache-Control answers "should I even ask?" ETags answer "if I ask, did anything change?" The most efficient combination is a short \`max-age\` for freshness control paired with an ETag so revalidation only transfers the body when it actually changed.`,
    analogy: `Cache-Control is the expiry date printed on food packaging — it tells you whether to bother checking. An ETag is like sniffing the food once the date has passed. If it still smells the same, you get a 304: "still good, don't send a new carton."`,
    examples: [
        { title: "API response freshness", text: "A user profile endpoint sets `Cache-Control: private, max-age=300` with an ETag. Within 5 minutes, the browser reuses the cached response. After 5 minutes, it sends `If-None-Match` — if the profile unchanged, the server returns 304 and the browser reuses the cached body, saving bandwidth." },
        { title: "Immutable static assets", text: "Content-hashed CSS and JS files are served with `Cache-Control: public, max-age=31536000, immutable`. No ETag needed — the URL itself changes when content changes, so revalidation never occurs." }
    ],
    useCases: [
        "API responses where reducing bandwidth on unchanged data matters more than reducing latency",
        "HTML pages that change frequently but whose exact freshness requirements vary by audience",
        "Server-side rendered pages on CDNs where stale-while-revalidate and ETags work together"
    ],
    tradeoffs: {
        pros: [
            "304 responses save response body bandwidth when content is unchanged",
            "Cache-Control's max-age eliminates round trips entirely for fresh cached responses",
            "Combined, they minimize both bandwidth and latency across the full request lifecycle"
        ],
        cons: [
            "ETag computation adds CPU overhead on the server for every cacheable response",
            "Private ETags in shared caches can leak information about user-specific responses",
            "CDN and browser caches may interpret Cache-Control directives differently"
        ]
    },
    related: ["cache-invalidation", "stale-while-revalidate", "http3-quic", "preload-prefetch-preconnect"]
},

{
    id: "http3-quic",
    term: "HTTP/3 and QUIC",
    tagline: "The protocol rewrite that eliminates head-of-line blocking by moving to UDP",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes flow{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}</style><line x1="15" y1="35" x2="105" y2="35" stroke="var(--diagram-ink)" stroke-width="3" stroke-dasharray="8 4" opacity="0.9" style="animation:flow 1.2s linear infinite"/><line x1="15" y1="55" x2="105" y2="55" stroke="var(--diagram-ink)" stroke-width="3" stroke-dasharray="8 4" opacity="0.7" style="animation:flow 1.5s linear infinite"/><line x1="15" y1="75" x2="105" y2="75" stroke="var(--diagram-ink)" stroke-width="3" stroke-dasharray="8 4" opacity="0.5" style="animation:flow 1.8s linear infinite"/><circle cx="15" cy="35" r="5" fill="var(--diagram-ink)" opacity="0.9"/><circle cx="15" cy="55" r="5" fill="var(--diagram-ink)" opacity="0.7"/><circle cx="15" cy="75" r="5" fill="var(--diagram-ink)" opacity="0.5"/><circle cx="105" cy="35" r="5" fill="var(--diagram-ink)" opacity="0.9"/><circle cx="105" cy="55" r="5" fill="var(--diagram-ink)" opacity="0.7"/><circle cx="105" cy="75" r="5" fill="var(--diagram-ink)" opacity="0.5"/></svg>`,
    definition: `HTTP/3 runs on QUIC, a transport protocol built on UDP rather than TCP. HTTP/2 multiplexes multiple streams over one TCP connection, but TCP's reliability model means a single lost packet stalls all streams until it is retransmitted — head-of-line blocking at the transport layer. QUIC treats each stream independently: a lost packet only pauses the specific stream it belongs to, not the entire connection.\n\nQUIC also embeds TLS 1.3 in the handshake, reducing connection establishment from 2+ round trips (TCP + TLS) to a single round trip, or zero round trips for returning connections using session resumption. This is meaningful for mobile users who frequently change networks — QUIC connections survive IP address changes via connection IDs, while TCP connections must restart.`,
    analogy: `HTTP/2 over TCP is like shipping multiple packages in one truck but having a rule that if any box is damaged, the whole truck waits at a rest stop. QUIC is like using separate motorcycles — one getting a flat doesn't delay the others.`,
    examples: [
        { title: "Mobile network switching", text: "A user switches from WiFi to cellular mid-request. A QUIC connection migrates transparently using its connection ID. A TCP connection tears down and the browser must restart the TLS handshake, adding 100–300ms latency." },
        { title: "Google Fonts loading", text: "Google serves all its APIs over QUIC. Fetching 3 font weights in one QUIC connection means a packet loss for font 2 doesn't delay font 3, where on HTTP/2 over TCP it would." }
    ],
    useCases: [
        "High-latency or lossy networks (mobile, satellite) where TCP retransmission stalls are expensive",
        "Sites fetching many parallel resources where stream independence matters",
        "Applications requiring low-latency connection setup (APIs called on every user interaction)"
    ],
    tradeoffs: {
        pros: [
            "Eliminates transport-layer head-of-line blocking for multiplexed streams",
            "Faster connection establishment — 1-RTT or 0-RTT for known servers",
            "Connection migration survives IP changes without teardown"
        ],
        cons: [
            "UDP traffic is rate-limited or blocked by some corporate firewalls and middleboxes",
            "QUIC's encryption of all headers makes network debugging harder than TCP",
            "Server and CDN support is still uneven — fallback to HTTP/2 is common"
        ]
    },
    related: ["etag-cache-control", "preload-prefetch-preconnect", "priority-hints", "streaming-fetch"]
},

{
    id: "priority-hints",
    term: "Priority hints",
    tagline: "Telling the browser which resources matter most with the fetchpriority attribute",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes rise{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.15)}}</style><rect x="20" y="30" width="80" height="14" rx="4" fill="var(--diagram-ink)" opacity="0.9" style="transform-origin:60px 37px;animation:rise 1.5s ease-in-out infinite"/><rect x="20" y="52" width="55" height="14" rx="4" fill="var(--diagram-ink)" opacity="0.65"/><rect x="20" y="74" width="35" height="14" rx="4" fill="var(--diagram-ink)" opacity="0.4"/><rect x="20" y="96" width="18" height="14" rx="4" fill="var(--diagram-ink)" opacity="0.25"/></svg>`,
    definition: `The \`fetchpriority\` attribute (values: \`high\`, \`low\`, \`auto\`) lets developers override the browser's default resource priority heuristics. Browsers assign priorities based on resource type and position in the document — images are low priority by default, scripts are high. But heuristics can be wrong: the LCP hero image may be below the fold in HTML order yet critical for the score, and an analytics script in the \`<head>\` is high priority but not user-facing.\n\nSetting \`fetchpriority="high"\` on the LCP image and \`fetchpriority="low"\` on below-the-fold images communicates true rendering intent to the browser's resource scheduler. It also applies to \`fetch()\` calls and \`<link rel="preload">\`. Overuse dilutes the signal — every resource marked high effectively means no resource is high.`,
    analogy: `It's like a ticket queue with priority lanes. The default queue is "everyone's equal." Adding fetchpriority is like giving some passengers express boarding. The gate agents (browser scheduler) still control the boarding process, but your hints help them allocate bandwidth to the right passengers first.`,
    examples: [
        { title: "LCP image promotion", text: "Adding `fetchpriority=\"high\"` to a hero image that the browser initially assigns low priority can improve LCP by 200–400ms on slow connections by moving the request to the high-priority queue before other non-critical assets." },
        { title: "Deprioritizing analytics", text: "A `<script src=\"analytics.js\" fetchpriority=\"low\">` defers bandwidth competition from a non-rendering-critical script so the browser can focus bandwidth on render-blocking fonts and stylesheets." }
    ],
    useCases: [
        "Improving LCP by boosting the priority of the hero or above-the-fold image",
        "Reducing competition from non-critical third-party scripts (analytics, chat widgets)",
        "Prioritizing an above-the-fold API fetch over lower-importance background requests"
    ],
    tradeoffs: {
        pros: [
            "Direct influence over the browser resource scheduler without changing HTML structure",
            "Works on images, scripts, fetch(), and preload links",
            "Small attribute change, no JavaScript required"
        ],
        cons: [
            "Over-assigning 'high' priority makes the hint meaningless — use sparingly",
            "Browser implementations differ slightly; always measure with real device testing",
            "Cannot override mandatory browser behaviors like parser-blocking scripts"
        ]
    },
    related: ["preload-prefetch-preconnect", "lcp", "critical-rendering-path", "render-blocking"]
},

{
    id: "preload-prefetch-preconnect",
    term: "Preload vs Prefetch vs Preconnect",
    tagline: "Three resource hints with different scopes, priorities, and timing guarantees",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes forward{0%{transform:translateX(0)}100%{transform:translateX(20px)}}</style><line x1="15" y1="35" x2="80" y2="35" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.9"/><polygon points="78,29 92,35 78,41" fill="var(--diagram-ink)" opacity="0.9" style="animation:forward 1.5s ease-in-out infinite alternate"/><line x1="15" y1="60" x2="65" y2="60" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.6"/><polygon points="63,54 77,60 63,66" fill="var(--diagram-ink)" opacity="0.6" style="animation:forward 2s ease-in-out infinite alternate"/><line x1="15" y1="85" x2="45" y2="85" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.35"/><circle cx="50" cy="85" r="7" fill="none" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.35"/></svg>`,
    definition: `\`<link rel="preload">\` is a mandatory directive — it tells the browser to fetch a specific resource at high priority for the current page, and the browser must comply. Use it for critical assets discovered late (fonts, hero images fetched from CSS) that would otherwise be delayed. It requires an \`as\` attribute matching the resource type so the browser applies correct security policies and priority.\n\n\`<link rel="prefetch">\` is a hint for likely-needed future navigations, fetched at idle priority. The browser may ignore it under memory pressure. \`<link rel="preconnect">\` warms up the TCP+TLS connection to a third-party origin (e.g., fonts.googleapis.com) without fetching any resource — useful when you know a request is coming but don't yet know the exact URL. \`dns-prefetch\` is a cheaper fallback that only resolves DNS, skipping the TCP handshake.`,
    analogy: `Preload is booking your taxi the night before a flight — it's committed and confirmed. Prefetch is asking a friend to maybe drive you if they're free. Preconnect is loading your bag and waiting at the door so there's no delay once the taxi arrives.`,
    examples: [
        { title: "Preloading a webfont", text: "`<link rel=\"preload\" href=\"/fonts/Inter.woff2\" as=\"font\" crossorigin>` tells the browser to fetch the font immediately, even before the CSS that references it is parsed, eliminating a common flash-of-invisible-text delay." },
        { title: "Preconnecting to an API origin", text: "`<link rel=\"preconnect\" href=\"https://api.example.com\">` in the `<head>` ensures the TCP and TLS handshake to the API origin completes before the JavaScript that calls `fetch('https://api.example.com/data')` runs." }
    ],
    useCases: [
        "Preload: late-discovered critical assets (custom fonts, LCP images in CSS background)",
        "Prefetch: next-page resources on hover or likely navigation paths",
        "Preconnect: third-party origins (CDNs, APIs, font providers) used early in page load"
    ],
    tradeoffs: {
        pros: [
            "Preload can shave hundreds of milliseconds off first contentful paint for late-discovered assets",
            "Preconnect eliminates TCP+TLS overhead for cross-origin requests on the critical path",
            "All three require no JavaScript — purely declarative HTML"
        ],
        cons: [
            "Unused preloads waste bandwidth and generate console warnings after 3 seconds",
            "Preconnect to too many origins consumes TCP/TLS handshake resources unnecessarily",
            "Prefetch is unreliable under memory pressure and should not be used for critical resources"
        ]
    },
    related: ["priority-hints", "render-blocking", "critical-rendering-path", "code-splitting", "dynamic-import"]
},

{
    id: "offline-conflict",
    term: "Offline conflict resolution",
    tagline: "Merging divergent local and server state after a connectivity gap",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes merge{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}</style><rect x="15" y="20" width="35" height="30" rx="5" fill="var(--diagram-ink)" opacity="0.75"/><rect x="70" y="20" width="35" height="30" rx="5" fill="var(--diagram-ink)" opacity="0.55"/><line x1="32" y1="50" x2="52" y2="78" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.6"/><line x1="88" y1="50" x2="68" y2="78" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.6"/><rect x="40" y="78" width="40" height="25" rx="5" fill="var(--diagram-ink)" opacity="0.85" style="transform-origin:60px 90px;animation:merge 2s ease-in-out infinite"/></svg>`,
    definition: `When a user edits data while offline and syncs it later, the server state may have changed during the gap, creating a conflict. Resolution strategies range from last-write-wins (simple, data-lossy) to operational transformation or CRDT-based merging (preserves all edits, complex). The right approach depends on the data type: for a counter, adding both deltas works; for free-form text, OT or CRDTs handle concurrent edits; for structured fields, field-level merging or user-visible conflict dialogs may be needed.\n\nA critical design choice is whether to detect conflicts or prevent them. Optimistic locking (version vectors or ETags) detects conflicts at sync time. Append-only event logs make conflicts structurally impossible — each edit is a new event rather than a mutation of shared state. Most real-world apps combine strategies: CRDT for text, last-write-wins for settings, and explicit conflict UI for high-stakes fields.`,
    analogy: `Two co-authors editing the same document in separate cabins over a weekend. When they reconnect, they must decide: use the newer version (last-write-wins), manually pick the best of each paragraph (user resolution), or apply a merge algorithm that accepts both changes wherever possible.`,
    examples: [
        { title: "Last-write-wins on profile fields", text: "A user updates their display name on mobile while offline. When syncing, the server's version (updated by a web session) is newer. LWW silently overwrites the mobile edit — acceptable for non-critical fields, unacceptable for financial data." },
        { title: "Append-only task list", text: "A task app models changes as events (TaskCreated, TaskCompleted) rather than mutable records. Offline events are appended to the server log in order on reconnect — no merge logic needed because events don't overwrite each other." }
    ],
    useCases: [
        "Collaborative editors where multiple users may edit the same document concurrently",
        "Mobile apps where connectivity gaps of minutes to hours are normal",
        "Forms with many fields where field-level merge is preferable to all-or-nothing replacement"
    ],
    tradeoffs: {
        pros: [
            "Offline-capable apps provide a much better experience on unreliable connections",
            "Append-only event logs sidestep merge complexity entirely",
            "Field-level merging preserves more user intent than full document replacement"
        ],
        cons: [
            "Conflict detection and resolution adds significant complexity to sync logic",
            "Last-write-wins is easy but silently discards edits in concurrent sessions",
            "User-visible conflict dialogs work but interrupt the user's flow and often go unresolved"
        ]
    },
    related: ["crdt", "indexeddb", "service-worker-lifecycle", "optimistic-rollback", "event-sourcing"]
},

{
    id: "crdt",
    term: "CRDT basics for collaboration",
    tagline: "Data structures that merge concurrent edits without coordination or conflict",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes join{0%,100%{transform:translateX(0)}50%{transform:translateX(-5px)}}@keyframes joinR{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}</style><circle cx="42" cy="55" r="28" fill="var(--diagram-ink)" opacity="0.55" style="animation:join 2s ease-in-out infinite"/><circle cx="78" cy="55" r="28" fill="var(--diagram-ink)" opacity="0.45" style="animation:joinR 2s ease-in-out infinite"/><circle cx="60" cy="55" r="14" fill="var(--diagram-ink)" opacity="0.85"/></svg>`,
    definition: `Conflict-free Replicated Data Types (CRDTs) are data structures mathematically guaranteed to merge correctly regardless of the order in which concurrent operations are applied. Each operation is designed to be commutative, associative, and idempotent, so any two replicas that have seen the same set of operations converge to the same state — no central coordinator required.\n\nThe two main families are state-based CRDTs (merge full state snapshots) and operation-based CRDTs (broadcast individual ops). Common examples: a G-Counter accumulates increments and merges by taking the max per node; an LWW-Register applies last-write-wins per field via a logical clock; RGA (Replicated Growable Array) enables collaborative text editing by giving each character a unique identifier. Libraries like Automerge and Yjs implement CRDT-based data models usable in browser JavaScript.`,
    analogy: `Imagine two people counting votes in different rooms, each keeping a tally. When they reconvene, the final count is just the sum of both tallies — it doesn't matter who counted which votes or in what order. A G-Counter CRDT works exactly like this.`,
    examples: [
        { title: "Collaborative text with Yjs", text: "Yjs uses a CRDT called YATA to represent shared text documents. Two users typing simultaneously at different positions merge without conflict — both edits appear in the document, and all peers converge to the same final string." },
        { title: "Distributed shopping cart", text: "A G-Set CRDT models a shopping cart where items can only be added (not removed). Every client can add items offline; when syncing, the merged cart is the union of all sets. No item can be accidentally removed by a concurrent edit." }
    ],
    useCases: [
        "Real-time collaborative text editors (Google Docs-style) requiring peer-to-peer merge",
        "Multi-device sync where a central server coordinating every write is too slow or unavailable",
        "Distributed counters, sets, and registers where eventual consistency is acceptable"
    ],
    tradeoffs: {
        pros: [
            "Merges are always correct by construction — no conflict resolution code needed",
            "Works fully offline; convergence happens automatically on reconnect",
            "Peer-to-peer capable — no single server required to arbitrate conflicts"
        ],
        cons: [
            "Tombstones (deleted items) accumulate in operation-based CRDTs, growing memory over time",
            "Not all data models map naturally to CRDT semantics — complex relational schemas are hard",
            "Libraries like Yjs add meaningful bundle size (~50KB) even with tree shaking"
        ]
    },
    related: ["offline-conflict", "event-sourcing", "webrtc", "indexeddb", "sharedarraybuffer"]
},

{
    id: "webrtc",
    term: "WebRTC",
    tagline: "Peer-to-peer audio, video, and data channels directly between browsers",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes signal{0%,100%{opacity:0.2}50%{opacity:0.9}}</style><circle cx="35" cy="60" r="12" fill="var(--diagram-ink)" opacity="0.8"/><circle cx="85" cy="60" r="12" fill="var(--diagram-ink)" opacity="0.8"/><line x1="47" y1="60" x2="73" y2="60" stroke="var(--diagram-ink)" stroke-width="2.5" opacity="0.7"/><path d="M25,45 A25,25 0 0 0 25,75" fill="none" stroke="var(--diagram-ink)" stroke-width="2.5" opacity="0.5" style="animation:signal 2s ease-in-out infinite"/><path d="M14,36 A36,36 0 0 0 14,84" fill="none" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.3" style="animation:signal 2.3s ease-in-out infinite"/><path d="M95,45 A25,25 0 0 1 95,75" fill="none" stroke="var(--diagram-ink)" stroke-width="2.5" opacity="0.5" style="animation:signal 2s ease-in-out infinite"/><path d="M106,36 A36,36 0 0 1 106,84" fill="none" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.3" style="animation:signal 2.3s ease-in-out infinite"/></svg>`,
    definition: `WebRTC (Web Real-Time Communication) is a browser API for establishing peer-to-peer connections for audio, video, and arbitrary data without a server in the media path. Connection setup uses ICE (Interactive Connectivity Establishment) to negotiate network paths through NATs and firewalls, requiring a signaling channel (typically WebSocket) to exchange SDP offers/answers and ICE candidates. Once connected, data flows directly peer-to-peer.\n\nThe RTCDataChannel provides a low-latency bidirectional channel for arbitrary binary or text data. It can be configured as reliable (TCP-like) or unreliable+ordered (UDP-like), making it suitable for file transfer and game state sync respectively. Most production deployments also use TURN servers as relay fallbacks for peer pairs that cannot establish a direct path through NATs.`,
    analogy: `WebRTC is like arranging a direct phone call between two people. A receptionist (signaling server) facilitates the initial exchange of phone numbers, but once connected, the call is direct — the receptionist is no longer involved and doesn't hear anything.`,
    examples: [
        { title: "Peer-to-peer file sharing", text: "A browser-based file transfer app uses RTCDataChannel to send a file directly between two users at LAN speeds. The server only handles signaling — the 500MB file never touches the server's bandwidth." },
        { title: "Video conferencing", text: "A video call uses RTCPeerConnection to send audio and video streams directly between participants. The server provides TURN relay for users behind restrictive NATs, but direct paths skip the relay entirely for most connections." }
    ],
    useCases: [
        "Real-time audio and video conferencing applications",
        "Peer-to-peer file transfer or screen sharing without server relay overhead",
        "Low-latency multiplayer game state sync via unreliable RTCDataChannels"
    ],
    tradeoffs: {
        pros: [
            "Media and data travel directly between peers — minimal server bandwidth and latency",
            "Built into all modern browsers — no plugin required",
            "RTCDataChannel supports both reliable and unreliable delivery modes"
        ],
        cons: [
            "Connection setup (ICE negotiation) is complex and can take 1–3 seconds",
            "TURN relay servers are required for users behind symmetric NATs, adding cost and latency",
            "Peer-to-peer topologies scale poorly for large groups — SFU/MCU servers are needed beyond ~4 participants"
        ]
    },
    related: ["crdt", "offline-conflict", "sharedarraybuffer", "backpressure", "abortcontroller"]
},

{
    id: "backpressure",
    term: "Backpressure in streams API",
    tagline: "Signaling to a producer to slow down when a consumer can't keep up",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes fill{0%{height:10px;y:90px}50%{height:40px;y:60px}100%{height:10px;y:90px}}</style><rect x="40" y="20" width="40" height="70" rx="5" fill="none" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.7"/><rect x="43" y="23" width="34" height="64" rx="3" fill="var(--diagram-ink)" opacity="0.15"/><rect x="43" y="60" width="34" height="27" rx="3" fill="var(--diagram-ink)" opacity="0.7" style="animation:fill 3s ease-in-out infinite"/><polygon points="60,5 68,18 52,18" fill="var(--diagram-ink)" opacity="0.8"/><polygon points="60,105 52,98 68,98" fill="var(--diagram-ink)" opacity="0.4"/></svg>`,
    definition: `Backpressure is a flow-control signal from a consumer to a producer saying "slow down — I can't process data as fast as you're sending it." The WHATWG Streams API models this through readable streams and writable streams connected by a \`TransformStream\`. A writable stream exposes a \`desiredSize\` property via its internal queue — when the queue fills, \`desiredSize\` goes negative and the write promise pauses, signaling the upstream readable to stop pulling.\n\nWithout backpressure, a fast producer can overwhelm a slow consumer, exhausting memory. This is common when streaming large responses from \`fetch()\` — if the transform processes data slower than the network delivers it, an unbounded queue grows without limit. Proper backpressure in Streams automatically handles this by pausing reads until the downstream queue drains.`,
    analogy: `It's like a conveyor belt feeding a packaging station. If the packager falls behind, boxes pile up. Backpressure is an automatic sensor that slows the conveyor when the pile reaches a certain height, and speeds it back up when the packager catches up.`,
    examples: [
        { title: "Streaming large file download", text: "A ReadableStream from fetch() piped through a TransformStream for decompression automatically slows the network read rate when the decompressor's internal queue fills — preventing out-of-memory errors on multi-gigabyte files." },
        { title: "Server-Sent Events consumer", text: "An SSE consumer processing events slower than they arrive applies backpressure via a writable stream queue — the browser suspends reading from the TCP socket when the queue exceeds the high watermark." }
    ],
    useCases: [
        "Processing large streaming responses (CSV, NDJSON, binary) without loading the full body into memory",
        "Piping data through slow transform steps (decompression, parsing) without unbounded buffering",
        "Connecting a fast network source to a slow UI update rate without dropping data"
    ],
    tradeoffs: {
        pros: [
            "Prevents memory exhaustion when producer outpaces consumer",
            "Streams API handles backpressure automatically when using pipe()",
            "Enables processing of arbitrarily large data with bounded memory usage"
        ],
        cons: [
            "Manual backpressure implementation with custom producers requires careful desiredSize polling",
            "Pipelines with many transform steps can be hard to debug when flow stalls",
            "Browser Streams API support for all features (TransformStream, backpressure) varies slightly across versions"
        ]
    },
    related: ["streaming-fetch", "abortcontroller", "http3-quic", "transferable-objects"]
},

{
    id: "abortcontroller",
    term: "AbortController",
    tagline: "Cancelling in-flight fetch requests and async operations via a shared signal",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes stop{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}</style><circle cx="60" cy="60" r="38" fill="none" stroke="var(--diagram-ink)" stroke-width="5" opacity="0.75" style="transform-origin:60px 60px;animation:stop 2s ease-in-out infinite"/><rect x="42" y="50" width="36" height="20" rx="4" fill="var(--diagram-ink)" opacity="0.85"/></svg>`,
    definition: `AbortController exposes an AbortSignal that can be passed to \`fetch()\` and other async APIs. Calling \`controller.abort()\` causes any pending operation holding that signal to reject with an \`AbortError\`, freeing network connections and stopping unnecessary work. The signal is shareable — one controller can cancel multiple simultaneous fetches.\n\nCommon patterns: cancel stale searches when the user types a new query (debounce + abort), cancel in-flight requests on component unmount in React to avoid setting state on unmounted components, and implement request timeouts with \`AbortSignal.timeout(ms)\`. AbortSignal also integrates with the Streams API — piping a readable stream with a signal aborts the pipe when the signal fires, triggering backpressure cleanup.`,
    analogy: `It's like a walkie-talkie kill switch shared across multiple field teams. The moment you press it, every team on that channel stops their current task and returns to base. One signal, many receivers, instant stop.`,
    examples: [
        { title: "Cancelling stale search requests", text: "A search input creates a new AbortController on every keystroke and aborts the previous controller before firing the new request. Fast typists only process the final query's response — intermediate results never update the UI." },
        { title: "React useEffect cleanup", text: "Passing an AbortSignal to fetch inside a useEffect and calling abort() in the cleanup function ensures that if the component unmounts before the response arrives, the fetch is cancelled and setState is never called on the dead component." }
    ],
    useCases: [
        "Cancelling in-flight search or autocomplete requests when superseded by new input",
        "Cleaning up pending requests on React component unmount to prevent state updates",
        "Implementing request timeouts without setTimeout + manual promise rejection"
    ],
    tradeoffs: {
        pros: [
            "Frees server connections and client bandwidth for requests that are no longer needed",
            "AbortSignal.timeout() provides clean declarative timeout handling",
            "Single signal can be passed to fetch, streams, and custom async code simultaneously"
        ],
        cons: [
            "AbortError must be explicitly caught and distinguished from real errors in catch blocks",
            "Aborting does not guarantee the server stops processing — the request may already be handled",
            "Third-party libraries may not respect AbortSignal if they don't check signal.aborted internally"
        ]
    },
    related: ["streaming-fetch", "backpressure", "race-conditions", "service-worker-lifecycle"]
},

{
    id: "streaming-fetch",
    term: "Streaming fetch response handling",
    tagline: "Reading a response body incrementally as bytes arrive rather than waiting for completion",
    category: "data",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes wave{0%{d:path('M10,60 Q30,45 50,60 Q70,75 90,60 Q110,45 120,55')}50%{d:path('M10,60 Q30,75 50,60 Q70,45 90,60 Q110,75 120,65')}100%{d:path('M10,60 Q30,45 50,60 Q70,75 90,60 Q110,45 120,55')}}</style><path d="M10,60 Q30,45 50,60 Q70,75 90,60 Q110,45 120,55" fill="none" stroke="var(--diagram-ink)" stroke-width="4" opacity="0.8" style="animation:wave 2s ease-in-out infinite"/><path d="M10,75 Q30,60 50,75 Q70,90 90,75 Q110,60 120,70" fill="none" stroke="var(--diagram-ink)" stroke-width="3" opacity="0.5" style="animation:wave 2.5s ease-in-out infinite"/><path d="M10,45 Q30,30 50,45 Q70,60 90,45 Q110,30 120,40" fill="none" stroke="var(--diagram-ink)" stroke-width="2" opacity="0.3" style="animation:wave 3s ease-in-out infinite"/></svg>`,
    definition: `The fetch API exposes \`response.body\` as a \`ReadableStream\`. Instead of awaiting \`response.json()\` or \`response.text()\` (which buffer the entire body), you can read the stream incrementally using a reader and process chunks as they arrive. This enables progress indicators, streaming JSON parsing, and first-token display for LLM APIs — none of which are possible with the buffering helpers.\n\nThe typical pattern is \`const reader = response.body.getReader()\` followed by a loop calling \`reader.read()\` until done. Each call returns a \`{ done, value }\` object where \`value\` is a Uint8Array chunk. A TextDecoder converts chunks to strings. For structured responses, libraries like \`can-ndjson-stream\` or custom parsers split the stream on delimiters and parse each line independently.`,
    analogy: `Buffered fetch is waiting for the full newspaper to print before reading any of it. Streaming fetch is reading each section as it comes off the press — you're reading the sports section while the crossword is still printing.`,
    examples: [
        { title: "LLM streaming response", text: "Calling an LLM API with streaming enabled returns a ReadableStream of Server-Sent Events. Reading chunks and appending each token to the UI gives the familiar token-by-token display — users see output start in under 100ms instead of waiting for the full response." },
        { title: "Large NDJSON file processing", text: "Fetching a 200MB NDJSON export as a stream and splitting on newlines lets the app process and display rows as they arrive, with a progress indicator, rather than allocating 200MB of memory to parse the whole response at once." }
    ],
    useCases: [
        "Displaying streaming LLM or AI API responses token-by-token",
        "Processing large file downloads (CSV, JSON, NDJSON) without full memory allocation",
        "Progress indicators for slow API calls that support chunked transfer encoding"
    ],
    tradeoffs: {
        pros: [
            "First byte of usable data reaches the UI far sooner than with buffered response",
            "Memory usage stays bounded even for very large responses",
            "Combines well with AbortController to stop mid-stream when data is no longer needed"
        ],
        cons: [
            "Incremental parsing is significantly more complex than JSON.parse on a complete buffer",
            "Chunk boundaries don't align with logical data boundaries — partial tokens must be buffered manually",
            "Streaming body is consumed once — piping to multiple consumers requires tee() or buffering"
        ]
    },
    related: ["backpressure", "abortcontroller", "http3-quic", "service-worker-lifecycle", "transferable-objects"]
},
// ── Security & policies (7) ─────────────────────────────────────────────────

{
    id: "cors-preflight",
    term: "CORS preflight",
    tagline: "The browser's OPTIONS request that checks cross-origin permission before sending the real request",
    category: "security",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>.arrow{animation:slide 1.8s ease-in-out infinite;}.reply{animation:slide 1.8s ease-in-out infinite 0.9s;}@keyframes slide{0%{opacity:0;transform:translateX(-6px)}40%{opacity:1;transform:translateX(0)}80%{opacity:1}100%{opacity:0}}</style><rect x="4" y="44" width="32" height="22" rx="3" fill="var(--diagram-ink)"/><rect x="84" y="44" width="32" height="22" rx="3" fill="var(--diagram-ink)"/><text x="20" y="59" font-size="7" fill="#fff" text-anchor="middle">client</text><text x="100" y="59" font-size="7" fill="#fff" text-anchor="middle">server</text><g class="arrow"><line x1="38" y1="50" x2="82" y2="50" stroke="var(--diagram-ink)" stroke-width="2.5"/><polygon points="82,47 88,50 82,53" fill="var(--diagram-ink)"/><text x="60" y="46" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">OPTIONS</text></g><g class="reply"><line x1="82" y1="62" x2="38" y2="62" stroke="var(--diagram-ink)" stroke-width="2.5"/><polygon points="38,59 32,62 38,65" fill="var(--diagram-ink)"/><text x="60" y="75" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">204 OK</text></g></svg>`,
    definition: `When a browser makes a cross-origin request that is not "simple" — for example, using PUT, DELETE, or custom headers — it first sends an HTTP OPTIONS request to the target server. This preflight asks whether the actual request is allowed. The server responds with CORS headers such as Access-Control-Allow-Origin and Access-Control-Allow-Methods.\n\nOnly if the preflight succeeds does the browser send the real request. This handshake is enforced entirely by the browser; server-to-server calls skip it. Caching preflights via Access-Control-Max-Age reduces round trips.`,
    analogy: `Think of it like calling ahead before visiting someone's office. You phone ahead (OPTIONS) to confirm the person is available and allows your type of visit. Only after getting the go-ahead do you actually show up.`,
    examples: [
        { title: "Triggering a preflight", text: "A React app on app.example.com calls PUT https://api.other.com/resource with Content-Type: application/json. The browser automatically sends OPTIONS first; if the server omits Access-Control-Allow-Methods: PUT, the real request is blocked." },
        { title: "Caching to reduce latency", text: "Setting Access-Control-Max-Age: 86400 on the preflight response tells browsers to cache the permission for one day, eliminating the OPTIONS round trip on subsequent calls from the same origin." }
    ],
    useCases: ["Calling a third-party REST API from a browser SPA", "Sending Authorization headers to a microservice on a different subdomain", "Cross-origin WebSocket upgrade checks"],
    tradeoffs: {
        pros: ["Prevents unauthorized cross-origin state-changing requests", "Caching cuts repeated preflight overhead", "Decouples CORS policy from application logic via server headers"],
        cons: ["Adds a full round-trip latency before non-simple requests", "Misconfigured wildcard origins defeat the protection entirely", "Opaque responses make debugging CORS errors harder in production"]
    },
    related: ["samesite-cookies", "csrf-xss", "csp"]
},

{
    id: "samesite-cookies",
    term: "SameSite cookie modes",
    tagline: "Cookie attribute that controls whether cookies are sent on cross-site requests",
    category: "security",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes fade{0%,100%{opacity:0.3}50%{opacity:1}}.s1{animation:fade 2s infinite}.s2{animation:fade 2s infinite 0.7s}.s3{animation:fade 2s infinite 1.4s}</style><circle cx="60" cy="60" r="26" fill="none" stroke="var(--diagram-ink)" stroke-width="3"/><circle cx="60" cy="60" r="4" fill="var(--diagram-ink)"/><circle class="s1" cx="60" cy="34" r="5" fill="var(--diagram-ink)"/><circle class="s2" cx="83" cy="73" r="5" fill="var(--diagram-ink)"/><circle class="s3" cx="37" cy="73" r="5" fill="var(--diagram-ink)"/><text x="60" y="105" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">Strict / Lax / None</text></svg>`,
    definition: `SameSite is a cookie attribute with three modes. Strict: the cookie is never sent on any cross-site request, including top-level navigations from external links. Lax: the cookie is sent on top-level GET navigations but withheld from cross-origin sub-requests such as iframes, images, and fetch. None: the cookie is always sent but requires Secure.\n\nChrome defaulted to Lax in 2020 when SameSite is omitted. Choosing the right mode is the primary browser-native defense against CSRF. Strict blocks all cross-site cookie delivery; Lax preserves deep-link UX while blocking POST-based CSRF.`,
    analogy: `Strict is a bouncer who only lets in people from inside the building. Lax lets guests walk in through the front door but won't hand them anything if they're passed in through a side window. None leaves the door open to everyone who shows an ID.`,
    examples: [
        { title: "Protecting a banking app", text: "Set SameSite=Strict on session cookies. A forged link on evil.com that POSTs to bank.com will not carry the cookie, so the request is unauthenticated." },
        { title: "Preserving OAuth redirects", text: "SameSite=Lax lets an OAuth redirect back to your site carry the state cookie (top-level GET), while still blocking cross-origin iframe or image requests from including it." }
    ],
    useCases: ["Session cookie protection against CSRF without tokens", "Third-party embeds that require cookies (SameSite=None; Secure)", "Restricting auth cookies to first-party navigation only"],
    tradeoffs: {
        pros: ["Browser-enforced with no server-side token management", "Lax provides a practical default that blocks most CSRF vectors", "Strict gives strong protection for highly sensitive sessions"],
        cons: ["Strict breaks cross-site deep links and OAuth flows", "None requires HTTPS, breaking local HTTP dev without workarounds", "Legacy browsers ignore the attribute entirely"]
    },
    related: ["csrf-xss", "cors-preflight", "csp"]
},

{
    id: "csrf-xss",
    term: "CSRF vs XSS mitigation",
    tagline: "Two distinct attack classes that require different defenses despite often being conflated",
    category: "security",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}.b{animation:blink 1.4s infinite}.b2{animation:blink 1.4s infinite 0.7s}</style><rect x="8" y="30" width="44" height="30" rx="4" fill="var(--diagram-ink)"/><text x="30" y="49" font-size="8" fill="#fff" text-anchor="middle">CSRF</text><rect x="68" y="30" width="44" height="30" rx="4" fill="var(--diagram-ink)"/><text x="90" y="49" font-size="8" fill="#fff" text-anchor="middle">XSS</text><text class="b" x="30" y="80" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">forged request</text><text class="b2" x="90" y="80" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">injected script</text><line x1="30" y1="60" x2="30" y2="70" stroke="var(--diagram-ink)" stroke-width="1.5"/><line x1="90" y1="60" x2="90" y2="70" stroke="var(--diagram-ink)" stroke-width="1.5"/></svg>`,
    definition: `CSRF (cross-site request forgery) tricks an authenticated user's browser into sending a state-changing request to a site where they have an active session. The attacker never reads the response; they just trigger the action. Mitigations: SameSite cookies, synchronizer tokens (CSRF tokens), and double-submit cookies.\n\nXSS (cross-site scripting) injects malicious script into a page that other users view, giving the attacker arbitrary code execution in that origin. Stored XSS persists in a database; reflected XSS echoes from a URL parameter. Mitigations: output encoding, Content Security Policy, Trusted Types, and sanitizing user-supplied HTML.`,
    analogy: `CSRF is forging someone's signature on a form — the victim unknowingly authorizes an action. XSS is slipping a note inside someone's wallet so it reads aloud when they open it — the attacker's words run as if they were the victim's own.`,
    examples: [
        { title: "CSRF token in a form", text: "A Rails app embeds a random per-session token as a hidden field. On submit, the server verifies the token matches the session. An attacker's forged POST from evil.com cannot know the token." },
        { title: "XSS via innerHTML", text: "A comment field that renders user input via innerHTML allows injection of <img src=x onerror='stealCookies()'/>. Encoding the output as text or using textContent prevents script injection." }
    ],
    useCases: ["Protecting state-changing API endpoints from forged cross-origin requests", "Preventing script injection in rich-text editors and comment systems", "Securing single-page apps that store tokens in localStorage"],
    tradeoffs: {
        pros: ["CSRF tokens are transparent to users and highly effective", "CSP provides layered XSS defense even if encoding is missed", "Treating all user input as untrusted eliminates entire XSS classes"],
        cons: ["CSRF tokens add state to otherwise stateless APIs", "Over-permissive CSP policies give false security confidence", "DOM-based XSS bypasses server-side encoding entirely"]
    },
    related: ["samesite-cookies", "cors-preflight", "csp", "trusted-types", "dom-clobbering"]
},

{
    id: "csp",
    term: "Content Security Policy (CSP)",
    tagline: "An HTTP header that tells the browser which sources are allowed to load scripts, styles, and other resources",
    category: "security",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes shield{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}.sh{animation:shield 2s ease-in-out infinite;transform-origin:60px 55px;}</style><g class="sh"><path d="M60 18 L96 34 L96 62 C96 82 60 100 60 100 C60 100 24 82 24 62 L24 34 Z" fill="var(--diagram-ink)"/><text x="60" y="65" font-size="22" fill="#fff" text-anchor="middle">&#x2713;</text></g></svg>`,
    definition: `CSP is delivered as a Content-Security-Policy response header or a meta http-equiv tag. It defines allowlists for script-src, style-src, img-src, connect-src, and other resource types. Browsers refuse to load or execute anything not covered by the policy.\n\nStrict CSP policies use nonces or hashes instead of host allowlists because domain-based allowlists are routinely bypassed via JSONP endpoints or CDN compromises. Report-Only mode lets you audit violations without breaking the page while iterating toward enforcement.`,
    analogy: `CSP is a guest list for your page's resources. Only sources on the list get loaded. Anyone not on the list — including a script injected by an attacker — is turned away regardless of how legitimate they look.`,
    examples: [
        { title: "Nonce-based strict CSP", text: "The server generates a cryptographic nonce per response and sets Content-Security-Policy: script-src 'nonce-abc123'. Only script tags with nonce='abc123' execute. Injected scripts without the nonce are blocked." },
        { title: "Report-Only rollout", text: "Set Content-Security-Policy-Report-Only with a report-uri to collect violations in production logs before switching to enforcement mode, revealing inline scripts and third-party resources that need allowlisting." }
    ],
    useCases: ["Blocking XSS script execution even when input sanitization fails", "Restricting which APIs a page can connect to via connect-src", "Preventing clickjacking via frame-ancestors directive"],
    tradeoffs: {
        pros: ["Second layer of defense that stops XSS payloads from executing", "Report-only mode enables safe iterative tightening", "frame-ancestors replaces the deprecated X-Frame-Options header"],
        cons: ["Nonce-based CSP requires per-request server-side rendering; breaks fully static sites", "Third-party scripts and tag managers constantly break strict policies", "Misconfigured unsafe-inline or unsafe-eval negates most protection"]
    },
    related: ["csrf-xss", "trusted-types", "dom-clobbering", "cors-preflight"]
},

{
    id: "trusted-types",
    term: "Trusted Types",
    tagline: "A browser API that enforces safe DOM sink usage by requiring explicit type wrapping before injection",
    category: "security",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes lock{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}.lk{animation:lock 2s ease-in-out infinite;transform-origin:60px 60px;}</style><g class="lk"><rect x="38" y="58" width="44" height="34" rx="4" fill="var(--diagram-ink)"/><path d="M48 58 L48 46 Q60 34 72 46 L72 58" fill="none" stroke="var(--diagram-ink)" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="74" r="5" fill="#fff"/><line x1="60" y1="79" x2="60" y2="86" stroke="#fff" stroke-width="2.5"/></g></svg>`,
    definition: `Trusted Types locks down dangerous DOM sinks — innerHTML, outerHTML, insertAdjacentHTML, and eval — so they only accept values wrapped by a registered policy object rather than raw strings. If a script tries to assign a plain string to innerHTML, the browser throws a TypeError.\n\nPolicies are created with trustedTypes.createPolicy(), and their createHTML/createScript methods are the only place sanitization or escaping logic lives. Combined with a CSP require-trusted-types-for directive, this eliminates the entire class of DOM XSS caused by unsanitized string assignment.`,
    analogy: `Trusted Types is like requiring all wire transfers to go through a compliance officer rather than letting anyone type an account number directly into the system. The compliance officer (the policy) checks the value; the wire system (the DOM) won't accept raw input from anyone else.`,
    examples: [
        { title: "Creating a safe HTML policy", text: "trustedTypes.createPolicy('sanitize', { createHTML: s => DOMPurify.sanitize(s) }) wraps DOMPurify. All calls to element.innerHTML must now use this policy's output, centralizing sanitization in one auditable place." },
        { title: "Catching legacy code violations", text: "Enabling require-trusted-types-for 'script' in report-only mode surfaces every innerHTML assignment in the codebase as a console violation, so teams can migrate incrementally before enforcement." }
    ],
    useCases: ["Eliminating DOM XSS in large codebases with many innerHTML usages", "Centralizing HTML sanitization into one auditable policy", "Enforcing safe coding standards in team environments via CSP enforcement"],
    tradeoffs: {
        pros: ["Prevents the entire DOM XSS class at the browser level, not just at code review", "Centralizes sanitization so it can be audited in one place", "Works alongside CSP for defense in depth"],
        cons: ["Requires refactoring legacy code that assigns raw strings to DOM sinks", "Third-party libraries that use innerHTML internally need wrappers or replacements", "Browser support requires a polyfill in older environments"]
    },
    related: ["csp", "csrf-xss", "dom-clobbering", "prototype-pollution"]
},

{
    id: "dom-clobbering",
    term: "DOM clobbering",
    tagline: "An attack where HTML element IDs or names shadow JavaScript globals, corrupting application logic",
    category: "security",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes wobble{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}.wb{animation:wobble 1.6s ease-in-out infinite;transform-origin:60px 60px;}</style><g class="wb"><rect x="30" y="40" width="60" height="14" rx="3" fill="var(--diagram-ink)"/><rect x="38" y="56" width="44" height="10" rx="2" fill="var(--diagram-ink)" opacity="0.7"/><rect x="44" y="68" width="32" height="10" rx="2" fill="var(--diagram-ink)" opacity="0.4"/><text x="60" y="97" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">id clobbers global</text></g></svg>`,
    definition: `Browsers expose named HTML elements (id and name attributes) as properties on the window and document objects. An attacker who can inject arbitrary HTML — but not script — can create elements whose IDs collide with variable names the application reads. For example, an img tag with id="config" makes window.config an HTMLElement, breaking any code that reads config.apiUrl.\n\nThis is especially dangerous in apps that check window.something for feature flags or configuration objects. Mitigations include avoiding global variable lookups for config, using hasOwnProperty checks, and sanitizing HTML input with a library that strips id and name attributes from untrusted content.`,
    analogy: `It's like someone placing a cardboard cutout of a security guard in a hallway. Your code looks for a guard, finds the shape, and assumes it's real — but the impostor has none of the guard's actual capabilities or properties.`,
    examples: [
        { title: "Clobbering a config object", text: "An app reads window.APP_CONFIG.featureFlags. An attacker injects a form with id='APP_CONFIG' and an input with name='featureFlags'. window.APP_CONFIG is now an HTMLFormElement, breaking the feature flag checks." },
        { title: "Bypassing a security check", text: "Code checks if (!window.sanitized) { sanitize(input); }. Injecting an img tag with id='sanitized' sets window.sanitized to an HTMLElement — truthy — causing the sanitization step to be skipped." }
    ],
    useCases: ["Understanding why HTML sanitizers must strip id and name attributes", "Auditing code that reads from window globals for injection risk", "Writing CSP policies that reduce the impact of HTML injection without script execution"],
    tradeoffs: {
        pros: ["Understanding DOM clobbering drives safer global variable patterns", "Sanitizers that strip id/name fully block the attack surface", "Moving config out of window globals eliminates the risk class"],
        cons: ["Many sanitizers allow id and name by default, leaving apps exposed", "Hard to detect in code review because the attack is in injected HTML, not JS", "Legacy code with heavy window global usage is difficult to audit fully"]
    },
    related: ["csrf-xss", "csp", "trusted-types", "prototype-pollution"]
},

{
    id: "prototype-pollution",
    term: "Prototype pollution",
    tagline: "An attack that injects properties into Object.prototype, causing those properties to appear on all plain objects",
    category: "security",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes spread{0%{r:4}50%{r:8}100%{r:4}}.sp{animation:spread 1.8s ease-in-out infinite;}</style><circle cx="60" cy="40" r="10" fill="var(--diagram-ink)"/><circle cx="30" cy="75" r="8" fill="var(--diagram-ink)" opacity="0.8"/><circle cx="90" cy="75" r="8" fill="var(--diagram-ink)" opacity="0.8"/><circle class="sp" cx="60" cy="40" r="4" fill="#fff" opacity="0.5"/><line x1="52" y1="48" x2="36" y2="68" stroke="var(--diagram-ink)" stroke-width="2"/><line x1="68" y1="48" x2="84" y2="68" stroke="var(--diagram-ink)" stroke-width="2"/><text x="60" y="105" font-size="7" fill="var(--diagram-ink)" text-anchor="middle">__proto__ -&gt; Object.prototype</text></svg>`,
    definition: `JavaScript objects inherit from Object.prototype via the prototype chain. If an attacker can control the key in a deep merge or path-based setter — such as user-supplied JSON with __proto__ or constructor.prototype — they can write arbitrary properties onto Object.prototype itself. Every plain object in the process then inherits those properties.\n\nThis can bypass security checks, corrupt application logic, or escalate to RCE in server-side Node.js when polluted properties reach child_process options. Mitigations: use Object.create(null) for merge targets, validate keys against a blocklist, and prefer structuredClone over manual deep merge.`,
    analogy: `It's like writing a new rule in a company-wide policy manual that applies retroactively to every employee. Any subsequent check against that policy finds the attacker's rule as if it were always there.`,
    examples: [
        { title: "Deep merge pollution", text: "Merging an empty object with JSON.parse('{\"__proto__\":{\"isAdmin\":true}}') writes isAdmin onto Object.prototype. Every subsequent object literal in the app now has isAdmin: true on its prototype chain." },
        { title: "Node.js RCE via spawn options", text: "Polluting Object.prototype.shell = true causes a merge-then-spawn pattern to pass shell: true to child_process, enabling shell metacharacter injection in what appeared to be a sandboxed command." }
    ],
    useCases: ["Auditing deep merge utility functions for key validation", "Choosing Object.create(null) maps for untrusted key-value storage", "Using JSON schema validation to reject __proto__ and constructor keys at API boundaries"],
    tradeoffs: {
        pros: ["Awareness drives safer merge and clone patterns across the codebase", "Object.create(null) fully eliminates the prototype chain as an attack surface", "Schema validation at ingress blocks the attack before data reaches merge logic"],
        cons: ["Many popular utility libraries were historically vulnerable before patching", "Pollution is global and persistent for the lifetime of the process", "Silent failures — polluted properties shadow legitimate undefined checks without throwing"]
    },
    related: ["dom-clobbering", "csrf-xss", "trusted-types", "csp"]
},


// ── Architecture (9) ────────────────────────────────────────────────────────

{
    id: "scheduler-priorities",
    term: "Scheduler priorities",
    tagline: "A mechanism for ordering async work units so high-priority tasks preempt low-priority ones",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}.p1{animation:pulse 1s infinite}.p2{animation:pulse 1s infinite 0.33s}.p3{animation:pulse 1s infinite 0.66s}</style><rect class="p1" x="10" y="20" width="100" height="16" rx="3" fill="var(--diagram-ink)"/><rect class="p2" x="10" y="44" width="70" height="16" rx="3" fill="var(--diagram-ink)" opacity="0.7"/><rect class="p3" x="10" y="68" width="40" height="16" rx="3" fill="var(--diagram-ink)" opacity="0.4"/><text x="60" y="102" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">urgent / normal / idle</text></svg>`,
    definition: `Schedulers assign priority levels to units of work so the runtime can decide which tasks run first. React's scheduler uses five levels: ImmediatePriority (synchronous), UserBlockingPriority (input handlers), NormalPriority (state updates), LowPriority (data prefetch), and IdlePriority (non-visible work). Higher-priority tasks interrupt lower-priority ones mid-execution via time-slicing.\n\nThe browser's own scheduler (scheduler.postTask API) exposes user-visible, user-blocking, and background buckets, mirroring React's model. Correct priority assignment prevents input jank caused by expensive background work monopolizing the main thread.`,
    analogy: `It's like an emergency room triage system. A walk-in with a sprained ankle waits while a trauma patient is treated immediately. The work gets done in order of urgency, not order of arrival.`,
    examples: [
        { title: "React transition vs. urgent update", text: "Wrapping a search filter update in startTransition marks it NormalPriority. A keystroke landing during the filter render is ImmediatePriority — React interrupts the filter work, handles the keystroke, then resumes." },
        { title: "scheduler.postTask for background work", text: "Using scheduler.postTask(() => buildIndex(), { priority: 'background' }) defers a search index build until the browser has idle time, keeping scroll and click handlers responsive." }
    ],
    useCases: ["Keeping input and animation responsive while expensive renders run", "Deferring analytics, prefetch, and reporting to idle time", "Implementing work-stealing patterns in concurrent rendering frameworks"],
    tradeoffs: {
        pros: ["Eliminates input jank caused by long synchronous work", "Idle-priority tasks run without any user-visible impact", "Composable with React's concurrent features via startTransition"],
        cons: ["Priority inversion bugs are hard to diagnose when priorities are assigned incorrectly", "Scheduler API browser support is still limited; polyfills add complexity", "Overuse of high priorities recreates the starvation problem the scheduler is meant to solve"]
    },
    related: ["priority-inversion", "render-waterfalls", "long-tasks", "event-loop-tasks", "task-starvation", "time-slicing", "concurrent-rendering"]
},

{
    id: "render-waterfalls",
    term: "Render waterfalls",
    tagline: "A chain of sequential data fetches that each block rendering until the previous fetch completes",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes fall{0%{transform:translateY(-10px);opacity:0}60%{opacity:1}100%{transform:translateY(0px);opacity:0.8}}.w1{animation:fall 1.8s ease-in infinite}.w2{animation:fall 1.8s ease-in infinite 0.6s}.w3{animation:fall 1.8s ease-in infinite 1.2s}</style><rect class="w1" x="20" y="18" width="80" height="14" rx="3" fill="var(--diagram-ink)"/><rect class="w2" x="30" y="42" width="60" height="14" rx="3" fill="var(--diagram-ink)" opacity="0.7"/><rect class="w3" x="40" y="66" width="40" height="14" rx="3" fill="var(--diagram-ink)" opacity="0.5"/><line x1="60" y1="32" x2="60" y2="42" stroke="var(--diagram-ink)" stroke-width="1.5" stroke-dasharray="3,2"/><line x1="60" y1="56" x2="60" y2="66" stroke="var(--diagram-ink)" stroke-width="1.5" stroke-dasharray="3,2"/></svg>`,
    definition: `A render waterfall occurs when a component fetches data, renders children only after that fetch completes, and those children each trigger their own fetches. Each layer waits for the one above it, creating cumulative latency proportional to the number of nesting levels. This is common in component trees where each component owns its own data fetching.\n\nSolutions include hoisting fetches to a parent that fires them all in parallel, using a router-level data loading layer (React Router loaders, Next.js getServerSideProps), or switching to a streaming server-side model where data and markup arrive incrementally.`,
    analogy: `It's like a restaurant where each waiter can only take your order after the previous table has been fully served and paid. Instead of serving tables in parallel, everyone waits in a single queue.`,
    examples: [
        { title: "Component-level fetch chain", text: "A page component fetches user data, then renders a Profile component that fetches settings, which renders an Avatar component that fetches the image URL — three serial round trips before the full page appears." },
        { title: "Parallel fetch hoisting", text: "Moving all three fetches into the route loader fires them concurrently: Promise.all([fetchUser(), fetchSettings(), fetchImage()]). Total latency is the longest individual fetch, not the sum of all three." }
    ],
    useCases: ["Diagnosing slow page loads caused by deeply nested data-fetching components", "Designing router-level data loading to parallelize fetches", "Justifying server components that co-locate data loading with rendering"],
    tradeoffs: {
        pros: ["Eliminating waterfalls via parallel loading can halve perceived load time", "Route-level loaders make data dependencies explicit and auditable", "Streaming SSR with Suspense converts sequential waterfalls into parallel streams"],
        cons: ["Hoisting fetches couples parent components to child data requirements", "Parallel fetches increase server load if each request is expensive", "Over-fetching at the route level can load data for components that conditionally never render"]
    },
    related: ["scheduler-priorities", "suspense-boundaries", "streaming-ssr", "server-components", "selective-hydration", "critical-rendering-path"]
},

{
    id: "edge-rendering",
    term: "Edge rendering",
    tagline: "Running server-side rendering at CDN edge nodes close to users rather than in a central origin server",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes ripple{0%{r:6;opacity:1}100%{r:28;opacity:0}}.rp{animation:ripple 2s ease-out infinite;}</style><circle cx="60" cy="60" r="8" fill="var(--diagram-ink)"/><circle class="rp" cx="60" cy="60" r="6" fill="none" stroke="var(--diagram-ink)" stroke-width="2"/><circle cx="20" cy="40" r="5" fill="var(--diagram-ink)" opacity="0.6"/><circle cx="100" cy="40" r="5" fill="var(--diagram-ink)" opacity="0.6"/><circle cx="20" cy="80" r="5" fill="var(--diagram-ink)" opacity="0.6"/><circle cx="100" cy="80" r="5" fill="var(--diagram-ink)" opacity="0.6"/><line x1="60" y1="52" x2="24" y2="44" stroke="var(--diagram-ink)" stroke-width="1.2" opacity="0.5"/><line x1="60" y1="52" x2="96" y2="44" stroke="var(--diagram-ink)" stroke-width="1.2" opacity="0.5"/><line x1="60" y1="68" x2="24" y2="76" stroke="var(--diagram-ink)" stroke-width="1.2" opacity="0.5"/><line x1="60" y1="68" x2="96" y2="76" stroke="var(--diagram-ink)" stroke-width="1.2" opacity="0.5"/></svg>`,
    definition: `Edge rendering runs HTML generation in CDN workers (Cloudflare Workers, Vercel Edge Runtime, Fastly Compute) that are geographically distributed near users. Instead of a request traveling to a central origin datacenter, it hits a nearby edge node that renders the page and returns HTML — often in under 50ms.\n\nEdge rendering suits content that varies per user (locale, A/B test, auth state) but cannot be fully statically cached, and where origin round-trip latency is a meaningful contributor to TTFB. Constraints include limited Node.js API surface, no filesystem access, and cold-start sensitivity in some runtimes.`,
    analogy: `It's the difference between a single central kitchen cooking for an entire city versus neighborhood pop-up kitchens each serving their local area. The food arrives faster because it doesn't have to travel as far.`,
    examples: [
        { title: "Personalized page at the edge", text: "A Cloudflare Worker reads a geo header and auth cookie, fetches user preferences from a nearby KV store, renders a personalized homepage HTML string, and returns it — all without hitting the origin server." },
        { title: "A/B testing without client flicker", text: "The edge worker reads the experiment bucket from a cookie and renders the correct variant server-side, avoiding the flash of incorrect content that client-side A/B tests cause before JavaScript runs." }
    ],
    useCases: ["Serving personalized or localized content with low TTFB globally", "Running auth-gated SSR without a round trip to a central server", "A/B testing and feature flagging without client-side flicker"],
    tradeoffs: {
        pros: ["Dramatically reduces TTFB for geographically distributed users", "Eliminates client-side flicker for personalization and A/B tests", "Scales horizontally across CDN PoPs without managing server infrastructure"],
        cons: ["Limited runtime environment — no native Node.js modules, restricted filesystem", "Cold starts add latency for infrequently hit routes", "Accessing centralized databases from the edge can negate the latency benefit"]
    },
    related: ["render-waterfalls", "streaming-ssr", "server-components", "speculative-prerendering", "critical-rendering-path", "lcp"]
},

{
    id: "micro-frontends",
    term: "Micro-frontend orchestration",
    tagline: "Composing a page from independently deployed UI fragments owned by separate teams",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes assemble{0%,100%{transform:translate(0,0)}50%{transform:translate(2px,-2px)}}.a{animation:assemble 2s ease-in-out infinite}.b{animation:assemble 2s ease-in-out infinite 0.5s}.c{animation:assemble 2s ease-in-out infinite 1s}</style><rect class="a" x="10" y="15" width="44" height="36" rx="3" fill="var(--diagram-ink)"/><rect class="b" x="66" y="15" width="44" height="36" rx="3" fill="var(--diagram-ink)" opacity="0.75"/><rect class="c" x="10" y="65" width="100" height="36" rx="3" fill="var(--diagram-ink)" opacity="0.5"/><text x="32" y="38" font-size="7" fill="#fff" text-anchor="middle">team A</text><text x="88" y="38" font-size="7" fill="#fff" text-anchor="middle">team B</text><text x="60" y="88" font-size="7" fill="#fff" text-anchor="middle">team C (shell)</text></svg>`,
    definition: `Micro-frontends split a web application into vertical slices, each owned by a different team with its own deployment pipeline, framework choice, and release cadence. An orchestrator (shell application) composes the slices at runtime via iframes, Web Components, module federation, or server-side include.\n\nModule federation (Webpack 5) is the dominant approach: each micro-frontend exposes modules from its own bundle, and the shell loads them at runtime without bundling them at build time. Teams deploy independently; the shell fetches the latest remote entry manifest on each page load.`,
    analogy: `It's like a newspaper where different sections (sports, business, opinion) are written and laid out by separate editorial teams, then assembled into one edition at print time. Each team owns their section end-to-end.`,
    examples: [
        { title: "Module federation shell", text: "A shell app defines remotes: { checkout: 'checkout@https://checkout.cdn.com/remoteEntry.js' }. At runtime it loads the checkout team's latest bundle without the shell team needing to rebuild or redeploy." },
        { title: "Web Component boundary", text: "The recommendations team ships <recs-widget> as a custom element with a shadow DOM. The shell places the tag in its layout; the recommendations team owns all CSS and state inside it, with no style leakage either direction." }
    ],
    useCases: ["Independent deployment of large application features by separate teams", "Incremental migration from a monolithic frontend to a new framework", "Isolating third-party widgets with their own release cycle from the host page"],
    tradeoffs: {
        pros: ["Teams deploy and scale independently without coordinating releases", "Enables gradual framework migration one slice at a time", "Failures in one micro-frontend can be isolated from the rest of the page"],
        cons: ["Duplicate framework bundles (multiple React instances) inflate page weight", "Cross-team shared state and routing require explicit contracts", "End-to-end testing across independently deployed services is significantly harder"]
    },
    related: ["module-federation", "web-components-interop", "custom-elements-lifecycle", "shadow-dom", "render-waterfalls", "scheduler-priorities"]
},

{
    id: "priority-inversion",
    term: "Priority inversion in async code",
    tagline: "A high-priority task is blocked waiting for a resource held by a lower-priority task",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes swap{0%{transform:translateY(0)}40%{transform:translateY(18px)}60%{transform:translateY(18px)}100%{transform:translateY(0)}.swapb{0%{transform:translateY(0)}40%{transform:translateY(-18px)}60%{transform:translateY(-18px)}100%{transform:translateY(0)}}}.ta{animation:swap 2s ease-in-out infinite;}.tb{animation:swap 2s ease-in-out infinite 0s reverse;}</style><rect class="ta" x="20" y="22" width="80" height="18" rx="3" fill="var(--diagram-ink)"/><rect class="tb" x="20" y="52" width="80" height="18" rx="3" fill="var(--diagram-ink)" opacity="0.5"/><text x="60" y="35" font-size="7" fill="#fff" text-anchor="middle">high priority (blocked)</text><text x="60" y="65" font-size="7" fill="#fff" text-anchor="middle">low priority (holds lock)</text><text x="60" y="100" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">inverted order</text></svg>`,
    definition: `Priority inversion occurs when a high-priority task cannot proceed because it is waiting on a resource, lock, or promise that is held or owned by a low-priority task. In JavaScript, this manifests when a high-priority microtask or render is queued behind a low-priority macro-task that hasn't yielded.\n\nCommon patterns: a user-blocking render awaiting a Promise created by an idle-priority data sync, or a React high-priority update blocked on a context value that is being set by a low-priority background subscription. Solutions include scheduler.yield(), priority inheritance, or redesigning the shared dependency to not block.`,
    analogy: `It's like a fire truck stuck behind a slow-moving street sweeper on a one-lane road. The sweeper has no way to let the truck pass, so the high-urgency vehicle is delayed by something that could have pulled over.`,
    examples: [
        { title: "Promise chain inversion", text: "An ImmediatePriority React update awaits a shared Promise that was created inside a background analytics flush. The analytics work holds the resolved value until it completes, starving the user-blocking render." },
        { title: "Context update inversion", text: "A high-priority input handler reads from a context whose provider is scheduled at NormalPriority. React cannot batch the input response until the provider's update has committed, inverting the intended priority order." }
    ],
    useCases: ["Diagnosing input jank in apps with shared async state between background and foreground work", "Designing priority-aware data-fetching pipelines that don't block high-priority renders", "Avoiding shared Promise chains between tasks of different scheduler priorities"],
    tradeoffs: {
        pros: ["Identifying priority inversion explains otherwise inexplicable jank under low CPU load", "scheduler.yield() lets long tasks voluntarily preempt themselves to unblock higher-priority work", "Isolating priorities in separate async chains prevents the problem structurally"],
        cons: ["Hard to observe without specialized profiler tooling that shows priority annotations", "Priority inheritance (promoting a task to unblock another) can cause other tasks to starve", "Over-splitting tasks into many small high-priority units re-creates starvation at a finer grain"]
    },
    related: ["scheduler-priorities", "task-starvation", "event-loop-tasks", "long-tasks", "tearing", "race-conditions", "concurrent-rendering"]
},

{
    id: "deterministic-rendering",
    term: "Deterministic rendering",
    tagline: "Given the same props and state, a component always produces the same output with no side effects during render",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes eq{0%,100%{opacity:1}50%{opacity:0.4}}.eq{animation:eq 1.6s ease-in-out infinite;}</style><rect x="10" y="30" width="40" height="30" rx="4" fill="var(--diagram-ink)" opacity="0.7"/><text x="30" y="50" font-size="10" fill="#fff" text-anchor="middle">f(s)</text><text class="eq" x="60" y="50" font-size="14" fill="var(--diagram-ink)" text-anchor="middle">=</text><rect x="70" y="30" width="40" height="30" rx="4" fill="var(--diagram-ink)" opacity="0.7"/><text x="90" y="50" font-size="10" fill="#fff" text-anchor="middle">f(s)</text><text x="60" y="90" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">same input, same output</text></svg>`,
    definition: `Deterministic rendering means a component is a pure function of its inputs: same props plus same state always yields the same JSX, with no mutations, random values, or observable side effects occurring during the render phase. React's concurrent mode relies on this — it may call render multiple times for the same update when time-slicing.\n\nNon-determinism in render (reading Date.now(), incrementing an external counter, writing to a ref) causes subtle bugs when React re-renders are triggered unexpectedly. StrictMode deliberately double-invokes render functions in development to surface these violations.`,
    analogy: `It's like a pure mathematical function. f(x) = x * 2 always returns the same result for the same x, no matter how many times you call it or in what order. A component render should work the same way.`,
    examples: [
        { title: "Non-deterministic render bug", text: "A component reads new Date() during render to set a 'last updated' label. With concurrent React, the double-invoke in StrictMode shows a two-millisecond gap between the two renders, confirming the non-determinism." },
        { title: "Fixing with useEffect", text: "Moving the Date.now() call into a useEffect with an empty dependency array fires it once after mount, keeping the render phase pure and deterministic." }
    ],
    useCases: ["Enabling concurrent React features that rely on interruptible, re-playable renders", "Simplifying testing — pure render functions are testable with just props and state", "Making server-side rendering output match client hydration without mismatches"],
    tradeoffs: {
        pros: ["Pure renders are trivially testable and predictable", "Required for React concurrent mode, time-slicing, and Suspense to work correctly", "StrictMode double-invoke detects violations cheaply in development"],
        cons: ["Moving all side effects to useEffect requires understanding the React lifecycle deeply", "Third-party libraries that mutate globals inside render break the guarantee silently", "Overly strict purity rules can complicate legitimate memoization patterns"]
    },
    related: ["concurrent-rendering", "fiber-architecture", "reconciliation-algorithm", "idempotent-ui", "tearing", "stale-closure", "time-slicing"]
},

{
    id: "idempotent-ui",
    term: "Idempotent UI actions",
    tagline: "An action that produces the same result whether it is applied once or multiple times",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes repeat{0%{transform:translateX(0);opacity:1}50%{transform:translateX(16px);opacity:0.5}100%{transform:translateX(0);opacity:1}}.rp{animation:repeat 1.8s ease-in-out infinite;}</style><rect x="30" y="44" width="60" height="28" rx="5" fill="var(--diagram-ink)"/><text x="60" y="62" font-size="9" fill="#fff" text-anchor="middle">submit</text><g class="rp"><line x1="20" y1="58" x2="28" y2="58" stroke="var(--diagram-ink)" stroke-width="2.5"/><polygon points="28,54 34,58 28,62" fill="var(--diagram-ink)"/></g><text x="60" y="96" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">1x = 2x = Nx</text></svg>`,
    definition: `An idempotent UI action is one where submitting it multiple times has the same effect as submitting it once. In practice, this means protecting mutations against duplicate execution caused by double-clicks, network retries, or optimistic update rollbacks that re-apply.\n\nPatterns include disabling the submit button after the first click, using a server-generated idempotency key in the request (so the server deduplicates), or making the underlying operation naturally idempotent (SET rather than INCREMENT). React's optimistic update pattern relies on rollback being idempotent when a mutation fails.`,
    analogy: `It's like a light switch versus a light dimmer. Pressing the switch once or a hundred times still leaves the light in the same state. A non-idempotent action is like a counter — each press changes the value.`,
    examples: [
        { title: "Idempotency key on a payment", text: "The client generates a UUID per checkout session and includes it as X-Idempotency-Key. If the network drops and the client retries, the server returns the original response rather than charging twice." },
        { title: "Disabling after first submit", text: "A form sets isSubmitting=true on first submit, disabling the button. Even if the user clicks rapidly or the network is slow, only one request fires. The button re-enables only on success or error." }
    ],
    useCases: ["Preventing duplicate charges or record creation from double-clicks or retries", "Designing mutation APIs that are safe to retry in offline-first apps", "Building optimistic updates that can be rolled back cleanly without compounding side effects"],
    tradeoffs: {
        pros: ["Idempotency keys offload duplicate detection to the server, making clients simpler", "Naturally idempotent operations (PUT, DELETE) eliminate entire retry-safety categories", "Makes optimistic update rollback straightforward — just revert to prior state"],
        cons: ["Generating and storing idempotency keys per request adds client-side complexity", "Server-side deduplication requires storage (cache or DB) with appropriate TTL", "Disabling UI during submission degrades UX for operations that legitimately need multiple submissions"]
    },
    related: ["optimistic-rollback", "race-conditions", "offline-conflict", "deterministic-rendering", "event-sourcing", "abortcontroller"]
},

{
    id: "accessibility-tree",
    term: "Accessibility tree",
    tagline: "A parallel representation of the DOM that assistive technologies use to navigate and announce page content",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes highlight{0%,100%{fill:var(--diagram-ink)}50%{fill:#6a7f6e}}.hl{animation:highlight 2s ease-in-out infinite;}</style><circle class="hl" cx="60" cy="22" r="8" fill="var(--diagram-ink)"/><circle cx="30" cy="55" r="7" fill="var(--diagram-ink)" opacity="0.8"/><circle cx="90" cy="55" r="7" fill="var(--diagram-ink)" opacity="0.8"/><circle cx="16" cy="85" r="6" fill="var(--diagram-ink)" opacity="0.6"/><circle cx="44" cy="85" r="6" fill="var(--diagram-ink)" opacity="0.6"/><circle cx="76" cy="85" r="6" fill="var(--diagram-ink)" opacity="0.6"/><circle cx="104" cy="85" r="6" fill="var(--diagram-ink)" opacity="0.6"/><line x1="60" y1="30" x2="34" y2="48" stroke="var(--diagram-ink)" stroke-width="1.5"/><line x1="60" y1="30" x2="86" y2="48" stroke="var(--diagram-ink)" stroke-width="1.5"/><line x1="30" y1="62" x2="20" y2="79" stroke="var(--diagram-ink)" stroke-width="1.5"/><line x1="30" y1="62" x2="42" y2="79" stroke="var(--diagram-ink)" stroke-width="1.5"/><line x1="90" y1="62" x2="78" y2="79" stroke="var(--diagram-ink)" stroke-width="1.5"/><line x1="90" y1="62" x2="102" y2="79" stroke="var(--diagram-ink)" stroke-width="1.5"/></svg>`,
    definition: `The browser builds an accessibility tree in parallel with the DOM, containing only elements that are meaningful to assistive technologies such as screen readers. Each node carries a computed accessible name, role, state (checked, expanded, disabled), and value. The tree omits presentational elements (role="presentation", aria-hidden="true") and generic containers with no semantic role.\n\nJavaScript-heavy SPAs frequently break the accessibility tree by rendering content into non-semantic containers, updating visible text without updating the accessible name, or removing focus from a modal's trigger when it closes. Tools like axe-core inspect the tree to surface these violations.`,
    analogy: `The accessibility tree is like the table of contents and chapter headings in a book. Sighted users can skim the visual layout, but someone listening to the book read aloud relies entirely on the structural outline to navigate.`,
    examples: [
        { title: "Custom button missing role", text: "A div styled as a button has no role='button' and no tabindex. It does not appear in the accessibility tree as interactive, so a keyboard or screen reader user cannot discover or activate it." },
        { title: "Dynamic content update", text: "A live search results region updates its children on each keystroke. Without role='status' or aria-live='polite', the screen reader never announces the new results even though they appear visually." }
    ],
    useCases: ["Auditing SPAs for screen reader compatibility using the accessibility tree in DevTools", "Verifying that dynamic DOM updates are reflected correctly in the tree", "Building custom interactive widgets (comboboxes, trees, dialogs) with correct ARIA roles and states"],
    tradeoffs: {
        pros: ["Semantic HTML populates the accessibility tree correctly with zero extra code", "Browser DevTools accessibility panel shows the computed tree for rapid inspection", "axe-core and similar tools automate tree validation in CI"],
        cons: ["Custom components built from divs and spans require extensive ARIA markup to be accessible", "JavaScript updates that only change visual style don't automatically update the tree", "aria-hidden misuse can hide interactive content from screen readers without any visual indication"]
    },
    related: ["aria-live-regions", "custom-elements-lifecycle", "shadow-dom", "web-components-interop", "deterministic-rendering"]
},

{
    id: "aria-live-regions",
    term: "ARIA live regions internals",
    tagline: "A mechanism that tells assistive technologies to announce DOM changes without the user explicitly navigating to them",
    category: "architecture",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><style>@keyframes wave{0%{r:6;opacity:1}100%{r:22;opacity:0}}.w1{animation:wave 1.6s ease-out infinite}.w2{animation:wave 1.6s ease-out infinite 0.5s}.w3{animation:wave 1.6s ease-out infinite 1s}</style><circle cx="60" cy="60" r="8" fill="var(--diagram-ink)"/><circle class="w1" cx="60" cy="60" r="6" fill="none" stroke="var(--diagram-ink)" stroke-width="2"/><circle class="w2" cx="60" cy="60" r="6" fill="none" stroke="var(--diagram-ink)" stroke-width="1.5"/><circle class="w3" cx="60" cy="60" r="6" fill="none" stroke="var(--diagram-ink)" stroke-width="1"/><text x="60" y="100" font-size="8" fill="var(--diagram-ink)" text-anchor="middle">aria-live announcement</text></svg>`,
    definition: `An ARIA live region (aria-live="polite" or aria-live="assertive") monitors a DOM subtree and instructs the screen reader to announce any text changes to the user, even without focus. Polite waits until the user finishes the current utterance; assertive interrupts immediately. aria-atomic="true" announces the entire region on any change; aria-relevant controls which change types (additions, removals, text) trigger announcements.\n\nCommon bugs: injecting content into a live region before it is mounted (announcements only fire for changes to an already-live region, not initial content), using assertive for non-urgent updates (causes announcement interruption fatigue), and nesting live regions (behavior is undefined across screen readers).`,
    analogy: `A live region is like a newsroom ticker that a radio announcer monitors. Whenever new text appears on the ticker, the announcer reads it aloud at the next available pause — or immediately if it is marked urgent — without the listener having to ask for an update.`,
    examples: [
        { title: "Status announcement after form submit", text: "A form submit success message is injected into a div with aria-live='polite'. The screen reader finishes reading the current field label, then announces 'Form submitted successfully' without the user navigating away." },
        { title: "Pre-rendering the live region", text: "The live region div is rendered empty on initial load. After the API responds, the message is set via textContent. If the div were added to the DOM at the same moment as the message, most screen readers would not announce it." }
    ],
    useCases: ["Announcing form validation errors that appear below the field after submission", "Reading status messages (save progress, search result count) without moving focus", "Announcing toast notifications to screen reader users who cannot see them visually"],
    tradeoffs: {
        pros: ["Provides screen reader users the same real-time feedback sighted users get from visual changes", "Polite mode avoids disrupting the current reading flow", "aria-atomic ensures partial updates read as coherent sentences, not fragmented words"],
        cons: ["Assertive mode interrupts all current speech, which is disruptive if overused", "Live regions must exist in the DOM before content is injected — easy to get wrong in SPAs", "Behavior varies across screen reader and browser combinations, requiring manual testing"]
    },
    related: ["accessibility-tree", "custom-elements-lifecycle", "deterministic-rendering", "suspense-boundaries", "event-loop-tasks"]
},


];
