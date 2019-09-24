import 'cross-fetch/polyfill'
import Link from 'next/link'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})
const GET_TOPICS = gql`
query {
  topics(offset: 0, take: 10) {
    items {
      id
      name
      subjects {
        id
        name
        created
      }
      created
    }
  }
}
`

function Home() {
  return (
    <Query client={client} query={GET_TOPICS}>
      {({ loading, error, data }) => {
        if (error) return (<p>{error}</p>)
        if (loading || !data) return (<p>Loading</p>)
        console.log(data)
        return data.topics.items.map(topic => (
          <div>
            <p key={topic.id}>
              TOPIC: <strong>{topic.name}</strong> - <em>{topic.created}</em>
            </p>
            <ul>
              {topic.subjects.map(subject => (<li key={subject.id}>Subject = {subject.name}</li>))}
            </ul>
          </div>
        ))
      }}
    </Query>
  )
}

export default Home