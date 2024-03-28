import Mediator from '../modules/mediator'
import { getDate } from '../utils'
import { type DataChatItem, type DataMessage } from '../types/global'
const bus = new Mediator()

export default class ChatService {
  private _chatList: DataChatItem[]
  private _messageList: Record<string, DataMessage[]>

  constructor () {
    this._chatList = []
    this._messageList = {}

    bus.on('chat:send-message', (data) => {
      const { id, message } = data as unknown as DataMessage
      this.sendMessage({ id, message })
    })

    bus.on('chat:send-chat-id', (id) => {
      const idChat = id as unknown as string
      this.getMessages(idChat)
    })
  }

  init (): void {
    console.log('init chat-service')
    this.getChats()
  }

  sendMessage (data: DataMessage): void {
    console.log('Message send', data)
    this.getMessages(data.id, data.message)
  }

  getMessages (idChat: string | undefined, message: string = ''): void {
    const dataMessageList = {
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

    if (Object.keys(this._messageList).length === 0) {
      this._messageList = dataMessageList
    }

    if (typeof idChat !== 'undefined') {
      if (message.length > 0) {
        this._messageList[idChat] = [
          {
            id: `key${Math.floor(100000 + Math.random() * 900000)}`,
            date: getDate(),
            message,
            isMy: true
          },
          ...this._messageList[idChat]
        ]
      }
      bus.emit('chat:get-messages', this._messageList[idChat])
    }
  }

  getChats (): void {
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

    if (this._chatList.length === 0) {
      this._chatList = dataChatList
    }

    bus.emit('chat:get-chats', this._chatList)
  }
}
