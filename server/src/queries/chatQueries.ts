import { FastifyReply, FastifyRequest } from 'fastify';
import formatISO from 'date-fns/formatISO'

type ChatRequest = FastifyRequest<{
  Params: {
    id: number
  },
  Body: {
    contents: string,
    timestamp: Date,
    user_id: number,
    thread_id: number,
  }
}>

const getThreadsByUserId = async (request: ChatRequest, reply: FastifyReply) => {
  const userId = request.params.id
  try {
    console.log('USERID: ', userId)
    const { rows } = await request.db.client.query('SELECT thread_id FROM chatting WHERE user_id = $1', [userId])
    console.log('THREADS: ', rows)
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

const getThreadNameByThreadId = async (request: ChatRequest, reply: FastifyReply) => {
  const threadId = request.params.id
  try {
    const thread = await request.db.client.query('SELECT name FROM thread WHERE id = $1', [threadId])
    console.log('THREADNAME: ', thread.rows[0].name)
    return { name: thread.rows[0].name }
  } catch (err) {
    throw new Error(err)
  }
}

const postMessage = async (request: ChatRequest, reply: FastifyReply) => {
  const { contents, timestamp, user_id, thread_id } = request.body
  console.log('MESSAGE: ', contents)
  const time = formatISO(new Date())
  console.log('TIME: ', time)
  const status = 'unread'
  try {
    await request.db.client.query('INSERT INTO message(contents, timestamp, status, user_id, thread_id) VALUES($1, $2, $3, $4, $5)', [contents, time, status, user_id, thread_id])

    return { success: true }
  } catch (err) {
    throw new Error(err)
  }
}

const getMessagesByThreadId = async (request: ChatRequest, reply: FastifyReply) => {
  const threadId = request.params.id
  try {
    const { rows } = await request.db.client.query('SELECT contents, timestamp, user_id FROM message WHERE thread_id = $1', [threadId])
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = { getThreadsByUserId, getThreadNameByThreadId, postMessage, getMessagesByThreadId }