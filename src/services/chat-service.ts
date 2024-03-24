import Mediator from '../modules/mediator'
import { type DataChatItem } from '../types/global'
const bus = new Mediator()

interface DataMessage {
  message: string
}

export default class ChatService {
  constructor () {
    bus.on('chat:send-message', (data) => {
      const { message } = data as unknown as DataMessage
      this.sendMessage({ message })
    })
  }

  init () {
    console.log('init chat-service')
    this.getChats()
  }

  sendMessage (data: DataMessage) {
    console.log('Message send', data)
  }

  getMessages () {
    console.log('Messages get')
  }

  getChats () {
    const dataChatList: DataChatItem[] = [
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
        unread: 1
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
    bus.emit('chat:get-messages', dataChatList)
  }
}
