import Mediator from '../../modules/mediator'
const bus = new Mediator()

const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formProfileEdit') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const email = formData.get('email')
    const login = formData.get('login')
    const firstName = formData.get('first_name')
    const secondName = formData.get('second_name')
    const displayName = formData.get('display_name')
    const phone = formData.get('phone')

    const data = {
      email,
      login,
      firstName,
      secondName,
      displayName,
      phone
    }

    bus.emit('user:edit', data)
  }
}

export { onSubmit }
