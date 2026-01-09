/**
 * Vibe Coder Glossary Data
 * Plain-english definitions for technical terms beginners encounter
 */

const VIBE_GLOSSARY = {
  // ===== Development Environment =====
  "env-variables": {
    term: ".env / Environment Variables",
    category: "Development Environment",
    short: "Secret settings stored outside your code",
    full: "Environment variables are configuration values (like API keys, passwords, database URLs) stored separately from your code. A .env file holds these locally. This keeps secrets out of your codebase—you never commit .env files to Git. Different environments (development, production) can have different values."
  },
  "localhost": {
    term: "localhost",
    category: "Development Environment",
    short: "Your computer pretending to be a web server",
    full: "When you run a website locally for testing, it's served at 'localhost' (usually localhost:3000 or localhost:8000). It's your machine talking to itself. Only you can see it—it's not on the internet. The number after the colon is the port, like different doors into the same building."
  },
  "npm": {
    term: "npm (Node Package Manager)",
    category: "Development Environment",
    short: "The app store for JavaScript code",
    full: "npm is how you download and manage JavaScript libraries. Instead of copying code files manually, you run 'npm install package-name' and it downloads everything you need. It also tracks versions so everyone on a project uses the same code. It comes installed with Node.js."
  },
  "node-modules": {
    term: "node_modules",
    category: "Development Environment",
    short: "The folder where downloaded packages live",
    full: "When you run npm install, all the downloaded code goes into this folder. It can get huge (hundreds of megabytes) because packages have their own dependencies. You never edit files here directly, and you never commit it to Git—it gets regenerated from package.json."
  },
  "package-json": {
    term: "package.json",
    category: "Development Environment",
    short: "Your project's recipe card",
    full: "A JSON file that describes your JavaScript project: its name, version, what packages it needs (dependencies), and what commands it can run (scripts). It's the first thing npm reads. When someone clones your project, they run 'npm install' and this file tells npm what to download."
  },
  "dependencies": {
    term: "dependencies / devDependencies",
    category: "Development Environment",
    short: "Code your code needs to work",
    full: "Dependencies are packages your app needs to run (like React or Express). devDependencies are only needed during development (like testing tools or build tools). In package.json, they're listed separately. Production deployments skip devDependencies to keep things lean."
  },
  "npm-scripts": {
    term: "npm run dev / npm run build",
    category: "Development Environment",
    short: "Shortcuts for common commands",
    full: "Scripts defined in package.json that you run with 'npm run [name]'. 'npm run dev' typically starts a local development server with hot reloading. 'npm run build' creates optimized production files. These are just shortcuts for longer commands that would be tedious to type."
  },
  "terminal": {
    term: "terminal / command line",
    category: "Development Environment",
    short: "The text-based way to control your computer",
    full: "The application where you type commands instead of clicking buttons. On Mac it's Terminal, on Windows it's Command Prompt or PowerShell. Developers use it constantly: running servers, installing packages, using Git. It looks intimidating but you'll mostly use the same few commands repeatedly."
  },
  "cli": {
    term: "CLI",
    category: "Development Environment",
    short: "Command Line Interface",
    full: "A program you run by typing commands in the terminal instead of clicking buttons. npm is a CLI. Git is a CLI. Claude Code is a CLI. Most developer tools are CLIs because they're faster to use once you know the commands, and they can be scripted and automated."
  },
  "ide": {
    term: "IDE / code editor",
    category: "Development Environment",
    short: "The app where you write code",
    full: "IDE stands for Integrated Development Environment. It's software for writing code with features like syntax highlighting, autocomplete, and error detection. VS Code is the most popular free option. JetBrains makes paid IDEs. The difference between an IDE and a simple text editor is the extra features that help you code faster."
  },
  "port": {
    term: "port",
    category: "Development Environment",
    short: "A numbered channel for network connections",
    full: "When your computer runs a server, it listens on a specific port number. localhost:3000 means port 3000. localhost:8080 means port 8080. Different apps use different ports so they don't conflict. If you see 'port already in use,' another program is using that port—either stop it or use a different port."
  },
  "nodejs": {
    term: "Node.js",
    category: "Development Environment",
    short: "JavaScript that runs outside the browser",
    full: "JavaScript was originally browser-only. Node.js lets you run JavaScript on servers and your local machine. This is why you can build backends in JavaScript, run build tools, and use npm. When you install Node.js, you get both the 'node' command and npm."
  },
  "legacy-peer-deps": {
    term: "--legacy-peer-deps",
    category: "Development Environment",
    short: "Flag that ignores dependency version conflicts",
    full: "When npm install fails with peer dependency errors, this flag tells npm to install anyway using older, more lenient rules. Use it when packages fight over versions: npm install --legacy-peer-deps. It's a workaround, not a fix—the underlying version conflict still exists, but your code will usually work."
  },
  "hot-reload": {
    term: "hot reload / HMR",
    category: "Development Environment",
    short: "Auto-updating your app when you save",
    full: "Hot Module Replacement. When you edit code and save, your running app updates instantly without a full page refresh. It keeps your current state (form inputs, scroll position) while showing your changes. This is why 'npm run dev' is different from opening an HTML file directly—dev servers provide hot reload."
  },
  "linter": {
    term: "linter / ESLint",
    category: "Development Environment",
    short: "Tool that catches code problems automatically",
    full: "A linter scans your code for errors, bad practices, and style inconsistencies without running it. ESLint is the standard for JavaScript. It catches things like unused variables, missing semicolons, or potentially buggy patterns. Red/yellow squiggles in your editor are often from a linter."
  },
  "typescript": {
    term: "TypeScript",
    category: "Development Environment",
    short: "JavaScript with type checking",
    full: "A language that adds type annotations to JavaScript: instead of just 'let x = 5', you write 'let x: number = 5'. The TypeScript compiler catches type errors before your code runs. Files end in .ts instead of .js. It compiles to regular JavaScript. Most modern projects use it."
  },
  "json": {
    term: "JSON",
    category: "Development Environment",
    short: "A standard format for structured data",
    full: "JavaScript Object Notation. A text format for data that looks like: {\"name\": \"Alex\", \"age\": 30}. APIs send data as JSON. Config files (package.json, tsconfig.json) use JSON. It's human-readable and every programming language can parse it. Keys must be in double quotes."
  },
  "console-log": {
    term: "console.log()",
    category: "Development Environment",
    short: "Prints output for debugging",
    full: "The most basic debugging tool. console.log('hello') prints 'hello' to the browser console or terminal. Use it to see what values your variables have at different points: console.log('user is:', user). Check browser DevTools (F12) or your terminal to see the output."
  },

  // ===== Git & Version Control =====
  "git": {
    term: "git",
    category: "Git & Version Control",
    short: "Time machine for your code",
    full: "Version control software that tracks every change you make. It lets you go back to any previous version, see who changed what and when, and collaborate without overwriting each other's work. It's not the same as GitHub—Git is the tool, GitHub is a website that hosts Git projects."
  },
  "repository": {
    term: "repository (repo)",
    category: "Git & Version Control",
    short: "A project folder tracked by Git",
    full: "A folder containing your project files plus a hidden .git folder that stores all the version history. When you 'initialize a repo' you're telling Git to start tracking that folder. A remote repo lives on GitHub/GitLab; a local repo is on your computer."
  },
  "commit": {
    term: "commit",
    category: "Git & Version Control",
    short: "A saved snapshot of your code",
    full: "When you commit, you're saving the current state of your files with a message describing what changed. It's like a checkpoint in a video game. You can always go back to any commit. Good commit messages ('Fix login bug') help you understand the project history later."
  },
  "push-pull": {
    term: "push / pull",
    category: "Git & Version Control",
    short: "Syncing code between your computer and the cloud",
    full: "Push sends your local commits to the remote repository (GitHub). Pull downloads commits from the remote to your local machine. It's like uploading and downloading, but smart—Git only transfers what changed and merges it with what you have."
  },
  "branch": {
    term: "branch",
    category: "Git & Version Control",
    short: "A parallel version of your code",
    full: "A branch lets you work on changes without affecting the main code. Create a branch called 'new-feature', make your changes there, and when it works, merge it back. The main branch (often called 'main' or 'master') is the official version."
  },
  "gitignore": {
    term: ".gitignore",
    category: "Git & Version Control",
    short: "A list of files Git should not track",
    full: "A file that tells Git what to ignore: things like node_modules (too big), .env (contains secrets), and OS files like .DS_Store. Git won't track, commit, or push anything listed here. Every project should have one."
  },
  "clone": {
    term: "clone",
    category: "Git & Version Control",
    short: "Copying a repository to your computer",
    full: "When you 'git clone' a repository, you download the entire project including all its history to your computer. It's how you get a copy of someone else's project to work on. You'll have the same files they do, plus the full Git history."
  },
  "staging": {
    term: "staging / git add",
    category: "Git & Version Control",
    short: "Selecting which changes to include in a commit",
    full: "Before committing, you 'stage' files with git add. Staging lets you choose which changes go into the next commit. git add . stages everything. git add filename.js stages one file. Think of it as putting items in a shopping cart before checkout—staged changes are ready to commit."
  },
  "pull-request": {
    term: "pull request / PR",
    category: "Git & Version Control",
    short: "Asking to merge your changes into another branch",
    full: "A PR is a request to merge your branch into another (usually main). On GitHub, you create a PR, others review your code, leave comments, and approve or request changes. When approved, you merge the PR. It's how teams review code before it goes live."
  },
  "merge": {
    term: "merge",
    category: "Git & Version Control",
    short: "Combining two branches into one",
    full: "Merging takes changes from one branch and adds them to another. When you merge a feature branch into main, all the commits from the feature branch become part of main. Git usually handles this automatically, but sometimes you get merge conflicts."
  },
  "conflict": {
    term: "merge conflict",
    category: "Git & Version Control",
    short: "When Git can't automatically combine changes",
    full: "A conflict happens when two branches change the same lines of code differently. Git doesn't know which version to keep, so it marks the conflict in the file with <<<<<<< and >>>>>>> markers. You manually choose which code to keep, remove the markers, then commit."
  },
  "origin": {
    term: "origin",
    category: "Git & Version Control",
    short: "The default name for your remote repository",
    full: "When you clone a repo or push for the first time, Git names the remote 'origin' by default. 'git push origin main' means push to the main branch on the origin remote. It's just a name—you could rename it, but almost nobody does."
  },
  "readme": {
    term: "README.md",
    category: "Git & Version Control",
    short: "The front page documentation for a project",
    full: "A markdown file that explains what a project does, how to install it, and how to use it. GitHub displays it automatically on the repo's homepage. Every project should have one. The .md extension means it's written in Markdown format."
  },
  "fork": {
    term: "fork",
    category: "Git & Version Control",
    short: "Your own copy of someone else's repository",
    full: "Forking creates a copy of a repository under your GitHub account. You can make changes to your fork without affecting the original. It's how you contribute to open source: fork the repo, make changes, then submit a pull request to the original."
  },

  // ===== UI/Frontend =====
  "div": {
    term: "div",
    category: "UI/Frontend",
    short: "A generic container box in HTML",
    full: "Short for 'division.' It's the most basic building block in HTML—a rectangular box that can contain text, images, or other elements. By itself it does nothing visible, but you use CSS to give it size, color, borders, and layout. Modern HTML has more semantic options (header, nav, section) but div is still everywhere."
  },
  "component": {
    term: "component",
    category: "UI/Frontend",
    short: "A reusable piece of UI",
    full: "In frameworks like React or Vue, a component is a self-contained piece of interface—like a button, card, or navigation bar. You build it once, then use it anywhere. Components can contain other components. A page might be: Header component + several Card components + Footer component."
  },
  "modal": {
    term: "modal",
    category: "UI/Frontend",
    short: "A popup box that demands attention",
    full: "A dialog box that appears on top of the page, usually dimming the background. It 'traps' focus—you have to deal with it before continuing. Common uses: confirmation dialogs ('Are you sure?'), login forms, or detailed views. Close it by clicking a button or the background."
  },
  "card": {
    term: "card",
    category: "UI/Frontend",
    short: "A contained box of related content",
    full: "A UI pattern: a rectangular container with distinct boundaries (usually borders or shadows) that groups related information. Think of social media posts, product listings, or dashboard widgets. Cards make interfaces scannable and are the building blocks of most modern web design."
  },
  "props": {
    term: "props",
    category: "UI/Frontend",
    short: "Data passed into a component",
    full: "Short for 'properties.' In React/Vue, props are how you pass data from a parent component to a child. Like function arguments: <UserCard name='Alex' role='Editor' />. The UserCard component receives these props and uses them to display the right content."
  },
  "state": {
    term: "state",
    category: "UI/Frontend",
    short: "Data that changes over time in your UI",
    full: "State is data that can change and, when it does, the UI updates to reflect it. Is a dropdown open or closed? What has the user typed in a form? What items are in the cart? That's all state. Managing state well is one of the harder parts of frontend development."
  },
  "render": {
    term: "render",
    category: "UI/Frontend",
    short: "Turning code into visible UI",
    full: "Rendering is when your code gets converted into what users actually see. When React 'renders' a component, it runs your code and produces HTML for the browser. When state changes, components re-render to show the new data. Fast rendering = smooth UI."
  },
  "dom": {
    term: "DOM",
    category: "UI/Frontend",
    short: "The browser's live model of your page",
    full: "Document Object Model—the browser's internal representation of your HTML page as a tree of objects. JavaScript manipulates the DOM to change what's displayed: adding elements, hiding things, updating text. When you see a page change without reloading, that's JavaScript modifying the DOM."
  },

  // ===== Backend/Data =====
  "api": {
    term: "API",
    category: "Backend/Data",
    short: "A way for programs to talk to each other",
    full: "Application Programming Interface—a defined set of requests and responses that let different software communicate. Want weather data? Call a weather API. Want to post a tweet? Use Twitter's API. Your frontend calls your backend's API to get and save data. It's like a restaurant menu: here's what you can order and how to order it."
  },
  "endpoint": {
    term: "endpoint",
    category: "Backend/Data",
    short: "A specific URL your API responds to",
    full: "Each URL in an API is an endpoint. GET /users might return all users. GET /users/123 returns user #123. POST /users creates a new user. Think of endpoints as different services at the same address. Each does one specific thing."
  },
  "database": {
    term: "database / DB",
    category: "Backend/Data",
    short: "Organized storage for your data",
    full: "Software for storing and retrieving data reliably. Unlike files, databases let you query data efficiently ('find all orders over $100'), handle multiple users at once, and keep data consistent. Common types: SQL databases (PostgreSQL, MySQL) store data in tables; NoSQL databases (MongoDB) are more flexible."
  },
  "schema": {
    term: "schema",
    category: "Backend/Data",
    short: "The structure definition for your data",
    full: "A schema defines what your data looks like: what fields exist, what types they are, which are required. A user schema might say: name (text, required), email (text, unique), age (number, optional). It's like a blueprint that ensures your data is consistent and valid."
  },
  "sql": {
    term: "SQL",
    category: "Backend/Data",
    short: "The language for talking to databases",
    full: "Structured Query Language—the standard way to query relational databases. SELECT * FROM users WHERE age > 21 gets all users over 21. INSERT, UPDATE, DELETE modify data. Every major database understands SQL. It's worth learning the basics even for vibe coding."
  },
  "query": {
    term: "query",
    category: "Backend/Data",
    short: "A question you ask a database",
    full: "When you want data from a database, you send a query—a structured request for specific information. 'Get all articles from 2024' or 'Count users by country' are queries. The database processes the query and returns results. Writing efficient queries is important for performance."
  },
  "crud": {
    term: "CRUD",
    category: "Backend/Data",
    short: "The four basic database operations",
    full: "Create, Read, Update, Delete—the four fundamental things you do with data. Most apps are basically CRUD apps: create new records, read/display them, update when things change, delete when needed. When you hear 'build a CRUD API,' it means endpoints for these four operations."
  },
  "rest": {
    term: "REST / RESTful API",
    category: "Backend/Data",
    short: "A standard pattern for web APIs",
    full: "REST is a set of conventions for building APIs. Use HTTP methods meaningfully: GET to read, POST to create, PUT/PATCH to update, DELETE to remove. Use nouns for URLs (/users, /posts). Return appropriate status codes. Most web APIs follow REST conventions."
  },
  "http-methods": {
    term: "HTTP methods (GET, POST, PUT, DELETE)",
    category: "Backend/Data",
    short: "Different types of web requests",
    full: "GET retrieves data without changing anything. POST sends data to create something new. PUT/PATCH updates existing data. DELETE removes data. When you visit a URL, that's a GET request. When you submit a form, that's usually POST. APIs use all four."
  },
  "cors": {
    term: "CORS",
    category: "Backend/Data",
    short: "Security rule about cross-site requests",
    full: "Cross-Origin Resource Sharing. Browsers block requests from one website to another by default for security. If your frontend at localhost:3000 calls an API at localhost:8000, you'll get a CORS error unless the API explicitly allows it. The fix is on the server side, not the client."
  },
  "server": {
    term: "server",
    category: "Backend/Data",
    short: "A computer that responds to requests",
    full: "A server is software (or the computer running it) that listens for requests and sends responses. Web servers serve web pages. API servers serve data. Database servers handle data storage. When you run 'npm run dev', you're starting a local development server on your machine."
  },
  "client": {
    term: "client",
    category: "Backend/Data",
    short: "The thing making requests (usually the browser)",
    full: "In web development, the client is typically the user's browser. It makes requests to servers and displays responses. 'Client-side' code runs in the browser (JavaScript). 'Server-side' code runs on the server. The client-server model is how the web works."
  },
  "frontend-backend": {
    term: "frontend vs backend",
    category: "Backend/Data",
    short: "What users see vs what runs on servers",
    full: "Frontend is everything the user interacts with: HTML, CSS, JavaScript in the browser, the visual interface. Backend is everything on the server: databases, business logic, APIs, authentication. Some developers specialize in one; fullstack developers do both."
  },
  "orm": {
    term: "ORM",
    category: "Backend/Data",
    short: "Tool that lets you use objects instead of SQL",
    full: "Object-Relational Mapping. Instead of writing SQL queries, you work with objects in your code: User.findAll() instead of SELECT * FROM users. Prisma, Sequelize, and SQLAlchemy are popular ORMs. They make database work easier but you should still understand basic SQL."
  },
  "status-codes": {
    term: "status codes (200, 404, 500)",
    category: "Backend/Data",
    short: "Numbers that indicate request results",
    full: "Every HTTP response has a status code. 200 means success. 201 means created. 400 means bad request (your fault). 401 means unauthorized. 404 means not found. 500 means server error (their fault). Check the status code first when debugging API calls."
  },

  // ===== Authentication =====
  "auth": {
    term: "auth",
    category: "Authentication",
    short: "Short for authentication/authorization",
    full: "Authentication is verifying who someone is (logging in). Authorization is checking what they're allowed to do (permissions). 'Auth' often refers to both. Building auth from scratch is complex and risky—most developers use auth services like Auth0, Firebase Auth, or Clerk."
  },
  "session": {
    term: "session",
    category: "Authentication",
    short: "A logged-in user's temporary identity",
    full: "When you log in, the server creates a session—a temporary record that you're authenticated. Your browser gets a session ID (usually in a cookie) that it sends with every request. The server checks this ID to know who you are without requiring login every time."
  },
  "token-jwt": {
    term: "token / JWT",
    category: "Authentication",
    short: "A digital proof of identity",
    full: "A token is a string that proves you're logged in. JWT (JSON Web Token) is a common format: it contains encoded information about the user and is cryptographically signed so it can't be faked. Tokens are sent with API requests to prove authorization. They expire after a set time."
  },
  "user-auth": {
    term: "user authentication",
    category: "Authentication",
    short: "Proving you are who you claim to be",
    full: "The process of verifying a user's identity, typically via username/password, but also through social login (Google, GitHub), magic links (emailed one-time codes), or biometrics. It's the 'log in' part of any app. Getting it wrong has serious security implications."
  },
  "cookies": {
    term: "cookies",
    category: "Authentication",
    short: "Small data stored in your browser",
    full: "Cookies are tiny text files websites store in your browser. They're commonly used to remember you're logged in (session cookies), track preferences, or—controversially—track you across sites for advertising. HTTP-only cookies can't be accessed by JavaScript, making them more secure for auth."
  },

  // ===== General =====
  "build": {
    term: "build",
    category: "General",
    short: "Preparing your code for production",
    full: "The build process transforms your source code into optimized files ready for deployment. It might: combine multiple files into one, minify code (remove whitespace), compile TypeScript to JavaScript, optimize images. The output goes to a 'dist' or 'build' folder. You run 'npm run build' to trigger it."
  },
  "deploy": {
    term: "deploy",
    category: "General",
    short: "Putting your code on a live server",
    full: "Deployment is making your application available on the internet. You push your built code to a hosting service (Vercel, Netlify, AWS) and it becomes accessible at a URL. Modern platforms make deployment almost automatic—push to Git and your site updates within minutes."
  },
  "prod-dev": {
    term: "production vs development",
    category: "General",
    short: "Live vs local environments",
    full: "Development is where you code: localhost, fake data, detailed errors, slow but debuggable. Production is live: real users, real data, errors hidden from users, optimized for speed. Code often behaves differently between them—environment variables control this. Always test in an environment similar to production before deploying."
  },
  "bug-debug": {
    term: "bug / debug",
    category: "General",
    short: "An error in code / finding and fixing it",
    full: "A bug is when code doesn't work as intended—wrong output, crashes, or unexpected behavior. Debugging is the detective work of finding and fixing bugs. It involves reading error messages, adding console.log statements, using debugger tools, and methodically narrowing down where things go wrong."
  },
  "error-message": {
    term: "error message",
    category: "General",
    short: "The computer telling you what went wrong",
    full: "When code fails, you get an error message explaining what happened. Reading them carefully is a crucial skill: they tell you the error type, where it occurred, and often why. Copy-pasting error messages into your AI prompt is one of the most effective debugging techniques."
  },
  "stack-trace": {
    term: "stack trace",
    category: "General",
    short: "The path your code took to crash",
    full: "When an error occurs, the stack trace shows you the sequence of function calls that led to it—like breadcrumbs. It lists files and line numbers, starting from where the error happened and going back through what called what. Read from top to bottom to find where things went wrong."
  },
  "hardcoding": {
    term: "hardcoding",
    category: "General",
    short: "Putting fixed values directly in code",
    full: "Writing specific values directly in your code instead of using variables or configuration. Hardcoding 'http://localhost:3000' instead of using an environment variable is bad because it breaks in production. Hardcoding your API key is dangerous because it can be exposed. Use environment variables instead."
  },
  "refactor": {
    term: "refactor",
    category: "General",
    short: "Improving code without changing what it does",
    full: "Refactoring is reorganizing or cleaning up code while keeping the same functionality. You might rename variables to be clearer, break a long function into smaller ones, or remove duplicate code. Good code is refactored regularly. AI is great at suggesting refactors."
  },
  "boilerplate": {
    term: "boilerplate / starter",
    category: "General",
    short: "Template code to start a project",
    full: "Pre-written code that handles common setup so you don't start from scratch. A Next.js starter might include auth, database setup, and styling already configured. 'npx create-next-app' generates boilerplate. Boilerplate code is the repetitive stuff every project needs."
  },
  "framework-vs-library": {
    term: "framework vs library",
    category: "General",
    short: "Tools that call you vs tools you call",
    full: "A library is code you call when you need it (like Lodash for utilities). A framework calls your code—it's in control and you fill in the pieces (like Next.js or Django). You use libraries. Frameworks use you. Both help you avoid reinventing the wheel."
  },
  "syntax": {
    term: "syntax",
    category: "General",
    short: "The grammar rules of a programming language",
    full: "Every language has rules about how code must be written. JavaScript uses curly braces { } for blocks. Python uses indentation. Missing a semicolon or misspelling a keyword causes a syntax error. The computer can't run code that doesn't follow syntax rules."
  },
  "runtime": {
    term: "runtime",
    category: "General",
    short: "When your code actually executes",
    full: "Runtime is when your code is running, as opposed to when it's being written or compiled. 'Runtime error' means something went wrong while the program was executing. Node.js is a JavaScript runtime—the environment that executes JavaScript code."
  },
  "async": {
    term: "async / await",
    category: "General",
    short: "Handling operations that take time",
    full: "Some operations take time: fetching data, reading files, waiting for user input. Async code lets your program do other things while waiting. 'await' pauses until an operation completes. Without async handling, your app would freeze during every slow operation."
  },
  "callback": {
    term: "callback",
    category: "General",
    short: "A function passed to another function",
    full: "A callback is a function you give to another function to call later. In 'button.onClick(handleClick)', handleClick is a callback—it gets called when the button is clicked. Callbacks are how JavaScript handles events and asynchronous operations."
  },

  // ===== Programming Basics =====
  "variable": {
    term: "variable",
    category: "Programming Basics",
    short: "A named container for data",
    full: "A variable stores a value you can use later. 'let name = \"Alex\"' creates a variable called name containing the text Alex. You can change it later: 'name = \"Sam\"'. Use 'const' for values that shouldn't change, 'let' for values that will change."
  },
  "function": {
    term: "function",
    category: "Programming Basics",
    short: "A reusable block of code",
    full: "A function is code you write once and call whenever you need it. Functions can take inputs (parameters) and return outputs. 'function add(a, b) { return a + b }' defines a function. 'add(2, 3)' calls it and returns 5. Functions are the building blocks of programs."
  },
  "string": {
    term: "string",
    category: "Programming Basics",
    short: "Text data",
    full: "A string is a sequence of characters—text data. 'Hello world' is a string. \"123\" is also a string, not a number. You create strings with quotes (single or double) or backticks. Backticks allow string interpolation: `Hello ${name}` inserts the variable name into the string."
  },
  "array": {
    term: "array",
    category: "Programming Basics",
    short: "An ordered list of items",
    full: "An array holds multiple values in order. ['apple', 'banana', 'cherry'] is an array of three strings. Access items by position (starting at 0): array[0] is 'apple'. Arrays have methods like .map(), .filter(), and .forEach() to work with their contents."
  },
  "object": {
    term: "object",
    category: "Programming Basics",
    short: "A collection of key-value pairs",
    full: "An object stores related data as named properties. {name: 'Alex', age: 30} is an object with two properties. Access them with dot notation (user.name) or brackets (user['name']). Objects can contain other objects, arrays, functions—anything."
  },
  "import-export": {
    term: "import / export",
    category: "Programming Basics",
    short: "Sharing code between files",
    full: "Export makes code available to other files: 'export function helper() {}'. Import brings it in: 'import { helper } from './utils''. This is how you organize code into modules. 'export default' exports one main thing. Named exports let you export multiple things."
  },
  "boolean": {
    term: "boolean",
    category: "Programming Basics",
    short: "True or false value",
    full: "A boolean is either true or false—nothing else. Used for conditions: 'if (isLoggedIn)'. Comparisons return booleans: '5 > 3' is true. Many functions return booleans: 'array.includes(\"item\")' returns true if the item exists. Named after mathematician George Boole."
  },
  "null-undefined": {
    term: "null / undefined",
    category: "Programming Basics",
    short: "Values representing 'nothing'",
    full: "Both mean 'no value' but differ in intent. undefined means a variable exists but hasn't been assigned anything. null means intentionally set to 'nothing'. Check for both when handling missing data: if (value == null) catches both. This is a common source of bugs."
  }
};

// Category order for display
const GLOSSARY_CATEGORIES = [
  "Development Environment",
  "Git & Version Control",
  "UI/Frontend",
  "Backend/Data",
  "Authentication",
  "Programming Basics",
  "General"
];
