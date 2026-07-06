---
video_id: 1-random
video_title: 1 random
video_file: 1 random.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 4/1 random.mp4"
week: week 4
module: Module 2 – Chaos and Control
topic: "Introduction to randomness in generative art, covering the distinction between true and pseudo-randomness and how to implement the random() function in p5.js."
concepts:
  - Randomness vs. Noise
  - Pseudo-Random Number Generators (PRNG)
  - Cryptographically Secure PRNG (CSPRNG)
  - random() with no arguments
  - random(min, max)
  - random([array])
prerequisites:
  - Basic p5.js setup (setup and draw functions)
  - Understanding of variables
  - Basic coordinate system (x, y)
leads_to:
  - Noise (Perlin/Simplex)
  - Animated randomness
  - 2D Noise with time
---
# Understanding Randomness in Generative Art

In generative art, we often deal with two related but distinct concepts: **Randomness** and **Noise**. While they both involve chance, their behavior within a system is fundamentally different.

## Defining Randomness vs. Noise [00:19]

**Randomness** is characterized by unpredictability. In a truly random sequence, any given number has no relationship to the number that preceded it. If you were to plot these values, they would appear as unpredictable jumps—sometimes large, sometimes small—making it impossible to predict the next value based on current data.

**Noise**, by contrast, is chance that exists within an underlying pattern. While randomness is chaotic and disconnected, noise provides a sense of structured variation (a concept that will be explored in detail in future modules).

## The Reality of Pseudo-Randomness [01:56]

It is a common misconception that computers generate "true" randomness. In reality, computers are deterministic machines; they do not have internal mechanisms like rolling dice to produce stochasticity. Instead, they use **Pseudo-Random Number Generators (PRNGs)**.

### How PRNGs Work
A PRNG uses an algorithm to produce a sequence of numbers that *appear* random. To achieve this, the algorithm requires an external source of "entropy"—an arbitrary quality to kickstart the unpredictability. Common sources include:
*   Mouse movements
*   The exact time the device has been running
*   The coordinates of a user's last click

### The Importance of Security (CSPRNG)
While the randomness used in art is for aesthetic purposes, a specific category of these generators is vital to modern civilization: **Cryptographically Secure Pseudo-Random Number Generators (CSPRNGs)**. These are so unpredictable that they form the foundation of internet security, allowing for the generation of secure passwords and encrypted data streams.

## Implementing Randomness in p5.js [04:06]

In the p5.js library, the `random()` function is the primary tool for introducing chance into your sketches. The function can be used in several different ways depending on the arguments you provide.

### 1. Generating a Float between 0 and 1
When called with no arguments, `random()` returns a floating-point number between $0$ and $1$.

```javascript
let rando;

function setup() {
  createCanvas(400, 460);
}

function draw() {
  background(220);
  rando = random(); // Generates a number like 0.74286359
  console.log(rando);
}

noLoop(); // Ensures the random number is only generated once
```

### 2. Constraining to a Range
To make the random values useful for visual elements (like positioning an object on a canvas), you can pass arguments to define the minimum and maximum bounds.

**Using one argument:**
`random(max)` returns a value between $0$ and the specified maximum. To use this for screen coordinates, you can pass the built-in `width` or `height` variables.

```javascript
function draw() {
  background(220);
  randox = random(width);  // Random X between 0 and 400
  randoy = random(height); // Random Y between 0 and 460
  circle(randox, randoy, 20);
}
```

**Using two arguments:**
`random(min, max)` allows you to constrain the value within a specific window.

```javascript
function draw() {
  background(220);
  // Constrains X to be between 200 and the canvas width
  randox = random(200, width); 
  // Constrains Y to be between 100 and the canvas height
  randoy = random(100, height); 
  circle(randox, randoy, 20);
}
```

### 3. Selecting from a Discrete List (Arrays)
You can also force the function to choose specifically from a predefined set of values by passing an array (using square brackets) as the argument.

```javascript
function draw() {
  background(220);
  // The function will only pick one of these four specific numbers
  randox = random([50, 100, 200, 300]); 
  randoy = random(height);
  circle(randox, randoy, 20);
}
```

### Summary of `random()` Overloads
| Syntax | Result |
| :--- | :--- |
| `random()` | A float between $0$ and $1$ |
| `random(max)` | A float between $0$ and `max` |
| `random(min, max)` | A float between `min` and `max` |
| `random([a, b, c])` | One value chosen from the provided list |

## Implementing Randomness in p5.js

In generative art, randomness is used to introduce chance and unpredictability into a system. In the p5.js library, the `random()` function is the primary tool for this, and it can be used in several different ways depending on the level of control required.

### Selecting from a Discrete List [08:36]
Sometimes, you don't want a continuous range of numbers; instead, you want an object to choose from a specific set of predefined values. You can achieve this by passing an **array** (a list of numbers inside square brackets) into the `random()` function.

```javascript
let randoX, randoY;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  // Selecting from a specific list of numbers
  randoX = random([50, 100, 200, 300]); 
  randoY = random([100, 200, 300]);
  circle(randoX, randoY, 20);
}
```

When you use an array, the output is restricted to only those specific values. In the editor, this results in circles appearing at fixed intervals rather than scattered anywhere on the canvas.

To create a "trail" effect where previous positions remain visible, you can adjust the alpha (opacity) of the `background()` function. By using a low opacity, such as `background(220, 20)`, the background doesn't fully clear every frame, allowing the random elements to accumulate and fade over time.

### The Three Modes of `random()` [09:29]

The `random()` function is versatile and changes its behavior based on the number of arguments provided:

#### 1. No Arguments (0 to 1) [09:34]
If you call `random()` with no arguments, it returns a floating-point number between $0$ and $1$. Because these values are so small, they are often difficult to see visually on a large canvas without logging them to the console.

```javascript
randomX = random(); // Returns a value between 0 and 1
console.log(randomX);
```

#### 2. Two Arguments (Min to Max) [10:05]
To constrain a random value within a specific range, provide two arguments: `random(min, max)`. This is useful for keeping elements within the bounds of your canvas.

```javascript
function draw() {
  background(220, 20);
  // Generates a value between 100 and the canvas width
  randox = random(100, width); 
  // Generates a value between 0 and the canvas height
  randoY = random(0, height); 
  
  circle(randox, randoY, 20);
}
```

In this setup, the circles will appear anywhere within the specified boundaries. Using `width` and `height` as arguments ensures that your random distribution scales automatically if you change the canvas size.

#### 3. Array Input (Discrete Selection) [10:25]
As demonstrated previously, passing an array allows for "patterned randomness." This is useful when you want to maintain a sense of structure or rhythm within your generative system, selecting only from specific coordinates or sizes.

```javascript
// Only picks one of these three values: 100, 200, or 300
randox = random([100, 200, 300]); 
```

By combining these methods—using ranges for broad movement and arrays for specific structural decisions—you can balance pure chaos with controlled patterns.
