# ToDo-List

A lightweight, browser-based task manager built with plain HTML, CSS, and JavaScript.

## Overview

This project is a simple todo application for tracking daily tasks, managing priorities, and keeping completed work out of the way. It is designed to be easy to run locally without installing any dependencies.

## Features

- Add new tasks quickly
- Mark tasks as complete or active
- Delete individual tasks
- Filter items by All, Active, or Completed
- Remove all completed tasks at once
- Save tasks automatically in browser localStorage

## Project Structure

- `index.html` – app layout and controls
- `styles.css` – styling and responsive layout
- `script.js` – task logic and local storage behavior

## Run it locally

You can either open `index.html` directly in a browser or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Notes

The app stores your todo data in the browser using `localStorage`, so your tasks remain available when you refresh the page.

