import Handlebars from 'handlebars'
import { getPageName } from './../utils'

const main = () => import('./main')
const login = () => import('./login')
const signin = () => import('./signin')
const profile = () => import('./profile')
const profileEdit = () => import('./profile-edit')
const profilePassword = () => import('./profile-password')
const notFound = () => import('./not-found')
const serverError = () => import('./server-error')

const pageName = getPageName(location.href)

let pagePromise = ''
let pageTemplate = ''
switch(pageName) {
  case 'main':
    pagePromise = await main()
    pageTemplate = pagePromise.Main
    break
  case 'login':
    pagePromise = await login()
    pageTemplate = pagePromise.Login
    break
  case 'signin':
    pagePromise = await signin()
    pageTemplate = pagePromise.Signin
    break
  case 'profile':
    pagePromise = await profile()
    pageTemplate = pagePromise.Profile
    break

  case 'profile-edit':
    pagePromise = await profileEdit()
    pageTemplate = pagePromise.ProfileEdit
    break

  case 'profile-password':
    pagePromise = await profilePassword()
    pageTemplate = pagePromise.ProfilePassword
    break

  case 'serverError':
    pagePromise = await serverError()
    pageTemplate = pagePromise.ServerError
    break

  default:
    pagePromise = await notFound()
    pageTemplate = pagePromise.NotFound
    break
}

const template = Handlebars.compile(pageTemplate)

export { template }