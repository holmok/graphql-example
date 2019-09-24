const { SubjectComponent } = require('./components/subjects')

const topics = new SubjectComponent({ baseUrl: 'http://localhost:3001/api/' })

async function run () {
  const h = await topics.execute(
    `query{subjects(topic:"0dZGpmlo0aeL68SUmFr61j"){
      id
      name
      topic 
      created
    }}`)

  console.log(JSON.stringify(h.data.subjects))
}

run()
