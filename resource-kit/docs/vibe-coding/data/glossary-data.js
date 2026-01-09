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
  }
};

// Category order for display
const GLOSSARY_CATEGORIES = [
  "Development Environment",
  "Git & Version Control",
  "UI/Frontend",
  "Backend/Data",
  "Authentication",
  "General"
];
