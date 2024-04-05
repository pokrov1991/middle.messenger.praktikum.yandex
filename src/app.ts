import './app.scss'

async function app (): Promise<void> {
  const { template } = await import('./pages')
  void template()
}
void app()
