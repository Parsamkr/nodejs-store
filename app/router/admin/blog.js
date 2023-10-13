const {
  AdminBlogController,
} = require("../../http/controllers/admin/blog.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");

const router = require("express").Router();

/**
 * @swagger
 * /admin/blogs :
 *  get:
 *      tags : [Blog(AdminPanel)]
 *      summary : get all blogs
 *      parameters :
 *          -   in: header
 *              type : string
 *              required : true
 *              name : access-token
 *              value : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTExNjY4ODIyMyIsImlhdCI6MTY5NzIxNDIyOSwiZXhwIjoxNjk3MjE3ODI5fQ.VcSNBB-vH0sM8YzUarbsAaQWm17q3VvErddU4CHtesQ
 *              example : Bearer token
 *      responses:
 *          200 :
 *              description : success - get array of blogs
 */

router.get("/", AdminBlogController.getListOfBlogs);

/**
 * @swagger
 * /admin/blogs/add :
 *  post:
 *      tags : [Blog(AdminPanel)]
 *      summary : create blog document
 *      consumes :
 *        - multipart/form-data
 *      parameters :
 *          -   in: header
 *              type : string
 *              required : true
 *              name : access-token
 *              value : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTExNjY4ODIyMyIsImlhdCI6MTY5NzIxNDIyOSwiZXhwIjoxNjk3MjE3ODI5fQ.VcSNBB-vH0sM8YzUarbsAaQWm17q3VvErddU4CHtesQ
 *              example : Bearer token
 *          -   in: formData
 *              type : string
 *              required : true
 *              name : title
 *          -   in: formData
 *              type : string
 *              required : true
 *              name : text
 *          -   in: formData
 *              type : string
 *              required : true
 *              name : short_text
 *          -   in: formData
 *              type : string
 *              name : tags
 *              example : tag1#tag2#tag3_foo#foo || str || undefined
 *          -   in: formData
 *              type : string
 *              required : true
 *              name : category
 *          -   in: formData
 *              type : file
 *              required : true
 *              name : image
 *      responses:
 *          201 :
 *              description : success
 */

router.post(
  "/add",
  uploadFile.single("image"),
  stringToArray("tags"),
  AdminBlogController.createBlog
);

module.exports = { BlogAdminApiRoutes: router };
