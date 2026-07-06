---
video_id: 1-what-are-functions
video_title: 1 what are functions
video_file: 1 what are functions.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%206%2F1%20what%20are%20functions.mp4"
week: week 6
module: Module 3 - Generation and Life
topic: "Introduction to the conceptual foundations of functions, focusing on reusability, abstraction, and modularity through a comparison between p5.js and the native Canvas API."
concepts:
  - reusability
  - abstraction
  - modularity
  - function call
prerequisites:
  - Basic JavaScript syntax
  - Familiarity with p5.js built-in functions (like setup and draw)
leads_to:
  - Function definition
  - Creating custom reusable code
  - Advanced algorithmic design
---
# Understanding the Fundamentals of Functions

Functions are a cornerstone of programming, especially in creative coding. While we often use them without thinking, understanding the logic behind them allows us to transition from being mere users of code to becoming architects of complex systems.

## The Three Pillars of Functions [00:13]

To understand why functions are essential, we can categorize their purpose into three key concepts: **reusability**, **abstraction**, and **modularity**.

*   **Reusability:** The ability to write a block of code once and execute it multiple times with different inputs.
*   **Abstraction:** The process of hiding complex implementation details behind a simplified interface. It is about separating the "how" (the complicated steps) from the "what" (the simple command).
*   **Modularity:** The ability to encapsulate a large number of operations into a single, manageable unit. This allows you to trigger complex behaviors with just one function call.

## Reusability in Practice [00:53]

We use reusability every time we call a built-in function like `ellipse()`. Instead of rewriting the logic to draw a shape every time, we simply call the function with new parameters.

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // First instance of the ellipse idea
  ellipse(100, 100, 50, 200); 
  // Reusing the same ellipse logic with different parameters
  ellipse(50, 300, 100, 18); 
}
```

If a function could only draw an ellipse in one specific location at one specific size, it would have limited utility. By designing functions to be flexible—allowing for different $x$, $y$, width, and height values—we create tools that can be used in infinite contexts.

## Abstraction: Hiding Complexity [02:14]

Abstraction is the concept of reducing a complex process into a simple command. In p5.js, when you call `ellipse(x, y, w, h)`, the library is performing a massive amount of "invisible" work for you.

To see what abstraction looks like without p5.js, we have to look at the native **CanvasRenderingContext2D API**. To draw a simple ellipse using standard JavaScript, you must perform several manual steps:

1.  **Access the Context:** You must first get the 2D context of the canvas element.
2.  **Begin a Path:** You must explicitly tell the browser you are starting a new shape using `beginPath()`.
3.  **Define Complex Parameters:** The native `ellipse()` method requires much more information than p5.js, including rotation and start/end angles.
4.  **Stroke the Path:** You must explicitly call `stroke()` to actually make the shape visible on the screen.

**Native JavaScript Approach:**
```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Draw the ellipse
ctx.beginPath();
ctx.ellipse(100, 50, 75, Math.PI / 4, 0, 2 * Math.PI, 0);
ctx.stroke();
```

**The p5.js Abstraction:**
p5.js abstracts this entire process away. It hides the context management, the path initialization, and the complex trigonometric parameters. This allows the artist to focus only on what is necessary for the visual output: **position and size**.

## Function Calls vs. Function Definitions [05:04]

It is vital to distinguish between *using* a function and *creating* one.

### Function Calls
When we write `ellipse(100, 100, 50, 200);`, we are making a **function call**. We are telling the computer to "run this existing piece of code now." Most of our work in early coding consists of calling functions that someone else (like the p5.js developers) has already defined.

### Function Definitions
The next step in a programmer's journey is **function definition**. This is the act of creating our own custom functions. When we define a function, we are:
1.  Creating our own **reusable** logic.
2.  **Abstracting** away complexity by hiding messy details inside our own custom command.
3.  Achieving **modularity** by turning a long sequence of code into a single, easy-to-use call.

By mastering function definitions, you move from simply using a library to extending it with your own custom behaviors.
