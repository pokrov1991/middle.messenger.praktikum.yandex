import Mediator from '../modules/mediator'
import SigninAPI from '../api/signin-api'
import LoginAPI from '../api/login-api'
import LogoutAPI from '../api/logout-api'
import UserAPI from '../api/user-api'
import UserEditAPI from '../api/user-edit-api'
import store, { StoreEvents } from '../modules/store'
import logger from './decorators/logger'
import toRoute from '../utils/toRoute'
import checkErrorStatus from '../utils/checkErrorStatus'
import { type LoginFormModel, type SigninFormModel, type ProfileEditFormModel, type ProfilePasswordFormModel, type UserResponse } from '../types/user'
import { type Indexed, type DataUserField, type DataUser } from '../types/global'

const bus = new Mediator()
const signinAPI = new SigninAPI()
const loginApi = new LoginAPI()
const logoutApi = new LogoutAPI()
const userApi = new UserAPI()
const userEditAPI = new UserEditAPI()

export default class UserService {
  static __instance: UserService
  private _userFieldsList!: DataUserField[]
  private _userData!: DataUser | null
  public isAuth: boolean | undefined

  constructor () {
    if (typeof UserService.__instance !== 'undefined') {
      return UserService.__instance
    }

    this._userFieldsList = []
    this._userData = null
    this.isAuth = false

    bus.on('user:login', (data) => {
      this.login(data as unknown as LoginFormModel)
    })

    bus.on('user:signin', (data) => {
      this.signin(data as unknown as SigninFormModel)
    })

    bus.on('user:logout', () => {
      this.logout()
    })

    bus.on('user:edit', (data) => {
      this.edit(data as unknown as ProfileEditFormModel)
    })

    bus.on('user:edit-password', (data) => {
      this.editPassword(data as unknown as ProfilePasswordFormModel)
    })

    store.on(StoreEvents.Updated, () => {
      this.getUser()
    })

    UserService.__instance = this
  }

  init (isAuth: boolean = false): void {
    console.log('init user-service')

    if (isAuth) {
      this.getUser()
    }
  }

  @logger
  login (data: LoginFormModel): void {
    // TODO - isLoaded = true
    void loginApi.request(data)
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)

        if (res.response === 'OK') {
          void this.auth()

          await toRoute('/main')
        }
        // TODO - isLoaded = false
      })
  }

  @logger
  signin (data: SigninFormModel): void {
    void signinAPI.create(data)
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)

        void this.auth()

        await toRoute('/main')
      })
  }

  logout (): void {
    void logoutApi.request()
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)

        await toRoute('/')

        this.isAuth = false
      })
  }

  async auth (): Promise<void> {
    await userApi.request()
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)

        this.isAuth = true

        const response = JSON.parse(res.response as string)

        store.set('user', response)
      })
      .catch(async (_error) => {
        if (this.isAuth !== true) {
          await toRoute('/')
        }
      })
  }

  @logger
  edit (data: ProfileEditFormModel): void {
    void userEditAPI.update(data)
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)

        const response = JSON.parse(res.response as string)

        store.set('user', response)

        await toRoute('/profile')
      })
  }

  editPassword (data: ProfilePasswordFormModel): void {
    console.log('Profile password send', data)
  }

  getUser (): void {
    const state: Indexed<UserResponse> = store.getState() as Indexed<UserResponse>
    const stateUser = state.user

    const dataUserFieldsList: DataUserField[] = [
      {
        id: 'email',
        name: 'email',
        label: 'Почта',
        value: stateUser.email
      },
      {
        id: 'login',
        name: 'login',
        label: 'Логин',
        value: stateUser.login
      },
      {
        id: 'first_name',
        name: 'first_name',
        label: 'Имя',
        value: stateUser.first_name
      },
      {
        id: 'second_name',
        name: 'second_name',
        label: 'Фамилия',
        value: stateUser.second_name
      },
      {
        id: 'display_name',
        name: 'display_name',
        label: 'Имя в чате',
        value: stateUser.display_name
      },
      {
        id: 'phone',
        name: 'phone',
        label: 'Телефон',
        value: stateUser.phone
      }
    ]
    const dataUser: DataUser = {
      name: stateUser.first_name,
      srcAvatar: stateUser.avatar
    }

    this._userFieldsList = dataUserFieldsList
    this._userData = dataUser

    bus.emit('user:get-user', [this._userFieldsList, this._userData])
  }
}
