
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-cors'), { 
  origin: "*",
})

//const dbconnector = require('./db/db')
//fastify.register(dbconnector)
fastify.register(require('./routes/chatRoute'))

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