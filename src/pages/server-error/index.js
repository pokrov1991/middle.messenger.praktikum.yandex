import './server-error.scss'
import Handlebars from 'handlebars'
import { layoutEmpty } from './../../layouts'
import { error } from './../../modules'

export async function serverError() {
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
  
  return await import('./server-error.hbs?raw')
}