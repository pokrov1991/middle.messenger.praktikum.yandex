import Mediator from '../modules/mediator'
const bus = new Mediator()

interface DataLogin {
  login: string
  password: string
}

interface DataSignin {
  email: string
  login: string
  firstName: string
  secondName: string
  phone: string
  password: string
}

export default class UserService {
  constructor () {
    bus.on('user:login', (data) => {
      const { login, password } = data as unknown as DataLogin
      this.login({ login, password })
    })

    bus.on('user:signin', (data) => {
      const { email, login, firstName, secondName, phone, password } = data as unknown as DataSignin
      this.signin({ email, login, firstName, secondName, phone, password })
    })
  }

  init () {
    console.log('init user-service')
  }

  login (data: DataLogin) {
    console.log('Login send', data)
  }

  signin (data: DataSignin) {
    console.log('Signin send', data)
  }
}
