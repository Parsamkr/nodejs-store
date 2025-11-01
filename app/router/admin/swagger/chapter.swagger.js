/**
 * @swagger
 *  definitions:
 *      chaptersOfCourseDefinition:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      course:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: 662904162042c14f49bb65b7
 *                              title:
 *                                  type: string
 *                                  example: title of course
 *                              chapters:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                  example: [{_id: "662e1597ded2311957c8de64" , title: "title of chapter" , text: "description of chapter" , episodes: [] }]
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          AddChapter:
 *              type: object
 *              required:
 *                  -   id
 *                  -   title
 *              properties:
 *                  id:
 *                      type: string
 *                      description: id of course
 *                      example: 662904162042c14f49bb65b7
 *                  title:
 *                      type: string
 *                      description: title of chapter
 *                      example: first chapter
 *                  text:
 *                      type: string
 *                      description: description of chapter
 *                      example: description of first chapter
 *          EditChapter:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of chapter
 *                      example: first chapter
 *                  text:
 *                      type: string
 *                      description: description of chapter
 *                      example: description of first chapter
 */

/**
 * @swagger
 *  /admin/chapters/add:
 *      put:
 *          tags: [Chapter(AdminPanel)]
 *          summary: create new chapter for course
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/AddChapter'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/AddChapter'
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /admin/chapters/list/{courseID}:
 *      get:
 *          tags: [Chapter(AdminPanel)]
 *          summary: get chapters of course
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  required: true
 *                  name: courseID
 *                  example: 662904162042c14f49bb65b7
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/chaptersOfCourseDefinition'
 */

/**
 * @swagger
 *  /admin/chapters/remove/{chapterID}:
 *      patch:
 *          tags: [Chapter(AdminPanel)]
 *          summary: remove chapter by chapter id
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  required: true
 *                  name: chapterID
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /admin/chapters/update/{chapterID}:
 *      patch:
 *          tags: [Chapter(AdminPanel)]
 *          summary: edit chapter by chapter id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/EditChapter'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/EditChapter'
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  required: true
 *                  name: chapterID
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */
