# Technical glossary for journalists

Plain-language definitions of technical terms you'll encounter when working with AI coding assistants.

---

## Programming languages

### Python
**In brief:** A beginner-friendly programming language

A programming language designed to be readable and approachable. It reads almost like English and is the most popular choice for data analysis, web scraping, and automation. You write instructions in a text file, then run that file to execute the commands.

### JavaScript
**In brief:** The language that makes web pages interactive

The programming language that runs in web browsers. When you see an interactive chart, a map you can click on, or a form that validates your input—that's JavaScript. It's how you add behavior to web pages.

### R
**In brief:** A language built for statistics

A programming language created by statisticians, for statisticians. It's excellent when you need to run statistical tests, create publication-quality charts, or do academic-style data analysis. Popular in research and data journalism.

### SQL
**In brief:** The language for talking to databases

Stands for "Structured Query Language." It's how you ask questions of databases—things like "show me all donations over $1000" or "count how many records match this criteria." Every major database understands SQL.

### Bash
**In brief:** Commands you type in the terminal

The language of the command line (that black window with text). Bash commands let you rename hundreds of files at once, move things around, or chain tools together. It's built into Mac and Linux; Windows uses PowerShell but the concept is similar.

---

## Tools and libraries

### pandas
**In brief:** Python's spreadsheet superpower

A Python library that lets you work with data like you would in Excel, but with code. You can load CSVs, filter rows, merge files, calculate totals—anything you'd do in a spreadsheet, but automated and repeatable.

### BeautifulSoup
**In brief:** A tool for extracting data from web pages

A Python library that reads HTML (web page code) and lets you pull out specific pieces—like all the links, or a table of data, or specific text. It's called "BeautifulSoup" because it handles messy, imperfect HTML gracefully.

### Playwright
**In brief:** A robot that controls a web browser

A tool that lets your code control a real web browser—clicking buttons, filling forms, waiting for pages to load. Useful when websites require JavaScript to display their content, which simpler scraping tools can't handle.

### D3.js
**In brief:** Professional-grade data visualization

A JavaScript library for creating custom, interactive visualizations. It gives you complete control over every pixel, which means it's powerful but has a steeper learning curve. Most fancy interactive graphics in news stories use D3.

### ggplot2
**In brief:** R's beautiful chart maker

An R package for creating publication-quality charts and graphs. It uses a "grammar of graphics"—you describe what you want (data, axes, colors) and it figures out how to draw it. Produces clean, professional visuals.

### GitHub Copilot
**In brief:** AI that suggests code as you type

An AI tool that integrates into your code editor and suggests completions as you type—like autocomplete on steroids. It can write entire functions based on a comment describing what you want. Costs $10/month.

---

## Core concepts

### Vibe coding
**In brief:** Describe what you want, let AI write the code

A term coined by Andrej Karpathy for a new way of programming: you describe what you want in plain English, and AI writes the code. You're the project manager directing the work, not the programmer writing every line.

### LLM
**In brief:** AI that understands and generates text

Stands for "Large Language Model." These are AI systems (like Claude, ChatGPT, GPT-4) trained on massive amounts of text. They can understand questions, write code, explain concepts, and have conversations. The "large" refers to billions of parameters.

### API
**In brief:** A way for programs to talk to each other

Stands for "Application Programming Interface." It's like a menu at a restaurant—it tells you what you can ask for and how to ask for it. When you want data from Twitter, or weather info, or stock prices, you ask their API.

### Prompt
**In brief:** The instruction you give to an AI

The text you type to tell an AI what you want. A good prompt is specific, includes context, and explains the desired output. "Write me some code" is a weak prompt. "Write a Python script that reads sales.csv and calculates monthly totals" is better.

### Script
**In brief:** A file of code that does a task

A text file containing code that performs a specific task when you run it. Unlike applications with buttons and windows, scripts usually run from the command line, do their job, and finish. Think of it as a recipe the computer follows.

### Library
**In brief:** Pre-written code you can use

A collection of code someone else wrote that you can use in your projects. Instead of writing everything from scratch, you import a library and use its functions. pandas, BeautifulSoup, and D3 are all libraries.

### Debugging
**In brief:** Finding and fixing errors in code

The process of figuring out why code isn't working and fixing it. The term comes from an actual bug (a moth) found in an early computer. Debugging involves reading error messages, testing assumptions, and systematically narrowing down the problem.

### Iteration
**In brief:** Repeating a process to improve it

The cycle of trying something, seeing the result, and trying again with improvements. In vibe coding, you iterate by running code, seeing errors, asking AI for fixes, and repeating until it works. Expect many iterations.

---

## Data formats

### CSV
**In brief:** A simple spreadsheet format

Stands for "Comma-Separated Values." It's the simplest way to store tabular data—just text with commas between columns and line breaks between rows. Every spreadsheet program can open CSVs, and they're easy for code to read.

### JSON
**In brief:** A format for structured data

Stands for "JavaScript Object Notation." It's a way to structure data that both humans and computers can read. APIs typically send data as JSON. It uses curly braces {} and square brackets [] to organize information hierarchically.

---

## Development environment

### Terminal
**In brief:** The text-based command interface

The application where you type commands instead of clicking buttons. On Mac it's called Terminal, on Windows it's Command Prompt or PowerShell. It looks intimidating (black screen, blinking cursor) but it's just another way to tell your computer what to do.

### CLI
**In brief:** Programs you run by typing commands

Stands for "Command Line Interface." It's any program you interact with by typing commands rather than clicking. The opposite of a GUI (Graphical User Interface). Many developer tools are CLI-based.

### IDE
**In brief:** A code editor with extra features

Stands for "Integrated Development Environment." It's a code editor that includes helpful features like error highlighting, autocomplete, and debugging tools. VS Code, PyCharm, and RStudio are popular IDEs.

### VS Code
**In brief:** A popular free code editor

Visual Studio Code—a free code editor made by Microsoft. It's become the most popular editor for many languages because it's fast, customizable, and has thousands of extensions. Good for beginners and experts alike.

### Git
**In brief:** A system for tracking code changes

Version control software that tracks every change you make to your code. It lets you go back to previous versions, see what changed when, and collaborate without overwriting each other's work. GitHub is a website that hosts Git projects.

### Environment
**In brief:** The setup where your code runs

The combination of operating system, installed software, and settings that affect how code runs. "It works on my machine" is a common problem—code might work in one environment but fail in another due to different versions or configurations.

### Dependency
**In brief:** Code your code needs to work

A library or package that your code requires. If your script uses pandas, then pandas is a dependency. Managing dependencies (installing the right versions) is a common source of frustration for beginners.

---

## Automation and workflows

### Web scraping
**In brief:** Automatically extracting data from websites

Using code to visit web pages and pull out specific data—like copying a table, but automated. Instead of manually copying 1000 records, a scraper can do it in seconds. Useful when data exists on the web but isn't downloadable.

### Cron job
**In brief:** A task that runs automatically on schedule

A way to schedule scripts to run at specific times—every hour, every day at midnight, every Monday. Named after the Unix "cron" scheduler. Useful for automation: check for updates, send reports, refresh data.

### Regex
**In brief:** Pattern matching for text

Short for "Regular Expression." A mini-language for describing text patterns—like "find all phone numbers" or "match any email address." Looks cryptic (^[a-z]+@) but extremely powerful for finding and extracting specific text.

### Changelog
**In brief:** A record of what changed and when

A document that records what you modified, when, and why. Essential for remembering what you did, explaining it to others, and debugging when something breaks. The most valuable documentation you can write.

---

## Programming fundamentals

### Function
**In brief:** A reusable block of code

A named block of code that does a specific task. You define it once, then call it whenever you need that task done. Functions take inputs (arguments), do something, and often return an output. They're how you organize and reuse code.

### Variable
**In brief:** A named container for data

A name that refers to a piece of data. Like labeling a box: "total = 100" means "total" now refers to the number 100. You can change what's in the box, use it in calculations, or pass it to functions.

### String
**In brief:** Text data in code

How programmers refer to text. A string is a sequence of characters: "Hello world" is a string. The name comes from "a string of characters." Strings are usually wrapped in quotes to distinguish them from code.

### Boolean
**In brief:** True or false values

A data type with only two possible values: true or false. Named after mathematician George Boole. Used for conditions and logic: "Is this file empty?" returns a boolean. Code often branches based on boolean values.

### Loop
**In brief:** Code that repeats

A structure that runs the same code multiple times. "For each file in this folder, do X" is a loop. Loops let you process thousands of items with a few lines of code instead of writing the same thing over and over.

### Conditional
**In brief:** Code that runs only if something is true

An if/then structure: "If the amount is over 1000, flag it." Conditionals let code make decisions and behave differently based on the data it encounters. Most real programs are full of conditionals.

### Syntax
**In brief:** The grammar rules of a programming language

The rules for how code must be written—where to put parentheses, how to end statements, what words mean what. Syntax errors are like typos: the code won't run because you violated a grammar rule.

### Runtime error
**In brief:** An error that happens when code runs

An error that occurs while your code is executing, not when it's first read. The syntax is correct, but something goes wrong during execution—like trying to divide by zero, or accessing a file that doesn't exist.

---

*Created for the [Center for Cooperative Media](https://centerforcooperativemedia.org) AI Tools Resource Kit*
