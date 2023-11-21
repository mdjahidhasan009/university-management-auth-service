"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secret, expireTime) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expireTime,
    });
};
const createResetToken = (payload, secrect, expireTime) => {
    return jsonwebtoken_1.default.sign(payload, secrect, {
        algorithm: 'HS256',
        expiresIn: expireTime,
    });
};
////TODO: have to study
//without async await in auth.ts file code below verifyToken not execute in src > app > middlewares > auth.ts
// const verifyToken = async (token: string, secret: Secret): JwtPayload => {
const verifyToken = (token, secret) => {
    // return await jwt.verify(token, secret) as JwtPayload;
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (e) {
        console.info('error in verify token', e);
        // next();
    }
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
    createResetToken,
};
