---
video_id: 3-functions-calling-functions
video_title: 3 functions calling functions
video_file: 3 functions calling functions.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%206%2F3%20functions%20calling%20functions.mp4"
week: week 6
module: Module 3 - Generation and Life
topic: "Using functions to build complex patterns through composition, abstraction, and loops."
concepts:
  - functional composition
  - abstraction
  - hoisting
  - function parameters and arguments
  - cumulative transformations
prerequisites:
  - basic p5.js drawing primitives
  - understanding of translate, rotate, and scale
  - basic function syntax (declaration and calling)
leads_to:
  - passing complex data types (colors)
  - advanced algorithmic art
  - cyclical functions (sine/cosine)
---
# Functional Composition and Abstraction in p5.js

This lesson explores how to use functions to build complex visual systems from simple primitives. By nesting functions within one another, we can move from drawing a single shape to designing intricate, algorithmic patterns with minimal code.

## Building Primitives: The `cookie` Function [00:00]

Before creating complex patterns, we must define a basic building block. In this demonstration, the `cookie` function serves as our primitive shape.

```javascript
function cookie() {
  push();
  translate(mouseX, mouseY);
  noStroke();
  fill(0);
  arc(0, 0, 50, 50, 0, 180);
  fill(255);
  arc(0, 0, 50, 50, 180, 0);
  pop();
}
```

The `cookie` function draws a simple two-toned semi-circle. To ensure this shape can be used as a building block for more complex patterns, we use `push()` and `pop()`. This isolates the transformations (like `translate`) so they don't "leak" out and affect other parts of the sketch.

## Functional Composition: Creating a Whirligig [01:28]

**Functional composition** is the process of using one function as a component within another. Instead of manually writing out dozens of lines to create a spiral, we can call our `cookie` function repeatedly within a new function.

To create a "whirligig" (a swirling pattern), we combine `scale()` and `rotate()` with multiple calls to our primitive.

### The Manual Approach (Repetitive)
Initially, we might try to draw the pattern by repeating transformations in the `draw()` loop:

```javascript
function draw() {
  background(50, 100, 150);
  push();
  translate(mouseX, mouseY);
  rotate(frameCount);
  cookie(0, 0); // First cookie
  scale(0.9);   // Shrink for the next one
  rotate(45);   // Rotate for the next one
  cookie(0, 0); // Second cookie
  scale(0.9);
  rotate(45);
  cookie(0, 0); // Third cookie... and so on.
  pop();
}
```

### The Abstracted Approach (Efficient)
To manage cognitive load and reduce code volume, we wrap this logic into a single `whirligig` function. This makes the code **modular**: we define the "how" once and simply call it whenever we need that specific pattern.

```javascript
function whirligig(x, y) {
  push();
  translate(x, y); // Move to the starting position provided by arguments
  rotate(frameCount);
  
  cookie(0, 0);
  scale(0.9);
  rotate(45);
  cookie(0, 0);
  scale(0.9);
  rotate(45);
  cookie(0, 0);
  scale(0.9);
  rotate(45);
  cookie(0, 0);
  pop();
}

function draw() {
  background(50, 100, 150);
  whirligig(mouseX, mouseY); // Call the complex pattern at mouse position
}
```

## Understanding Hoisting [04:32]

When writing modular code, you might notice that the `whirligig` function is defined *after* it is called in the `draw()` loop. In many programming languages, this might cause an error because the computer hasn't "seen" the function yet.

However, JavaScript uses a mechanism called **hoisting**. During the initial runtime phase, JavaScript preemptively scans the code and "gathers up" all function declarations. This means functions are available to be called anywhere in the script, regardless of their linear order in the text editor.

## Parameterization and Data Flow [05:33]

The true power of abstraction is realized through **parameters**. In the `whirligig(x, y)` function above, `x` and `y` are placeholders (abstract ideas). They don't have values until the function is actually called.

When we call `whirligig(mouseX, mouseY)`, we are passing specific values into those placeholders:
1. The value of `mouseX` is assigned to the parameter `x`.
2. The value of `mouseY` is assigned to the parameter `y`.

This allows us to decouple the *logic* of the pattern (the swirling) from its *position* in space. We can now draw the same complex whirligig at any coordinate simply by passing different arguments, making our code highly reusable and scalable.

# Refactoring for Complexity: Loops and Function Design

This lesson demonstrates how to transition from repetitive, manual code to efficient, modular systems using loops and advanced function parameters. We will explore how to use functions to create complex visual patterns and discuss the design philosophy behind choosing the right number of parameters.

## Refactoring with Loops [06:21]

When building complex visuals, you might initially write out every transformation manually. For example, to create a spiral effect using a `cookie()` function, you might write:

```javascript
function whirligig(x, y) {
  push();
  translate(x, y);
  rotate(frameCount);
  cookie(0, 0); // Original shape
  scale(1);
  rotate(45);
  cookie(0, 0); // Second shape
  scale(0.9);
  rotate(45);
  cookie(0, 0); // Third shape
  scale(0.9);
  rotate(45);
  cookie(0, 0); // Fourth shape
  scale(0.9);
  rotate(45);
  cookie(0, 0); // Fifth shape
}
```

This approach is tedious and difficult to manage. To increase graphic complexity, you would have to manually copy and paste dozens of lines of code. Instead, we can use a `for` loop to automate these repetitive transformations.

### The Refactored Approach
By wrapping the `scale`, `rotate`, and `cookie` calls inside a loop, we can generate dozens of iterations with just a few lines of code.

```javascript
function whirligig(x, y) {
  push();
  translate(x, y);
  rotate(frameCount);
  cookie(0, 0); // Draw the first cookie at full scale

  // Use a loop to create the spiral effect
  for (let i = 0; i < 25; i++) {
    scale(0.9);   // Gradually shrink each subsequent cookie
    rotate(45);   // Rotate each subsequent cookie by 45 degrees
    cookie(0, 0); // Draw the next cookie in the sequence
  }
  pop();
}

function cookie(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(0);
  arc(0, 0, 150, 150, 0, 180);
  fill(255);
  arc(0, 0, 150, 150, 180, 360);
  pop();
}
```

The canvas shows the result: a swirling, spiral pattern composed of many concentric circles. By increasing the loop limit (e.g., from 10 to 25), we can increase the density and complexity of the pattern instantly.

## Increasing Reusability through Parameters [07:47]

In the previous example, the rotation was "hard-coded" using `rotate(frameCount)`. This means every instance of a `whirligig` will rotate in the same direction at the same speed. To make the function more flexible, we can introduce a new parameter: `angle`.

### Handling Parameter Errors
If you define a function to expect an angle but call it without providing one, JavaScript will throw an error. For example:

```javascript
// The function expects three arguments: x, y, and angle
function whirligig(x, y, angle) { 
  push();
  translate(x, y);
  rotate(angle); // Error occurs here if angle is not passed
  // ... rest of code
}

function draw() {
  whirligig(mouseX, mouseY); // ERROR: rotate() was expecting a Number, received undefined
}
```

The console will report that `rotate()` expected a number but received an empty variable. This is because the `angle` parameter exists in the function definition, but no value was provided during the call.

### Implementing Dynamic Movement
Once the parameter is correctly implemented, we can pass different values to achieve different behaviors. By passing `frameCount` for one instance and `-frameCount` for another, we can make two objects rotate in opposite directions.

```javascript
function draw() {
  background(50, 100, 150);
  // First whirligig rotates clockwise
  whirligig(mouseX, mouseY, frameCount); 
  // Second whirligig rotates counter-clockwise and is offset by 200px
  whirligig(mouseX + 200, mouseY, -frameCount); 
}

function whirligig(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  cookie(0, 0);
  for (let i = 0; i < 25; i++) {
    scale(0.93);
    rotate(45);
    cookie(0, 0);
  }
  pop();
}
```

## Design Philosophy: The Parameter Trade-off [08:51]

When designing functions, you face a constant tension regarding how many parameters to include. This is a core architectural decision in programming:

*   **Too few parameters:** The function becomes too restrictive. It can only do one specific thing, forcing you to write new functions for every slight variation.
*   **Too many parameters:** The function becomes overly complex and difficult to use or maintain.

There is no perfect answer; it is a balance you find through iterative design. 

### Identifying Design Limitations
As we build, we often hit "limitations" in our current design. For example, the `cookie()` function currently has its colors hard-coded (black and white). If we wanted our `whirligig` to produce colorful spirals, the current structure is too restrictive because the color logic lives inside `cookie()`, but the "decision" to use a certain color should ideally be made by the parent function, `whirligig()`. 

Solving this requires passing even more data (like color values) down through the hierarchy of functions—a topic for future exploration.
