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
  ctx.body = service.add(ctx.request.body)
  ctx.status = 201
})

router.get('/topics', async ctx => {
  ctx.body = service.list(ctx.query)
  ctx.status = 200
})

router.get('/topics/:id', async ctx => {
  ctx.body = service.get(ctx.params.id)
  ctx.status = 200
})

router.put('/topics/:id', async ctx => {
  ctx.body = service.update(ctx.params.id, ctx.request.body)
  ctx.status = 200
})

router.del('/topics/:id', async ctx => {
  ctx.body = service.delete(ctx.params.id)
  ctx.status = 200
})

module.exports = router
