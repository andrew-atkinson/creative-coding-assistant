---
video_id: 4-adding-more-parameters
video_title: 4 adding more parameters
video_file: 4 adding more parameters.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%206%2F4%20adding%20more%20parameters.mp4"
week: week 6
module: Module 3 - Generation and Life
topic: Mastering parameter passing in nested functions and using cyclical mathematical functions for smooth animation.
concepts:
  - parameter passing (nesting)
  - argument vs. variable
  - noise() for organic movement
  - cyclical functions (sine/cosine)
prerequisites:
  - Basic p5.js setup and draw loop
  - Understanding of variables
  - Coordinate geometry (translate, rotate)
  - Basic function definitions
leads_to:
  - Recursive functions
  - Advanced Perlin noise implementation
  - Complex mathematical modeling in generative art
---
# Mastering Parameter Passing and Data Flow in Functions

In generative art, functions allow us to encapsulate complex drawing behaviors into reusable modules. This lesson explores how to move beyond simple, hard-coded shapes by using **parameters** and **arguments** to pass data through nested functions.

## The Need for Abstraction [00:00]

We begin with a basic setup where one function calls another to create complex patterns. In this example, the `whirligig` function acts as a high-level controller that calls a simpler `cookie` function multiple times to create a spiraling effect.

```javascript
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(58, 100, 150);
  whirligig(mouseX, mouseY, frameCount);
  whirligig(mouseX + 200, mouseY, -frameCount);
}

function whirligig(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  cookie(0, 0); // Calling the 'leaf' function
  for (let i = 0; i < 35; i++) {
    scale(0.9);
    rotate(45);
    cookie(0, 0);
  }
  pop();
}

function cookie(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(0);
  arc(0, 0, 150, 180, 0, 180);
  fill(255);
  arc(0, 0, 180, 150, 0, 180);
  pop();
}
```

The canvas displays a swirling pattern of white lines. The `whirligig` function handles the rotation and scaling, while the `cookie` function defines the actual geometry (in this case, two arcs forming a circular shape).

## Passing Data Through Nested Functions [00:30]

A common challenge in programming is wanting to change a property (like color) of a shape drawn deep within a hierarchy of functions. If we want the `cookie` to change color, we cannot simply call `fill()` in the `draw()` function; that information must be "passed down" through every layer of the hierarchy.

### The Problem: Scope and Arguments
If we add color parameters to `whirligig` but forget to pass them into the `cookie` call, the `cookie` function remains unaware of those values.

### The Solution: Parameter Drilling
To fix this, we must add the parameters to every function in the chain. We define them as **parameters** (placeholders) in the function definition and pass them as **arguments** (actual values) when calling the function.

```javascript
function draw() {
  background(50, 100, 150);
  // Passing color values as arguments
  whirligig(mouseX, mouseY, frameCount, 0, 255);
  whirligig(mouseX + 200, mouseY, frameCount, color(255, 0, 255), 255);
}

function whirligig(x, y, angle, c1, c2) {
  push();
  translate(x, y);
  rotate(angle);
  // Passing the arguments down to the next level
  cookie(0, 0, c1, c2); 
  for (let i = 0; i < 35; i++) {
    scale(0.9);
    rotate(45);
    cookie(0, 0, c1, c2);
  }
  pop();
}

function cookie(x, y, c1, c2) {
  push();
  translate(x, y);
  noStroke();
  fill(c1); // Using the passed parameter
  arc(0, 0, 150, 180, 0, 180);
  fill(c2); // Using the passed parameter
  arc(0, 0, 180, 150, 0, 180);
  pop();
}
```

### Debugging: "Object Arguments is not a valid color" [01:57]
When you encounter an error like `Error: Object ArgumentsList is not a valid color`, it usually means you are trying to use the name of an argument as if it were a value, but that variable hasn't been correctly passed or defined in the current scope. In programming, a parameter is just a name; it only holds value once you pass an actual piece of data into it.

## Adding Complexity and Motion [03:18]

Once the data flow is established, we can use different types of inputs to drive the visual parameters:

1.  **Directional Control**: Using `frameCount` vs `-frameCount` to make shapes rotate in opposite directions.
2.  **Speed Control**: Multiplying `frameCount` (e.g., `frameCount * 2.5`) to increase the speed of rotation.
3.  **Color Variation**: Using `color()` functions or raw RGB values as arguments to create diverse palettes.

## Integrating Perlin Noise for Organic Movement [04:30]

While `frameCount` provides linear, predictable motion, **Perlin Noise** (`noise()`) provides smooth, organic, and non-linear movement. To use noise to drive a position, we must define an `offset` variable that updates over time.

```javascript
let offset = 0; // Global variable to track noise progression

function draw() {
  background(50, 100, 150);
  
  // Standard mouse-driven whirligig
  whirligig(mouseX, mouseY, frameCount, 0, 255);
  
  // Noise-driven whirligig
  // We multiply noise by width to map the 0.0–1.0 range to the canvas size
  whirligig(noise(offset) * width, noise(offset + 10) * height, -frameCount, color(240, 100, 100), color(50, 200, 0));
  
  // Increment the offset to move through the noise map
  offset += 0.01;
}

function whirligig(x, y, angle, c1, c2) {
  push();
  translate(x, y);
  rotate(angle);
  cookie(0, 0, c1, c2);
  for (let i = 0; i < 35; i++) {
    scale(0.9);
    rotate(45);
    cookie(0, 0, c1, c2);
  }
  pop();
}

function cookie(x, y, c1, c2) {
  push();
  translate(x, y);
  noStroke();
  fill(c1);
  arc(0, 0, 150, 180, 0, 180);
  fill(c2);
  arc(0, 0, 180, 150, 0, 180);
  pop();
}
```

By combining nested functions with parameter passing and noise-driven movement, we transform a simple geometric shape into a complex, living generative system.

# Mastering Parameter Passing and Cyclical Motion

This lesson explores how to use functions to manage complexity in generative art. We will move from hard-coded values to a dynamic system using parameters, and finally transition from linear animation to smooth, oscillating motion using trigonometric functions.

## Expanding Function Capabilities [06:00]

When building generative art, you often start with a simple function that draws a specific shape. As your vision grows, you need to control more aspects of that shape—such as its position or color—without rewriting the entire function.

The instructor demonstrates this by taking a `whirligig` function and attempting to drive its properties using different variables. By passing different values into the same function, we can create multiple instances of a pattern that behave differently.

### Using Noise for Organic Movement
Instead of using static coordinates, we can use `noise()` to create organic, wandering movement. This is achieved by passing the result of a noise function into the `x` and `y` parameters of our drawing function.

```javascript
// Using noise to drive position
whirligig(noise(offset) * width, noise(offset + 10) * height, frameCount * 3, color(240, 100, 180), color(50, 200, 90));
```

In the editor, this results in a swirling pattern that moves smoothly across the canvas rather than jumping erratically.

## Managing Data Flow with Multiple Parameters [07:00]

To make a function truly flexible, it needs to accept multiple arguments. In this demonstration, we expand the `whirligig` function to accept two color parameters (`c1` and `c2`) instead of just one.

### The Challenge of Variable Scope
A common hurdle in programming is ensuring that variables defined in the main `draw()` loop are actually "seen" by the functions they call. If you want a color to change over time, you must calculate that value in `draw()` and then pass it through every layer of nested functions.

To create a dynamic color effect, we can use the `frameCount` variable to drive color values.

```javascript
let offset = 0;
let color1, color2; // Declared globally to be used in draw()

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(50, 100, 150);

  // Calculate color values based on time (frameCount)
  color1 = frameCount % 255;
  color2 = 255 - (frameCount % 255);

  // Pass the calculated colors into the function
  whirligig(mouseX, mouseY, frameCount, color1, color2);

  offset += 0.01;
}

function whirligig(x, y, angle, c1, c2) {
  push();
    translate(x, y);
    rotate(angle);
    // Use the passed parameters to set the stroke color
    stroke(c1, c2, 0); 
    // ... drawing logic ...
  pop();
}
```

### Solving the "Blip" Problem [08:00]
When using the modulo operator (`%`) to loop values—for example, `frameCount % 255`—the value increases linearly from 0 to 254 and then suddenly "jumps" back to 0. In a visual animation, this causes a jarring "blip" or snap where the color or rotation suddenly resets.

To fix this, we need to move away from linear increments and toward **cyclical functions**.

## Implementing Cyclical Motion [08:12]

To achieve smooth, continuous oscillation (where a value goes from 0 to 255 and back to 0 without a sudden jump), we use trigonometric functions: **Sine (`sin`)** and **Cosine (`cos`)**.

These functions are naturally periodic, meaning they repeat their values in a smooth wave. By applying these to our parameters, we can create animations that oscillate smoothly between two states, creating a much more professional and organic aesthetic.

Instead of:
`color1 = frameCount % 255; // Causes a sudden jump from 254 to 0`

We use:
`color1 = sin(frameCount); // Oscillates smoothly between -1 and 1`

By mapping these sine waves to our desired color or position ranges, we eliminate the "blip" and create seamless, looping generative motion.
