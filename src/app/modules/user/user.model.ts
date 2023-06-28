import { IUser, UserModel } from './user.interface';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';

// const userSchema = new Schema<IUser, {}, IUserMethods>( //For using instance methods
// const userSchema = new Schema<IUser, Record<string, never>, IUserMethods>( //For using instance methods
const userSchema = new Schema<IUser, UserModel>( //For static methods
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

//Static methods
userSchema.statics.isUserExits = async function (
  id: string
): Promise<Pick<
  IUser,
  'id' | 'password' | 'needsPasswordChange' | 'role'
> | null> {
  const user = await User.findOne(
    { id },
    { id: 1, password: 1, needsPasswordChange: 1, role: 1 }
  ).lean();
  return user;
};

userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isPasswordMatch = await bcrypt.compare(givenPassword, savedPassword);
  return isPasswordMatch;
};

//Instance methods
// userSchema.methods.isUserExits = async function (id: string): Promise<Partial<IUser> | null> {
//   const user = await User.findOne({ id }, { id: 1, password: 1, needsPasswordChange: 1 }).lean();
//   return user;
// }
//
// ////TODO: have to fix this(taking password from service should take from model)
// userSchema.methods.isPasswordMatch = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
//     const isPasswordMatch = await bcrypt.compare(givenPassword, savedPassword);
//     return isPasswordMatch;
// }

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_round)
  );
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
