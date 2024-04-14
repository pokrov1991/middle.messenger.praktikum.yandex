interface LoginFormModel {
  login: string
  password: string
}

interface SigninFormModel {
  email: string
  login: string
  first_name: string
  second_name: string
  phone: string
  password: string
}

interface ProfileEditFormModel {
  email: string
  login: string
  first_name: string
  second_name: string
  display_name: string
  phone: string
}

interface ProfilePasswordFormModel {
  oldPassword: string
  newPassword: string
}

interface FormResponseError {
  reason: string
  error: string
}

interface SigninFormResponseOk {
  id: number
}

interface UserResponse {
  id: number
  first_name: string
  second_name: string
  display_name: string
  phone: string
  login: string
  avatar: string
  email: string
}

interface DataUserField {
  id: string
  name: string
  label: string
  value: string
  isValid?: boolean
  required?: string
  textValid?: string
  events?: { focusout: (event: InputEvent) => void }
}

interface DataUser {
  name: string
  srcAvatar: string
}

export type {
  LoginFormModel,
  SigninFormModel,
  ProfileEditFormModel,
  ProfilePasswordFormModel,
  FormResponseError,
  SigninFormResponseOk,
  UserResponse,
  DataUserField,
  DataUser
}
