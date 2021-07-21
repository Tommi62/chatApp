import { FastifyReply, FastifyRequest } from 'fastify';

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


dbconnector();

type UserRequest = FastifyRequest<{
    Body: { 
      username: String,
      password: String 
    };
    Params: {
      username: String
    }
}>


const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try { 
      const {rows} = await client.query('SELECT * FROM "user"') 
      console.log(rows) 
      reply.send(rows) 
    } catch(err) { 
        throw new Error(err) 
    } 
}

const getUserByUsername = async (request: UserRequest, reply: FastifyReply) => {
    const username = request.params.username
    try { 
      const {rows} = await client.query('SELECT * FROM "user" WHERE username = $1', [username]) 
      console.log(rows)
      if(rows.length === 0){
        reply.send(true)
      }else {
        reply.send(false)
      }  
    } catch(err) { 
        throw new Error(err) 
    }  
}

const createUser = async (request: UserRequest, reply: FastifyReply) => {
    const {username, password} = request.body
    console.log('UUSER: ', username)
    try { 
      await client.query('INSERT INTO "user"(username, password) VALUES($1, $2)', [username, password]) 
      reply.send({ message: 'User added successfully'}) 
    } catch(err) { 
        throw new Error(err) 
    } 
}


  
module.exports = {getUsers, getUserByUsername, createUser}