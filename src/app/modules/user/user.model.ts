import { IUser, IUserMethods, UserModel } from './user.interface';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';

// const userSchema = new Schema<IUser, {}, IUserMethods>( //For using instance methods
// const userSchema = new Schema<IUser, Record<string, never>, IUserMethods>( //For using instance methods
const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
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
    passwordChangedAt: {
      type: Date,
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
// UserSchema.statics.isUserExist = async function (
//   id: string
// ): Promise<Pick<
//   IUser,
//   'id' | 'password' | 'role' | 'needsPasswordChange'
// > | null> {
//   return await User.findOne(
//     { id },
//     { id: 1, password: 1, role: 1, needsPasswordChange: 1 }
//   );
// };
UserSchema.statics.isUserExists = async function (
  id: string
): Promise<IUser | null> {
  return await User.findOne(
    { id },
    { id: 1, password: 1, role: 1, needsPasswordChange: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
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

//will run for user.create or user.save
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bycrypt_salt_rounds)
//   );
//
//   /*
//   //For password change using pre save hook=> see authf.service.ts
//   if(!this.needsPasswordChange) {
//       this.passwordChangedAt = new Date();
//   }
//   */
//   user.password = '';
//   next();
// });

// UserSchema.methods.changedPasswordAfterJwtIssued = function (
//   jwtTimestamp: number
// ) {
//   console.log({ jwtTimestamp }, 'hi');
// };

UserSchema.pre('save', async function (next) {
  // hashing user password
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );
  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date();
  }
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
