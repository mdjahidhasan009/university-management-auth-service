import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: object,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

////TODO: have to study
//without async await in auth.ts file code below verifyToken not execute in src > app > middlewares > auth.ts
// const verifyToken = async (token: string, secret: Secret): JwtPayload => {
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  // return await jwt.verify(token, secret) as JwtPayload;
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (e) {
    console.info('error in verify token', e);
    // next();
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
