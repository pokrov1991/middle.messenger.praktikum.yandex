import Mediator from '../modules/mediator'
import { getDate } from '../utils'
import { type DataMessage } from '../types/global'

const bus = new Mediator()

export default class MessageService {
  private readonly _socket: WebSocket
  private readonly _userId: number
  private readonly _chatId: number
  private readonly _token: string
  private _ping: NodeJS.Timeout | string
  private _messageList: DataMessage[]

  constructor (userId: number, chatId: number, token: string) {
    this._userId = userId
    this._chatId = chatId
    this._token = token
    this._socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${this._userId}/${this._chatId}/${this._token}`)

    this._ping = ''
    this._messageList = []

    this._handleOpen = this._handleOpen.bind(this)
    this._handleClose = this._handleClose.bind(this)
    this._handleError = this._handleError.bind(this)
    this._handleMassage = this._handleMassage.bind(this)

    this._addEvents()
  }

  private _addEvents (): void {
    this._socket.addEventListener('open', this._handleOpen)
    this._socket.addEventListener('close', this._handleClose)
    this._socket.addEventListener('error', this._handleError)
    this._socket.addEventListener('message', this._handleMassage)
  }

  private _removeEvents (): void {
    this._socket.removeEventListener('open', this._handleOpen)
    this._socket.removeEventListener('close', this._handleClose)
    this._socket.removeEventListener('error', this._handleError)
    this._socket.removeEventListener('message', this._handleMassage)
  }

  private readonly _handleOpen = (): void => {
    console.log('Соединение установлено')
    this.getMessages()
    // Каждые 15 секунд пингуем сокет
    this._ping = setInterval(() => {
      this._socket.send(JSON.stringify({
        type: 'ping'
      }))
    }, 15000)
  }

  private readonly _handleClose = (event: CloseEventInit): void => {
    if (event.wasClean ?? false) {
      console.log('Соединение закрыто чисто')
    } else {
      console.log('Обрыв соединения')
    }
    console.log(`Код: ${event.code} | Причина: ${event.reason}`)
  }

  private readonly _handleError = (event: any): void => {
    console.log('Ошибка', event)
  }

  private readonly _handleMassage = (event: MessageEvent): void => {
    const data = JSON.parse(event.data as string)
    console.log('Получены данные', data)

    if (Array.isArray(data) && data.length > 0) {
      this._messageList = data.map((item: any) => {
        return {
          id: item.id as number,
          date: getDate(item.time as string),
          message: item.content as string,
          isRead: item.is_read as boolean,
          isMy: item.user_id === this._userId
        }
      })
    }

    if (typeof data.user_id !== 'undefined') {
      this._messageList.unshift({
        id: data.id as number,
        date: getDate(data.time as string),
        message: data.content as string,
        isRead: data.is_read as boolean,
        isMy: data.user_id === this._userId
      })
    }

    bus.emit('chat:get-messages', this._messageList)
  }

  close (): void {
    clearInterval(this._ping as NodeJS.Timeout)
    this._socket.close(1000, 'Пользователь вышел из чата')
    this._removeEvents()
  }

  status (): number {
    return this._socket.readyState
  }

  getMessages (offset: string = '0'): void {
    this._socket.send(JSON.stringify({
      content: offset,
      type: 'get old'
    }))
  }

  sendMessage (message: string): void {
    this._socket.send(JSON.stringify({
      content: message,
      type: 'message'
    }))
  }
}
