import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { hostAPI } from '../utils'
import { type ChatTokenRequest } from '../types/chat'

const APIInstance = new HTTP(hostAPI)

export default class ChatTokenAPI extends BaseAPI {
  public async request (_data: ChatTokenRequest): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.post(`/chats/token/${data.id}`, { data })
  }
}
