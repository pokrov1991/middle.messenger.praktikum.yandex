import './login.scss'
import Handlebars from 'handlebars'
import Block from '../../views/Block'
import Mediator from '../../modules/mediator'
import Validation from '../../modules/validation'
import { layoutAuth } from './../../layouts'
import { inputPassword, inputEmail } from './../../components'
import { input, button, title } from './../../ui'
import { onSubmit } from './login'

export async function login () {
  const pagePromise = await import('./login.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutAuthPromise = await layoutAuth()
  const LayoutAuth = layoutAuthPromise.LayoutAuth

  const inputPasswordPromise = await inputPassword()
  const InputPassword = inputPasswordPromise.InputPassword
  const inputEmailPromise = await inputEmail()
  const InputEmail = inputEmailPromise.InputEmail

  const inputPromise = await input()
  const Input = inputPromise.Input
  const buttonPromise = await button()
  const Button = buttonPromise.Button
  const titlePromise = await title()
  const Title = titlePromise.Title

  // Регистрация шаблонов
  Object.entries({
    LayoutAuth,
    InputPassword,
    InputEmail,
    Input,
    Button,
    Title
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  // Методы
  const bus = new Mediator()
  const validation = new Validation(['email', 'password'])

  // Слушатели
  bus.on('form:vaidated', (payload) => {
    cButton.setProps({
      disabled: payload.isValid ? '' : 'disabled'
    })
  })

  // Создание классов компонентов
  class BlockInputPassword extends Block {
    constructor (props) {
      super('div', props)
    }

    render () {
      return this.compile(InputPassword, this.props)
    }
  }

  class BlockInputEmail extends Block {
    constructor (props) {
      super('div', props)
    }

    render () {
      return this.compile(InputEmail, this.props)
    }
  }

  class BlockButton extends Block {
    constructor (props) {
      super('button', props)
    }

    render () {
      return this.compile(Button, this.props)
    }
  }

  class BlockLogin extends Block {
    constructor (props) {
      super('section', props)
    }

    render () {
      return this.compile(pageTemplate, this.props)
    }
  }

  // Создание компонентов
  const cInputPassword = new BlockInputPassword({
    className: 'c-form-auth__field',
    label: 'Пароль',
    textValid: 'Неверный пароль',
    id: 'password',
    name: 'password',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidatePassword(event, 'password')
      }
    }
  })

  const cInputEmail = new BlockInputEmail({
    className: 'c-form-auth__field',
    label: 'Логин',
    textValid: 'Неверныая почта',
    id: 'login',
    name: 'login',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidateEmail(event, 'email')
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

  // Создание компонента страницы
  const cLogin = new BlockLogin({
    text: 'Вход',
    InputPassword: cInputPassword,
    InputEmail: cInputEmail,
    Button: cButton
  })

  return cLogin.getContent()
}
