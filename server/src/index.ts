const fastify = require('fastify')({ logger: true })
const db = require('./queries')

fastify.register(require('fastify-cors'), { 
  origin: "*",
})

fastify.register(require('./plugins/session'))


//const dbconnector = require('./db/db')
//fastify.register(dbconnector)

fastify.get('/users', db.getUsers)
fastify.get('/users/username/:username', db.getUserByUsername)
fastify.post('/user', {
  schema: {
    body: {
      type: 'object', required: ['username', 'password'], properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      }
    }
  }
}, db.createUser)
fastify.post('/login', {
  schema: {
    body: {
      type: 'object', required: ['username', 'password'], properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      }
    },
  }
}, db.login)
fastify.get('/profile', db.getProfile)


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