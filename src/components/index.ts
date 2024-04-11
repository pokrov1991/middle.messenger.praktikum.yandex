/* eslint-disable @typescript-eslint/explicit-function-return-type */
const inputPassword = async () => await import('./inputPassword')
const inputEmail = async () => await import('./inputEmail')
const inputText = async () => await import('./inputText')
const popup = async () => await import('./popup')

export { inputPassword, inputEmail, inputText, popup }
