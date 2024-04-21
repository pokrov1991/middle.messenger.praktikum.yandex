import Handlebars from 'handlebars'
import EventBus from './event-bus'
import { v4 as makeUUID } from 'uuid'
import { type Props } from '../types/global'

export default class Block {
  private static readonly EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render'
  }

  private _element: HTMLElement | null = null
  private readonly _tagName: string
  protected _id: string
  protected eventBus: () => EventBus<string, Record<string, any[]>>

  children: Record<string, Block>
  lists: Record<string, Block[]>
  props: Props

  constructor (tagName = 'div', propsAndChildren: Props = {}) {
    const eventBus = new EventBus()

    const { children, lists, props } = this._getChildren(propsAndChildren)

    this._tagName = tagName

    this._id = makeUUID()

    this.children = children

    this.lists = lists

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.props = this._makePropsProxy({ ...props, _id: this._id })

    this.eventBus = () => eventBus

    this._registerEvents(eventBus)

    eventBus.emit(Block.EVENTS.INIT)
  }

  private _registerEvents (eventBus: EventBus<string, Record<string, any[]>>): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
  }

  private _createResources (): void {
    const tagName = this._tagName
    this._element = this._createDocumentElement(tagName) as HTMLElement
  }

  private _createDocumentElement (tagName: string): Element {
    const element = document.createElement(tagName)
    element.setAttribute('data-id', this._id)
    return element
  }

  private _componentDidMount (): void {
    this.componentDidMount()

    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount()
    })
  }

  private _componentDidUpdate (oldProps: Props, newProps: Props): void {
    const response = this.componentDidUpdate(oldProps, newProps)
    if (!response) {
      return
    }
    this._render()
  }

  private _makePropsProxy (props: Props): Props {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    return new Proxy(props, {
      get (target, prop) {
        const value = target[prop as string]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set (target, prop, value) {
        const oldTarget = { ...target }

        target[prop as string] = value

        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target)
        return true
      },
      deleteProperty () {
        throw new Error('Нет доступа')
      }
    })
  }

  private _addEvents (): void {
    const { events = {} } = this.props as { events?: Record<string, EventListener> }

    Object.keys(events).forEach(eventName => {
      this._element?.addEventListener(eventName, events[eventName])
    })
  }

  private _removeEvents (): void {
    const { events = {} } = this.props as { events?: Record<string, EventListener> }

    Object.keys(events).forEach(eventName => {
      this._element?.removeEventListener(eventName, events[eventName])
    })
  }

  private _getChildren (propsAndChildren: Props): Props {
    const children: Record<string, Block> = {}
    const lists: Record<string, any[]> = {}
    const props: Record<string, any> = {}

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

  private _render (): void {
    const block = this.render()

    this._removeEvents()

    if (this._element !== null) {
      this._element.innerHTML = ''

      // Добавления компонента, заменой обертки с id
      const newElement = block.firstElementChild as HTMLElement
      this._element.replaceWith(newElement)
      this._element = newElement
    }

    this._addEvents()
  }

  init (): void {
    this._createResources()
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
  }

  componentDidMount (): void {}

  componentDidUpdate (_oldProps: Props, _newProps: Props): boolean {
    return true
  }

  dispatchComponentDidMount (): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  get element (): HTMLElement | null {
    return this._element
  }

  getContent (): HTMLElement | null {
    return this.element
  }

  setProps = (nextProps: Props): void => {
    const isProps: boolean = Object.keys(nextProps).length !== 0
    if (!isProps) {
      return
    }

    Object.assign(this.props, nextProps)
  }

  compile (template: string, props: Props): DocumentFragment {
    const propsAndStubs = { ...props }

    // Добавляем заглушки для дочерних компонентов
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`
    })

    // Добавляем заглушки для списков
    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="list-${key}"></div>`
    })

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement

    const templator = Handlebars.compile(template)
    fragment.innerHTML = templator({ ...propsAndStubs })

    // Заменяем заглушку дочерних на компонент из шаблона
    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
      if (stub !== null) {
        stub.replaceWith(child.getContent() as Node)
      }
    })

    // Заменяем заглушку листов на компонент из шаблона
    Object.entries(this.lists).forEach(([key, list]) => {
      const fragmentList = this._createDocumentElement('template') as HTMLTemplateElement
      list.forEach((item: Block) => {
        if (item instanceof Block) {
          fragmentList.content.append(item.getContent() as unknown as HTMLElement)
        } else {
          fragmentList.content.append(`${String(item)}`)
        }
      })

      const stub = fragment.content.querySelector(`[data-id="list-${key}"]`)
      if (stub !== null) {
        stub.replaceWith(fragmentList.content)
      }
    })

    return fragment.content
  }

  render (): HTMLElement {
    return document.createElement('div')
  }

  show (): void {
    const content = this.getContent()
    if (content !== null) {
      content.style.display = 'flex'
    }
  }

  hide (): void {
    const content = this.getContent()
    if (content !== null) {
      content.style.display = 'none'
    }
  }
}
