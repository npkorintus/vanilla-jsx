import { Fragment } from './jsx.js'

const isEvent = (name) => /^on[A-Z]/.test(name)
const SKIP = new Set(['key', 'children'])

export function render(vnode, container) {
  container._vnode = patch(container, container._vnode || null, vnode, null)
}

function normalize(vnode) {
  if (vnode == null || typeof vnode === 'boolean') return null
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return { type: '#text', value: String(vnode), key: null, props: {}, children: [] }
  }
  return vnode
}

function normalizeChildren(children) {
  return (children || []).map(normalize).filter(Boolean)
}

function insert(parent, dom, ref) {
  if (ref == null || ref.parentNode !== parent) parent.appendChild(dom)
  else parent.insertBefore(dom, ref)
}

function place(parent, dom, ref) {
  if (dom.parentNode !== parent) {
    insert(parent, dom, ref)
    return
  }

  if (dom === ref || dom.nextSibling === ref) return

  if (ref != null && ref.parentNode !== parent) return

  parent.insertBefore(dom, ref)
}

function mount(parent, vnode, ref) {
  vnode = normalize(vnode)
  if (!vnode) return null

  const { type, props, children } = vnode

  if (type === '#text') {
    const dom = document.createTextNode(vnode.value)
    vnode.dom = dom
    insert(parent, dom, ref)
    return vnode
  }

  if (typeof type === 'function') {
    const rendered = normalize(type(props || {}))
    const child = mount(parent, rendered, ref)
    vnode.child = child
    vnode.dom = child ? child.dom : null
    return vnode
  }

  if (type === Fragment) {
    const dom = document.createElement('div')
    dom.style.display = 'contents'
    vnode.dom = dom
    insert(parent, dom, ref)
    vnode.children = normalizeChildren(children)
    for (const child of vnode.children) mount(dom, child, null)
    return vnode
  }

  const dom = document.createElement(type)
  vnode.dom = dom
  updateProps(dom, {}, props || {})
  insert(parent, dom, ref)
  vnode.children = normalizeChildren(children)
  for (const child of vnode.children) mount(dom, child, null)
  return vnode
}

function patch(parent, oldVNode, newVNode, ref) {
  oldVNode = normalize(oldVNode)
  newVNode = normalize(newVNode)

  if (!newVNode) {
    if (oldVNode && oldVNode.dom && oldVNode.dom.parentNode) oldVNode.dom.remove()
    return null
  }

  if (!oldVNode) return mount(parent, newVNode, ref)

  if (oldVNode.type !== newVNode.type || oldVNode.key !== newVNode.key) {
    const mounted = mount(parent, newVNode, ref)
    if (oldVNode.dom && oldVNode.dom.parentNode) oldVNode.dom.remove()
    return mounted
  }

  if (newVNode.type === '#text') {
    const dom = oldVNode.dom
    if (dom.nodeValue !== newVNode.value) dom.nodeValue = newVNode.value
    newVNode.dom = dom
    return newVNode
  }

  if (typeof newVNode.type === 'function') {
    const rendered = normalize(newVNode.type(newVNode.props || {}))
    const child = patch(parent, oldVNode.child || null, rendered, ref)
    newVNode.child = child
    newVNode.dom = child ? child.dom : null
    return newVNode
  }

  if (newVNode.type === Fragment) {
    const dom = oldVNode.dom
    newVNode.dom = dom
    newVNode.children = patchChildren(dom, oldVNode.children || [], newVNode.children || [])
    return newVNode
  }

  const dom = oldVNode.dom
  newVNode.dom = dom
  updateProps(dom, oldVNode.props || {}, newVNode.props || {})
  newVNode.children = patchChildren(dom, oldVNode.children || [], newVNode.children || [])
  return newVNode
}

function patchChildren(parent, oldChildren, newChildren) {
  newChildren = normalizeChildren(newChildren)
  oldChildren = oldChildren || []

  const keyed = new Map()
  for (const child of oldChildren) {
    if (child && child.key != null) keyed.set(child.key, child)
  }

  const used = new Set()
  const patchedChildren = []
  let prevDom = null

  for (let i = 0; i < newChildren.length; i++) {
    const next = newChildren[i]
    let old = null

    if (next.key != null) {
      old = keyed.get(next.key) || null
    } else {
      const candidate = oldChildren[i]
      if (candidate && candidate.key == null && !used.has(candidate)) old = candidate
    }

    if (old) used.add(old)

    const ref = prevDom ? prevDom.nextSibling : parent.firstChild
    const patched = patch(parent, old, next, ref)
    if (!patched) continue

    patchedChildren.push(patched)

    if (patched.dom) {
      place(parent, patched.dom, ref)
      prevDom = patched.dom
    }
  }

  for (const child of oldChildren) {
    if (child && !used.has(child) && child.dom && child.dom.parentNode === parent) {
      child.dom.remove()
    }
  }

  return patchedChildren
}

function updateProps(dom, oldProps, newProps) {
  for (const name in oldProps) {
    if (SKIP.has(name)) continue
    if (!(name in newProps)) removeProp(dom, name)
  }

  for (const name in newProps) {
    if (SKIP.has(name)) continue
    if (oldProps[name] !== newProps[name]) setProp(dom, name, newProps[name])
  }
}

function removeProp(dom, name) {
  if (isEvent(name)) {
    const event = name.slice(2).toLowerCase()
    const listener = dom._listeners && dom._listeners[event]
    if (listener) {
      dom.removeEventListener(event, listener)
      delete dom._listeners[event]
    }
    return
  }

  if (name === 'className') return dom.removeAttribute('class')
  if (name === 'style') return (dom.style.cssText = '')
  if (name === 'value') return (dom.value = '')
  if (name === 'checked') return (dom.checked = false)

  dom.removeAttribute(name)
}

function setProp(dom, name, value) {
  if (isEvent(name)) {
    const event = name.slice(2).toLowerCase()
    dom._listeners = dom._listeners || {}

    const previous = dom._listeners[event]
    if (previous) dom.removeEventListener(event, previous)

    if (typeof value === 'function') {
      dom.addEventListener(event, value)
      dom._listeners[event] = value
    } else {
      delete dom._listeners[event]
    }
    return
  }

  if (name === 'className') {
    if (value == null || value === false) dom.removeAttribute('class')
    else dom.setAttribute('class', String(value))
    return
  }

  if (name === 'style') return setStyle(dom, value)

  if (name === 'value') {
    const next = value == null ? '' : String(value)
    if (dom.value !== next) dom.value = next
    return
  }

  if (name === 'checked') return (dom.checked = Boolean(value))
  if (name === 'disabled') return (dom.disabled = Boolean(value))

  if (value == null || value === false) return dom.removeAttribute(name)
  if (value === true) return dom.setAttribute(name, '')

  dom.setAttribute(name, String(value))
}

function setStyle(dom, value) {
  dom.style.cssText = ''
  if (value == null) return

  if (typeof value === 'string') {
    dom.style.cssText = value
    return
  }

  for (const [name, styleValue] of Object.entries(value)) {
    if (styleValue == null || styleValue === false) continue
    if (name.startsWith('--')) dom.style.setProperty(name, String(styleValue))
    else dom.style[name] = styleValue
  }
}
