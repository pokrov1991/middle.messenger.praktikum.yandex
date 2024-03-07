import Handlebars from 'handlebars'
import { getPageName } from './../utils'

export async function template() {  
  const pageName = getPageName(location.href)
  
  let pagePromise = ''
  let pageTemplate = ''
  switch(pageName) {
    case 'main':
      const { main } = await import('./main')
      pagePromise = await main()
      pageTemplate = pagePromise.default
      break
    case 'login':
    case null:
      const { login } = await import('./login')
      pagePromise = await login()
      pageTemplate = pagePromise.default
      break
    case 'signin':
      const { signin } = await import('./signin')
      pagePromise = await signin()
      pageTemplate = pagePromise.default
      break
    case 'profile':
      const { profilePage } = await import('./profile')
      pagePromise = await profilePage()
      pageTemplate = pagePromise.default
      break
  
    case 'profile-edit':
      const { profileEdit } = await import('./profile-edit')
      pagePromise = await profileEdit()
      pageTemplate = pagePromise.default
      break
  
    case 'profile-password':
      const { profilePassword } = await import('./profile-password')
      pagePromise = await profilePassword()
      pageTemplate = pagePromise.default
      break
  
    case 'server-error':
      const { serverError } = await import('./server-error')
      pagePromise = await serverError()
      pageTemplate = pagePromise.default
      break
  
    default:
      const { notFound } = await import('./not-found')
      pagePromise = await notFound()
      pageTemplate = pagePromise.default
      break
  }
  
  return Handlebars.compile(pageTemplate)
}