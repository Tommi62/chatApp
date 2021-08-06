import { FastifyInstance, FastifyServerOptions } from 'fastify';

const chatRoute = async (fastify: FastifyInstance, options: FastifyServerOptions) => {
    const db = require('../queries/chatQueries')

    fastify.get('/threads/:id', db.getThreadsbyUserId)
    fastify.get('/thread/:id', db.getThreadNameByThreadId)
}

module.exports = chatRoute