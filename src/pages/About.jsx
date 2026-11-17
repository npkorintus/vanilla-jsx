import { h } from '../jsx.js'

const jsxSnippet = `export function App({ state, actions }) {
  return (
    <main>
      <h1>Count: {state.count}</h1>
      <button onClick={actions.increment}>+1</button>
    </main>
  )
}`

const hSnippet = `h('button', { onClick: actions.increment }, '+1')

// {
//   type: 'button',
//   key: null,
//   props: { onClick: actions.increment },
//   children: ['+1']
// }`

const configSnippet = `export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'classic',
      pragma: 'h',
      pragmaFrag: 'Fragment',
    },
  },
})`

export function About() {
  return (
    <section class="page">
      <p class="eyebrow">Under the hood</p>
      <h1>How this works</h1>
      <p class="lede">
        There are four small pieces: a JSX factory, a virtual DOM patcher, a store, and
        a hash router. That is the whole framework.
      </p>

      <ol class="steps">
        <li class="step">
          <span class="step-number">01</span>
          <div>
            <h2>JSX compiles to h() calls</h2>
            <p>
              Vite's Oxc transform is configured with a classic JSX runtime. Instead of
              React.createElement, every tag calls our h() helper.
            </p>
            <pre class="code-block">
              <code>{jsxSnippet}</code>
            </pre>
          </div>
        </li>

        <li class="step">
          <span class="step-number">02</span>
          <div>
            <h2>Tags become plain objects</h2>
            <p>
              h() stores the tag name, props, children, and key. No classes, no fibers,
              no scheduler. Just data.
            </p>
            <pre class="code-block">
              <code>{hSnippet}</code>
            </pre>
          </div>
        </li>

        <li class="step">
          <span class="step-number">03</span>
          <div>
            <h2>A keyed patcher updates the DOM</h2>
            <p>
              render() compares the previous tree with the next one. Matching elements
              are updated in place, keyed children are moved, and missing nodes are
              removed. That is why the todo input keeps its focus.
            </p>
          </div>
        </li>

        <li class="step">
          <span class="step-number">04</span>
          <div>
            <h2>The store and router trigger renders</h2>
            <p>
              Any setState() call notifies a single subscriber in main.jsx. It applies
              the theme and re-renders App. Hash links update the route, which is just
              another field in the store.
            </p>
            <pre class="code-block">
              <code>{configSnippet}</code>
            </pre>
          </div>
        </li>
      </ol>

      <a class="button primary" href="#/">
        Back to the demo
      </a>
    </section>
  )
}
