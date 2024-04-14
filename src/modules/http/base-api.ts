export default class BaseAPI {
  async create (_data?: any): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  async request (_data?: any): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  async update (_data: any): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  async delete (_data: any): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }
}
