import Mediator from '../modules/mediator'
import MessageService from './message-service'
import ChatAPI from '../api/chat-api'
import ChatUserAPI from '../api/chat-user-api'
import ChatTokenAPI from '../api/chat-token-api'
import store from '../modules/store'
import logger from './decorators/logger'
import checkErrorStatus from '../utils/checkErrorStatus'
import { getDate } from '../utils'
import { type Indexed, type DataChatItem, type DataMessage } from '../types/global'
import { type ChatAddFormModel, type ChatUserActionFormModel, type ChatListRequestQuery, type ChatListResponseModel, type ChatTokenResponse } from '../types/chat'
import { type UserResponse } from '../types/user'

const bus = new Mediator()
const chatAPI = new ChatAPI()
const chatUserAPI = new ChatUserAPI()
const chatTokenAPI = new ChatTokenAPI()

export default class ChatService {
  private _chatList: DataChatItem[]
  private _socket: MessageService | null
  private _token: string

  constructor () {
    this._chatList = []
    this._socket = null
    this._token = ''

    bus.on('chat:send-message', (data) => {
      const { id, message } = data as unknown as DataMessage
      this.sendMessage({ id, message })
    })

    bus.on('chat:send-chat-id', (id) => {
      const chatId = id as unknown as number
      if (this._socket !== null) {
        this._socket.close()
        this._socket = null
        this._token = ''
      }
      this.getMessages(chatId)
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
    this.getMessages(Number(data.id), data.message)
  }

  getMessages (chatId: number, message: string = ''): void {
    if (typeof chatId === 'number') {
      void this.getChatToken(chatId).then((res) => {
        const state: Indexed<UserResponse> = store.getState() as Indexed<UserResponse>
        const userId = state.user.id
        const token = res

        if (this._socket === null || this._socket.status() !== 1) {
          this._socket = new MessageService(userId, chatId, token)
        }

        // Если есть сообщение, отправляем его
        if (message.length > 0) {
          this._socket.sendMessage(message)
        }
      })
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
            date: typeof item.last_message?.time !== 'undefined' ? getDate(item.last_message.time) : '',
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

  @logger
  async getChatToken (chatId: number): Promise<string> {
    if (this._token !== '') {
      return this._token
    }
    return await chatTokenAPI.request({ id: chatId })
      .then(async (res) => {
        checkErrorStatus(res.status, res.response as string)

        const response: ChatTokenResponse = JSON.parse(res.response as string)
        this._token = response.token

        return this._token
      })
  }
}
