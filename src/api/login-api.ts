import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { type LoginFormModel } from '../types/user'

const authAPIInstance = new HTTP()

export default class LoginAPI extends BaseAPI {
  public async request (_data: LoginFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await authAPIInstance.post('https://ya-praktikum.tech/api/v2/auth/signin', { data })
  }
}
