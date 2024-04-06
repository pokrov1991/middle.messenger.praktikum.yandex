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

interface SigninFormResponseOk {
  id: number
}

interface ProfileEditFormModel {
  email: string
  login: string
  first_name: string
  second_name: string
  displayName: string
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

export type { LoginFormModel, SigninFormModel, SigninFormResponseOk, ProfileEditFormModel, ProfilePasswordFormModel, FormResponseError }
