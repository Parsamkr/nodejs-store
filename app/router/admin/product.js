const {
  ProductController,
} = require("../../http/controllers/admin/product.controller");
const { uploadFile } = require("../../utils/multer");
const { stringToArray } = require("../../http/middlewares/stringToArray");

const router = require("express").Router();

/**
 * @swagger
 *  components :
 *      schemas:
 *          CreateProduct :
 *              type : object
 *              required :
 *                  -   title
 *                  -   text
 *                  -   short_text
 *                  -   category
 *                  -   images
 *                  -   count
 *              properties :
 *                  title :
 *                      type : string
 *                      description : title of the product
 *                  text :
 *                      type : string
 *                      description : title of the product
 *                  short_text :
 *                      type : string
 *                      description : title of the product
 *                  tags :
 *                      type : array
 *                      description : title of the product
 *                  category :
 *                      type : string
 *                      description : image of the product
 *                  images :
 *                      type : array
 *                      items :
 *                        type : string
 *                        format : binary
 *                      description : title of the product
 *                  price :
 *                      type : string
 *                      description : title of the product
 *                  count :
 *                      type : string
 *                      description : title of the product
 *                  discount :
 *                      type : string
 *                      description : title of the product
 *                  height :
 *                      type : string
 *                      description : height of the product box
 *                  weight :
 *                      type : string
 *                      description : weight of the product box
 *                  width :
 *                      type : string
 *                      description : width of the product box
 *                  length :
 *                      type : string
 *                      description : length of the product box
 *                  colors :
 *                      type : array
 *                      description : colors of the product box
 *
 */

/**
 * @swagger
 * /admin/product/add :
 *  post:
 *      summary : create product
 *      tags : [Product(AdminPanel)]
 *      requestBody :
 *          required : true
 *          content :
 *              multipart/form-data:
 *                  schema:
 *                      $ref : '#/components/schemas/CreateProduct'
 *      responses:
 *          200 :
 *              description : success
 */

router.post(
  "/add",
  uploadFile.array("images", 10),
  stringToArray("tags"),
  ProductController.addProduct
);
/**
 * @swagger
 * /admin/product/list :
 *  get:
 *      summary : get all products
 *      tags : [Product(AdminPanel)]
 *      responses:
 *          200 :
 *              description : success
 */
router.get("/list", ProductController.getAllProducts);
// router.patch();
// router.delete();
// router.get();

module.exports = { AdminApiProductRouter: router };
