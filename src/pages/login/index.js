import './login.scss'
import Handlebars from 'handlebars'
import Block from '../../views/Block'
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
  const onValidateEmail = inputEmailPromise.onValidateEmail
  const onValidatePassword = inputPasswordPromise.onValidatePassword

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
      const { className, text, _id } = this.props
      console.log('Button', _id)
      return this.compile(Button, { className, text })
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
    id: 'password',
    name: 'password',
    required: 'required',
    events: {
      input: event => {
        onValidatePassword(event, cButton)
      }
    }
  })

  const cInputEmail = new BlockInputEmail({
    className: 'c-form-auth__field',
    label: 'Логин',
    id: 'login',
    name: 'login',
    required: 'required',
    events: {
      input: onValidateEmail
    }
  })

  const cButton = new BlockButton({
    className: 'c-form-auth__button',
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
