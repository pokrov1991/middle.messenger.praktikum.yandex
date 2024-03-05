import './app.scss'
import Handlebars from 'handlebars'
import * as Pages from './pages'
import * as Layouts from './layouts'
import * as Modules from './modules'
import * as Components from './components'
import * as Ui from './ui'
import { getPageName } from './utils'

const pages = {
  'main': Pages.Main,
  'login': Pages.Login,
  'signin': Pages.Signin
}

const pageName = getPageName(location.href)
const page = Object.keys(pages).includes(pageName) ? pageName : 'main'

// Регистрируем компоненты ui
Object.entries({ ...Layouts, ...Modules, ...Components, ...Ui }).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component)
})

// Формируем страницу
const template = Handlebars.compile(pages[page])

document.querySelector('#app').innerHTML = template({title: 'яЧат'})

// Следим за изменением урла
// navigation.addEventListener("navigate", (event) => {
//   console.log(event)
// })