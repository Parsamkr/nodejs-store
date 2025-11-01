/**
 * @swagger
 *  components :
 *    schemas:
 *      CreateBlog:
 *        type : object
 *        required :
 *          - title
 *          - text
 *          - short_text
 *          - category
 *          - image
 *        properties:
 *          title :
 *            type : string
 *            description : the title of blog
 *          text :
 *            type : string
 *            description : the text of blog
 *          short_text :
 *            type : string
 *            description : the short text of blog
 *          tags :
 *            type : string
 *            description : the tags of blog for example => (tag1#tag2#tag3)
 *          category :
 *            type : string
 *            description : the id of category of blog
 *          image :
 *            type : file
 *            description : the image of blog
 */

/**
 * @swagger
 * /admin/blogs :
 *  get:
 *      tags : [Blog(AdminPanel)]
 *      summary : get all blogs
 *      responses:
 *          200 :
 *              description : success - get array of blogs
 */

/**
 * @swagger
 * /admin/blogs/add :
 *  post:
 *      tags : [Blog(AdminPanel)]
 *      summary : create blog document
 *      requestBody :
 *        required : true
 *        content :
 *          multipart/form-data:
 *            schema :
 *              $ref : '#/components/schemas/CreateBlog'
 *      responses:
 *          201 :
 *              description : success
 */

/**
 * @swagger
 * /admin/blogs/{id} :
 *  get:
 *      tags : [Blog(AdminPanel)]
 *      summary : get blog by id and populate it's fields
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : id
 *      responses:
 *          200 :
 *              description : success
 */

/**
 * @swagger
 * /admin/blogs/{id} :
 *  delete:
 *      tags : [Blog(AdminPanel)]
 *      summary : remove blog by id
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : id
 *      responses:
 *          200 :
 *              description : success
 */

/**
 * @swagger
 * /admin/blogs/update/{id} :
 *  patch:
 *      tags : [Blog(AdminPanel)]
 *      summary : update blog document by id
 *      consumes :
 *        - multipart/form-data
 *      parameters :
 *          -   in: path
 *              type : string
 *              required : true
 *              name : id
 *          -   in: formData
 *              type : string
 *              name : title
 *          -   in: formData
 *              type : string
 *              name : text
 *          -   in: formData
 *              type : string
 *              name : short_text
 *          -   in: formData
 *              type : string
 *              name : tags
 *              example : tag1#tag2#tag3_foo#foo || str || undefined
 *          -   in: formData
 *              type : string
 *              name : category
 *          -   in: formData
 *              type : file
 *              name : image
 *      responses:
 *          201 :
 *              description : success
 */
