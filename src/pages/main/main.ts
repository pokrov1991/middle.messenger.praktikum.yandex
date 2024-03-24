import Mediator from '../../modules/mediator'
import { type Props } from '../../types/global'
const bus = new Mediator()

const onChat = (event: any, data: Props): void => {
  console.log('Выбран чат', event, data)
}

const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formMessage') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const message = formData.get('message')

    const data = {
      message
    }

    bus.emit('chat:send-message', data)
  }
}

export { onChat, onSubmit }
