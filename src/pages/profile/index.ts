import './profile.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import UserService from '../../services/user-service'
import { type Props, type DataUserField, type DataUser } from '../../types/global'
import { layoutProfile } from './../../layouts'
import { profile, profileItem } from './../../blocks'
import { link, title } from './../../ui'

export async function profilePage (): Promise<Block> {
  const pagePromise = await import('./profile.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutProfilePromise = await layoutProfile()
  const LayoutProfile = layoutProfilePromise.LayoutProfile

  const profilePromise = await profile()
  const Profile = profilePromise.Profile
  const profileItemPromise = await profileItem()
  const ProfileItem = profileItemPromise.ProfileItem

  const linkPromise = await link()
  const Link = linkPromise.Link
  const titlePromise = await title()
  const Title = titlePromise.Title

  // Регистрация шаблонов
  Object.entries({
    LayoutProfile,
    Profile,
    ProfileItem,
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
    }

    render (): HTMLElement {
      return this.compile(Profile, this.props) as unknown as HTMLElement
    }
  }

  class BlockProfilePage extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонента страницы
  const cProfile = new BlockProfile({
    FieldsList: dataUserFieldsList.map(item => new BlockField(item))
  })

  const cProfilePage = new BlockProfilePage({
    title: dataUser?.name,
    Profile: cProfile
  })

  return cProfilePage
}
