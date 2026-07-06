---
video_id: 1-classes
video_title: 1 classes
video_file: 1 classes.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 8/1 classes.mp4"
week: week 8
module: Module 3 - Generation and Life
topic: "Transitioning from procedural programming to Object-Oriented Programming (OOP) using classes, constructors, and encapsulation in JavaScript/p5.js."
concepts:
  - Class
  - Instance
  - Constructor
  - the 'this' keyword
  - Encapsulation
  - for...of loop
prerequisites:
  - Basic JavaScript syntax
  - p5.js library basics
  - Arrays and for loops
  - Objects (key-value pairs)
  - Coordinate systems (x, y)
leads_to:
  - Inheritance
  - Complexity Management in large simulations
  - Advanced Object-Oriented Programming
---
# Transitioning to Object-Oriented Programming (OOP)

## The Limitations of Procedural Programming [00:00]

Before moving into Object-Oriented Programming, it is helpful to look at the "procedural" way of managing multiple objects. In a standard script, you might manage data and behavior as separate entities. 

In the current codebase, we have an array of objects where each object is a simple collection of properties (key-value pairs) representing position and scale:

```javascript
let ufo1 = { x: 0, y: 100, s: 3 }; // an object with properties
let ufo2 = { x: -40, y: 200, s: 2 };
let ufo3 = { x: -60, y: 250, s: 4 };
let ufoArr = [];
```

To manage these, we use a `setup()` function to populate an array with randomized objects and a `draw()` loop to iterate through them. However, the logic for how these objects look and move is kept in separate, global functions:

```javascript
function draw() {
  background(0, 0, 35);
  for (let el in ufoArr) {
    ufo(ufoArr[el]);      // Function that draws the ufo
    moveUfo(ufoArr[el]);  // Function that updates position
  }
}

function ufo(obj) {
  push();
  translate(obj.x, obj.y);
  scale(obj.s / 10);
  // ... drawing logic for the ufo shape ...
  pop();
}

function moveUfo(obj) {
  obj.x = obj.x + obj.s;
  if (obj.x > width + 100) {
    obj.x = -50;
  }
}
```

### The Problem: "Piecemeal" Code
While this works, the code is "piecemeal." The data (the object properties) is in one place, the drawing logic is in another function, and the movement logic is in a third. As your project grows more complex—adding hundreds of objects with different behaviors—this separation becomes difficult to manage. Everything is operating in a scattered, disconnected way.

## The Concept of Classes [02:03]

To solve this, we embrace **Object-Oriented Programming (OOP)**. In OOP, we put the object at the center of our code by **encapsulating** both its data and its behaviors into a single unit called a **Class**.

Think of a Class as a **blueprint**. A blueprint is not the actual house; it is an abstract description or template of what a house should look like and how it should function. When you use that blueprint to build an actual, physical house, that house is called an **Instance**.

In programming:
*   **Class**: The template (e.g., `class UFO`). It defines what a UFO *is* and what it *does*.
*   **Instance**: The actual object created from the template (e.g., `new UFO()`). This is what you actually interact with in your code.

## Implementing the Class Structure [03:09]

To refactor our code, we replace the loose object definitions and separate functions with a `class` definition.

### The Constructor and the `this` Keyword [03:47]

Inside a class, we use a special function called the `constructor`. This function runs exactly once: at the moment an object is created. It takes in parameters (like `x`, `y`, and `s`) and assigns them to the specific object being created.

To do this, we use the `this` keyword. In English, "this" refers to something you are pointing at. In JavaScript, `this` refers to the specific instance of the object currently being handled. It allows us to say: "Take this incoming value and assign it to *this* specific object's property."

```javascript
class UFO {
  constructor(x, y, s) {
    this.x = x; // "This" object's x property becomes the value of the parameter x
    this.y = y; // "This" object's y property becomes the value of the parameter y
    this.s = s; // "This" object's s property becomes the value of the parameter s
  }
}
```

By using `this.x = x`, we are no longer just passing data around; we are defining the internal state of a unique entity. This is the foundation of encapsulation: the object now "owns" its own data.

# Transitioning to Object-Oriented Programming (OOP)

This lesson demonstrates the transition from procedural programming—where data and functions are separate entities—to Object-Oriented Programming (OOP), where data and behavior are bundled together into a single, organized structure.

## The Limitations of Procedural Programming [05:00]

In a procedural approach, you manage objects as simple collections of properties (key-value pairs) and use separate functions to manipulate them.

The initial code uses a standard object literal:
```javascript
let ufo0 = { x: 0, y: 100, s: 3 }; // an object with properties
```

To manage many such objects, you might use an array and a `for...in` loop to iterate through them:
```javascript
function draw() {
  background(0, 0, 35);
  for (let el in ufoArr) {
    // Procedural approach: passing the object into a separate function
    moveUfo(ufoArr[el]); 
  }
}

function moveUfo(obj) {
  obj.x = obj.x + width / 100;
}
```

While this works, as your project grows, you end up with "piecemeal" code: a collection of data in one place and a collection of functions scattered elsewhere. This becomes difficult to manage as complexity increases.

## Defining a Class: The Blueprint [05:07]

A **Class** is not the object itself; it is a **blueprint**. Just as a house blueprint provides instructions for building a house, a class provides the template for creating objects.

To create this blueprint, we use a `class` definition and a special function called a `constructor`.

### The Constructor and the `this` Keyword [05:22]
The `constructor` is a function that runs automatically the moment you create a new instance of a class. It is used to set the initial state (the properties) of that specific object.

To assign incoming parameters to the new object, we use the `this` keyword. Think of `this` as a way to point at "the object currently being created," even before it has a name.

```javascript
class UFO {
  constructor(x, y, s) {
    this.x = x; // "Take the incoming 'x' and assign it to THIS object's x property"
    this.y = y; 
    this.s = s; 
  }
}
```

> **Debugging Insight: The Importance of `this`**
> When refactoring, a common error is forgetting to use `this` or using the wrong variable name. If you write `this.y = year;` instead of `this.y = y;`, the code will fail because it is looking for a variable named `year` that doesn't exist. Inside the class, you must use `this` to refer to the object's own properties.

## Encapsulation: Bundling Data and Behavior [06:06]

**Encapsulation** is the practice of grouping an object's data (properties like `x`, `y`, and `s`) together with the actions it can perform (methods).

Instead of having a global function like `moveUfo(obj)`, we move that logic *inside* the class. Note that when defining a function (method) inside a class, you **do not** use the `function` keyword.

```javascript
class UFO {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
  }

  // A method to draw the UFO
  display() {
    push();
    noStroke();
    translate(this.x, this.y); // Uses 'this' to access its own properties
    scale(this.s / 10);
    // ... drawing logic (arcs, circles, etc.) ...
    pop();
  }

  // A method to handle movement logic
  move() {
    this.x = this.x + this.s;
    if (this.x > width + 100) {
      this.x = -50;
    }
  }
}
```

By moving `display()` and `move()` into the class, the object now "knows" how to draw and move itself. This makes your main `draw()` loop much cleaner:

```javascript
function draw() {
  background(0, 0, 35);
  for (let el in ufoArr) {
    ufoArr[el].display(); // The object handles its own drawing
    ufoArr[el].move();   // The object handles its own movement
  }
}
```

## Creating Instances with `new` [09:00]

Once you have your class (the blueprint), you use the `new` keyword to create actual objects (**instances**) from that blueprint.

In your `setup()` function, instead of manually creating an object literal and pushing it to the array, you instantiate the class:

```javascript
function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 80; i++) {
    let x = random(-100, 50);
    let y = random(0, 300);
    let s = random(1, 8);
    
    // 'new UFO' creates a unique instance based on the blueprint, 
    // passing x, y, and s into the constructor.
    ufoArr.push(new UFO(x, y, s)); 
  }
}
```

### Summary of the Shift
| Feature | Procedural Approach | Object-Oriented Approach (OOP) |
| :--- | :--- | :--- |
| **Organization** | Data and functions are separate. | Data and behavior are encapsulated in a class. |
| **Creation** | Manual object literals `{x: 0, ...}`. | Using `new ClassName()`. |
| **Complexity** | Harder to manage as object count grows. | Highly scalable and organized. |
| **Syntax** | `moveUfo(myObj)` | `myObj.move()` |

# Transitioning to Object-Oriented Programming (OOP)

After learning how to manage individual objects using separate functions and arrays, this lesson demonstrates how to use **Classes** to organize your code. The goal is to move away from "piecemeal" programming—where data and functions are scattered across your script—and toward a structured system where every object carries its own properties and behaviors.

## From Procedural to Encapsulated [10:31]

In a procedural approach, you might have an array of data (like positions and scales) and separate functions to manipulate that data. For example, you might have a `moveUfo(obj)` function and a separate drawing function.

By using a Class, we achieve **encapsulation**. This means the data (the UFO's position and size) and the behavior (how it draws itself and how it moves) are bundled together into a single unit.

### The "Messy" Baseline
Before refactoring, the code relies on global functions and manual array indexing. This becomes difficult to manage as complexity increases:

```javascript
// Procedural approach (The "Messy" way)
function moveUfo(obj) {
  obj.x = obj.x + obj.s;
  if (obj.x > width + 100) {
    obj.x = -50;
  }
}

function draw() {
  background(0, 0, 35);
  for (let i = 0; i < ufoArr.length; i++) {
    ufo(ufoArr[i]); // Drawing function
    moveUfo(ufoArr[i]); // Movement function
  }
}
```

## Implementing the UFO Class [10:48]

To refactor this, we define a `class`. A class acts as a blueprint. We use the `constructor` to initialize the object's properties and then define **methods** (functions that belong to the class) to handle its logic.

### The Blueprint
The following code demonstrates how to encapsulate both the data and the drawing logic within the `UFO` class.

```javascript
let ufoArr = [];

class UFO {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
  }

  display() {
    push();
    noStroke();
    // Use 'this' to access the specific properties of this instance
    translate(this.x, this.y); 
    scale(this.s / 10);
    
    // Draw top half
    fill(120, 100, 30, 180);
    arc(0, 0, 50, 50, 180, 0);
    arc(0, 0, 50, 50, 180, 0);
    
    // Draw bottom half
    fill(30, 30, 80);
    arc(0, 0, 100, 30, 0, 180);
    arc(0, 0, 50, 50, 0, 180);
    
    // Draw lights on the side
    fill(220, 150, 0);
    for (let x = -50; x <= 50; x += 10) {
      circle(x, 0, 5);
    }
    pop();
  }

  move() {
    this.x = this.x + this.s;
    if (this.x > width + 100) {
      this.x = -50;
    }
  }
}
```

### Debugging the `this` Keyword [12:00]
When moving logic into a class, you must use the `this` keyword to refer to the properties of the specific object being processed. A common error occurs when a property name is mistyped within the class, causing the function to receive `undefined` instead of a number.

**The Error:**
If you accidentally write `this.year` instead of `this.y`, the console will report:
`translate() was expecting Number for the second parameter, received undefined instead.`

**The Fix:**
Ensure that every property assigned in the `constructor` matches the property name used inside your methods.

## Simplifying the Main Loop [11:04]

Once the class is defined, setting up and updating your objects becomes significantly cleaner. Instead of managing complex loops with manual indexing, you can use a `for...of` loop to iterate through your array of instances.

### Setup and Animation
In `setup()`, we instantiate many unique objects using the `new` keyword. In `draw()`, we simply tell each object to perform its own tasks.

```javascript
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  for (let i = 0; i < 80; i++) {
    let x = random(-100, 50);
    let y = random(0, 300);
    let s = random(1, 8);
    // Create a new instance of the UFO blueprint
    ufoArr.push(new UFO(x, y, s));
  }
  // Sort by scale to handle layering/depth
  ufoArr.sort((a, b) => a.s - b.s);
}

function draw() {
  background(0, 0, 35);
  for (let ufo of ufoArr) {
    ufo.display(); // The object draws itself
    ufo.move();   // The object moves itself
  }
}
```

**Key Insight:** Notice how the `draw()` function is now extremely readable. We no longer care *how* a UFO draws itself or moves; we simply tell the object to `display()` and `move()`. This abstraction is the core power of Object-Oriented Programming.
