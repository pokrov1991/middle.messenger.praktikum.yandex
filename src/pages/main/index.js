import './main.scss'
import Handlebars from 'handlebars'
import { layoutEmpty } from './../../layouts'
import { chat, chatList, chatItem, chatBox, chatMessage } from './../../modules'
import { input, textarea } from './../../ui'

const layoutEmptyPromise = await layoutEmpty()
const LayoutEmpty = layoutEmptyPromise.LayoutEmpty

const chatPromise = await chat()
const Chat = chatPromise.Chat
const chatListPromise = await chatList()
const ChatList = chatListPromise.ChatList
const chatItemPromise = await chatItem()
const ChatItem = chatItemPromise.ChatItem
const chatBoxPromise = await chatBox()
const ChatBox = chatBoxPromise.ChatBox
const chatMessagePromise = await chatMessage()
const ChatMessage = chatMessagePromise.ChatMessage

const inputPromise = await input()
const Input = inputPromise.Input
const textareaPromise = await textarea()
const Textarea = textareaPromise.Textarea

Object.entries({ 
  LayoutEmpty,
  Chat, ChatList, ChatItem, ChatBox, ChatMessage,
  Input, Textarea
}).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component)
})

export { default as Main } from './main.hbs?raw'