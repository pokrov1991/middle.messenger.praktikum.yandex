import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { type ChatUserActionFormModel } from '../types/chat'

const APIInstance = new HTTP('https://ya-praktikum.tech/api/v2')

export default class SigninAPI extends BaseAPI {
  public async create (_data: ChatUserActionFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.put('/chats/users', { data })
  }

  public async delete (_data: ChatUserActionFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.delete('/chats/users', { data })
  }
}
