const isLocal = location.hostname === 'localhost'

const signUpPath: string = isLocal ? '/sign-up' : '/?page=sign-up'
const messengerPath: string = isLocal ? '/messenger' : '/?page=messenger'
const settingsPath: string = isLocal ? '/settings' : '/?page=settings'
const settingsEditPath: string = isLocal ? '/settings-edit' : '/?page=settings-edit'
const settingsPasswordPath: string = isLocal ? '/settings-password' : '/?page=settings-password'
const serverErrorPath: string = isLocal ? '/server-error' : '/?page=server-error'
const notFondPath: string = isLocal ? '/not-fond' : '/?page=not-fond'

export const routePaths = {
  signUp: signUpPath,
  messenger: messengerPath,
  settings: settingsPath,
  settingsEdit: settingsEditPath,
  settingsPassword: settingsPasswordPath,
  serverError: serverErrorPath,
  notFond: notFondPath
}

export const hostAPI = 'https://ya-praktikum.tech/api/v2'

export const hostWS = 'wss://ya-praktikum.tech/ws/chats'
