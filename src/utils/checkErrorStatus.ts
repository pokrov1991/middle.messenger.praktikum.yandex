interface ErrorResponse {
  reason?: string
  error?: string
}

export default function checkErrorStatus (status: number, response: string): void {
  if (status !== 200) {
    const errorInfo: ErrorResponse = JSON.parse(response)
    throw new Error(errorInfo?.reason)
  }
}
