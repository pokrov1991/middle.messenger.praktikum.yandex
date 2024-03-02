const getPageName = (originUrl) => {
  const url = new URL(originUrl)
  const params = new URLSearchParams(url.search)
  return params.get('page')
}
export { getPageName }