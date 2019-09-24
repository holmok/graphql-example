const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const Logger = require('koa-pino-logger')
const debug = require('debug')('topic-service:router')
const ErrorHandler = require('./error-handler')
const Service = require('./service')

const service = new Service('data.json')

const router = new Router({ prefix: '/api' })
router
  .use(BodyParser())
  .use(Logger())
  .use(ErrorHandler())

router.get('/health', async ctx => {
  ctx.status = 200
  ctx.body = {
    status: 'ok'
  }
})

router.post('/subjects', async ctx => {
  ctx.status = 201
  ctx.body = service.add(ctx.request.body)
})

router.get('/subjects', async ctx => {
  ctx.status = 200
  debug(service.list(ctx.query.topic))
  ctx.body = service.list(ctx.query.topic)
})

router.get('/subjects/:id', async ctx => {
  ctx.status = 200
  ctx.body = service.get(ctx.params.id)
})

router.put('/subjects/:id', async ctx => {
  ctx.body = service.update(ctx.params.id, ctx.request.body)
  ctx.status = 200
})

router.del('/subjects/:id', async ctx => {
  ctx.body = service.delete(ctx.params.id)
  ctx.status = 200
})

module.exports = router
