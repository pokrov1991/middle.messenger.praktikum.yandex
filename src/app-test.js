import './app.scss'
import Block from './views/Block'

import Handlebars from 'handlebars'
import { login } from './pages/login'
import { button } from './ui'

const buttonPromise = await button()
const Button = buttonPromise.Button

const pagePromise = await login()
const pageTemplate = pagePromise.default

Object.entries({
  Button
}).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component)
})

class LoginBlock extends Block {
  constructor (props) {
    // Создаём враппер дом-элемент button
    super('section', props)
  }

  render () {
    const { text, button, _id } = this.props
    console.log('Login', _id)
    return this.compile(pageTemplate, { text, button })
  }
}

class ButtonBlock extends Block {
  constructor (props) {
    // Создаём враппер дом-элемент button
    super('button', props)
  }

  render () {
    const { text, _id } = this.props
    console.log('Button', _id)
    return this.compile(Button, { text })
  }
}

function render (query, block) {
  const root = document.querySelector(query)
  root.appendChild(block.getContent())
  return root
}

// Кнопка
const buttonEl = new ButtonBlock({
  text: 'Click me',
  events: {
    click: event => {
      console.log(event)
    }
  }
})

// app — это class дива в корне DOM
render('#app', buttonEl)

// Через секунду контент изменится сам, достаточно обновить пропсы
setTimeout(() => {
  buttonEl.setProps({
    text: 'Click me, please'
  })
}, 1000)

// Логин
const loginEl = new LoginBlock({
  text: 'Suuuupeeer',
  button: new ButtonBlock({ text: 'Change name' })
})

render('#appLogin', loginEl)
