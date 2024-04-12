import Mediator from '../../modules/mediator'
import { type Props } from '../../types/global'
import { type ChatAddFormModel } from '../../types/chat'

const bus = new Mediator()

const openPopupAddChat = (isOpen: boolean): void => {
  bus.emit('chat:popup-add-chat', isOpen)
}

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

const onSubmitAddChat = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formAddChat') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const title = formData.get('title') as string

    const data: ChatAddFormModel = {
      title
    }

    formElement.reset()

    bus.emit('chat:add-chat', data)
  }
}

export { openPopupAddChat, onChat, onSubmit, onSubmitAddChat }
