export const Fragment = Symbol('Fragment')

export function h(type, props, ...children) {
  const { key = null, children: nested, ...rest } = props || {}
  const nodes = children.length ? children : nested == null ? [] : [nested]

  return {
    type,
    key,
    props: rest,
    children: nodes.flat(Infinity).filter(isRenderable),
  }
}

function isRenderable(child) {
  return child != null && typeof child !== 'boolean'
}
