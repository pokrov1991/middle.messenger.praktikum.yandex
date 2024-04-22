import { expect } from 'chai'
import HTTP from './http'

function add (a: number, b: number): number {
  return a + b
}

describe('Typescript + Babel usage suite', () => {
  it('should return string correctly', () => {
    expect(HTTP, 'Hello mocha')
  })

  it('должна складывать два числа', () => {
    expect(add(2, 3)).to.equal(9)
  })
})
