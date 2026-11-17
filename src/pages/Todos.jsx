import { h } from '../jsx.js'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Done' },
]

export function Todos({ state, actions }) {
  const visible = state.todos.filter((todo) => {
    if (state.filter === 'active') return !todo.done
    if (state.filter === 'done') return todo.done
    return true
  })

  return (
    <section class="page">
      <p class="eyebrow">Stateful list</p>
      <h1>Todos</h1>
      <p class="lede">
        Keyed reconciliation keeps input focus and checkbox state intact while the list
        changes underneath.
      </p>

      <form
        class="todo-form"
        onSubmit={(event) => {
          event.preventDefault()
          actions.addTodo()
        }}
      >
        <input
          value={state.draft}
          onInput={(event) => actions.setDraft(event.target.value)}
          placeholder="What needs doing?"
          aria-label="New todo"
        />
        <button class="button primary" type="submit">
          Add
        </button>
      </form>

      <div class="filters">
        {filters.map((filter) => (
          <button
            key={filter.id}
            class={state.filter === filter.id ? 'chip is-selected' : 'chip'}
            type="button"
            onClick={() => actions.setFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
        <span class="muted">{visible.length} shown</span>
      </div>

      <ul class="todo-list">
        {visible.map((todo) => (
          <li class={todo.done ? 'todo is-done' : 'todo'} key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => actions.toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button
              class="button ghost danger"
              type="button"
              onClick={() => actions.removeTodo(todo.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p class="empty">Nothing here yet. Add a task above.</p>
      )}
    </section>
  )
}
