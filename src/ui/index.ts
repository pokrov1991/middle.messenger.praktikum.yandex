/* eslint-disable @typescript-eslint/explicit-function-return-type */
const button = async () => await import('./button')
const link = async () => await import('./link')
const input = async () => await import('./input')
const textarea = async () => await import('./textarea')
const title = async () => await import('./title')

export { button, link, input, textarea, title }
