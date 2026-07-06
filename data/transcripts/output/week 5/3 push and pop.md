---
video_id: 3-push-and-pop
video_title: 3 push and pop
video_file: 3 push and pop.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2Ftransformations%2F3%20push%20and%20pop.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: Managing graphics state and isolating transformations using push() and pop() to prevent unintended side effects in a sketch.
concepts:
  - push() and pop()
  - State Isolation
  - Order of Operations (Translate before Rotate)
prerequisites:
  - Basic drawing functions (rect, fill, stroke)
  - Understanding of the 2D coordinate system
  - Basic use of translate() and rotate()
leads_to:
  - Order of Operations
  - Complex hierarchical transformations
  - Nested coordinate systems
---
# Managing State with Push and Pop

In complex sketches involving multiple transformations, it is easy for one movement or style to "leak" into the rest of your drawing. To prevent this, you must use **state isolation**. In computer graphics, the `push()` and `pop()` functions allow you to create a local scope for your transformations and drawing attributes, ensuring that changes made to one object do not unintentionally affect others.

## The Problem: Transformation Pollution [00:09]

When you apply transformations like `rotate()` or `translate()`, they are cumulative. If you place a new shape in your code after a transformation command, that shape will inherit all the transformations applied previously.

Consider a scenario where you have a loop creating rotating rectangles:

```javascript
// Example of "Transformation Pollution"
function draw() {
  // A loop that rotates everything drawn within it
  for (let i = 0; i < 10; i++) {
    rotate(frameCount * 0.01);
    rect(0, 0, 50, 50);
  }

  // This rectangle is intended to be static at (50, 50)
  fill(255, 165, 0); // Orange
  rect(50, 50, 100, 20);
}
```

**The Issue:** Even though the orange rectangle is written outside of the `for` loop, it will still rotate. This happens because the rotation applied inside the loop remains active in the global coordinate system, affecting every subsequent drawing command.

## The Solution: Isolating State with Push and Pop [01:39]

To prevent this "pollution," you can wrap your transformations between `push()` and `pop()`. 

*   `push()`: Saves the current state of the coordinate system and drawing attributes (position, rotation, scale, fill, stroke, etc.).
*   `pop()`: Restores the state to exactly how it was when the last `push()` was called.

By wrapping the rotating loop in these functions, you isolate the rotation to only the objects inside that block:

```javascript
function draw() {
  // 1. The rotating loop is now isolated
  push(); 
    for (let i = 0; i < 10; i++) {
      rotate(frameCount * 0.01);
      rect(0, 0, 50, 50);
    }
  pop(); // The rotation "ends" here

  // 2. This rectangle is now stable and unaffected by the loop
  fill(255, 165, 0);
  rect(50, 50, 100, 20);
}
```

The canvas now shows the rotating rectangles spinning around their origin, while the orange rectangle remains perfectly still at `(50, 50)`.

## Controlling the Axis of Rotation [02:33]

A common mistake when using transformations is rotating an object around the global origin `(0, 0)` rather than its own center. To rotate an object around its own axis, you must follow a specific **order of operations**:

1.  **`push()`**: Isolate the transformation.
2.  **`translate(x, y)`**: Move the origin to the center of the object.
3.  **`rotate(angle)`**: Rotate the coordinate system.
4.  **Draw the object** at `(0, 0)` (since the origin has been moved to its center).
5.  **`pop()`**: Restore the state.

If you attempt to rotate without translating first, the object will swing around the corner of the canvas rather than spinning in place.

```javascript
push();
  // Move the origin to the center of the square (25, 25)
  translate(25, 25); 
  // Rotate around that new origin
  rotate(frameCount * 0.05); 
  // Draw the square relative to its new center
  rect(-25, -25, 50, 50); 
pop();
```

## Isolating Visual Styles [03:23]

`push()` and `pop()` do more than just manage geometry; they also encapsulate **drawing styles**. This includes properties like `fill()`, `stroke()`, and `noStroke()`.

If you want to draw a shape without an outline, but you don't want that "no stroke" rule to apply to every other shape in your sketch, you must isolate it:

```javascript
// Without push/pop, noStroke() would affect everything following it
push();
  noStroke(); 
  fill(255, 165, 0);
  rect(50, 50, 100, 20); // This rectangle has no outline
pop();

// Because of pop(), the next shape will automatically regain its stroke settings
rect(200, 50, 100, 20); 
```

By using `push()` and `pop()`, you can manage complex, nested environments where different objects have unique colors, line weights, and movement patterns without manually resetting every single property after every drawing command.
