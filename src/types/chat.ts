interface ChatAddFormModel {
  title: string
}

interface ChatRequestFormModel {
  offset?: number
  limit?: number
  title?: string
}

interface ChatAddFormResponseOk {
  id: number
}

export type {
  ChatAddFormModel,
  ChatRequestFormModel,
  ChatAddFormResponseOk
}
