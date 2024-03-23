import Mediator from '../../modules/mediator'
const bus = new Mediator()

const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formMessage') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const message = formData.get('message')

    const data = {
      message
    }

    bus.emit('chat:message', data)
  }
}

export { onSubmit }
