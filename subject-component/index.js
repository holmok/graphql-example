const GraphQLComponent = require('graphql-component')
const Wreck = require('@hapi/wreck')
const debug = require('debug')('subject-component')

class SubjectComponent extends GraphQLComponent {
  constructor ({ baseUrl }) {
    const wreck = Wreck.defaults({
      baseUrl
    })
    const types = `
      # A topic.
      type Subject {
        id: ID!
        # The name.
        name: String,
        # The parent topic id.
        topic: String,
        # When created.
        created: String
      }
      type Query {
        # Search for an subject by id.
        subject(id: ID!) : Subject,
        # List subjects for topic.
        subjects(topic: String) : [Subject]
      }
      type Mutation {
        # Create a new topic.
        createSubject(name: String!, topic: String!) : Subject,
        # Create a new topic.
        updateSubject(id: ID!,name: String!) : Subject,
        # Create a new topic.
        deleteSubject(id: ID!) : Subject
      }
    `

    const resolvers = {
      Query: {
        async subject (_, { id }, { call }) {
          const uri = `/subjects/${id}`
          debug('[subject] calling: %s', uri)
          const { res, payload } = await wreck.get(uri)
          debug('[subject] got (%s): %o', res.statusCode, payload)
          return payload
        },
        async subjects (_, { topic }, { call }) {
          const uri = `/subjects/?topic=${topic}`
          debug('[subjects] calling: %s', uri)
          const { res, payload } = await wreck.get(uri)
          debug('[subjects] got (%s): %o', res.statusCode, payload)
          return payload
        }
      },
      Mutation: {
        async createSubject (_, { name }, { call }) {
          const uri = '/subjects'
          debug('[createSubject] calling: %s', uri)
          const { res, payload } = await wreck.post(uri, {
            payload: { name }
          })
          debug('[createSubject] got (%s): %o', res.statusCode, payload)
          return payload
        },
        async updateSubject (_, { id, name }, { call }) {
          const uri = `/subjects/${id}`
          debug('[updateSubject] calling: %s', uri)
          const { res, payload } = await wreck.put(uri, {
            payload: { name }
          })
          debug('[updateSubject] got (%s): %o', res.statusCode, payload)
          return payload
        },
        async deleteSubject (_, { id }, { call }) {
          const uri = `/subjects/${id}`
          debug('[deleteSubject] calling: %s', uri)
          const { res, payload } = await wreck.delete(uri)
          debug('[deleteSubject] got (%s): %o', res.statusCode, payload)
          return payload
        }
      }
    }

    super({ types, resolvers })
  }
}

module.exports = { SubjectComponent, GraphQLComponent }
