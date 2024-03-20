import Handlebars from 'handlebars'
import { v4 as makeUUID } from 'uuid'
import EventBus from './EventBus'

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render'
  }

  _element = null
  _meta = null
  _id = null

  /** JSDoc
   * @param {string} tagName
   * @param {Object} propsAndChildren
   *
   * @returns {void}
   */
  constructor (tagName = 'div', propsAndChildren = {}) {
    const eventBus = new EventBus()

    const { children, props } = this._getChildren(propsAndChildren)

    this._meta = {
      tagName,
      props
    }

    // Генерируем уникальный UUID V4
    this._id = makeUUID()

    this.children = children

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

  init () {
    this._createResources()

    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
  }

  _componentDidMount () {
    this.componentDidMount()

    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount()
    })
  }

  componentDidMount (oldProps) {}

  dispatchComponentDidMount () {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  _componentDidUpdate (oldProps, newProps) {
    const response = this.componentDidUpdate(oldProps, newProps)
    if (!response) {
      return
    }
    this._render()
  }

  componentDidUpdate (oldProps, newProps) {
    return true
  }

  setProps = nextProps => {
    if (!nextProps) {
      return
    }

    Object.assign(this.props, nextProps)
  }

  get element () {
    return this._element
  }

  _addEvents () {
    const { events = {} } = this.props

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(events).forEach(eventName => {
      this._element.addEventListener(eventName, events[eventName])
    })
  }

  _removeEvents () {
    const { events = {} } = this.props

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(events).forEach(eventName => {
      this._element.removeEventListener(eventName, events[eventName])
    })
  }

  _render () {
    const block = this.render()
    // Этот небезопасный метод для упрощения логики
    // Используйте шаблонизатор из npm или напишите свой безопасный
    // Нужно не в строку компилировать (или делать это правильно),
    // либо сразу в DOM-элементы возвращать из compile DOM-ноду

    this._removeEvents()

    this._element.innerHTML = ''
    // Реализация добавления компонента, в обертку с id
    // this._element.appendChild(block)

    // Реализация добавления компонента, заменой обертки с id
    const newElement = block.firstElementChild
    if (this._element) {
      this._element.replaceWith(newElement)
    }
    this._element = newElement

    this._addEvents()
  }

  render () {
    return true
  }

  getContent () {
    return this.element
  }

  compile (template, props) {
    const propsAndStubs = { ...props }

    // Доюавляем заглушки для дочерних компонентов
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`
    })

    const fragment = this._createDocumentElement('template')

    const templator = Handlebars.compile(template)
    fragment.innerHTML = templator({ ...propsAndStubs })

    // Заменяем заглушку на компонент из шаблона
    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
      stub.replaceWith(child.getContent())
    })

    return fragment.content
  }

  _getChildren (propsAndChildren) {
    const children = {}
    const props = {}

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value
      } else {
        props[key] = value
      }
    })

    return { children, props }
  }

  _makePropsProxy (props) {
    // Можно и так передать this
    // Такой способ больше не применяется с приходом ES6+
    const self = this

    return new Proxy(props, {
      get (target, prop) {
        const value = target[prop]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set (target, prop, value) {
        target[prop] = value

        // Запускаем обновление компоненты
        // Плохой cloneDeep, в следующей итерации нужно заставлять добавлять cloneDeep им самим
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, { ...target }, target)
        return true
      },
      deleteProperty () {
        throw new Error('Нет доступа')
      }
    })
  }

  _createDocumentElement (tagName) {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    const element = document.createElement(tagName)
    element.setAttribute('data-id', this._id)
    return element
  }

  show () {
    this.getContent().style.display = 'block'
  }

  hide () {
    this.getContent().style.display = 'none'
  }
}
