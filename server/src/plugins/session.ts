import { FastifyInstance } from 'fastify';
const cookie = require('fastify-cookie')
const session = require('fastify-session')
const fp = require('fastify-plugin')

const plugin = async (fastify: FastifyInstance) => {
    fastify.register(cookie)
    fastify.register(session, {
        secret: process.env.SESSION_SECRET,
        saveUnitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
        }
    })
}
module.exports = fp(plugin)