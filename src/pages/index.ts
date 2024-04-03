import { getPageName } from './../utils'

export async function template (): Promise<string | Node> {
  const pageName: string | null = getPageName(location.href)

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
      pageTemplate = await profilePage()
      break

    case 'profile-edit':
      ({ profileEdit } = await import('./profile-edit'))
      pageTemplate = await profileEdit()
      break

    case 'profile-password':
      ({ profilePassword } = await import('./profile-password'))
      pageTemplate = await profilePassword()
      break

    case 'server-error':
      ({ serverError } = await import('./server-error'))
      pageTemplate = await serverError()
      break

    default:
      ({ notFound } = await import('./not-found'))
      pageTemplate = await notFound()
      break
  }

  return pageTemplate
}
