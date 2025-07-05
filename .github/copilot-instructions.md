---

applyTo:
* "*.html"
* "*.js"
* "*.css"
* "*.scss"

---

# Project Overview

This project is a front-end-only proof-of-concept web app for managing a clinic. It uses plain HTML, vanilla JavaScript, and localStorage for client-side persistence. There is no backend.

The project will include **multiple HTML pages/views**, and the data structure will evolve incrementally through a series of development tasks.

# Development Philosophy

* Prioritize simplicity, clarity, and maintainability
* Ensure strong separation of concerns between content, logic, and styling
* Use meaningful names and structures to support scalability and readability
* **On each task do only what it's asked and no more than that**

# HTML Guidelines

* Use semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, etc.)
* Each page must include a **common layout structure**, reusable across views
* Avoid any CSS framework-specific class names (e.g., do not embed Pico.css classes)
* Add `id`s and `class`es based on structural or content meaning only (e.g., `#employee-form`, `.specialty-card`)
* **Each view should have its own HTML file(s) and its own JS script file. It's ok to have a generic file for generic functions**

# JavaScript Guidelines

* Use **vanilla JavaScript** in external `.js` files only
* Organize code modularly with well-named functions
* Use `localStorage` for storing and retrieving app data
  * Example: `localStorage.setItem("specialties", JSON.stringify([...]))`
* Structure code to allow reuse across views/pages when applicable
* **Do not put HTML as string in JavaScript. HTML should be in its own file. It's only acceptable to have HTML as a string for 1 to 3 lines HTML, and you should avoid it**

# Styling Guidelines

* Use **Pico.css** as the base styling framework
  * Do not include Pico-specific classes in HTML
  * Style semantic tags through your own `styles.css` (or `style.scss`)
* Use your CSS file to map meaningful HTML selectors to Pico.css-appropriate styles

# General

* This is a single-user app; no authentication is needed
* All code must work offline
* No automated tests required for now

# Workflow & Communication Guidelines

* **Feel free to create a PR comment with questions before proceeding with code generation. Add a tag "questions" on it for me to know**
* **Add a tag "ai working" while in session. This way I can know that without having to open the PR**

# Language Guidelines

* **All user-visible text must be in Portuguese (Portugal)**
  * Navigation labels, headings, buttons, placeholders, messages, etc.
  * Use Portuguese (Portugal) spelling and terminology
* **Code and markup must remain in English**
  * Variable names, function names, class names, IDs, CSS classes
  * HTML attributes, JavaScript keywords, comments
  * File names and folder structures