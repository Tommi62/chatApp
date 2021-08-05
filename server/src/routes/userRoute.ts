import { FastifyInstance, FastifyServerOptions } from 'fastify';

const userRoute = async (fastify: FastifyInstance, options: FastifyServerOptions) => {
    const db = require('../queries/userQueries')


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
    fastify.get('/isloggedin', db.isLoggedIn)
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
    fastify.delete('/logout', db.logout)
    fastify.get('/profile', db.getProfile)
}

module.exports = userRoute