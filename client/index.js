/* @jsx etch.dom */
import etch from 'etch'

import {generate, duplicate, mutate} from './dna'
import {imageFromFile, drawImage, drawDna, scoreSimilarity} from './image'
import Hex from './components/hex'

class CanvasComponent {
  constructor () {
    etch.initialize(this)
    this._context = this.refs.canvas.getContext('2d')
  }

  update () {}

  get context () {
    return this._context
  }

  render () {
    return <canvas ref='canvas' width={256} height={256} />
  }
}

class Application {
  constructor () {
    this.image = null
    const image = new Image()
    image.onload = () => {
      this.image = image
      drawImage(this.image, this.imageCtx)
      this.imageData = this.imageCtx.getImageData(0, 0, 256, 256).data
      const parentData = this.parentCtx.getImageData(0, 0, 256, 256).data
      this.score = scoreSimilarity(this.imageData, parentData)
      etch.update(this)
    }
    image.src = '/monalisa.png'
    this.running = false
    this.parent = generate()
    this.child = duplicate(this.parent)
    this.generation = 0
    this.improvements = 0
    this.reign = 1
    this.score = -Infinity
    this.mutationProbability = {
      min: 0,
      max: 0.3,
      step: 0.01,
      value: 0.05
    }

    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleResume = this.handleResume.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.handleProbability = this.handleProbability.bind(this)
    this.tick = this.tick.bind(this)

    etch.initialize(this)

    this.imageCtx = this.refs.image.context
    this.parentCtx = this.refs.parent.context
    this.childCtx = this.refs.child.context

    drawDna(this.parent, this.parentCtx)
    drawDna(this.child, this.childCtx)
  }

  update () {}

  render () {
    const mp = this.mutationProbability
    return (
      <div>
        <div>
          <CanvasComponent ref='image' />
          <CanvasComponent ref='parent' />
          <CanvasComponent ref='child' />
        </div>
        <div>
          <input type='file' onchange={this.handleFileChange} />
          <button onclick={this.handleResume}>Resume</button>
          <button onclick={this.handlePause}>Pause</button>
          <input type='range' value={mp.value} oninput={this.handleProbability}
            min={mp.min} max={mp.max} step={mp.step} />
          <span>
            Mutation Probability: {mp.value}
          </span>
        </div>
        <ul className='stats'>
          <li>generation: {this.generation}</li>
          <li>score: {(Math.round(this.score * 10000) / 100).toFixed(3)}%</li>
          <li>improvements: {this.improvements}</li>
          <li>reign: {this.reign}</li>
        </ul>
        <div>
          <Hex value={this.parent} />
          <hr />
          <Hex value={this.child} />
        </div>
      </div>
    )
  }

  handleFileChange (evt) {
    const file = evt.target.files[0]
    imageFromFile(file, img => {
      this.image = img
      drawImage(this.image, this.imageCtx)
      etch.update(this)
    })
  }

  handleResume () {
    if (!this.image) return

    this.running = true
    this.tick()
  }

  handlePause () {
    this.running = false
  }

  handleProbability (evt) {
    this.mutationProbability.value = parseFloat(evt.target.value)
    etch.update(this)
  }

  tick () {
    this.generation++
    this.child = mutate(this.parent, this.mutationProbability.value)
    drawDna(this.child, this.childCtx)
    const childData = this.childCtx.getImageData(0, 0, 256, 256).data
    const childScore = scoreSimilarity(this.imageData, childData)
    if (childScore > this.score) {
      this.parent = this.child
      drawDna(this.parent, this.parentCtx)
      this.score = childScore
      this.improvements++
      this.reign = 1
    } else {
      this.reign++
    }
    etch.update(this)
    if (this.running) requestAnimationFrame(this.tick, 0)
  }
}

const app = new Application()
document.body.appendChild(app.element)
