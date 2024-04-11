import './profile-edit.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import Validation from '../../modules/validation'
import UserService from '../../services/user-service'
import { type Props, type DataUserField, type DataUser } from '../../types/global'
import { layoutProfile } from './../../layouts'
import { profile } from './../../blocks'
import { inputText, popup } from './../../components'
import { input, button, link, title } from './../../ui'
import { onSubmit } from './profile-edit'

export async function profileEdit (): Promise<Block> {
  const pagePromise = await import('./profile-edit.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutProfilePromise = await layoutProfile()
  const LayoutProfile = layoutProfilePromise.LayoutProfile

  const profilePromise = await profile()
  const Profile = profilePromise.Profile

  const inputTextPromise = await inputText()
  const InputText = inputTextPromise.InputText
  const popupPromise = await popup()
  const Popup = popupPromise.Popup

  const inputPromise = await input()
  const Input = inputPromise.Input
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
    Popup,
    Input,
    Button,
    Link,
    Title
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  // Методы и переменные
  const bus = new Mediator()
  const validation = new Validation([])
  let dataUserFieldsList: DataUserField[] = []
  let dataUser: DataUser = {
    name: '',
    srcAvatar: ''
  }

  // Слушатели
  bus.on('form:vaidated', (payload) => {
    const { isValid } = payload as unknown as Props
    cButton.setProps({
      disabled: (isValid ?? false) ? '' : 'disabled'
    })
  })

  bus.on('user:get-user', ([userFieldsList, userData]) => {
    dataUserFieldsList = userFieldsList as unknown as DataUserField[]
    dataUser = userData
  })

  // Инициализация сервиса
  const userService = new UserService()
  userService.init(true)

  // Создание классов компонентов
  class BlockButton extends Block {
    constructor (props: Props) {
      super('button', props)
    }

    render (): HTMLElement {
      return this.compile(Button, this.props) as unknown as HTMLElement
    }
  }

  class BlockInputText extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render (): HTMLElement {
      return this.compile(InputText, this.props) as unknown as HTMLElement
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

  class BlockProfileEditPage extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонентов
  const cButton = new BlockButton({
    text: 'Сохранить',
    events: {
      click: onSubmit
    }
  })

  // Создание компонента страницы
  const cProfile = new BlockProfile({
    isEdit: true,
    InputList: dataUserFieldsList.map(item => {
      item.isValid = false
      item.required = 'required'
      item.textValid = 'Неверно заполненное поле'
      item.events = {
        focusout: (event: InputEvent) => {
          switch (item.name) {
            case 'email':
              validation.onValidateEmail(event, 'email')
              break
            case 'login':
              validation.onValidateLogin(event, 'login')
              break
            case 'first_name':
              validation.onValidateName(event, 'first_name')
              break
            case 'second_name':
              validation.onValidateName(event, 'second_name')
              break
            case 'display_name':
              validation.onValidateName(event, 'display_name')
              break
            case 'phone':
              validation.onValidatePhone(event, 'phone')
              break
          }
        }
      }
      return new BlockInputText(item)
    })
  })

  const cProfileEditPage = new BlockProfileEditPage({
    title: 'Изменить данные',
    srcAvatar: dataUser?.srcAvatar,
    popupTitle: 'Загрузите файл',
    Profile: cProfile,
    Button: cButton
  })

  return cProfileEditPage
}
