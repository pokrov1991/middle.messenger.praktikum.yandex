import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'

const APIInstance = new HTTP('https://ya-praktikum.tech/api/v2')

export default class UserAPI extends BaseAPI {
  public async request (): Promise<XMLHttpRequest> {
    return await APIInstance.get('/auth/user', {})
  }
}
