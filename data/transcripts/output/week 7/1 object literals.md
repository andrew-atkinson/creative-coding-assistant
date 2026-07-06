---
video_id: 1-object-literals
video_title: 1 object literals
video_file: 1 object literals.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%207%2F1%20object%20literals.mp4"
week: week 7
module: Module 3 - Generation and Life
topic: Introduction to Object Literals and data encapsulation for managing multiple entities
concepts:
  - function abstraction
  - object literal
  - key-value pairs
  - dot notation
prerequisites:
  - Basic JavaScript variables (let, const)
  - Function definitions and parameters
  - p5.js coordinate system (translate/push/pop)
leads_to:
  - Arrays of objects
  - Object-Oriented Programming (OOP)
  - Classes and Constructors
---
# Transitioning from Variables to Object Literals

This lesson explores the transition from procedural programming—managing individual variables for every piece of data—to Object-Oriented Programming (OOP) concepts by using **Object Literals**. We will see how grouping related data into a single entity makes managing complex systems more scalable and organized.

## The Problem: Variable Proliferation [01:19]

When starting with simple animations, managing data is straightforward. We can define individual variables for the position of a single object and pass them into a function:

```javascript
let x = 0, y = 100;

function draw() {
  background(0, 0, 35);
  ufo(x, y); // Passing individual x and y values
  x = x + 3;
}

function ufo(x, y) {
  push();
  noStroke();
  translate(x, y);
  // ... drawing code for the UFO ...
  pop();
}
```

The canvas shows a single "UFO" shape (constructed from arcs and circles) moving horizontally across the screen.

However, as the complexity of a scene increases—for example, if we want multiple UFOs moving at different speeds or starting at different positions—we encounter a logistical bottleneck. To add more objects, we must manually declare new variables for every single property:

```javascript
let x = 0, y = 100;
let x2 = -40, y2 = 200; // Second UFO
let x3 = -60, y3 = 250; // Third UFO

function draw() {
  background(0, 0, 35);
  ufo(x, y);
  ufo(x2, y2);
  ufo(x3, y3);
  
  x = x + 3;
  x2 = x2 + 2;
  x3 = x3 + 4;
}
```

As we add more entities, the number of variables grows exponentially. This becomes **untenable** because we have to track, update, and pass a massive list of independent variables. This "variable clutter" makes the code difficult to read and prone to errors.

## Introducing Object Literals [03:01]

To solve this, we can use an **Object Literal**. An object allows us to bundle related data together under a single name. Instead of having `x`, `y`, `x2`, and `y2` floating around the global scope, we can group them into a single logical entity.

### Key-Value Pairs [03:37]
Inside an object, we assign values using a **colon** (`:`) rather than an equals sign. These pairs are known as **Key-Value Pairs**. The "key" acts as a label (the property name), and the "value" is the data associated with it.

```javascript
// Creating an object literal for ufo1
let ufo1 = { 
  x: 0, 
  y: 100 
};
```

In this example, `ufo1` is the object. It contains two properties: `x` (the key) and `0` (the value), and `y` (the key) and `100` (the value). This organizes our data into a single "container."

## Navigating Scope and Dot Notation [05:04]

When we move variables into an object, they are no longer accessible by their original names. This is a change in **scope**.

If we attempt to use the old variables after moving them into an object, the program will crash with a `ReferenceError`:

```javascript
let ufo1 = { x: 0, y: 100 };

function draw() {
  // ERROR: x is not defined! 
  // The variable 'x' no longer exists globally; it lives inside 'ufo1'.
  ufo(x, y); 
}
```

The console will report: `ReferenceError: x is not defined`. This happens because the function `ufo(x, y)` is looking for a global variable named `x`, but that data is now "trapped" inside the `ufo1` container.

### Using Dot Notation [05:45]
To access or update the data inside an object, we use **Dot Notation**: `objectName.propertyName`. This tells JavaScript, "Go to the object named `ufo1` and find the property called `x`."

```javascript
let ufo1 = { x: 0, y: 100 };

function draw() {
  background(0, 0, 35);
  
  // Accessing properties via dot notation to pass them into the function
  ufo(ufo1.x, ufo1.y); 

  // Updating properties via dot notation
  ufo1.x = ufo1.x + 3;
}

function ufo(x, y) {
  push();
  translate(x, y);
  // ... drawing code ...
  pop();
}
```

By using objects and dot notation, we have successfully encapsulated our data. We have moved from managing a messy list of independent variables to managing organized, structured objects. This sets the foundation for more advanced Object-Oriented Programming.

# Introduction to Object Literals

As a program grows in complexity, managing individual variables for every piece of data becomes unmanageable. This lesson explores the transition from procedural variable management to **Object Literals**, a fundamental step toward Object-Oriented Programming (OOP).

## The Problem: Variable Proliferation [05:18]

When managing a single entity, using individual variables for its properties is straightforward. For example, to move a "UFO" across the screen, you might start with:

```javascript
let x = 0;
let y = 100;
```

However, as you add more entities to your scene, the number of variables grows linearly. If you want three UFOs, you are forced to manually declare and manage six different variables:

```javascript
let x = 0, y = 100;      // UFO 1
let x2 = -40, y2 = 200;  // UFO 2
let x3 = -60, y3 = 250;  // UFO 3
```

This approach is "untenable" for complex systems. Not only does the code become cluttered, but it also becomes difficult to track which `x` belongs to which entity.

## Solving Complexity with Object Literals [06:37]

An **Object Literal** allows you to group related data—such as an $x$ and $y$ coordinate—under a single logical name. This is known as **encapsulation**. Instead of having multiple independent variables, you bundle them into a single object using key-value pairs.

### Syntax and Dot Notation
An object is defined using curly braces `{}`. Inside, you assign a "key" (the property name) to a "value."

```javascript
let ufo1 = { x: 0, y: 100 }; // An object with two properties
```

Once a variable is encapsulated within an object, it no longer exists as a standalone global variable. To access or modify its properties, you must use **dot notation** (`object.property`).

### Handling Reference Errors [06:00]
A common mistake when transitioning to objects is attempting to access the old variable names. If you move `x` and `y` into an object but forget to update your logic, the program will throw a `ReferenceError`.

**The Error:**
If you have defined `let ufo1 = { x: 0, y: 100 };` but your code still tries to do this:
```javascript
x = x + 2; // Error! 'x' is no longer defined globally.
```
The console will report: `ReferenceError: x is not defined`.

**The Fix:**
You must update the code to reference the property through its parent object:
```javascript
ufo1.x = ufo1.x + 3; // Correct: accessing the 'x' property of 'ufo1'
```

### Implementation Example [06:30]
The following code demonstrates how to use an object literal alongside standard variables to manage multiple entities.

```javascript
let ufo1 = { x: 0, y: 100 }; // Grouped properties
let x2 = -40, y2 = 200;      // Individual variables
let x3 = -60, y3 = 250;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(0, 0, 35);
  
  // Accessing properties via dot notation for the object
  ufo(ufo1.x, ufo1.y); 
  
  // Accessing standard variables for the others
  ufo(x2, y2);
  ufo(x3, y3);

  // Updating positions
  ufo1.x = ufo1.x + 3; // Update object property
  x2 = x2 + 2;          // Update standard variable
  x3 = x3 + 4;
}

function ufo(x, y) {
  push();
  noStroke();
  translate(x, y);
  // ... drawing logic for the UFO shape ...
  fill(210, 120, 150);
  arc(0, 0, 100, 30, 180, 0);
  pop();
}
```

## Summary of Insights [07:14]
Object literals represent a shift in how we organize data. While it may seem like extra work initially to use `ufo1.x` instead of just `x`, this organization is the foundation for managing complex systems. By grouping data, you prepare your code to scale from a few individual variables to hundreds of complex entities.
