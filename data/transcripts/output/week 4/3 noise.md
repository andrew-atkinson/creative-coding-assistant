---
video_id: 3-noise
video_title: 3 noise
video_file: 3 noise.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 4/3 noise.mp4"
week: week 4
module: Module 2 – Chaos and Control
topic: "Understanding and implementing Perlin noise to create organic, continuous motion in p5.js."
concepts:
  - random() vs noise()
  - noise(xOff)
  - offset incrementing
  - 2D motion from 1D noise
  - noiseSeed()
prerequisites:
  - Basic p5.js structure (setup/draw)
  - Variable declaration and incrementing
  - Basic understanding of the coordinate system (X/Y)
leads_to:
  - 2D and 3D noise maps
  - Procedural terrain generation
  - Complex particle systems
---
# Understanding Randomness and Noise

In generative art, there is a fundamental distinction between pure randomness and noise. While both involve unpredictability, they produce vastly different visual results due to how the numbers relate to one another.

## The Concept: Randomness vs. Noise [00:00]

### Pure Randomness
Pure randomness (using functions like `random()`) generates values that have no mathematical relationship to the previous value. If you were to plot these values on a graph, they would appear as high-frequency "jitter"—a jagged line that jumps erratically up and down within a specified range. Because each number is independent, the sequence lacks any sense of continuity or "flow."

### Perlin Noise
Noise (using functions like `noise()`) is different because it produces a continuous, smooth gradient. Instead of jumping erratically, each value is mathematically related to its neighbors. This creates an "organic" quality where values fluctuate smoothly, much like the undulating curves found in nature.

| Feature | Pure Randomness (`random`) | Noise (`noise`) |
| :--- | :--- | :--- |
| **Relationship** | Disjointed; no connection between values | Continuous; each value relates to the next |
| **Visual Result** | Jagged, erratic "white noise" | Smooth, organic undulating curves |
| **Predictability** | Completely unpredictable and disconnected | Unpredictable but follows a continuous path |

## Implementing Noise in p5.js [04:06]

To use noise, you must provide an **offset** (often called `xOff`). This offset tells the function where along the "noise line" you are currently located.

### The Deterministic Nature of Noise
A key characteristic of noise is that it is **deterministic**. If you query the same offset multiple times, you will receive the exact same output. This allows for "controlled unpredictability"—you can revisit a specific point on the noise curve to get the same value again.

```javascript
let xOff = 0; // Our starting offset

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // If we don't increment xOff, it will always return the same value
  console.log(noise(xOff)); 
}
```

### Creating Motion through Increments [05:23]
To create movement, we must increment the offset variable in every frame. The rate at which you change this value determines how "jumpy" or "smooth" the motion appears.

*   **Small increments (e.g., `0.001`)**: The function samples points very close to each other on the noise curve, resulting in extremely smooth, slow movement.
*   **Large increments (e.g., `0.1`)**: The function "jumps" across the noise curve, resulting in more erratic, rapid movement.

```javascript
let xOff = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(228);
  // Incrementing the offset to move along the noise curve
  xOff += 0.01; 
  // Using the noise value to drive the X position of a circle
  circle(noise(xOff) * width, 200, 20);
}
```

### Troubleshooting: The Common Logic Error [06:15]
A common mistake when animating with noise is incrementing the offset variable but forgetting to pass that updated variable into the `noise()` function.

**Incorrect Approach:**
```javascript
// The circle moves linearly because we are passing the raw incrementing value, 
// not the noise-transformed value.
xOff += 0.01;
circle(xOff * width, 200, 20); 
```

**Correct Approach:**
```javascript
// The circle moves organically because we are passing the incremented 
// value through the noise function.
xOff += 0.01;
circle(noise(xOff) * width, 200, 20);
```

## Moving into Higher Dimensions [08:03]

While the demonstration above uses a single noise value to drive movement along one axis (X), you can create more complex, multi-dimensional motion by sampling different parts of the noise landscape. By adding a constant offset to your input, you can sample a different section of the "line," allowing for synchronized but distinct movements.

# Understanding Perlin Noise and Organic Motion

This resource explores the transition from pure randomness to **Perlin noise**, demonstrating how mathematical continuity can be used to create organic, "natural" movement in digital art.

## The Concept: Randomness vs. Noise [08:29]

To understand noise, we must first visualize the difference between pure randomness and continuous noise. 

*   **Pure Randomness (`random()`):** Generates values where each subsequent number has no mathematical relationship to the previous one. Visually, this results in high-frequency "jitter" or erratic jumps.
*   **Noise (`noise()`):** Generates a continuous, smooth gradient where each value is mathematically related to its neighbors. 

Imagine a single line representing the noise function's output. As you move along the x-axis (the input), the y-value (the output) fluctuates smoothly. By sampling different points along this single line, we can create complex, related patterns rather than disjointed chaos.

## Implementing Smooth Motion [09:15]

To create motion, we must pass a changing variable—an **offset**—into the `noise()` function. If you pass a constant number, the output will always be the same. By incrementing an offset variable over time, we "walk" along the noise curve.

```javascript
let xOff = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  
  // Increment the offset to move along the noise curve
  xOff += 0.005; 
  
  // Use the noise value to determine position
  circle(noise(xOff) * width, 100, 20);
}
```

### Troubleshooting: The Importance of the Argument [10:32]
The `noise()` function **always requires an argument**. If you attempt to call `noise()` without passing a number, the function returns `NaN` (Not a Number), and nothing will be rendered on the canvas.

## Creating 2D Motion from 1D Noise [09:56]

A powerful technique in generative art is using a single 1D noise function to drive two-dimensional motion. You can achieve this by sampling different parts of the same noise "line" for your X and Y coordinates.

By adding a constant value (an offset) to the input, you are essentially looking at a different section of the noise curve.

```javascript
let xOff = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220, 1); // Low alpha creates a trailing effect
  xOff += 0.005;

  // X position uses the current offset
  // Y position uses an offset shifted by 1 to sample a different part of the curve
  let x = noise(xOff) * width;
  let y = noise(xOff + 1) * height;

  circle(x, y, 20);
}
```

When you run this code, the circle follows a winding, organic path. Because both X and Y are derived from the same continuous function (just at different points), the movement feels fluid and "natural" rather than erratic.

### The "Random Walker" Effect [12:08]
You can use this technique to create multiple objects that appear to follow one another. By giving each object a slightly different starting offset, they will move along the same path but at different times.

```javascript
let xOff = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220, 1);
  xOff += 0.005;

  // Primary circle
  circle(noise(xOff) * width, noise(xOff + 1) * height, 20);

  // Secondary circle following the same path with a slight delay/offset
  circle(noise(xOff + 0.1) * width, noise(xOff + 1.1) * height, 20);
}
```

The canvas shows two circles moving in a synchronized, snake-like pattern. They are not truly "random" relative to each other; they are both referencing the same mathematical landscape, just at different coordinates.

## Achieving Determinism with Noise Seeds [13:03]

While noise is unpredictable in its sequence, it is **deterministic**. This means if you provide the same input, you will always get the exact same output. 

To make a specific noise pattern repeatable every time the program runs, you can use `noiseSeed()`. This ensures that even though the movement looks "random," it will follow the exact same path every time you restart the sketch.

```javascript
let xOff = 0;

function setup() {
  createCanvas(400, 400);
  // Ensures the noise pattern is identical every time the sketch runs
  noiseSeed(0); 
}

function draw() {
  background(220, 1);
  xOff += 0.005;

  circle(noise(xOff) * width, noise(xOff + 1) * height, 20);
  circle(noise(xOff + 0.1) * width, noise(xOff + 1.1) * height, 20);
}
```
