import Mediator from '../../modules/mediator'
import { type Props } from '../../types/global'
import { type ChatAddFormModel, type ChatUserActionFormModel } from '../../types/chat'

const bus = new Mediator()

const openPopupAddChat = (isOpen: boolean): void => {
  bus.emit('chat:popup-add-chat', isOpen)
}

const openPopupAddUser = (isOpen: boolean): void => {
  bus.emit('chat:popup-add-user', isOpen)
}

const openPopupRemoveUser = (isOpen: boolean): void => {
  bus.emit('chat:popup-remove-user', isOpen)
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

const onSubmitAddUser = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formAddUser') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const userId = formData.get('userId') as unknown as number
    const chatId = formData.get('chatId') as unknown as number

    const data: ChatUserActionFormModel = {
      users: [userId],
      chatId
    }

    formElement.reset()

    bus.emit('chat:add-user', data)
  }
}

const onSubmitRemoveUser = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formRemoveUser') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const userId = formData.get('userId') as unknown as number
    const chatId = formData.get('chatId') as unknown as number

    const data: ChatUserActionFormModel = {
      users: [userId],
      chatId
    }

    formElement.reset()

    bus.emit('chat:remove-user', data)
  }
}

export {
  openPopupAddChat,
  openPopupAddUser,
  openPopupRemoveUser,
  onChat,
  onSubmit,
  onSubmitAddChat,
  onSubmitAddUser,
  onSubmitRemoveUser
}
