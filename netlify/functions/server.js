import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'

// Контстанты среды
const nodeEnv = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const base = process.env.BASE || '/'
// Контстанты сервера
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __allowedPaths = ['/login', '/signin', '/profile', '/profile/edit', '/profile/password'];

// Создаем http сервер
const app = express()

// Добавляем ПО vite
const { createServer } = await import('vite')
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  base
})
app.use(vite.middlewares)

// Отдаем статику
app.use(express.static(`${__dirname}/dist`));

// Орабатываем все доступные страницы
app.get(__allowedPaths, async (req, res) => {
  try {
    const data = await readFile('index.html', 'utf8');
    res.send(data);
  } catch (err) {
    console.error(err);
    const data = await readFile('500.html', 'utf8');
    res.status(500).send(data);
  }
});

// Все остальные идут в 404
app.use(async (req, res) => {
  try {
    const data = await readFile('404.html', 'utf8');
    res.status(404).send(data);
  } catch (err) {
    console.error(err);
    const data = await readFile('500.html', 'utf8');
    res.status(500).send(data);
  }
})

// Если ошибка 5xx
app.use(async (err, req, res, next) => {
  console.log()
  const data = await readFile('500.html', 'utf8');
  res.status(500).send(data);
})

// Стартуем http сервер
app.listen(port, () => {
  console.log(`Server ${nodeEnv} started at http://localhost:${port}`)
})