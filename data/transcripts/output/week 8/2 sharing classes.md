---
video_id: 2-sharing-classes
video_title: 2 sharing classes
video_file: 2 sharing classes.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 8/2 sharing classes.mp4"
week: week 8
module: Module 3 - Generation and Life
topic: "Introduction to JavaScript classes, object instantiation using constructors and methods, and modularizing code by moving class definitions into separate files."
concepts:
  - class
  - constructor
  - this keyword
  - methods
  - file modularization
prerequisites:
  - Basic JavaScript variables and functions
  - p5.js basics (push/pop, translate, scale)
  - Basic understanding of the p5.js Web Editor interface
leads_to:
  - Sharing classes between projects
  - Object-Oriented Programming (OOP) principles
  - Complex generative systems using nodes and walkers
---
# Classes and Object-Oriented Programming

In procedural programming, we focus on a sequence of steps to achieve a result. Object-Oriented Programming (OOP) shifts this focus toward "objects"—entities that contain both their own data and the functions that act upon that data.

## Understanding Classes as Templates [00:05]

A **class** is not an object itself; rather, it is a design plan or a blueprint. Think of a class as a cookie cutter: the cutter defines the shape and characteristics, but you don't have a cookie until you use that cutter to create one.

To define a class in JavaScript, we use the `class` keyword followed by the name of the class.

```javascript
class UFO {
  // The blueprint for a UFO goes here
}
```

### The Constructor and the `this` Keyword [00:27]

When you create a new instance of a class (an actual object), the `constructor` function is automatically invoked. The constructor's job is to take specific data and assign it to that unique object.

To do this, we use the `this` keyword. The `this` keyword is a way for an object to refer to itself. It tells the computer: "Assign this specific value to *this* particular object's property, without changing the master template."

```javascript
class UFO {
  constructor(x, y, s) {
    this.x = x; // This object's unique X position
    this.y = y; // This object's unique Y position
    this.s = s; // This object's unique scale/size
  }
}
```

In the code above, even if we create 80 different UFOs, each one will have its own unique `x`, `y`, and `s` values stored within itself, even though they all follow the same structural blueprint.

### Methods: Defining Behavior [01:06]

Functions defined inside a class are called **methods**. While standard functions act on global variables, methods use `this` to interact with the object's own internal data.

```javascript
class UFO {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
  }

  display() {
    push();
    noStroke();
    // Use 'this' to access the object's specific position and scale
    translate(this.x, this.y);
    scale(this.s / 10);
    
    // Drawing logic for the UFO...
    fill(120, 120, 150);
    arc(0, 0, 30, 180, 0);
    // ... (rest of drawing code)
    pop();
  }

  move() {
    // Update this specific object's X position
    this.x = this.x + this.s;
    // Reset if it moves off-screen
    if (this.x > width + 100) {
      this.x = -50;
    }
  }
}
```

In the `move()` method, `this.x` refers to the X-coordinate belonging to the specific UFO being processed. This allows each object in an array to move independently of the others.

## Modularizing Code with External Files [02:54]

As your projects grow, keeping all your code in one file becomes unmanageable. Because a class is autonomous (it contains its own data and logic), it can be moved into its own dedicated file. This makes your code modular and reusable across different projects.

### The Importance of File Linking [04:21]

A common mistake when moving code to a new file is forgetting to tell the browser where to find it. If you move your `UFO` class to a file named `UFO.js`, but try to run your sketch, you will encounter a `ReferenceError: UFO is not defined`.

The browser only knows about the files explicitly linked in your HTML. To fix this, you must add a `<script>` tag for the new file in your `index.html`.

**The Correct Order of Operations:**
When linking multiple JavaScript files, the order matters. You must load the class definition *before* you try to use it in your main sketch.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <main></main>
    <!-- 1. Load the class definition first -->
    <script src="UFO.js"></script> 
    <!-- 2. Load the main sketch second -->
    <script src="sketch.js"></script> 
  </body>
</html>
```

### Understanding HTML Structure [05:04]

When managing multiple files, it is helpful to understand the basic architecture of a web page:
* **`<head>`**: Contains metadata and links to external resources (like the p5.js library or CSS files). These are loaded by the browser but typically aren't visible on the page itself.
* **`<body>`**: Contains all the content that is actually displayed to the user on the screen.
* **Tags**: Most elements use an opening tag (e.g., `<body>`) and a closing tag (e.g., `</body>`) to define the boundaries of an element.

## Modularizing Code with HTML and External Files [06:00]

Once you have defined a class, the next step in professional software development is modularization. Instead of keeping all your code in a single, massive `sketch.js` file, you can move your class definitions into their own dedicated files. This makes your code cleaner, easier to debug, and—most importantly—reusable across different projects.

### Linking JavaScript Files in HTML
To use a class defined in an external file, you must tell the browser to load that file via your `index.html`. This is done using the `<script>` tag.

When working with multiple files, the **order of your script tags matters**. You must load the class definition *before* you attempt to use it in your main sketch.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- External libraries like p5.js must be loaded first -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/addons/p5.sound.min.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
  <meta charset="utf-8" />
</head>
<body>
  <main></main>
  <!-- 1. Load the class definition first -->
  <script src="UFO.js"></script> 
  <!-- 2. Load the main sketch second -->
  <script src="sketch.js"></script>
</body>
</html>
```

**Key Technical Details:**
* **The `src` Attribute:** The `src` (source) attribute specifies the location of the file. If you move your JavaScript files into a subfolder, you must update this path (e.g., `src="js/UFO.js"`).
* **Opening and Closing Tags:** Most HTML tags require an opening tag (e.g., `<script>`) and a closing tag (e.g., `</script>`).
* **Self-Closing Tags:** Some tags, like `<br>` (a line break) or `<meta>`, are "self-closing." They do not require a separate closing tag because they don't wrap around content; they simply insert an element at a specific point.

### Encapsulation: The Power of the Class File
By moving the `UFO` class into its own file (`UFO.js`), you achieve **encapsulation**. This means all the data (properties) and behaviors (methods) related to a UFO are contained within one single unit.

The code in `UFO.js` looks like this:

```javascript
class UFO {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
  }

  display() {
    push();
    noStroke();
    translate(this.x, this.y);
    scale(this.s / 10);
    
    // draw top half
    fill(120, 120, 150);
    arc(0, 0, 100, 30, 180, 0);
    arc(0, 0, 50, 50, 180, 0);
    
    // draw bottom half
    fill(30, 30, 80);
    arc(0, 0, 100, 30, 0, 180);
    arc(0, 0, 50, 50, 0, 180);
    
    // draw lights on the side
    fill(220, 180, 0);
    for (let x = -50; x <= 50; x += 10) {
      circle(x, 0, 5);
    }
    pop();
  }

  move() {
    this.x = this.x + this.s;
    // Reset position if it moves off-screen to create a loop
    if (this.x > width + 100) {
      this.x = -50;
    }
  }
}
```

**Why this is useful:**
If you want to start a new project that also features flying objects, you don't have to rewrite the logic for drawing and moving them. You simply copy `UFO.js` into your new project, link it in your HTML, and you are ready to go. You have created a reusable "library" of behavior.
