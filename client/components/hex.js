/* @jsx etch.dom */
import etch from 'etch'

export default class Hex {
  constructor ({value}) {
    this.value = value
    etch.initialize(this)
  }

  update ({value}) {
    this.value = value
    etch.update(this)
  }

  render () {
    return <div className='hex'>{this.value.toString('hex')}</div>
  }
}
