import './profile-edit.scss'
import Handlebars from 'handlebars'
import { layoutProfile } from './../../layouts'
import { profile } from './../../modules'
import { input, button, title } from './../../ui'

export async function profileEdit() {
  const layoutProfilePromise = await layoutProfile()
  const LayoutProfile = layoutProfilePromise.LayoutProfile

  const profilePromise = await profile()
  const Profile = profilePromise.Profile

  const inputPromise = await input()
  const Input = inputPromise.Input
  const buttonPromise = await button()
  const Button = buttonPromise.Button
  const titlePromise = await title()
  const Title = titlePromise.Title

  Object.entries({ 
    LayoutProfile,
    Profile,
    Input,
    Button,
    Title
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  return await import('./profile-edit.hbs?raw')
}