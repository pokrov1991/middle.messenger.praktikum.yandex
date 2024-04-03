const getPageHash = (): string => {
  let hash: string = window.location.hash
  if (hash.length > 0) {
    hash = hash.slice(1)
  }
  return hash
}
export { getPageHash }
