import { FastifyReply, FastifyRequest } from 'fastify';

const bcrypt = require('bcryptjs')
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
    },
    Params: {
      username: String
    },
    Session: {
      user: Object
    },
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
      const hashed = await bcrypt.hash(password, 10)
      await client.query('INSERT INTO "user"(username, password) VALUES($1, $2)', [username, hashed]) 
      reply.send({ message: 'User added successfully'}) 
    } catch(err) { 
        throw new Error(err) 
    } 
}

const login = async (request: UserRequest, reply: FastifyReply) => {
  const {username, password} = request.body
  console.log('LOGIN: ', username)
  try { 
    const user = await client.query('SELECT id, username, password FROM "user" WHERE username = $1', [username]) 
    console.log('HEHEE ', user.rows[0].password)
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password)
    
    console.log('HÖHÖÖ ', isValidPassword)
    if(!isValidPassword) {
      throw new Error()
    }

    request.session.user = { userId: user.rows[0].id }
  
    return { id: user.rows[0].id, username: user.rows[0].username, success: true }
  } catch(err) { 
      throw new Error('Invalid username or password') 
  } 
}

const getProfile = async (request: UserRequest, reply: FastifyReply) => {
  try { 
    const { userId } = request.session.user
    const user = await client.query('SELECT id, username FROM "user" WHERE id = $1', [userId])  
    return user
  } catch(err) { 
      throw new Error('You must be logged in to view this data') 
  }  
}


  
module.exports = {getUsers, getUserByUsername, createUser, login, getProfile}