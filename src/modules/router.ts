import type Block from '../modules/block'
import { type Props } from '../types/global'

function isEqual (lhs: string, rhs: string): boolean {
  return lhs === rhs
}

function render (query: string, block: Block): HTMLElement {
  const root = document.querySelector(query)
  const content = block.getContent()
  if (root !== null && content !== null) {
    root.appendChild(content)
  }
  return root as HTMLElement
}

class Route {
  _pathname: string
  private readonly _blockComponent: Block
  private _block: Block | null
  private readonly _props: Props

  constructor (pathname: string, view: Block, props: Props) {
    this._pathname = pathname
    this._blockComponent = view
    this._block = null
    this._props = props
  }

  navigate (pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname
      this.render()
    }
  }

  leave (): void {
    if (this._block != null) {
      this._block.hide()
    }
  }

  match (pathname: string): boolean {
    return isEqual(pathname, this._pathname)
  }

  render (): void {
    if (this._block == null) {
      this._block = this._blockComponent
      render(String(this._props.rootQuery), this._block)
      return
    }

    this._block.show()
  }
}

export default class Router {
  static __instance: Router
  routes!: Route[]
  history!: History
  private _currentRoute!: Route | null
  private readonly _rootQuery!: string

  constructor (rootQuery: string) {
    if (typeof Router.__instance !== 'undefined') {
      return Router.__instance
    }

    this.routes = []
    this.history = window.history
    this._currentRoute = null
    this._rootQuery = rootQuery

    Router.__instance = this
  }

  use (pathname: string, block: Block): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery })

    let isRoute = false
    this.routes.forEach((item) => {
      if (item._pathname === route._pathname) {
        isRoute = true
      }
    })

    if (!isRoute) {
      this.routes.push(route)
    }

    return this
  }

  start (): void {
    window.onpopstate = (event: PopStateEvent) => {
      if (event.currentTarget instanceof Window) {
        this._onRoute(event.currentTarget.location.pathname)
      }
    }

    this._onRoute(window.location.pathname)
  }

  _onRoute (pathname: string): void {
    const route = this.getRoute(pathname)
    if (route == null) {
      return
    }

    if ((this._currentRoute != null) && this._currentRoute !== route) {
      this._currentRoute.leave()
    }

    this._currentRoute = route
    route.render()
  }

  go (pathname: string): void {
    // {} - state, '' - title
    this.history.pushState({}, '', pathname)
    this._onRoute(pathname)
  }

  back (): void {
    this.history.back()
  }

  forward (): void {
    this.history.forward()
  }

  getRoute (pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname))
  }
}
