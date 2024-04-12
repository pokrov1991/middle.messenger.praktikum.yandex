interface Props {
  events?: object
  isValid?: boolean
  [key: string]: any
}

type Indexed<T = unknown> = {
  [key in string]: T;
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

export type {
  Props,
  Indexed,
  DataChatItem,
  DataMessage
}
