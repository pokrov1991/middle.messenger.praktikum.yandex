export default class BaseAPI {
  async create (_data?: unknown): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  async request (_data?: unknown): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  async update (_data: unknown): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }

  async delete (_data: unknown): Promise<XMLHttpRequest> { throw new Error('Метод не реализован') }
}
