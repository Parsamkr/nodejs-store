/**
 * @swagger
 *  definitions:
 *      ListOfRoles:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      roles:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "66268d3c1a83206ecb221cbe"
 *                                  title:
 *                                      type: string
 *                                      example: "title of role"
 *                                  permissions:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               _id:
 *                                                   type: string
 *                                                   example: "66268d3c1a83206ecb221cbe"
 *                                               title:
 *                                                   type: string
 *                                                   example: "title of permission"
 *                                               description:
 *                                                   type: string
 *                                                   example: "description of permission"
 *
 */

/**
 * @swagger
 *  components :
 *    schemas:
 *      Role:
 *        type : object
 *        required :
 *          - title
 *        properties:
 *          title :
 *            type : string
 *            description : title for role
 *          description :
 *            type : string
 *            description : description for role
 *          permissions :
 *            type: array
 *            description: permissionID for role
 *      EditRole:
 *        type : object
 *        properties:
 *          title :
 *            type : string
 *            description : title for role
 *          description :
 *            type : string
 *            description : description for role
 *          permissions :
 *            type: array
 *            description: permissionID for role
 */

/**
 * @swagger
 *  /admin/roles/add:
 *      post:
 *          tags: [RBAC(AdminPanel)]
 *          summary: create new role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Role'
 *
 *          responses:
 *              201:
 *                  description: created new role
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */

/**
 * @swagger
 *  /admin/roles/update/{id}:
 *      patch:
 *          tags: [RBAC(AdminPanel)]
 *          summary: edit role
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/EditRole'
 *
 *          responses:
 *              200:
 *                  description: role edited successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */

/**
 * @swagger
 *  /admin/roles/list:
 *      get:
 *          tags: [RBAC(AdminPanel)]
 *          summary: get list of all roles
 *          responses:
 *              200:
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ListOfRoles'
 *
 */

/**
 * @swagger
 *  /admin/roles/remove/{field}:
 *      delete:
 *          tags: [RBAC(AdminPanel)]
 *          summary: remove role
 *          parameters:
 *              -   in: path
 *                  name: field
 *                  type: string
 *                  required: true
 *                  description: send title or objectID of role to remove that
 *          responses:
 *              200:
 *                  description: role deleted successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */
