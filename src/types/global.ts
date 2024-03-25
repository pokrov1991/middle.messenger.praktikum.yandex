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

export type { Props, DataChatItem, DataMessage }
