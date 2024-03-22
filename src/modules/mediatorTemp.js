export default class Mediator {
  constructor () {
    // Логика инициализации синглтона
    if (Mediator.__instance) {
      return Mediator.__instance
    }

    Mediator.__instance = this

    // Логика евентбаса
    this.listeners = {}
  }

  on (event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push(callback)
  }

  off (event, callback) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`)
    }

    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    )
  }

  emit (event, ...args) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`)
    }

    this.listeners[event].forEach(function (listener) {
      listener(...args)
    })
  }
}
