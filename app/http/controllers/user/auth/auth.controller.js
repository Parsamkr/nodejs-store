const createHttpError = require("http-errors");
const {
  getOtpSchema,
  checkOtpSchema,
} = require("../../../validators/user/auth.schema");
const {
  randomNumberGenerator,
  signAccessToken,
  verifyRefreshToken,
  signRefreshToken,
} = require("../../../../utils/functions");
const { UserModel } = require("../../../../models/users");
const { ROLES } = require("../../../../utils/constants");
const Controller = require("../../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");

class UserAuthController extends Controller {
  async getOtp(req, res, next) {
    try {
      await getOtpSchema.validateAsync(req.body);
      const { mobile } = req.body;
      const code = randomNumberGenerator(5);
      const result = await this.saveUser(mobile, code);
      if (!result) throw createHttpError.Unauthorized("login failed");
      return res.status(httpStatus.OK).send({
        statusCode: httpStatus.OK,
        data: {
          message: "authorization code has been sent successfully",
          code,
          mobile,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOtp(req, res, next) {
    try {
      await checkOtpSchema.validateAsync(req.body);
      const { mobile, code } = req.body;
      const user = await UserModel.findOne({ mobile });
      if (!user) throw createHttpError.NotFound("user not found");
      if (user.otp.code != code)
        throw createHttpError.Unauthorized("code is wrong");
      const now = Date.now();
      if (+user.otp.expiresIn < now)
        throw createHttpError.Unauthorized("code expired");
      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);

      return res.json({
        statusCode: httpStatus.OK,
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async saveUser(mobile, code) {
    const result = await this.checkExistUser(mobile);
    let otp = { code, expiresIn: new Date().getTime() + 120000 };
    if (result) {
      return await this.updateUser(mobile, { otp });
    }
    return !!(await UserModel.create({ mobile, otp, role: [ROLES.USER] }));
  }

  async checkExistUser(mobile) {
    const user = await UserModel.findOne({ mobile });
    return !!user;
  }

  async updateUser(mobile, objectData = {}) {
    Object.keys(objectData).forEach((key) => {
      if (["", " ", 0, null, undefined, NaN, "0"].includes(objectData[key]))
        delete objectData[key];
    });
    const updateResult = await UserModel.updateOne(
      { mobile },
      { $set: objectData }
    );
    return !!updateResult.modifiedCount;
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const mobile = await verifyRefreshToken(refreshToken);
      const user = await UserModel.findOne({ mobile });
      const accessToken = await signAccessToken(user._id);
      const newRefreshToken = await signRefreshToken(user._id);
      return res.json({
        statusCode: httpStatus.OK,
        data: { accessToken, refreshToken: newRefreshToken },
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = { UserAuthController: new UserAuthController() };
