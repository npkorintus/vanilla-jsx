export function getRoute() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash.startsWith('/') ? hash : '/'
}

export function onRouteChange(handler) {
  window.addEventListener('hashchange', () => handler(getRoute()))
}
