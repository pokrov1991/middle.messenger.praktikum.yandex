import Mediator from '../../modules/mediator'
const bus = new Mediator()

const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formSignin') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const email = formData.get('email')
    const login = formData.get('login')
    const firstName = formData.get('first_name')
    const secondName = formData.get('second_name')
    const phone = formData.get('phone')
    const password = formData.get('password')

    const data = {
      email,
      login,
      firstName,
      secondName,
      phone,
      password
    }

    bus.emit('user:signin', data)
  }
}

export { onSubmit }
