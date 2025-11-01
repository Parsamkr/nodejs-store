const createHttpError = require("http-errors");
const { UserModel } = require("../../models/users");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constants");

function getToken(headers) {
  const [bearer, token] = headers?.authorization?.split(" ") || [];
  if (token && bearer?.toLowerCase() === "bearer") return token;
  throw createHttpError.Unauthorized(
    "didn't find a account to login please login to your account"
  );
}

function verifyAccessToken(req, res, next) {
  try {
    const token = getToken(req.headers);
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (error, payload) => {
      try {
        if (error)
          throw createHttpError.Unauthorized("please login to your account");
        const { mobile } = payload || {};
        const user = await UserModel.findOne(
          { mobile },
          { password: 0, otp: 0, bills: 0 }
        );
        if (!user) throw createHttpError.Unauthorized("Profile didn't found");
        req.user = user;
        return next();
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}

async function verifyAccessTokenInGraphql(req, res) {
  try {
    const token = getToken(req.headers);
    const { mobile } = JWT.verify(token, ACCESS_TOKEN_SECRET_KEY);
    const user = await UserModel.findOne(
      { mobile },
      { password: 0, otp: 0, bills: 0 }
    );
    if (!user) throw createHttpError.Unauthorized("Profile didn't found");
    return user;
  } catch (error) {
    throw new createHttpError.Unauthorized();
  }
}

module.exports = { verifyAccessToken, getToken, verifyAccessTokenInGraphql };
