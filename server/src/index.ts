
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-cors'), { 
  origin: "*",
})

//const dbconnector = require('./db/db')
//fastify.register(dbconnector)

const db = require('./queries')

fastify.get('/users', db.getUsers)
fastify.get('/users/username/:username', db.getUserByUsername)
fastify.post('/user', db.createUser)


// Run the server!
const start = async () => {
  try {
    await fastify.listen(3001)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()