import handleJSONParse from './handleJSONParse'

interface ErrorResponse {
  reason?: string
  error?: string
}

export default function checkErrorStatus (status: number, response: string): void {
  if (status !== 200) {
    const errorInfo: ErrorResponse = handleJSONParse(response) as ErrorResponse
    throw new Error(errorInfo?.reason)
  }
}
