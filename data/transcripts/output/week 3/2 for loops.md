---
video_id: 2-for-loops
video_title: 2 for loops
video_file: 2 for loops.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%203%2F2%20for%20loops.mp4"
week: week 3
topic: Introduction to using for loops in Processing to automate repetitive drawing tasks and increase code expressiveness.
concepts:
  - for loop
  - initialization
  - condition
  - incrementer
prerequisites:
  - Basic understanding of variables
  - Knowledge of drawing primitives (e.g., circle())
  - Understanding of boolean expressions (true/false)
leads_to:
  - Nested loops
  - Using map() for data manipulation
---
# Automating Repetition with For Loops

While manual coding allows you to place elements one by one, it is inefficient and difficult to edit. If you want to change the spacing or the number of elements, you have to rewrite every single line. To make your code more expressive and easier to manipulate, you should use a `for` loop to let the computer handle the repetition for you.

## The Anatomy of a For Loop [00:32]

A `for` loop is a control flow structure that requires three specific components, all contained within parentheses and separated by semicolons.

```javascript
for (initialization; condition; incrementer) {
  // Code to repeat goes here
}
```

1.  **Initialization:** This is where you declare and set the starting value of a loop counter variable (e.g., `int x = 0;`).
2.  **Condition:** This is a boolean expression (something that evaluates to either **true** or **false**). Before every iteration, the computer checks this condition. If it is true, the code runs; if it is false, the loop terminates and the program moves to the next line of code below the loop.
3.  **Incrementer:** This updates the variable after each iteration (e.g., `x = x + 1;`). This ensures the loop eventually reaches a state where the condition becomes false, preventing an infinite loop.

### Step-by-Step Execution [01:01]
To understand how the computer "thinks," consider a loop designed to run while `x < 10`:

*   **Start:** `x` is initialized to `0`.
*   **Check:** Is `0 < 10`? **Yes.** Run the code.
*   **Update:** `x` becomes `1`.
*   **Check:** Is `1 < 10`? **Yes.** Run the code.
*   **... (repeats) ...**
*   **Check:** Is `9 < 10`? **Yes.** Run the code.
*   **Update:** `x` becomes `10`.
*   **Check:** Is `10 < 10`? **No.** The loop stops and exits.

## Practical Application: Drawing a Row of Shapes [02:06]

Instead of writing ten lines of code to draw ten circles, you can use a single loop. By using the loop counter variable (`x`) inside your drawing functions, you can control the position of each element dynamically.

```javascript
for (int x = 20; x <= 350; x += 30) {
  circle(x, 70);
}
```

**Technical Breakdown:**
*   `int x = 20;`: We start our first circle at an X-coordinate of 20.
*   `x <= 350;`: We want the loop to continue until we reach 350. Using `<=` ensures that if a calculation lands exactly on 350, it still draws the final shape.
*   `x += 30;`: This is shorthand for `x = x + 30`. Each circle will be placed 30 pixels to the right of the previous one.
*   `circle(x, 70);`: By passing `x` as the first argument, we tell Processing to draw each circle at a new horizontal position determined by the loop.

### Increasing Expressiveness [03:30]
The true power of a loop is how easily it can be modified. 

*   **Changing Density:** If you change the incrementer from `x += 30` to `x += 20`, you instantly get more circles packed closer together without writing any additional lines of code.
*   **Dynamic Color:** You can use the loop counter to drive visual properties like color, creating gradients or fading effects.

```javascript
for (int x = 20; x <= 350; x += 30) {
  fill(x, 0, 0); // The red value increases as x increases
  circle(x, 70);
}
```

In the editor, as `x` increases from 20 to 350, the circles transition from a dark red to a bright red/white. You can even use `x` to control the blue or green channels to create complex color shifts (e.g., transitioning from green to orange).

## Summary Checklist [05:08]
When constructing a `for` loop, remember these rules:
*   **Keyword:** Always start with `for`.
*   **Three Parts:** Initialization, Condition, and Incrementer.
*   **Semicolons:** You must have a semicolon between each of the three components inside the parentheses.
*   **The Variable:** The variable you initialize (like `x`) is available to be used inside the curly braces `{}`.

## Challenge: Vertical Repetition [06:24]
Now that you can control horizontal repetition, try to apply the same logic in reverse. 

**Task:** Construct a `for` loop that draws a series of shapes (circles, rectangles, etc.) arranged **vertically** rather than horizontally. You will need to apply the loop counter variable to the Y-coordinate instead of the X-coordinate.
