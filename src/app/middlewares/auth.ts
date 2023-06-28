import { Request, NextFunction, Response } from 'express';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../erros/ApiError';

const auth =
  (...requestRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizationToken = req.headers.authorization;
      if (!authorizationToken) {
        return res.status(401).json({ message: 'You are not authorized' });
      }
      let verifiedUser = null;
      try {
        verifiedUser = jwtHelpers.verifyToken(
          authorizationToken,
          config.jwt.secret as Secret
        );
      } catch (error) {
        return new ApiError(401, 'Invalid token');
      }

      req.user = verifiedUser;

      if (requestRoles.length && !requestRoles.includes(verifiedUser.role)) {
        throw new ApiError(403, 'You are not authorized');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
