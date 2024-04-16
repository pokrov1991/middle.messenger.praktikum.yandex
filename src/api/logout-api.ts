import HTTP from '../modules/http'
import BaseAPI from '../modules/http/base-api'
import { hostAPI } from '../utils'

const APIInstance = new HTTP(hostAPI)

export default class LogoutAPI extends BaseAPI {
  public async request (): Promise<XMLHttpRequest> {
    return await APIInstance.post('/auth/logout', {})
  }
}
