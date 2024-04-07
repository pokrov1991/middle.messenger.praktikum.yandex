enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

interface Options {
  method: METHOD
  data?: Record<string, string | number | boolean>
}

type OptionsWithoutMethod = Omit<Options, 'method'>

type HTTPMethod = (url: string, options: OptionsWithoutMethod) => Promise<XMLHttpRequest>

export default class HTTP {
  private readonly _host: string

  constructor (host: string) {
    this._host = host
  }

  private _queryStringify (data: Record<string, string | number | boolean>): string {
    const queryString = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&')
    return queryString
  }

  private readonly _createHTTPMethod = (method: METHOD): HTTPMethod => {
    return async (url: string, options: OptionsWithoutMethod = {}) => {
      return await this.request(`${this._host}${url}`, { ...options, method })
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

      xhr.open(
        method,
        isGet && typeof data !== 'undefined' ? `${url}${this._queryStringify(data)}` : url
      )

      xhr.onload = function () {
        resolve(xhr)
      }

      xhr.onabort = reject
      xhr.onerror = reject
      xhr.ontimeout = reject

      if (isGet) {
        xhr.send()
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))
      }
    })
  }
}
