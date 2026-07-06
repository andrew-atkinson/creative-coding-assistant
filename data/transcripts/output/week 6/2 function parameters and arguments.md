---
video_id: 2-function-parameters-and-arguments
video_title: 2 function parameters and arguments
video_file: 2 function parameters and arguments.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%206%2F2%20function%20parameters%20and%20arguments.mp4"
week: week 6
module: Module 3 - Generation and Life
topic: "Introduction to custom functions, abstraction, and using parameters to create reusable code modules."
concepts:
  - function definition
  - function call
  - parameters
  - arguments
  - push() and pop()
  - abstraction
prerequisites:
  - Basic JavaScript syntax
  - p5.js drawing primitives (arc, fill, translate)
  - Understanding of setup() and draw()
leads_to:
  - Nested functions (functions calling other functions)
  - Using loops to draw many instances of a function
  - Using noise or randomness as arguments for functions
---
# Understanding Functions: Abstraction and Reusability

In programming, especially when creating generative art, you will quickly encounter "spaghetti code"—long, repetitive sequences of commands that are difficult to manage. Functions allow you to move from this inefficient approach toward **abstraction** and **modularity**.

## The Problem: Repetitive Code [00:10]

To understand why we need functions, consider the process of drawing a simple object, like a black and white cookie. Without functions, you have to write out every single drawing command for every instance of that object.

To draw one cookie, you might write something like this:

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  fill(0);
  arc(mouseX, mouseY, 50, 50, 0, 180);
  fill(255);
  arc(mouseX, mouseY, 50, 50, 180, 0);
}
```

The code above works, but it has a major limitation: the cookie is hard-coded to follow `mouseX` and `mouseY`. If you wanted to draw a second cookie at a different location, you would have to copy and paste all those lines and manually change the coordinates in every single command. This is inefficient and makes your code difficult to read as it scales.

## Transitioning to Abstraction [02:12]

**Abstraction** is the process of grouping a sequence of commands into a single named entity to hide the implementation details. Instead of writing eight lines of code every time you want a cookie, you can define a function once and then "call" it whenever you need it.

To do this effectively, we use `push()` and `pop()`. These functions isolate drawing transformations. By wrapping our code in `push()` and `pop()`, we ensure that any changes made to the coordinate system (like using `translate()`) only affect the code inside that function and do not "leak" out to the rest of your program.

### Defining a Function [03:13]

A **function definition** is where you declare what the function does. We can take our cookie logic and wrap it in a new function called `cookie()`:

```javascript
function cookie() {
  push();
  translate(mouseX, mouseY); // Currently hard-coded to mouse position
  noStroke();
  fill(0);
  arc(0, 0, 50, 50, 0, 180);
  fill(255);
  arc(0, 0, 50, 50, 180, 0);
  pop();
}
```

Now, in our `draw()` loop, we can simply call the function:

```javascript
function draw() {
  background(220);
  cookie(); // This executes the block of code defined above
}
```

While this is more modular, it isn't yet fully **reusable**. Because the `translate()` command inside the function is still using `mouseX` and `mouseY`, this cookie will only ever appear at the mouse position.

## Parameters and Arguments [04:22]

To make a function truly reusable, we need to give it the ability to accept different values. We do this using **parameters**.

Think of **parameters** as "variables for functions." They act as placeholders that wait to receive specific values when the function is called.

### Adding Parameters [04:38]

We can modify our `cookie` definition to accept two parameters, `x` and `y`. We then use these parameters inside the function instead of hard-coded values:

```javascript
function cookie(x, y) { // x and y are parameters
  push();
  translate(x, y);    // The function uses the values passed to it
  noStroke();
  fill(0);
  arc(0, 0, 50, 50, 0, 180);
  fill(255);
  arc(0, 0, 50, 50, 180, 0);
  pop();
}
```

### Passing Arguments [05:48]

When you actually use (call) the function, you provide specific values called **arguments**. If you try to call `cookie()` without providing any values, the program will throw an error because the function is expecting numbers to fill the `x` and `y` placeholders.

By passing arguments, we can now draw multiple cookies in different locations with a single line of code for each:

```javascript
function draw() {
  background(220);
  cookie(mouseX, mouseY); // Follows the mouse
  cookie(100, 200);       // Static position 1
  cookie(200, 350);       // Static position 2
}
```

## Summary of Benefits [06:46]

By moving from repetitive drawing commands to a parameterized function, we have achieved three major goals:
1.  **Abstraction**: We no longer care *how* a cookie is drawn; we only need to know the command `cookie()`.
2.  **Modularity**: The drawing logic is contained in one specific block, making it easier to manage.
3.  **Reusability**: We can create as many cookies as we want, in any location, by simply passing different arguments.

This transformation turns eight lines of complex code into one highly legible line, allowing you to scale your creative ideas without the complexity becoming overwhelming.

## Scaling Complexity with Functions [07:00]

Once a function is defined, you no longer need to manage the individual drawing commands that make up its shape. You can simply use the function's name as a shorthand to execute those commands. This abstraction provides several immediate advantages for generative art:

*   **Readability:** The `draw()` loop becomes much easier to read. Instead of seeing a long list of `arc()`, `fill()`, and `translate()` commands, you see high-level intent: `cookie(mouseX, mouseY);`.
*   **Scalability:** Because the function is modular, you can easily create multiple instances of an object by calling it with different coordinates.
*   **Algorithmic Generation:** You can use loops or noise functions to pass different values into the function, allowing you to generate hundreds of unique objects with very little code.
*   **Nesting:** Functions can serve as building blocks for even more complex objects, where one function calls another to create hierarchical structures.

### Implementation Example
The following code demonstrates how a complex shape (a "cookie") is defined once and then called multiple times with different arguments to populate the canvas.

```javascript
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  
  // Using the function to follow the mouse
  cookie(mouseX, mouseY);
  
  // Drawing static instances at specific coordinates
  cookie(100, 200);
  cookie(200, 350);
}

// The function definition: encapsulates the "how" of drawing a cookie
function cookie(x, y) {
  push();           // Isolate transformations
  translate(x, y);  // Move the origin to the function's arguments
  noStroke();
  
  fill(0);          // Draw the bottom half (black)
  arc(0, 0, 50, 50, 0, 180);
  
  fill(255);        // Draw the top half (white)
  arc(0, 0, 50, 50, 180, 0);
  
  pop();            // Restore the previous coordinate state
}
```

The canvas shows the result of this modular approach: a series of black and white circular shapes. One follows the mouse cursor, while others remain fixed at the coordinates specified in the `draw()` loop. By using `push()` and `pop()` within the function, we ensure that the `translate(x, y)` command only affects the cookie itself and doesn't shift the entire coordinate system for subsequent drawing operations.
