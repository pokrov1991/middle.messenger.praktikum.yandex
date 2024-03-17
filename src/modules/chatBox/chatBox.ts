import Handlebars from 'handlebars'

type Message = {
  id: string;
  date: string,
  message: string,
  isMy: boolean
}

// Мок-даннные сообщений
const dataMessageList: Message[] = [
  {
    id: 'key0',
    date: '12:00',
    message: 'Круто!',
    isMy: true
  },
  {
    id: 'key1',
    date: '11:56',
    message: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА.',
    isMy: false
  }
]

// Выводим список сообщений
Handlebars.registerHelper('chat-messages', () => dataMessageList)
