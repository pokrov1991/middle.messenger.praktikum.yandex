interface ChatAddFormModel {
  title: string
}

interface ChatRemoveFormModel {
  chatId: number
}

interface ChatUserActionFormModel {
  users: any
  chatId: number
}

interface ChatListRequestQuery {
  offset?: number
  limit?: number
  title?: string
}

interface ChatAddFormResponseOk {
  id: number
}

interface ChatListResponseModel {
  id: number
  title: string
  avatar: string
  unread_count: number
  created_by: number
  last_message: {
    user: {
      email: string
      login: string
      first_name: string
      second_name: string
      display_name: string
      phone: string
    }
    time: string
    content: string
  }
}

export type {
  ChatAddFormModel,
  ChatRemoveFormModel,
  ChatUserActionFormModel,
  ChatListRequestQuery,
  ChatAddFormResponseOk,
  ChatListResponseModel
}
