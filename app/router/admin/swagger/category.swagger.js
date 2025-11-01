/**
 * @swagger
 *  components :
 *    schemas:
 *      CreateCategory:
 *        type : object
 *        required :
 *          - title
 *        properties:
 *          title :
 *            type : string
 *            description : the user mobile for signup/signin
 *          parent :
 *            type : string
 *            description : parent of category
 *      UpdateCategory:
 *        type : object
 *        properties:
 *          title :
 *            type : string
 *            description : the user mobile for signup/signin
 *          parent :
 *            type : string
 *            description : parent of category
 */

/**
 * @swagger
 * /admin/category/add :
 *  post:
 *      tags : [Category(AdminPanel)]
 *      summary : create new category title
 *      requestBody :
 *        required : true
 *        content :
 *          application/x-www-form-urlencoded:
 *            schema :
 *              $ref : '#/components/schemas/CreateCategory'
 *          application/json:
 *            schema :
 *              $ref : '#/components/schemas/CreateCategory'
 *      responses:
 *          201 :
 *              description : success
 */

/**
 * @swagger
 * /admin/category/parents:
 *  get :
 *      tags : [Category(AdminPanel)]
 *      summary : get all parents of categories
 *      responses :
 *          200 :
 *              description : success
 */

/**
 * @swagger
 * /admin/category/children/{parent}:
 *  get :
 *      tags : [Category(AdminPanel)]
 *      summary : get all parents of categories
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : parent
 *      responses :
 *          200 :
 *              description : success
 */

/**
 * @swagger
 * /admin/category/all:
 *  get :
 *      tags : [Category(AdminPanel)]
 *      summary : get all categories
 *      responses :
 *          200 :
 *              description : success
 */

/**
 * @swagger
 * /admin/category/remove/{id}:
 *  delete :
 *      tags : [Category(AdminPanel)]
 *      summary : remove category with object id
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : id
 *      responses :
 *          202 :
 *              description : success
 */

/**
 * @swagger
 * /admin/category/{id}:
 *  get :
 *      tags : [Category(AdminPanel)]
 *      summary : find category by id
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : id
 *      responses :
 *          200 :
 *              description : success
 */

/**
 * @swagger
 * /admin/category/update/{id}:
 *  patch :
 *      tags : [Category(AdminPanel)]
 *      summary : edit category title by id
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : id
 *      requestBody :
 *        required : true
 *        content :
 *          application/x-www-form-urlencoded:
 *            schema :
 *              $ref : '#/components/schemas/UpdateCategory'
 *          application/json:
 *            schema :
 *              $ref : '#/components/schemas/UpdateCategory'
 *      responses :
 *          200 :
 *              description : success
 *          500 :
 *              description : internal server error
 */
