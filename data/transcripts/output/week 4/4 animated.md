---
video_id: 4-animated
video_title: 4 animated
video_file: 4 animated.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 4/4 animated.mp4"
week: week 4
module: Module 2 – Chaos and Control
topic: "Visualizing and animating 1D Perlin noise in p5.js to create organic, flowing waveforms."
concepts:
  - Perlin noise (noise() function)
  - Scaling noise inputs
  - Mapping noise outputs
  - Temporal offset (Animation)
  - noiseSeed()
prerequisites:
  - Basic p5.js setup (setup/draw)
  - For loops
  - Coordinate system (x, y)
  - Basic understanding of variables
leads_to:
  - 2D Noise fields
  - Flow fields
  - Procedural textures
---
# Visualizing and Animating 1D Perlin Noise

This resource explores how to translate mathematical noise functions into organic, flowing visual patterns using p5.js. We move from understanding the theoretical concept of noise to implementing a dynamic, animated waveform.

## Understanding Noise as Data [00:02]

Before coding, it is helpful to visualize noise as a continuous line graph. Unlike pure randomness (which produces jagged, disconnected values), Perlin noise produces a smooth, continuous sequence of values.

Imagine a graph where:
*   The **X-axis** represents your input (the coordinate).
*   The **Y-axis** represents the noise value.

In a p5.js sketch, we can represent this graph by drawing vertical lines at regular intervals along the X-axis. The height of each line will be determined by the noise value at that specific point.

## Implementing Static Noise [01:32]

To translate the graph concept into code, we use a `for` loop to iterate across the canvas width. We draw a line at each step, where the Y-coordinate is determined by the `noise()` function.

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(155, 0, 55); // A dark magenta background
  for (let x = 0; x <= width; x += 10) {
    // We draw a line from the noise-calculated Y to the bottom of the canvas
    line(x, noise(x / 100) * height, x, height);
  }
}
```

### The Logic of Scaling: Input vs. Output [02:58]

A common point of confusion is why we divide the input by 100 and then multiply the output by `height`. This is necessary because of the difference between **normalized values** and **screen space**.

1.  **Scaling the Input (Frequency):** The `noise()` function returns a value between 0.0 and 1.0. If we pass `x` directly (where $x$ goes from 0 to 400), the noise function will cycle through its values very rapidly, resulting in a chaotic, jagged look. By dividing by 100 (`x / 100`), we "slow down" the input, sampling the noise at much smaller increments. This results in a smoother, more organic wave.
2.  **Scaling the Output (Amplitude):** The output of `noise()` is also between 0.0 and 1.0. To make this visually useful on a canvas that might be 400 pixels high, we must multiply the result by `height`. This maps the $0.0 \dots 1.0$ range to the $0 \dots 400$ pixel range.

### Ensuring Consistency with `noiseSeed()` [04:37]

By default, p5.js generates a new random seed every time the sketch runs. If you want your noise pattern to remain identical every time you press play—which is vital for debugging or controlled animation—use `noiseSeed()` in the `setup()` function.

```javascript
function setup() {
  createCanvas(400, 400);
  strokeWeight(5);
  noiseSeed(0); // Ensures the same pattern every time
}
```

## Animating the Noise Wave [05:18]

To transform a static set of lines into an animated wave, we introduce a temporal dimension. We do this by adding an **offset variable** to our noise input. By incrementing this offset in every frame, we effectively "scroll" through the noise field.

```javascript
let xOff = 0; // The temporal offset variable

function setup() {
  createCanvas(400, 400);
  strokeWeight(5);
  noiseSeed(0);
}

function draw() {
  background(155, 0, 55);
  
  // Increment the offset to create motion
  xOff += 0.01; 

  for (let x = 0; x < width; x += 10) {
    // Adding xOff to the input "shifts" our position on the noise line
    let y = noise(x / 100 + xOff) * height;
    line(x, y, x, height);
  }
}
```

**Key Insights for Animation:**
*   **Speed Control:** Increasing the increment (e.g., `xOff += 0.1`) will make the wave move much faster across the screen.
*   **Visual Complexity:** You can map noise values to other properties, such as color. For example, using `stroke(noise(...) * 255)` will cause the line color to fluctuate in brightness as it moves, creating a shimmering effect.

```javascript
// Example: Mapping noise to color intensity
stroke(noise(x / 100 + xOff) * 255);
```
