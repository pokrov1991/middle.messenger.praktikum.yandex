interface Props {
  events?: object
  isValid?: boolean
  [key: string]: any
}

type Indexed<T = unknown> = {
  [key in string]: T;
}

interface DataChatItem {
  id: number
  title: string
  avatar: string
  date: string
  message: string
  unread_count: number
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
