import './login.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import Validation from '../../modules/validation'
import UserService from '../../services/user-service'
import { routePaths } from '../../utils'
import { type Props } from '../../types/global'
import { layoutAuth } from './../../layouts'
import { inputPassword, inputText } from './../../components'
import { input, button, link, title } from './../../ui'
import { onSubmit } from './login'

export async function login (): Promise<Block> {
  const pagePromise = await import('./login.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutAuthPromise = await layoutAuth()
  const LayoutAuth = layoutAuthPromise.LayoutAuth

  const inputPasswordPromise = await inputPassword()
  const InputPassword = inputPasswordPromise.InputPassword
  const inputTextPromise = await inputText()
  const InputText = inputTextPromise.InputText

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
    LayoutAuth,
    InputPassword,
    InputText,
    Input,
    Button,
    Link,
    Title
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  // Методы
  const bus = new Mediator()
  const validation = new Validation(['login', 'password'])

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
  class BlockInputText extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render (): HTMLElement {
      return this.compile(InputText, this.props) as unknown as HTMLElement
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

  class BlockButton extends Block {
    constructor (props: Props) {
      super('button', props)
    }

    render (): HTMLElement {
      return this.compile(Button, this.props) as unknown as HTMLElement
    }
  }

  class BlockLink extends Block {
    constructor (props: Props) {
      super('a', props)
    }

    render (): HTMLElement {
      return this.compile(Link, this.props) as unknown as HTMLElement
    }
  }

  class BlockLogin extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонентов
  const cInputLogin = new BlockInputText({
    className: 'c-form-auth__field',
    label: 'Логин',
    textValid: 'Неверный логин',
    id: 'login',
    name: 'login',
    required: 'required',
    isValid: false,
    events: {
      focusout: (event: InputEvent) => {
        validation.onValidateLogin(event, 'login')
      }
    }
  })

  const cInputPassword = new BlockInputPassword({
    className: 'c-form-auth__field',
    label: 'Пароль',
    textValid: 'Неверный пароль',
    id: 'password',
    name: 'password',
    required: 'required',
    isValid: false,
    events: {
      focusout: (event: InputEvent) => {
        validation.onValidatePassword(event, 'password')
      }
    }
  })

  const cButton = new BlockButton({
    className: 'c-form-auth__button',
    disabled: 'disabled',
    text: 'Авторизоваться',
    events: {
      click: onSubmit
    }
  })

  const cLink = new BlockLink({
    to: routePaths.signUp,
    text: 'Нет аккаунта?'
  })

  // Создание компонента страницы
  const cLogin = new BlockLogin({
    text: 'Вход',
    InputLogin: cInputLogin,
    InputPassword: cInputPassword,
    Button: cButton,
    Link: cLink
  })

  return cLogin
}
