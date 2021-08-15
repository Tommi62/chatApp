import { FastifyInstance, FastifyServerOptions } from 'fastify';

const chatRoute = async (fastify: FastifyInstance, options: FastifyServerOptions) => {
    const db = require('../queries/chatQueries')

    fastify.get('/threads/:id', db.getThreadsByUserId)
    fastify.get('/thread/:id', db.getThreadNameByThreadId)
    fastify.post('/message', db.postMessage)
    fastify.get('/messages/:id', db.getMessagesByThreadId)
}

module.exports = chatRoute