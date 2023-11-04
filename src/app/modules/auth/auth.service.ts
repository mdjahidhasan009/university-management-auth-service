import { JwtPayload, Secret } from 'jsonwebtoken';

import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { Admin } from '../admin/admin.model';
import { Faculty } from '../faculty/faculty.model';
import { Student } from '../student/student.model';
import { sendEmail } from './sendResetEmail';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // const user = new User();//For using instance methods

  // const isUserExist = await user.isUserExits(id);////For using instance methods
  const isUserExist = await User.isUserExists(id); //For using static methods
  if (!isUserExist) throw new ApiError(404, 'User does not exist');

  if (!isUserExist?.password)
    throw new ApiError(401, 'Password does not exist');

  // const isPasswordMatch= await user.isPasswordMatch(password, isUserExist.password);//For using instance methods
  const isPasswordMatch = await User.isPasswordMatched(
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

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.isUserExists(user?.userId);
  if (!isUserExist) throw new ApiError(404, 'User does not exist');

  const isPasswordMatch = await User.isPasswordMatched(
    oldPassword,
    isUserExist.password
  );
  if (!isPasswordMatch) throw new ApiError(401, 'Password does not match');

  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds)
  );
  const query = { id: user?.userId };
  const updatedData = {
    password: newHashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  };
  await User.findOneAndUpdate(query, updatedData, { new: true });
};

const forgotPassword = async (payload: { id: string }): Promise<void> => {
  const user = await User.findOne({ id: payload.id }, { id: 1, role: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  let profile = null;
  if (user.role === ENUM_USER_ROLE.ADMIN) {
    profile = await Admin.findOne({ id: user.id });
  } else if (user.role === ENUM_USER_ROLE.FACULTY) {
    profile = await Faculty.findOne({ id: user.id });
  } else if (user.role === ENUM_USER_ROLE.STUDENT) {
    profile = await Student.findOne({ id: user.id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile not found!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  const passwordResetToken = await jwtHelpers.createToken(
    { id: user.id },
    config.jwt.secret as string,
    '5m'
  );
  const resetLink: string =
    config.resetlink + `id=${user.id}&token=${passwordResetToken}`;

  await sendEmail(
    profile.email,
    `
      <div>
        <p>Hi, ${profile.name.firstName}</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `
  );
};

/*
//For using prehooks and posthooks we have to use instance methods. userSchema.pre('save', async function (next) {}
const changePassword = async(user: JwtPayload | null, payload: IChangePassword): Promise<void> => {
    const { oldPassword, newPassword } = payload;

    const isUserExist = await User.findOne({ id: user?.userId }).select('+password');//as we have set select: 0 in user.model.ts
    if (!isUserExist) throw new ApiError(404, 'User does not exist');

    const isPasswordMatch = await User.isPasswordMatched(
        oldPassword,
        isUserExist.password,
    );
    if (!isPasswordMatch) throw new ApiError(401, 'Password does not match');

    isUserExist.needsPasswordChange = false;
    await isUserExist.save();
}
*/

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
  const isUserExist = await User.isUserExists(userId);
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

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const { id, newPassword } = payload;
  const user = await User.findOne({ id }, { id: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  ////TODO: have to handle if not verified
  await jwtHelpers.verifyToken(token, config.jwt.secret as string);

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds)
  );

  await User.updateOne({ id }, { password });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
