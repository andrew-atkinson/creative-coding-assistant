---
video_id: 5b-walkers-with-classes
video_title: 5b walkers with classes
video_file: 5b walkers with classes.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 8/5b walkers with classes.mp4"
week: week 8
module: Module 3 - Generation and Life
topic: Transitioning from procedural random walkers to Object-Oriented Programming (OOP) using classes and container classes to manage populations and color palettes.
concepts:
  - Walker Class (The Individual)
  - Walkers Class (The Container)
  - Constructor
  - Methods (update and display)
  - Color Palettes via OOP
  - Property Linking (Thickness to Step Size)
prerequisites:
  - Basic p5.js syntax (setup, draw)
  - Variables and basic math
  - Arrays and loops
  - Basic coordinate systems (x, y)
leads_to:
  - Perlin Noise for organic movement
  - Advanced generative systems with complex agent interactions
---
# Scaling Complexity with Classes and Object-Oriented Programming

In generative art, moving from a single moving element to complex, organized systems requires a shift in how we write code. By transitioning from simple procedural animation to **Object-Oriented Programming (OOP)**, we can manage hundreds of individual agents while maintaining control over their collective behavior and color palettes.

## From Procedural to Object-Oriented [01:23]

When creating generative art, we often start with a single "random walker"—a simple line that meanders across the screen. While interesting, a single line lacks visual complexity. To create something more sophisticated, we need to abstract that behavior into a **Class**.

A Class acts as a blueprint. Instead of writing code for one specific line, we create a template that defines what every "Walker" knows (its position) and does (moves and draws itself).

### The Visual Goal: Composition through Control
The goal is to move from a single line to a "living color composition." By using classes, we can create groups of walkers that share specific traits. For example, instead of every line being a completely random color, we can create "families" of colors (e.g., a group of blues, a group of mustard yellows, or a group of pinks). This allows the viewer's perception to impose structure upon what would otherwise be chaotic noise.

The instructor demonstrates this by using **code folding** (the small arrows next to line numbers) to hide implementation details and focus on the high-level structure of the composition.

```javascript
let walkers, walkers2, walkers3; // Individual groups/palettes

function setup() { ... }
function draw() { ... }

class Walker { ... } // The individual agent
class Walkers { ... } // The container/manager for a group of agents
```

## Building the Individual: The `Walker` Class [02:39]

To understand how a class works, we first look at the logic of a single procedural walker. To draw a continuous line as an object moves, we must track both its current position and its previous position.

### The Logic of Movement
If we only know the current $(x, y)$, we can only draw a single dot. To draw a line that "meanders," we must store the previous $(px, py)$ coordinates.

```javascript
let x, y, px, py;

function setup() {
  createCanvas(400, 400);
  background(220);
  x = random(width);
  y = random(height);
  // Initialize previous position to current position to avoid lines from (0,0)
  px = x; 
  py = y;
}

function draw() {
  // We do NOT call background(220) here if we want to see the trail
  line(x, y, px, py);

  // Update previous position to current before moving
  px = x;
  py = y;

  // Move the walker by a small random amount
  x += random(-1, 1);
  y += random(-1, 1);
}
```

**Key Insight: The Importance of `setup()` vs `draw()` for Backgrounds**
If `background()` is called inside `draw()`, the canvas clears every frame, and you will only see a single moving dot. To create "trails" or organic shapes, the `background()` must be called in `setup()`, allowing the lines to accumulate on the canvas.

### Transitioning to OOP Syntax [06:27]
To scale this up, we wrap this logic inside a `class`. In a class, we use the keyword `this` to refer to the properties belonging to that specific instance of the object.

```javascript
class Walker {
  constructor() {
    // The constructor runs once when a new walker is created
    this.x = random(width);
    this.y = random(height);
    
    // Initialize previous positions to current positions
    this.px = this.x;
    this.py = this.y;
  }

  update() {
    // Store current position as previous before updating
    this.px = this.x;
    this.py = this.y;

    // Update position with a random step
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }

  show() {
    line(this.x, this.y, this.px, this.py);
  }
}
```

### Understanding `this` Context [07:16]
When working inside a class, you cannot simply write `x = random(width)`. You must use `this.x`. The `this` keyword tells the computer: "I am talking about the $x$ value that belongs to *this specific walker*." Without `this`, the program will look for a global variable named $x$ rather than the property belonging to the object, leading to errors or unexpected behavior.

# Scaling Complexity with Classes and Object-Oriented Programming

This guide demonstrates how to transition from simple procedural animation—where variables like `x` and `y` are managed globally—to Object-Oriented Programming (OOP). By using classes, you can move from controlling a single moving element to managing entire populations of independent agents.

## From Procedural to Object-Oriented [08:00]

In a procedural approach, you might manage a single walker using global variables. This works for one line, but it becomes impossible to manage hundreds of lines as the complexity grows.

The first step in moving toward OOP is encapsulating that behavior into a `class`. A class acts as a blueprint. Instead of having loose variables, we bundle the state (position) and the behavior (update and display) into a single unit.

### The Walker Class [08:06]

When defining the class, we must ensure that each instance of a `Walker` maintains its own unique state. This is achieved using the `this` keyword, which refers to the specific object being created.

```javascript
class Walker {
  constructor() {
    // Initialize position
    this.x = random(width);
    this.y = random(height);
    
    // Initialize previous position (for drawing lines)
    this.px = this.x;
    this.py = this.y;
  }

  // The update method handles the logic of movement
  update() {
    this.px = this.x;
    this.py = this.y;
    this.x += random(-4, 4);
    this.y += random(-4, 4);
  }

  // The display method handles the visual representation
  display() {
    line(this.x, this.y, this.px, this.py);
  }
}
```

**Key Insight: The `this` Keyword and Scope**
A common error when transitioning to OOP is forgetting to use `this`. If you simply write `x += random(-4, 4)`, the program looks for a global variable named `x`. To modify the property belonging to the specific object, you must use `this.x`.

## Managing Populations with Arrays [09:04]

Once we have a `Walker` blueprint, we can create many "instances" of it. We use an array to store these instances, allowing us to treat a group of walkers as a single entity.

### Creating and Iterating through Agents [09:10]

In the `setup()` function, we use a loop to populate our array with new instances of our class. In the `draw()` function, we iterate through that array to trigger the behavior for every individual walker.

```javascript
let arr = []; // An empty array to hold our walkers

function setup() {
  createCanvas(400, 400);
  background(220);

  // Create 50 individual walker instances
  for (let i = 0; i < 50; i++) {
    arr.push(new Walker());
  }
}

function draw() {
  // Iterate over the array to update and display each walker
  for (let walker of arr) {
    walker.update();
    walker.display();
  }
}
```

The canvas shows a complex, organic composition emerging from the randomness. As each walker moves independently, they create overlapping, branching structures that resemble organic growth or fractal patterns.

## Adding Individual Identity: Color [12:03]

To make the generative art more visually interesting, we can give each walker its own unique color. We do this by adding a `stroke` property to the class constructor.

### Implementing Per-Object Color [12:30]

It is important to distinguish between the p5.js global `stroke()` function and a property stored within our object (e.g., `this.stroke`). We store the color value inside the object so that when we call `display()`, each walker "remembers" its own color.

```javascript
class Walker {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.px = this.x;
    this.py = this.y;
    // Assign a unique random color to this specific instance
    this.stroke = color(random(255), random(255), random(255));
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    this.x += random(-4, 4);
    this.y += random(-4, 4);
  }

  display() {
    // Use the color stored in this specific object
    stroke(this.stroke);
    line(this.x, this.y, this.px, this.py);
  }
}
```

The visual result shifts from a monochromatic black-and-white pattern to a vibrant, chaotic explosion of color. Because each walker carries its own `this.stroke` value, the screen becomes a rich tapestry of overlapping hues.

## Moving Toward Composition [13:29]

Now that we can manage a single `Walker` and an array of walkers, the next level of complexity is **Composition**. Instead of managing a raw array in our main sketch, we can create a "Container Class" (e.g., `Walkers` in the plural) to manage the collection. 

This container class will eventually handle higher-level logic, such as managing color palettes for the entire group, ensuring that while every walker is unique, they all belong to a cohesive visual "family."

# Scaling Complexity with Classes and Container Objects

In generative art, moving from a single procedural element to complex systems requires a shift in how we manage data. By using Object-Oriented Programming (OOP), we can transition from controlling one moving line to managing entire populations of agents, each with its own state but sharing a unified aesthetic.

## The Walker Class: Defining the Individual [14:10]

To move beyond simple procedural code, we define a **Class**. A class acts as a blueprint that defines what every "Walker" knows (its properties) and what it does (its methods).

The `Walker` class maintains its own unique state, such as position and color. By using the `this` keyword, each instance of a Walker remembers its own specific coordinates and color values.

```javascript
class Walker {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.px = this.x; // Previous x for drawing lines
    this.py = this.y; // Previous y for drawing lines
    this.stroke = c;   // The color passed from the container
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    this.x += random(-4, 4);
    this.y += random(-4, 4);
  }

  display() {
    stroke(this.stroke);
    line(this.x, this.y, this.px, this.py);
  }
}
```

## The Walkers Class: Managing Populations [14:30]

As the complexity of a generative system grows, managing hundreds of individual objects manually becomes impossible. We solve this by creating a **Container Class** (e.g., `Walkers`). 

The container class acts as a manager for a collection of objects. It handles two primary responsibilities:
1. **Population Control**: Determining how many walkers exist in the system.
2. **Palette Management**: Defining a shared color "family" so that all walkers look cohesive rather than like random noise.

### Implementing the Container
The container stores a base color (using `r`, `g`, and `b` values) and an array to hold the individual Walker instances.

```javascript
class Walkers {
  constructor(num) {
    this.num = num; // The number of walkers to create
    this.arr = [];  // The array holding the Walker objects
    
    // Generate a single base color for this entire group
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  create() {
    for (let i = 0; i < this.num; i++) {
      // Pass the shared color object to every new Walker
      this.arr.push(new Walker(color(this.r, this.g, this.b)));
    }
  }
}
```

## Debugging and Linking Objects [17:30]

When transitioning from procedural code to OOP, common errors arise regarding **scope** and **object references**.

### Common Pitfalls
*   **Reference Errors**: If you attempt to iterate over `arr` in the global `draw()` function, but `arr` is actually a property of your container class, you will encounter a `ReferenceError`. You must reference it via the instance: `walkers.arr`.
*   **Initialization Errors**: Simply defining a class and its properties isn't enough; you must explicitly instantiate the container using `new Walkers(50)` and then call its internal methods (like `.create()`) to populate the array.
*   **Iteration Errors**: Attempting to iterate over a class instance itself (e.g., `for (let x of walkers)`) will result in a `TypeError: walkers is not iterable`. You must iterate over the specific array stored *inside* that class.

### The Complete Workflow
To see the generative system in action, you must initialize the container and then loop through its internal array within the p5.js `draw()` loop.

```javascript
let walkers;

function setup() {
  createCanvas(400, 400);
  background(220);
  // Initialize the container with 50 walkers
  walkers = new Walkers(50);
  // Populate the container with individual Walker objects
  walkers.create();
}

function draw() {
  // Iterate through the array stored inside the walkers object
  for (let walker of walkers.arr) {
    walker.update();
    walker.display();
  }
}

// ... Walker and Walkers classes as defined above ...
```

When implemented correctly, the canvas displays a dense, textured pattern of overlapping lines. Because every walker receives the same color object from the `Walkers` class, the resulting visual is a unified "family" of colors rather than a chaotic mix.

# Scaling Complexity with Classes and Object-Oriented Programming

This lesson demonstrates how to transition from simple procedural animation to complex, organized generative systems using Object-Oriented Programming (OOP). By moving from a single line of code to encapsulated classes, you can manage hundreds of independent agents while maintaining control over their collective behavior and aesthetic cohesion.

## Managing Populations with Container Classes [20:12]

To move beyond drawing a single line, we use a **Container Class**. This class acts as a manager for a collection of individual objects. Instead of manually creating every walker, the container handles the instantiation and storage of all agents within an array.

When implementing this, ensure you reference the array as a property of the class instance using `this`.

```javascript
class Walkers {
  constructor(num) {
    this.num = num;
    this.arr = []; // The array that holds all Walker instances
    // Define a base color for the entire group
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.create();
  }

  create() {
    for (let i = 0; i < this.num; i++) {
      // Pass the base color to each new Walker
      this.arr.push(new Walker(color(this.r, this.g, this.b)));
    }
  }
}
```

*Note: A common error when starting with OOP is attempting to access `arr` directly. Because the array belongs to the class instance, you must use `this.arr` to avoid a `ReferenceError`.*

## Creating Aesthetic Cohesion through Color Families [21:02]

A common problem in generative art is that random colors can look chaotic and disconnected. To solve this, we use the container class to define a "family" of colors. We pick one base color for the group and then apply slight random variations to each individual agent.

By adding a small offset (e.g., $\pm 20$) to the Red, Green, and Blue channels, each walker maintains a similar tint to its neighbors, creating a cohesive visual palette rather than random noise.

```javascript
create() {
  for (let i = 0; i < this.num; i++) {
    // Apply a slight random "twist" to the base color for each walker
    this.arr.push(new Walker(color(
      this.r + random(-20, 20), 
      this.g + random(-20, 20), 
      this.b + random(-20, 20)
    )));
  }
}
```

The canvas shows the result: instead of a chaotic rainbow, you see organic, branching patterns where all elements share a unified color scheme.

## Adding Visual Complexity with Variable Thickness [22:19]

To increase the visual depth of a piece, we can introduce variation in line weight. By assigning each walker a random `thickness`, the composition gains texture through overlapping strokes of different sizes.

```javascript
class Walker {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.px = this.x;
    this.py = this.y;
    this.thickness = random(2, 10); // Random stroke weight
    this.stroke = c;
  }

  display() {
    strokeWeight(this.thickness);
    stroke(this.stroke);
    line(this.x, this.y, this.px, this.py);
  }
}
```

The visual output shifts from simple lines to a dense, textured pattern of overlapping organic shapes.

## Linking Physical Properties: Step Size and Weight [23:15]

A sophisticated way to create "life" in generative art is to link different physical properties together. Currently, the walkers move by a fixed random amount. However, we can make their movement dependent on their appearance—for example, making thicker lines move more slowly and thinner lines move faster.

We can achieve this by calculating a `stepSize` in the constructor based on the walker's `thickness`.

```javascript
class Walker {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.px = this.x;
    this.py = this.y;
    this.thickness = random(2, 10);
    // A larger thickness results in a smaller stepSize (slower movement)
    this.stepSize = 10 - this.thickness; 
    this.stroke = c;
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    // Use the calculated stepSize instead of a hardcoded value
    this.x += random(-this.stepSize, this.stepSize);
    this.y += random(-this.stepSize, this.stepSize);
  }

  display() {
    strokeWeight(this.thickness);
    stroke(this.stroke);
    line(this.x, this.y, this.px, this.py);
  }
}
```

### The Aesthetic Result
By implementing this logic, the walkers exhibit distinct behaviors:
* **Thick Walkers:** Move with very small steps, drawing dense, concentrated patches of color.
* **Thin Walkers:** Move with larger steps, "zipping" around the canvas and creating lighter, more expansive strokes.

This creates an aesthetic distinction where the visual weight of the line directly dictates its kinetic energy, mimicking organic movement found in nature.

# Scaling Complexity with Classes and Object-Oriented Programming

In generative art, moving from a single procedural line to complex systems requires a shift in how we manage data. By using Object-Oriented Programming (OOP), we can transition from controlling one moving element to managing entire populations of agents, each with its own unique properties and behaviors.

## Managing Agent Populations [26:00]

When working with a single object, procedural code is sufficient. However, to create complex compositions, we often need multiple groups of agents that behave differently or use different color palettes.

To achieve this, we can instantiate multiple "container" classes. Each container holds its own array of individual objects. By looping through these arrays in the `draw()` function, we can manage multiple distinct populations simultaneously.

```javascript
let walkers, walkers2, walkers3;

function setup() {
  createCanvas(400, 400);
  background(220);
  // Initialize three different groups of walkers with unique color palettes
  walkers = new Walkers(50); 
  walkers2 = new Walkers(50);
  walkers3 = new Walkers(50);
}

function draw() {
  // Update and display the first group
  for (let walker of walkers.arr) {
    walker.update();
    walker.display();
  }
  // Update and display the second group
  for (let walker of walkers2.arr) {
    walker.update();
    walker.display();
  }
  // Update and display the third group
  for (let walker of walkers3.arr) {
    walker.update();
    walker.display();
  }
}
```

As seen in the visual output, this approach creates organic variation. Instead of a chaotic mess of random colors, we get distinct "patches" or families of color (e.g., a dominant yellow group and secondary orange/pink groups), which creates much stronger visual composition.

## Linking Physical Properties to Movement [28:00]

To make generative movement feel more organic, we can link an agent's visual properties to its physical behavior. For example, we can make the "weight" of a line (its thickness) inversely proportional to its movement speed.

In the `Walker` class, we can define a `stepSize` that is calculated based on the `thickness`. A thicker line will have a smaller `stepSize`, resulting in slower, more deliberate movements, while thinner lines move more erratically.

```javascript
class Walker {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.px = this.x;
    this.py = this.y;
    // Randomize thickness between 2 and 10
    this.thickness = random(2, 10);
    // Thicker lines move less per step
    this.stepSize = 10 - this.thickness; 
    this.stroke = c;
  }

  update() {
    // Store previous position to draw a continuous line
    this.px = this.x;
    this.py = this.y;
    // Move based on the calculated stepSize
    this.x += random(-this.stepSize, this.stepSize);
    this.y += random(-this.stepSize, this.stepSize);
  }

  display() {
    strokeWeight(this.thickness);
    stroke(this.stroke);
    line(this.x, this.y, this.px, this.py);
  }
}
```

## Implementing Dynamic Color Variation [28:40]

To prevent a generative system from looking static, we can introduce "drift" in the color properties. Instead of a fixed color, we can slightly nudge the color values over time.

### The Challenge: Mutating Color Objects
A common pitfall when working with the p5.js `color` object is attempting to mutate it directly or treating it like a standard JavaScript object (e.g., `this.stroke.r += 1`). The `color` object is a specialized type, and to change its values, you must use specific methods like `setRed()`.

### The Correct Implementation
To change a color property, you must:
1.  Extract the current value (e.g., using `red()`).
2.  Calculate the new value.
3.  Use `.setRed()` to apply that change.
4.  **Crucially**, re-assign the result back to your variable, as these methods return a new color object.

```javascript
update() {
  this.px = this.x;
  this.py = this.y;
  this.x += random(-this.stepSize, this.stepSize);
  this.y += random(-this.stepSize, this.stepSize);

  // 1 in 10 chance to shift the color slightly
  if (random() < 0.1) {
    // Extract current red, add a small random offset, and re-assign the new color object
    this.stroke = this.stroke.setRed(red(this.stroke) + random(-2, 2));
  }
}
```

**Debugging Insight:** If you encounter an error like `Cannot read property of undefined` or `[object Arguments] is not a valid color representation`, it often means you are trying to perform arithmetic directly on the color object itself rather than extracting its numeric components first. Always remember: `color_object.setRed(new_numeric_value)`.

# Scaling Complexity with Classes and Object-Oriented Programming

In generative art, moving from a single procedural animation to complex systems requires a shift in how we organize code. By transitioning from simple scripts to Object-Oriented Programming (OOP), you can manage hundreds of independent agents while maintaining control over their collective behavior and color palettes.

## Implementing the Walker Class [32:30]

To move beyond a single moving line, we create a **Class**—a reusable blueprint that defines what every "Walker" knows (its properties) and does (its methods).

### Defining Properties and Movement
Each Walker object must maintain its own state, such as position ($x$, $y$) and color. A key technique for creating organic movement is linking physical properties: we can make the `stepSize` (how far it moves) inversely proportional to its `thickness`.

```javascript
class Walker {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.px = this.x; // Previous x for drawing lines
    this.py = this.y; // Previous y for drawing lines
    this.thickness = random(2, 10);
    // Thicker lines move in smaller, more deliberate steps
    this.stepSize = 10 - this.thickness; 
    this.stroke = c; // Inherited color from a palette
  }

  update() {
    // Store current position as previous position before moving
    this.px = this.x;
    this.py = this.y;

    // Apply movement with a slight reduction for smoother motion
    this.x += random(-this.stepSize, this.stepSize) / 2;
    this.y += random(-this.stepSize, this.stepSize) / 2;

    // Dynamic Color Shifting
    // We nudge the color slightly during each update to create a "drift"
    if (random(0, 1) < 0.5) {
      this.stroke.setRed(red(this.stroke) + random(-2, 2));
      this.stroke.setGreen(green(this.stroke) + random(-2, 2));
      this.stroke.setBlue(blue(this.stroke) + random(-2, 2));
    }
  }

  display() {
    strokeWeight(this.thickness);
    stroke(this.stroke);
    // Draw a line from the previous position to the current position
    line(this.x, this.y, this.px, this.py);
  }
}
```

### Debugging Common Errors
When working with color objects in p5.js, a common mistake is attempting to assign a method's return value directly back to the property in a way that overwrites the object with a single value.

**Incorrect:**
```javascript
// This causes an error because it replaces the color object with a single number
this.stroke = this.stroke.setRed(red(this.stroke) + random(-2, 2));
```

**Correct:**
The `setRed()` method modifies the existing color object. You simply call it on the property:
```javascript
this.stroke.setRed(red(this.stroke) + random(-2, 2));
```

## Managing Populations with Container Classes [33:07]

A **Container Class** (e.g., `Walkers` plural) acts as a manager for a collection of individual objects. This allows you to treat a group of walkers as a single entity, making it easy to control their collective "uniform" or color palette.

### The Composition Pattern
The container class holds an array of `Walker` instances and defines a shared color scheme. This ensures that even with hundreds of walkers, the composition remains cohesive rather than looking like random noise.

```javascript
class Walkers {
  constructor(num) {
    this.num = num;
    this.arr = [];
    // Define a base palette for this group
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.create();
  }

  create() {
    for (let i = 0; i < this.num; i++) {
      // Pass the group's color to each individual walker
      let c = color(this.r, this.g, this.b);
      this.arr.push(new Walker(c));
    }
  }
}
```

### Orchestrating the Scene [34:00]
In your main `draw()` loop, you no longer need to manage individual walkers. You simply tell the container to update and display its contents.

```javascript
let walkers;

function setup() {
  createCanvas(400, 400);
  background(220);
  // Initialize a group of 50 walkers
  walkers = new Walkers(50);
}

function draw() {
  // Iterate through the array inside the container class
  for (let walker of walkers.arr) {
    walker.update();
    walker.display();
  }
}
```

## Advanced Considerations: Control and Variation [35:00]

### Managing Color Drift
When using `random()` to shift colors, the walkers will eventually "wander" far from their original palette. If you want more controlled, organic color shifts, consider using **Perlin Noise** instead of `random()`. This allows the colors to drift smoothly through a spectrum rather than jumping erratically.

### Scaling Complexity
By increasing the number of walkers in a container (e.g., from 50 to 350), you can transform the visual output from sparse, individual lines into dense, textured organic shapes. This demonstrates how OOP allows you to scale the complexity of a generative system by simply changing a single parameter in your container class.
