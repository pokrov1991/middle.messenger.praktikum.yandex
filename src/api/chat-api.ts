import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { type ChatAddFormModel, type ChatRemoveFormModel, type ChatListRequestQuery } from '../types/chat'

const APIInstance = new HTTP('https://ya-praktikum.tech/api/v2')

export default class ChatAPI extends BaseAPI {
  public async create (_data: ChatAddFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.post('/chats', { data })
  }

  public async request (_data: ChatListRequestQuery): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.get('/chats', { data })
  }

  public async delete (_data: ChatRemoveFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.delete('/chats', { data })
  }
}
