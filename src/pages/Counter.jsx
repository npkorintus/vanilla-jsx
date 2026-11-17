import { h } from '../jsx.js'

const steps = [1, 5, 10]

const snippet = `<button onClick={() => actions.increment()}>
  Count is {state.count}
</button>`

export function Counter({ state, actions }) {
  return (
    <section class="page">
      <p class="eyebrow">Interactive</p>
      <h1>A counter with zero framework</h1>
      <p class="lede">
        Click a button and the store updates. A subscriber re-renders the app, and the
        patcher changes only the number in the middle.
      </p>

      <div class="counter-card">
        <button
          class="icon-button"
          type="button"
          onClick={actions.decrement}
          aria-label="Decrease"
        >
          −
        </button>
        <output class="counter-value" aria-live="polite">
          {state.count}
        </output>
        <button
          class="icon-button"
          type="button"
          onClick={actions.increment}
          aria-label="Increase"
        >
          +
        </button>
      </div>

      <div class="row">
        <span class="muted">Step</span>
        {steps.map((step) => (
          <button
            key={step}
            class={state.step === step ? 'chip is-selected' : 'chip'}
            type="button"
            onClick={() => actions.setStep(step)}
          >
            {step}
          </button>
        ))}
        <button class="chip" type="button" onClick={actions.resetCounter}>
          Reset
        </button>
      </div>

      <pre class="code-block">
        <code>{snippet}</code>
      </pre>
    </section>
  )
}
