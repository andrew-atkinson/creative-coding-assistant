---
video_id: 6-shearing
video_title: 6 shearing
video_file: 6 shearing.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%205%2Ftransformations%2F6%20shearing.mp4"
week: week 5
module: Module 2 – Chaos and Control
---
# Mastering Shearing and Responsive Transformations

Shearing is the final fundamental 2D transformation in our toolkit. While translation moves an object, rotation turns it, and scaling resizes it, **shearing** skews the geometry of a shape by displacing its points based on their distance from the origin.

## Setting Up a Responsive Canvas [00:16]

When creating a canvas, instead of using fixed pixel values (like `800x600`), you can use the built-in variables `windowWidth` and `windowHeight`. This ensures your sketch fills the entire browser window.

```javascript
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
}
```

*Note: `createCanvas` only runs once when the sketch starts. If you resize your browser window, the canvas will not automatically resize unless you implement a `windowResized()` function.*

## Understanding ShearX and ShearY [02:31]

There are two primary shear functions: `shearX()` for horizontal skewing and `shearY()` for vertical skewing.

### The Importance of Transformation Order
Transformations are applied to the coordinate system. If you apply a shear *after* drawing a shape, it will have no effect on that shape. To transform an object, the shear command must come **before** the drawing command.

```javascript
// Correct order: Transform first, then draw
translate(width / 2, height / 2);
shearX(angle); 
rect(0, 0, 100, 100);
```

### Centering the Distortion [03:30]
By default, shearing occurs relative to the origin $(0,0)$. If your origin is at the top-left corner of the screen, the object will appear to "slide" off the canvas as it skews. To make the distortion feel symmetrical and centered, you must calculate the shear value relative to the center of the canvas.

If we want the distortion to be zero when the mouse is in the middle, we use this mathematical expression:
` (width / 2 - mouseX) / 10 `

**Why this works:**
*   When `mouseX` is at the center (`width / 2`), the result is $0$ (no shear).
*   When `mouseX` moves to the right, the value becomes negative.
*   When `mouseX` moves to the left, the value becomes positive.

This creates a balanced, intuitive interaction where the object skews in both directions depending on mouse position.

```javascript
function draw() {
  background(255);
  translate(width / 2, height / 2);

  // Shear X based on mouse position relative to center
  shearX((width / 2 - mouseX) / 10);
  // Shear Y based on mouse position relative to center
  shearY((height / 2 - mouseY) / 10);

  fill(120, 150, 200);
  noStroke();
  rect(0, 0, 100, 100);
}
```

## Creating Complex Patterns with Loops and Mapping [06:43]

Shearing can be applied to entire groups of objects. By combining shearing with `for` loops and the `map()` function, you can create sophisticated, data-driven aesthetic patterns.

### Mapping Spatial Data to Color [08:23]
The `map()` function is essential for creating gradients. We can map the position of an object in a loop to a color value (0–255).

**The Logic:**
We want to map the $x$ position of a rectangle (which ranges from `-width/2` to `width/2`) to a green color value (ranging from $0$ to $255$).

```javascript
for (let x = -width / 2; x <= width / 2; x += 40) {
  // Map the current loop value (x) to a color range (0-255)
  let g = map(x, -width / 2, width / 2, 0, 255);
  
  push();
  translate(x, 0); // Position the rectangle in the grid
  fill(255 - g, 150, 255); // Use the mapped value for color
  rect(0, 0, 40, 40);
  pop();
}
```

### Building a Two-Dimensional Grid [10:23]
By nesting loops for both $x$ and $y$, we can create a grid where colors shift in two dimensions, creating an effect that mimics 3D folding or depth.

```javascript
for (let x = -width / 2; x <= width / 2; x += 40) {
  for (let y = -height / 2; y <= height / 2; y += 40) {
    let r = map(x, -width / 2, width / 2, 0, 255);
    let b = map(y, -height / 2, height / 2, 0, 255);
    
    push();
    translate(x, y);
    fill(r, 150, b);
    rect(0, 0, 40, 40);
    pop();
  }
}
```

## Advanced Management: Isolation and Responsiveness [13:28]

### Using `push()` and `pop()` for Isolation
When working with multiple transformations (translation, rotation, and shearing), it is easy to lose control of the coordinate system. Using `push()` and `pop()` allows you to "save" the current state and "restore" it, ensuring that a shear applied to one object doesn't accidentally skew every subsequent object in your code.

### Calculating Responsive Bounds [15:34]
To ensure a pattern fits perfectly inside the canvas regardless of screen size, use conditional logic to determine the maximum dimensions based on whether the canvas is in landscape or portrait orientation.

```javascript
let rectLength;
if (width > height) {
  rectLength = width * 0.6; // Use a fraction of width for landscape
} else {
  rectLength = height * 0.6; // Use a fraction of height for portrait
}

// Using rectLength to define the bounds of your drawing logic
```

By combining these techniques—mathematical offsets for centering, `map()` for color gradients, and `push/pop` for state management—you can transform simple primitives into complex, interactive digital art.
