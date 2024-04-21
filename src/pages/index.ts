import { loadBlockPage } from '../utils/getPageBlock'
import Router from '../modules/router'
import { getPageName } from './../utils'

export async function template (): Promise<void> {
  const pageNameUrl = getPageName(location.href)

  const router = new Router('#app')

  router
    .use(pageNameUrl, await loadBlockPage(pageNameUrl))
    .start()

  router.go(pageNameUrl)
}
