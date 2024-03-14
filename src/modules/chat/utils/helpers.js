const isChatSelectedHelper = (isChatSelected, options) => {
  if (isChatSelected) {
    return options.fn(this)
  }
  return options.inverse(this)
}

const dataChatSelectedHelper = (dataChatSelected, options) => {
  return options.fn(Object.assign({}, this, { dataChatSelected }))
}

export { isChatSelectedHelper, dataChatSelectedHelper }
