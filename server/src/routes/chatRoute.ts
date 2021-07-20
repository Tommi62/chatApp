import { FastifyInstance, FastifyReply, FastifyServerOptions, FastifyRequest } from 'fastify';

const { Client } = require('pg') 
require('dotenv').config() 

const client = new Client({ 
  user: process.env.DB_USER, 
  password: process.env.DB_PASS, 
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  database: process.env.DB_NAME 
}) 

const dbconnector = async () => { 
  try { 
      await client.connect() 
      console.log("db connected succesfully")  
  } catch(err) { 
      console.error(err) 
  } 
} 

const routes =  async (fastify: FastifyInstance, options: FastifyServerOptions) => {
  await dbconnector();
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try { 
      const {rows} = await client.query('SELECT * FROM "user"') 
      console.log(rows) 
      reply.send(rows) 
  } catch(err) { 
      throw new Error(err) 
    } 
  })
}
  
  module.exports = routes