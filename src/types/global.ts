interface Props {
  events?: object
  isValid?: boolean
  [key: string]: any
}

interface DataChatItem {
  id: string
  userName: string
  userAvatar: string
  date: string
  message: string
  unread: number
  active: boolean
}

interface DataMessage {
  id?: string
  date?: string
  message: string
  isMy?: boolean
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

export type { Props, DataChatItem, DataMessage, DataUserField, DataUser }
