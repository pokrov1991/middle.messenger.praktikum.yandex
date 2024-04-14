import Mediator from '../modules/mediator'
import ChatAPI from '../api/chat-api'
import ChatUserAPI from '../api/chat-user-api'
import store from '../modules/store'
import logger from './decorators/logger'
import checkErrorStatus from '../utils/checkErrorStatus'
import { getDate } from '../utils'
import { type DataChatItem, type DataMessage } from '../types/global'
import { type ChatAddFormModel, type ChatUserActionFormModel, type ChatListRequestQuery, type ChatListResponseModel } from '../types/chat'

const bus = new Mediator()
const chatAPI = new ChatAPI()
const chatUserAPI = new ChatUserAPI()

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

    bus.on('chat:add-chat', (data) => {
      this.createChat(data as unknown as ChatAddFormModel)
    })

    bus.on('chat:add-user', (data) => {
      this.createUser(data as unknown as ChatUserActionFormModel)
    })

    bus.on('chat:remove-user', (data) => {
      this.removeUser(data as unknown as ChatUserActionFormModel)
    })
  }

  init (): void {
    console.log('init chat-service')
    this.getChats({})
  }

  sendMessage (data: DataMessage): void {
    console.log('Message send', data)
    this.getMessages(data.id, data.message)
  }

  getMessages (idChat: string | undefined, message: string = ''): void {
    const dataMessageList = {
      1032: [
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
      534: [
        {
          id: 'key0',
          date: '12:00',
          message: 'Мяу-мяу',
          isMy: true
        }
      ],
      461: [
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

  @logger
  createChat (data: ChatAddFormModel): void {
    void chatAPI.create(data)
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)
      })
  }

  @logger
  createUser (data: ChatUserActionFormModel): void {
    void chatUserAPI.create(data)
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)
      })
  }

  @logger
  removeUser (data: ChatUserActionFormModel): void {
    void chatUserAPI.delete(data)
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)
      })
  }

  @logger
  getChats (query: ChatListRequestQuery): void {
    void chatAPI.request(query)
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)

        const response: ChatListResponseModel[] = JSON.parse(res.response as string)

        const dataChatList: DataChatItem[] = response.map((item): DataChatItem => {
          return {
            id: item.id,
            title: item.title,
            avatar: item.avatar,
            date: item.last_message?.time ?? '',
            message: item.last_message?.content ?? 'Сообщений нет',
            unread_count: item.unread_count,
            active: false
          }
        })

        if (this._chatList.length === 0) {
          this._chatList = dataChatList
        }

        bus.emit('chat:get-chats', this._chatList)

        store.set('chatList', response)
      })
  }
}
