---
video_id: 5a-disks-with-classes
video_title: 5a disks with classes
video_file: 5a disks with classes.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 8/5a disks with classes.mp4"
week: week 8
module: Module 3 - Generation and Life
topic: "Transitioning from procedural to Object-Oriented Programming (OOP) in p5.js, including advanced styling with the HTML5 Canvas API and clipping masks."
concepts:
  - Classes and Instances
  - Constructor
  - Drawing Context
  - Radial Gradients
  - Clipping and Masking
  - Push and Pop (Isolation)
prerequisites:
  - Basic p5.js functions (circle, rect, fill)
  - Variables and basic conditional logic
  - Basic understanding of the draw loop
leads_to:
  - Advanced animation with lerp()
  - Complex geometry and organic shapes
  - Performance optimization for many objects
---
# Refactoring for Complexity: Classes and Object-Oriented Programming

This lesson demonstrates the transition from procedural programming—using global variables to control a single object—to Object-Oriented Programming (OOP). We will move from a simple bouncing ball to a structured `class` that acts as a template for many independent objects.

## The Procedural Approach: A Single Bouncing Ball [00:52]

Before implementing classes, we first establish the basic logic for a single moving object using global variables. This "procedural" method works well for one or two objects, but becomes unmanageable as complexity increases.

### Defining State and Movement
To make a circle move, we need to define its position (`x`, `y`) and its velocity (`xSpeed`, `ySpeed`). In the `draw()` loop, we update the position by adding the speed to the current coordinate.

```javascript
let x = 0, y = 0;
let xSpeed = 1, ySpeed = 1;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  circle(x, y, 20);

  // Update position based on speed
  x += xSpeed;
  y += ySpeed;
}
```

### Implementing Collision Detection [01:36]
To make the ball "bounce," we need to detect when it hits the edges of the canvas. When a coordinate exceeds the `width` or `height`, we reverse the direction by reassigning the speed to its negative value. We must also check if the object has moved off the left or top edges (less than 0) to ensure it stays contained within the viewport.

```javascript
function draw() {
  background(220);
  circle(x, y, 20);

  x += xSpeed;
  y += ySpeed;

  // Bounce off right and bottom edges
  if (x > width) {
    xSpeed = -xSpeed;
  }
  if (y > height) {
    ySpeed = -ySpeed;
  }

  // Bounce off left and top edges
  if (x < 0) {
    xSpeed = -xSpeed;
  }
  if (y < 0) {
    ySpeed = -ySpeed;
  }
}
```

*Note: By using `xSpeed = -xSpeed`, we don't need to hardcode specific values; the object simply flips its current direction.*

## Transitioning to Object-Oriented Programming [04:17]

As we move from one ball to hundreds of balls, managing individual `x`, `y`, and `speed` variables for every single object becomes impossible. We need a **Class**.

### The Class as a Template [04:36]
A `class` is not an object itself; it is a **blueprint** or template. Instead of declaring variables in the global scope, we define them inside the class so that every instance created from this template carries its own unique "state" (data).

### The Constructor and Encapsulation [05:00]
The `constructor()` is a special function that runs only once when an object is created. We use the `this` keyword to tell JavaScript that we are assigning a value to the specific instance being created, rather than a global variable.

In this example, we create a `Disks` class that handles its own position and randomizes its diameter and speed upon creation.

```javascript
class Disks {
  constructor(x, y) {
    // 'this' refers to the specific instance being created
    this.x = x;
    this.y = y;
    // We can assign random properties during construction
    this.d = random(10, 40);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
  }

  // Methods (functions) would be added here to update and display the disk
}
```

### Summary of the OOP Shift
| Feature | Procedural (Single Ball) | Object-Oriented (Classes) |
| :--- | :--- | :--- |
| **Data Storage** | Global variables (`let x`) | Instance properties (`this.x`) |
| **Scalability** | Hard to manage multiple objects | Easy; just create more instances |
| **Logic** | Logic lives in `draw()` | Logic is encapsulated within the class |

By using this structure, we can eventually use a `for` loop in `setup()` to create hundreds of unique disks, each with its own position and speed, all managed by a single class template.

# Refactoring for Complexity: Classes and Object-Oriented Programming

This lesson demonstrates how to transition from procedural programming—where variables are managed individually—to Object-Oriented Programming (OOP). By using classes, we can create "templates" for objects, allowing us to manage hundreds of unique entities with minimal code.

## From Variables to Classes [07:00]

In a procedural approach, if you want ten bouncing circles, you would need dozens of individual variables for `x`, `y`, `xSpeed`, and `ySpeed`. This becomes unmanageable as complexity grows. 

Instead, we use a **Class**. A class acts as a blueprint or template. When you create an "instance" of a class using the `new` keyword, JavaScript creates a unique object containing all the properties defined in that blueprint.

### Defining the Disk Class
We can encapsulate the state (position, size, speed) and behavior (displaying and moving) within a class.

```javascript
class Disk {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = random(10, 40); // Diameter
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    this.fill = color(random(255)); // Random grayscale fill
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(this.fill);
    circle(0, 0, this.d);
    pop();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Collision detection with canvas boundaries
    if (this.x > width || this.x < 0) {
      this.xSpeed *= -1;
    }
    if (this.y > height || this.y < 0) {
      this.ySpeed *= -1;
    }
  }
}
```

### Key Implementation Details

#### 1. The `constructor` and the `this` Keyword
The `constructor()` is a special function that runs only once when an object is created. We use the `this` keyword to assign values to the specific instance being created. 
* **Note:** When updating movement, we use `this.x += this.xSpeed`. We do not need to add `this` to `width` or `height` because those are properties of the p5.js canvas, not properties of our object.

#### 2. Encapsulating Behavior with `display()`
When drawing an object that moves, it is best practice to use `translate(this.x, this.y)` inside the class's display method. This moves the origin of the drawing context to the object's position, allowing us to draw the shape at `(0, 0)`.

**Crucial Step: Using `push()` and `pop()`**
Because `translate()` changes the coordinate system for everything drawn afterward, we must wrap it in `push()` and `pop()`. This "isolates" the transformation, ensuring that one object's position doesn't accidentally shift the drawing of the next object.

#### 3. Distinguishing Functions from Properties
A common point of confusion is the difference between `fill()` and `this.fill`. 
* `fill()` is a **p5.js function** used to set the current drawing color.
* `this.fill` is a **property** (or field) stored inside our object instance.

---

## Managing Collections of Objects [10:46]

A class by itself doesn't do anything until it is instantiated. To manage many objects, we store them in an **Array**.

### Initializing Objects
In `setup()`, we can populate our array with multiple instances. By generating random values directly in the constructor, we keep our `setup()` function clean.

```javascript
let arr = [];

function setup() {
  createCanvas(500, 400);
  // Populate the array with 200 unique disks
  for (let i = 0; i < 200; i++) {
    arr.push(new Disk());
  }
}

function draw() {
  background(220);
  
  // Iterate through the array to update and display every object
  for (let disk of arr) {
    disk.display();
    disk.update();
  }
}

class Disk {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.d = random(10, 40);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    this.fill = color(random(255));
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(this.fill);
    circle(0, 0, this.d);
    pop();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x > width || this.x < 0) {
      this.xSpeed *= -1;
    }
    if (this.y > height || this.y < 0) {
      this.ySpeed *= -1;
    }
  }
}
```

### The `for...of` Loop
While a standard `for` loop uses an index (e.g., `i`), the `for...of` loop is a cleaner way to iterate through an array when you only care about the elements themselves.

* **Standard Loop:** `for (let i = 0; i < arr.length; i++) { arr[i].display(); }`
* **For...of Loop:** `for (let disk of arr) { disk.display(); }`

The `for...of` loop looks over the array and gives you each element directly, making your code more readable and reducing the chance of index-related errors.

# Refactoring for Complexity: Classes and Advanced Styling

This lesson demonstrates the transition from procedural programming—where variables are managed individually—to Object-Oriented Programming (OOP), where behavior and data are encapsulated within classes. We will also explore how to use the underlying Web API via `drawingContext` to create advanced visual effects.

## Managing Collections with Classes [14:00]

When creating generative art, you often need many instances of the same shape. Instead of declaring hundreds of individual variables for `x`, `y`, and `speed`, we use a **Class** as a template.

### Using Arrays and Iteration
To manage multiple objects, we store them in an array. In the `setup()` function, we use a loop to instantiate many "Disks" and push them into our array. In the `draw()` function, we use a `for...of` loop to iterate through that array, calling the `display()` and `update()` methods on each individual object.

```javascript
let arr = [];

function setup() {
  createCanvas(500, 400);
  // Create 200 individual instances of the Disk class
  for (let i = 0; i < 200; i++) {
    arr.push(new Disk());
  }
}

function draw() {
  background(220);

  // Iterate over the array to update and show each disk
  for (let disk of arr) {
    disk.display();
    disk.update();
  }
}

class Disk {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.d = random(10, 40);
  }

  display() {
    // Logic for drawing the disk goes here
  }

  update() {
    // Logic for movement goes here
  }
}
```

The preview shows a canvas filled with numerous overlapping circles of varying sizes and shades of gray, each behaving independently because they each hold their own unique data (position and diameter).

## Debugging Movement Logic [14:40]

When implementing movement, a common error occurs when checking boundaries. If you check against `this.height` (a property of the object) instead of the global `height` (the canvas height), your objects will behave unexpectedly.

### The Boundary Check Error
If the code incorrectly references `this.height`, the objects may "drop off" the bottom of the screen and never return because the object itself doesn't have a height property to check against.

**Incorrect Logic:**
```javascript
if (this.y > this.height) { // Error: 'this' refers to the Disk, which has no height
  this.ySpeed = -this.ySpeed;
}
```

**Correct Logic:**
```javascript
update() {
  this.x += this.xSpeed;
  this.y += this.ySpeed;

  // Check against the canvas dimensions (width/height)
  if (this.x > width) {
    this.xSpeed = -this.xSpeed;
  }
  if (this.y > height) {
    this.ySpeed = -this.ySpeed;
  }
  if (this.x < 0) {
    this.xSpeed = -this.xSpeed;
  }
  if (this.y < 0) {
    this.ySpeed = -this.ySpeed;
  }
}
```

## Creating Background Gradients [16:40]

To add depth to a generative piece, you can replace a solid background with a gradient. This is achieved by looping through the height of the canvas and drawing lines across the screen with varying colors.

### Implementing a Color Fade
By using the `y` coordinate as an input for color values, we can create a smooth transition. In this example, we use the `y` value to drive both the brightness and a color shift (e.g., transitioning from green at the top to pink/magenta at the bottom).

```javascript
function draw() {
  background(220);

  // Draw a gradient background using lines
  for (let y = 0; y < height; y++) {
    strokeWeight(5);
    // Using 'y' to create a color transition
    // Example: stroke(y, 255, y/2, y/2);
    stroke(y, 255, y/2, y/2); 
    line(0, y, width, y);
  }

  for (let disk of arr) {
    disk.display();
    disk.update();
  }
}
```

The visual output shows a vibrant gradient background with disks layered on top. To ensure the disks don't have lines cutting through them, we use `noStroke()` within their `display()` method.

```javascript
display() {
  push(); // Save current drawing state
  translate(this.x, this.y);
  noStroke(); // Remove the outline for a cleaner look
  fill(this.fill);
  circle(0, 0, this.d);
  pop(); // Restore drawing state
}
```

## Moving Toward Advanced Styling [19:30]

Once the basic movement and background are established, you may find that many objects look too similar. To break up the visual monotony and add sophistication, we can move beyond standard p5.js functions and utilize **CSS (Cascading Style Sheets)** via the `drawingContext` to apply advanced effects like shadows and complex gradients.

# Refactoring for Complexity: Classes and Advanced Styling

This lesson explores the transition from procedural programming to Object-Oriented Programming (OOP) using p5.js and demonstrates how to access the underlying Web API to create advanced visual effects like radial gradients.

## From Procedural to Object-Oriented [20:00]

In a simple sketch, you might use global variables to track the position and speed of a single shape. However, as complexity increases—such as when you want hundreds of independent objects on screen—managing individual variables for every single object becomes impossible.

To solve this, we use **Classes**. A class acts as a blueprint or template. Instead of defining `x`, `y`, and `speed` for every single circle, we define them once within a class. When we want an actual object to exist in our sketch, we create an **instance** of that class.

### The Disk Class
The following code demonstrates a `Disk` class. Each instance of this class maintains its own unique state (position, size, speed, and color) while sharing the same logic for how it moves and draws itself.

```javascript
class Disk {
  constructor() {
    // The constructor sets the initial state for each new instance
    this.x = random(width);
    this.y = random(height);
    this.d = random(10, 40);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    // We will later replace this simple color with a complex gradient
    this.fill = color(random(255)); 
  }

  display() {
    noStroke();
    push();
    translate(this.x, this.y);
    fill(this.fill);
    circle(0, 0, this.d);
    pop();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}
```

### Managing Collections of Objects
To manage many objects, we store them in an array. During `setup()`, we populate the array with new instances of our class. In `draw()`, we use a loop to tell each object to update its position and draw itself.

```javascript
let arr = [];

function setup() {
  createCanvas(500, 400);
  // Create 200 unique disk instances
  for (let i = 0; i < 200; i++) {
    arr.push(new Disk());
  }
}

function draw() {
  background(220);
  
  // Draw a background gradient using lines
  for (let y = 0; y < height; y++) {
    strokeWeight(1);
    stroke(y, 255 - y/2, y/2);
    line(0, y, width, y);
  }

  // Update and display every disk in the array
  for (let disk of arr) {
    disk.display();
    disk.update();
  }
}
```

## Accessing the Drawing Context [21:00]

While p5.js provides convenient functions like `fill()` and `stroke()`, it is actually a "wrapper" around the standard HTML5 Canvas API. To access more advanced features—like radial gradients or complex shadows—you must interact directly with the **Drawing Context**.

In p5.js, you access this via the `drawingContext` property. This provides access to the `CanvasRenderingContext2D` object, which contains a much deeper set of tools than the standard p5.js library.

### Using Radial Gradients [23:00]

A radial gradient creates a color transition that radiates from a center point. Because p5.js does not have a native `radialGradient()` function, we use the `drawingContext` to create one and then apply it as a fill.

#### The `createRadialGradient()` Method
The method requires six parameters to define the gradient's geometry:
`createRadialGradient(x0, y0, r0, x1, y1, r1)`

*   **`x0, y0`**: The X and Y coordinates of the start (inner) circle.
*   **`r0`**: The radius of the start (inner) circle.
*   **`x1, y1`**: The X and Y coordinates of the end (outer) circle.
*   **`r1`**: The radius of the end (outer) circle.

By offsetting the center of the inner circle from the outer circle, you can create asymmetric, organic-looking light effects.

#### Implementing Gradients in a Class
To apply this to our `Disk` class, we define the gradient within the constructor or a setup method and assign it to `this.fill`.

```javascript
class Disk {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.d = random(10, 40);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);

    // Access the underlying Web API via drawingContext
    let ctx = drawingContext;
    
    // Create the gradient: 
    // Inner circle at (110, 90) with radius 30
    // Outer circle at (100, 100) with radius 70
    let grad = ctx.createRadialGradient(110, 90, 30, 100, 100, 70);

    // Add color stops (percentage of distance from center, then color)
    grad.addColorStop(0, "pink");      // Center
    grad.addColorStop(0.9, "white");   // Near the edge
    grad.addColorStop(1, "green");     // At the outer boundary

    this.fill = grad;
  }

  display() {
    noStroke();
    push();
    translate(this.x, this.y);
    fill(this.fill); // This now uses the gradient object instead of a simple color
    circle(0, 0, this.d);
    pop();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}
```

**Visual Result:** Instead of solid-colored circles, the canvas now displays disks with complex color transitions. The gradient creates a sense of depth and light, making the objects appear more three-dimensional as they move across the screen.

## Advanced Styling with the Drawing Context [26:00]

To achieve visual effects beyond simple solid colors, we must move past standard p5.js functions like `fill()` and interact directly with the underlying HTML5 Canvas API via the `drawingContext`. This allows for advanced features like radial gradients.

### Understanding Radial Gradients
A radial gradient creates a color transition that radiates from a center point. To create one, you must define six parameters: the starting coordinates $(x_0, y_0)$, the radius of the inner circle ($r_0$), the ending coordinates $(x_1, y_1)$, and the radius of the outer circle ($r_1$).

When using `drawingContext.createRadialGradient()`, you must then define "color stops" to determine how colors transition at specific points along the gradient.

```javascript
// Example of creating a radial gradient using the Canvas API
const gradient = ctx.createRadialGradient(10, 90, 30, 100, 100, 70);

// Add color stops (position from 0 to 1)
gradient.addColorStop(0, "pink");    // Center color
gradient.addColorStop(0.5, "white"); // Middle transition
gradient.addColorStop(1, "green");   // Outer edge color

// Apply the gradient to the drawing context
ctx.fillStyle = gradient;
```

**Note on p5.js Workflow:** Unlike `fill()`, which applies a color to the next shape you draw, setting `drawingContext.fillStyle` changes the state of the underlying canvas context. This means it affects everything drawn afterward until you change it again.

## Implementing Gradients within Classes [27:00]

When working with Object-Oriented Programming, you can encapsulate complex styling logic within a class's `constructor`. This ensures that every time a new object is created, it receives its own unique gradient.

### Encapsulating State in the Constructor
In a `Disk` class, we can define the gradient as a property of the object. To make the gradient look natural on a moving circle, we should define the gradient coordinates relative to the object's center.

```javascript
class Disk {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.d = random(10, 40); // Diameter
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);

    // Create a radial gradient relative to the object's center
    // We offset the start slightly (-5, -5) so the "light" isn't perfectly centered
    this.fill = drawingContext.createRadialGradient(-5, -5, 5, 0, 0, this.d/2);
    
    // Add color stops to the gradient stored in this object
    this.fill.addColorStop(0, "#1782FF"); // Center color (Blue)
    this.fill.addColorStop(0.2, "#FF82FF"); // Mid-point (Pink)
    this.fill.addColorStop(0.5, "#33FFFF"); // Outer transition (Cyan)
  }

  display() {
    noStroke();
    push();
    translate(this.x, this.y);
    fill(this.fill); // Use the gradient stored in the object
    circle(0, 0, this.d);
    pop();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}
```

The canvas shows the result of this logic: numerous circles appearing as 3D-like spheres due to the internal color transitions, moving across a background.

## Working with Hexadecimal and Alpha [28:30]

Colors in web development are often represented using **Hexadecimal** (hex) values. These values represent the intensity of Red, Green, and Blue (RGB) on a scale from `00` to `FF`.

### Hexadecimal Basics
* **The Scale:** The values range from `0` (minimum intensity) to `FF` (maximum intensity, which is `255` in decimal).
* **Structure:** Hex values are written in pairs. For example, `#2288FF` breaks down as:
    * `22`: Red intensity
    * `88`: Green intensity
    * `FF`: Blue intensity

### Adding Transparency (Alpha)
You can add a fourth pair of digits to the end of a hex code to control **Alpha** (transparency).
* `00`: Completely transparent.
* `88`: Partially transparent.
* `FF`: Fully opaque.

For example, if you have a color `#1782FF` and want it to be semi-transparent, you would append a value like `88`, resulting in `#1782FF88`. This allows for complex layering and depth in generative art.

## Advanced Styling with the Drawing Context [31:30]

When working in p5.js, standard functions like `fill()` are convenient shortcuts for common tasks. However, to achieve professional-grade visual effects—such as radial gradients or complex transparency—you must access the underlying HTML5 Canvas API via `drawingContext`.

### Implementing Radial Gradients in a Class
To give each object a unique, high-quality texture, we can define a radial gradient within the class `constructor`. This allows each instance to have its own unique color transitions.

```javascript
class Disk {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.d = random(10, 40); // Diameter
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);

    // Create a radial gradient using the drawingContext
    // Parameters: x0, y0, r0 (inner circle), x1, y1, r1 (outer circle)
    this.fill = drawingContext.createRadialGradient(-5, -5, 5, 0, 0, this.d/2);
    
    // Adding color stops (0 to 1)
    this.fill.addColorStop(0, "#1782FF");      // Inner color
    this.fill.addColorStop(0.2, "#FF00AA");    // Mid color
    this.fill.addColorStop(1, "#00FF3300");    // Outer color (with 0 alpha for fade)
  }

  display() {
    noStroke();
    push();
    translate(this.x, this.y);
    // IMPORTANT: Use drawingContext.fillStyle to apply the gradient object
    drawingContext.fillStyle = this.fill;
    circle(0, 0, this.d);
    pop();
  }
}
```

### Troubleshooting: `fill()` vs. `drawingContext.fillStyle`
A common error occurs when trying to use the p5.js `fill()` function with a gradient object created via the Web API. 

**The Error:**
`Error: [object Arguments] is not a valid color representation.`

**The Insight:**
The p5.js `fill()` function expects colors in standard formats (strings like `"#FFFFFF"`, numbers, or p5 color objects). A gradient created via `createRadialGradient` is a complex object belonging to the `CanvasRenderingContext2D`. To apply it, you must bypass the p5.js shortcut and assign it directly to the `drawingContext.fillStyle` property.

### Mastering Color Stops and Opacity [31:47]
The `addColorStop()` method allows you to define how colors transition across the shape. You can control transparency by using 8-digit hex codes (RGBA), where the last two digits represent the alpha channel.

*   `#FF00AA` $\rightarrow$ Fully opaque magenta.
*   `#1782FF00` $\rightarrow$ Completely transparent blue (the `00` at the end is the alpha).
*   `#00A8E09B` $\rightarrow$ Semi-transparent cyan.

By adjusting these values, you can create "hollowed out" or translucent effects that allow overlapping objects to blend visually.

## Expanding Object State: Rotation [35:00]

To add more organic movement to your generative art, you can introduce rotational properties to your class. This requires adding two new pieces of "state" to the constructor: an initial angle and a rotational speed.

### Adding Rotation Logic
To rotate an object around its own center, you must use `push()` and `pop()` to isolate the transformation, then apply `rotate()`.

```javascript
class Disk {
  constructor() {
    // ... existing position and speed logic ...
    this.d = random(10, 50);
    
    // New rotational state
    this.a = random(TWO_PI);           // Initial angle in radians (0 to 360°)
    this.rotationSpeed = random(-1, 1); // Speed of rotation
  }

  display() {
    noStroke();
    push();
    translate(this.x, this.y); // Move origin to the center of the disk
    rotate(this.a);            // Rotate around the new origin
    drawingContext.fillStyle = this.fill;
    circle(0, 0, this.d);
    pop();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.a += this.rotationSpeed; // Update the angle every frame
  }
}
```

### Key Technical Details
1.  **Radians vs. Degrees**: While we think in degrees (0–360), the `rotate()` function and mathematical constants like `TWO_PI` operate in **radians**. Using `random(TWO_PI)` ensures the object starts at a completely random rotation.
2.  **The Importance of `translate()`**: When you call `rotate()`, the object rotates around the canvas origin $(0,0)$. By calling `translate(this.x, this.y)` *before* `rotate()`, you move the origin to the center of your object, ensuring it spins in place rather than orbiting the corner of the screen.
3.  **The Update Loop**: Just as position (`x`, `y`) must be updated every frame to create movement, the angle (`a`) must also be incremented by the `rotationSpeed` in the `update()` method.

# Refactoring for Complexity: Classes and Advanced Styling

In this lesson, we transition from simple procedural code—like a single bouncing ball—to a sophisticated Object-Oriented Programming (OOP) structure. We will also explore how to use the underlying web drawing context to achieve advanced visual effects like radial gradients and shadows.

## Enhancing Object State with Rotation [36:30]

When managing multiple objects, we can add more complexity to their "state" (the variables that define them) without breaking the system. By adding a `rotationSpeed` property to our class, we can give each object its own unique movement pattern.

```javascript
// Inside the Class Constructor
this.a = random(TWO_PI); // Initial rotation angle
this.rotationSpeed = random(-0.1, 0.1); // Unique rotation speed
```

In the `update()` method, we increment the current angle by the rotation speed:

```javascript
update() {
  this.x += this.xSpeed;
  this.y += this.ySpeed;
  this.a += this.rotationSpeed; // Update rotation angle
}
```

The canvas shows the result: numerous overlapping circles that don't just move linearly, but also "amble" or rotate slowly as they travel.

## Advanced Styling with `drawingContext` [37:00]

Standard p5.js functions like `fill()` are excellent for simple colors, but they don't provide access to the full power of the HTML5 Canvas API. To create complex effects like radial gradients or shadows, we must use `drawingContext`.

### Creating Radial Gradients [37:00]
A radial gradient creates a color transition from a center point outward. We can define this once in the constructor and store it as a property of our object.

```javascript
// Creating a gradient within the constructor
this.fill = drawingContext.createRadialGradient(-5, -5, 5, 0, 0, this.d/2);
this.fill.addColorStop(0, "#1782FF99");   // Inner color (with transparency)
this.fill.addColorStop(0.2, "#FF00AA");    // Mid-tone
this.fill.addColorStop(1, "#00FF3300");    // Outer color (fully transparent)
```

*Note: In hexadecimals, the last two digits represent transparency (e.g., `99` is roughly 60% opacity, while `00` is fully transparent).*

### Adding Shadows [37:18]
To add depth, we can use the `shadow` properties of the drawing context. These allow us to control how a shadow is offset, how blurry it is, and what color it is.

**The Debugging Insight:** A common mistake is attempting to call shadow properties directly on the gradient object (e.g., `this.fill.shadowBlur`). However, shadows are properties of the **drawing context** itself, not the fill pattern.

To make these styles "stick" to our objects in an OOP structure, we should store the shadow settings as properties of the class instance.

```javascript
// Inside the Class Constructor
this.shadowOffsetX = random(0, 10);
this.shadowOffsetY = random(0, 5);
this.shadowBlur = 10;
this.shadowColor = "#22555599"; // A dark, translucent mid-tone
```

### Applying Styles in `display()` [37:45]
When it comes time to draw, we must apply these styles to the `drawingContext` before calling the drawing function (like `circle`).

```javascript
display() {
  noStroke();
  push();
  translate(this.x, this.y);
  rotate(this.a);

  // Apply the stored styles to the context
  drawingContext.fillStyle = this.fill;
  drawingContext.shadowOffsetX = this.shadowOffsetX;
  drawingContext.shadowOffsetY = this.shadowOffsetY;
  drawingContext.shadowBlur = this.shadowBlur;
  drawingContext.shadowColor = this.shadowColor;

  circle(0, 0, this.d);
  pop();
}
```

The visual output becomes a psychedelic pattern of glowing, overlapping orbs with soft shadows that add significant texture and depth to the composition.

## Troubleshooting: Context vs. Properties [39:00]

During development, you may encounter a situation where your shadows appear to be "detached" from the object or simply don't show up. 

If you apply `shadowBlur` to a gradient object instead of the `drawingContext`, the browser will ignore it. When debugging, always check if you are attempting to call a property on an object (like `this.fill`) rather than the global `drawingContext`. 

If shadows still aren't appearing, ensure that:
1. The `shadowColor` has an alpha value (transparency) or is sufficiently different from the background.
2. The `shadowBlur` value is high enough to be visible.
3. You are applying the properties to the `drawingContext` *before* you draw the shape.

# Refactoring for Complexity: Classes and Advanced Styling

This lesson explores the transition from procedural programming to Object-Oriented Programming (OOP) and demonstrates how to leverage the underlying HTML5 Canvas API via `drawingContext` to achieve advanced visual effects.

## Debugging the Drawing Context [41:30]

When working with advanced styling, it is easy to misplace properties. A common mistake is attempting to attach a property (like `shadow`) to an object that isn't the drawing context itself.

For example, if you create a radial gradient and store it in `this.fill`, attempting to set `this.fill.shadowOffsetX` will fail because the shadow properties belong to the **Canvas Rendering Context**, not the gradient object.

### Correcting Property Assignment
To apply shadows or gradients, you must interact with the `drawingContext` directly.

**Incorrect approach:**
```javascript
// This will fail because 'this.fill' is a gradient object, not the context
this.fill.shadowOffsetX = 10; 
```

**Correct approach:**
```javascript
// Access the context directly to apply shadow properties
this.fill = drawingContext.createRadialGradient(-5, -5, 5, 0, 0, this.d/2);
this.fill.addColorStop(0, "#1782FF99");
// ... add color stops ...

drawingContext.shadowOffsetX = 10;
drawingContext.shadowOffsetY = 10;
drawingContext.shadowBlur = 10;
drawingContext.shadowColor = "#225555";
```

## Performance and Complexity [42:09]

While advanced effects like shadows create beautiful, glowing aesthetics, they are computationally expensive. 

As demonstrated in the live coding session, adding `shadowBlur` and `shadowColor` to hundreds of objects can significantly "chew up" the processor, causing the frame rate to drop. When working with large collections of objects (e.g., 500+ instances), consider reducing the object count or disabling heavy effects to maintain a smooth animation.

## Advanced Styling with `drawingContext` [43:00]

The `drawingContext` provides access to the low-level Web API, allowing for effects that standard p5.js functions like `fill()` cannot achieve alone.

### Radial Gradients
To create a smooth color transition within an object, use `createRadialGradient`. This is particularly useful for creating "glowing" or organic-looking shapes.

```javascript
// Inside the class constructor
this.fill = drawingContext.createRadialGradient(-5, -5, 5, 0, 0, this.d/2);
this.fill.addColorStop(0, "#1782FF99");    // Inner color
this.fill.addColorStop(0.2, "#FF00AA");    // Mid color
this.fill.addColorStop(1, "#00F300");      // Outer color

// Inside the display() method
drawingContext.fillStyle = this.fill;
circle(0, 0, this.d);
```

### Applying Shadows
Shadows can be applied to the entire drawing context, affecting subsequent shapes until changed.

```javascript
drawingContext.shadowOffsetX = 10;
drawingContext.shadowOffsetY = 10;
drawingContext.shadowBlur = 10;
drawingContext.shadowColor = "#225555";
```

## Implementing Clipping Masks [43:51]

Clipping allows you to define a specific boundary. Once a clip is active, any shapes drawn afterward will only appear within that defined area.

### Basic Clipping
To create a mask, you define the shape of the boundary between `beginClip()` and `endClip()`.

```javascript
// In the draw loop
beginClip();
  rect(50, 50, width/2 - 72, height - 100); // The mask shape
  rect(width/2 + 50, 50, width/2 - 72, height - 100);
endClip();

// Everything drawn here is contained within the rectangles above
for (let disk of arr) {
  disk.display();
  disk.update();
}
```

### Inverting the Mask
You can also invert a mask using `beginFlip()`. This makes the "inside" of your shape invisible and the "outside" visible, effectively creating a cutout effect.

### Isolating Clips with `push()` and `pop()`
When using clipping, it is best practice to wrap the clipping logic in `push()` and `pop()`. This ensures that the clipping boundary does not "leak" into other parts of your code, allowing you to draw elements outside the mask elsewhere in your sketch.

```javascript
push(); // Isolate state
  beginClip();
    rect(50, 50, width/2 - 72, height - 100);
  endClip();

  for (let disk of arr) {
    disk.display();
    disk.update();
  }
pop(); // Restore state
```

## Implementing Clipping Masks and Advanced Styling

Once you have mastered the logic of Object-Oriented Programming, you can use those organized structures to create complex visual compositions. By combining classes with advanced styling techniques like clipping masks and radial gradients, you can move from simple shapes to sophisticated generative art.

### Using Clipping Masks for Composition [47:00]

Clipping masks allow you to define a specific boundary. Once a clip is active, any subsequent drawing commands will only appear within that defined area. This is useful for containing chaotic movement or creating specific geometric windows within a larger composition.

To use clipping, you wrap your drawing logic between `beginClip()` and `endClip()`. It is also best practice to use `push()` before starting a clip and `pop()` after ending it; this ensures the clipping behavior is isolated and doesn't affect other elements in your sketch.

The following code demonstrates how to create two rectangular "windows" that contain the movement of your objects:

```javascript
// Inside the draw() function
push(); // Isolate the clipping state
beginClip();

// Define the boundaries of the clip
rect(50, 50, width / 2 - 72, height - 100);
rect(width / 2 + 50, width / 2 - 72, height - 100);

endClip(); // Stop clipping

// The objects will only be visible within the rectangles defined above
for (let disk of arr) {
  disk.display();
  disk.update();
}

pop(); // Restore the previous state
```

In this setup, even if a `disk` object moves to coordinates like $(0, 0)$, it will not be rendered because those coordinates fall outside the clipped rectangular regions. This allows you to have a vibrant, full-screen background while keeping your animated elements contained within specific compositional zones.

### Advanced Styling with the Drawing Context [47:30]

While standard p5.js functions like `fill()` are excellent for basic colors, the underlying HTML5 Canvas API—accessed via `drawingContext`—provides much more powerful tools for visual aesthetics.

A highly effective way to add depth to generative objects is by using **radial gradients**. Instead of a single flat color, you can assign a gradient to an object's `fill` property within its class constructor.

```javascript
class Disk {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.d = random(10, 50);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    
    // Create a radial gradient using the drawingContext
    this.fill = drawingContext.createRadialGradient(
      this.x, this.y, 0,       // Inner circle (center x, center y, radius)
      this.x, this.y, this.d/2 // Outer circle (center x, center y, radius)
    );

    // Add color stops to the gradient
    this.fill.addColorStop(0, "#EF00AA"); // Inner color (Pink)
    this.fill.addColorStop(1, "#00FFFF"); // Outer color (Cyan)
  }

  display() {
    noStroke();
    fill(this.fill); // Apply the gradient to the fill
    circle(this.x, this.y, this.d);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}
```

### Summary of the Workflow

By combining these techniques, you transform a simple procedural sketch into a complex system:
1.  **Classes** act as the blueprint, managing the state (position, speed) and the complex styling (gradients) for every individual element.
2.  **Arrays and Loops** allow you to manage hundreds of these unique instances simultaneously.
3.  **The Drawing Context** provides the high-end visual polish (gradients and shadows).
4.  **Clipping Masks** provide the compositional structure, allowing you to control where those complex elements are visible.
