/**
 * @swagger
 *  components :
 *    schemas:
 *      CreateRoom:
 *        type : object
 *        required :
 *          - name
 *          - namespace
 *        properties:
 *          name :
 *            type : string
 *            description : the name of the room
 *          description :
 *            type : string
 *            description : the description of the room
 *          image :
 *            type : string
 *            format : binary
 *            description : the image URL for the room
 *          namespace :
 *            type : string
 *            description : the namespace of the room
 *      RoomResponse:
 *        type : object
 *        properties:
 *          statusCode :
 *            type : integer
 *            description : HTTP status code
 *          data :
 *            type : object
 *            properties:
 *              room :
 *                type : object
 *                properties:
 *                  _id :
 *                    type : string
 *                    description : room id
 *                  name :
 *                    type : string
 *                    description : room name
 *                  description :
 *                    type : string
 *                    description : room description
 *                  image :
 *                    type : string
 *                    description : room image URL
 *                  createdAt :
 *                    type : string
 *                    format : date-time
 *                    description : creation timestamp
 *                  updatedAt :
 *                    type : string
 *                    format : date-time
 *                    description : last update timestamp
 *              rooms :
 *                type : array
 *                items :
 *                  type : object
 *                  properties:
 *                    _id :
 *                      type : string
 *                      description : room id
 *                    name :
 *                      type : string
 *                      description : room name
 *                    description :
 *                      type : string
 *                      description : room description
 *                    image :
 *                      type : string
 *                      description : room image URL
 *                    createdAt :
 *                      type : string
 *                      format : date-time
 *                      description : creation timestamp
 *                    updatedAt :
 *                      type : string
 *                      format : date-time
 *                      description : last update timestamp
 */

/**
 * @swagger
 * /support/room :
 *  post:
 *      tags : [Room(Support)]
 *      summary : create a new room
 *      requestBody :
 *        required : true
 *        content :
 *          multipart/form-data:
 *            schema :
 *              $ref : '#/components/schemas/CreateRoom'
 *      responses:
 *          200 :
 *              description : success - room created
 *              content :
 *                application/json:
 *                  schema :
 *                    $ref : '#/components/schemas/RoomResponse'
 *          400 :
 *              description : bad request - missing required fields
 *          500 :
 *              description : internal server error
 */

/**
 * @swagger
 * /support/room :
 *  get:
 *      tags : [Room(Support)]
 *      summary : get all rooms
 *      responses:
 *          200 :
 *              description : success - get array of rooms
 *              content :
 *                application/json:
 *                  schema :
 *                    $ref : '#/components/schemas/RoomResponse'
 *          500 :
 *              description : internal server error
 */
