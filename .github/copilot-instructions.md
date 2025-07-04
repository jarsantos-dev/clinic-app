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

# HTML Guidelines

* Use semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, etc.)
* Each page must include a **common layout structure**, reusable across views
* Avoid any CSS framework-specific class names (e.g., do not embed Pico.css classes)
* Add `id`s and `class`es based on structural or content meaning only (e.g., `#employee-form`, `.specialty-card`)

# JavaScript Guidelines

* Use **vanilla JavaScript** in external `.js` files only
* Organize code modularly with well-named functions
* Use `localStorage` for storing and retrieving app data
  * Example: `localStorage.setItem("specialties", JSON.stringify([...]))`
* Structure code to allow reuse across views/pages when applicable

# Styling Guidelines

* Use **Pico.css** as the base styling framework
  * Do not include Pico-specific classes in HTML
  * Style semantic tags through your own `styles.css` (or `style.scss`)
* Use your CSS file to map meaningful HTML selectors to Pico.css-appropriate styles

# General

* This is a single-user app; no authentication is needed
* All code must work offline
* No automated tests required for now

# Language Guidelines

* **All user-visible text must be in Portuguese (Portugal)**
  * Navigation labels, headings, buttons, placeholders, messages, etc.
  * Use Portuguese (Portugal) spelling and terminology
* **Code and markup must remain in English**
  * Variable names, function names, class names, IDs, CSS classes
  * HTML attributes, JavaScript keywords, comments
  * File names and folder structures