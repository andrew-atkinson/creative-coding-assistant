---
video_id: 3-mouse-events
video_title: 3 mouse events
video_file: 3 mouse events.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2FInteractivity%2F3%20mouse%20events.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: "Understanding mouse-driven interactivity in p5.js, specifically the distinction between continuous state polling and discrete event-driven functions."
concepts:
  - State Polling (mouseIsPressed)
  - Event-Driven Functions (mouseClicked, mousePressed, etc.)
  - The Mouse Click Lifecycle
prerequisites:
  - Basic p5.js setup (setup and draw functions)
  - Understanding of coordinate systems (mouseX, mouseY)
  - Basic JavaScript syntax and function declarations
leads_to:
  - Keyboard events
  - Complex UI/UX design in creative coding
  - Game logic and collision detection
---
# Mouse Events and Interactivity in p5.js

In interactive programming, user input is handled through **events**. An event is a specific occurrence triggered by the user, such as clicking a button, releasing a mouse button, or hovering a cursor over an element.

## Understanding Mouse Events [00:03]

In a web browser, various events occur as you interact with the interface. Common examples include:
*   **Mouse Over:** Triggered when the cursor enters an element's boundary.
*   **Mouse Out:** Triggered when the cursor leaves an element's boundary.
*   **Clicking/Releasing:** Triggered when the mouse button is pressed or released.

In p5.js, these events can be "hooked up" to specific code blocks, allowing the program to respond dynamically to user behavior.

## State Polling vs. Event-Driven Programming [01:13]

There are two fundamental ways to handle mouse interaction: checking the current **state** of the mouse or responding to a discrete **event**.

### Continuous State Polling (The `draw()` loop)
You can use the built-in boolean variable `mouseIsPressed` inside the `draw()` function. Because `draw()` runs continuously (usually 60 times per second), the program is constantly asking: *"Is the mouse currently being held down?"*

```javascript
function draw() {
  if (mouseIsPressed) {
    // This code runs every single frame that the button is held down.
    line(0, mouseY, mouseX, mouseY);
  }
}
```

**The Limitation:** Because this is checked every frame, it is "continuous." If you use `mouseIsPressed` to draw a line, the program draws a new segment every frame. This is useful for drawing tools but isn't suitable for actions that should only happen once per click.

### Discrete Event-Driven Functions
Unlike the `draw()` loop, event functions are called by p5.js only at the exact moment the interaction occurs. These functions exist **outside** of the `draw()` loop.

| Function | Behavior |
| :--- | :--- |
| `mousePressed()` | Triggered once at the moment the button is pressed down. |
| `mouseReleased()` | Triggered once at the moment the button is released. |
| `mouseClicked()` | Triggered only if a press and release occur on the same element. |
| `mouseDoubleClicked()` | Triggered upon rapid successive clicks. |

### The Logic of a "Click" [02:37]
A `mouseClicked` event is more complex than a simple press. For a click to register, three things must happen within the same boundary:
1.  The mouse must be hovering over the element (**Mouse Over**).
2.  The button must be pressed down (**Press**).
3.  The button must be released (**Release**) while still over that same element.

If you press the mouse down on one object, move your cursor away, and then release, a `mouseClicked` event will **not** trigger. However, the `mouseReleased()` function *will* still trigger because the release itself is a discrete event.

## Implementation and Temporal Logic [03:29]

The following code demonstrates the difference in how these functions execute. Note that `mouseClicked` and `mouseReleased` are defined as standalone functions, not inside the `draw()` loop.

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  // Continuous check: runs every frame while held
  if (mouseIsPressed) {
    line(0, mouseY, mouseX, mouseY);
  }
}

// Event-driven: runs exactly once per click event
function mouseClicked() {
  line(0, mouseY, mouseX, mouseY);
}

// Event-driven: runs exactly once per release event
function mouseReleased() {
  line(width, mouseY, mouseX, mouseY);
}

// Event-driven: runs once upon a double click
function mouseDoubleClicked() {
  circle(width/2, height/2, width);
}
```

### Key Technical Insights:
*   **Execution Flow:** The `draw()` loop is a continuous cycle of "checking" state. Event functions (like `mouseClicked`) are triggered by the system and run once, often after a frame has finished processing.
*   **Coordinate Systems:** When using event functions to draw, you can use `mouseX` and `mouseY` to capture the exact position where the event occurred.
*   **The Iframe Context:** In many web environments, all mouse events are considered to be happening within the "boundary" of the canvas (the iframe). If you click anywhere on the canvas and release, a `mouseReleased` event will trigger.
