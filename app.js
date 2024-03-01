import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

//app.use(express.static(`${__dirname}/`));

app.get('/about', (req, res) => {
  res.type('text/plain')
  res.send('About')
})

app.use(express.static(`${__dirname}/`));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});