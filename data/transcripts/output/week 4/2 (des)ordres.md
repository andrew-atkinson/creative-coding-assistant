---
video_id: 2-des-ordres
video_title: 2 (des)ordres
video_file: 2 (des)ordres.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 4/2 (des)ordres.mp4"
week: week 4
module: Module 2 – Chaos and Control
topic: "Using nested loops and randomness to create generative art patterns, specifically recreating the aesthetic of Vera Molnar's work through controlled chaos."
concepts:
  - rectMode(CENTER)
  - while loop
  - stochastic control (randomness in loops)
  - nested loops
prerequisites:
  - Basic JavaScript syntax
  - p5.js setup and draw functions
  - Basic for loops
  - Basic geometric primitives (rect)
leads_to:
  - Perlin Noise
  - Advanced Generative Art
  - Complex algorithmic patterns
---
# Algorithmic Art: Balancing Order and Disorder

This lesson explores how to use randomness and loops to create generative art. We will specifically look at reproducing the aesthetic tension found in the work of artist **Vera Molnar**, particularly her 1970s series *[(Des)Ordres]*. Her work explores the intersection of structured grids (order) and stochastic variations (disorder).

## The Concept: Order vs. Disorder [00:22]

To achieve the visual tension seen in Molnar's work, we need to combine two opposing forces:
1.  **Order:** A predictable, mathematical structure (like a grid or concentric shapes).
2.  **Disorder:** Randomness that breaks the pattern, creating "noise" or texture.

The goal is to use code to automate a repetitive process but introduce enough randomness so that the result isn't perfectly predictable, creating a sense of "controlled chaos."

## Setting Up Concentric Shapes [01:00]

To create concentric shapes (shapes nested inside one another), the easiest approach is to change how the computer calculates the position of a rectangle.

By default, p5.js draws rectangles from the top-left corner. If we want to draw a series of squares that all share the same center, it is much simpler to use `rectMode(CENTER)`. This shifts the coordinate origin from the top-left corner to the center of the shape.

```javascript
function setup() {
  createCanvas(600, 400);
  rectMode(CENTER); // Draws rectangles from their center point
  noFill();         // Makes the squares hollow (outlines only)
}

function draw() {
  background(240);
  // Drawing manually to visualize the concept:
  rect(50, 50, 100); // Position (50,50), Size 100
  rect(50, 50, 90);  // Position (50,50), Size 90
  rect(50, 50, 80);  // Position (50,50), Size 80
}
```

The canvas shows a series of white outlines stacked on top of each other, creating a single "target" or concentric square effect.

## Automating with the `while` Loop [03:21]

Drawing every single rectangle manually is inefficient. Instead, we can use a `while` loop. Unlike a `for` loop, which runs for a specific number of iterations, a `while` loop continues as long as a certain condition remains true.

To create diminishing squares, we define a variable for the current size and tell the loop to keep drawing as long as that size is greater than zero.

```javascript
let currSize = 100; // Initial size

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);
  noFill();
  background(240);
}

function draw() {
  // The loop continues as long as currSize > 0
  while (currSize > 0) {
    rect(58, 50, currSize); // Draw the rectangle at a fixed center
    currSize -= 5;          // Decrease size for the next iteration
  }
}
```

### Debugging: The Importance of Variable Scope [05:03]

A common mistake when using loops is failing to reset variables. If `currSize` is declared globally (outside of the `draw` function) and we decrease it inside a loop, its value will eventually hit zero and stay there. On the next frame of the animation, the loop won't run at all because `currSize` is already 0.

To fix this, you must ensure the variable used for the loop's logic is reset to its starting value at the beginning of every iteration or frame.

## Introducing Controlled Randomness [05:29]

If we simply decrease the size by a fixed amount (e.g., `currSize -= 5`), we get perfect, predictable concentric squares. To introduce "disorder," we use the `random()` function inside a conditional statement.

Instead of always drawing the next square, we use an `if` statement to decide whether or not to draw it based on a probability.

```javascript
let currSize = 90;

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);
  noFill();
  background(240);
}

function draw() {
  while (currSize > 0) {
    // We only draw the rectangle if a random number is less than 0.7
    if (random() < 0.7) {
      rect(50, 50, currSize);
    }
    
    // We always decrease the size so the loop eventually ends
    currSize -= 5;
  }
}
```

**The Insight:** By adjusting the threshold (changing `0.7` to `0.3`, for example), you can control the "density" of the noise. 
*   A high probability (e.g., `0.9`) results in a nearly perfect, ordered pattern.
*   A low probability (e.g., `0.2`) results in a sparse, chaotic pattern where many squares are missing.

This creates the "visual tension" essential to algorithmic art: a structure that is clearly present but has been disrupted by chance.

# Algorithmic Tension: Order vs. Disorder

This lesson demonstrates how to use nested loops and stochastic (random) processes to recreate the aesthetic tension found in the work of artist Vera Molnar, specifically her 1970s series *[(Des)Ordres]*. The goal is to create a structured grid (order) and then introduce controlled randomness (disorder) within that structure.

## Establishing the Base Logic [06:30]

To create a repetitive pattern, we first establish a grid using `for` loops. We also use `rectMode(CENTER)` to ensure that when we draw nested shapes, they expand outward from a central point rather than from the top-left corner.

```javascript
let size = 90; // The base dimension for our grid cells
let currSize = size;

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER); // Simplifies drawing concentric shapes
  noFill();         // We only want the outlines to create a "wireframe" look
  background(240);  // Light gray background
}

function draw() {
  // We will build the grid logic here
}
```

## Implementing Nested Loops and Variable Scope [07:00]

To create concentric squares within each grid cell, we use a `while` loop. This allows us to start with a large square and progressively decrease its size until it reaches zero.

### The Debugging Insight: Variable Persistence
A common mistake when nesting loops is failing to reset the state of variables used in the inner loop. If we use `currSize` to track the shrinking size of a square, once that variable reaches zero, it stays at zero for all subsequent iterations of the outer loop. To fix this, we must re-assign `currSize = size` at the start of every new grid cell iteration.

The following code demonstrates this logic:

```javascript
function draw() {
  for (let x = 0; x < width; x += size) {
    // Resetting currSize here is critical so each grid cell 
    // starts with a full set of concentric squares.
    currSize = size; 

    while (currSize > 0) {
      // Logic for drawing goes here
      currSize -= 5; // Shrink the square for the next iteration
    }
  }
}
```

## Introducing Controlled Randomness [08:30]

To move from perfect geometric repetition to "controlled chaos," we use the `random()` function within a conditional statement. By checking if a random number is below a certain threshold (e.g., `0.7`), we can decide whether or not to draw a specific rectangle. This creates "visual noise" or texture within the grid.

```javascript
function draw() {
  for (let x = 0; x < width; x += size) {
    currSize = size;

    while (currSize > 0) {
      // Stochastic control: only draw the rectangle 70% of the time
      if (random() < 0.7) {
        rect(x + 50, y + 50, currSize); 
      }
      currSize -= 5;
    }
  }
}
```

*Note: The `+ 50` offset is used to center the drawing within the grid cell, compensating for the `rectMode(CENTER)` logic.*

## Creating a 2D Grid [10:30]

To fill the entire canvas, we must nest our existing logic inside a second `for` loop that iterates through the vertical axis (`y`). This creates a complete 2D grid of randomized, concentric patterns.

### Final Implementation: The (Des)Ordres Pattern

The final code produces a grid where each cell contains a series of diminishing, partially rendered rectangles. This creates the "tension" between the mathematical order of the grid and the unpredictable disorder of the random rendering.

```javascript
let size = 90;
let currSize = size;

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);
  noFill();
  background(240);
}

function draw() {
  // Outer loop for horizontal movement (X-axis)
  for (let x = 0; x < width; x += size) {
    // Inner loop for vertical movement (Y-axis)
    for (let y = 0; y < height; y += size) {
      
      // Resetting the current size for every new grid cell
      currSize = size;

      // While loop to create concentric squares
      while (currSize > 0) {
        // Introduce randomness/noise to create texture
        if (random() < 0.7) {
          rect(x + 50, y + 50, currSize);
        }
        currSize -= 5; // Decrement size for the next concentric square
      }
    }
  }
  // Stop the draw loop once the pattern is generated
  noLoop(); 
}
```

**Visual Result:** The canvas displays a grid of squares. Because of the `random() < 0.7` condition, some squares in the concentric sequence are missing, creating a flickering, textured effect that breaks the rigid mathematical perfection of the grid.
