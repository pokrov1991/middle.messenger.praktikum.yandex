declare module '*.hbs?raw' {
  const content: string
  export default content
}

interface Window {
  inputFocus: any
  toRoute: any
}
