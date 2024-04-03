import './not-found.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import { type Props } from '../../types/global'
import { layoutEmpty } from './../../layouts'
import { error } from './../../blocks'

export async function notFound (): Promise<HTMLElement | null> {
  const pagePromise = await import('./not-found.hbs?raw')
  const pageTemplate = pagePromise.default

  const layoutEmptyPromise = await layoutEmpty()
  const LayoutEmpty = layoutEmptyPromise.LayoutEmpty

  const errorPromise = await error()
  const Error = errorPromise.Error

  Object.entries({
    LayoutEmpty,
    Error
  }).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component)
  })

  class BlockNotFound extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонента страницы
  const cNotFound = new BlockNotFound({
    text: 'Не туда попали'
  })

  return cNotFound.getContent()
}
