import { Socket } from "dgram"
import { FastifyRequest } from "fastify"
import * as WebSocket from 'ws';

const fastify = require('fastify')({ logger: true })
const path = require('path')
const autoload = require('fastify-autoload')

fastify.register(require('fastify-websocket'))

fastify.register(require('fastify-cors'), {
  origin: "http://localhost:3000",
  credentials: true,
})

interface SocketStream {
  socket: WebSocket
}

const dbconnector = require('./db/db')
fastify.register(dbconnector)

fastify.register(autoload, {
  dir: path.join(__dirname, 'plugins')
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes')
})

interface clientArray {
  thread_id: number,
  user_id: number,
  client: SocketStream,
}

let clients: Array<clientArray> = [];

fastify.get('/', { websocket: true }, (connection: SocketStream /* SocketStream */, req: FastifyRequest /* FastifyRequest */) => {
  connection.socket.on('message', message => {
    if (message.toString() !== 'pong') {
      const clientMessage = JSON.parse(message.toString())

      if (clientMessage.type === 'client') {
        console.log('ID: ', clientMessage.thread_id)
        const clientObject = {
          thread_id: clientMessage.thread_id,
          user_id: clientMessage.user_id,
          client: connection,
        }
        clients.push(clientObject)
      } else {
        for (let i = clients.length - 1; i > -1; i--) {
          if (clients[i].client.socket._readyState === 3) {
            clients.splice(i, 1);
          } else if (clients[i].thread_id === clientMessage.thread_id) {
            console.log('USERIDCLIENT: ', clients[i].user_id)
            console.log('CONNECTION:', clients[i].client.socket._readyState)
            clients[i].client.socket.send(message.toString())
          }
        }
      }
    } else {
      setTimeout(() => connection.socket.send('ping'), 1000)
    }
  })
  connection.socket.send('ping') //loop start
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