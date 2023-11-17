const {
  UserAuthController,
} = require("../../http/controllers/admin/auth.controller");

const router = require("express").Router();

/**
 * @swagger
 *  components :
 *    schemas:
 *      GetOTP:
 *        type : object
 *        required :
 *          - mobile
 *        properties:
 *          mobile :
 *            type : string
 *            description : the user mobile for signup/signin
 *      CheckOTP:
 *        type : object
 *        required :
 *          - mobile
 *          - code
 *        properties:
 *          mobile :
 *            type : string
 *            description : the user mobile for signup/signin
 *          code :
 *            type : string
 *            description : code for signup/signin
 *      RefreshToken:
 *        type : object
 *        required :
 *          - refreshToken
 *        properties:
 *          refreshToken :
 *            type : string
 *            description : enter refresh-token to get new token and refresh token
 */

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
 *    requestBody :
 *      required : true
 *      content :
 *        application/x-www-form-urlencoded:
 *          schema :
 *            $ref : '#/components/schemas/GetOTP'
 *        application/json:
 *          schema :
 *            $ref : '#/components/schemas/GetOTP'
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
 *    requestBody :
 *      required : true
 *      content :
 *        application/x-www-form-urlencoded:
 *          schema :
 *            $ref : '#/components/schemas/CheckOTP'
 *        application/json:
 *          schema :
 *            $ref : '#/components/schemas/CheckOTP'
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
 *    requestBody :
 *      required : true
 *      content :
 *        application/x-www-form-urlencoded:
 *          schema :
 *            $ref : '#/components/schemas/RefreshToken'
 *        application/json:
 *          schema :
 *            $ref : '#/components/schemas/RefreshToken'
 *    responses :
 *      200 :
 *        description : success
 */
router.post("/refresh-token", UserAuthController.refreshToken);
module.exports = { UserAuthRoutes: router };
