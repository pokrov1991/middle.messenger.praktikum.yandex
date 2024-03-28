import Mediator from '../../modules/mediator'
const bus = new Mediator()

const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formLogin') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const login = formData.get('login')
    const password = formData.get('password')

    const data = {
      login,
      password
    }

    bus.emit('user:login', data)
  }
}

export { onSubmit }
