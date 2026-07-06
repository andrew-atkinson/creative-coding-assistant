---
video_id: 5-cyclical-functions
video_title: 5 cyclical functions
video_file: 5 cyclical functions.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%206%2F5%20cyclical%20functions.mp4"
week: week 6
module: Module 3 - Generation and Life
topic: "Using trigonometric functions like sine and cosine to create cyclical, oscillating animations in movement and color."
concepts:
  - cyclical functions
  - sine function (sin)
  - cosine function (cos)
  - range mapping (offset and scaling)
prerequisites:
  - Basic understanding of variables and functions
  - Familiarity with p5.js setup/draw loop
  - Basic concept of what a function is (input $
ightarrow$ output)
leads_to:
  - Perlin Noise and procedural movement
  - Complex mathematical modeling in generative art
---
# Cyclical Functions in Generative Art

In generative art, we often want to create animations that oscillate—objects that move back and forth or colors that cycle smoothly through a range. While simple animations might use linear logic (like bouncing a ball off a wall), more sophisticated, organic movement and color transitions are best achieved using **cyclical functions**.

## Understanding Sine Waves [00:11]

The most fundamental tool for creating oscillation is the **sine function** (`sin()`). While it may seem intimidating due to its mathematical roots, for a creative coder, it is best understood as a "black box" that takes any input and produces a predictable, repeating output.

### The Properties of Sine
As shown in the visual diagrams, the sine function follows a wave pattern:
*   **Input ($x$):** Can be any value (e.g., `frameCount`, time, or position).
*   **Output:** Always oscillates between **-1 and 1**.

This property makes it incredibly useful. Because the output is predictable, you can use that value to drive other parameters like size, position, or color.

### The Sine and Cosine Relationship [04:21]
The sine function has a "sister function" called **cosine** (`cos()`). 
*   The cosine function follows the exact same pattern and scale as sine.
*   The primary difference is a slight phase offset: where the sine wave might be at zero, the cosine wave might be at its peak.
*   **Visual Utility:** This offset is essential for creating circular movement. By using `sin()` for the Y-axis and `cos()` for the X-axis, you can map a linear input to a perfect circle.

## Mapping Mathematical Outputs to Visual Values [05:37]

A common challenge arises when you try to map the raw output of a sine wave directly to a visual parameter, such as color.

### The "Black Zone" Problem [06:34]
If you attempt to use a raw sine wave to control color intensity, you will encounter an aesthetic issue. Consider this implementation:

```javascript
// Attempting to use raw sine for color
color1 = sin(frameCount) * 255;
color2 = 0;
```

The code above attempts to scale the sine wave (which is -1 to 1) by 255, resulting in a range of **-255 to 255**. 

**The Insight:** While the positive values (0 to 255) work perfectly for color, p5.js interprets negative numbers in a way that creates "dead zones." When the sine wave dips into its negative phase, the color stays stuck at black for a significant portion of the cycle. This results in an animation that feels "clunky" or uneven, as it spends too much time in a state of total darkness before returning to light.

### The Offset Technique [07:24]
To fix this, we need to transform the output range from $[-1, 1]$ to a range that is entirely positive. We do this by adding an **offset**.

By adding 1 to the sine function, we shift the entire wave upward:
*   **Original range:** $-1$ to $1$
*   **With offset $(1 + \sin(x))$:** $0$ to $2$

This ensures the value never drops below zero, eliminating the "black zone" and creating a smooth, continuous oscillation between light and dark.

### Scaling for Specific Ranges
Once you have normalized your range using an offset, you can scale it to any desired value (like the 0–255 range required for RGB colors) by multiplying it.

To map a sine wave to a color intensity that oscillates between 0 and 255, use the following logic:

```javascript
// Correctly mapping sine to a 0-255 range
let brightness = (1 + sin(frameCount)) * 127.5;
```

*   **$(1 + \sin(x))$** shifts the range to $[0, 2]$.
*   **Multiplying by $127.5$** scales that $[0, 2]$ range to $[0, 255]$.

This mathematical transformation allows you to turn a simple trigonometric wave into a precise tool for controlling the aesthetics of your generative system.

# Using Cyclical Functions for Animation

In generative art, movement often needs to be smooth and repetitive. While simple linear increments can move an object from point A to point B, they cannot easily create the "pulsing" or "oscillating" effects required for organic-looking animation. To achieve this, we use **cyclical functions**.

## Understanding Cyclicality [07:30]

To create movement that repeats, we rely on trigonometric functions—specifically **sine** (`sin()`) and **cosine** (`cos()`). 

As seen on the Miro board, these functions are periodic. When you plot them, they create a wave that repeats its pattern indefinitely as the input increases. This makes them perfect for driving animations like oscillating colors or rotating objects.

The key characteristic of a standard sine wave is its output range: it naturally oscillates between **-1 and 1**.

## Mapping Mathematical Outputs to Visual Ranges [08:00]

A common problem when using `sin()` for visual parameters (like color or position) is that the raw output range of $[-1, 1]$ doesn't always match our needs. For example, if you try to use a negative sine value as a color argument in p5.js, the "negative" values can result in unexpected behavior or "dead zones" where the color stays black for too long.

To fix this, we use two mathematical transformations: **Offsetting** and **Scaling**.

### 1. The Offset Technique
If we want to avoid negative numbers, we can add $1$ to the sine function. This shifts the range from $[-1, 1]$ to $[0, 2]$.

### 2. Scaling
Once we have a range of $0$ to $2$, we need to scale it to fit the target parameter. If we are working with color values (which typically range from $0$ to $255$), we can multiply our offset value by a scalar. 

Since our current range is $2$ units wide, multiplying by $128$ will give us a maximum value of $256$.

```javascript
// Transforming the sine wave for color use
color1 = (1 + sin(frameCount)) * 128;
```

### Implementation Example: Oscillating Colors [08:30]

By applying these transformations to both `sin()` and `cos()`, we can create two different oscillating color values that are "out of phase" with each other, creating a rich, shifting color palette.

```javascript
let offset = 0;
let color1, color2;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(50, 100, 150);

  // color1 oscillates between 0 and 256
  color1 = (1 + sin(frameCount)) * 128;
  // color2 oscillates using cosine, creating a different timing/phase
  color2 = (1 + cos(frameCount)) * 128;

  whirligig(mouseX, mouseY, frameCount, color1, color2);
}

function whirligig(mouseX, mouseY, frameCount, color1, color2) {
  // ... (drawing logic using the passed colors)
}
```

The canvas shows a swirling pattern of concentric circles where the colors shift smoothly through various shades, driven by these mathematical oscillations.

## Passing Data Through Functions [09:30]

To make our code more modular and organized, we can calculate these mathematical values as variables and then "pass" them into other functions. This is a fundamental concept in programming: treating the output of one calculation as the input (argument) for another.

In this approach, we calculate a `sineValue` and then use that value directly inside the `color()` function.

```javascript
let offset = 0;
let color1, color2, sineValue;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(50, 100, 150);

  // Calculate the oscillating value once
  sineValue = (1 + sin(frameCount)) * 128;

  // Use the calculated value as an argument for color
  // This will oscillate between black (0, 0, 0) and red (256, 0, 0)
  color1 = color(sineValue, 0, 0);
  
  // Calculate a second oscillating value for the second color
  color2 = (1 + cos(frameCount)) * 128;

  // Pass the calculated colors into our custom function
  whirligig(mouseX, mouseY, frameCount, color1, color2);
}

function whirligig(mouseX, mouseY, frameCount, color1, color2) {
  push();
  translate(mouseX + 200, mouseY);
  rotate(frameCount * 2.5);

  fill(color1);
  ellipse(0, 0, 20, 20);

  fill(color2);
  ellipse(10, 0, 15, 15);
  pop();
}
```

By structuring the code this way, we are effectively "passing data around." The `draw()` function handles the logic of *what* the values are, and the `whirligig()` function simply handles *how* to use them visually.
