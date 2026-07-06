---
video_id: 1-introduction-to-transformations-and-translate
video_title: 1 introduction to transformations and translate
video_file: 1 introduction to transformations and translate.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2Ftransformations%2F1%20introduction%20to%20transformations%20and%20translate.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: "Introduction to 2D geometric transformations, specifically focusing on how the translate() function manipulates the coordinate system rather than just moving objects."
concepts:
  - transformations
  - translate()
  - coordinate system manipulation
prerequisites:
  - Basic understanding of 2D Cartesian coordinate systems (x and y axes)
  - Knowledge of basic drawing primitives like circles and rectangles
leads_to:
  - rotations
  - scaling
  - shearing
  - push and pop (state management)
---
# Understanding Transformations: The Coordinate System Paradigm

Transformations are the fundamental operations used to manipulate shapes within a digital canvas. While they may appear to be simple commands to move or resize objects, they actually function by altering the underlying coordinate system upon which all drawing operations are performed.

## The Core Transformation Commands [00:06]

There are four primary types of transformations used in 2D graphics:

*   **Translate:** Moves the coordinate system laterally (shifting the origin).
*   **Rotate:** Rotates the entire coordinate system around its origin.
*   **Scale:** Changes the size of objects by stretching or shrinking them along the X and Y axes.
*   **Shear:** Distorts objects by stretching them in different directions along the X and Y axes.

## The Paradigm Shift: Moving the System, Not the Object [01:02]

The most critical concept in understanding transformations is recognizing that you are not moving the objects themselves; you are **moving the coordinate system**.

By default, a canvas uses a standard Cartesian grid where the origin $(0, 0)$ is located at the top-left corner. The X-axis increases to the right, and the Y-axis increases as you move down.

### Why Translation is Essential [03:05]
If your only goal is to move a shape from one side of the screen to another, you could simply change its $x$ and $y$ coordinates. For example:
```javascript
// Moving an object by changing its position parameters
rect(200, 200, 50, 50); 
```

However, this approach fails when you introduce **rotation**. All rotations occur around the current origin $(0, 0)$. If you want to rotate a shape around its own center rather than the corner of the screen, you must first use `translate()` to move the origin to that shape's center.

## Implementing Translation [04:10]

The `translate(x, y)` function shifts the origin of the coordinate system to a new location defined by the $x$ and $y$ values provided.

### Moving the Origin with the Mouse [04:21]
A common way to visualize this is by setting the origin to follow the mouse pointer. When the origin is moved, any shape drawn at $(0, 0)$ will appear to follow the mouse.

```javascript
function draw() {
  background(220);
  
  // Move the origin to the mouse position
  translate(mouseX, mouseY);
  
  // Draw a rectangle at the new origin (0, 0)
  rect(0, 0, 50, 50);
}
```

**Visualizing the Result:**
In this setup, the rectangle appears to "stick" to the mouse cursor. Even though the code says `rect(0, 0...)`, the rectangle is actually being drawn at whatever coordinate the mouse happens to be. The "canvas" itself has been shifted so that $(0, 0)$ is now located at the mouse's position.

### Relative Positioning [04:52]
Once you have translated the origin, you can draw objects relative to that new $(0, 0)$ point. For example, if the origin is at the mouse position, drawing a rectangle at $(-50, -50)$ will place it 50 pixels to the left and 50 pixels above the mouse.

```javascript
translate(mouseX, mouseY);
rect(-50, -50, 50, 50);
```

This ability to redefine the "center" of your world is what enables complex animations, such as rotating an object around its own center or scaling a group of objects from a specific focal point.
