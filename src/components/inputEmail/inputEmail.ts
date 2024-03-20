const onValidateEmail = (event: any): void => {
  const value = event.target.value
  console.log('Email validation', value)
}

export { onValidateEmail }
