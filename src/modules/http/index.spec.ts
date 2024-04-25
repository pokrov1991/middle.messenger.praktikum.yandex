import { expect } from 'chai'
import { stub, type SinonStub } from 'sinon'
import HTTP from './index'
import { hostAPI } from '../../utils'

describe('Модуль отправки запросов HTTP', () => {
  let http: HTTP
  let methodStub: SinonStub<any>

  beforeEach(() => {
    http = new HTTP(hostAPI)
  })

  afterEach(() => {
    methodStub.restore()
  })

  it('должен обрабатывать GET-запрос', async () => {
    // Создание заглушки (mock) для метода get
    const dataResponse = {
      unread_count: 12
    }
    const mockResponse = Promise.resolve(dataResponse as unknown as XMLHttpRequest)
    methodStub = stub(http, 'get').resolves(await mockResponse)

    const response = http.get('/chats/new/1', { data: { id: 1 } })

    // Проверка ожидаемых свойств ответа
    await response.then((result) => {
      expect(result).to.have.property('unread_count', 12)
    })
  })

  it('должен обрабатывать POST-запрос', async () => {
    const dataResponse = [
      { token: 'md64token-test' }
    ]
    const mockResponse = Promise.resolve(dataResponse as unknown as XMLHttpRequest)
    methodStub = stub(http, 'post').resolves(await mockResponse)

    const response = http.post('/chats/token/1', { data: { id: 1 } })

    await response.then((result) => {
      expect(result).to.deep.include({ token: 'md64token-test' })
    })
  })

  it('должен обрабатывать PUT-запрос', async () => {
    const dataResponse = 'OK'
    const mockResponse = Promise.resolve(dataResponse as unknown as XMLHttpRequest)
    methodStub = stub(http, 'put').resolves(await mockResponse)

    const response = http.put('/chats/users', { data: { users: 1, chatId: 1 } })

    await response.then((result) => {
      expect(result).to.have.string('OK')
    })
  })

  it('должен обрабатывать DELETE-запрос', async () => {
    const dataResponse = {
      reason: 'success'
    }
    const mockResponse = Promise.resolve(dataResponse as unknown as XMLHttpRequest)
    methodStub = stub(http, 'delete').resolves(await mockResponse)

    const response = http.delete('/chats/users', { data: { users: 1, chatId: 1 } })

    await response.then((result) => {
      expect(result).to.have.property('reason', 'success')
    })
  })
})
