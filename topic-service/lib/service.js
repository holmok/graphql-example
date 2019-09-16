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

  list ({ offset = 0, take = 10 } = {}) {
    return {
      count: this.data.length,
      more: this.data.length > offset + take,
      items: this.data
        .reverse()
        .slice(offset, offset + take)
    }
  }

  add (item) {
    const id = Uuid.v4()
    this.data.push({
      ...{
        id,
        created: new Date().toISOString()
      },
      ...item
    })
    internals.save.call(this)
    return id
  }

  update (id, item) {
    const prev = this.get(id)
    debug(prev)
    if (!prev) {
      throw new Error('Item does not exist')
    }
    const index = this.data.findIndex(i => i.id === id)
    this.data[index] = { ...prev, ...item }
    internals.save.call(this)
  }

  get (id) {
    return this.data.find(i => i.id === id)
  }

  delete (id) {
    const index = this.data.findIndex(i => i.id === id)
    this.data.splice(index, 1)
    internals.save.call(this)
  }
}
