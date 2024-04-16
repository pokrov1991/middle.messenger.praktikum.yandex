import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { hostAPI } from '../utils'
import { type LoginFormModel } from '../types/user'

const APIInstance = new HTTP(hostAPI)

export default class LoginAPI extends BaseAPI {
  public async request (_data: LoginFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.post('/auth/signin', { data })
  }
}
