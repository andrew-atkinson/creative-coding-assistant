---
video_id: 4-keyboard-events
video_title: 4 keyboard events
video_file: 4 keyboard events.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2FInteractivity%2F4%20keyboard%20events.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: Implementing keyboard interactivity using event-driven programming to trigger visual changes in a creative coding environment.
concepts:
  - keyboard events
  - keyTyped() function
  - key variable
  - modifier keys
  - if / else if / else chain
prerequisites:
  - Basic JavaScript syntax (if/else)
  - p5.js setup and draw functions
  - Basic understanding of RGB color values
leads_to:
  - Complex user interface (UI) design
  - Game development controls
  - State-based interactive art
---
# Keyboard Events and Event-Driven Logic

## Understanding Keyboard Events [00:00]

In creative coding, interactivity can be driven by continuous polling or discrete events. While mouse movements are often checked constantly every frame, keyboard interactions are typically **event-driven**. This means the code only executes a specific block of logic when the browser registers that a key has been pressed.

The most intuitive function for handling character input is `keyTyped()`. This function aligns with natural human behavior: you press a key, and the event is triggered once.

### Character Keys vs. Modifier Keys [02:31]
It is important to distinguish between keys that produce a character and "modifier" keys. 

*   **Character Keys:** Keys like 'R', 'G', or 'F' trigger the `keyTyped()` event and provide a value through the `key` variable.
*   **Modifier Keys:** Keys such as **Shift**, **Ctrl**, or the **Arrow keys** do not trigger `keyTyped()` because they do not produce a printable character.

To debug what the computer is actually "seeing" when you press a key, you can use `console.log()` to print the value of the `key` variable to the browser's developer console.

```javascript
function keyTyped() {
  console.log("Key pressed: " + key);
}
```

## Implementing State with Conditional Logic [01:01]

When using keyboard events to change visual properties—like the color of a shape—you can use the `key` variable within an `if/else if/else` structure. This allows you to map specific keys to specific visual states.

### The Importance of Control Flow [03:14]
A common mistake is using multiple, independent `if` statements. If you use separate `if` blocks for every key and then add a "default" `fill()` at the end, the default will execute every single frame, effectively overriding your intended color.

#### The Incorrect Approach (Independent `if` statements)
In this example, the final `else` is not actually a "fallback" for the previous conditions; it's just another independent check. If you use separate `if` statements, the logic becomes brittle and difficult to control.

```javascript
// INCORRECT: This structure makes it hard to set a reliable default
function keyTyped() {
  if (key === 'r') {
    fill(240, 20, 50); // Reddish
  }
  if (key === 'g') {
    fill(0, 240, 150); // Greenish
  }
  // This will likely override previous logic or cause unexpected behavior
  else {
    fill(0); 
  }
}
```

#### The Correct Approach (Stacked `if/else if/else`)
To create a robust interaction with a "fallback" state, you must stack your conditions. This creates a single logical chain: the computer checks the first condition; if it's false, it moves to the next; if *none* of them are true, it executes the final `else` block.

```javascript
// CORRECT: This creates a reliable fallback mechanism
function keyTyped() {
  if (key === 'r') {
    fill(240, 20, 50); // Reddish
  } else if (key === 'g') {
    fill(0, 240, 150); // Greenish
  } else {
    fill(0); // Fallback: Black if any other key is pressed
  }
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255); // Clear background to see the change
  if (mouseIsPressed) {
    circle(mouseX, mouseY, 30);
  }
}
```

### Visual Feedback and Persistence [01:45]
In the code above, we call `fill()` inside the `keyTyped()` function. Because `keyTyped()` only runs once per keystroke, we are changing the "state" of the color. Once `fill()` is called, that color persists for all subsequent shapes drawn in the `draw()` loop until a new key is pressed to change it. This is an efficient way to manage visual states in interactive art.
