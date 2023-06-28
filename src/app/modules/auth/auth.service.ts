import { Secret } from 'jsonwebtoken';

import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { User } from '../user/user.model';
import ApiError from '../../../erros/ApiError';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // const user = new User();//For using instance methods

  // const isUserExist = await user.isUserExits(id);////For using instance methods
  const isUserExist = await User.isUserExits(id); //For using static methods
  if (!isUserExist) throw new ApiError(404, 'User does not exist');

  if (!isUserExist?.password)
    throw new ApiError(401, 'Password does not exist');

  // const isPasswordMatch= await user.isPasswordMatch(password, isUserExist.password);//For using instance methods
  const isPasswordMatch = await User.isPasswordMatch(
    password,
    isUserExist.password
  ); //For using static methods
  if (!isPasswordMatch) throw new ApiError(401, 'Password does not match');

  const { id: userId, role, needsPasswordChange } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (
  refreshToken: string
): Promise<IRefreshTokenResponse> => {
  let verifyRefreshToken = null;
  try {
    verifyRefreshToken = jwtHelpers.verifyToken(
      refreshToken,
      config.jwt.refresh_secret as Secret
    );
  } catch (e) {
    throw new ApiError(403, 'Invalid Refresh Token');
  }

  const { userId } = verifyRefreshToken;
  const isUserExist = await User.isUserExits(userId);
  if (!isUserExist) throw new ApiError(404, 'User does not exist'); //User was deleted by admin for any reason after token was issued
  const { id, role } = isUserExist;

  const newAccessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
