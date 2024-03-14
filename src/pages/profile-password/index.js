import './profile-password.scss'
import Handlebars from 'handlebars'
import { layoutProfile } from './../../layouts'
import { profile } from './../../modules'
import { inputPassword } from './../../components'
import { input, button, title } from './../../ui'

export async function profilePassword() {
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

  return await import('./profile-password.hbs?raw')
}
