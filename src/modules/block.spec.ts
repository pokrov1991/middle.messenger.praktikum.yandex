import { expect } from 'chai'
import Block from './block'
import type EventBus from './event-bus'
import { type Props } from '../types/global'

let isRender = false
let isDidMount = false
let isDidUpdate = false

class SpecBlock extends Block {
  isRender: boolean
  isDidUpdate: boolean

  constructor (props: Props) {
    super('div', props)

    this.isRender = false
    this.isDidUpdate = false
  }

  public specEventBus (): EventBus {
    return this.eventBus()
  }

  componentDidMount (): void {
    isDidMount = true
  }

  componentDidUpdate (): boolean {
    isDidUpdate = true
    return true
  }

  render (): HTMLElement {
    isRender = true
    const template = '<div class="{{ className }}">{{ text }}</div>'
    return this.compile(template, this.props) as unknown as HTMLElement
  }
}

let specBlock: SpecBlock

describe('Модуль компонента Block', () => {
  beforeEach(async () => {
    specBlock = new SpecBlock({
      className: 'test-class',
      text: 'Тестовый текст',
      testProp: ''
    })
  })

  it('должен выполнять событие инициализации flow:component-did-mount', () => {
    specBlock.specEventBus().emit('flow:component-did-mount')
    expect(isDidMount).to.eq(true)
  })

  it('должен выполнять событие рендеринга flow:render', () => {
    expect(isRender).to.eq(true)
  })

  it('должнен выполнять событие рендеринга flow:component-did-update', () => {
    specBlock.setProps({
      testProp: 'test'
    })
    expect(isDidUpdate).to.eq(true)
  })

  it('должен выполнять рендеринг компонента с учетом свойств props', () => {
    if (
      specBlock.getContent()?.className !== null &&
      specBlock.getContent()?.textContent !== null
    ) {
      expect(specBlock.getContent()?.className).to.eq('test-class')
      expect(specBlock.getContent()?.textContent).to.eq('Тестовый текст')
    }
  })

  it('должен выполнять перерендеринг компонента с учетом поменявшихся свойств props', () => {
    specBlock.setProps({
      className: 'updated-test-class',
      text: 'Тестовый текст поменялся'
    })
    expect(specBlock.props.className).to.eq('updated-test-class')
    expect(specBlock.props.text).to.eq('Тестовый текст поменялся')
    if (
      specBlock.getContent()?.className !== null &&
      specBlock.getContent()?.textContent !== null
    ) {
      expect(specBlock.getContent()?.className).to.eq('updated-test-class')
      expect(specBlock.getContent()?.textContent).to.eq('Тестовый текст поменялся')
    }
  })
})
