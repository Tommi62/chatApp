const fastify = require('fastify')({ logger: true })
const path = require('path')
const autoload = require('fastify-autoload')

fastify.register(require('fastify-cors'), { 
  origin: "http://localhost:3000",
  credentials: true,
})

const dbconnector = require('./db/db')
fastify.register(dbconnector)

fastify.register(autoload,{
  dir: path.join(__dirname, 'plugins')
})

fastify.register(autoload,{
  dir: path.join(__dirname, 'routes')
})

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