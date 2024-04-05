const getPageName = (originUrl: string): string => {
  try {
    const url: URL = new URL(originUrl)
    const params: URLSearchParams = new URLSearchParams(url.search)
    const page = params.get('page')
    return page !== null && page !== '' ? page : ''
  } catch (error) {
    console.error('Invalid URL:', error)
    return ''
  }
}
export { getPageName }
