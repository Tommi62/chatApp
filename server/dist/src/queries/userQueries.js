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
const bcrypt = require('bcryptjs');
const getUsers = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield request.db.client.query('SELECT id, username FROM "user"');
        console.log(rows);
        reply.send(rows);
    }
    catch (err) {
        throw new Error(err);
    }
});
const getUserByUsername = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const username = request.params.username;
    try {
        const { rows } = yield request.db.client.query('SELECT * FROM "user" WHERE username = $1', [username]);
        console.log(rows);
        if (rows.length === 0) {
            reply.send(true);
        }
        else {
            reply.send(false);
        }
    }
    catch (err) {
        throw new Error(err);
    }
});
const getUsernameById = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const user = yield request.db.client.query('SELECT username FROM "user" WHERE id = $1', [id]);
        return { username: user.rows[0].username };
    }
    catch (err) {
        throw new Error(err);
    }
});
const createUser = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    console.log('UUSER: ', username);
    try {
        const hashed = yield bcrypt.hash(password, 10);
        yield request.db.client.query('INSERT INTO "user"(username, password) VALUES($1, $2)', [username, hashed]);
        const isSessionIdReserved = yield isLoggedIn(request, reply);
        if (isSessionIdReserved.success) {
            const deleteId = yield logout(request, reply);
            if (!deleteId.success) {
                throw new Error();
            }
        }
        reply.send({ message: 'User added successfully' });
    }
    catch (err) {
        throw new Error(err);
    }
});
const isLoggedIn = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = request.session.sessionId;
    console.log('SESSIONID', sessionId);
    try {
        const result = yield request.db.client.query('SELECT user_id FROM session WHERE session_id = $1', [sessionId]);
        console.log('ISLOGGEDIN: ', result.rows[0].user_id);
        return { id: result.rows[0].user_id, success: true };
    }
    catch (err) {
        return { success: false };
    }
});
const logout = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = request.session.sessionId;
    try {
        yield request.db.client.query('DELETE FROM session WHERE session_id = $1', [sessionId]);
        return { success: true };
    }
    catch (err) {
        return { success: false };
    }
});
const login = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    console.log('LOGIN: ', username);
    try {
        const user = yield request.db.client.query('SELECT id, username, password FROM "user" WHERE username = $1', [username]);
        const isValidPassword = yield bcrypt.compare(password, user.rows[0].password);
        if (!isValidPassword) {
            throw new Error();
        }
        const isSessionIdReserved = yield isLoggedIn(request, reply);
        if (isSessionIdReserved.success) {
            const deleteId = yield logout(request, reply);
            if (!deleteId.success) {
                throw new Error();
            }
        }
        const deleteSuccess = yield deletePreviousLogins(request, user.rows[0].id);
        console.log('DELETESUCCESS: ', deleteSuccess);
        yield request.db.client.query('INSERT INTO session(session_id, user_id) VALUES($1, $2)', [request.session.sessionId, user.rows[0].id]);
        return { id: user.rows[0].id, username: user.rows[0].username, success: true };
    }
    catch (err) {
        throw new Error('Invalid username or password');
    }
});
const deletePreviousLogins = (request, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield request.db.client.query('DELETE FROM session WHERE user_id = $1', [id]);
        return { success: true };
    }
    catch (err) {
        return { success: false };
    }
});
const getProfile = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = yield isLoggedIn(request, reply);
        if (loggedInUser.success) {
            const user = yield request.db.client.query('SELECT id, username FROM "user" WHERE id = $1', [loggedInUser.id]);
            return user.rows[0];
        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        throw new Error('You must be logged in to view this data');
    }
});
module.exports = { getUsers, getUserByUsername, getUsernameById, createUser, isLoggedIn, login, logout, getProfile };
//# sourceMappingURL=userQueries.js.map