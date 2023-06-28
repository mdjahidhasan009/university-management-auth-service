import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    //this will add the user property to the Request interface in express
    //eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: JwtPayload | null;
    }

    //this will override the Request interface in express
    // type Request = {
    //     user?: JwtPayload;
    // }
  }
}
