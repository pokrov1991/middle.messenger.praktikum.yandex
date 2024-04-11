enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

interface Options {
  method: METHOD
  data?: Record<string, string | number | boolean> | XMLHttpRequestBodyInit
}

type OptionsWithoutMethod = Omit<Options, 'method'>

type HTTPMethod = (url: string, options: OptionsWithoutMethod) => Promise<XMLHttpRequest>

export default class HTTP {
  private readonly _host: string

  constructor (host: string) {
    this._host = host
  }

  private _queryStringify (data: Record<string, string | number | boolean> | XMLHttpRequestBodyInit): string {
    const queryString = Object.keys(data)
      .map(key => {
        if (typeof key === 'string' && (data as Record<string, string | number | boolean>)[key] !== undefined) {
          return `${encodeURIComponent(key)}=${encodeURIComponent((data as Record<string, string | number | boolean>)[key])}`
        }
        return ''
      })
      .join('&')
    return queryString
  }

  private readonly _createHTTPMethod = (method: METHOD): HTTPMethod => {
    return async (url: string, options: OptionsWithoutMethod = {}) => {
      const data = options instanceof FormData ? { method, data: options } : { ...options, method }
      return await this.request(`${this._host}${url}`, data)
    }
  }

  get: HTTPMethod = this._createHTTPMethod(METHOD.GET)
  post: HTTPMethod = this._createHTTPMethod(METHOD.POST)
  put: HTTPMethod = this._createHTTPMethod(METHOD.PUT)
  patch: HTTPMethod = this._createHTTPMethod(METHOD.PATCH)
  delete: HTTPMethod = this._createHTTPMethod(METHOD.DELETE)

  async request (url: string, options: Options): Promise<XMLHttpRequest> {
    const { method, data } = options

    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const isGet: boolean = method === METHOD.GET
      const isFile: boolean = data instanceof FormData

      let xhrUrl = url
      if (isGet && !isFile && typeof data !== 'undefined') {
        const dataQuery = data
        xhrUrl = `${url}${this._queryStringify(dataQuery)}`
      }

      xhr.open(
        method,
        xhrUrl
      )

      xhr.withCredentials = true

      xhr.onload = function () {
        resolve(xhr)
      }

      xhr.onabort = reject
      xhr.onerror = reject
      xhr.ontimeout = reject

      if (isGet) {
        xhr.send()
      } else if (isFile) {
        xhr.send(data as XMLHttpRequestBodyInit)
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))
      }
    })
  }
}
