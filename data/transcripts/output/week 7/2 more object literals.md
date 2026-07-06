---
video_id: 2-more-object-literals
video_title: 2 more object literals
video_file: 2 more object literals.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%207%2F2%20more%20object%20literals.mp4"
week: week 7
module: Module 3 - Generation and Life
topic: Transitioning from individual variables to object literals and functional abstraction for managing multiple entities.
concepts:
  - object literals
  - dot notation
  - functional abstraction (passing objects as parameters)
  - encapsulation of properties
prerequisites:
  - basic javascript variables
  - p5.js draw loop
  - basic function syntax
leads_to:
  - Arrays of objects
  - Classes and Constructors (OOP)
---
# Transitioning to Object-Oriented Programming with JavaScript

This resource explores the transition from managing individual primitive variables to using **Object Literals**. By grouping related data into single entities, we can create more scalable and "tidy" code, moving from procedural logic toward Object-Oriented Programming (OOP).

## The Problem with Individual Variables [00:00]

When managing multiple entities (like moving shapes on a canvas), the initial approach is often to create separate variables for every property. For example, if you have three UFOs, you might start with:

```javascript
let x2 = -40, y2 = 200;
let x3 = -60, y3 = 250;
```

While this works for a few items, it creates a "bloated" code structure. As you add more entities, the number of variables grows linearly, making the `draw()` loop increasingly difficult to manage.

## Implementing Object Literals [00:06]

Instead of managing disconnected variables, we can use **Object Literals**. An object allows us to group related properties—like `x` and `y` coordinates—into a single container using curly braces `{}`.

In an object, we use **key-value pairs**. The "key" is the name of the property (e.g., `x`), and the value is assigned using a colon `:`.

```javascript
let ufo1 = { x: 0, y: 100 }; // An object with two properties
let ufo2 = { x: -40, y: 200 };
let ufo3 = { x: -60, y: 250 };
```

### Key Advantages of Objects:
1.  **Encapsulation:** Related data is kept together in one place.
2.  **Structural Similarity:** Even though `ufo1` and `ufo2` are different variables, they share the same internal structure (both have an `x` and a `y`). This similarity is what allows us to write reusable functions.
3.  **Dot Notation:** To access or change a specific property within an object, we use the dot notation: `object.property`.

```javascript
// Accessing properties to draw
ufo(ufo1.x, ufo1.y);

// Updating properties to move the object
ufo1.x = ufo1.x + 3;
```

## Scaling with Custom Properties [03:27]

Once we have organized our data into objects, we can add new properties to give each object unique behaviors. A common use case is adding a `speed` property (represented as `s`) to control how fast each individual object moves.

```javascript
let uf01 = { x: 0, y: 100, s: 3.3 };
let uf02 = { x: -740, y: 200, s: 2 };
let uf03 = { x: -60, y: 250, s: 4 };
```

By adding `s`, we no longer have to hard-code movement values in the main loop. Instead, we can use the object's own property to determine its movement:

```javascript
function draw() {
  background(0, 0, 35);
  ufo(uf01.x, uf01.y);
  ufo(uf02.x, uf02.y);
  ufo(uf03.x, uf03.y);

  // Each object moves according to its own unique speed property
  uf01.x = uf01.x + uf01.s;
  uf02.x = uf02.x + uf02.s;
  uf03.x = uf03.x + uf03.s;
}
```

## Handling Screen Boundaries [04:51]

When objects move based on a speed property, they will eventually leave the canvas. To create a "wrap-around" effect (where an object disappears off one side and reappears on the other), we can use conditional logic to check the object's position against the canvas dimensions.

```javascript
// If the UFO moves past the right edge of the screen...
if (uf01.x > width) {
  // Reset it to the left edge so it "reappears"
  uf01.x = 0; 
}
```

*Note: In the demonstration, adjusting the reset value (e.g., setting `x` to `-50` instead of `0`) ensures the object smoothly enters the screen rather than popping in instantly at the edge.*

# Transitioning to Object-Oriented Programming with JavaScript

Managing multiple moving entities in a digital canvas can quickly become overwhelming. As you add more objects, the number of individual variables required to track their properties grows exponentially, leading to "bloated" and inefficient code. This lesson demonstrates how to refactor procedural code into an object-oriented approach using **Object Literals**, allowing for scalable and organized animations.

## The Problem: Manual Variable Management [05:30]

When managing a few entities, it is easy to simply create separate variables for every property. For example, if you have three UFOs, you might manually track their $x$ and $y$ coordinates and their individual speeds:

```javascript
let ufo1 = { x: 0, y: 100, s: 3 }; // An object with key-value pairs
let ufo2 = { x: -40, y: 200, s: 2 };
let ufo3 = { x: -60, y: 250, s: 4 };

function draw() {
  background(0, 0, 35);
  ufo(ufo1.x, ufo1.y);
  ufo(ufo2.x, ufo2.y);
  ufo(ufo3.x, ufo3.y);

  // Manual movement and boundary logic
  if (ufo1.x > width) {
    ufo1.x = -56;
  }

  ufo2.x = ufo2.x + ufo2.s;
  ufo3.x = ufo3.x + ufo3.s;
}
```

While this works for three objects, it becomes unmanageable if your ambition is to have 100 UFOs on the screen. The code becomes repetitive, and you are adding more lines of code rather than making it more efficient.

## Refactoring with Abstraction [05:40]

To solve this, we can use **abstraction**. Instead of writing specific logic for every single object, we create a general function that can handle *any* object passed to it.

### Step 1: Grouping Data into Objects
By using **Object Literals**, we group related properties (like position and speed) into a single entity. This encapsulates the data, making it easier to pass around.

### Step 2: Passing Objects as Parameters [06:03]
The most significant shift in thinking occurs when we stop passing individual values (like `x` and `y`) to a function and instead pass the **entire object**. 

When we pass an object, the function gains access to everything inside that object. This allows us to write a single `moveUfo` function that can govern an infinite number of unique objects, each with its own position and speed.

```javascript
// Instead of: moveUfo(ufo1.x, ufo1.y, ufo1.s)
// We use:
moveUfo(ufo1); 
```

### Step 3: Implementing the Logic [07:46]
Inside the function, we use **dot notation** to access and modify the properties of the passed object.

```javascript
function moveUfo(obj) {
  // Update position using the object's internal speed property
  obj.x = obj.x + obj.s;

  // Boundary logic: Reset position if it goes off-screen to create a loop
  if (obj.x > width) {
    obj.x = -50;
  }
}
```

## The Scalable Solution [10:00]

By separating the **rendering** (drawing) from the **behavior** (moving), we create a highly efficient system. We now have two distinct, reusable functions: one to draw the UFO and one to update its position.

The final, clean structure looks like this:

```javascript
let ufo1 = { x: 0, y: 100, s: 3 };
let ufo2 = { x: -40, y: 200, s: 3 };
let ufo3 = { x: -60, y: 250, s: 4 };

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0, 0, 35);

  // 1. Draw the objects
  ufo(ufo1);
  ufo(ufo2);
  ufo(ufo3);

  // 2. Update the objects' positions
  moveUfo(ufo1);
  moveUfo(ufo2);
  moveUfo(ufo3);
}

// Function to handle the visual representation
function ufo(obj) {
  push();
  noStroke();
  translate(obj.x, obj.y); // Use the object's properties for position
  
  // Draw top half
  fill(128, 120, 150);
  arc(0, 0, 100, 30, 180, 0);
  arc(0, 0, 50, 50, 180, 360);
  
  // Draw bottom half
  fill(38, 30, 80);
  arc(0, 0, 100, 30, 0, 180);
  arc(0, 0, 50, 50, 0, 180);
  pop();
}

// Function to handle the movement logic
function moveUfo(obj) {
  obj.x = obj.x + obj.s;

  if (obj.x > width) {
    obj.x = -50;
  }
}
```

### Key Takeaways
* **Encapsulation:** Grouping properties (x, y, speed) into an object keeps related data together.
* **Dot Notation:** Using `obj.property` allows you to access and change the internal state of an object from within a function.
* **Scalability:** By passing objects as parameters, you can manage hundreds of unique entities with just a few lines of code. Each object maintains its own "life" and state, but the logic governing them remains centralized and tidy.
