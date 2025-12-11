/**
 * Glossary system for CCM AI Tools Resource Kit
 * Provides inline tooltips with plain-english explanations of technical terms
 */

const GLOSSARY = {
  // Programming languages
  "python": {
    term: "Python",
    short: "A beginner-friendly programming language",
    full: "A programming language designed to be readable and approachable. It reads almost like English and is the most popular choice for data analysis, web scraping, and automation. You write instructions in a text file, then run that file to execute the commands."
  },
  "javascript": {
    term: "JavaScript",
    short: "The language that makes web pages interactive",
    full: "The programming language that runs in web browsers. When you see an interactive chart, a map you can click on, or a form that validates your input—that's JavaScript. It's how you add behavior to web pages."
  },
  "r": {
    term: "R",
    short: "A language built for statistics",
    full: "A programming language created by statisticians, for statisticians. It's excellent when you need to run statistical tests, create publication-quality charts, or do academic-style data analysis. Popular in research and data journalism."
  },
  "sql": {
    term: "SQL",
    short: "The language for talking to databases",
    full: "Stands for 'Structured Query Language.' It's how you ask questions of databases—things like 'show me all donations over $1000' or 'count how many records match this criteria.' Every major database understands SQL."
  },
  "bash": {
    term: "Bash",
    short: "Commands you type in the terminal",
    full: "The language of the command line (that black window with text). Bash commands let you rename hundreds of files at once, move things around, or chain tools together. It's built into Mac and Linux; Windows uses PowerShell but the concept is similar."
  },

  // Tools and libraries
  "pandas": {
    term: "pandas",
    short: "Python's spreadsheet superpower",
    full: "A Python library that lets you work with data like you would in Excel, but with code. You can load CSVs, filter rows, merge files, calculate totals—anything you'd do in a spreadsheet, but automated and repeatable."
  },
  "beautifulsoup": {
    term: "BeautifulSoup",
    short: "A tool for extracting data from web pages",
    full: "A Python library that reads HTML (web page code) and lets you pull out specific pieces—like all the links, or a table of data, or specific text. It's called 'BeautifulSoup' because it handles messy, imperfect HTML gracefully."
  },
  "playwright": {
    term: "Playwright",
    short: "A robot that controls a web browser",
    full: "A tool that lets your code control a real web browser—clicking buttons, filling forms, waiting for pages to load. Useful when websites require JavaScript to display their content, which simpler scraping tools can't handle."
  },
  "d3": {
    term: "D3.js",
    short: "Professional-grade data visualization",
    full: "A JavaScript library for creating custom, interactive visualizations. It gives you complete control over every pixel, which means it's powerful but has a steeper learning curve. Most fancy interactive graphics in news stories use D3."
  },
  "ggplot2": {
    term: "ggplot2",
    short: "R's beautiful chart maker",
    full: "An R package for creating publication-quality charts and graphs. It uses a 'grammar of graphics'—you describe what you want (data, axes, colors) and it figures out how to draw it. Produces clean, professional visuals."
  },
  "api": {
    term: "API",
    short: "A way for programs to talk to each other",
    full: "Stands for 'Application Programming Interface.' It's like a menu at a restaurant—it tells you what you can ask for and how to ask for it. When you want data from Twitter, or weather info, or stock prices, you ask their API."
  },
  "github-copilot": {
    term: "GitHub Copilot",
    short: "AI that suggests code as you type",
    full: "An AI tool that integrates into your code editor and suggests completions as you type—like autocomplete on steroids. It can write entire functions based on a comment describing what you want. Costs $10/month."
  },

  // Concepts
  "vibe-coding": {
    term: "Vibe coding",
    short: "Describe what you want, let AI write the code",
    full: "A term coined by Andrej Karpathy for a new way of programming: you describe what you want in plain English, and AI writes the code. You're the project manager directing the work, not the programmer writing every line."
  },
  "llm": {
    term: "LLM",
    short: "AI that understands and generates text",
    full: "Stands for 'Large Language Model.' These are AI systems (like Claude, ChatGPT, GPT-4) trained on massive amounts of text. They can understand questions, write code, explain concepts, and have conversations. The 'large' refers to billions of parameters."
  },
  "prompt": {
    term: "Prompt",
    short: "The instruction you give to an AI",
    full: "The text you type to tell an AI what you want. A good prompt is specific, includes context, and explains the desired output. 'Write me some code' is a weak prompt. 'Write a Python script that reads sales.csv and calculates monthly totals' is better."
  },
  "debugging": {
    term: "Debugging",
    short: "Finding and fixing errors in code",
    full: "The process of figuring out why code isn't working and fixing it. The term comes from an actual bug (a moth) found in an early computer. Debugging involves reading error messages, testing assumptions, and systematically narrowing down the problem."
  },
  "script": {
    term: "Script",
    short: "A file of code that does a task",
    full: "A text file containing code that performs a specific task when you run it. Unlike applications with buttons and windows, scripts usually run from the command line, do their job, and finish. Think of it as a recipe the computer follows."
  },
  "library": {
    term: "Library",
    short: "Pre-written code you can use",
    full: "A collection of code someone else wrote that you can use in your projects. Instead of writing everything from scratch, you import a library and use its functions. pandas, BeautifulSoup, and D3 are all libraries."
  },
  "csv": {
    term: "CSV",
    short: "A simple spreadsheet format",
    full: "Stands for 'Comma-Separated Values.' It's the simplest way to store tabular data—just text with commas between columns and line breaks between rows. Every spreadsheet program can open CSVs, and they're easy for code to read."
  },
  "json": {
    term: "JSON",
    short: "A format for structured data",
    full: "Stands for 'JavaScript Object Notation.' It's a way to structure data that both humans and computers can read. APIs typically send data as JSON. It uses curly braces {} and square brackets [] to organize information hierarchically."
  },
  "terminal": {
    term: "Terminal",
    short: "The text-based command interface",
    full: "The application where you type commands instead of clicking buttons. On Mac it's called Terminal, on Windows it's Command Prompt or PowerShell. It looks intimidating (black screen, blinking cursor) but it's just another way to tell your computer what to do."
  },
  "cli": {
    term: "CLI",
    short: "Programs you run by typing commands",
    full: "Stands for 'Command Line Interface.' It's any program you interact with by typing commands rather than clicking. The opposite of a GUI (Graphical User Interface). Many developer tools are CLI-based."
  },
  "ide": {
    term: "IDE",
    short: "A code editor with extra features",
    full: "Stands for 'Integrated Development Environment.' It's a code editor that includes helpful features like error highlighting, autocomplete, and debugging tools. VS Code, PyCharm, and RStudio are popular IDEs."
  },
  "vs-code": {
    term: "VS Code",
    short: "A popular free code editor",
    full: "Visual Studio Code—a free code editor made by Microsoft. It's become the most popular editor for many languages because it's fast, customizable, and has thousands of extensions. Good for beginners and experts alike."
  },
  "git": {
    term: "Git",
    short: "A system for tracking code changes",
    full: "Version control software that tracks every change you make to your code. It lets you go back to previous versions, see what changed when, and collaborate without overwriting each other's work. GitHub is a website that hosts Git projects."
  },
  "web-scraping": {
    term: "Web scraping",
    short: "Automatically extracting data from websites",
    full: "Using code to visit web pages and pull out specific data—like copying a table, but automated. Instead of manually copying 1000 records, a scraper can do it in seconds. Useful when data exists on the web but isn't downloadable."
  },
  "cron": {
    term: "Cron job",
    short: "A task that runs automatically on schedule",
    full: "A way to schedule scripts to run at specific times—every hour, every day at midnight, every Monday. Named after the Unix 'cron' scheduler. Useful for automation: check for updates, send reports, refresh data."
  },
  "regex": {
    term: "Regex",
    short: "Pattern matching for text",
    full: "Short for 'Regular Expression.' A mini-language for describing text patterns—like 'find all phone numbers' or 'match any email address.' Looks cryptic (^[a-z]+@) but extremely powerful for finding and extracting specific text."
  },
  "environment": {
    term: "Environment",
    short: "The setup where your code runs",
    full: "The combination of operating system, installed software, and settings that affect how code runs. 'It works on my machine' is a common problem—code might work in one environment but fail in another due to different versions or configurations."
  },
  "dependency": {
    term: "Dependency",
    short: "Code your code needs to work",
    full: "A library or package that your code requires. If your script uses pandas, then pandas is a dependency. Managing dependencies (installing the right versions) is a common source of frustration for beginners."
  },
  "changelog": {
    term: "Changelog",
    short: "A record of what changed and when",
    full: "A document that records what you modified, when, and why. Essential for remembering what you did, explaining it to others, and debugging when something breaks. The most valuable documentation you can write."
  },
  "iteration": {
    term: "Iteration",
    short: "Repeating a process to improve it",
    full: "The cycle of trying something, seeing the result, and trying again with improvements. In vibe coding, you iterate by running code, seeing errors, asking AI for fixes, and repeating until it works. Expect many iterations."
  },
  "syntax": {
    term: "Syntax",
    short: "The grammar rules of a programming language",
    full: "The rules for how code must be written—where to put parentheses, how to end statements, what words mean what. Syntax errors are like typos: the code won't run because you violated a grammar rule."
  },
  "runtime-error": {
    term: "Runtime error",
    short: "An error that happens when code runs",
    full: "An error that occurs while your code is executing, not when it's first read. The syntax is correct, but something goes wrong during execution—like trying to divide by zero, or accessing a file that doesn't exist."
  },
  "function": {
    term: "Function",
    short: "A reusable block of code",
    full: "A named block of code that does a specific task. You define it once, then call it whenever you need that task done. Functions take inputs (arguments), do something, and often return an output. They're how you organize and reuse code."
  },
  "variable": {
    term: "Variable",
    short: "A named container for data",
    full: "A name that refers to a piece of data. Like labeling a box: 'total = 100' means 'total' now refers to the number 100. You can change what's in the box, use it in calculations, or pass it to functions."
  },
  "string": {
    term: "String",
    short: "Text data in code",
    full: "How programmers refer to text. A string is a sequence of characters: 'Hello world' is a string. The name comes from 'a string of characters.' Strings are usually wrapped in quotes to distinguish them from code."
  },
  "boolean": {
    term: "Boolean",
    short: "True or false values",
    full: "A data type with only two possible values: true or false. Named after mathematician George Boole. Used for conditions and logic: 'Is this file empty?' returns a boolean. Code often branches based on boolean values."
  },
  "loop": {
    term: "Loop",
    short: "Code that repeats",
    full: "A structure that runs the same code multiple times. 'For each file in this folder, do X' is a loop. Loops let you process thousands of items with a few lines of code instead of writing the same thing over and over."
  },
  "conditional": {
    term: "Conditional",
    short: "Code that runs only if something is true",
    full: "An if/then structure: 'If the amount is over 1000, flag it.' Conditionals let code make decisions and behave differently based on the data it encounters. Most real programs are full of conditionals."
  }
};

/**
 * Initialize glossary tooltips on the page
 * Looks for <span class="term" data-term="key"> elements
 */
function initGlossary() {
  // Create tooltip container
  const tooltip = document.createElement('div');
  tooltip.className = 'glossary-tooltip';
  tooltip.innerHTML = `
    <div class="tooltip-header">
      <span class="tooltip-term"></span>
      <span class="tooltip-close">&times;</span>
    </div>
    <div class="tooltip-short"></div>
    <div class="tooltip-full"></div>
  `;
  document.body.appendChild(tooltip);

  const tooltipTerm = tooltip.querySelector('.tooltip-term');
  const tooltipShort = tooltip.querySelector('.tooltip-short');
  const tooltipFull = tooltip.querySelector('.tooltip-full');
  const tooltipClose = tooltip.querySelector('.tooltip-close');

  let activeElement = null;
  let isExpanded = false;

  // Close tooltip
  function hideTooltip() {
    tooltip.classList.remove('visible', 'expanded');
    if (activeElement) {
      activeElement.classList.remove('active');
      activeElement = null;
    }
    isExpanded = false;
  }

  // Show tooltip
  function showTooltip(element, termKey) {
    const entry = GLOSSARY[termKey];
    if (!entry) return;

    // Update content
    tooltipTerm.textContent = entry.term;
    tooltipShort.textContent = entry.short;
    tooltipFull.textContent = entry.full;

    // Position tooltip
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Position below the term by default
    let top = rect.bottom + scrollTop + 8;
    let left = rect.left + scrollLeft;

    // Adjust if tooltip would go off-screen
    tooltip.classList.add('visible');
    const tooltipRect = tooltip.getBoundingClientRect();

    if (left + tooltipRect.width > window.innerWidth - 20) {
      left = window.innerWidth - tooltipRect.width - 20;
    }
    if (left < 20) left = 20;

    // If tooltip would go below viewport, show above
    if (top + tooltipRect.height > scrollTop + window.innerHeight - 20) {
      top = rect.top + scrollTop - tooltipRect.height - 8;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    // Track active element
    if (activeElement) activeElement.classList.remove('active');
    activeElement = element;
    element.classList.add('active');
    isExpanded = false;
    tooltip.classList.remove('expanded');
  }

  // Expand tooltip to show full definition
  function expandTooltip() {
    if (!isExpanded) {
      tooltip.classList.add('expanded');
      isExpanded = true;
    }
  }

  // Event listeners for term elements
  document.querySelectorAll('.term[data-term]').forEach(element => {
    const termKey = element.dataset.term;

    // Desktop: hover to show, click to expand
    element.addEventListener('mouseenter', () => showTooltip(element, termKey));
    element.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeElement === element && tooltip.classList.contains('visible')) {
        expandTooltip();
      } else {
        showTooltip(element, termKey);
      }
    });

    // Touch: tap to show, tap again to expand
    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (activeElement === element && tooltip.classList.contains('visible')) {
        expandTooltip();
      } else {
        showTooltip(element, termKey);
      }
    });
  });

  // Close tooltip when clicking outside
  document.addEventListener('click', (e) => {
    if (!tooltip.contains(e.target) && !e.target.classList.contains('term')) {
      hideTooltip();
    }
  });

  // Close button
  tooltipClose.addEventListener('click', hideTooltip);

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
  });

  // Hide on scroll (optional, can be removed)
  // document.addEventListener('scroll', hideTooltip);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlossary);
} else {
  initGlossary();
}
