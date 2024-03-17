import { type Field } from './types/field'
import Handlebars from 'handlebars'

// Мок-даннные профиля
const dataProfile: Field[] = [
  {
    id: 'email',
    name: 'email',
    label: 'Почта',
    value: 'pochta@yandex.ru'
  },
  {
    id: 'login',
    name: 'login',
    label: 'Логин',
    value: 'ivanivanov'
  },
  {
    id: 'first_name',
    name: 'first_name',
    label: 'Имя',
    value: 'Иван'
  },
  {
    id: 'second_name',
    name: 'second_name',
    label: 'Фамилия',
    value: 'Иванов'
  },
  {
    id: 'display_name',
    name: 'display_name',
    label: 'Имя в чате',
    value: 'Иван'
  },
  {
    id: 'phone',
    name: 'phone',
    label: 'Телефон',
    value: '+7 (909) 967 30 30'
  }
]

// Выводим данные профиля
Handlebars.registerHelper('profile-list', () => dataProfile)
