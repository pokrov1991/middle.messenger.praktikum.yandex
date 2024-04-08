import Router from '../modules/router'
import { loadBlockPage } from './getPageBlock'

const router = new Router('#app')

export default async function toRoute (url: string): Promise<void> {
  if (url === '') {
    return
  }
  if (!router.isRoute(url)) {
    router.use(url, await loadBlockPage(url))
  }
  router.go(url)
}
