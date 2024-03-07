import './signin.scss'
import Handlebars from 'handlebars'
import { layoutAuth } from './../../layouts'
import { inputPassword, inputEmail } from './../../components'
import { input, button, title } from './../../ui'

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

Object.entries({ 
  LayoutAuth,
  InputPassword, InputEmail,
  Input, Button, Title
}).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component)
})

export { default as Signin } from './signin.hbs?raw'