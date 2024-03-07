import './not-found.scss'
import Handlebars from 'handlebars'
import { layoutEmpty } from './../../layouts'
import { error } from './../../modules'

export async function notFound() {
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

  return await import('./not-found.hbs?raw')
}
