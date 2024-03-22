import Mediator from '../modules/mediator'
const bus = new Mediator()

interface DataLogin {
  login: string
  password: string
}

export default class UserService {
  constructor () {
    bus.on('user:login', (data) => {
      const { login, password } = data as unknown as DataLogin
      this.login({ login, password })
    })
  }

  init () {
    console.log('init user-service')
  }

  login (data: DataLogin) {
    console.log('Login send', data)
  }
}
