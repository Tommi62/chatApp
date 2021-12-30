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
const userRoute = (fastify, options) => __awaiter(void 0, void 0, void 0, function* () {
    const db = require('../queries/userQueries');
    fastify.get('/users', db.getUsers);
    fastify.get('/users/username/:username', db.getUserByUsername);
    fastify.post('/user', {
        schema: {
            body: {
                type: 'object', required: ['username', 'password'], properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            }
        }
    }, db.createUser);
    fastify.get('/user/:id', db.getUsernameById);
    fastify.get('/isloggedin', db.isLoggedIn);
    fastify.post('/login', {
        schema: {
            body: {
                type: 'object', required: ['username', 'password'], properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            },
        }
    }, db.login);
    fastify.delete('/logout', db.logout);
    fastify.get('/profile', db.getProfile);
});
module.exports = userRoute;
//# sourceMappingURL=userRoute.js.map