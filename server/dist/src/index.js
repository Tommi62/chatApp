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
const fastify = require('fastify')({ logger: true });
const path = require('path');
const autoload = require('fastify-autoload');
fastify.register(require('fastify-websocket'));
fastify.register(require('fastify-cors'), {
    origin: "http://localhost:3000",
    credentials: true,
});
const dbconnector = require('./db/db');
fastify.register(dbconnector);
fastify.register(autoload, {
    dir: path.join(__dirname, 'plugins')
});
fastify.register(autoload, {
    dir: path.join(__dirname, 'routes')
});
let clients = [];
fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    connection.socket.on('message', message => {
        if (message.toString() !== 'pong') {
            const clientMessage = JSON.parse(message.toString());
            if (clientMessage.type === 'client') {
                console.log('Threads: ', clientMessage.threads);
                const clientObject = {
                    user_id: clientMessage.user_id,
                    threads: clientMessage.threads,
                    client: connection,
                };
                clients.push(clientObject);
            }
            else {
                for (let i = clients.length - 1; i > -1; i--) {
                    if (clientMessage.type === 'newThread') {
                        const threadIdObject = {
                            thread_id: clientMessage.thread_id
                        };
                        if (clients[i].user_id === clientMessage.user2_id) {
                            clients[i].threads.push(threadIdObject);
                        }
                        else if (clients[i].user_id === clientMessage.user_id) {
                            clients[i].threads.push(threadIdObject);
                        }
                    }
                    if (clients[i].client.socket._readyState === 3) {
                        clients.splice(i, 1);
                    }
                    else {
                        for (let j = 0; j < clients[i].threads.length; j++) {
                            if (clients[i].threads[j].thread_id === clientMessage.thread_id) {
                                console.log('USERIDCLIENT: ', clients[i].user_id);
                                console.log('CONNECTION:', clients[i].client.socket._readyState);
                                clients[i].client.socket.send(message.toString());
                            }
                        }
                    }
                }
            }
        }
        else {
            setTimeout(() => connection.socket.send('ping'), 1000);
        }
    });
    connection.socket.send('ping'); //loop start
});
// Run the server!
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.listen(3001);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
start();
//# sourceMappingURL=index.js.map