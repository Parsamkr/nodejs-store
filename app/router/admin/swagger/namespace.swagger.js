/**
 * @swagger
 *  components :
 *    schemas:
 *      CreateNamespace:
 *        type : object
 *        required :
 *          - title
 *          - endpoint
 *        properties:
 *          title :
 *            type : string
 *            description : the title of the namespace
 *          endpoint :
 *            type : string
 *            description : the endpoint for the namespace
 *      NamespaceResponse:
 *        type : object
 *        properties:
 *          statusCode :
 *            type : integer
 *            description : HTTP status code
 *          data :
 *            type : object
 *            properties:
 *              message :
 *                type : string
 *                description : success message
 *              namespaces :
 *                type : array
 *                items :
 *                  type : object
 *                  properties:
 *                    _id :
 *                      type : string
 *                      description : namespace id
 *                    title :
 *                      type : string
 *                      description : namespace title
 *                    endpoint :
 *                      type : string
 *                      description : namespace endpoint
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
 * /support/namespace :
 *  post:
 *      tags : [Namespace(Support)]
 *      summary : create a new namespace
 *      requestBody :
 *        required : true
 *        content :
 *          application/json:
 *            schema :
 *              $ref : '#/components/schemas/CreateNamespace'
 *          application/x-www-form-urlencoded:
 *            schema :
 *              $ref : '#/components/schemas/CreateNamespace'
 *      responses:
 *          201 :
 *              description : success - namespace created
 *              content :
 *                application/json:
 *                  schema :
 *                    $ref : '#/components/schemas/NamespaceResponse'
 *          400 :
 *              description : bad request - missing required fields
 *          500 :
 *              description : internal server error
 */

/**
 * @swagger
 * /support/namespace :
 *  get:
 *      tags : [Namespace(Support)]
 *      summary : get all namespaces
 *      responses:
 *          200 :
 *              description : success - get array of namespaces
 *              content :
 *                application/json:
 *                  schema :
 *                    $ref : '#/components/schemas/NamespaceResponse'
 *          500 :
 *              description : internal server error
 */
