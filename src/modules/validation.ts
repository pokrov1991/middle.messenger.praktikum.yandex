import Mediator from './mediator'
const bus = new Mediator()

export default class Validation {
  fieldsNeed: string[]
  fieldsVerified: string[]

  constructor (fields: string[]) {
    this.fieldsNeed = fields
    this.fieldsVerified = []
  }

  _fieldControl (isValid: boolean, event: InputEvent, field: string) {
    const inputElement = event.target as HTMLInputElement
    const inputWrap = inputElement.parentNode?.parentElement
    const inputValid: HTMLElement | null | undefined = inputWrap?.querySelector('.c-input-validation')

    if (isValid) {
      this._arrayPush(field)
      if (inputValid) {
        inputValid.style.display = 'none'
      }
    } else {
      this.fieldsVerified = this.fieldsVerified.filter((item) => item !== field)
      if (inputValid) {
        inputValid.style.display = 'block'
      }
    }
    this.checkValidate()
  }

  _arrayPush (field: string) {
    this.fieldsVerified = Array.from(new Set([...this.fieldsVerified, field]))
  }

  onValidateName (field: string) {
    console.log('onValidateName')
    this._arrayPush(field)
  }

  onValidateLogin (field: string) {
    console.log('onValidateLogin')
    this._arrayPush(field)
  }

  onValidatePhone (field: string) {
    console.log('onValidatePhone')
    this._arrayPush(field)
  }

  onValidateMessage (field: string) {
    console.log('onValidateMessage')
    this._arrayPush(field)
  }

  onValidateEmail (event: InputEvent, field: string): void {
    const inputElement = event.target as HTMLInputElement

    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z]+\.[a-zA-Z]+$/
    const isValid: boolean = emailRegex.test(inputElement.value)

    this._fieldControl(isValid, event, field)
  }

  onValidatePassword (event: InputEvent, field: string): void {
    const inputElement = event.target as HTMLInputElement

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,40}$/
    const isValid: boolean = passwordRegex.test(inputElement.value)

    this._fieldControl(isValid, event, field)
  }

  checkValidate () {
    const isIncludes = (item: string) => {
      return this.fieldsVerified.includes(item)
    }
    const result = this.fieldsNeed.every(isIncludes)
    const fieldsNotVerified = this.fieldsNeed.filter((item) => !this.fieldsVerified.some((i) => i === item))
    if (result) {
      bus.emit('form:vaidated', { isValid: true, fieldsNotVerified })
    } else {
      bus.emit('form:vaidated', { isValid: false, fieldsNotVerified })
    }
  }
}
