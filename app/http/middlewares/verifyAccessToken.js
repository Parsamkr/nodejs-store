const createHttpError = require("http-errors");
const { UserModel } = require("../../models/users");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constants");

function verifyAccessToken(req, res, next) {
  const headers = req.headers;
  const [bearer, token] = headers?.["access-token"]?.split(" ") || [];
  if (token && bearer?.toLowerCase() === "bearer") {
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (error, payload) => {
      if (error)
        return next(
          createHttpError.Unauthorized("please login to your account")
        );
      const { mobile } = payload || {};
      const user = await UserModel.findOne(
        { mobile },
        { password: 0, otp: 0, bills: 0 }
      );
      if (!user)
        return next(createHttpError.Unauthorized("Profile didn't found"));
      req.user = user;
      return next();
    });
  } else {
    return next(createHttpError.Unauthorized("please login to your account"));
  }
}

module.exports = { verifyAccessToken };
