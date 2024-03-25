const getDate = (): string => {
  const now = new Date()
  const dateStr = now.getHours() + ':' + ('0' + now.getMinutes()).substr(-2)
  return dateStr
}
export { getDate }
