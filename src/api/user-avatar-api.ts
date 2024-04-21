import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { hostAPI } from '../utils'

const APIInstance = new HTTP(hostAPI)

export default class UserAvatarAPI extends BaseAPI {
  public async update (_data: Record<string, FormData>): Promise<XMLHttpRequest> {
    return await APIInstance.put('/user/profile/avatar', _data)
  }
}
