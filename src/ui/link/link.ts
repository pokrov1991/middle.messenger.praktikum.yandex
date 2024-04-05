import { loadBlockPage } from '../../utils/getPageBlock'
import Router from '../../modules/router'

const router = new Router('#app')

window.toRoute = async (url: string) => {
  if (!router.isRoute(url)) {
    router.use(url, await loadBlockPage(url))
  }
  router.go(url)
}
