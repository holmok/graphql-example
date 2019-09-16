const Swagger = require('swagger2')
const { ui, validate } = require('swagger2-koa')
const Koa = require('koa')

const Routes = require('./lib/routes')

const document = Swagger.loadDocumentSync('./swagger.yaml')
const app = new Koa()

app
  .use(ui(document, '/swagger'))
  .use(Routes.routes())
  .use(Routes.allowedMethods())
  .use(validate(document))

app.listen(3001)
