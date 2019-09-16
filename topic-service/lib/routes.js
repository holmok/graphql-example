const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const Logger = require('koa-pino-logger')

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

router.post('/topics', async ctx => {
  ctx.status = 201
  ctx.body = service.add(ctx.request.body)
})

router.get('/topics', async ctx => {
  ctx.status = 200
  ctx.body = service.list(ctx.query)
})

router.get('/topics/:id', async ctx => {
  ctx.status = 200
  ctx.body = service.get(ctx.params.id)
})

router.put('/topics/:id', async ctx => {
  service.update(ctx.params.id, ctx.request.body)
  ctx.status = 200
  ctx.body = 'OK'
})

router.del('/topics/:id', async ctx => {
  service.delete(ctx.params.id)
  ctx.status = 204
  ctx.body = 'OK'
})

module.exports = router
