const storageKey = 'todo-list-items';
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');
const navLinks = document.querySelectorAll('.nav-link');

let todos = JSON.parse(localStorage.getItem(storageKey)) || [];
let activeFilter = 'all';

function createTodoId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setFilter(filterName) {
  activeFilter = filterName;

  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filterName);
  });

  renderTodos();
}

function saveTodos() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (activeFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (activeFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return [...todos];
}

function updateSummary() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  const suffix = remaining === 1 ? 'item left' : 'items left';
  itemsLeft.textContent = `${remaining} ${suffix}`;
}

function renderTodos() {
  const filteredTodos = getFilteredTodos();

  if (!filteredTodos.length) {
    todoList.innerHTML = '<li class="empty-state">No todos here yet.</li>';
    updateSummary();
    return;
  }

  todoList.innerHTML = filteredTodos
    .map(
      (todo) => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
          <button class="toggle-btn" type="button" aria-label="Toggle completion for ${todo.text}" title="Toggle complete"></button>
          <span class="todo-text">${escapeHtml(todo.text)}</span>
          <button class="delete-btn" type="button" aria-label="Delete ${todo.text}">Delete</button>
        </li>
      `
    )
    .join('');

  const items = todoList.querySelectorAll('.todo-item');
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 50}ms`;
  });

  updateSummary();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function addTodo(text) {
  const cleanedText = text.trim();

  if (!cleanedText) {
    todoInput.focus();
    return;
  }

  todos.unshift({
    id: createTodoId(),
    text: cleanedText,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoForm.reset();
  todoInput.focus();
  todoInput.animate(
    [
      { transform: 'scale(0.98)', boxShadow: '0 0 0 rgba(53, 99, 233, 0)' },
      { transform: 'scale(1)', boxShadow: '0 0 0 6px rgba(53, 99, 233, 0.08)' },
      { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(53, 99, 233, 0)' }
    ],
    {
      duration: 280,
      easing: 'ease-out'
    }
  );
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  const item = todoList.querySelector(`[data-id="${id}"]`);

  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      todos = todos.filter((todo) => todo.id !== id);
      saveTodos();
      renderTodos();
    }, 180);
    return;
  }

  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

todoList.addEventListener('click', (event) => {
  const target = event.target;
  const item = target.closest('.todo-item');

  if (!item) {
    return;
  }

  const { id } = item.dataset;

  if (target.matches('.toggle-btn')) {
    toggleTodo(id);
    return;
  }

  if (target.matches('.delete-btn')) {
    deleteTodo(id);
  }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setFilter(button.dataset.filter);
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.dataset.target;

    if (target === 'tasks') {
      event.preventDefault();
      document.getElementById('tasks').scrollIntoView({ behavior: 'smooth', block: 'start' });
      todoInput.focus();
      return;
    }

    if (target === 'completed') {
      event.preventDefault();
      setFilter('completed');
      document.getElementById('tasks').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (target === 'home') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

renderTodos();
