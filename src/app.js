import './app.scss'

async function app() {
  const { template } = await import('./pages')

  template().then((res) => {
    document.querySelector('#app').innerHTML = res({title: 'яЧат'})
  })
}
app()
