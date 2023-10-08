const {
  UserAuthController,
} = require("../../http/controllers/user/auth/auth.controller");
const router = require("express").Router();

/**
 * @swagger
 * tags :
 *   name : User-Authentication
 *   description : user-auth section
 */

/**
 * @swagger
 * /user/get-otp:
 *  post:
 *    summary : login user in user panel with phone number
 *    tags : [User-Authentication]
 *    description : one time password (OTP) login
 *    parameters :
 *    - name : mobile
 *      description : fa-IRI number
 *      in : formData
 *      required : true
 *      type : string
 *    responses :
 *      200 :
 *        description : success
 *      400 :
 *        description : bad request
 *      401 :
 *        description : unauthorization
 *      500 :
 *        description : internal server error
 */

router.post("/get-otp", UserAuthController.getOtp);
/**
 * @swagger
 * /user/check-otp :
 *  post :
 *    summary : check OTP value in user controller
 *    tags : [User-Authentication]
 *    description : check otp with mobile and expire date
 *    parameters :
 *    - name : mobile
 *      description : fa-IRI number
 *      in : formData
 *      required : true
 *      type : string
 *    - name : code
 *      description : enter the recieved code
 *      in : formData
 *      required : true
 *      type : string
 *    responses :
 *      200 :
 *        description : success
 *      400 :
 *        description : bad request
 *      401 :
 *        description : unauthorization
 *      500 :
 *        description : internal server error
 */
router.post("/check-otp", UserAuthController.checkOtp);
/**
 * @swagger
 * /user/refresh-token:
 *  post:
 *    summary: send refresh token for getting a new token and refresh token
 *    tags : [User-Authentication]
 *    description: fresh token
 *    parameters :
 *      - in : formData
 *        required : true
 *        type : string
 *        name : refreshToken
 *    responses :
 *      200 :
 *        description : success
 */
router.post("/refresh-token", UserAuthController.refreshToken);
module.exports = { UserAuthRoutes: router };
