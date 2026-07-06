---
video_id: 5-2d-noise-time
video_title: 5 2D noise (+ time)
video_file: 5 2D noise (+ time).mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 4/5 2D noise (+ time).mp4"
week: week 4
module: Module 2 – Chaos and Control
topic: Implementing 2D and 3D Perlin noise to create organic textures and procedural animations
concepts:
  - Perlin Noise
  - 2D Noise
  - Temporal Animation (3D Noise)
  - Noise Scaling
prerequisites:
  - Basic JavaScript syntax
  - p5.js coordinate system (x, y)
  - For loops and nested loops
  - Basic understanding of 1D noise
leads_to:
  - Procedural Content Generation (PCG)
  - Advanced Fractal Art
  - Vector Fields
---
# Procedural Textures with Perlin Noise

Perlin noise is a type of gradient noise used to produce organic, non-random patterns. Unlike pure randomness (white noise), which results in disordered values, Perlin noise ensures that each value is mathematically related to its neighbors. This creates the smooth transitions necessary for simulating natural phenomena like clouds, mountains, or flowing water.

## From 1D to Fractal Thinking [00:00]

While noise can be used in one dimension (creating a simple undulating line), its most powerful application is in creating organic textures and procedural landscapes. 

By applying "fractal thinking," we can map noise values to different properties:
* **Tonal Values:** Using the noise value to determine grayscale or color intensity for textures.
* **Height Values (Z-axis):** Mapping the noise to a Z-value to generate procedural landscapes. For example, low values can represent oceans, while higher values represent grasslands or forests.
* **Vector Fields:** Using noise to influence the direction and flow of shapes.

This technique was famously used in the 1980s film *Tron* to create organic-looking digital environments.

## Implementing 2D Noise [01:58]

To move from a linear gradient to a spatial texture, we transition from 1D space to 2D space using nested `for` loops.

### Managing Computational Expense
When generating textures, the resolution of your grid matters. Drawing a rectangle for every single pixel is computationally expensive and can cause significant lag. To manage this, we use a `size` variable to control the granularity of our grid.

```javascript
let size = 10; // Controls the "pixel" size of our noise grid

function setup() {
  createCanvas(400, 400);
}

function draw() {
  // Nested loops to iterate over the 2D plane
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      // We divide the coordinate by a scale factor (e.g., 100)
      // to control the rate of change/frequency of the noise.
      let n = noise(x / 100, y / 100);
      
      // noise() returns a value between 0 and 1. 
      // We scale it to 0-255 for RGB color values.
      fill(n * 255);
      rect(x, y, size);
    }
  }
}
```

### Understanding Scale and Frequency
The divisor used inside the `noise()` function is critical for controlling the "look" of the texture:
* **Large Divisor (e.g., `x/1000`):** Results in very gradual, smooth transitions (low frequency).
* **Small Divisor (e.g., `x/1`):** Results in highly chaotic, jittery noise (high frequency).

### Expanding to Two Dimensions
If you only pass the `x` coordinate into the noise function, the pattern will only change as you move horizontally. To create a true 2D texture where values relate across both axes, you must pass both `x` and `y` as separate parameters.

```javascript
// 1D Noise (Vertical stripes)
fill(noise(x / 100));

// 2D Noise (Organic texture)
fill(noise(x / 100, y / 100));
```

## Adding the Temporal Dimension (Animation) [06:03]

To make a texture dynamic—such as moving clouds or flowing water—we introduce a third dimension: **Time ($z$)**. 

By creating a variable that increments slightly every frame, we can "travel" through the noise field, creating smooth, organic motion.

```javascript
let size = 5;
let z = 0; // The temporal dimension

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      // Pass x, y, and z to create 3D noise
      fill(noise(x / 100, y / 100, z) * 255);
      rect(x, y, size);
    }
  }
  
  // Increment z to evolve the noise over time
  z += 0.01; 
}
```

In this implementation, the `z` value acts as a third coordinate. As `z` increases, the "slices" of noise we see change subtly, resulting in a continuous, flowing animation.

## Implementing 2D and 3D Perlin Noise [07:00]

Having explored one-dimensional noise, we can now expand into higher dimensions to create complex, organic textures. By increasing the dimensionality of our noise function, we move from simple linear gradients to spatial patterns and temporal animations.

### Expanding to 2D Spatial Noise
To move from a 1D line of noise to a 2D texture, we use nested `for` loops. Instead of passing only an `x` coordinate into the `noise()` function, we pass both `x` and `y`. This allows the noise value to change based on its position in a 2D plane, creating patterns that resemble organic textures like clouds or stone.

To ensure the noise looks "organic" rather than a chaotic mess of single pixels, we must scale our input coordinates. Dividing the `x` and `y` values by a constant (e.g., 100) effectively "zooms in" on the noise, creating smoother transitions between values.

### Adding the Third Dimension: Time [07:13]
To make a noise pattern evolve over time—simulating moving clouds or flowing water—we introduce a third parameter, `z`. By incrementing `z` in every frame of the `draw()` loop, we create **3D noise**. In this context, the third dimension is not spatial (width or height), but temporal.

The following implementation demonstrates how to create a grid of rectangles where each rectangle's color is determined by its 3D noise value.

```javascript
let size = 400; // The size of each "pixel" or block in the grid
let z = 0;     // The temporal dimension (time)

function setup() {
  createCanvas(size, size);
  noStroke(); // Removes the outline around rectangles for a seamless look
}

function draw() {
  // Nested loops to iterate through the 2D grid
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      // noise() returns a value between 0 and 1. 
      // We multiply by 255 to map it to a grayscale RGB range.
      fill(noise(x / 100, y / 100, z) * 255);
      rect(x, y, size);
    }
  }

  // Increment z to evolve the noise over time
  z += 0.005;
}
```

### Visualizing the Output
When this code runs, the canvas displays a grayscale pattern. Because we are using `rect()` with a large `size` value, the canvas appears as a grid of blocks rather than smooth gradients. Each block's brightness is determined by the `noise()` function at that specific coordinate and time.

As `z` increases, you will see the patterns shift and morph smoothly across the screen. This demonstrates the power of Perlin noise: it provides "controlled chaos," where every value is mathematically related to its neighbor, resulting in the fluid, organic movement required for procedural textures like fractal terrain.
