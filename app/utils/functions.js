const createHttpError = require("http-errors");
const fs = require("fs");
const JWT = require("jsonwebtoken");
const { redisClient } = require("./init_redis");
const { UserModel } = require("../models/users");
const {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} = require("./constants");
const path = require("path");

function randomNumberGenerator(length) {
  return Math.floor(
    Math.random() * (9 * 10 ** (length - 1)) + 10 ** (length - 1)
  );
}

function signAccessToken(userID) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userID);
    const payload = {
      mobile: user.mobile,
    };
    const secret = ACCESS_TOKEN_SECRET_KEY;
    const options = { expiresIn: "1h" };
    JWT.sign(payload, secret, options, (error, token) => {
      if (error)
        reject(createHttpError.InternalServerError("internal server error"));
      resolve(token);
    });
  });
}

function signRefreshToken(userID) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userID);
    const payload = {
      mobile: user.mobile,
    };
    const secret = REFRESH_TOKEN_SECRET_KEY;
    const options = { expiresIn: "1y" };
    JWT.sign(payload, secret, options, async (error, token) => {
      if (error)
        reject(createHttpError.InternalServerError("internal server error"));
      // expire tu redis sanie hast
      console.log(userID.toString());
      await redisClient.SETEX(userID.toString(), 365 * 24 * 60 * 60, token);
      resolve(token);
    });
  });
}

function verifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, REFRESH_TOKEN_SECRET_KEY, async (error, payload) => {
      if (error)
        reject(createHttpError.Unauthorized("please login to your account"));
      const { mobile } = payload || {};
      const user = await UserModel.findOne(
        { mobile },
        { password: 0, otp: 0, bills: 0 }
      );
      if (!user) reject(createHttpError.Unauthorized("Profile didn't found"));
      if (user?._id == null)
        return reject(
          createHttpError.Unauthorized("logging in again to account failed")
        );
      const refreshToken = await redisClient.get(user._id.toString());
      if (!refreshToken)
        return reject(
          createHttpError.Unauthorized("logging in again to account failed")
        );
      if (token === refreshToken) return resolve(mobile);
      reject(
        createHttpError.Unauthorized("logging in again to account failed")
      );
    });
  });
}

function deleteFileInPublic(fileAddress) {
  if (fileAddress) {
    const pathFile = path.join(__dirname, "..", "..", "public", fileAddress);
    if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
  }
}

function ListOfImagesFromRequest(files, fileUploadPath) {
  if (files?.length > 0) {
    return files.map((file) => path.join(fileUploadPath, file.filename));
  } else {
    return [];
  }
}

module.exports = {
  randomNumberGenerator,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  deleteFileInPublic,
  ListOfImagesFromRequest,
};
