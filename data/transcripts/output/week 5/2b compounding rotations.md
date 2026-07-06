---
video_id: 2b-compounding-rotations
video_title: 2b compounding rotations
video_file: 2b compounding rotations.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2Ftransformations%2F2b%20compounding%20rotations.mp4"
week: week 5
module: Module 2 – Chaos and Control
topic: Understanding compounding transformations through iterative loops to create complex geometric patterns.
concepts:
  - compounding rotation
  - stateful transformations
  - visual scaffolding
prerequisites:
  - Basic for loop syntax
  - Understanding of the 2D coordinate system
  - Basic use of the rotate() function
leads_to:
  - push() and pop() for local transformations
  - Stack management in graphics
---
# Compounding Transformations and Cumulative Rotation

In digital graphics, transformations like `rotate()` or `scale()` affect the entire coordinate system. When you apply a rotation, every subsequent shape drawn in that frame will be subject to that transformation until the coordinate system is reset. While this is useful for rotating an entire scene, it presents a challenge when you want individual objects to behave differently—such as rotating at different speeds or in different directions.

## Moving from Global to Local Transformations [00:00]

When a transformation is applied outside of any loop or conditional logic, it acts on the "global" coordinate system. 

```javascript
// Global rotation: everything drawn after this will be rotated
rotate(angle); 
rect(0, 0, 100, 100);
```

The limitation of this approach is that you cannot easily create variety. If you want multiple objects to rotate at different speeds or in different directions, applying a single rotation to the entire canvas is insufficient.

## Creating Compounded Rotations with Loops [01:01]

To create complex geometric patterns, you can use a `for` loop to apply transformations iteratively. However, the **placement** of the transformation command within that loop is critical.

### The "Single State" Approach (Non-Cumulative)
If you rotate the coordinate system *before* entering the loop, every object is drawn at the same angle.

```javascript
rotate(angle); // The coordinate system rotates once
for (let i = 0; i < 5; i++) {
  rect(0, 0, 100 * i, 100 * i); // All rectangles share the same rotation
}
```

### The "Compounded" Approach (Cumulative)
If you move the `rotate()` command *inside* the loop, each iteration adds to the current state of the coordinate system. This results in **compounded** or **cumulative rotation**.

```javascript
for (let i = 0; i < 5; i++) {
  rotate(0.2); // Each iteration adds 0.2 radians to the current rotation
  rect(0, 0, 100 * i, 100 * i);
}
```

#### How Cumulative Rotation Works
In the compounded approach, the rotation is not being set to a specific absolute angle; rather, it is adding an increment to whatever the current rotation state is. 

If we use an increment of `0.2`:
1. **Iteration 1:** Current rotation is $0$. We rotate by $0.2$. The first rectangle is drawn at **$0.2$ radians**.
2. **Iteration 2:** Current rotation is $0.2$. We rotate by another $0.2$. The second rectangle is drawn at **$0.4$ radians**.
3. **Iteration 3:** Current rotation is $0.4$. We rotate by another $0.2$. The third rectangle is drawn at **$0.6$ radians**.

The canvas shows a series of nested rectangles where each subsequent shape is rotated slightly more than the last.

## Visualizing Depth and Motion [03:40]

By combining scaling (using the loop index `i`) and cumulative rotation, you can create an "illusory moment." 

```javascript
noFill(); // Use noFill to see the overlapping lines clearly
for (let i = 0; i < 15; i++) {
  rotate(0.2);
  rect(0, 0, 100 * i, 100 * i);
}
```

When you increase the size of the rectangles using `100 * i` and apply cumulative rotation, an optical illusion occurs: **the inner rectangles appear to rotate slower than the outer ones.** 

This is not actually happening; they are all rotating at the same angular increment. However, because the outer rectangles are much larger, their corners sweep through a much larger physical distance on the screen per rotation increment than the smaller inner rectangles. This difference in perceived velocity creates a sense of depth and complex motion.

## The Limitation: Global Persistence [04:13]

While compounding rotations within a loop allows for beautiful patterns, it introduces a new problem: **the transformations are still cumulative and persistent.** 

Because the coordinate system is being modified inside a loop without being reset, those transformations "leak" into everything else drawn later in the `draw()` function. Even after the loop finishes, the entire coordinate system remains rotated by the sum of all those increments. To solve this and gain local control over transformations, you must use `push()` and `pop()`.
