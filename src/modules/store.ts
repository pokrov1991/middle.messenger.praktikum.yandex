import EventBus from './event-bus'
import { set } from '../utils/handleObjects'
import { type Indexed } from '../types/global'

export enum StoreEvents {
  Updated = 'updated',
}

class Store extends EventBus {
  private readonly state: Indexed = {}

  constructor () {
    super()
    this.on(StoreEvents.Updated, () => {
      console.log('Store updated', this.state)
    })
  }

  public getState (): Indexed {
    return this.state
  }

  public set (path: string, value: unknown): void {
    set(this.state, path, value)

    this.emit(StoreEvents.Updated)
  }
}

export default new Store()
