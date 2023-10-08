const router = require("express").Router();
const bcrypt = require("bcrypt");
const { randomNumberGenerator } = require("../utils/functions");

/**
 * @swagger
 * tags :
 *  name : Developer-Routes
 *  description : developer utils
 */

/**
 * @swagger
 * /developer/password-hash/{password}:
 *  get :
 *    tags: [Developer-Routes]
 *    summary : hash data with bcrypt
 *    parameters :
 *      - name : password
 *        in : path
 *        type : string
 *        required : true
 *    responses :
 *          200 :
 *              description : SUCCESS
 */

router.get("/password-hash/:password", (req, res, next) => {
  const { password } = req.params;
  const salt = bcrypt.genSaltSync(10);
  res.send(bcrypt.hashSync(password, salt));
});

/**
 * @swagger
 * /developer/random-number/{length}:
 *  get :
 *    tags: [Developer-Routes]
 *    summary : get random number
 *    parameters :
 *      - name : length
 *        in : path
 *        type : string
 *        required : true
 *    responses :
 *          200 :
 *              description : SUCCESS
 */

router.get("/random-number/:length", (req, res, next) => {
  const { length } = req.params;
  res.send(randomNumberGenerator(length).toString());
});

module.exports = { DeveloperRoutes: router };
