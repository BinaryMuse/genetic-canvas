import {parse} from './dna'

export function imageFromFile (file, cb) {
  const fr = new FileReader()
  fr.onload = () => {
    const image = new Image()
    image.src = fr.result
    cb(image)
  }
  fr.readAsDataURL(file)
}

export function drawImage (img, ctx) {
  ctx.drawImage(img, 0, 0, 256, 256)
}

export function drawDna (dna, ctx) {
  const { numVerticies, bg, shapes } = parse(dna)
  const orderedShapes = shapes.sort((a, b) => a.drawOrder - b.drawOrder)
  ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`
  ctx.fillRect(0, 0, 256, 256)
  for (let shape of orderedShapes) {
    drawShape(shape, numVerticies, ctx)
  }
}

function drawShape (shape, numVerticies, ctx) {
  try {
    const { r, g, b, a, drawOrder, verticies } = shape
    ctx.fillStyle = `rgba(${r},${g},${b},${a / 256})`
    ctx.beginPath()
    ctx.moveTo(verticies[0].x, verticies[0].y)
    for (var i = 1; i < verticies.length; i++) {
      ctx.lineTo(verticies[i].x, verticies[i].y)
    }
    ctx.closePath()
    ctx.fill()
  } catch (e) {
    debugger
  }
}
export function scoreSimilarity (data1, data2) {
  let total = 0
  for (let idx = 0; idx < data1.length; idx++) {
    const diff = Math.abs(data1[idx] - data2[idx])
    total += diff
  }

  return (1 - total / (data1.length * 255))
}

export function scoreSimilarityOld (data1, data2) {
  var total = 0
  var diff
  for (var i = 0; i < data1.length; i++) {
    diff = Math.abs(data1[i] - data2[i])
    total += diff
  }

  return (1 - total / (data1.length * 255))
}
