/*import { FastifyInstance, FastifyServerOptions } from 'fastify';

const fastifyPlugin = require('fastify-plugin') 
const { Client } = require('pg') 
require('dotenv').config() 
const client = new Client({ 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT, 
    database: process.env.DB_NAME 
}) 
async function dbconnector(fastify: FastifyInstance, options: FastifyServerOptions) { 
    try { 
        await client.connect() 
        console.log("db connected succesfully") 
        fastify.decorate('db', {client}) 
    } catch(err) { 
        console.error(err) 
    } 
} 
module.exports= fastifyPlugin(dbconnector)*/