import Mediator from '../../modules/mediator'
const bus = new Mediator()

const onSubmit = (event: Event): void => {
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
      first_name: firstName,
      second_name: secondName,
      display_name: displayName,
      phone
    }

    for (const item of Object.values(data)) {
      const value = item as string
      const regex = /.+/
      if (value !== null) {
        const isValid = regex.test(value)
        if (!isValid) {
          console.log('Profile password send: Заполните все поля!')
          return
        }
      }
    }

    bus.emit('user:edit', data)
  }
}

export { onSubmit }
