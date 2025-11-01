/**
 * @swagger
 *  components:
 *      schemas:
 *          Types:
 *              type: string
 *              enum:
 *                  -   free
 *                  -   cash
 *                  -   special
 */

/**
 * @swagger
 *  definitions:
 *      ListOfCourses:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      courses:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "66268d3c1a83206ecb221cbe"
 *                                  title:
 *                                      type: string
 *                                      example: "title of course"
 *                                  short_text:
 *                                      type: string
 *                                      example: "summary text of course"
 *                                  text:
 *                                      type: string
 *                                      example: "text of course"
 *                                  status:
 *                                      type: string
 *                                      example: "notStarted | Completed | Holding"
 *                                  time:
 *                                      type: string
 *                                      example: "01:22:34"
 *                                  price:
 *                                      type: integer
 *                                      example: 250000
 *                                  discount:
 *                                      type: integer
 *                                      example: 20
 *                                  studentCount:
 *                                      type: integer
 *                                      example: 35
 *                                  teacher:
 *                                      type: string
 *                                      example: "parsa mokhtarpour"
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Insert-Course:
 *              type: object
 *              required:
 *                  -   title
 *                  -   short_text
 *                  -   text
 *                  -   tags
 *                  -   category
 *                  -   price
 *                  -   discountedPrice
 *                  -   image
 *                  -   type
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of course
 *                      example: عنوان دوره
 *                  short_text:
 *                      type: string
 *                      description: the title of course
 *                      example: متن کوتاه شده تستی
 *                  text:
 *                      type: string
 *                      description: the title of course
 *                      example: متن توضیحات کامل دوره به صورت تستی
 *                  tags:
 *                      type: array
 *                      description: the tags of course
 *                  category:
 *                      type: string
 *                      description: the cqtegory of course
 *                      example: 6279e994c1e47a98d0f356d3
 *                  price:
 *                      type: string
 *                      description: the title of course
 *                      example: 2500000
 *                  discountedPrice:
 *                      type: string
 *                      description: the title of course
 *                      example: 998000
 *                  discount:
 *                      type: string
 *                      description: the title of course
 *                      example: 0
 *                  image:
 *                      type: string
 *                      format: binary
 *                  type:
 *                      $ref: '#/components/schemas/Types'
 *          Edit-discount-course-status:
 *              type: object
 *              required:
 *                  -   discountStatus
 *              properties:
 *                  discountStatus:
 *                      $ref: '#/components/schemas/Status'
 *          Edit-Course:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of course
 *                      example: عنوان دوره
 *                  short_text:
 *                      type: string
 *                      description: the title of course
 *                      example: متن کوتاه شده تستی
 *                  text:
 *                      type: string
 *                      description: the title of course
 *                      example: متن توضیحات کامل دوره به صورت تستی
 *                  tags:
 *                      type: array
 *                      description: the tags of course
 *                  category:
 *                      type: string
 *                      description: the cqtegory of course
 *                      example: 6522a934aa3c83efe3ec4fa1
 *                  price:
 *                      type: string
 *                      description: the title of course
 *                      example: 2500000
 *                  discount:
 *                      type: string
 *                      description: the title of course
 *                      example: 20
 *                  image:
 *                      type: string
 *                      format: binary
 *                  type:
 *                    $ref: '#/components/schemas/Types'
 */

/**
 * @swagger
 *  /admin/courses/add:
 *      post:
 *          tags: [Course(AdminPanel)]
 *          summary: create and save course
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Insert-Course'
 *
 *          responses:
 *              201:
 *                  description: created new course
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */

/**
 * @swagger
 *  /admin/courses/update/{id}:
 *      patch:
 *          tags: [Course(AdminPanel)]
 *          summary: edit or update course
 *          parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Course'
 *
 *          responses:
 *              201:
 *                  description: created new course
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */

/**
 * @swagger
 * /admin/courses/list:
 *  get:
 *      tags: [Course(AdminPanel)]
 *      summary: get all of courses
 *      parameters:
 *          -   in: query
 *              name: search
 *              type: string
 *              description: search in text , title and short_text
 *      responses:
 *          200:
 *              description : success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/ListOfCourses'
 */

/**
 * @swagger
 * /admin/courses/{id}:
 *  get :
 *      tags : [Course(AdminPanel)]
 *      summary : find course by id
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : id
 *      responses :
 *          200 :
 *              description : success
 */
