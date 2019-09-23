const { TopicComponent } = require('topic-component')

const topics = new TopicComponent({ baseUrl: 'http://localhost:3000/api/' })

async function run () {
  const h = await topics.execute(
    'query { topics(offset:0,take:10) { more,total,items }}')

  console.log(JSON.stringify(h))
}

run()
