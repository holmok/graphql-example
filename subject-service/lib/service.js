const Path = require('path')
const debug = require('debug')('topic-service:service')
const Fs = require('fs')
const Uuid = require('uuid62')

const internals = {
  save () {
    Fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2))
  },
  load () {
    if (Fs.existsSync(this.path)) {
      return JSON.parse(Fs.readFileSync(this.path))
    } else {
      return []
    }
  }
}

module.exports = class service {
  constructor (path) {
    this.path = Path.join(process.cwd(), path)
    this.data = internals.load.call(this)
  }

  list (topic) {
    return this.data.filter(i => i.topic === topic)
  }

  add (item) {
    const id = Uuid.v4()
    const data = {
      ...{
        id,
        created: new Date().toISOString()
      },
      ...item
    }
    this.data.push(data)
    internals.save.call(this)
    return data
  }

  update (id, item) {
    const prev = this.get(id)
    debug(prev)
    if (!prev) {
      throw new Error('Item does not exist')
    }
    const index = this.data.findIndex(i => i.id === id)
    const data = { ...prev, ...item }
    this.data[index] = data
    internals.save.call(this)
    return data
  }

  get (id) {
    return this.data.find(i => i.id === id)
  }

  delete (id) {
    const index = this.data.findIndex(i => i.id === id)
    const data = this.data.splice(index, 1)
    internals.save.call(this)
    return data[0]
  }
}
