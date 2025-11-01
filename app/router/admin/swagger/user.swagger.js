/**
 * @swagger
 *  definitions:
 *      ListOfUsers:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      users:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  first_name:
 *                                      type: string
 *                                      example: "user first_name"
 *                                  last_name:
 *                                      type: string
 *                                      example: "user last_name"
 *                                  username:
 *                                      type: string
 *                                      example: "username"
 *                                  email:
 *                                      type: string
 *                                      example: "the_user_email@example.com"
 *                                  mobile:
 *                                      type: string
 *                                      example: "09332255768"
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Update-Profile:
 *              type: object
 *              properties:
 *                  first_name:
 *                      type: string
 *                      description: the first_name of user
 *                      example: Parsa
 *                  last_name:
 *                      type: string
 *                      description: the last_name of user
 *                      example: Mokhtarpour
 *                  email:
 *                      type: string
 *                      description: the email of user
 *                      example: parsamokhtarpour98@gmail.com
 *                  username:
 *                      type: string
 *                      example: parsamkr
 *                      description: the username of user
 *
 */

/**
 * @swagger
 * /admin/users/list:
 *  get :
 *      tags : [User(AdminPanel)]
 *      summary : get all users
 *      parameters:
 *          -   in: query
 *              name: search
 *              type: string
 *              description: search in name , username , email and mobile
 *      responses :
 *          200 :
 *              description : success
 *              content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ListOfUsers'
 */

/**
 * @swagger
 * /admin/users/profile:
 *  get :
 *      tags : [User(AdminPanel)]
 *      summary : get user profile
 *      responses :
 *          200 :
 *              description : success
 */

/**
 * @swagger
 *  /admin/users/update-profile:
 *      patch:
 *          tags: [User(AdminPanel)]
 *          summary: update user detail and profile
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Update-Profile'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Update-Profile'
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */
