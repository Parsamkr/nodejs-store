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
const { features } = require("process");

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
    const options = { expiresIn: "30d" };
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

function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

function setFeatures(body) {
  const { colors, width, height, length, weight } = body;
  features.colors = colors;
  if (!isNaN(+width) || !isNaN(+height) || !isNaN(+weight) || !isNaN(+length)) {
    if (!width) features.width = 0;
    else features.width = +width;
    if (!height) features.height = 0;
    else features.height = +height;
    if (!weight) features.weight = 0;
    else features.weight = +weight;
    if (!length) features.length = 0;
    else features.length = +length;
  }
  return features;
}

function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ["", " ", "0", 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}

function getTime(seconds) {
  let total = Math.round(seconds) / 60;
  let [minutes, percent] = String(total).split(".");
  let second = Math.round((percent * 60) / 100)
    .toString()
    .substring(0, 2);
  let hour = 0;
  if (minutes > 60) {
    total = minutes / 60;
    let [h1, percent] = String(total).split(".");
    hour = h1;
    minutes = Math.round((percent * 60) / 100)
      .toString()
      .substring(0, 2);
  }
  if (isNaN(hour)) hour = 0;
  if (isNaN(minutes)) minutes = 0;
  if (isNaN(second)) second = 0;
  if (String(hour).length == 1) hour = `0${hour}`;
  if (String(minutes).length == 1) minutes = `0${minutes}`;
  if (String(second).length == 1) second = `0${second}`;

  return hour + ":" + minutes + ":" + second;
}

function getTimeOfCourse(chapters = []) {
  let time,
    hour,
    minute,
    second = 0;
  for (const chapter of chapters) {
    if (Array.isArray(chapter?.episodes)) {
      for (const episode of chapter.episodes) {
        if (episode?.time)
          time = episode.time.split(":"); // [hour, min, second]
        else time = "00:00:00".split(":");
        if (time.length == 3) {
          second += Number(time[0]) * 3600; // convert hour to second
          second += Number(time[1]) * 60; // convert minute to second
          second += Number(time[2]); //sum second with seond
        } else if (time.length == 2) {
          //05:23
          second += Number(time[0]) * 60; // convert minute to second
          second += Number(time[1]); //sum second with seond
        }
      }
    }
  }
  hour = Math.floor(second / 3600); //convert second to hour
  minute = Math.floor(second / 60) % 60; //convert second to mintutes
  second = Math.floor(second % 60); //convert seconds to second
  if (isNaN(hour)) hour = 0;
  if (isNaN(minute)) minute = 0;
  if (isNaN(second)) second = 0;
  if (String(hour).length == 1) hour = `0${hour}`;
  if (String(minute).length == 1) minute = `0${minute}`;
  if (String(second).length == 1) second = `0${second}`;
  return hour + ":" + minute + ":" + second;
}

module.exports = {
  randomNumberGenerator,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  deleteFileInPublic,
  ListOfImagesFromRequest,
  copyObject,
  setFeatures,
  deleteInvalidPropertyInObject,
  getTime,
  getTimeOfCourse,
};
