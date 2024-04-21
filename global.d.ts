declare module '*.hbs?raw' {
  const content: string
  export default content
}

interface Window {
  inputFocus: unknown
  toRoute: unknown
  showPopup: unknown
}
