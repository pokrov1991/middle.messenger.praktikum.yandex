import './main.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import Validation from '../../modules/validation'
import ChatService from '../../services/chat-service'
import { type Props, type DataChatItem, type DataMessage } from '../../types/global'
import { layoutEmpty } from '../../layouts'
import { chat, chatList, chatItem, chatBox, chatMessage } from '../../blocks'
import { input, textarea, button } from '../../ui'
import { onChat, onSubmit } from './main'

export async function main () {
  const pagePromise = await import('./main.hbs?raw')
  const pageTemplate = pagePromise.default

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
  const buttonPromise = await button()
  const Button = buttonPromise.Button

  // Регистрация шаблонов
  Object.entries({
    LayoutEmpty,
    Chat,
    ChatList,
    ChatItem,
    ChatBox,
    ChatMessage,
    Input,
    Textarea,
    Button
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  // Методы и переменные
  const bus = new Mediator()
  const validation = new Validation(['message'])
  let dataChatList: DataChatItem[] = []
  let dataMessageList: DataMessage[] = []

  // Слушатели
  bus.on('form:vaidated', (payload) => {
    const { isValid } = payload as unknown as Props
    cButton.setProps({
      disabled: isValid ? '' : 'disabled'
    })
  })

  bus.on('chat:select-chat', (payload: Props) => {
    dataChatList.forEach(item => {
      item.active = false
      if (item.id === payload.id) {
        item.active = true
        item.unread = 0
      }
    })
    cChat.setProps({
      isChatSelected: false,
      className: 'c-chat__box_active'
    })
    cChatBox.setProps({
      id: payload.id,
      userName: payload.userName
    })
    cChat.setProps({
      ChatList: new BlockChatList({
        ListChats: dataChatList.map(item => new BlockChatItem(item))
      })
    })
    bus.emit('chat:send-chat-id', payload.id)
  })

  bus.on('chat:get-chats', (payload) => {
    dataChatList = payload as unknown as DataChatItem[]
  })

  bus.on('chat:get-messages', (payload) => {
    dataMessageList = payload as unknown as DataMessage[]
    cChat.setProps({
      ChatBox: new BlockChatBox({
        ListMessages: dataMessageList.map(item => new BlockChatMessage(item))
      })
    })
  })

  // Инициализация сервиса
  const chatService = new ChatService()
  chatService.init()

  // Создание классов компонентов
  class BlockTextarea extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render () {
      return this.compile(Textarea, this.props)
    }
  }

  class BlockButton extends Block {
    constructor (props: Props) {
      super('button', props)
    }

    render () {
      return this.compile(Button, this.props)
    }
  }

  class BlockChat extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    componentDidUpdate (oldProps, newProps) {
      if (oldProps.ChatList !== newProps.ChatList) {
        this.children.ChatList.lists.ListChats = newProps.ChatList.lists.ListChats
        this.children.ChatList.setProps({ ListChats: newProps.ChatList.lists.ListChats })
      }
      if (oldProps.ChatBox !== newProps.ChatBox) {
        this.children.ChatBox.lists.ListMessages = newProps.ChatBox.lists.ListMessages
        this.children.ChatBox.setProps({ ListMessages: newProps.ChatBox.lists.ListMessages })
      }
      return true
    }

    render () {
      return this.compile(Chat, this.props)
    }
  }

  class BlockChatBox extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render () {
      return this.compile(ChatBox, this.props)
    }
  }

  class BlockChatMessage extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render () {
      return this.compile(ChatMessage, this.props)
    }
  }

  class BlockChatList extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render () {
      return this.compile(ChatList, this.props)
    }
  }

  class BlockChatItem extends Block {
    constructor (props: Props) {
      super('section', {
        ...props,
        events: {
          click: function () { onChat(props) }
        }
      })
    }

    render () {
      return this.compile(ChatItem, this.props)
    }
  }

  class BlockChatPage extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render () {
      return this.compile(pageTemplate, this.props)
    }
  }

  // Создание компонентов
  const cTextarea = new BlockTextarea({
    id: 'message',
    name: 'message',
    placeholder: 'Сообщение',
    events: {
      input: event => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        validation.onValidateMessage(event, 'message')
      }
    }
  })

  const cButton = new BlockButton({
    className: 'c-button_arrow',
    disabled: 'disabled',
    events: {
      click: onSubmit
    }
  })

  // Блок чата
  const cChatBox = new BlockChatBox({
    id: 'id-chat',
    userName: 'Имя собеседника',
    ListMessages: dataMessageList.map(item => new BlockChatMessage(item)),
    Textarea: cTextarea,
    Button: cButton
  })

  const cChatList = new BlockChatList({
    ListChats: dataChatList.map(item => new BlockChatItem(item))
  })

  const cChat = new BlockChat({
    isChatSelected: true,
    className: '',
    ChatBox: cChatBox,
    ChatList: cChatList
  })

  // Создание компонента страницы
  const cChatPage = new BlockChatPage({
    Chat: cChat
  })

  return cChatPage.getContent()
}
