---
video_id: 6-sorting-arrays
video_title: 6 sorting arrays
video_file: 6 sorting arrays.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%207%2F6%20sorting%20arrays.mp4"
week: week 7
module: Module 3 - Generation and Life
topic: Using the JavaScript .sort() method with a comparator function to organize arrays of objects for visual depth and perspective in generative art.
concepts:
  - visual incoherence (depth issue)
  - array.sort() with a callback
  - comparator function
prerequisites:
  - Object literals
  - Arrays and .push()
  - For loops
  - Basic p5.js drawing functions
leads_to:
  - Object-Oriented Programming (Classes)
  - Advanced sorting algorithms
  - Spatial partitioning
---
# Solving Visual Incoherence with Array Sorting

In generative art, the order in which objects are drawn determines their visual depth. When drawing multiple entities, a common problem arises where smaller "distant" objects are drawn on top of larger "foreground" objects, breaking the illusion of perspective. This guide demonstrates how to use JavaScript's `.sort()` method to organize an array of objects to achieve visual coherence.

## Identifying the Visual Problem [00:00]

When managing multiple objects in a generative system, we often use an array of object literals to store properties like position (`x`, `y`) and scale (`s`). 

```javascript
let ufoArr = [];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 80; i++) {
    let x = random(-100, 50);
    let y = random(0, 300);
    let s = random(1, 8);
    // Encapsulating properties into an object literal
    let obj = { x: x, y: y, s: s };
    ufoArr.push(obj);
  }
}
```

The issue occurs during the `draw()` loop. If objects are drawn in the order they were created (which is random), a small object might be drawn after a large object, appearing to "float" in front of it. This creates visual incoherence because the viewer's brain expects smaller objects to be further away and thus obscured by larger, closer objects.

## Implementing Depth via Sorting [01:30]

To fix this, we need to ensure that objects are drawn from smallest to largest. By sorting the array based on the scale property (`s`), we ensure that larger objects are drawn last, effectively overdrawing the smaller ones and creating a sense of depth.

To do this, we use the `.sort()` method with a **comparator function**. This syntax is unique and can be intimidating, but it essentially allows you to define the logic for how two elements should be compared.

### The Comparator Logic
The `.sort()` method takes a function that compares two elements at a time—let's call them `a` and `b`. By returning the result of a subtraction, we tell JavaScript how to reorder them.

```javascript
ufoArr.sort((a, b) => a.s - b.s);
```

**How it works:**
*   The function looks at two adjacent objects in the array: `a` (the current element) and `b` (the next element).
*   It compares their scale values: `a.s - b.s`.
*   If the result is negative, `a` is smaller and stays before `b`.
*   If the result is positive, `a` is larger and moves after `b`.

By applying this in the `setup()` function, we organize the entire array once before the animation begins.

## Final Implementation [03:00]

The following code demonstrates a complete, coherent system where objects are sorted by size to maintain proper occlusion.

```javascript
let ufoArr = [];

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);

  // Populate the array with random objects
  for (let i = 0; i < 100; i++) {
    let x = random(-100, 50);
    let y = random(0, 300);
    let s = random(1, 8);
    let obj = { x: x, y: y, s: s };
    ufoArr.push(obj);
  }

  // Sort the array: smallest scale to largest scale
  // This ensures smaller objects are drawn first (in the background)
  ufoArr.sort((a, b) => a.s - b.s);
  
  console.log(ufoArr);
}

function draw() {
  background(0);
  fill(255);
  noStroke();

  // Iterate through the sorted array
  for (let i = 0; i < ufoArr.length; i++) {
    let obj = ufoArr[i];
    // Drawing the object based on its properties
    ellipse(obj.x, obj.y, obj.s * 2);
  }
}
```

### Visual Result
When this code runs, the canvas displays ellipses of varying sizes. Because of the `.sort()` method, you will notice that the smaller ellipses are drawn first and are subsequently covered by the larger ones. This creates a mathematically consistent sense of perspective, where size correlates directly with visual depth.
