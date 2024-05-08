/**
 * @swagger
 *  components:
 *      schemas:
 *          Color:
 *              type: array
 *              items:
 *                  type: string
 *                  enum:
 *                      -   black
 *                      -   white
 *                      -   gray
 *                      -   red
 *                      -   blue
 *                      -   green
 *                      -   orange
 *                      -   purple
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              required:
 *                  -   title
 *                  -   short_text
 *                  -   text
 *                  -   tags
 *                  -   category
 *                  -   price
 *                  -   discount
 *                  -   count
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: عنوان محصول
 *                  short_text:
 *                      type: string
 *                      description: short_text of product
 *                      example: متن کوتاه شده تستی
 *                  text:
 *                      type: string
 *                      description: text of product
 *                      example: متن بلد تستی
 *                  tags:
 *                      type: array
 *                      description: tags of product
 *                  category:
 *                      type: string
 *                      description: category of product
 *                      example: 652294182c7901bdcce5ba96
 *                  price:
 *                      type: string
 *                      description: price of product
 *                      example: 2500000
 *                  discount:
 *                      type: string
 *                      description: discount of product
 *                      example: 20
 *                  count:
 *                      type: string
 *                      description: counts of product
 *                      example: 100
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                      example: 0
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                      example: 0
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                      example: 0
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  type:
 *                      type: string
 *                      description: the type of product
 *                      example: virtual - physical
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 *
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Product:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: عنوان محصول
 *                  short_text:
 *                      type: string
 *                      description: the short_text of product
 *                      example: متن کوتاه شده تستی
 *                  text:
 *                      type: string
 *                      description: the text of product
 *                      example: متن بلد تستی
 *                  tags:
 *                      type: array
 *                      description: the tags of product
 *                  category:
 *                      type: string
 *                      description: the category of product
 *                      example: 652294182c7901bdcce5ba96
 *                  price:
 *                      type: string
 *                      description: the price of product
 *                      example: 2500000
 *                  discount:
 *                      type: string
 *                      description: the discount of product
 *                      example: 20
 *                  count:
 *                      type: string
 *                      description: the count of product
 *                      example: 100
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                      example: 0
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                      example: 0
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                      example: 0
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  type:
 *                      type: string
 *                      description: the type of product
 *                      example: virtual - physical
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 *
 */

/**
 * @swagger
 * /admin/products/add :
 *  post:
 *      summary : create product
 *      tags : [Product(AdminPanel)]
 *      requestBody :
 *          required : true
 *          content :
 *              multipart/form-data:
 *                  schema:
 *                      $ref : '#/components/schemas/Product'
 *      responses:
 *          200 :
 *              description : success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 * /admin/products/list :
 *  get:
 *      summary : get all products
 *      tags : [Product(AdminPanel)]
 *      parameters:
 *      - in: query
 *        name: search
 *        type: string
 *        description: text for search in title , text and short text of product
 *      responses:
 *          200 :
 *              description : success
 */

/**
 * @swagger
 * /admin/products/{id}:
 *  get :
 *    summary: get product by id
 *    tags: [Product(AdminPanel)]
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: objectId of product
 *    responses:
 *      200:
 *        description: success
 */

/**
 * @swagger
 * /admin/products/remove/{id}:
 *  delete :
 *    summary: delete product by id
 *    tags: [Product(AdminPanel)]
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        description: objectId of product
 *    responses:
 *      200:
 *        description: success
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /admin/products/edit/{id}:
 *      patch:
 *          tags: [Product(AdminPanel)]
 *          summary: update product
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *                  description: id of product for update product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Product'
 *
 *          responses:
 *              200:
 *                  description: updated Product
 */
