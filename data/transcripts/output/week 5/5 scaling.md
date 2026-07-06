---
video_id: 5-scaling
video_title: 5 scaling
video_file: 5 scaling.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2Ftransformations%2F5%20scaling.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: "Using the scale function to resize shapes and coordinate systems, including uniform scaling, non-uniform stretching, dynamic interactivity with mouse movement, and using negative values to mirror or invert elements."
concepts:
  - scale() function
  - Uniform vs. Non-uniform Scaling
  - Dynamic Scaling
  - Coordinate Inversion (Mirroring)
  - Isolating Transformations with push() and pop()
prerequisites:
  - Basic 2D coordinate system (X and Y axes)
  - Understanding of the origin (0,0)
  - Knowledge of translate() and rotate()
leads_to:
  - Complex transformation compositions
  - Advanced interactive animations
  - Matrix transformations
---
# Understanding Scaling Transformations

Scaling is a fundamental transformation that allows you to stretch or compress the coordinate system. While translation moves the origin and rotation turns it, scaling changes the magnitude of the dimensions within that system.

## The Mechanics of Scaling [01:21]

When you apply a scale transformation, it is important to remember that **transformations are organized around the origin**. If you want to scale an object in place, you must first translate the coordinate system to the center of that object.

```javascript
// Move origin to the center of the canvas
translate(width / 2, height / 2);

// Set rectMode to center so the rectangle is drawn relative to the new origin
rectMode(CENTER);

// Draw a 100x100 rectangle at the new origin
rect(0, 0, 100, 100);

// Scale the entire coordinate system by a factor of 2
scale(2);
```

### The Side Effect: Scaling the Stroke
A critical insight when working with `scale()` is that you are not just resizing a shape; **you are transforming the entire coordinate system.** This includes the `strokeWeight`. 

When you apply `scale(2)`, a rectangle with a stroke weight of 1 will appear to have a stroke weight of 2. The thickness of the lines is scaled along with the geometry of the shape.

## Uniform vs. Non-Uniform Scaling [02:07]

The `scale()` function can be used with one or two parameters, which determines how the dimensions are affected.

### Uniform Scaling
Providing a single argument scales both the X and Y axes by that same factor.
```javascript
scale(2); // Both width and height are doubled
```

### Non-Uniform Scaling
Providing two arguments allows you to scale the X and Y axes independently. This results in stretching or compressing the object along a specific axis.
```javascript
scale(2, 1); // Stretches the object laterally (X) but keeps height (Y) constant
```

When scaling non-uniformly, the stroke weight is also distorted. In a lateral stretch (`scale(2, 1)`), horizontal lines will appear thinner relative to the shape's new width, while vertical lines will appear thicker.

### Dynamic Scaling [02:35]
You can map system variables to the scale factor to create interactive effects. For example, using `mouseX` allows you to control the stretch of an object based on mouse position.

```javascript
// Maps mouseX (0 to 400) to a scale factor of 0 to 2
scale(mouseX / 200, 1);
```

## State Management with Push and Pop [03:43]

Because transformations are additive, they "leak" into subsequent drawing commands. To prevent a scale or rotation from affecting every object drawn afterward, you must use `push()` and `pop()`.

*   `push()`: Saves the current state of the coordinate system (translation, rotation, scale, etc.).
*   `pop()`: Restores the last saved state.

By wrapping a transformation in `push()` and `pop()`, you **encapsulate** that transformation, ensuring it only applies to the specific object you are drawing.

```javascript
push(); // Save state before transformations
  translate(width / 2, height / 2);
  scale(2);
  rect(0, 0, 100, 100);
pop(); // Restore state so the next object isn't scaled by 2
```

## Coordinate Inversion (Mirroring) [04:33]

One of the most powerful uses of scaling is **inversion**. By using a negative scale factor, you flip the coordinate system.

### Mirroring with Negative Scale
Applying a scale of `-1` to an axis flips the orientation of everything drawn in that space.
*   `scale(1, -1)`: Flips the Y-axis (vertical mirror).
*   `scale(-1, 1)`: Flips the X-axis (horizontal mirror).

```javascript
push();
  scale(1, -1); // Inverts the Y-axis
  text("Scale", 0, 0); // The text will appear upside down
pop();
```

### Compounding Transformations [07:04]
Scaling can be combined with rotation to create complex, non-linear visual behaviors. When transformations are nested within `push()` and `pop()`, they can act on each other to create sophisticated animations.

```javascript
push();
  scale(2);
  rotate(frameCount, DEGREES); // Rotate while scaled
  rect(0, 0, 100, 100);
pop();
```
