import './profile.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import UserService from '../../services/user-service'
import store, { StoreEvents } from '../../modules/store'
import { connect } from '../../utils/handleObjects'
import { routePaths, hostAPI } from '../../utils'
import { type Props, type Indexed } from '../../types/global'
import { type DataUserField, type DataUser } from '../../types/user'
import { layoutProfile } from './../../layouts'
import { profile, profileItem } from './../../blocks'
import { popup } from './../../components'
import { button, link, title } from './../../ui'

export async function profilePage (): Promise<Block> {
  const pagePromise = await import('./profile.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutProfilePromise = await layoutProfile()
  const LayoutProfile = layoutProfilePromise.LayoutProfile

  const profilePromise = await profile()
  const Profile = profilePromise.Profile
  const profileItemPromise = await profileItem()
  const ProfileItem = profileItemPromise.ProfileItem

  const popupPromise = await popup()
  const Popup = popupPromise.Popup

  const buttonPromise = await button()
  const Button = buttonPromise.Button
  const linkPromise = await link()
  const Link = linkPromise.Link
  const titlePromise = await title()
  const Title = titlePromise.Title

  // Регистрация шаблонов
  Object.entries({
    LayoutProfile,
    Profile,
    ProfileItem,
    Popup,
    Button,
    Link,
    Title
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  // Методы и переменные
  const bus = new Mediator()
  let dataUserFieldsList: DataUserField[] = []
  let dataUser: DataUser = {
    name: '',
    srcAvatar: ''
  }

  // Слушатели
  bus.on('user:get-user', ([userFieldsList, userData]) => {
    dataUserFieldsList = userFieldsList as unknown as DataUserField[]
    dataUser = userData
  })

  // Инициализация сервиса
  const userService = new UserService()
  userService.init(true)

  // Создание классов компонентов
  class BlockLink extends Block {
    constructor (props: Props) {
      super('a', props)
    }

    render (): HTMLElement {
      return this.compile(Link, this.props) as unknown as HTMLElement
    }
  }

  class BlockField extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render (): HTMLElement {
      return this.compile(ProfileItem, this.props) as unknown as HTMLElement
    }
  }

  class BlockProfile extends Block {
    constructor (props: Props) {
      super('section', props)

      store.on(StoreEvents.Updated, () => {
        this.setProps({
          FieldsList: dataUserFieldsList.map(item => new BlockField(item))
        })
      })
    }

    componentDidUpdate (oldProps: Props, newProps: Props): boolean {
      if (oldProps.FieldsList !== newProps.FieldsList) {
        this.lists.FieldsList = newProps.FieldsList
      }
      return true
    }

    render (): HTMLElement {
      return this.compile(Profile, this.props) as unknown as HTMLElement
    }
  }

  class BlockProfilePage extends Block {
    constructor (_tagName: string, props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонента страницы
  const cLinkEdit = new BlockLink({
    to: '/settings-edit',
    text: 'Изменить данные'
  })

  const cLinkPassword = new BlockLink({
    to: '/settings-password',
    text: 'Изменить пароль'
  })

  const cLinkExit = new BlockLink({
    text: 'Выйти',
    className: 'c-link_red',
    events: {
      click: () => {
        bus.emit('user:logout')
      }
    }
  })

  const cProfile = new BlockProfile({
    FieldsList: dataUserFieldsList.map(item => new BlockField(item))
  })

  const ConnectProfilePage = connect(BlockProfilePage, (state: any): Indexed => ({
    title: state.user.first_name,
    srcAvatar: state.user.avatar
  }))
  const cProfilePage = new ConnectProfilePage('section', {
    title: dataUser?.name,
    urlBack: routePaths.messenger,
    host: hostAPI,
    srcAvatar: dataUser?.srcAvatar,
    popupTitle: 'Загрузите файл',
    popupType: 'profile',
    Profile: cProfile,
    LinkEdit: cLinkEdit,
    LinkPassword: cLinkPassword,
    LinkExit: cLinkExit
  })

  return cProfilePage
}
