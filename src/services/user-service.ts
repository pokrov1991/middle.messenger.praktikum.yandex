import Mediator from '../modules/mediator'
import SigninAPI from '../api/signin-api'
import LoginAPI from '../api/login-api'
import { type LoginFormModel, type SigninFormModel, type ProfileEditFormModel, type ProfilePasswordFormModel } from '../types/user'
import { type DataUserField, type DataUser } from '../types/global'

const bus = new Mediator()
const signinAPI = new SigninAPI()
const loginApi = new LoginAPI()

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
      this.login(data as unknown as LoginFormModel)
    })

    bus.on('user:signin', (data) => {
      this.signin(data as unknown as SigninFormModel)
    })

    bus.on('user:edit', (data) => {
      this.edit(data as unknown as ProfileEditFormModel)
    })

    bus.on('user:edit-password', (data) => {
      this.editPassword(data as unknown as ProfilePasswordFormModel)
    })

    UserService.__instance = this
  }

  init (isAuth: boolean = false): void {
    console.log('init user-service')

    if (isAuth) {
      this.getUser()
    }
  }

  login (data: LoginFormModel): void {
    console.log('Login send', data)

    void loginApi.request(data)
      .then((res) => {
        console.log('Login response', res)

        if (res.status === 200) {
          console.log('response', res.response)
        } else {
          console.log('error', JSON.parse(res.response as string))
        }
      })
  }

  signin (data: SigninFormModel): void {
    console.log('Signin send', data)

    void signinAPI.create(data)
      .then((res) => {
        console.log('Signin response', res)

        const response = JSON.parse(res.response as string)
        if (res.status === 200) {
          console.log('response', response)
          const userID = response.id
          console.log('userID', userID)
        } else {
          console.log('error', response)
        }
      })
  }

  edit (data: ProfileEditFormModel): void {
    console.log('Profile edit send', data)
  }

  editPassword (data: ProfilePasswordFormModel): void {
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
