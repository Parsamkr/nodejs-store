/**
 * @swagger
 *  components :
 *    schemas:
 *      SendMessage:
 *        type : object
 *        required :
 *          - message
 *        properties:
 *          message :
 *            type : string
 *            description : the message content to send
 */

/**
 * @swagger
 * /support/message :
 *  post:
 *      tags : [Message(Support)]
 *      summary : send a message
 *      requestBody :
 *        required : true
 *        content :
 *          application/json:
 *            schema :
 *              $ref : '#/components/schemas/SendMessage'
 *          application/x-www-form-urlencoded:
 *            schema :
 *              $ref : '#/components/schemas/SendMessage'
 *      responses:
 *          200 :
 *              description : success - message sent
 *          400 :
 *              description : bad request - missing required fields
 *          500 :
 *              description : internal server error
 */
