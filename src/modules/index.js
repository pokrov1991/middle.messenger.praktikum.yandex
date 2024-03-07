const chat = () => import('./chat')
const chatList = () => import('./chatList')
const chatItem = () => import('./chatList/components/chatItem')
const chatBox = () => import('./chatBox')
const chatMessage = () => import('./chatBox/components/chatMessage')
const profile = () => import('./profile')
const profileItem = () => import('./profile/components/profileItem')
const error = () => import('./error')

export { chat, chatList, chatItem, chatBox, chatMessage, profile, profileItem, error }