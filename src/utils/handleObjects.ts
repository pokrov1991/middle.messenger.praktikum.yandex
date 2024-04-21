import store, { StoreEvents } from '../modules/store'
import type Block from '../modules/block'
import { type Props, type Indexed } from '../types/global'

export function isEqual (a: object, b: object): boolean {
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!(key in b)) {
      return false
    }

    const valueA = (a as Record<string, unknown>)[key]
    const valueB = (b as Record<string, unknown>)[key]

    if (typeof valueA === 'object' && typeof valueB === 'object' && valueA !== null && valueB !== null) {
      if (!isEqual(valueA, valueB)) {
        return false
      }
    } else if (valueA !== valueB) {
      return false
    }
  }

  return true
}

export function merge (lhs: Indexed, rhs: Indexed): Indexed {
  for (const p in rhs) {
    if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
      continue
    }

    try {
      if (typeof rhs[p] === 'object' && rhs[p] !== null) {
        rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed)
      } else {
        lhs[p] = rhs[p]
      }
    } catch (e) {
      lhs[p] = rhs[p]
    }
  }

  return lhs
}

export function set (object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
  if (typeof object !== 'object' || object === null) {
    return object
  }

  if (typeof path !== 'string') {
    throw new Error('path must be string')
  }

  const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
    [key]: acc
  }), value as Indexed)
  return merge(object as Indexed, result)
}

export function connect (Component: typeof Block, mapStateToProps: (state: Indexed) => Indexed): typeof Block {
  return class extends Component {
    constructor (...args: [string, Props]) {
      let state = mapStateToProps(store.getState())

      super(...args)

      store.on(StoreEvents.Updated, () => {
        const newState = mapStateToProps(store.getState())

        if (!isEqual(state, newState)) {
          this.setProps({ ...newState })
        }

        state = newState
      })
    }
  }
}
