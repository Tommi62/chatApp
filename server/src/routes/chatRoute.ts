import { FastifyInstance, FastifyServerOptions } from 'fastify';

const chatRoute = async (fastify: FastifyInstance, options: FastifyServerOptions) => {
    const db = require('../queries/chatQueries')

    fastify.get('/threads/:id', db.getThreadsByUserId)
    fastify.get('/threadusers/:id', db.getUsersByThreadId)
    fastify.get('/thread/:id', db.getThreadNameByThreadId)
    fastify.post('/message', db.postMessage)
    fastify.get('/messages/:id', db.getMessagesByThreadId)
    fastify.get('/all_messages/:id', db.getAllMessagesByThreadId)
    fastify.get('/last_message/:id', db.getLastMessageByThreadId)
    fastify.post('/new_thread', db.createNewChatThread)
}

module.exports = chatRoute