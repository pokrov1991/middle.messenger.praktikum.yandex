import Mediator from '../../modules/mediator'
import { type Props } from '../../types/global'
const bus = new Mediator()

const onChat = (data: Props): void => {
  bus.emit('chat:select-chat', data)
}

const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formMessage') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const id = formData.get('id-chat')
    const message = formData.get('message')

    const data = {
      id,
      message
    }

    formElement.reset()

    bus.emit('chat:send-message', data)
  }
}

export { onChat, onSubmit }
