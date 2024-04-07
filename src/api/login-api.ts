import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { type LoginFormModel } from '../types/user'

const authAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2')

export default class LoginAPI extends BaseAPI {
  public async request (_data: LoginFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await authAPIInstance.post('/auth/signin', { data })
  }
}
