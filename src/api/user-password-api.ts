import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { hostAPI } from '../utils'
import { type ProfilePasswordFormModel } from '../types/user'

const APIInstance = new HTTP(hostAPI)

export default class UserEditAPI extends BaseAPI {
  public async update (_data: ProfilePasswordFormModel): Promise<XMLHttpRequest> {
    const data = { ..._data }
    return await APIInstance.put('/user/password', { data })
  }
}
