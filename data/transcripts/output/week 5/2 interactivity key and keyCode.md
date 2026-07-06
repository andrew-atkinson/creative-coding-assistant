---
video_id: 2-interactivity-key-and-keycode
video_title: 2 interactivity key and keyCode
video_file: 2 interactivity key and keyCode.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2FInteractivity%2F2%20interactivity%20key%20and%20keyCode.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: Handling keyboard input in p5.js using literal character values versus physical key codes to manage complex user interactions and modifier keys.
concepts:
  - key
  - keyCode
  - The 'Catch-All' Pattern
  - Canvas Focus / Active Element
prerequisites:
  - basic p5.js setup
  - if/else conditional statements
  - stroke() function
leads_to:
  - complex input handling
  - game controls
  - event bubbling and browser interaction
---
# Interactivity: `key` and `keyCode`

In p5.js, interactivity isn't just about detecting *if* a key is pressed, but understanding exactly *which* key was pressed and how the browser interprets that input. This lesson explores the distinction between literal character input and physical key identification to create robust, professional-grade interactivity.

## Understanding Environmental Variables [00:50]

When a user interacts with the keyboard, p5.js provides access to "environmental variables" that describe the state of the keyboard. There are two primary ways to capture this data: `key` and `keyCode`.

By monitoring these variables in real-time, we can see how the browser perceives our inputs:
*   **`key`**: A string representing the literal character of the key pressed (e.g., `"a"`, `"R"`, or `"shift"`).
*   **`keyCode`**: A numerical value representing the specific physical key on the keyboard (e.g., `82` for the 'R' key).

The canvas shows these values updating live as you type, providing a visual scaffold for understanding how the software "sees" your hardware.

## Implementing Literal Logic with `key` [01:58]

You can use the `key` variable to trigger specific visual changes. For example, we can change the stroke color based on whether a user presses 'r', 'g', or 'b'.

```javascript
if (key === 'r') {
  stroke(255, 0, 0); // Red
} else if (key === 'g') {
  stroke(0, 255, 0); // Green
} else if (key === 'b') {
  stroke(0, 0, 255); // Blue
} else {
  stroke(255); // Default White
}
```

### The Importance of the "Catch-All" Pattern [03:26]
When using `if/else if` chains to control visual properties like `stroke()`, you must include a final `else` statement. 

**The Problem:** If no specific key is being pressed, the `key` variable becomes an empty string (`""`). Without a final `else` to set a default state, the sketch will simply retain whatever the last valid command was, or in some cases, lose its stroke entirely.
**The Solution:** Always implement a "catch-all" `else` to reset the state (e.g., `stroke(255)`) when no valid input is detected.

### The "Active Element" Requirement [04:33]
A common point of frustration is when code that *should* work fails to respond. If you press a key and nothing happens, ensure you have clicked on the canvas first. 

Because of **event bubbling**, the browser records events based on where they are directed. If the canvas is not the "active element," the browser may not pass those keyboard events to p5.js. Clicking the canvas gives it focus, allowing it to receive and process input.

## Solving Input Nuances with `keyCode` [05:34]

The `key` variable is highly sensitive to the state of modifier keys (like Shift) and case sensitivity. This creates a "human delay" problem during rapid typing.

### The Problem: Literal vs. Semantic Input [05:34]
When you press `Shift + R`, the browser records a sequence of events. Because humans cannot release two keys at the exact same microsecond, you might encounter these edge cases:
1.  You release `Shift` first $\rightarrow$ The browser registers a `"shift"` event.
2.  You release `R` first $\rightarrow$ The browser registers a `"r"` event.

Because `key` only records the *literal* last character received, your logic might break if you are specifically looking for an uppercase `"R"` but the browser momentarily registers a lowercase `"r"` or just the `"shift"` key.

### The Solution: Using Physical Key Codes [06:25]
To create robust interactivity that ignores case and modifier nuances, use `keyCode`. The `keyCode` for a physical key remains constant regardless of whether you are holding Shift or if the character is uppercase or lowercase.

| Key | `key` (Literal) | `keyCode` (Physical) |
| :--- | :--- | :--- |
| **R** | `"r"` or `"R"` | `82` |
| **G** | `"g"` or `"G"` | `71` |
| **B** | `"b"` or `"B"` | `66` |

By switching from character-based comparison to integer-based comparison, your code becomes much more reliable:

```javascript
// Robust implementation using keyCode
if (keyCode === 82) {
  stroke(255, 0, 0); // Red (works for 'r' or 'R')
} else if (keyCode === 71) {
  stroke(0, 255, 0); // Green
} else if (keyCode === 66) {
  stroke(0, 0, 255); // Blue
} else {
  stroke(255);       // Default White
}
```

By using `keyCode`, you move from "toy" code that is easily broken by human typing patterns to professional-grade event handling that accounts for the physical reality of how keyboards work.
