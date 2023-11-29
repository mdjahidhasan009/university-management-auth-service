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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
const config_1 = __importDefault(require("../config"));
const redisClient = (0, redis_1.createClient)({
    url: config_1.default.redis.url,
});
const redisPubClient = (0, redis_1.createClient)({
    url: config_1.default.redis.url,
});
const redisSubClient = (0, redis_1.createClient)({
    url: config_1.default.redis.url,
});
redisClient.on('error', err => console.info('Redis error: ', err));
redisClient.on('connect', () => console.info('Redis connected'));
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
    yield redisPubClient.connect();
    yield redisSubClient.connect();
});
const set = (key, value, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.set(key, value, options);
});
const get = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redisClient.get(key);
});
const del = (key) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.del(key);
});
const setAccessToken = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    yield redisClient.set(key, token, { EX: Number(config_1.default.redis.expires_in) });
});
const getAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    return yield redisClient.get(key);
});
const deleteAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `access-token:${userId}`;
    yield redisClient.del(key);
});
const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.quit();
    yield redisPubClient.quit();
    yield redisSubClient.disconnect();
});
exports.RedisClient = {
    connect,
    set,
    get,
    del,
    setAccessToken,
    disconnect,
    getAccessToken,
    deleteAccessToken,
    publish: redisPubClient.publish.bind(redisPubClient),
    subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
