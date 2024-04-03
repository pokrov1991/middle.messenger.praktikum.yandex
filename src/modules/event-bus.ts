export type Listener<T extends unknown[] = any[]> = (args: T) => void

export default class EventBus<E extends string = string, M extends { [K in E]: unknown[] } = Record<E, any[]> > {
  private listeners: Record<string, any[]> = {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  on (event: E, callback: Function): void {
    if (typeof this.listeners[event] === 'undefined') {
      this.listeners[event] = []
    }
    this.listeners[event]?.push(callback)
  }

  off (event: E, callback: Listener<M[E]>): void {
    if (typeof this.listeners[event] === 'undefined') {
      throw new Error(`Нет события: ${event}`)
    }

    this.listeners[event] = this.listeners[event]?.filter(
      listener => listener !== callback
    )
  }

  emit (event: E, ...args: M[E]): void {
    if (typeof this.listeners[event] === 'undefined') {
      throw new Error(`Нет события: ${event}`)
    }

    this.listeners[event]?.forEach(function (listener: (...args: any[]) => void) {
      listener(...args)
    })
  }
}
