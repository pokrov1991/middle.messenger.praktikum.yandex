import Handlebars from 'handlebars'

// Мок-даннные сообщений
const dataMessageList = [
  {
    id: 'key0',
    date: '12:00',
    message: 'Круто!'
  },
  {
    id: 'key1',
    date: '11:56',
    message: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА.',
  }
]

// Выводим список сообщений
Handlebars.registerHelper('chat-messages', () => dataMessageList)
