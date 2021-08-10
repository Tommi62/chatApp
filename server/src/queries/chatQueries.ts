import { FastifyReply, FastifyRequest } from 'fastify';

type ChatRequest = FastifyRequest<{
    Params: {
      id: number
    }
}>

const getThreadsbyUserId = async (request: ChatRequest, reply: FastifyReply) => {
    const userId = request.params.id
    try { 
      console.log('USERID: ', userId)
      const {rows} = await request.db.client.query('SELECT thread_id FROM chatting WHERE user_id = $1', [userId]) 
      console.log('THREADS: ', rows)
      return rows
    } catch(err) { 
        throw new Error(err) 
    }  
}

const getThreadNameByThreadId = async (request: ChatRequest, reply: FastifyReply) => {
    const threadId = request.params.id
    try { 
      const thread = await request.db.client.query('SELECT name FROM thread WHERE id = $1', [threadId]) 
      console.log('THREADNAME: ', thread.rows[0].name)
      return {name: thread.rows[0].name}
    } catch(err) { 
        throw new Error(err) 
    }  
}

module.exports = { getThreadsbyUserId, getThreadNameByThreadId }