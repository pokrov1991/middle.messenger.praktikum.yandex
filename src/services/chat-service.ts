import Mediator from '../modules/mediator'
import { type DataChatItem, type DataMessage } from '../types/global'
const bus = new Mediator()

export default class ChatService {
  constructor () {
    bus.on('chat:send-message', (data) => {
      const { message } = data as unknown as DataMessage
      this.sendMessage({ message })
    })

    bus.on('chat:send-chat-id', (id) => {
      const idChat = id as unknown as string
      this.getMessages(idChat)
    })
  }

  init () {
    console.log('init chat-service')
    this.getChats()
  }

  sendMessage (data: DataMessage) {
    console.log('Message send', data)
  }

  getMessages (idChat: string) {
    const dataMessageList: object = {
      andrey: [
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
      ],
      kinoclub: [
        {
          id: 'key0',
          date: '12:00',
          message: 'Мяу-мяу',
          isMy: true
        }
      ],
      ilya: [
        {
          id: 'key0',
          date: '12:00',
          message: 'Гав-гав',
          isMy: false
        }
      ]
    }
    bus.emit('chat:get-messages', dataMessageList[idChat])
  }

  getChats () {
    const dataChatList: DataChatItem[] = [
      {
        id: 'andrey',
        userName: 'Андрей',
        userAvatar: '',
        date: '10:49',
        message: 'Изображение',
        unread: 2,
        active: false
      },
      {
        id: 'kinoclub',
        userName: 'Киноклуб',
        userAvatar: '',
        date: '12:00',
        message: 'Вы: стикер',
        unread: 0,
        active: false
      },
      {
        id: 'ilya',
        userName: 'Илья',
        userAvatar: '',
        date: 'ЧТ',
        message: 'Друзья, у меня для вас особенный выпуск новостей!...',
        unread: 1,
        active: false
      }
    ]
    bus.emit('chat:get-chats', dataChatList)
  }
}
