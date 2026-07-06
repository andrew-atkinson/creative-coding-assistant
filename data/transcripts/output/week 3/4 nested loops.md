---
video_id: 4-nested-loops
video_title: 4 nested loops
video_file: 4 nested loops.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%203%2F4%20nested%20loops.mp4"
week: week 3
topic: Implementing nested loops to create two-dimensional patterns and grids.
concepts:
  - nested loops
  - outer loop vs. inner loop
  - loop execution order
  - code indentation
prerequisites:
  - basic for loop syntax
  - variable assignment
  - p5.js drawing functions (rect, fill)
leads_to:
  - maps
  - procedural art generation
---
# Mastering Nested Loops for 2D Patterns

In previous lessons, we explored how a single `for` loop can repeat an action along one axis (like drawing a line of shapes). However, to create complex patterns like grids or matrices, we need to repeat actions across two dimensions: horizontally (X) and vertically (Y). This is achieved through **nested loops**.

## The Problem with Code Duplication [01:58]

If you want to create a grid of shapes, your first instinct might be to simply copy and paste an existing loop. For example, if you have a loop that draws rectangles horizontally:

```javascript
for (let x = 0; x < 400; x = x + 40) {
  rect(x, 0, 38, 38);
}
```

To make it go vertically as well, you might try to add a second loop manually:

```javascript
// The "Messy" Way: Duplicating code blocks
for (let x = 0; x < 400; x = x + 40) {
  rect(x, 0, 38, 38);
}

for (let y = 0; y < 400; y = y + 40) {
  rect(0, y, 38, 38); // This is hard to manage!
}
```

**The Insight:** Duplicating code is dangerous. If you decide to change the size of your shapes or the spacing between them, you have to remember to update every single loop manually. This is prone to error and becomes unmanageable as your patterns get more complex.

## Implementing Nested Loops [02:30]

Instead of duplicating code, we "nest" one loop inside another. This allows a single block of logic to handle both dimensions simultaneously.

### The Structure
A nested loop consists of an **outer loop** and an **inner loop**.

```javascript
for (let x = 0; x < 400; x = x + 40) { // Outer Loop
  for (let y = 0; y < 400; y = y + 40) { // Inner Loop
    // Code to execute for every combination of x and y
  }
}
```

When you use indentation (which can be automatically formatted using `Edit > Tidy Code` in the editor), you can clearly see which code belongs to the inner loop and which belongs to the outer loop.

### Creating a Dynamic Grid
By using the `x` and `y` variables inside the inner loop, we can draw a rectangle at every intersection of the grid. We can also use these variables to drive color changes, creating a gradient effect based on position.

```javascript
function setup() {
  createCanvas(400, 400);
  noStroke(); // Removes the outlines for a cleaner look
}

function draw() {
  background(255);

  for (let x = 0; x < 400; x = x + 40) {
    for (let y = 0; y < 400; y = y + 40) {
      // Use x and y to drive the color (Red, Green, Blue)
      fill(x, y, 0); 
      rect(x, y, 38, 38);
    }
  }
}
```

**Visualizing the Output:**
The canvas will display a grid of rectangles. Because `fill(x, y, 0)` is used:
* At the top-left corner $(0, 0)$, the color is black.
* As you move down the Y-axis, the green value increases, shifting the color toward red/orange.
* As you move across the X-axis, the red value increases, shifting the color toward yellow/green.

## Understanding the Order of Execution [04:13]

The most critical concept to grasp is how these loops interact. It can feel counterintuitive at first: **the inner loop must complete its entire cycle before the outer loop moves to its next step.**

1.  **Start Outer Loop:** The `x` value is set to $0$.
2.  **Enter Inner Loop:** The `y` value starts at $0$, then $40$, $80 \dots$ until it reaches the end of its condition.
3.  **Complete Inner Loop:** Once `y` hits $400$, the inner loop finishes.
4.  **Increment Outer Loop:** The code returns to the outer loop, which increments `x` from $0$ to $40$.
5.  **Restart Inner Loop:** The `y` loop starts all over again from $0$, but this time it is drawing at the new `x` position ($40$).

This "vertical" behavior (completing a full column before moving to the next) is why nested loops are so powerful for generating grids.

### Debugging with Text [09:39]
If you are ever unsure what your loops are doing, use `text()` to print the current values of your variables directly onto the canvas. This allows you to see exactly which coordinate pair is being processed at any given moment.

```javascript
fill(255); // White text for visibility
text("X: " + x + " Y: " + y, x + 5, y + 20);
```

## Summary & Challenge [11:08]

*   **Outer Loop:** Controls the primary axis (e.g., columns).
*   **Inner Loop:** Completes a full cycle for every single iteration of the outer loop (e.g., rows).
*   **Complexity:** You can nest multiple loops (three, four, or more) to create even higher-dimensional patterns.

**Challenge:** Try creating a nested loop that doesn't use rectangles. Experiment with different shapes (circles, lines) and see how changing the `fill()` or `stroke()` parameters based on `x` and `y` creates entirely new visual textures.
