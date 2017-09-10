import fs from 'fs'
import path from 'path'

var sysPath = '/sys/class/gpio'
const filePath = path.join(sysPath, 'gpio')

function openPin (pinNumber, direction, callback) {
  const file = path.join(filePath + pinNumber, 'direction')
  fs.writeFile(file, direction, (callback || noOp))
}

function writePin (pinNumber, value, callback) {
  const file = path.join(filePath + pinNumber, 'value')
  console.log(file)
  fs.writeFile(file, value, (callback || noOp))
}

function getValue (pinNumber, callback) {
  const file = path.join(filePath + pinNumber, 'value')
  fs.readFile(file, 'utf-8', callback)
}

function getDirection (pinNumber, callback) {
  const file = path.join(filePath + pinNumber, 'direction')
  fs.readFile(file, 'utf-8', callback)
}

function exportPin (pinNumber, exp, callback) {
  fs.writeFile(sysPath + '/' + exp, pinNumber, (callback || noOp))
}

function noOp () {}

export default {
  openPin,
  writePin,
  getValue,
  getDirection,
  exportPin
}
