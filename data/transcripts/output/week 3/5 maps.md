---
video_id: 5-maps
video_title: 5 maps
video_file: 5 maps.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%203%2F5%20maps.mp4"
week: week 3
topic: "Using the map() function to translate values from one range to another, specifically for controlling color gradients in repetitive patterns."
concepts:
  - clamping/overflowing values
  - map() function
  - map() parameters
  - inverse mapping
prerequisites:
  - for loops
  - RGB color model
  - variable assignment
  - basic coordinate systems (x, y)
leads_to:
  - procedural generation
  - data visualization
  - complex generative art systems
---
# Mastering Value Remapping with `map()`

## The Problem: Color Clipping and Redundancy [00:04]

When using loops to generate colors based on pixel coordinates, you often encounter a phenomenon called "clipping" or "clamping." 

In the current setup, we are using a loop to increment color values based on the `x` and `y` coordinates. However, because RGB values are capped at 255, any coordinate value higher than 255 results in the same maximum color intensity.

The canvas shows a grid where colors change gradually at first, but once the coordinate reaches 255, the color stops changing. For example:
*   The red channel increases with `x`, but once `x > 255`, the color remains a solid, unchanging red.
*   The yellow channel increases with `y`, but once `y > 255`, it remains a solid, unchanging yellow.

This creates "echoes" in the visual output—large blocks of identical color that provide no new information, effectively wasting the rest of your canvas space.

## The Manual Approach: Mathematical Scaling [01:05]

To fix this, we need to scale our input range (the canvas dimensions) to fit within the output range (the RGB spectrum). 

One way to do this is through manual calculation. If our canvas width is 400 and we want the color to reach its maximum (255) at that edge, we can use a ratio:

```javascript
// Manual scaling approach
let fillX = (x / 400) * 255;
let fillY = (y / 400) * 255;

fill(fillX, fillY, 0);
```

While this works and produces a smooth gradient across the entire canvas, it is cumbersome. As your logic becomes more complex (e.g., mapping to non-linear scales or multiple variables), these manual calculations become difficult to read and prone to error.

## The Elegant Solution: Using `map()` [01:47]

The `map()` function is a powerful tool that allows you to translate a value from one range into another. It essentially says: *"Take this number, find its relative position in Range A, and tell me what that same relative position would be in Range B."*

### The Syntax
The `map()` function requires five parameters:
`map(value, start1, stop1, start2, stop2)`

1.  **`value`**: The current number you want to transform (e.g., your loop variable `x`).
2.  **`start1`**: The lower bound of the current range (e.g., `0`).
3.  **`stop1`**: The upper bound of the current range (e.g., `400`).
4.  **`start2`**: The lower bound of the target range (e.g., `0`).
5.  **`stop2`**: The upper bound of the target range (e.g., `255`).

### Implementation and Common Pitfalls [03:29]

When implementing `map()`, a common mistake is calculating the new value but forgetting to actually use the resulting variable in your drawing functions.

**Incorrect Implementation:**
```javascript
// The calculation is correct, but we are still using the original 'x' in fill()
let fillX = map(x, 0, 400, 0, 255);
let fillY = map(y, 0, 400, 0, 255);

fill(x, y, 0); // ERROR: This uses the original coordinate, not the mapped value
```

**Correct Implementation:**
```javascript
// We must pass the NEW variables into the fill function
let fillX = map(x, 0, 400, 0, 255);
let fillY = map(y, 0, 400, 0, 255);

fill(fillX, fillY, 0); // SUCCESS: The colors now transition smoothly across the whole canvas
```

## Advanced Mapping: Inversion [05:52]

One of the most useful features of `map()` is its ability to handle inverse relationships. You are not restricted to mapping "low to high." You can map a low input to a high output, or vice versa.

By swapping the `start2` and `stop2` parameters, you can invert your color scales.

```javascript
// This maps 0 to 255 and 400 to 0, creating an inverted gradient
let fillX = map(x, 0, 400, 255, 0);
let fillY = map(y, 0, 400, 255, 0);

fill(fillX, fillY, 0);
```

In the editor, this results in a grid where the colors fade out as they approach the edges, rather than building up. This flexibility makes `map()` an essential tool for procedural generation and creating complex visual dynamics in generative art.
