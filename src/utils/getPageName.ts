const getPageName = (originUrl: string): string => {
  const url: URL = new URL(originUrl)
  const params: URLSearchParams = new URLSearchParams(url.search)
  return params.get('page')
}
export { getPageName }
