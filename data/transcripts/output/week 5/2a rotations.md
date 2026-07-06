---
video_id: 2a-rotations
video_title: 2a rotations
video_file: 2a rotations.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2Ftransformations%2F2a%20rotations.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: Implementing rotational transformations in a 2D coordinate system and understanding the relationship between translation and rotation.
concepts:
  - rotate() function
  - angleMode(DEGREES)
  - rectMode(CENTER)
  - The Translation-Rotation Pattern
prerequisites:
  - Basic 2D drawing functions (rect, fill)
  - Understanding of the X and Y coordinate system
  - Knowledge of the translate() function
leads_to:
  - Compounding transformations
  - Scaling
  - Shearing
---
# Rotational Transformations and the Coordinate System

## Setting Up the Environment [00:25]
Before implementing rotation, it is helpful to configure the drawing environment to make manipulation more intuitive. This involves setting up color modes, angle modes, and rectangle alignment.

To make rotation easier to understand, we use `angleMode(DEGREES)`. By default, computer graphics environments often use radians, but switching to degrees allows us to work with the familiar 360-degree circle. Additionally, using `rectMode(CENTER)` ensures that the rectangle's origin is its geometric center rather than its top-left corner, which is vital for rotating an object around its own axis.

```javascript
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES); // Use degrees instead of radians for intuitive control
  rectMode(CENTER);   // Set the rectangle's origin to its center
}

function draw() {
  background(255, 100, 0); // A custom orange background
  noStroke();              // Remove the default outline
}
```

## The Mechanics of Rotation [01:41]
The `rotate()` function is used to turn the coordinate system. A common mistake is assuming that you are rotating the object itself; in reality, **you are rotating the coordinate system (the axes) upon which the object is drawn.**

If we rotate based on a variable like `mouseX`, the entire canvas's orientation changes.

```javascript
// Rotating based on mouse position
rotate(mouseX);
rect(50, 50, 50, 50);
```

### The Problem: Rotating Around the Origin [02:11]
When you apply `rotate()` without any other transformations, the object rotates around the canvas origin $(0, 0)$. If your rectangle is drawn at $(50, 50)$, it will not spin in place; instead, it will "swing" around the top-left corner of the canvas like a pendulum.

## The Translation-Rotation Pattern [02:27]
To make an object rotate around its own center, you must move the origin to that object's location before applying the rotation. This is achieved through a specific sequence of transformations:

1.  **`translate(x, y)`**: Move the origin $(0, 0)$ to the desired location (e.g., the center of the canvas).
2.  **`rotate(angle)`**: Rotate the newly moved coordinate system.
3.  **Draw at $(0, 0)$**: Draw the shape at the new origin so that its local center aligns with the transformed axis.

```javascript
// Correct way to rotate an object around its own center
translate(width/2, height/2); // Move origin to the middle of the canvas
rotate(angle);                // Rotate the coordinate system
rect(0, 0, 50, 50);           // Draw at the new (0,0) to spin in place
```

### Visualizing Local vs. Global Rotation [04:13]
To prove that rotation affects the coordinate system and not just the shape, we can draw two different rectangles after a single transformation.

The first rectangle is drawn at $(0, 0)$. Because the origin was translated to the center of the canvas, this rectangle rotates perfectly around its own axis.

The second rectangle is drawn at $(50, 50)$. Even though it is a separate shape, it does not rotate around its own center; instead, it orbits the new origin $(0, 0)$ because it is being drawn at an offset from the transformed axis.

```javascript
function draw() {
  background(255, 100, 0);
  angleMode(DEGREES);
  rectMode(CENTER);

  let angle = 0;
  angle += 1; // Incrementing the angle for continuous motion

  translate(width/2, height/2);
  rotate(angle);

  // This rectangle rotates around its own center
  fill(255);
  rect(0, 0, 50, 50);

  // This rectangle orbits the center of the canvas
  fill(255, 255, 0);
  rect(50, 50, 50, 50);
}
```

**Visual Result:**
*   The **white rectangle** stays in one spot but spins.
*   The **yellow rectangle** maintains its orientation relative to the white one, but both move in a circular path around the center of the canvas.
