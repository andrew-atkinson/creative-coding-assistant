---
video_id: 3-arrays
video_title: 3 arrays
video_file: 3 arrays.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%207%2F3%20arrays.mp4"
week: week 7
module: Module 3 - Generation and Life
topic: "Introduction to JavaScript arrays, including declaration, zero-based indexing, the .length property, and iterating through elements using for loops and for...in loops."
concepts:
  - array
  - zero-based indexing
  - .length property
  - for loop (iteration)
  - for...in loop
prerequisites:
  - Variables
  - Data types (strings, numbers)
  - Basic p5.js setup() and draw() functions
  - Standard for loops
leads_to:
  - Arrays of objects
  - Sorting arrays
  - Object-Oriented Programming (OOP)
---
# Understanding JavaScript Arrays

Arrays are a fundamental data structure used to store an ordered list of elements. While objects allow you to store data in key-value pairs, arrays are designed for collections of values that follow a specific sequence.

## Defining Arrays [00:23]

An array is essentially a "list of stuff"—much like a shopping list or a recipe. In JavaScript, you define an array using square brackets `[]`.

To differentiate from objects:
*   **Braces `{}`** create an **Object**.
*   **Square brackets `[]`** create an **Array**.

```javascript
// An array is a list of elements
let arr = ["first", 100, "banana", "yoghurt"];
```

As shown in the code above, an array can hold various data types simultaneously, including strings and numbers.

## Zero-Based Indexing [02:14]

The most critical concept to understand when working with arrays is that they are **zero-indexed**. This means that instead of starting the count at 1, the first element is located at index `0`.

If we have an array:
`let arr = ["zeroth", 10, "banana", "yoghurt"];`

The mapping of indices to values looks like this:
*   Index `0`: `"zeroth"` (The first element)
*   Index `1`: `10`
*   Index `2`: `"banana"`
*   Index `3`: `"yoghurt"`

### Accessing Elements [03:13]
To retrieve a specific value from an array, you use the array name followed by the index inside square brackets.

```javascript
function setup() {
  createCanvas(400, 400);
  textSize(180);
}

function draw() {
  background(20);
  fill(200, 0, 0); // Red text
  // Accessing the first element (index 0)
  text(arr[0], 50, height/2); 
}
```

In the editor, when we call `arr[0]`, the canvas displays "zeroth". If we change the index to `1`, it displays `100`. Changing it to `3` displays "yoghurt".

## Iterating Through Arrays [05:12]

When working with complex generative systems, you often don't know how many items are in an array or what they are beforehand. To handle this, we use the `.length` property and a `for` loop to automate tasks like rendering every item in a list.

### The `.length` Property [05:31]
The `.length` property is a built-in feature of the array object that tells you exactly how many elements are inside it. In our example `["zeroth", 100, "banana", "yoghurt"]`, the length is `4`.

### Using a `for` Loop [05:55]
To loop through the entire array, we use a `for` loop. A common mistake is to loop until the index equals the length, but because of zero-based indexing, we must stop *before* we reach the length.

```javascript
for (let i = 0; i < arr.length; i++) {
  // Code to execute for each element
}
```

**Why use `i < arr.length` instead of `i <= arr.length`?**
If an array has a length of 4, the valid indices are `0, 1, 2, and 3`. If your loop attempts to access index `4`, the program will look for an element that doesn't exist, which can lead to errors. By using the "less than" operator (`<`), we ensure the loop stops exactly after the last valid index.

### Visualizing the Loop [07:19]
By combining the loop index with the `text()` function, we can automatically list every item in an array down the screen:

```javascript
function draw() {
  background(20);
  fill(200, 0, 0);
  textSize(100);

  for (let i = 0; i < arr.length; i++) {
    // We use the loop index 'i' to grab each element in order
    text(arr[i], 50, i * 100); 
  }
}
```

In this setup, the loop variable `i` acts as a dynamic index that increments with every pass, allowing us to access and display each element in the collection sequentially.

# Iterating Through Arrays in p5.js

Arrays are fundamental data structures used to store an ordered list of elements. In JavaScript, while objects use curly braces `{}` to map keys to values, arrays use square brackets `[]` to store a sequence of values.

## Understanding Zero-Based Indexing [07:28]

A critical concept in programming is that arrays are **zero-indexed**. This means the first element in an array is located at index `0`, not index `1`.

When accessing elements manually, you use the square bracket notation with the desired index:
```javascript
let arr = ["zeroth", 100, "banana", "yoghurt"];

// Accessing the first element
console.log(arr[0]); // Outputs: "zeroth"

// Accessing the fourth element
console.log(arr[3]); // Outputs: "yoghurt"
```

## Iterating with a Standard `for` Loop [07:46]

To perform an action on every item in a list—such as rendering text on a canvas—we use a `for` loop. To prevent elements from overlapping, we can use the loop variable (the index) to offset the vertical position of each item.

### The Logic of Vertical Spacing
When drawing text in a loop, if you use the same `y` coordinate for every iteration, all elements will be drawn on top of each other. By multiplying the index by a constant value (like `100`), we create vertical spacing:

```javascript
let arr = ["zeroth", 100, "banana", "yoghurt"];

function setup() {
  createCanvas(400, 400);
  textSize(100);
}

function draw() {
  background(20);
  fill(200, 0, 0);

  // Standard for loop
  for (let i = 0; i < arr.length; i++) {
    // We use 'i' to access the element and to offset the Y position
    text(arr[i], 50, 70 + i * 100);
  }
}
```

**Visual Result:** The canvas displays the array elements stacked vertically. "zeroth" appears at the top, followed by "100", "banana", and "yoghurt" in a column.

### Debugging the Loop
When setting up your loop, be careful with your starting values. If you attempt to start the index at a non-zero value (like `let i = 50`), you will skip the first elements of your array because the loop starts looking for index `50` immediately. Always start at `0` to ensure you capture the entire list.

## The Concise `for...in` Loop [09:14]

JavaScript provides a shorthand for iterating over arrays called the `for...in` loop. This is often more concise when you want to traverse a collection.

### Syntax and Implementation
In a `for...in` loop, you declare a variable that represents the **index** (the key) of the current element during each iteration.

```javascript
let arr = ["zeroth", 100, "banana", "yoghurt"];

function draw() {
  background(28);
  fill(200, 0, 0);

  // Standard for loop (Manual control of index)
  for(let i = 0; i < arr.length; i++) {
    text(arr[i], 50, 70 + i * 100);
  }

  fill(255); // Change color to white for the next loop

  // for...in loop (Concise syntax)
  for (let el in arr) {
    // 'el' represents the index/key of the current element
    text(arr[el], 55, 70 + el * 100);
  }
}
```

**Key Distinction:**
*   In a **standard `for` loop**, you manually manage the index variable (`i`), increment it, and check it against `arr.length`.
*   In a **`for...in` loop**, the syntax handles the progression for you. However, it is important to remember that `el` (the loop variable) is still the **index**, so you must still use `arr[el]` to access the actual value stored at that position.

By using these two methods, you can create visual "shadow" effects (by drawing the same text twice with a slight offset) or simply manage complex lists of data efficiently.
