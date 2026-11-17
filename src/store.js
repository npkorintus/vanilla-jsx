export function createStore(initialState) {
  let state = initialState
  const listeners = new Set()

  return {
    getState() {
      return state
    },

    setState(update) {
      const next = typeof update === 'function' ? update(state) : { ...state, ...update }
      if (next === state) return

      state = next
      for (const listener of listeners) listener(state)
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
