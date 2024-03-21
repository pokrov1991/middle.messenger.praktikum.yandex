import Mediator from '../modules/mediator'
const bus = new Mediator()

interface DataLogin {
  login: string
  password: string
}

export default class UserService {
  constructor () {
    bus.on('user:login', (data: DataLogin) => {
      this.login(data)
    })
  }

  init () {
    console.log('init user-service')
  }

  login (data: DataLogin) {
    console.log('Login', data)
  }
}
