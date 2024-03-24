import './signin.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import Validation from '../../modules/validation'
import UserService from '../../services/user-service'
import { type Props } from '../../types/global'
import { layoutAuth } from './../../layouts'
import { inputPassword, inputEmail, inputText } from './../../components'
import { input, button, title } from './../../ui'
import { onSubmit } from './signin'

export async function signin () {
  const pagePromise = await import('./signin.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutAuthPromise = await layoutAuth()
  const LayoutAuth = layoutAuthPromise.LayoutAuth

  const inputPasswordPromise = await inputPassword()
  const InputPassword = inputPasswordPromise.InputPassword
  const inputEmailPromise = await inputEmail()
  const InputEmail = inputEmailPromise.InputEmail
  const inputTextPromise = await inputText()
  const InputText = inputTextPromise.InputText

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
  const validation = new Validation(['email', 'login', 'password'])

  // Слушатели
  bus.on('form:vaidated', (payload) => {
    const { isValid } = payload as unknown as Props
    cButton.setProps({
      disabled: isValid ? '' : 'disabled'
    })
  })

  // Инициализация сервиса
  const userService = new UserService()
  userService.init()

  // Создание классов компонентов
  class BlockInputEmail extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render () {
      return this.compile(InputEmail, this.props)
    }
  }

  class BlockInputText extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render () {
      return this.compile(InputText, this.props)
    }
  }

  class BlockInputPassword extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render () {
      return this.compile(InputPassword, this.props)
    }
  }

  class BlockButton extends Block {
    constructor (props: Props) {
      super('button', props)
    }

    render () {
      return this.compile(Button, this.props)
    }
  }

  class BlockSignin extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render () {
      return this.compile(pageTemplate, this.props)
    }
  }

  // Создание компонентов
  const cInputEmail = new BlockInputEmail({
    className: 'c-form-auth__field',
    label: 'Почта',
    textValid: 'Неверныая почта',
    id: 'email',
    name: 'email',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidateEmail(event, 'email')
      }
    }
  })

  const cInputLogin = new BlockInputText({
    className: 'c-form-auth__field',
    label: 'Логин',
    textValid: 'Неверныый логин',
    id: 'login',
    name: 'login',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidateLogin(event, 'login')
      }
    }
  })

  const cInputFirstName = new BlockInputText({
    className: 'c-form-auth__field',
    label: 'Имя',
    textValid: 'Неверное имя',
    id: 'first_name',
    name: 'first_name',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidateName(event, 'first_name')
      }
    }
  })

  const cInputSecondName = new BlockInputText({
    className: 'c-form-auth__field',
    label: 'Фамилия',
    textValid: 'Неверная фамилия',
    id: 'second_name',
    name: 'second_name',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidateName(event, 'second_name')
      }
    }
  })

  const cInputPhone = new BlockInputText({
    className: 'c-form-auth__field',
    label: 'Телефон',
    textValid: 'Неверный телефон',
    id: 'phone',
    name: 'phone',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidatePhone(event, 'phone')
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
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidatePassword(event, 'password')
      }
    }
  })

  const cInputPasswordRepeat = new BlockInputPassword({
    className: 'c-form-auth__field',
    label: 'Пароль (еще раз)',
    textValid: 'Неверный пароль',
    id: 'password_repeat',
    name: 'password_repeat',
    required: 'required',
    isValid: false,
    events: {
      focusout: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidatePassword(event, 'password')
      }
    }
  })

  const cButton = new BlockButton({
    className: 'c-form-auth__button',
    disabled: 'disabled',
    text: 'Зарегистрироваться',
    events: {
      click: onSubmit
    }
  })

  // Создание компонента страницы
  const cSignin = new BlockSignin({
    text: 'Регистрация',
    InputEmail: cInputEmail,
    InputLogin: cInputLogin,
    InputFirstName: cInputFirstName,
    InputSecondName: cInputSecondName,
    InputPhone: cInputPhone,
    InputPassword: cInputPassword,
    InputPasswordRepeat: cInputPasswordRepeat,
    Button: cButton
  })

  return cSignin.getContent()
}
