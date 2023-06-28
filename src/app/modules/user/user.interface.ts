import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { IAdmin } from '../admin/admin.interface';

/* eslint-disable no-unused-vars */ //TODO: have to fix this
export type IUser = {
  id: string;
  role: string;
  password: string;
  needsPasswordChange: true | false;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

//For using instance methods
// export interface IUserMethods {
//   isUserExits: (id: string) => Promise<Partial<IUser> | null>;
//   isPasswordMatch: (
//     currentPassword: string,
//     savedPassword: string
//   ) => Promise<boolean>;
// }

//For using static methods
export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// type UserModel = Model<IUser, object>
// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;//For using instance methods
