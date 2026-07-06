---
video_id: 1-interactivity-environment-variables
video_title: 1 interactivity environment variables
video_file: 1 interactivity environment variables.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2FInteractivity%2F1%20interactivity%20environment%20variables.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: "Introduction to interactivity using environmental variables like mouse position, previous mouse position, and boolean states for mouse and keyboard input."
concepts:
  - mouseX and mouseY
  - pmouseX and pmouseY
  - mouseIsPressed
  - keyPressed
  - Visual Persistence
prerequisites:
  - Basic understanding of setup() and draw() loops
  - Fundamental knowledge of if/else conditional statements
  - Basic understanding of coordinate systems (X and Y)
leads_to:
  - Handling specific key codes
  - Sophisticated mouse event listeners
  - Complex interactive systems
---
# Introduction to Interactivity and Environmental Variables

Interactivity in creative coding is driven by **environmental variables**—system-defined values that track user input in real-time. By using these variables as parameters for geometric functions, you can bridge the gap between user intent and visual output.

## Spatial Tracking: Mouse Position [00:20]

The most fundamental environmental variables are `mouseX` and `mouseY`. These provide the current $x$ and $y$ coordinates of the cursor.

### Basic Movement
By passing these variables into a shape function, you can create objects that follow the cursor:

```javascript
function draw() {
  // A circle that follows the mouse
  circle(mouseX, mouseY, 50);
}
```

### Mathematical Mapping [01:00]
You can use arithmetic operations on these variables to create dynamic, reactive behaviors. For example, calculating the difference between `mouseX` and `mouseY` can drive the size of a shape:

```javascript
function draw() {
  // The circle size changes based on the cursor's position relative to the diagonal
  let dynamicSize = (mouseX - mouseY); 
  circle(mouseX, mouseY, dynamicSize);
}
```

**Insight: The Diagonal Center**  
When using `mouseX - mouseY` to determine size, the shape will shrink to zero at the diagonal where $x = y$ (e.g., 400, 400) and reach its maximum size at the opposite corners (e.g., 400, 0).

## Creating Continuous Paths [01:45]

To create a drawing effect rather than just a single moving point, you need to track the history of the mouse movement. This is achieved using `pmouseX` and `pmouseY`.

### The Frame-Delay Mechanism [02:52]
The system tracks the mouse position for every frame. At the end of a frame, the current `mouseX` and `mouseY` values are copied into `pmouseX` and `pmouseY`. At the start of the next frame, new values are captured. This means `pmouse` variables always represent where the mouse was in the **previous frame**.

By drawing a line between the previous position and the current position, you create a continuous path:

```javascript
function draw() {
  strokeWeight(10);
  // Draw a line from the previous frame's position to the current position
  line(pmouseX, pmouseY, mouseX, mouseY);
}
```

**Tip: Visualizing the Logic**  
If you are debugging coordinate history, reducing the frame rate (e.g., `frameRate(10)`) makes the "jump" between the previous and current frame visible, making it easier to understand how the system is calculating the path.

## State Monitoring: Boolean Triggers [03:39]

Interactivity isn't just about *where* the user is, but also the *state* of their input. This is handled via **boolean variables**, which return either `true` or `false`.

*   `mouseIsPressed`: Returns `true` if the mouse button is currently held down.
*   `keyPressed`: Returns `true` if any key on the keyboard is currently held down.

### Implementing Persistence [04:31]
By default, the `background()` function in the `draw()` loop clears the canvas every frame. If you want to create a drawing program where lines persist, move `background()` into the `setup()` function. This prevents the canvas from being wiped, allowing previous frames to remain visible.

### Combining Inputs for Complex Behavior [06:34]
You can use `if/else` statements to create branching logic based on multiple simultaneous inputs.

```javascript
function setup() {
  createCanvas(400, 400);
  background(255); // Background is drawn only once in setup to allow persistence
}

function draw() {
  if (mouseIsPressed) {
    // If clicking, draw circles
    fill(0); 
    circle(mouseX, mouseY, 20);
  } else {
    // If NOT clicking, draw a line
    stroke(0);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }

  // Secondary input: Change color based on keyboard state
  if (keyPressed) {
    fill(0); // Black if any key is held
  } else {
    fill(255); // White otherwise
  }
}
```

**Visual Logic Summary:**
*   **Mouse Held + No Key:** Draws a black circle.
*   **Mouse Released:** Draws a continuous line.
*   **Key Held + Mouse Held:** The circle color changes (e.g., from white to black) based on the `keyPressed` condition.

### Debugging with Console Logs [08:25]
To verify the state of these variables during runtime, you can use `console.log()`. This is particularly useful for checking if multiple boolean conditions are being met simultaneously:

```javascript
console.log(mouseIsPressed, keyPressed);
```
