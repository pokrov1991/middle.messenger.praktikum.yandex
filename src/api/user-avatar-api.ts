import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'

const APIInstance = new HTTP('https://ya-praktikum.tech/api/v2')

export default class UserAvatarAPI extends BaseAPI {
  public async update (_data: Record<string, FormData>): Promise<XMLHttpRequest> {
    return await APIInstance.put('/user/profile/avatar', _data)
  }
}
