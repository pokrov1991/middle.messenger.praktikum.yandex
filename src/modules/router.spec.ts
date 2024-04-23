import { expect } from 'chai'
import { stub } from 'sinon'
import Router from './router'
import Block from './block'

describe('Модуль роутера Router', () => {
  class LoginBlock extends Block {
    constructor () {
      super('section', {})
    }
  }
  class SignUpBlock extends Block {
    constructor () {
      super('section', {})
    }
  }
  class MessengerBlock extends Block {
    constructor () {
      super('section', {})
    }
  }

  const loginPage = new LoginBlock()
  const signUpPage = new SignUpBlock()
  const messengerPage = new MessengerBlock()
  let router: Router

  beforeEach(async () => {
    router = new Router('#app')

    router
      .use('/', loginPage)
      .use('/sign-up', signUpPage)
      .use('/messenger', messengerPage)
      .start()
  })

  it('должен менять состояние сущности history при переходе на новую страницу', () => {
    router.go('/')
    router.go('/sign-up')
    expect(router.history.length).to.eq(3)
  })

  it('должен правильно выполнять методы go, back, forward', () => {
    const goStub = stub(window.history, 'pushState')
    const backStub = stub(window.history, 'back')
    const forwardStub = stub(window.history, 'forward')

    router.go('/')
    void expect(goStub.calledWith({}, '', '/')).to.be.true

    router.go('/messenger')
    void expect(goStub.calledWith({}, '', '/messenger')).to.be.true

    router.back()
    void expect(backStub.called).to.be.true

    router.forward()
    void expect(forwardStub.called).to.be.true

    goStub.restore()
    backStub.restore()
    forwardStub.restore()
  })
})
