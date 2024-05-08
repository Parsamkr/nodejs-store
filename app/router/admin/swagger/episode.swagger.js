/**
 * @swagger
 *  components:
 *      schemas:
 *          AddEpisode:
 *              type: object
 *              required:
 *                  -   courseID
 *                  -   chapterID
 *                  -   title
 *                  -   text
 *                  -   video
 *                  -   type
 *              properties:
 *                  courseID:
 *                      type: string
 *                      description: id of course
 *                      example: 662904162042c14f49bb65b7
 *                  chapterID:
 *                      type: string
 *                      description: id of chapter
 *                      example: 662e376fd87ce8d9a5bd9421
 *                  title:
 *                      type: string
 *                      description: title of episode
 *                      example: title of episode
 *                  text:
 *                      type: string
 *                      description: description of episode
 *                      example: description of episode
 *                  type:
 *                      type: string
 *                      description: type of episode
 *                      enum:
 *                          -   lock
 *                          -   unlock
 *                  video:
 *                      type: string
 *                      description: file of video
 *                      format: binary
 *          UpdateEpisode:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of episode
 *                      example: title of episode
 *                  text:
 *                      type: string
 *                      description: description of episode
 *                      example: description of episode
 *                  type:
 *                      type: string
 *                      description: type of episode
 *                      enum:
 *                          -   lock
 *                          -   unlock
 *                  video:
 *                      type: string
 *                      description: file of video
 *                      format: binary
 */

/**
 * @swagger
 *  /admin/episodes/add:
 *      post:
 *          tags: [Episode(AdminPanel)]
 *          summary: create new Episode for course
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/AddEpisode'
 *          responses:
 *              201:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /admin/episodes/remove/{episodeID}:
 *      delete:
 *          tags: [Episode(AdminPanel)]
 *          summary: delete Episode for course
 *          parameters:
 *              -   in: path
 *                  name: episodeID
 *                  type: string
 *                  required: true
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
 *  /admin/episodes/update/{episodeID}:
 *      patch:
 *          tags: [Episode(AdminPanel)]
 *          summary: edit or update Episode for course
 *          parameters:
 *              -   in: path
 *                  name: episodeID
 *                  type: string
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateEpisode'
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */
