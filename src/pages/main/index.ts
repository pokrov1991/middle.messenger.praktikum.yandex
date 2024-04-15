import './main.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import Mediator from '../../modules/mediator'
import Validation from '../../modules/validation'
import ChatService from '../../services/chat-service'
import store, { StoreEvents } from '../../modules/store'
import { type Props, type DataChatItem, type DataMessage } from '../../types/global'
import { layoutEmpty } from '../../layouts'
import { chat, chatList, chatItem, chatBox, chatMessage } from '../../blocks'
import { popup } from './../../components'
import { input, textarea, link, button } from '../../ui'
import { openPopupAddChat, openPopupAddUser, openPopupRemoveUser, onChat, onSubmit, onSubmitAddChat, onSubmitAddUser, onSubmitRemoveUser } from './main'

export async function main (): Promise<Block> {
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

  const popupPromise = await popup()
  const Popup = popupPromise.Popup

  const inputPromise = await input()
  const Input = inputPromise.Input
  const textareaPromise = await textarea()
  const Textarea = textareaPromise.Textarea
  const linkPromise = await link()
  const Link = linkPromise.Link
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
    Popup,
    Input,
    Textarea,
    Link,
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
      disabled: (isValid ?? false) ? '' : 'disabled'
    })
  })

  bus.on('chat:select-chat', (payload: Props) => {
    dataChatList.forEach(item => {
      item.active = false
      if (item.id === payload.id) {
        item.active = true
        item.unread_count = 0
      }
    })
    cChat.setProps({
      isChatSelected: false,
      isPopupAddChat: false,
      className: 'c-chat__box_active'
    })
    cChatBox.setProps({
      id: payload.id,
      title: payload.title,
      isPopupAddUser: false,
      isPopupRemoveUser: false
    })
    cChat.setProps({
      isPopupAddChat: false,
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
      isPopupAddChat: false,
      ChatBox: new BlockChatBox({
        ListMessages: dataMessageList.map(item => new BlockChatMessage(item))
      })
    })
  })

  bus.on('chat:popup-add-chat', (isOpen) => {
    cChat.setProps({
      isPopupAddChat: isOpen
    })
  })

  bus.on('chat:popup-add-user', (isOpen) => {
    cChatBox.setProps({
      isPopupAddUser: isOpen,
      isPopupRemoveUser: false
    })
  })

  bus.on('chat:popup-remove-user', (isOpen) => {
    cChatBox.setProps({
      isPopupRemoveUser: isOpen,
      isPopupAddUser: false
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

    render (): HTMLElement {
      return this.compile(Textarea, this.props) as unknown as HTMLElement
    }
  }

  class BlockButton extends Block {
    constructor (props: Props) {
      super('button', props)
    }

    render (): HTMLElement {
      return this.compile(Button, this.props) as unknown as HTMLElement
    }
  }

  class BlockLink extends Block {
    constructor (props: Props) {
      super('a', props)
    }

    render (): HTMLElement {
      return this.compile(Link, this.props) as unknown as HTMLElement
    }
  }

  class BlockChat extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    componentDidUpdate (oldProps: Props, newProps: Props): boolean {
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

    render (): HTMLElement {
      return this.compile(Chat, this.props) as unknown as HTMLElement
    }
  }

  class BlockChatBox extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(ChatBox, this.props) as unknown as HTMLElement
    }
  }

  class BlockChatMessage extends Block {
    constructor (props: Props) {
      super('div', props)
    }

    render (): HTMLElement {
      return this.compile(ChatMessage, this.props) as unknown as HTMLElement
    }
  }

  class BlockChatList extends Block {
    constructor (props: Props) {
      super('div', props)

      store.on(StoreEvents.Updated, () => {
        this.setProps({
          ListChats: dataChatList.map(item => new BlockChatItem(item))
        })
      })
    }

    componentDidUpdate (oldProps: Props, newProps: Props): boolean {
      if (oldProps.ListChats !== newProps.ListChats) {
        this.lists.ListChats = newProps.ListChats
      }
      return true
    }

    render (): HTMLElement {
      return this.compile(ChatList, this.props) as unknown as HTMLElement
    }
  }

  class BlockChatItem extends Block {
    constructor (props: Props) {
      super('div', {
        ...props,
        events: {
          click: function () { onChat(props) }
        }
      })
    }

    render (): HTMLElement {
      return this.compile(ChatItem, this.props) as unknown as HTMLElement
    }
  }

  class BlockChatPage extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонентов
  const cTextarea = new BlockTextarea({
    id: 'message',
    name: 'message',
    placeholder: 'Сообщение',
    events: {
      input: (event: InputEvent) => {
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

  const cButtonAddChat = new BlockButton({
    className: 'c-link c-link_add-chat',
    text: '+ Добавить чат',
    events: {
      click: () => { openPopupAddChat(true) }
    }
  })

  const cButtonAddUser = new BlockButton({
    className: 'c-chat-box-user-menu__add',
    text: 'Добавить',
    events: {
      click: () => { openPopupAddUser(true) }
    }
  })

  const cButtonRemoveUser = new BlockButton({
    className: 'c-chat-box-user-menu__remove',
    text: 'Удалить',
    events: {
      click: () => { openPopupRemoveUser(true) }
    }
  })

  const cButtonPopupAddChat = new BlockButton({
    text: 'Добавить',
    events: {
      click: onSubmitAddChat
    }
  })

  const cButtonPopupAddUser = new BlockButton({
    text: 'Добавить',
    events: {
      click: onSubmitAddUser
    }
  })

  const cButtonPopupRemoveUser = new BlockButton({
    text: 'Удалить',
    events: {
      click: onSubmitRemoveUser
    }
  })

  const cLink = new BlockLink({
    to: '/settings',
    text: 'Профиль'
  })

  // Блок чата
  const cChatBox = new BlockChatBox({
    id: 0,
    title: 'Название чата',
    titlePopupAddUser: 'Добавить пользователя',
    titlePopupRemoveUser: 'Удалить пользователя',
    isPopupAddUser: false,
    isPopupRemoveUser: false,
    ListMessages: dataMessageList.map(item => new BlockChatMessage(item)),
    Textarea: cTextarea,
    Button: cButton,
    ButtonAddUser: cButtonAddUser,
    ButtonPopupAddUser: cButtonPopupAddUser,
    ButtonRemoveUser: cButtonRemoveUser,
    ButtonPopupRemoveUser: cButtonPopupRemoveUser
  })

  const cChatList = new BlockChatList({
    ListChats: dataChatList.map(item => new BlockChatItem(item))
  })

  const cChat = new BlockChat({
    titlePopupAddChat: 'Добавить чат',
    isPopupAddChat: false,
    isChatSelected: true,
    className: '',
    ChatBox: cChatBox,
    ChatList: cChatList,
    Link: cLink,
    ButtonAddChat: cButtonAddChat,
    ButtonPopupAddChat: cButtonPopupAddChat
  })

  // Создание компонента страницы
  const cChatPage = new BlockChatPage({
    Chat: cChat
  })

  return cChatPage
}
