import './profile-password.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import Validation from '../../modules/validation'
import UserService from '../../services/user-service'
import { type Props } from '../../types/global'
import { layoutProfile } from './../../layouts'
import { profile } from './../../blocks'
import { inputPassword } from './../../components'
import { input, button, title } from './../../ui'
import { onSubmit } from './profile-password'

export async function profilePassword (): Promise<HTMLElement | null> {
  const pagePromise = await import('./profile-password.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutProfilePromise = await layoutProfile()
  const LayoutProfile = layoutProfilePromise.LayoutProfile

  const profilePromise = await profile()
  const Profile = profilePromise.Profile

  const inputPasswordPromise = await inputPassword()
  const InputPassword = inputPasswordPromise.InputPassword

  const inputPromise = await input()
  const Input = inputPromise.Input
  const buttonPromise = await button()
  const Button = buttonPromise.Button
  const titlePromise = await title()
  const Title = titlePromise.Title

  // Регистрация шаблонов
  Object.entries({
    LayoutProfile,
    Profile,
    InputPassword,
    Input,
    Button,
    Title
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  // Методы и переменные
  const bus = new Mediator()
  const validation = new Validation(['oldPassword', 'newPassword', 'repeatPassword'])

  // Слушатели
  bus.on('form:vaidated', (payload) => {
    const { isValid } = payload as unknown as Props
    cButton.setProps({
      disabled: (isValid ?? false) ? '' : 'disabled'
    })
  })

  // Инициализация сервиса
  const userService = new UserService()
  userService.init()

  // Создание классов компонентов
  class BlockButton extends Block {
    constructor (props: Props) {
      super('button', props)
    }

    render (): HTMLElement {
      return this.compile(Button, this.props) as unknown as HTMLElement
    }
  }

  class BlockInputPassword extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render (): HTMLElement {
      return this.compile(InputPassword, this.props) as unknown as HTMLElement
    }
  }

  class BlockProfilePasswordPage extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонентов
  const cButton = new BlockButton({
    disabled: 'disabled',
    text: 'Сохранить',
    events: {
      click: onSubmit
    }
  })

  // Создание компонента страницы
  const cProfilePasswordPage = new BlockProfilePasswordPage({
    title: 'Изменить пароль',
    InputList: [
      new BlockInputPassword({
        label: 'Старый пароль',
        textValid: 'Неверный пароль',
        id: 'oldPassword',
        name: 'oldPassword',
        required: 'required',
        isValid: false,
        events: {
          focusout: (event: InputEvent) => {
            validation.onValidatePassword(event, 'oldPassword')
          }
        }
      }),
      new BlockInputPassword({
        label: 'Новый пароль',
        textValid: 'Неверный пароль',
        id: 'newPassword',
        name: 'newPassword',
        required: 'required',
        isValid: false,
        events: {
          focusout: (event: InputEvent) => {
            validation.onValidatePassword(event, 'newPassword')
          }
        }
      }),
      new BlockInputPassword({
        label: 'Повторите новый пароль',
        textValid: 'Неверный пароль',
        id: 'repeatPassword',
        name: 'repeatPassword',
        required: 'required',
        isValid: false,
        events: {
          focusout: (event: InputEvent) => {
            validation.onValidatePassword(event, 'repeatPassword')
          }
        }
      })
    ],
    Button: cButton
  })

  return cProfilePasswordPage.getContent()
}
