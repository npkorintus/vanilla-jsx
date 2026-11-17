import { h } from '../jsx.js'

const features = [
  {
    title: 'JSX without React',
    body: 'Vite hands JSX to a tiny h() function. Tags become plain objects, not React elements.',
  },
  {
    title: 'A real DOM patcher',
    body: 'Every state change renders a new tree, then a keyed diff updates only the nodes that changed.',
  },
  {
    title: 'Zero UI dependencies',
    body: 'The only dependency is Vite. State, routing, and rendering live in a few small modules.',
  },
]

export function Home() {
  return (
    <section class="page">
      <p class="eyebrow">Demo SPA</p>
      <h1>
        JSX in <span class="gradient">vanilla JavaScript</span>
      </h1>
      <p class="lede">
        This app uses JSX syntax with no React in sight. A hand-written runtime turns
        components into DOM nodes, a keyed patcher keeps updates fast, and a hash router
        handles navigation.
      </p>

      <div class="hero-actions">
        <a class="button primary" href="#/counter">
          Try the counter
        </a>
        <a class="button" href="#/todos">
          Open the todo list
        </a>
        <a class="button ghost" href="#/about">
          See how it works
        </a>
      </div>

      <div class="feature-grid">
        {features.map((feature, index) => (
          <article class="feature-card" key={feature.title}>
            <span class="feature-index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
