const getPageHash = (): string => {
  let hash: string = window.location.hash
  if (hash) {
    hash = hash.slice(1)
  }
  return hash
}
export { getPageHash }
