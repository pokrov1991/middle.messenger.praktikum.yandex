import UserService from '../services/user-service'
import type Block from '../modules/block'
import { routePaths } from '../utils'

const user = new UserService()

export async function loadBlockPage (pageName: string): Promise<Block> {
  let blockPage: Block
  let main: () => Promise<Block>
  let login: () => Promise<Block>
  let signin: () => Promise<Block>
  let profilePage: () => Promise<Block>
  let profileEdit: () => Promise<Block>
  let profilePassword: () => Promise<Block>
  let serverError: () => Promise<Block>
  let notFound: () => Promise<Block>

  switch (pageName) {
    case routePaths.messenger:
    case routePaths.settings:
    case routePaths.settingsEdit:
    case routePaths.settingsPassword:
      await user.auth().then(() => {
        if (user.isAuth !== true) {
          window.location.href = '/'
        }
      })
      break
  }

  switch (pageName) {
    case '/':
      ({ login } = await import('../pages/login'))
      blockPage = await login()
      break
    case routePaths.signUp:
      ({ signin } = await import('../pages/signin'))
      blockPage = await signin()
      break
    case routePaths.messenger:
      ({ main } = await import('../pages/main'))
      blockPage = await main()
      break
    case routePaths.settings:
      ({ profilePage } = await import('../pages/profile'))
      blockPage = await profilePage()
      break

    case routePaths.settingsEdit:
      ({ profileEdit } = await import('../pages/profile-edit'))
      blockPage = await profileEdit()
      break

    case routePaths.settingsPassword:
      ({ profilePassword } = await import('../pages/profile-password'))
      blockPage = await profilePassword()
      break

    case routePaths.serverError:
      ({ serverError } = await import('../pages/server-error'))
      blockPage = await serverError()
      break

    default:
      ({ notFound } = await import('../pages/not-found'))
      blockPage = await notFound()
      break
  }

  return blockPage
}
