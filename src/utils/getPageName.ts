const getPageName = (originUrl: string): string => {
  try {
    const urlObj = new URL(originUrl)
    const pathname = urlObj.pathname.length > 0 ? urlObj.pathname : '/'
    const search = urlObj.search.length > 0 ? urlObj.search : ''
    return pathname + search
  } catch (error) {
    console.error('Invalid URL:', error)
    return ''
  }
}
export { getPageName }
