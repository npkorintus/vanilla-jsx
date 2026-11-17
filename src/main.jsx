import './style.css'
import { h } from './jsx.js'
import { render } from './render.js'
import { createStore } from './store.js'
import { getRoute, onRouteChange } from './router.js'
import { App } from './App.jsx'

const THEME_KEY = 'vanilla-jsx-theme'

function preferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const store = createStore({
  route: getRoute(),
  theme: preferredTheme(),
  count: 0,
  step: 1,
  draft: '',
  filter: 'all',
  todos: [
    { id: 1, text: 'Read the JSX runtime', done: true },
    { id: 2, text: 'Build a page with vanilla JSX', done: false },
    { id: 3, text: 'Delete React from the dependency list', done: false },
  ],
})

let nextTodoId = 4

const actions = {
  toggleTheme() {
    store.setState((state) => ({
      ...state,
      theme: state.theme === 'dark' ? 'light' : 'dark',
    }))
  },

  increment() {
    store.setState((state) => ({ ...state, count: state.count + state.step }))
  },

  decrement() {
    store.setState((state) => ({ ...state, count: state.count - state.step }))
  },

  setStep(step) {
    store.setState({ step })
  },

  resetCounter() {
    store.setState({ count: 0, step: 1 })
  },

  setDraft(draft) {
    store.setState({ draft })
  },

  addTodo() {
    const text = store.getState().draft.trim()
    if (!text) return

    store.setState((state) => ({
      ...state,
      draft: '',
      todos: [...state.todos, { id: nextTodoId++, text, done: false }],
    }))
  },

  toggleTodo(id) {
    store.setState((state) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      ),
    }))
  },

  removeTodo(id) {
    store.setState((state) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    }))
  },

  setFilter(filter) {
    store.setState({ filter })
  },
}

const root = document.querySelector('#app')

function draw() {
  const state = store.getState()
  document.documentElement.dataset.theme = state.theme

  try {
    localStorage.setItem(THEME_KEY, state.theme)
  } catch {}

  render(<App state={state} actions={actions} />, root)
}

store.subscribe(draw)

onRouteChange((route) => {
  store.setState({ route })
  window.scrollTo(0, 0)
})

draw()
