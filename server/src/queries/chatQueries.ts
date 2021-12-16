import { FastifyReply, FastifyRequest } from 'fastify';

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

type CreateNewChatRequest = FastifyRequest<{
  Body: {
    name: string,
    user_id: number,
    user2_id: number,
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

const getUsersByThreadId = async (request: ChatRequest, reply: FastifyReply) => {
  const threadId = request.params.id
  try {
    const { rows } = await request.db.client.query('SELECT user_id FROM chatting WHERE thread_id = $1', [threadId])
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
  const status = 'unread'
  try {
    await request.db.client.query('INSERT INTO message(contents, timestamp, status, user_id, thread_id) VALUES($1, $2, $3, $4, $5)', [contents, timestamp, status, user_id, thread_id])

    return { success: true }
  } catch (err) {
    throw new Error(err)
  }
}

const getMessagesByThreadId = async (request: ChatRequest, reply: FastifyReply) => {
  const threadId = request.params.id
  try {
    const { rows } = await request.db.client.query('SELECT id, contents, timestamp, user_id FROM message WHERE thread_id = $1 ORDER BY id DESC LIMIT 50', [threadId])
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

const getAllMessagesByThreadId = async (request: ChatRequest, reply: FastifyReply) => {
  const threadId = request.params.id
  try {
    const { rows } = await request.db.client.query('SELECT id, contents, timestamp, user_id FROM message WHERE thread_id = $1', [threadId])
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

const getLastMessageByThreadId = async (request: ChatRequest, reply: FastifyReply) => {
  const threadId = request.params.id
  try {
    const { rows } = await request.db.client.query('SELECT id, contents, timestamp, user_id FROM message WHERE thread_id = $1 AND id = (SELECT MAX(id) FROM message WHERE thread_id = $1)', [threadId])
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

const createNewChatThread = async (request: CreateNewChatRequest, reply: FastifyReply) => {
  const { name, user_id, user2_id } = request.body
  try {
    const thread_id = await request.db.client.query('INSERT INTO thread(name) VALUES($1) RETURNING id', [name])
    console.log('INSERTED ID', thread_id.rows[0].id)

    await request.db.client.query('INSERT INTO chatting(user_id, thread_id) VALUES($1, $2)', [user_id, thread_id.rows[0].id])
    await request.db.client.query('INSERT INTO chatting(user_id, thread_id) VALUES($1, $2)', [user2_id, thread_id.rows[0].id])

    return { success: true, id: thread_id.rows[0].id }
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = { getThreadsByUserId, getUsersByThreadId, getThreadNameByThreadId, postMessage, getMessagesByThreadId, getAllMessagesByThreadId, getLastMessageByThreadId, createNewChatThread }