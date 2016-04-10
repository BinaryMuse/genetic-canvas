import {expect} from 'chai'

import {generate, duplicate, mutate, parse} from '../client/dna'

describe('DNA', () => {
  describe('generate', () => {
    it('generates DNA', () => {
      const data = generate()
      for (let [idx, gene] of data.entries()) {
        expect(gene).to.be.within(0, 255)
      }
    })
  })

  describe('mutate', () => {
    it('mutates DNA', () => {
      const oldData = generate()
      const newData = mutate(oldData, 1)
      for (let [idx, gene] of oldData.entries()) {
        expect(newData[idx]).not.to.equal(gene)
      }
    })

    it('has a dynamic mutation chance', () => {
      const oldData = generate()
      const newData = mutate(oldData, 0)
      for (let [idx, gene] of oldData.entries()) {
        expect(newData[idx]).to.equal(gene)
      }
    })
  })

  describe('parse', () => {
    it('parses DNA into a JS-friendly format', () => {
      const data = generate()
      for (let idx of data.keys()) {
        if (idx !== 0) {
          data[idx] = idx
        }
      }

      const parsed = parse(data)
      expect(parsed.numVerticies).to.equal(3)
      expect(parsed.bg).to.eql({r: 1, g: 2, b: 3})
      expect(parsed.shapes.length).to.equal(50)
      const shape = parsed.shapes[0]
      expect(shape).to.eql({
        r: 4, g: 5, b: 6, a: 7,
        drawOrder: 8,
        verticies: [
          {x: 9, y: 10},
          {x: 11, y: 12},
          {x: 13, y: 14}
        ]
      })
    })
  })
})
