export default class BaseAPI {
  async create (_data?: any): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  async request (_data?: any): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  update (): void { throw new Error('Метод не реализован') }

  delete (): void { throw new Error('Метод не реализован') }
}
