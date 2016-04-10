import assert from 'assert'

const random = (n) => Math.random() * n | 0

const NUM_VERTICIES = 3
const NUM_STRANDS = 50
const HEADER_BYTES = 4
const BYTES_PER_STRAND = 5 + 2 * NUM_VERTICIES
const TOTAL_BYTES = HEADER_BYTES + NUM_STRANDS * BYTES_PER_STRAND

export function generate () {
  // Header: 4 bytes: num verticies per shape and BG color (r, g, and b)
  // Shape:  5 + 2 * n bytes: 2 * n bytes for the verticies,
  //         4 for the shape color and alpha, 1 for the draw order
  let index = 0
  const buffer = new Buffer(TOTAL_BYTES)
  buffer[index++] = NUM_VERTICIES
  buffer[index++] = random(256) // red
  buffer[index++] = random(256) // green
  buffer[index++] = random(256) // blue

  for (let i = HEADER_BYTES; i < TOTAL_BYTES; i += BYTES_PER_STRAND) {
    buffer[index++]   = random(256) // red
    buffer[index++] = random(256) // green
    buffer[index++] = random(256) // blue
    buffer[index++] = random(256) // alpha
    buffer[index++] = random(256) // drawOrder
    for (let j = 0; j < NUM_VERTICIES; j++) {
      buffer[index++] = random(256) // x
      buffer[index++] = random(256) // y
    }
  }

  return buffer
}

export function duplicate (buffer) {
  const newBuffer = new Buffer(buffer.length)
  buffer.copy(newBuffer)
  return newBuffer
}

export function mutate (buffer, mutationChance) {
  const newBuffer = duplicate(buffer)
  newBuffer.forEach((gene, idx) => {
    if (idx === 0) return;

    if (Math.random() <= mutationChance) {
      const shiftAmount = Math.random() * 8 | 0
      const newGene = gene ^ (1 << shiftAmount)
      newBuffer[idx] = newGene
    }
  })
  return newBuffer
}

export function parse (dna) {
  const numVerticies = dna[0]
  dna = dna.slice(1)
  const [r, g, b] = dna
  dna = dna.slice(3)

  const shapes = []
  while (dna.length) {
    const [r, g, b, a, drawOrder] = dna
    dna = dna.slice(5)
    const shape = { r, g, b, a, drawOrder, verticies: [] }
    for (let j = 0; j < numVerticies; j++) {
      const [x, y] = dna
      shape.verticies.push({ x, y })
      dna = dna.slice(2)
    }
    shapes.push(shape)
  }

  assert.equal(dna.length, 0, 'expected to consume all bytes')

  return {
    numVerticies,
    bg: { r, g, b },
    shapes
  }
}
