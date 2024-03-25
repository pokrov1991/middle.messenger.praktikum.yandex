import Handlebars from 'handlebars'
import EventBus from './event-bus'
import { v4 as makeUUID } from 'uuid'
import { type Props } from '../types/global'

interface Meta {
  tagName: string
  props: object | null
}

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render'
  }

  _element: HTMLElement | null = null
  _meta: Meta
  _id: string

  eventBus: () => EventBus<string, Record<string, any[]>>
  children: Props
  lists: object
  props: object

  constructor (tagName = 'div', propsAndChildren = {}) {
    const eventBus = new EventBus()

    const { children, lists, props } = this._getChildren(propsAndChildren)

    this._meta = {
      tagName,
      props
    }

    this._id = makeUUID()

    this.children = children

    this.lists = lists

    this.props = this._makePropsProxy({ ...props, _id: this._id })

    this.eventBus = () => eventBus

    this._registerEvents(eventBus)

    eventBus.emit(Block.EVENTS.INIT)
  }

  _registerEvents (eventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
  }

  _createResources () {
    const { tagName } = this._meta
    this._element = this._createDocumentElement(tagName)
  }

  _createDocumentElement (tagName) {
    const element = document.createElement(tagName)
    element.setAttribute('data-id', this._id)
    return element
  }

  _componentDidMount () {
    this.componentDidMount()

    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount()
    })
  }

  _componentDidUpdate (oldProps, newProps) {
    const response = this.componentDidUpdate(oldProps, newProps)
    if (!response) {
      return
    }
    this._render()
  }

  _makePropsProxy (props) {
    const self = this

    return new Proxy(props, {
      get (target, prop) {
        const value = target[prop]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set (target, prop, value) {
        const oldTarget = { ...target }

        target[prop] = value

        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target)
        return true
      },
      deleteProperty () {
        throw new Error('Нет доступа')
      }
    })
  }

  _addEvents () {
    const { events = {} } = this.props as { events?: object }

    Object.keys(events).forEach(eventName => {
      this._element?.addEventListener(eventName, events[eventName] as EventListener)
    })

    // Добавляем евенты компонентов из листа
    // Object.values(this.lists).forEach(list => {
    //   const { events = {} } = list[0].props as { events?: object }

    //   Object.keys(events).forEach(eventName => {
    //     this._element?.addEventListener(eventName, events[eventName] as EventListener)
    //   })
    // })
  }

  _removeEvents () {
    const { events = {} } = this.props as { events?: object }

    Object.keys(events).forEach(eventName => {
      this._element?.removeEventListener(eventName, events[eventName] as EventListener)
    })
  }

  _getChildren (propsAndChildren) {
    const children = {}
    const lists = {}
    const props = {}

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value
      } else if (Array.isArray(value)) {
        lists[key] = value
      } else {
        props[key] = value
      }
    })

    return { children, lists, props }
  }

  _render () {
    const block = this.render()

    this._removeEvents()

    if (this._element !== null) {
      this._element.innerHTML = ''

      // Добавления компонента, заменой обертки с id
      const newElement = block.firstElementChild as HTMLElement
      if (this._element) {
        this._element.replaceWith(newElement)
      }
      this._element = newElement
    }

    this._addEvents()
  }

  init () {
    this._createResources()
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
  }

  componentDidMount () {}

  componentDidUpdate (_oldProps, _newProps) {
    return true
  }

  dispatchComponentDidMount () {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  get element () {
    return this._element
  }

  getContent () {
    return this.element
  }

  setProps = nextProps => {
    if (!nextProps) {
      return
    }

    Object.assign(this.props, nextProps)
  }

  compile (template, props) {
    const propsAndStubs = { ...props }

    // Добавляем заглушки для дочерних компонентов
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`
    })

    // Добавляем заглушки для списков
    Object.entries(this.lists).forEach(([key, list]) => {
      propsAndStubs[key] = `<div data-id="list-${list._id}"></div>`
    })

    const fragment = this._createDocumentElement('template')

    const templator = Handlebars.compile(template)
    fragment.innerHTML = templator({ ...propsAndStubs })

    // Заменяем заглушку дочерних на компонент из шаблона
    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
      stub.replaceWith(child.getContent())
    })

    // Заменяем заглушку листов на компонент из шаблона
    Object.values(this.lists).forEach(list => {
      const fragmentList = this._createDocumentElement('template')
      list.forEach(item => {
        if (item instanceof Block) {
          fragmentList.content.append(item.getContent())
        } else {
          fragmentList.content.append(`${item}`)
        }
        // Если используем ивенты из _addEvents
        // const templator = Handlebars.compile(item._element.outerHTML)
        // fragmentList.innerHTML += templator({ ...propsAndStubs })
      })

      const stub = fragment.content.querySelector(`[data-id="list-${list._id}"]`)
      stub.replaceWith(fragmentList.content)
    })

    return fragment.content
  }

  render (): HTMLElement {
    return document.createElement('div')
  }

  show () {
    const content = this.getContent()
    if (content !== null) {
      content.style.display = 'block'
    }
  }

  hide () {
    const content = this.getContent()
    if (content !== null) {
      content.style.display = 'none'
    }
  }
}
