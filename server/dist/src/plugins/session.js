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
const cookie = require('fastify-cookie');
const session = require('fastify-session');
const fp = require('fastify-plugin');
const plugin = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.register(cookie);
    fastify.register(session, {
        secret: process.env.SESSION_SECRET,
        saveUnitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
        }
    });
});
module.exports = fp(plugin);
//# sourceMappingURL=session.js.map