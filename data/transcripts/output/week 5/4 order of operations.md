---
video_id: 4-order-of-operations
video_title: 4 order of operations
video_file: 4 order of operations.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2Ftransformations%2F4%20order%20of%20operations.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: "The impact of transformation order on coordinate systems, specifically how the sequence of translate() and rotate() affects whether an object rotates around its own center or orbits the origin."
concepts:
  - order of operations
  - transforming the canvas
  - local vs. global rotation
prerequisites:
  - basic 2D coordinates (x, y)
  - understanding of translate()
  - understanding of rotate()
leads_to:
  - scaling
  - shearing
  - hierarchical modeling
---
# The Importance of Transformation Order

In computer graphics, transformations are non-commutative. This means that the sequence in which you apply functions like `translate()`, `rotate()`, and `scale()` fundamentally changes the final position and orientation of your objects. Understanding this is a shift from thinking about "moving an object" to understanding that you are actually **transforming the entire coordinate system (the canvas).**

## The Problem: Rotating Before Translating [00:09]

When you apply a rotation before a translation, the object does not rotate around its own center. Instead, it orbits the global origin $(0,0)$.

### The Setup
To demonstrate this, we set up a canvas where the rectangle is drawn at $(0,0)$ with its center aligned to that point. We also use `angleMode(DEGREES)` for easier calculation and a variable `angle` to drive the rotation.

```javascript
let angle = 0;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  fill('orange');

  // 1. Rotate first
  rotate(angle);
  
  // 2. Translate second
  translate(width / 2, height / 2);

  rect(0, 0, 100, 100);
  angle++;
}
```

### The Result: Orbital Movement [01:29]
When this code runs, the rectangle does not spin in place. Instead, it swings wildly around the top-left corner of the screen. 

**Why does this happen?**
By calling `rotate()` first, you are rotating the entire coordinate system around the global origin $(0,0)$. When you subsequently call `translate(width/2, height/2)`, you are moving the object along a coordinate system that is already spinning. Consequently, the "middle of the screen" is constantly moving in a circular path around the origin.

## The Solution: Translating Before Rotating [01:57]

To make an object rotate around its own axis (its local origin), you must move the coordinate system to the object's desired position *before* applying any rotation.

### The Correct Sequence
By reversing the order, we redefine the origin to be at the center of our shape before the rotation is applied.

```javascript
function draw() {
  background(220);
  fill('orange');

  // 1. Translate first (Move the origin to the center)
  translate(width / 2, height / 2);

  // 2. Rotate second (Rotate around the new origin)
  rotate(angle);

  rect(0, 0, 100, 100);
  angle++;
}
```

### The Result: Local Axis Rotation [02:04]
The canvas now shows a square spinning perfectly in place at the center of the screen. 

**Why does this work?**
By calling `translate()` first, you move the origin $(0,0)$ from the top-left corner to the center of the screen. When `rotate()` is called next, it rotates the coordinate system around this *new* origin. Because the rectangle is drawn at $(0,0)$ (which is now the center of the screen), it rotates around its own axis.

## Summary Rule of Thumb [02:38]

While creative experimentation may lead to different results, the standard workflow for manipulating an object in space is:

1.  **`translate()`**: Move the origin to the target location.
2.  **`rotate()` / `scale()` / `shear()`**: Apply transformations relative to that new origin.

| Order | Visual Result | Conceptual Logic |
| :--- | :--- | :--- |
| **Rotate $\rightarrow$ Translate** | Orbital movement (swings around origin) | Rotating the canvas, then moving a point on that rotating canvas. |
| **Translate $\rightarrow$ Rotate** | Local rotation (spins in place) | Moving the origin to the object, then rotating around that new origin. |
