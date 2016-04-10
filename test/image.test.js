import {expect} from 'chai'

import {scoreSimilarity} from '../client/image'

describe('scoreSimilarity', () => {
  it('scores identical images as 1', () => {
    let d1 = [255, 255, 255, 255, 0, 0, 0, 0]
    let d2 = [255, 255, 255, 255, 0, 0, 0, 0]
    expect(scoreSimilarity(d1, d2)).to.equal(1)
  })

  it('scores non-matching images as 0', () => {
    let d1 = [0, 0, 0, 0, 255, 255, 255, 255]
    let d2 = [255, 255, 255, 255, 0, 0, 0, 0]
    expect(scoreSimilarity(d1, d2)).to.equal(0)
  })

  it('scores half-matching images as 0.5', () => {
    let d1 = [0, 0, 255, 255, 255, 255, 0, 0]
    let d2 = [255, 255, 255, 255, 0, 0, 0, 0]
    expect(scoreSimilarity(d1, d2)).to.equal(0.5)
  })
})
