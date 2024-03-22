export type Listener<T extends unknown[] = any[]> = (args: T) => void

export default class Mediator<E extends string = string, M extends { [K in E]: unknown[] } = Record<E, any[]> > {
  private listeners: { [K in E]?: Array<Listener<M[E]>> } = {}
  static __instance: object

  constructor () {
    // Логика инициализации синглтона
    if (Mediator.__instance) {
      return Mediator.__instance as Mediator<E, M>
    }

    Mediator.__instance = this
  }

  on (event: E, callback: Listener<M[E]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]?.push(callback)
  }

  off (event: E, callback: Listener<M[E]>) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`)
    }

    this.listeners[event] = this.listeners[event]?.filter(
      listener => listener !== callback
    )
  }

  emit (event: E, ...args: M[E]) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`)
    }

    this.listeners[event]?.forEach(function (listener: (...args: any[]) => void) {
      listener(...args)
    })
  }
}
