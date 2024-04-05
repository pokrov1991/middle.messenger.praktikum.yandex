import Mediator from '../modules/mediator'
import { type DataUserField, type DataUser } from '../types/global'
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

interface DataEdit {
  email: string
  login: string
  firstName: string
  secondName: string
  displayName: string
  phone: string
}

interface DataPassword {
  oldPassword: string
  newPassword: string
}

export default class UserService {
  static __instance: UserService
  private _userFieldsList!: DataUserField[]
  private _userData!: DataUser | null

  constructor () {
    if (typeof UserService.__instance !== 'undefined') {
      return UserService.__instance
    }

    this._userFieldsList = []
    this._userData = null

    bus.on('user:login', (data) => {
      const { login, password } = data as unknown as DataLogin
      this.login({ login, password })
    })

    bus.on('user:signin', (data) => {
      const { email, login, firstName, secondName, phone, password } = data as unknown as DataSignin
      this.signin({ email, login, firstName, secondName, phone, password })
    })

    bus.on('user:edit', (data) => {
      const { email, login, firstName, secondName, displayName, phone } = data as unknown as DataEdit
      this.edit({ email, login, firstName, secondName, displayName, phone })
    })

    bus.on('user:edit-password', (data) => {
      const { oldPassword, newPassword } = data as unknown as DataPassword
      this.editPassword({ oldPassword, newPassword })
    })

    UserService.__instance = this
  }

  init (isAuth: boolean = false): void {
    console.log('init user-service')

    if (isAuth) {
      this.getUser()
    }
  }

  login (data: DataLogin): void {
    console.log('Login send', data)
  }

  signin (data: DataSignin): void {
    console.log('Signin send', data)
  }

  edit (data: DataEdit): void {
    console.log('Profile edit send', data)
  }

  editPassword (data: DataPassword): void {
    console.log('Profile password send', data)
  }

  getUser (): void {
    const dataUserFieldsList: DataUserField[] = [
      {
        id: 'email',
        name: 'email',
        label: 'Почта',
        value: 'pochta@yandex.ru'
      },
      {
        id: 'login',
        name: 'login',
        label: 'Логин',
        value: 'ivanivanov'
      },
      {
        id: 'first_name',
        name: 'first_name',
        label: 'Имя',
        value: 'Иван'
      },
      {
        id: 'second_name',
        name: 'second_name',
        label: 'Фамилия',
        value: 'Иванов'
      },
      {
        id: 'display_name',
        name: 'display_name',
        label: 'Имя в чате',
        value: 'Иван'
      },
      {
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        value: '+79099673030'
      }
    ]
    const dataUser: DataUser = {
      name: 'Иван',
      srcAvatar: ''
    }

    if (this._userFieldsList.length === 0) {
      this._userFieldsList = dataUserFieldsList
    }

    if (this._userData !== null) {
      this._userData = dataUser
    }

    bus.emit('user:get-user', [this._userFieldsList, this._userData])
  }
}
