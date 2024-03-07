import Handlebars from 'handlebars'

// Мок-даннные профиля
const dataProfile = [
  {
    id: 'email',
    label: 'Почта',
    value: 'pochta@yandex.ru'
  },
  {
    id: 'login',
    label: 'Логин',
    value: 'ivanivanov'
  },
  {
    id: 'first_name',
    label: 'Имя',
    value: 'Иван'
  },
  {
    id: 'second_name',
    label: 'Фамилия',
    value: 'Иванов'
  },
  {
    id: 'display_name',
    label: 'Имя в чате',
    value: 'Иван'
  },
  {
    id: 'phone',
    label: 'Телефон',
    value: '+7 (909) 967 30 30'
  }
]


// Выводим данные профиля
Handlebars.registerHelper('profile-list', () => dataProfile)
