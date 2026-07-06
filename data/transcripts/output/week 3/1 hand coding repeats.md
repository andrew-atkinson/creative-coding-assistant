---
video_id: 1-hand-coding-repeats
video_title: 1 hand coding repeats
video_file: 1 hand coding repeats.mp4
video_url: "https://aacontent.b-cdn.net/classes/creativeCode/week%203%2F1%20hand%20coding%20repeats.mp4"
week: week 3
topic: The inefficiency of manual code duplication for creating repetitive patterns and the motivation for using loops.
concepts:
  - manual code duplication
  - algorithmic repetition
prerequisites:
  - basic processing syntax
  - ellipse() function
  - coordinate system (X and Y)
  - fill() function
leads_to:
  - for loops
  - nested loops
  - automated pattern generation
---
# The Problem with Manual Repetition

In generative art and design, we often want to create patterns—such as a line of circles or a grid of shapes. While it is possible to achieve these patterns by manually writing out every single shape, this approach is inefficient and prone to error. This video explores the limitations of manual coding and sets the stage for using loops to automate repetitive tasks.

## The Manual Approach: Hardcoding Coordinates [00:48]

A common way to start creating a pattern is to draw one shape and then copy, paste, and modify the code for every subsequent shape. 

To create a simple line of red circles, you might start with a single `ellipse()` function:

```java
size(400, 400);
fill(255, 0, 0); // Red
ellipse(20, 20, 20, 20);
```

To create a line of circles spaced evenly apart, you might manually increment the X-coordinate for every new circle:

```java
size(400, 400);
fill(255, 0, 0); // Red

ellipse(20, 20, 20, 20);
ellipse(40, 20, 20, 20);
ellipse(60, 20, 20, 20);
ellipse(80, 20, 20, 20);
ellipse(100, 20, 20, 20);
// ... and so on
```

While this works for a small number of shapes, it quickly becomes problematic. In the example above, creating just 18 circles requires 18 lines of code to accomplish what is essentially a single visual concept: a line of dots.

## The Limitations of Manual Coding [02:31]

The primary issue with manual repetition is that it lacks **flexibility**. When you hardcode every coordinate, any small change to the design requires a massive amount of manual editing.

### 1. Lack of Scalability
If you decide to move the entire line of circles down by 20 pixels, you cannot simply change one value. You must manually update the Y-coordinate in every single line of code:

```java
// To move the line down, you must edit EVERY line:
ellipse(20, 40, 20, 20);  // Changed from 20 to 40
ellipse(40, 40, 20, 20);  // Changed from 20 to 40
ellipse(60, 40, 20, 20);  // Changed from 20 to 40
// ... etc.
```

### 2. Difficulty with Parameter Changes
If you change the radius of the circles, the spacing between them must also change to maintain a clean pattern. If you increase the radius from 20 to 30, your previous X-coordinates (which were incrementing by 20) will now cause the circles to overlap or leave uneven gaps. You would then have to recalculate and manually re-type every single coordinate:

```java
// New spacing required for larger circles
ellipse(20, 40, 30, 30);
ellipse(50, 40, 30, 30);
ellipse(80, 40, 30, 30);
// ... etc.
```

### 3. Human Error and "Code Bloat"
As the sketch grows, manual coding leads to several issues:
* **Typos:** Manually typing dozens of numbers increases the likelihood of mathematical errors.
* **Code Bloat:** You end up writing a massive amount of code to perform a very simple task.
* **Maintenance:** The sketch becomes difficult to read and manage, making it nearly impossible to experiment with the design in real-time.

## Moving Toward Automation [04:56]

The goal of programming in a creative context is to let the computer do the "labor" of calculating coordinates. Instead of manually defining every position, we need a way to tell the computer: *"Draw a circle at this starting point, and repeat it $X$ times, moving the position by $Y$ amount each time."*

This concept is known as **algorithmic repetition**, and it is solved using **`for` loops**.
