window.onChatShow = (event) => {    
  const chatId = event.getAttribute('data-id-chat')
  window.dataChatSelected = window.dataChatList.find(chat => chat.id === chatId)
  
  // Временный вывод данный чата в консоль и показ заглушки
  console.log('Chat', window.dataChatSelected)

  location.href = '?page=main#messages'
  location.reload()
}
