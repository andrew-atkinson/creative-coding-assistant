---
video_id: 3-loop-danger
video_title: 3 loop DANGER
video_file: 3 loop DANGER.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%203%2F3%20loop%20DANGER.mp4"
week: week 3
topic: "Identifying and preventing common errors in for loops, specifically infinite loops that crash browsers and off-by-one iteration errors."
concepts:
  - convergence
  - infinite loop
  - off-by-one error
prerequisites:
  - basic for loop syntax
  - variable declaration (let)
  - comparison operators (<, <=)
leads_to:
  - nested loops
  - maps
---
# Loop Dangers: Preventing Infinite Loops and Off-by-One Errors

When working with repetition, the power of loops comes with significant risks. If a loop is not written correctly, it can cause your browser to freeze or crash by consuming all available system memory. This guide covers how to identify these dangers and how to avoid common logical errors.

## Safeguarding Your Work [00:28]

Before experimenting with new loop logic, ensure your work is safe. An infinite loop can freeze the browser, making it impossible to click anything or even save your progress manually.

*   **Manual Save:** Always save your sketch before writing complex loops.
*   **Auto-save:** If you have auto-save enabled, your work is periodically updated. If the browser crashes, you will only lose the progress made since the last auto-save (e.g., "saved 15 seconds ago").

## The Golden Rule: Convergence [01:28]

The most critical concept in loop control is **convergence**. For a `for` loop to function correctly, the variable used for iteration must move from its initial value toward the exit condition.

A standard loop follows this structure:
`for (let x = initialValue; x condition; update)`

For the loop to exit, the `update` step must eventually cause the `condition` to become false. If the variable moves away from the condition rather than toward it, you have created an infinite loop.

## Identifying Infinite Loops [02:31]

An infinite loop occurs when the loop condition remains `true` forever. Because computers are literal, they will continue executing the instructions until the system runs out of memory (often referred to as a "stack overflow" or simply running out of memory).

### Scenario 1: Incorrect Update Direction [02:31]
If you initialize a variable at zero and use a "less than" condition, but then decrement the variable instead of incrementing it, the loop will never end.

```javascript
// This will cause an infinite loop and crash the browser
for (let x = 0; x < 10; x--) {
  // The value of x will go: 0, -1, -2, -3...
  // It will always be less than 10.
}
```

### Scenario 2: Variable Mismatch [05:34]
Infinite loops can also occur if you update the wrong variable. If your loop condition relies on `x`, but your increment statement updates `i` or `y`, the value of `x` remains unchanged, and the condition never becomes false.

```javascript
// This will cause an infinite loop because 'x' never changes
for (let x = 0; x < 10; x++) {
  // If you accidentally update 'i' instead of 'x':
  i++; 
}
```

**Pro-tip:** Be careful when reusing common variable names like `i`, `x`, or `y`. A mismatch between the declared variable and the updated variable is a frequent cause of accidental crashes.

## Off-by-One Errors [08:11]

An "off-by-one" error is a logic error where a loop iterates one time too many or one time too few. This usually happens due to a misunderstanding of the starting index and the comparison operator.

### The Impact of Zero-Based Indexing [08:37]
In programming, we often start counting at `0`. This means the "zeroth" iteration is actually the first loop.

Consider this common loop:
```javascript
for (let x = 0; x < 10; x++) {
  // This will run exactly 10 times.
}
```
**The logic:** The loop runs for $x = 0, 1, 2, 3, 4, 5, 6, 7, 8,$ and $9$. Once $x$ reaches $10$, the condition `x < 10` becomes false, and it exits.

### Using Less Than vs. Less Than or Equal To [09:14]
The choice of operator changes the total iteration count.

*   **`x < 10`**: If starting at `0`, this runs **10 times** (0 through 9).
*   **`x <= 10`**: If starting at `0`, this runs **11 times** (0 through 10).

To verify your loop count, you can use `console.log()` to see exactly which values the variable takes during each iteration:

```javascript
for (let x = 0; x <= 10; x++) {
  console.log(x); // This will print 0 through 10 in the console
}
```

## Summary Checklist for Loops [07:24]

To prevent crashes and logical errors, perform a mental check of these three items every time you write a loop:

1.  **Convergence:** Is my variable moving toward the exit condition?
2.  **Variable Integrity:** Am I updating the same variable that is used in my condition?
3.  **Iteration Count:** Given my starting value and my operator (`<` vs `<=`), how many times will this actually run?
