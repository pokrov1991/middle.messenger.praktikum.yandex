// import Handlebars from 'handlebars'
// import { getPageHash } from '../../utils'
// import { isChatSelectedHelper, dataChatSelectedHelper } from './utils/helpers'

// // Мок-даннные списка чатов
// window.dataChatList = [
//   {
//     id: 'andrey',
//     userName: 'Андрей',
//     userAvatar: '',
//     date: '10:49',
//     message: 'Изображение',
//     unread: 2
//   },
//   {
//     id: 'kinoclub',
//     userName: 'Киноклуб',
//     userAvatar: '',
//     date: '12:00',
//     message: 'Вы: стикер',
//     unread: 1
//   },
//   {
//     id: 'ilya',
//     userName: 'Илья',
//     userAvatar: '',
//     date: 'ЧТ',
//     message: 'Друзья, у меня для вас особенный выпуск новостей!...',
//     unread: 4
//   }
// ]

// // Временный вызол заглушки "Выберите чат"
// window.isChatSelected = getPageHash() === 'messages'
// window.dataChatSelected = window.isChatSelected ? window.dataChatList[0] : {}

// // Выводим список чатов
// Handlebars.registerHelper('chat-list', () => window.dataChatList)

// // Вывод "Выберите чат" или сообщений
// Handlebars.registerHelper('if-chat-selected', (_isChatSelected: any, options) => isChatSelectedHelper(window.isChatSelected, options))

// // Вывод данных выбранного чата
// Handlebars.registerHelper('data-chat-selected', (_dataChatSelected, options) => dataChatSelectedHelper(window.dataChatSelected, options))
