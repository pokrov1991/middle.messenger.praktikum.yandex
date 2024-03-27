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

class HTTPTransport {
  _queryStringify (data: Record<string, string | number | boolean>): string {
    const queryString = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&')
    return queryString
  }

  async get (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHOD.GET })
  }

  async post (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHOD.POST })
  }

  async put (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHOD.PUT })
  }

  async patch (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHOD.PATCH })
  }

  async delete (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHOD.DELETE })
  }

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
        xhr.send(data as unknown as XMLHttpRequestBodyInit)
      }
    })
  };
}

const testRequest = new HTTPTransport().get('https://ya.ru')
console.log(testRequest)
