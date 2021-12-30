"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getThreadsByUserId = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = request.params.id;
    try {
        console.log('USERID: ', userId);
        const { rows } = yield request.db.client.query('SELECT thread_id FROM chatting WHERE user_id = $1', [userId]);
        console.log('THREADS: ', rows);
        return rows;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getUsersByThreadId = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const threadId = request.params.id;
    try {
        const { rows } = yield request.db.client.query('SELECT user_id FROM chatting WHERE thread_id = $1', [threadId]);
        return rows;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getThreadNameByThreadId = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const threadId = request.params.id;
    try {
        const thread = yield request.db.client.query('SELECT name FROM thread WHERE id = $1', [threadId]);
        console.log('THREADNAME: ', thread.rows[0].name);
        return { name: thread.rows[0].name };
    }
    catch (err) {
        throw new Error(err);
    }
});
const postMessage = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { contents, timestamp, user_id, thread_id } = request.body;
    console.log('MESSAGE: ', contents);
    const status = 'unread';
    try {
        yield request.db.client.query('INSERT INTO message(contents, timestamp, status, user_id, thread_id) VALUES($1, $2, $3, $4, $5)', [contents, timestamp, status, user_id, thread_id]);
        return { success: true };
    }
    catch (err) {
        throw new Error(err);
    }
});
const getMessagesByThreadId = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const threadId = request.params.id;
    try {
        const { rows } = yield request.db.client.query('SELECT id, contents, timestamp, user_id FROM message WHERE thread_id = $1 ORDER BY id DESC LIMIT 50', [threadId]);
        return rows;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getAllMessagesByThreadId = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const threadId = request.params.id;
    try {
        const { rows } = yield request.db.client.query('SELECT id, contents, timestamp, user_id FROM message WHERE thread_id = $1', [threadId]);
        return rows;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getLastMessageByThreadId = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const threadId = request.params.id;
    try {
        const { rows } = yield request.db.client.query('SELECT id, contents, timestamp, user_id FROM message WHERE thread_id = $1 AND id = (SELECT MAX(id) FROM message WHERE thread_id = $1)', [threadId]);
        return rows;
    }
    catch (err) {
        throw new Error(err);
    }
});
const createNewChatThread = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, user_id, user2_id } = request.body;
    try {
        const thread_id = yield request.db.client.query('INSERT INTO thread(name) VALUES($1) RETURNING id', [name]);
        console.log('INSERTED ID', thread_id.rows[0].id);
        yield request.db.client.query('INSERT INTO chatting(user_id, thread_id) VALUES($1, $2)', [user_id, thread_id.rows[0].id]);
        yield request.db.client.query('INSERT INTO chatting(user_id, thread_id) VALUES($1, $2)', [user2_id, thread_id.rows[0].id]);
        return { success: true, id: thread_id.rows[0].id };
    }
    catch (err) {
        throw new Error(err);
    }
});
module.exports = { getThreadsByUserId, getUsersByThreadId, getThreadNameByThreadId, postMessage, getMessagesByThreadId, getAllMessagesByThreadId, getLastMessageByThreadId, createNewChatThread };
//# sourceMappingURL=chatQueries.js.map