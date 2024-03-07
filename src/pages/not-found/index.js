import './not-found.scss'
import Handlebars from 'handlebars'
import { layoutEmpty } from './../../layouts'
import { error } from './../../modules'

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

export { default as NotFound } from './not-found.hbs?raw'