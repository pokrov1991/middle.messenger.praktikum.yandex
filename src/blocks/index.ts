/* eslint-disable @typescript-eslint/explicit-function-return-type */
const chat = async () => await import('./chat')
const chatList = async () => await import('./chatList')
const chatItem = async () => await import('./chatList/components/chatItem')
const chatBox = async () => await import('./chatBox')
const chatMessage = async () => await import('./chatBox/components/chatMessage')
const profile = async () => await import('./profile')
const profileItem = async () => await import('./profile/components/profileItem')
const error = async () => await import('./error')

export { chat, chatList, chatItem, chatBox, chatMessage, profile, profileItem, error }
