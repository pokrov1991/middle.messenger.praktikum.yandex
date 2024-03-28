import './server-error.scss'
import Handlebars from 'handlebars'
import Block from '../../modules/block'
import { type Props } from '../../types/global'
import { layoutEmpty } from './../../layouts'
import { error } from './../../blocks'

export async function serverError (): Promise<HTMLElement | null> {
  const pagePromise = await import('./server-error.hbs?raw')
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

  class BlockServerError extends Block {
    constructor (props: Props) {
      super('section', props)
    }

    render (): HTMLElement {
      return this.compile(pageTemplate, this.props) as unknown as HTMLElement
    }
  }

  // Создание компонента страницы
  const cServerError = new BlockServerError({
    text: 'Мы уже фиксим'
  })

  return cServerError.getContent()
}
