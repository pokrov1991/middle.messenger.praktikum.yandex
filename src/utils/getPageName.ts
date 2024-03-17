const getPageName = (originUrl: string): string | null => {
  const url: URL = new URL(originUrl)
  const params: URLSearchParams = new URLSearchParams(url.search)
  return params.get('page')
}
export { getPageName }
