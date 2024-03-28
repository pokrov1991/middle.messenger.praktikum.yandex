import Mediator from '../../modules/mediator'
const bus = new Mediator()

const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formProfilePassword') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const oldPassword = formData.get('oldPassword')
    const newPassword = formData.get('newPassword')

    const data = {
      oldPassword,
      newPassword
    }

    bus.emit('user:edit-password', data)
  }
}

export { onSubmit }
