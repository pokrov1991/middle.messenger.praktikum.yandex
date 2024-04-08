import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { type SigninFormModel } from '../types/user'

const APIInstance = new HTTP('https://ya-praktikum.tech/api/v2')

export default class SigninAPI extends BaseAPI {
  public async create (_data: SigninFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.post('/auth/signup', { data })
  }
}