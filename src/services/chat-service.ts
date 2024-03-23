import Mediator from '../modules/mediator'
const bus = new Mediator()

interface DataMessage {
  message: string
}

export default class ChatService {
  constructor () {
    bus.on('chat:message', (data) => {
      const { message } = data as unknown as DataMessage
      this.message({ message })
    })
  }

  init () {
    console.log('init chat-service')
  }

  message (data: DataMessage) {
    console.log('Message send', data)
  }
}
