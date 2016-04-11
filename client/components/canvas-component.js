/* @jsx etch.dom */
import etch from 'etch'

export default class CanvasComponent {
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
