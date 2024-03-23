import UserService from '../services/user-service'
import ChatService from '../services/chat-service'
import { getPageName } from './../utils'

const userService = new UserService()
userService.init()
const chatService = new ChatService()
chatService.init()

export async function template () {
  const pageName: string | null = getPageName(location.href)

  let pagePromise: { default: string } = {
    default: ''
  }
  let pageTemplate: string = ''
  let main: any
  let login: any
  let signin: any
  let profilePage: any
  let profileEdit: any
  let profilePassword: any
  let serverError: any
  let notFound: any
  switch (pageName) {
    case 'main':
      ({ main } = await import('./main'))
      pageTemplate = await main()
      break
    case 'login':
    case null:
      ({ login } = await import('./login'))
      pageTemplate = await login()
      break
    case 'signin':
      ({ signin } = await import('./signin'))
      pageTemplate = await signin()
      break
    case 'profile':
      ({ profilePage } = await import('./profile'))
      pagePromise = await profilePage()
      pageTemplate = pagePromise.default
      break

    case 'profile-edit':
      ({ profileEdit } = await import('./profile-edit'))
      pagePromise = await profileEdit()
      pageTemplate = pagePromise.default
      break

    case 'profile-password':
      ({ profilePassword } = await import('./profile-password'))
      pagePromise = await profilePassword()
      pageTemplate = pagePromise.default
      break

    case 'server-error':
      ({ serverError } = await import('./server-error'))
      pagePromise = await serverError()
      pageTemplate = pagePromise.default
      break

    default:
      ({ notFound } = await import('./not-found'))
      pagePromise = await notFound()
      pageTemplate = pagePromise.default
      break
  }

  return pageTemplate
}
