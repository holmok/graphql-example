const GraphQLComponent = require('graphql-component')
const Wreck = require('@hapi/wreck')
const debug = require('debug')('topic-component')
const { SubjectComponent } = require('./subjects')

class TopicComponent extends GraphQLComponent {
  constructor ({ baseUrl }) {
    const wreck = Wreck.defaults({
      baseUrl
    })
    const subjects = new SubjectComponent({ baseUrl: 'http://localhost:3001/api' })
    const types = `
      # A topic.
      type Topic {
        id: ID!
        # The author name.
        name: String,
        # The author email.
        created: String
        #subjects of topics
        subjects: [Subject]
      }
      type Topics {
          total: Int,
          more: Boolean,
          items: [Topic]
      }
      type Query {
        # Search for an topic by id.
        topic(id: ID!) : Topic,
        # List topics paged.
        topics(offset: Int, take: Int) : Topics
      }
      type Mutation {
        # Create a new topic.
        createTopic(name: String!) : Topic,
        # Create a new topic.
        updateTopic(id: ID!,name: String!) : Topic,
        # Create a new topic.
        deleteTopic(id: ID!) : Topic
      }
    `

    const resolvers = {
      Query: {
        async topic (_, { id }, { call }) {
          const uri = `topics/${id}`
          debug('[topic] calling: %s', uri)
          const { res, payload } = await wreck.get(uri)
          const result = JSON.parse(payload.toString('utf-8'))
          debug('[topic] got (%s): %o', res.statusCode, result)
          return result
        },
        async topics (_, { offset = 0, take = 10 }, { call }) {
          const uri = `topics?take=${take}&offset=${offset}`
          debug('[topics] calling: %s', uri)
          const { res, payload } = await wreck.get(uri)
          const result = JSON.parse(payload.toString('utf-8'))
          debug('[topics] got (%s): %o', res.statusCode, result)
          return result
        }
      },
      Mutation: {
        async createTopic (_, { name }, { call }) {
          const uri = 'topics'
          debug('[createTopic] calling: %s', uri)
          const { res, payload } = await wreck.post(uri, {
            payload: { name }
          })
          const result = JSON.parse(payload.toString('utf-8'))
          debug('[createTopic] got (%s): %o', res.statusCode, result)
          return result
        },
        async updateTopic (_, { id, name }, { call }) {
          const uri = `topics/${id}`
          debug('[updateTopic] calling: %s', uri)
          const { res, payload } = await wreck.put(uri, {
            payload: { name }
          })
          const result = JSON.parse(payload.toString('utf-8'))
          debug('[updateTopic] got (%s): %o', res.statusCode, result)
          return result
        },
        async deleteTopic (_, { id }, { call }) {
          const uri = `topics/${id}`
          debug('[updateTopic] calling: %s', uri)
          const { res, payload } = await wreck.delete(uri)
          const result = JSON.parse(payload.toString('utf-8'))
          debug('[updateTopic] got (%s): %o', res.statusCode, result)
          return result
        }
      },
      Topic: {
        async subjects (topic, args, context, info) {
          const { data, errors } = await subjects.execute(
            `query { subjects(topic: "${topic.id}") { id,name }}`,
            context)

          if (errors) {
            throw errors[0]
          }

          return data.subjects
        }
      }
    }

    super({ types, resolvers, imports: [subjects] })
  }
}

module.exports = { TopicComponent, GraphQLComponent }
