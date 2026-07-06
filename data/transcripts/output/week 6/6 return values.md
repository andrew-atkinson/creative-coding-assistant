---
video_id: 6-return-values
video_title: 6 return values
video_file: 6 return values.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%206%2F6%20return%20values.mp4"
week: week 6
module: Module 3 - Generation and Life
topic: Understanding return values in JavaScript/p5.js to pass data between functions and distinguish them from side-effect functions.
concepts:
  - return values
  - side effects
  - abstraction
  - succinct vs. explicit return
prerequisites:
  - Basic p5.js drawing functions (fill, stroke, rect)
  - Understanding of function parameters and arguments
  - Basic trigonometric functions (sin, cos)
leads_to:
  - Modular programming
  - Advanced algorithmic art
  - Complex nested function structures
---
# Understanding Return Values in JavaScript

In creative coding, we often use functions to simplify our work. While many functions are used to "do something" (like drawing a shape), others are used to "calculate something." This lesson explores the concept of **abstraction** and how to use `return` statements to pass data between functions.

## The Goal: Abstraction [01:05]

Abstraction is the process of encapsulating complex logic or repetitive procedures into a single, reusable function. Instead of writing out long mathematical formulas every time you want a specific color, you can create a function that handles the math and simply gives you the result.

The instructor begins with a "messy" approach where color calculations are performed directly inside the `draw()` loop:

```javascript
function draw() {
  background(50, 100, 150);
  // Calculating color values manually in the main loop
  sineValue = (1 + sin(frameCount)) * 128;
  color1 = color(sineValue, 0, 0);
  color2 = (1 + cos(frameCount)) * 128;
  
  whirligig(mouseX, mouseY, frameCount, color1, color2);
}
```

To make the code cleaner and more modular, we want to move that logic into a dedicated function.

## Side Effects vs. Return Values [04:02]

To master functions, you must understand the distinction between two types of functional behavior:

### 1. Functions with Side Effects
Most p5.js functions are designed to produce **side effects**. When you call `fill()`, `stroke()`, or `rect()`, the function "does stuff" to the canvas. It changes the state of the drawing environment, but it doesn't "give an answer back" to the rest of your code.

### 2. Functions with Return Values
A function with a **return value** acts like a question and an answer. You provide it with an input (a parameter), it performs a calculation, and then it "returns" the result back to the line of code that called it.

Think of `sin()` or `cos()`. When you call them, they don't draw anything on the screen; instead, they calculate a number and provide that number to your code so you can use it elsewhere.

## The "Broken" Function: A Debugging Lesson [02:31]

When refactoring code, a common mistake is forgetting to actually send the calculated value back. Let's look at an attempt to create a `sinColor` function:

```javascript
// The goal: A function that returns a number between 0 and 255
function sinColor(value) {
  1 + sin(value) * 128; // The calculation happens...
}

function draw() {
  background(50, 100, 150);
  // We pass the result of sinColor into a color function
  whirligig(mouseX, mouseY, frameCount, sinColor(frameCount), color2);
}
```

**The Problem:** 
When you run the code above, it breaks. The console will show an error like:  
`Error: [object Arguments] is not a valid color representation.`

**The Insight:** 
Even though the math inside `sinColor` is correct, the function doesn't actually "hand over" the result. In JavaScript, if a function does not have a `return` statement, it implicitly returns `undefined`. 

When we try to use the result of `sinColor(frameCount)` inside another function (like `fill()` or a custom drawing function), we are actually passing `undefined`. This causes the program to crash because you cannot use "nothing" as a color value.

## Implementing the `return` Statement [03:57]

To fix this, we must use the `return` keyword. This tells JavaScript: "Once you finish this calculation, send this value back to whoever asked for it."

### The Succinct Approach
If your function only performs one calculation, you can return the expression directly in a single line:

```javascript
function sinColor(value) {
  return 1 + sin(value) * 128;
}
```

### The Explicit Approach
For more complex logic, you might assign the result to a local variable first and then return that variable. This can make debugging easier because you can inspect the variable before it is sent back:

```javascript
function sinColor(value) {
  let result = 1 + sin(value) * 128;
  return result;
}
```

By using `return`, the function call `sinColor(frameCount)` is replaced by the actual number it calculates, allowing that value to flow seamlessly through your program.

# Understanding Return Values in JavaScript

In programming, functions are often used to "do stuff"—like drawing a shape or moving an object. However, there is another vital type of function: one that "gives an answer back." This concept is known as a **return value**.

## The Concept of the "Answer" [06:09]

When you call a function, you are essentially asking the computer to perform a task. Most p5.js functions (like `fill()` or `rect()`) have **side effects**; they change the state of the canvas, but they don't provide data back to your main code.

However, when you want a function to calculate a value and pass that value back to the part of the code that called it, you must use the `return` keyword.

Think of a function as a **question** and the return value as the **answer**. If you ask a question but don't provide an answer, the rest of your program is left waiting for information that will never arrive.

### The Consequence of a Missing Return [06:30]
If you perform a calculation inside a function but forget to use the `return` statement, the computer performs the math internally but then "forgets" the result immediately. 

If you try to use that function's output as an argument for another function (for example, passing the result of `sinColor()` into `fill()`), and you haven't used a `return` statement, the computer receives `undefined`. This leads to errors because you are essentially trying to use "nothing" as a color or a coordinate.

```javascript
// This function calculates a value but doesn't "give it back"
function sinColor(value) {
  1 + sin(value) * 128; // The calculation happens, but the result is lost
}

// This will fail because sinColor returns 'undefined'
fill(sinColor(frameCount)); 
```

## Implementing Return Values [06:54]

There are two primary ways to implement a return value in your code.

### 1. The Succinct Approach
You can perform the calculation and return it in a single line. This is efficient when the logic is straightforward.

```javascript
function sinColor(value) {
  return 1 + sin(value) * 128;
}
```

### 2. The Explicit Approach (Using Variables)
For more complex logic, it is often better to store the result in a local variable first. This makes the code easier to read and allows you to manipulate the data before sending it back.

```javascript
function sinColor(value) {
  let newValue = 1 + sin(value) * 128; // Calculate and store in a variable
  return newValue;                      // Return that specific variable
}
```

## Advanced Abstraction: Returning Complex Data [07:52]

Return values aren't limited to simple numbers. You can use a function to perform complex mathematical transformations and then return a high-level object, such as a **color**.

By encapsulating color logic within a function, you keep your `draw()` loop clean and modular. Instead of writing long mathematical expressions inside your drawing commands, you simply call a function that "answers" with a color.

### Example: Creating an Oscillating Color [08:57]
In this demonstration, we use `sin()` and `cos()` to create two different values (red and blue) that oscillate at different rates. This creates a sophisticated color-cycling effect that moves through various shades (like teal, magenta, or raspberry) without cluttering the main animation logic.

```javascript
function sinColor(value) {
  // Calculate oscillating values for Red and Blue channels
  let redValue = 1 + sin(value) * 128;
  let blueValue = 1 + cos(value) * 128;
  
  // Create a color object using those values
  let c = color(redValue, 0, blueValue);
  
  // Return the entire color object back to the caller
  return c; 
}

function draw() {
  background(0);
  // The 'answer' from sinColor is passed directly into the fill() function
  fill(sinColor(frameCount)); 
  ellipse(200, 200, 50, 50);
}
```

### Key Takeaway: Nested Function Calls [12:01]
The true power of return values is realized when you nest functions. When a function call is used as an argument inside *another* function—such as `whirligig(..., sinColor(frameCount))`—the computer must resolve the "inner" function first. 

The `sinColor` function is asked a question, it calculates the answer, and then that "answer" is handed directly to `whirligig`. Without the `return` keyword, this chain of communication breaks, and your generative system will fail to receive the data it needs to animate.

# Understanding Return Values in Functions

## Side Effects vs. Return Values [12:30]

When writing functions in p5.js, it is important to distinguish between two fundamentally different types of operations: those that produce **side effects** and those that produce **return values**.

### Functions with Side Effects
A function has a "side effect" if its primary purpose is to change something outside of itself—most commonly, the state of the canvas. If a function's only job is to draw something on the screen, you do not need a `return` statement.

For example, functions like `fill()`, `stroke()`, or `rect()` are side-effect functions. They tell the computer, "Change the current color to X" or "Draw a shape at Y." Once they have performed that action on the canvas, their job is done.

### Functions with Return Values
A function requires a `return` statement when it needs to "give an answer back" to the part of the program that called it. Think of a function with a return value as a **question**. You send data into the function (the question), and the function calculates a result and passes that result back to you (the answer).

If you attempt to use the output of a function in another calculation—such as passing it into `fill()` or using it to determine a position—but you forgot the `return` keyword, the function will return `undefined`. This will cause your code to break because you are essentially trying to perform math with "nothingness."

## Implementation Patterns [12:30]

When implementing a function that returns a value, you have two main ways to write the logic:

### 1. The Succinct Approach
You can return a mathematical expression directly in one line. This is efficient and clean when the calculation is straightforward.

```javascript
return 1 + sin(value) * 128;
```

### 2. The Explicit Approach
For more complex logic, it is often better to assign the calculation to a local variable first, and then return that variable. This makes the code much easier to debug because you can use `console.log()` to inspect the value of the variable before it is sent back.

```javascript
let redValue = 1 + sin(value) * 128;
return redValue;
```

## Practical Application: Dynamic Color Cycling [12:30]

In creative coding, return values are essential for creating smooth, mathematical animations. By using trigonometric functions like `sin()` or `cos()` inside a function and returning the result, you can create oscillating values that drive visual properties like color or movement.

The following code demonstrates how a function can be used to calculate a value that is then passed into other drawing commands, creating a swirling, colorful pattern of concentric circles.

```javascript
let offset = 0;
let color1, color2, sineValue;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(50, 100, 150);
  
  // Calculating a value using cos() to drive color oscillation
  color2 = (1 + cos(frameCount)) * 128;
  
  // Example of calling functions to create complex visual patterns
  whirligig(mouseX, mouseY);
  sinColor(frameCount);
  whirligig();

  // Using noise and trigonometric values to drive visual parameters
  noise(offset + 10) * width,
  color(240, 100, 100),
  color(50, 200, 0);
}
```

In this setup, the canvas displays a series of overlapping circles with gradients ranging from pink to green. The movement and color shifts are driven by the continuous, oscillating values returned by our mathematical functions, allowing for complex generative behavior with very little code in the main `draw()` loop.
