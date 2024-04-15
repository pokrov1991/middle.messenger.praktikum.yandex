import { loadBlockPage } from '../utils/getPageBlock'
import Router from '../modules/router'
import { getPageName } from './../utils'

export async function template (): Promise<void> {
  const pageNameParams: string = getPageName(location.href)

  let pageNameUrl = location.pathname

  if (pageNameParams !== '') {
    pageNameUrl = `/${pageNameParams}`
  }

  const router = new Router('#app')

  router
    .use(pageNameUrl, await loadBlockPage(pageNameUrl))
    .start()

  router.go(pageNameUrl)
}
