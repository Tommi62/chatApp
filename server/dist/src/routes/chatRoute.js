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
const chatRoute = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    const db = require('../queries/chatQueries');
    fastify.get('/threads/:id', db.getThreadsByUserId);
    fastify.get('/threadusers/:id', db.getUsersByThreadId);
    fastify.get('/thread/:id', db.getThreadNameByThreadId);
    fastify.post('/message', db.postMessage);
    fastify.get('/messages/:id', db.getMessagesByThreadId);
    fastify.get('/all_messages/:id', db.getAllMessagesByThreadId);
    fastify.get('/last_message/:id', db.getLastMessageByThreadId);
    fastify.post('/new_thread', db.createNewChatThread);
});
module.exports = chatRoute;
//# sourceMappingURL=chatRoute.js.map