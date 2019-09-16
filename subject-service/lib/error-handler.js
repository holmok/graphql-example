module.exports = function ErrorHandler () {
  return async function ErrorHandlerMiddleware (ctx, next) {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = { code: parseInt(ctx.status), message: err.message }
      ctx.log.error(err)
    }
  }
}
