### Чат

Приложение чата для яндекс практикума.

---

## Макеты

- «[Figma](https://www.figma.com/file/wc2c70MVLh6rx6iYO3PbTt/YChat?type=design&node-id=1%3A612&mode=design&t=IEfGgj09X6WliTF1-1)»,

## Приложение

- «[netlify](https://reliable-pie-75ba03.netlify.app/)»,

## Команды сборки и запуска

npm install

npm run start

# Команды для разработки

npm run dev - в одном окне терминала сбока esbuild черз vite

npx tsc --noEmit --watch - в другом окне терминала транспиляция ts

# Команды линтеров

npm run eslint

npm run stylelint

# Функциональность

Бизне-слогика реализована через сервисы **/src/services**

Управление бизнес-логикой реализовано через модули **/src/modules**

Сервисы и представления общаются через паттерн «Медиатор» **src/modules/mediator.ts**

Класс для работы с запросами **src/modules/http/index.ts**

Методы API лежат в папке **src/api**

Сервис для работы с сообщениями через Socket **src/services/message-service.ts**

Представления реализованы через структуру схожей c атомной: **pages, blocks, components, ui**

# Инструменты

В проекте подключены **TypeScript, Eslint, Stylelint**

Соответствующие конфигурации лежат в файлах **tsconfig.json, .eslintrc.json, .stylelintrc.json**

## Страницы

Авторизация: https://reliable-pie-75ba03.netlify.app/?page=login

Регистрация: https://reliable-pie-75ba03.netlify.app/?page=signin

Список чатов и лента переписки:

Выберите чат: https://reliable-pie-75ba03.netlify.app/?page=main

С лентой переписки: https://reliable-pie-75ba03.netlify.app/?page=main#messages

Профиль: https://reliable-pie-75ba03.netlify.app/?page=profile

Изменить данные: https://reliable-pie-75ba03.netlify.app/?page=profile-edit

Изменить пароль: https://reliable-pie-75ba03.netlify.app/?page=profile-password

Ошибка 404: https://reliable-pie-75ba03.netlify.app/?page=not-found

Ошибка 500: https://reliable-pie-75ba03.netlify.app/?page=server-error
