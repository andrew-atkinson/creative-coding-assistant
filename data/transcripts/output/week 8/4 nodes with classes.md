---
video_id: 4-nodes-with-classes
video_title: 4 nodes with classes
video_file: 4 nodes with classes.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 8/4 nodes with classes.mp4"
week: week 8
module: Module 3 - Generation and Life
topic: Using Object-Oriented Programming to create emergent networks of interacting nodes
concepts:
  - Node Class (Autonomous Agents)
  - Constructor
  - Boundary Collision Logic
  - Passing Arrays to Methods
  - Emergent Geometry
prerequisites:
  - p5.js basics (random, dist, circle)
  - Basic JavaScript syntax
  - For loops and arrays
  - Conditional statements (if/else)
leads_to:
  - Flocking algorithms
  - Physics engines
  - Complex emergent systems
---
# Using Classes to Generate Emergent Networks

In generative art, we often move beyond treating objects as standalone entities. Instead of thinking about a single "bouncing ball," we can rethink individual points as vertices that occupy space. When these points interact based on proximity, they form emergent structures—like meshes, polygons, or constellations—that appear to move and evolve chaotically.

## Defining the Node Class [01:12]

To create a system of interacting points, we first need to define what an individual point (or "node") is. We use a JavaScript `class` to encapsulate the properties and behaviors of each node.

### The Constructor [01:34]
The `constructor` is a special function used to initialize a new object with specific characteristics. For our nodes, we want each one to have a random starting position, a random movement speed, and a specific color.

```javascript
class Node {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    // We use a multiplier to give the speed a random direction (positive or negative)
    this.xSpeed = random(-1.5, 1.5);
    this.ySpeed = random(-1.5, 1.5);
    this.color = c;
  }
}
```

### Implementing Movement and Boundary Logic [03:29]
A **method** is a function that lives inside a class and defines what an object can *do*. To make the nodes move, we create a `move()` method. 

To keep the nodes on the screen, we check if their position has exceeded the canvas boundaries (0 or the width/height). If it has, we multiply the speed by `-1` to reverse its direction. We then update the position by adding the current speed to the coordinate.

```javascript
  move() {
    // Check horizontal boundaries
    if (this.x < 0 || this.x > width) {
      this.xSpeed *= -1;
    }
    this.x += this.xSpeed;

    // Check vertical boundaries
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }
    this.y += this.ySpeed;
  }
```

## Managing a Collection of Nodes [06:11]

Once the class is defined, we need to create many instances of it. We do this by creating an array and using a loop within the `setup()` function to populate it.

```javascript
let nodes = []; // An empty array to hold our Node objects

function setup() {
  createCanvas(400, 400);
  // Populate the array with 50 nodes
  for (let i = 0; i < 50; i++) {
    // We pass a random grayscale value as the color parameter 'c'
    nodes.push(new Node(random(255)));
  }
}

function draw() {
  background(0); // Black background for high contrast
  
  // Update and display each node in the array
  for (let n of nodes) {
    n.move();
    // For debugging, we can draw a simple circle at the node's position
    circle(n.x, n.y, 10);
  }
}
```

### The Logic of Emergence
In the code above, each node is an autonomous agent. It knows its own position and speed, but it has no awareness of the other nodes in the array. 

To move from simple moving points to an emergent network, we must implement logic where one node "looks" at the entire array of nodes to check for proximity. This transition from **individual behavior** to **collective interaction** is what allows simple rules (like "if I am close to another point, draw a line") to create complex, organic visual patterns.

# Using Classes to Generate Emergent Networks

In this lesson, we transition from treating objects as standalone entities to treating them as points in space that interact with one another. By using Object-Oriented Programming (OOP), we can create emergent structures—like meshes or constellations—where simple individual rules result in complex collective behavior.

## Defining the Node Class [07:30]

To create a system of interacting points, we first need to define what an individual "agent" or `Node` is. We use a class to encapsulate the properties and behaviors of each point.

### The Constructor
The `constructor` initializes a new instance of a node with unique properties: position, velocity (speed), and color.

```javascript
class Node {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.xSpeed = random(-1.5, 1.5);
    this.ySpeed = random(-1.5, 1.5);
    this.color = c;
  }
}
```

### Movement and Boundary Collision [07:58]
Each node needs a `move()` method to update its position every frame. To keep the nodes within the canvas, we check if their coordinates exceed the `width` or `height`. If they do, we multiply the speed by `-1` to reverse the direction, creating a "bouncing" effect.

```javascript
move() {
  // Handle horizontal boundaries
  if (this.x < 0 || this.x > width) {
    this.xSpeed *= -1;
  }
  this.x += this.xSpeed;

  // Handle vertical boundaries
  if (this.y < 0 || this.y > height) {
    this.ySpeed *= -1;
  }
  this.y += this.ySpeed;

  // Draw the node
  fill(this.color);
  circle(this.x, this.y, 10);
}
```

The preview area shows several small dots bouncing around a black background. Each dot is an independent instance of the `Node` class, managing its own state.

## Managing the Animation Loop [08:13]

To give ourselves control over the simulation, we can implement a helper function to toggle the animation on and off using `mouseClicked()`.

```javascript
function mouseClicked() {
  if (isLooping()) {
    noLoop(); // Stop the draw loop
  } else {
    loop();   // Restart the draw loop
  }
}
```

## Creating Interactivity: The Proximity Problem [09:01]

The goal is to draw lines between nodes that are close to each other. However, a standard node is "unaware" of the existence of other nodes; it only knows its own `x` and `y` coordinates.

### The Complexity of Interaction [10:01]
When we want nodes to interact, we face a computational challenge. If every node must check its distance against every other node in the system, the number of calculations grows exponentially (specifically, it is $O(n^2)$). If you add 10 more nodes, you aren't just adding 10 calculations; you are adding 100 potential interactions because every node must check against every other node.

### Passing the Array to a Method [10:48]
To solve this, we create a method that accepts the entire array of nodes as an argument. This allows the individual node to "look" at the rest of the system.

```javascript
drawLines(nodes) {
  for (let n of nodes) {
    // Logic for interaction goes here
  }
}
```

## Implementing Proximity-Based Lines [12:00]

Inside the `drawLines` method, we iterate through the provided array. For every node in that array, we calculate the distance between "this" node (the one running the method) and the current node in the loop (`n`).

### The Distance Calculation
We use the `dist()` function, which requires two pairs of coordinates: $(x_1, y_1)$ and $(x_2, y_2)$. 
* The first pair is `this.x` and `this.y` (the current node).
* The second pair is `n.x` and `n.y` (the node we are checking against).

```javascript
drawLines(nodes) {
  for (let n of nodes) {
    // Calculate distance between 'this' node and node 'n'
    let d = dist(this.x, this.y, n.x, n.y);

    // If they are within 70 pixels, draw a connection
    if (d < 70) {
      stroke(255); // Set line color to white
      line(this.x, this.y, n.x, n.y);
    }
  }
}
```

By applying this logic, the individual dots no longer just bounce chaotically; they form a dynamic, shifting mesh of lines whenever they pass near one another.

## Creating Emergent Networks with Classes

In this lesson, we transition from treating objects as standalone entities to treating them as interconnected points in space. By using Object-Oriented Programming (OOP), we can create a system where individual "nodes" interact with one another to form emergent structures like meshes, polygons, and constellations.

## Implementing Relational Logic [13:03]

To create a network, an individual object must be aware of its neighbors. We achieve this by creating a method within the `Node` class that accepts an array of all existing nodes as a parameter. This allows each node to iterate through the list and check its proximity to every other node in the system.

### The `drawLines` Method
The following method is added to the `Node` class. It uses a loop to check the distance between the current node (`this`) and every other node (`n`) in the provided array.

```javascript
drawLines(nodes) {
  for (let n of nodes) {
    // Calculate distance between this node and the current neighbor in the loop
    let d = dist(this.x, this.y, n.x, n.y);
    
    // If the nodes are within a certain proximity threshold (e.g., 70 pixels)
    if (d < 70 && d > 2) {
      stroke(this.color); // Use the node's own color for the connection
      line(this.x, this.y, n.x, n.y);
    }
  }
}
```

**Key Technical Insights:**
* **The Proximity Threshold:** We use `d < 70` to determine when a connection should be drawn. The addition of `d > 2` is a practical safeguard to prevent the node from drawing a line to itself, which can cause visual artifacts.
* **Passing the Array:** When calling this method in the main `draw()` loop, you must pass the entire array of nodes into the method: `n.drawLines(nodes);`.

### Visualizing Emergence
When this logic is applied, the preview window transforms from a collection of scattered dots into an evolving "constellation." As nodes move, the lines connect and disconnect based on their proximity, creating a chaotic yet smooth geometric mesh.

## Enhancing Aesthetics with Transparency and Motion [14:30]

We can manipulate the visual properties of the system to create more atmospheric effects. 

1.  **Ghosting Effects:** By setting a low alpha value in the `background()` function, such as `background(0, 90);`, we create a "trail" or "ghosting" effect where previous frames linger slightly on the screen.
2.  **Dynamic Canvas:** Using `createCanvas(windowWidth, windowHeight);` ensures the generative system fills the entire browser window.

## Generating Complex Polygons [16:00]

Beyond simple lines, we can use the same proximity logic to draw translucent shapes. This is done by using `beginShape()` and `endShape()`, adding vertices only when a neighbor falls within a specific distance range.

### The `drawShapes` Method
This method creates a polygon by starting at the current node, looping through neighbors to add vertices if they are within range, and then closing the shape.

```javascript
drawShapes(nodes) {
  noStroke(); // Shapes should be filled, not outlined
  fill(this.color); 
  // Note: To make the shape translucent, you would adjust the alpha of this.color
  
  beginShape();
  vertex(this.x, this.y); // Start the shape at the current node's position

  for (let n of nodes) {
    let d = dist(this.x, this.y, n.x, n.y);
    // Only add a vertex if the neighbor is within a specific "sweet spot" range
    if (d < 150 && d > 70) {
      vertex(n.x, n.y);
    }
  }

  vertex(this.x, this.y); // Close the shape by returning to the start
  endShape();
}
```

### Debugging Common Pitfalls [19:00]
When implementing complex methods like `drawShapes`, it is easy to encounter issues where nothing appears on the screen. Common causes include:
* **Forgetting to call the method:** Even if the logic inside the class is perfect, you must explicitly call `n.drawShapes(nodes);` within your main `draw()` loop.
* **Alpha/Transparency issues:** If the alpha value is too low (e.g., `4`), the shape may be nearly invisible against a dark background.
* **Vertex Logic:** A shape requires at least three vertices to be visible as a polygon; if the proximity threshold is too restrictive, you may only be drawing points or lines rather than filled areas.

# Using Classes to Generate Emergent Networks

In this lesson, we explore how Object-Oriented Programming (OOP) can be used to create complex, generative patterns. Rather than treating objects as standalone entities, we will learn how to treat them as points in space that interact with one another to form emergent structures like meshes and polygons.

## Defining the Node Class [19:30]

To create a system of interacting points, we first need to define what an individual "agent" or `Node` is. A class allows us to encapsulate both the data (position, velocity, color) and the behavior (`move`, `draw`) of each point.

```javascript
class Node {
  constructor(c) {
    this.x = random(width);
    this.y = random(height);
    this.xSpeed = random(-1.5, 1.5);
    this.ySpeed = random(-1.5, 1.5);
    this.color = c; // The color passed in during instantiation
  }

  move() {
    // Boundary collision logic: reverse direction if hitting edges
    if (this.x < 0 || this.x > width) {
      this.xSpeed *= -1;
    }

    this.x += this.xSpeed;

    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }

    this.y += this.ySpeed;
  }
```

## Troubleshooting Data Types: Objects vs. Numbers [20:00]

When attempting to manipulate the visual properties of a class instance, you may encounter errors if the data types do not match what the function expects.

The instructor demonstrates a common error: attempting to call `.setAlpha()` on a variable that is just a number rather than a p5.js `color` object.

**The Error:**
`TypeError: this.color.setAlpha is not a function`

**The Cause:**
If you initialize your nodes by passing a random number (e.g., `new Node(random(255))`), the property `this.color` becomes a number. The `.setAlpha()` method only exists on objects created via the `color()` function.

**The Solution:**
Ensure you pass a proper color object into the constructor:

```javascript
// Instead of passing a single number...
let r = random(255);
let g = random(255);
let b = random(255);

// ...pass a color object created from those numbers
nodes.push(new Node(color(r, g, b)));
```

## Creating Emergent Geometry [21:04]

Once the nodes are correctly initialized with color objects, we can implement methods that allow them to interact. We use two primary methods: `drawLines()` for connections and `drawShapes()` for creating polygons.

### Drawing Connections (The "Constellation" Effect)
By passing the entire array of `nodes` into a node's method, an individual node can "look" at every other node in the system to check for proximity.

```javascript
drawLines(nodes) {
  stroke(this.color);
  noFill();
  for (let n of nodes) {
    // Calculate distance between this node and another node 'n'
    let d = dist(this.x, this.y, n.x, n.y);
    // If they are close enough (but not overlapping), draw a line
    if (d < 70 && d > 2) {
      line(this.x, this.y, n.x, n.y);
    }
  }
}
```

### Drawing Polygons (The "Ghost" Shapes)
To create more substantial visual weight, we can use `beginShape()` and `endShape()`. By iterating through the nodes and adding vertices only when they are within a certain distance, we create translucent polygons that appear where clusters of nodes meet.

```javascript
drawShapes(nodes) {
  noStroke();
  this.color.setAlpha(10); // Set low alpha for a "ghostly" effect
  fill(this.color);
  
  beginShape();
  vertex(this.x, this.y); // Start the shape at the node's position
  for (let n of nodes) {
    let d = dist(this.x, this.y, n.x, n.y);
    if (d < 100) {
      vertex(n.x, n.y); // Add a vertex for every nearby node
    }
  }
  vertex(this.x, this.y); // Close the shape back at the start
  endShape();
}
```

**Technical Insight:** When using `setAlpha()`, it is important to call the method *before* applying the color with `fill()` or `stroke()`. If you change the alpha after drawing, it won't affect what was already rendered to the canvas.

## Adding Interactive Complexity [23:04]

We can increase the complexity of the system by introducing external variables, such as the mouse position. By checking the distance between a node and the `mouseX/Y` coordinates, we can make the emergent shapes "follow" or react to the user.

```javascript
drawShapes(nodes) {
  noStroke();
  this.color.setAlpha(10);
  fill(this.color);
  beginShape();
  vertex(this.x, this.y);
  for (let n of nodes) {
    let d = dist(this.x, this.y, n.x, n.y);
    let mouseD = dist(mouseX, mouseY, n.x, n.y); // Distance to mouse
    
    // Only draw the vertex if it's near another node AND near the mouse
    if (d < 150 && mouseD < 250) {
      vertex(n.x, n.y);
    }
  }
  vertex(this.x, this.y);
  endShape();
}
```

This creates a dynamic relationship where the "life" of the pattern is influenced by user movement, adding an aesthetic layer of interaction to the generative system.

## Scaling and Color Palettes [24:30]

To move from a simple pattern to a dense, complex network, we can increase the number of nodes and use related color palettes. Instead of completely random colors for every node, we can create "families" of nodes by using mathematical relationships between R, G, and B values.

```javascript
// Create three distinct "families" of nodes with related palettes
for (let i = 0; i < 50; i++) {
  nodes.push(new Node(color(r, g, b))); // Original palette
}
for (let i = 0; i < 50; i++) {
  nodes.push(new Node(color(b, r, g))); // Swapped palette
}
for (let i = 0; i < 50; i++) {
  nodes.push(new Node(color(r/2, g, b+50))); // Modified palette
}
```

By increasing the node count (e.g., to 150) and using these coordinated color schemes, the system produces a much richer, more intentional aesthetic where colors blend and intersect in structured ways.

# Using Classes to Generate Emergent Networks

In this lesson, we explore how Object-Oriented Programming (OOP) can be used to move beyond treating objects as standalone entities. Instead, we will learn how to treat them as points in space that interact with one another to form emergent structures, such as meshes and polygons.

## Creating Interactive Geometry [25:30]

To create complex visual patterns, we can use a class method to draw shapes based on the proximity of other objects. By using `beginShape()` and `vertex()`, we can connect a node to its neighbors, creating a "constellation" effect.

The following code demonstrates how to implement a `drawShapes` method within a class. This method accepts an array of all existing nodes, allowing the current node to "look" at its neighbors and decide whether to form a connection.

```javascript
function drawShapes(nodes) {
  noStroke();
  this.color.setAlpha(10); // Low alpha for subtle, layered effects
  fill(this.color);
  
  beginShape();
  vertex(this.x, this.y); // Start the shape at the current node's position
  
  for (let n of nodes) {
    // Calculate distance between this node and another node in the array
    let d = dist(this.x, this.y, n.x, n.y);
    // Calculate distance between the mouse and the other node
    let mouseD = dist(mouseX, mouseY, n.x, n.y);
    
    // Only create a vertex if the node is close to the mouse
    if (mouseD < 50) {
      vertex(n.x, n.y);
    }
  }
  
  endShape();
}
```

### Refining the Interaction Logic [26:05]

When drawing shapes, we must be careful about how we use distance checks. If we only check the distance between nodes (`d`), the shape will be purely based on proximity. However, by adding a secondary check for `mouseD` (the distance to the mouse), we can make the geometry "react" to user input.

The instructor demonstrates that by adjusting these thresholds, we can control the "chaos" of the system. For example, adding a condition like `if (mouseD < 50 && d < 150)` ensures that vertices are only added when the mouse is nearby **and** the target node is within a specific range of the current node. This prevents the shape from becoming an overly complex, messy polygon and instead creates localized, interesting geometric clusters.

The visual result of this logic is an abstract, evolving image where thin, glowing lines form interconnected polygonal shapes and starburst-like structures that react as the mouse moves across the canvas.

## The Power of Passing Arrays to Methods [28:09]

A key insight in this workflow is how we handle data within a class. Rather than creating a global list of nodes that every object must reference, we can pass the entire array into the class methods themselves.

```javascript
drawLines(nodes) {
  this.color.setAlpha(255);
  stroke(this.color);
  noFill();
  for (let n of nodes) {
    let d = dist(this.x, this.y, n.x, n.y);
    if (d < 50 && d > 2) {
      line(this.x, this.y, n.x, n.y);
    }
  }
}
```

### Key Takeaways for OOP in Generative Art

* **Nodes as Points, not just Objects**: Instead of thinking about a `Node` class as a "thing" that exists in isolation, think of it as a point in space. The true complexity arises from the **relationships** between these points.
* **Encapsulation and Communication**: By passing the `nodes` array into a method like `drawLines(nodes)`, you are essentially telling the object: *"Here is the entire world; look through it and find your neighbors."* This allows for emergent behavior without needing to hard-code every possible interaction.
* **Parameterization**: Adding parameters to class methods allows you to inject external data (like the mouse position or a list of other agents) into the object's internal logic, enabling highly interactive and reactive generative systems.
