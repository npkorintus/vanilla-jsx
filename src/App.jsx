import { h } from './jsx.js'
import { Header } from './components/Header.jsx'
import { Home } from './pages/Home.jsx'
import { Counter } from './pages/Counter.jsx'
import { Todos } from './pages/Todos.jsx'
import { About } from './pages/About.jsx'

const routes = {
  '/': Home,
  '/counter': Counter,
  '/todos': Todos,
  '/about': About,
}

function NotFound() {
  return (
    <section class="page">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <p class="lede">That route does not exist yet.</p>
      <a class="button primary" href="#/">
        Back home
      </a>
    </section>
  )
}

export function App({ state, actions }) {
  const Page = routes[state.route] || NotFound

  return (
    <div class="shell">
      <Header route={state.route} theme={state.theme} onToggleTheme={actions.toggleTheme} />

      <main class="main">
        <Page state={state} actions={actions} />
      </main>

      <footer class="site-footer">
        <span>Built with a hand-written JSX runtime and a keyed DOM patcher.</span>
        <span class="muted">No React. No framework. Just JavaScript.</span>
      </footer>
    </div>
  )
}
