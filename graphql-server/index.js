const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const Logger = require('koa-pino-logger')

const { TopicComponent } = require('topic-component')
const { SubjectComponent, GraphQLComponent } = require('subject-component')

const topics = new TopicComponent({
  baseUrl: 'http://localhost:3000/api'
})

const subjects = new SubjectComponent({
  baseUrl: 'http://localhost:3001/api'
})

const { schema, context } = new GraphQLComponent({ imports: [topics, subjects] })

const server = new ApolloServer({ schema, context })

const app = new Koa()
app.use(Logger())
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
