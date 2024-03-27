import Mediator from './mediator'
const bus = new Mediator()

export default class Validation {
  fieldsNeed: string[]
  fieldsVerified: string[]

  constructor (fields: string[]) {
    this.fieldsNeed = fields
    this.fieldsVerified = []
  }

  _fieldControl (isValid: boolean, event: InputEvent, field: string): void {
    const inputElement = event.target as HTMLInputElement
    const inputWrap = inputElement.parentNode?.parentElement
    const inputValid: HTMLElement | null | undefined = inputWrap?.querySelector('.c-input-validation')

    if (isValid) {
      this._arrayPush(field)
      if (inputValid != null) {
        inputValid.style.display = 'none'
      }
    } else {
      this.fieldsVerified = this.fieldsVerified.filter((item) => item !== field)
      if (inputValid != null) {
        inputValid.style.display = 'block'
      }
    }
    this.checkValidate()
  }

  _arrayPush (field: string): void {
    this.fieldsVerified = Array.from(new Set([...this.fieldsVerified, field]))
  }

  _isValid (event: InputEvent, regex: RegExp): boolean {
    const inputElement = event.target as HTMLInputElement
    return regex.test(inputElement.value)
  }

  onValidateName (event: InputEvent, field: string): void {
    const isValid = this._isValid(event, /^(?:[А-ЯA-Z][а-яa-z-]*|[A-Z][a-z-]*)$/)
    this._fieldControl(isValid, event, field)
  }

  onValidateLogin (event: InputEvent, field: string): void {
    const isValid = this._isValid(event, /^(?!-|\d)(?!.*--)[A-Za-z\d_-]{3,20}(?<!-)$/g)
    this._fieldControl(isValid, event, field)
  }

  onValidatePhone (event: InputEvent, field: string): void {
    const isValid = this._isValid(event, /^\+?\d{10,15}$/)
    this._fieldControl(isValid, event, field)
  }

  onValidateMessage (event: InputEvent, field: string): void {
    const isValid = this._isValid(event, /.+/)
    this._fieldControl(isValid, event, field)
  }

  onValidateEmail (event: InputEvent, field: string): void {
    const isValid = this._isValid(event, /^[a-zA-Z0-9_.-]+@[a-zA-Z]+\.[a-zA-Z]+$/)
    this._fieldControl(isValid, event, field)
  }

  onValidatePassword (event: InputEvent, field: string): void {
    const isValid = this._isValid(event, /^(?=.*[A-Z])(?=.*\d).{8,40}$/)
    this._fieldControl(isValid, event, field)
  }

  checkValidate (): void {
    const isIncludes = (item: string): boolean => {
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
