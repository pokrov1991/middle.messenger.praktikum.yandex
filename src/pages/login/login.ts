const onSubmit = (event: any): void => {
  event.preventDefault()

  const formElement = document.getElementById('formLogin') as HTMLFormElement

  if (formElement !== null) {
    const formData = new FormData(formElement)

    const login = formData.get('login')
    const password = formData.get('password')

    console.log('Login form submit', { login, password })
  }
}

export { onSubmit }
