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
}

export type { Props, DataChatItem }
