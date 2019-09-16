const Tape = require('tape')
const Sinon = require('sinon')
const Fs = require('fs')

function pre () {
  const context = {}

  context.sandbox = Sinon.createSandbox()
  context.fsMock = context.sandbox.mock(Fs)
  context.Service = require('../../lib/service')

  return context
}

function post (context) {
  context.sandbox.verifyAndRestore()
}

Tape('create instance (no file)', (t) => {
  t.plan(2)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(false)
  const service = new Service('test')
  t.ok(service, 'Created Service')
  post(context)
  t.pass('Success')
})

Tape('create instance (with file)', (t) => {
  t.plan(2)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(true)
  fsMock.expects('readFileSync').once().returns('[]')
  const service = new Service('test')
  t.ok(service, 'Created Service')
  post(context)
  t.pass('Success')
})

Tape('add item', (t) => {
  t.plan(2)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(false)
  fsMock.expects('writeFileSync').once()
  const service = new Service('test')
  t.ok(service, 'Created Service')
  service.add({})
  post(context)
  t.pass('Success')
})

Tape('update item', (t) => {
  t.plan(2)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(true)
  fsMock.expects('readFileSync').once().returns('[{"id":"test"}]')
  fsMock.expects('writeFileSync').once()
  const service = new Service('test')
  t.ok(service, 'Created Service')
  service.update('test', {})
  post(context)
  t.pass('Success')
})

Tape('update item (fail)', (t) => {
  t.plan(3)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(true)
  fsMock.expects('readFileSync').once().returns('[{"id":"test"}]')
  fsMock.expects('writeFileSync').never()
  const service = new Service('test')
  t.ok(service, 'Created Service')
  t.throws(() => { service.update('not-test', {}) }, 'throws as expected')
  post(context)
  t.pass('Success')
})

Tape('get item', (t) => {
  t.plan(3)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(true)
  fsMock.expects('readFileSync').once().returns('[{"id":"test"}]')
  fsMock.expects('writeFileSync').never()
  const service = new Service('test')
  t.ok(service, 'Created Service')
  const item = service.get('test')
  t.equals(item.id, 'test', 'got item')
  post(context)
  t.pass('Success')
})

Tape('delete item', (t) => {
  t.plan(2)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(true)
  fsMock.expects('readFileSync').once().returns('[{"id":"test"}]')
  fsMock.expects('writeFileSync').once()
  const service = new Service('test')
  t.ok(service, 'Created Service')
  service.delete('test')
  post(context)
  t.pass('Success')
})

Tape('list items', (t) => {
  t.plan(4)
  const context = pre()
  const { Service, fsMock } = context
  fsMock.expects('existsSync').once().returns(true)
  fsMock.expects('readFileSync').once().returns('[{"id":"test"}]')
  fsMock.expects('writeFileSync').never()
  const service = new Service('test')
  t.ok(service, 'Created Service')
  const list = service.list()
  t.ok(Array.isArray(list), 'got list')
  t.equals(list.length, 1, 'got 1 item')
  post(context)
  t.pass('Success')
})
