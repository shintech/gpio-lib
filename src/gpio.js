import fs from 'fs'
import path from 'path'
import util from 'util'

var sysPath = '/sys/class/gpio'
const filePath = path.join(sysPath, 'gpio')
const readFile = util.promisify(fs.readFile)

export default class GPIO {
  constructor (pins) {
    this.pins = pins
    this.exportPins(this.pins)
  }

  exportPins () {
    for (let pin of this.pins) {
      var file = ''
      fs.stat(filePath + pin, (err, result) => {
        if (err && err.code === 'ENOENT') {
          console.log(`exporting pin ${pin}...`)
          file = path.join(sysPath, 'export')
          fs.writeFileSync(file, pin)
        }
      })
    }
  }

  openPin (pinNumber, direction, callback) {
    const file = path.join(filePath + pinNumber, 'direction')
    fs.writeFile(file, direction, (callback || noOp))
  }

  writePin (pinNumber, value, callback) {
    value = value ? '1' : '0'
    const file = path.join(filePath + pinNumber, 'value')
    fs.writeFile(file, value, (callback || noOp))
  }

  async getValue (pinNumber) {
    return new Promise(async function (resolve, reject) {
      const file = path.join(filePath + pinNumber, 'value')
      const f = await readFile(file, 'utf-8')

      resolve(f.trim())
    })
  }

  getDirection (pinNumber, callback) {
    const file = path.join(filePath + pinNumber, 'direction')
    fs.readFile(file, 'utf-8', callback)
  }

  exportPin (pinNumber, exp) {
    fs.writeFileSync(sysPath + '/' + exp, pinNumber)
  }
}

function noOp () {}
