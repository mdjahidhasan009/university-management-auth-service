import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';

export type IUser = {
  id: string;
  role: string;
  password: string;
  student?: Types.ObjectId | IStudent;
  // faculty?: Types.ObjectId | IFaculty; ////NOTE: in future
  // admin?: Types.ObjectId | IAdmin; ////NOTE: in future
};

// type UserModel = Model<IUser, object>
export type UserModel = Model<IUser, Record<string, unknown>>;
