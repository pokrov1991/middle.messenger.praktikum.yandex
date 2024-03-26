import './app.scss'

async function app (): Promise<void> {
  const { template } = await import('./pages')

  template()
    .then((res: string | Node) => {
      const appEl = document.querySelector<HTMLElement>('#app')
      if (appEl !== null && res instanceof Node) {
        appEl.appendChild(res)
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
void app()
