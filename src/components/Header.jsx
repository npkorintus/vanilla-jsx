import { h } from '../jsx.js'

const links = [
  { path: '/', label: 'Home' },
  { path: '/counter', label: 'Counter' },
  { path: '/todos', label: 'Todos' },
  { path: '/about', label: 'How it works' },
]

export function Header({ route, theme, onToggleTheme }) {
  return (
    <header class="site-header">
      <a class="brand" href="#/">
        <span class="brand-mark">{'</>'}</span>
        <span>Vanilla JSX</span>
      </a>

      <nav class="nav" aria-label="Primary">
        {links.map((link) => (
          <a
            key={link.path}
            class={route === link.path ? 'nav-link is-active' : 'nav-link'}
            href={'#' + link.path}
            aria-current={route === link.path ? 'page' : null}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button class="theme-toggle" type="button" onClick={onToggleTheme}>
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </header>
  )
}
