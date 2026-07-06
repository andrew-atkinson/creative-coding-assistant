---
video_id: 5-arrays-of-objects
video_title: 5 arrays of objects
video_file: 5 arrays of objects.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%207%2F5%20arrays%20of%20objects.mp4"
week: week 7
module: Module 3 - Generation and Life
topic: "Using arrays to programmatically manage and animate multiple objects, and implementing visual depth using parallax principles."
concepts:
  - arrays of objects
  - for...in loop for arrays
  - parallax scrolling
  - mapping speed to scale
prerequisites:
  - Object literals (key-value pairs)
  - Basic arrays and the .push() method
  - Standard for loops
  - p5.js basic functions (translate, scale, push/pop)
leads_to:
  - Sorting arrays
  - Object-Oriented Programming (Classes)
---
# Scaling Generative Systems with Arrays and Objects

In creative coding, manually defining every entity in a scene is inefficient and limits scalability. To create complex environments—like a massive UFO invasion—we must transition from hard-coded individual variables to programmatic generation using **Arrays** and **Object Literals**.

## The Problem with Manual Scaling [00:00]

Initially, we might define objects manually to keep things simple:

```javascript
let ufo1 = { x: 0, y: 100, s: 3 };
let ufo2 = { x: -40, y: 200, s: 2 };
let ufo3 = { x: -60, y: 250, s: 4 };
```

While this works for three objects, it becomes a "tedious approach" if we want to increase the complexity of our scene. To make an invasion truly "terrifying," we need dozens or hundreds of entities. Manually writing `ufo4`, `ufo5`... up to `ufo100`, and then writing corresponding lines in the `draw()` loop for each one, is not a sustainable workflow.

## Programmatic Generation with Arrays [00:48]

Instead of manual creation, we can use an **Array** to act as a container for our objects. An array is a list that can grow or shrink dynamically.

### Initializing an Empty Array
We start by declaring an empty array:
```javascript
let ufoArr = [];
```
At this stage, the array exists but has a `length` of 0. Because it is empty, we cannot use a `for...in` loop (which iterates over existing properties); instead, we must use a standard `for` loop to populate it.

### Populating the Array
We can use a `for` loop within the `setup()` function to generate a specific number of objects and "push" them into our array. Each object is given randomized properties to ensure variety in the scene.

```javascript
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);

  for (let i = 0; i < 20; i++) {
    // Generate randomized values for each new object
    let xVal = random(-100, 50);
    let yVal = random(0, 300);
    let sVal = random(1, 8);

    // Create the object literal
    let obj = { x: xVal, y: yVal, s: sVal };

    // Add the object to our array
    ufoArr.push(obj);
  }
}
```

**Key Insight: Keys vs. Values**
When defining the object `{x: xVal, y: yVal, s: sVal}`, the left side of the colon is the **key** (the property name, like `x`), and the right side is the **value** (the data assigned to that property). It is vital to keep descriptive key names because we will use them later via "dot notation" (e.g., `obj.x`) to access the data.

## Iterating and Rendering [04:30]

Once the array is populated, we no longer need to call `ufo(ufo1)`, `ufo(ufo2)`, etc. Instead, we loop through the array in the `draw()` function. This allows us to scale from 20 objects to 1,000 objects simply by changing one number in the `setup()` loop.

### Using a Standard Loop
```javascript
function draw() {
  background(0, 0, 35);

  for (let i = 0; i < ufoArr.length; i++) {
    ufo(ufoArr[i]); // Pass the current object in the array to the ufo function
  }
}
```

### Using `forEach`
Alternatively, you can use the `.forEach()` method for a cleaner syntax:

```javascript
function draw() {
  background(0, 0, 35);

  ufoArr.forEach(function(element) {
    ellipse(element.x, element.y, element.s * 10);
  });
}
```

## Debugging and Inspection [05:04]

When working with complex data structures, it is helpful to use `console.log()` to inspect what is actually happening inside your arrays. 

By logging the array:
```javascript
console.log(ufoArr);
```
The browser console will reveal a list of objects (e.g., `Object {x: ..., y: ..., s: ...}`). This confirms that our loop successfully created the expected number of unique entities, each with its own distinct properties. This visual confirmation is essential for ensuring that the "randomness" we requested is actually being applied correctly.

# Scaling Generative Systems with Arrays and Objects

This lesson demonstrates how to transition from managing individual, hard-coded objects to using arrays for programmatic generation. By combining object literals with loops and arrays, you can scale a scene from three objects to hundreds of unique entities with minimal code changes.

## From Manual Objects to Programmatic Arrays [06:00]

Initially, we might define objects manually to establish a concept. For example, creating three distinct UFO objects:

```javascript
let ufo1 = { x: 0, y: 100, s: 3 };
let ufo2 = { x: -40, y: 200, s: 2 };
let ufo3 = { x: -60, y: 250, s: 4 };
```

While this works for a small number of items, it becomes unmanageable as the scene grows. To create a "UFO invasion," we need to use an **Array** to store these objects and a `for` loop to populate them dynamically.

### Populating an Array in `setup()`
In the `setup()` function, we initialize an empty array and use a loop to inject randomized objects into it.

```javascript
let ufoArr = [];

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);

  for (let i = 0; i < 20; i++) {
    let x = random(-100, 50);
    let y = random(0, 300);
    let s = random(1, 8);
    
    // Create a new object literal with randomized properties
    let obj = { x: x, y: y, s: s };
    
    // Add the object to our array
    ufoArr.push(obj);
  }
  console.log(ufoArr); // Check the console to see the array of objects
}
```

## Iterating Through Data [06:13]

Once the objects are stored in an array, we no longer need to call functions for `ufo1`, `ufo2`, etc., individually. Instead, we iterate through the array using a loop in the `draw()` function.

### Using the `for...in` Loop
The `for...in` loop is useful for iterating over the properties of an object or the indices of an array. When used on an array, it provides the index (the position) of each element.

```javascript
function draw() {
  background(0, 0, 35);

  for (let el in ufoArr) {
    // Access the specific object at the current index 'el'
    ufo(ufoArr[el]); 
    moveUfo(ufoArr[el]);
  }
}
```

**Technical Insight:** When we use `ufoArr[el]`, the function receives the actual object (containing `x`, `y`, and `s`) rather than just a number. This allows the `ufo()` function to access properties via dot notation (e.g., `obj.x`).

## Implementing Parallax Scrolling [08:56]

To make a generative scene feel three-dimensional, we can implement **Parallax Scrolling**. This is a technique used in 2D games where different layers of the background move at different speeds to create an illusion of depth.

### Mapping Speed to Scale
In a 2D environment, objects that are "closer" to the viewer should appear larger and move faster across the screen. We can use an object's `s` (speed) property as a proxy for its proximity.

1. **High Speed/Large Scale:** Represents objects in the foreground (close to the viewer).
2. **Low Speed/Small Scale:** Represents objects in the background (far from the viewer).

By dividing the speed value, we can map it to the `scale()` function:

```javascript
function ufo(obj) {
  push();
  noStroke();
  translate(obj.x, obj.y);

  // Use the speed property to determine scale
  // Dividing by 10 prevents the objects from becoming too massive
  scale(obj.s / 10);

  // Draw the UFO shape...
  fill(128, 120, 150);
  arc(0, 0, 100, 30, 180, 0);
  // ... (rest of drawing code)
  pop();
}

function moveUfo(obj) {
  // Move the object horizontally based on its speed
  obj.x = obj.x + obj.s;

  // Reset position if it moves off-screen to create a loop
  if (obj.x > width + 100) {
    obj.x = -50;
  }
}
```

### Visual Result
When this logic is applied, the canvas displays a variety of UFOs. The smaller ones move slowly across the screen (background), while the larger ones zip by quickly (foreground). This creates a sense of spatial depth and movement within a 2D plane.

## The Depth Problem in Generative Systems [11:30]

As we scale our generative systems from a few hard-coded objects to large arrays of programmatic entities, we encounter a new challenge: **visual hierarchy**.

In the current implementation, objects are drawn in the order they appear in the array. This creates a visual conflict when trying to simulate depth via scale and speed.

### The Illusion of Depth
To create a sense of 3D space in a 2D environment, we use **Parallax Scrolling** principles. We link an object's speed (`obj.s`) to its scale:

```javascript
function drawUfo(obj) {
  push();
  translate(obj.x, obj.y);
  scale(obj.s / 10); // Smaller speed results in a smaller scale
  // ... drawing logic ...
  pop();
}
```

In this model, we make a fundamental assumption: **smaller objects are further away (in the background), and larger objects are closer (in the foreground).**

### The Rendering Conflict
When we iterate through an array to draw these objects, the computer draws them one by one. If a small object (background) appears later in the array than a large object (foreground), the small object will be drawn *on top* of the large one.

The canvas shows a field of purple circles where smaller circles are overlaid on larger ones, breaking the illusion. This makes the scene look "broken" because the depth cues are contradictory; the smaller objects should be behind the larger ones to maintain a coherent sense of space.

```javascript
// Current rendering logic (problematic for depth)
for (let i in ufoArr) {
  drawUfo(ufoArr[i]);
}
```

### The Solution: Sorting Arrays [12:16]
To fix this, we cannot rely on the random order in which objects are added to an array. We must ensure that objects are drawn in a specific sequence based on their properties.

To maintain the illusion of depth, we need to **sort the array** so that:
1. Objects with the **smallest speed/scale** are drawn **first** (the background).
2. Objects with the **largest speed/scale** are drawn **last** (the foreground).

By sorting the array by the `s` property before we begin the drawing loop, we ensure that larger objects always overlap smaller ones correctly. This concept of Z-indexing (ordering by depth) is the focus of our next lesson on sorting arrays.
