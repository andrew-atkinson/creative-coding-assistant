---
video_id: 4-arrays
video_title: 4 arrays
video_file: 4 arrays.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%207%2F4%20arrays.mp4"
week: week 7
module: Module 3 - Generation and Life
topic: "Manipulating arrays in JavaScript using push, pop, and indexing within a p5.js environment."
concepts:
  - zero-based indexing
  - arr.push()
  - arr.pop()
  - return values of pop()
  - NaN (Not a Number)
  - conditional existence check
prerequisites:
  - Basic JavaScript syntax
  - Variable declaration (let)
  - p5.js setup and draw functions
  - Basic arithmetic operators
leads_to:
  - Arrays of Objects
  - Sorting arrays
  - Object-Oriented Programming (OOP)
---
# Arrays and Dynamic Data Manipulation

This lesson explores how to use JavaScript arrays as dynamic collections of data. We move from static, hard-coded lists to interactive structures that can be modified in real-time through user input.

## Understanding Arrays and Zero-Based Indexing [00:00]

An array is an ordered list of elements. In JavaScript, arrays are **zero-indexed**, meaning the first element is at index `0`, the second at index `1`, and so on.

```javascript
// An array is a list of elements
let arr = ["zeroth", 100, "banana", "yoghurt"];
```

When rendering arrays visually in p5.js, we often use loops to iterate through the collection. There are two primary ways to loop through an array:

1.  **The Standard `for` Loop**: Uses a counter (usually `i` or `y`) to access elements by their index. This is useful when you need the index number for calculations (like positioning text).
2.  **The `for...in` Loop**: Iterates over the keys (indices) of the array.

```javascript
function draw() {
  background(20);
  fill(200, 0, 0);

  // Standard for loop: uses 'y' as the index
  for(let y = 0; y < arr.length; y++) {
    // We use the index 'y' to offset the vertical position
    text(arr[y], 50, 70 + y * 100);
  }

  fill(255);
  // for-in loop: 'el' represents the index/key
  for (let el in arr) {
    text(arr[el], 55, 70 + el * 100);
  }
}
```

## Dynamic Manipulation: Adding and Removing Elements [01:48]

Rather than hard-coding every value, we can use built-in JavaScript methods to modify an array while the program is running. This allows for procedural generation and interactive software.

### Adding Elements with `.push()`
The `.push()` method appends a new element to the **end** of an array, increasing its `.length` property.

```javascript
function setup() {
  createCanvas(400, 400);
  arr.push("time"); // Adds "time" to the end of the list
  console.log("arr in setup:", arr); 
}
```

### Removing Elements with `.pop()`
The `.pop()` method removes the **last** element from an array.

```javascript
function mousePressed() {
  arr.pop(); // Removes the last element when the mouse is clicked
}
```

### The Insight: Return Values and Functional Logic [03:02]
A crucial detail of the `.pop()` method is that it does more than just remove an element; it **returns** the value it removed. This means you can pass the result of a `.pop()` directly into another function, such as `console.log()`.

```javascript
function mousePressed() {
  // This removes the last element AND immediately prints it to the console
  console.log(arr.pop()); 
}
```

When you click the mouse, the element is removed from the array (so it disappears from the visual canvas) and simultaneously "passed back" to the `console.log` function, which displays it in the console.

## Summary of Array Operations [04:02]

| Method | Action | Direction |
| :--- | :--- | :--- |
| `.push(value)` | Adds an element | To the end of the array |
| `.pop()` | Removes and returns an element | From the end of the array |

By combining these methods with user interaction (like `mousePressed`), you can create "living" data structures that grow or shrink in response to the environment.

# Array Manipulation and Dynamic Data

Arrays are ordered collections of data. In JavaScript, they are fundamental for managing lists of items—whether those items are strings, numbers, or even other objects. This lesson explores how to initialize arrays, iterate through them, and dynamically modify their contents during runtime.

## Understanding Zero-Based Indexing [06:00]

In JavaScript, arrays are **zero-indexed**. This means the first element in an array is not at position 1, but at index `0`.

```javascript
let arr = ["hero", "100", "banana", "yoghurt"];
```

In this example:
*   `arr[0]` is `"hero"` (the zeroth element).
*   `arr[1]` is `"100"` (the first element).

## Iterating Through Arrays [06:25]

To display or process every item in an array, we use loops. There are two primary ways to iterate through an array: the standard `for` loop and the `for...in` loop.

### The Standard `for` Loop
The standard `for` loop uses a counter (usually `y` or `i`) to access elements by their index. This is the most common way to traverse an array when you need to know the specific position of each element.

```javascript
for (let y = 0; y < arr.length; y++) {
  text(arr[y], 50, 70 + y * 70);
}
```

### The `for...in` Loop
The `for...in` loop iterates over the **keys** (indices) of the array. While it works, it is important to remember that `el` in this context represents the index number, not the value itself.

```javascript
for (let el in arr) {
  text(arr[el], 55, 70 + el * 70);
}
```

## Dynamic Manipulation: Push and Pop [06:13]

Arrays are not static; you can change their size and content while the program is running.

### Adding Elements with `.push()`
The `push()` method appends a new element to the very end of an array, increasing its `.length`.

```javascript
arr.push("time");
arr.push("space");
// The array now includes "time" and "space" at the end.
```

### Removing Elements with `.pop()`
The `pop()` method removes the last element from an array. A key detail is that `.pop()` **returns** the value it removed, allowing you to log it or pass it elsewhere.

```javascript
function mousePressed() {
  console.log(arr.pop()); // Removes the last element and prints it to the console
}
```

## Handling Data Types and Errors [07:05]

When manipulating data, you must be aware of the data types within your array. Attempting to perform math on a non-numeric value (like a string) or an index that doesn't exist will result in `NaN`.

### The `NaN` Error
If you attempt to increment a value that is not a number, or if you try to increment an index that has been removed from the array, JavaScript returns `NaN` (**Not a Number**).

```javascript
// If arr[1] was "space" and we call:
arr[1]++; 

// If arr[1] was removed via pop(), we are attempting:
arr[1]++; // Result is NaN because arr[1] is undefined.
```

### Defensive Programming: Checking for Existence [07:35]
To prevent `NaN` errors, you should validate that an element exists and is a valid number before performing arithmetic. You can use a conditional check to ensure the index is "truthy" before attempting to modify it.

```javascript
function mousePressed() {
  console.log(arr.pop()); // Remove the last element

  // Check if index 1 exists before incrementing
  if (arr[1]) {
    arr[1]++; 
  }
}
```

By checking `if (arr[1])`, the code will only attempt to increment the value if an element actually exists at that position, preventing the program from producing `NaN`.
