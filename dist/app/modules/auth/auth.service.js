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
exports.AuthService = void 0;
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const users_1 = require("../../../enums/users");
const admin_model_1 = require("../admin/admin.model");
const faculty_model_1 = require("../faculty/faculty.model");
const student_model_1 = require("../student/student.model");
const sendResetEmail_1 = require("./sendResetEmail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = payload;
    // const user = new User();//For using instance methods
    // const isUserExist = await user.isUserExits(id);////For using instance methods
    const isUserExist = yield user_model_1.User.isUserExists(id); //For using static methods
    if (!isUserExist)
        throw new ApiError_1.default(404, 'User does not exist');
    if (!(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password))
        throw new ApiError_1.default(401, 'Password does not exist');
    // const isPasswordMatch= await user.isPasswordMatch(password, isUserExist.password);//For using instance methods
    const isPasswordMatch = yield user_model_1.User.isPasswordMatched(password, isUserExist.password); //For using static methods
    if (!isPasswordMatch)
        throw new ApiError_1.default(401, 'Password does not match');
    const { id: userId, role, needsPasswordChange } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const isUserExist = yield user_model_1.User.isUserExists(user === null || user === void 0 ? void 0 : user.userId);
    if (!isUserExist)
        throw new ApiError_1.default(404, 'User does not exist');
    const isPasswordMatch = yield user_model_1.User.isPasswordMatched(oldPassword, isUserExist.password);
    if (!isPasswordMatch)
        throw new ApiError_1.default(401, 'Password does not match');
    const newHashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    const query = { id: user === null || user === void 0 ? void 0 : user.userId };
    const updatedData = {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    };
    yield user_model_1.User.findOneAndUpdate(query, updatedData, { new: true });
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ id: payload.id }, { id: 1, role: 1 });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    let profile = null;
    if (user.role === users_1.ENUM_USER_ROLE.ADMIN) {
        profile = yield admin_model_1.Admin.findOne({ id: user.id });
    }
    else if (user.role === users_1.ENUM_USER_ROLE.FACULTY) {
        profile = yield faculty_model_1.Faculty.findOne({ id: user.id });
    }
    else if (user.role === users_1.ENUM_USER_ROLE.STUDENT) {
        profile = yield student_model_1.Student.findOne({ id: user.id });
    }
    if (!profile) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Profile not found!');
    }
    if (!profile.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email not found!');
    }
    const passwordResetToken = yield jwtHelpers_1.jwtHelpers.createToken({ id: user.id }, config_1.default.jwt.secret, '5m');
    const resetLink = config_1.default.resetlink + `id=${user.id}&token=${passwordResetToken}`;
    yield (0, sendResetEmail_1.sendEmail)(profile.email, `
      <div>
        <p>Hi, ${profile.name.firstName}</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `);
});
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
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    let verifyRefreshToken = null;
    try {
        verifyRefreshToken = jwtHelpers_1.jwtHelpers.verifyToken(refreshToken, config_1.default.jwt.refresh_secret);
        ////TODO: have to refactor
        if (!verifyRefreshToken)
            throw new ApiError_1.default(403, 'Invalid Refresh Token');
    }
    catch (e) {
        throw new ApiError_1.default(403, 'Invalid Refresh Token');
    }
    const { userId } = verifyRefreshToken;
    const isUserExist = yield user_model_1.User.isUserExists(userId);
    if (!isUserExist)
        throw new ApiError_1.default(404, 'User does not exist'); //User was deleted by admin for any reason after token was issued
    const { id, role } = isUserExist;
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, newPassword } = payload;
    const user = yield user_model_1.User.findOne({ id }, { id: 1 });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found!');
    }
    ////TODO: have to handle if not verified
    yield jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const password = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    yield user_model_1.User.updateOne({ id }, { password });
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
