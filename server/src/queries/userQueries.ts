import { FastifyReply, FastifyRequest } from 'fastify';

const bcrypt = require('bcryptjs')


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
      const {rows} = await request.db.client.query('SELECT * FROM "user"') 
      console.log(rows) 
      reply.send(rows) 
    } catch(err) { 
        throw new Error(err) 
    } 
}

const getUserByUsername = async (request: UserRequest, reply: FastifyReply) => {
    const username = request.params.username
    try { 
      const {rows} = await request.db.client.query('SELECT * FROM "user" WHERE username = $1', [username]) 
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
      await request.db.client.query('INSERT INTO "user"(username, password) VALUES($1, $2)', [username, hashed])

      const isSessionIdReserved = await isLoggedIn(request, reply)

      if(isSessionIdReserved.success) {
        const deleteId = await logout(request, reply)
        if(!deleteId.success) {
          throw new Error()
        }
      }
       
      reply.send({ message: 'User added successfully'}) 
    } catch(err) { 
        throw new Error(err) 
    } 
}

const isLoggedIn = async (request: UserRequest, reply: FastifyReply) => {
  const sessionId = request.session.sessionId
  console.log('SESSIONID', sessionId)
  try { 
    const result = await request.db.client.query('SELECT user_id FROM session WHERE session_id = $1', [sessionId]) 

    console.log('ISLOGGEDIN: ', result.rows[0].user_id)
  
    return {id: result.rows[0].user_id, success: true}
  } catch(err) { 
      return {success: false} 
  } 
}

const logout = async (request: UserRequest, reply: FastifyReply) => {
  const sessionId = request.session.sessionId
  try { 
    await request.db.client.query('DELETE FROM session WHERE session_id = $1', [sessionId]) 
  
    return {success: true}
  } catch(err) { 
      return {success: false} 
  } 
}

const login = async (request: UserRequest, reply: FastifyReply) => {
  const {username, password} = request.body
  console.log('LOGIN: ', username)
  try { 
    const user = await request.db.client.query('SELECT id, username, password FROM "user" WHERE username = $1', [username]) 
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password)
    
    if(!isValidPassword) {
      throw new Error()
    }

    const isSessionIdReserved = await isLoggedIn(request, reply)

    if(isSessionIdReserved.success) {
      const deleteId = await logout(request, reply)
      if(!deleteId.success) {
        throw new Error()
      }
    }

    const deleteSuccess = await deletePreviousLogins(request, user.rows[0].id)
    console.log('DELETESUCCESS: ', deleteSuccess)

    await request.db.client.query('INSERT INTO session(session_id, user_id) VALUES($1, $2)', [request.session.sessionId, user.rows[0].id])
  
    return { id: user.rows[0].id, username: user.rows[0].username, success: true }
  } catch(err) { 
      throw new Error('Invalid username or password') 
  } 
}

const deletePreviousLogins = async (request: FastifyRequest, id: number) => {
  try { 
    await request.db.client.query('DELETE FROM session WHERE user_id = $1', [id]) 
  
    return {success: true}
  } catch(err) { 
      return {success: false} 
  } 
}

const getProfile = async (request: UserRequest, reply: FastifyReply) => {
  try { 
    const loggedInUser = await isLoggedIn(request, reply)
    
    if(loggedInUser.success) {
      const user = await request.db.client.query('SELECT id, username FROM "user" WHERE id = $1', [loggedInUser.id])  
      return user.rows[0]
    }else {
      throw new Error()
    }
  } catch(err) { 
      throw new Error('You must be logged in to view this data') 
  }  
}


  
module.exports = {getUsers, getUserByUsername, createUser, isLoggedIn, login, logout, getProfile}