import Handlebars from 'handlebars'
import { getPageHash } from '../../utils'
import { isChatSelectedHelper, dataChatSelectedHelper } from './utils/helpers'

// Мок-даннные списка чатов
const dataChatList = [
  {
    id: 'andrey',
    userName: 'Андрей',
    userAvatar: '',
    date: '10:49',
    message: 'Изображение',
    unread: 2
  },
  {
    id: 'kinoclub',
    userName: 'Киноклуб',
    userAvatar: '',
    date: '12:00',
    message: 'Вы: стикер',
    unread: 0
  },
  {
    id: 'ilya',
    userName: 'Илья',
    userAvatar: '',
    date: 'ЧТ',
    message: 'Друзья, у меня для вас особенный выпуск новостей!...',
    unread: 4
  }
]

// Временный вызол заглушки "Выберите чат"
window.isChatSelected = getPageHash() === 'messages'
window.dataChatSelected = window.isChatSelected ? dataChatList[0] : {}

// Выводим список чатов
Handlebars.registerHelper('chat-list', () => dataChatList)

// Вывод "Выберите чат" или сообщений 
Handlebars.registerHelper('if-chat-selected', (isChatSelected, options) => isChatSelectedHelper(window.isChatSelected, options))

// Вывод данных выбранного чата
Handlebars.registerHelper('data-chat-selected', (dataChatSelected, options) => dataChatSelectedHelper(window.dataChatSelected, options))

// Обрабатываем клик по чату
document.addEventListener('DOMContentLoaded', () => {
  const nodeChatList = document.querySelector('#chat-list')

  nodeChatList.addEventListener('click', event => {
    event.stopImmediatePropagation()
    
    const chatId = event.target.getAttribute('data-id-chat')
    window.dataChatSelected = dataChatList.find(chat => chat.id === chatId)
    // Временный вывод данный чата в консоль и показ заглушки
    console.log('Chat', window.dataChatSelected)
    location.href = '?page=chat#messages'
  })
})
