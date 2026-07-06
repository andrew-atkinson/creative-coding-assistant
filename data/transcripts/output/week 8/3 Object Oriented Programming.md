---
video_id: 3-object-oriented-programming
video_title: 3 Object Oriented Programming
video_file: 3 Object Oriented Programming.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week 8/3 Object Oriented Programming.mp4"
week: week 8
module: Module 3 - Generation and Life
topic: "An overview of programming paradigms, specifically comparing Imperative, Event-Driven, and Object-Oriented Programming to provide a mental framework for using classes."
concepts:
  - Imperative Programming
  - Event-Driven Programming
  - Object-Oriented Programming (OOP)
  - Classes (as Blueprints)
  - Properties and Methods
prerequisites:
  - Basic variable declaration
  - Functions
  - Objects
  - Arrays of objects
leads_to:
  - Implementing Classes (syntax)
  - Managing Multiple Objects
  - Nodes with classes
  - Disks/Walkers with classes
---
# Understanding Programming Paradigms: Transitioning to Object-Oriented Programming

As we progress from writing simple scripts to building complex digital systems, our approach to coding must evolve. To move beyond basic instructions and toward scalable architecture, it is essential to understand the different programming paradigms that govern how code executes.

## The Evolution of Control Flow [00:30]

Programming paradigms are different styles or "philosophies" of writing code. Throughout this course, we have transitioned through three primary ways of managing how a program behaves.

### Imperative Programming
We began our journey with the **Imperative** paradigm. In this style, you write a specific sequence of instructions that the computer follows from top to bottom. You are explicitly describing *how* to do things step-by-step.

In an imperative script, the control flow is linear:
1. Set a background color.
2. Draw an ellipse at coordinate X.
3. Draw another ellipse at coordinate Y.

Even when using loops, the logic remains top-to-bottom; a loop simply repeats that linear sequence multiple times. In this paradigm, we often manage state using specific variables declared at the top of the code (e.g., `let x = 10;`) to control the execution of the script.

### Event-Driven Programming
As we introduced interactivity, we moved into **Event-Driven** programming. In this paradigm, the linear flow of the program is interrupted by external actions—events occurring outside the program's immediate instructions.

For example, when you use a function like `mousePressed`, the program is no longer just following a top-to-bottom list of commands. Instead, it waits for an external trigger (the user clicking the mouse) to jump into a specific block of code, changing the direction and behavior of the program.

## The Shift to Object-Oriented Programming [01:36]

The current stage of our development is moving into **Object-Oriented Programming (OOP)**. This paradigm represents a significant shift in mental models: we are moving away from managing individual lines of code and toward building modular components.

### The Role of Classes
In OOP, **Classes** become the center of the program. A class acts as a blueprint or a template that defines what an object is and what it can do. 

To understand this, consider a real-world analogy of a **Vehicle**:
* **Properties (Data):** These are the characteristics defined within the class, such as a vehicle's `color`, its `brand`, or the number of `seats` it has.
* **Methods (Actions):** These are the abilities or behaviors defined within the class, such as the ability to `accelerate`, `brake`, or `turn`.

### Why OOP Matters for Creative Coding
The power of Object-Oriented Programming lies in its ability to "release us from the small things." Instead of manually writing instructions for every single shape or entity on a screen, we define a Class (the blueprint) and then create multiple objects from it. 

This allows us to build complex, scalable components that we can then expand upon. Rather than managing a thousand individual variables for a thousand different shapes, we manage a few classes that can generate those objects automatically.

### JavaScript and Multiple Paradigms
It is important to note that most modern programming languages, including JavaScript, are not limited to just one style. JavaScript is a combination of these paradigms; it can be imperative, event-driven, and object-oriented all at once. When you encounter the term "Object-Oriented Programming," remember that it is fundamentally about using **Classes** to define the structure and behavior of **Objects**.
