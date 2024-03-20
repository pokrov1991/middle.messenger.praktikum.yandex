const onValidatePassword = (event: any, component: any): void => {
  const value = event.target.value
  console.log('Password validation', value)

  if (value === 'xxx') {
    component.setProps({
      text: 'Password'
    })
  }
}

export { onValidatePassword }
