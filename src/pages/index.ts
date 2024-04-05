import { loadBlockPage } from '../utils/getPageBlock'
import Router from '../modules/router'
import { getPageName } from './../utils'

export async function template (): Promise<void> {
  const pageName: string = getPageName(location.href)
  const pageNameUrl = `/${pageName}`

  const router = new Router('#app')

  router
    .use(pageNameUrl, await loadBlockPage(pageNameUrl))
    .start()

  router.go(pageNameUrl)
}
