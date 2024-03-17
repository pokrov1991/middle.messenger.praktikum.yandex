import './app.scss'

async function app () {
  const { template } = await import('./pages')

  template()
    .then((res) => {
      const appEl = document.querySelector<HTMLElement>('#app')
      if (appEl !== null) {
        appEl.innerHTML = res({ title: 'яЧат' })
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
app()
