const createHttpError = require("http-errors");
const { CategoryModel } = require("../../../models/categories");
const Controller = require("../controller");
const {
  addCategorySchema,
  updateCategorySchema,
} = require("../../validators/admin/category.schema");
const { ObjectId } = require("mongodb");

class CategoryController extends Controller {
  async addCategory(req, res, next) {
    try {
      await addCategorySchema.validateAsync(req.body);
      const { title, parent } = req.body;
      const category = await CategoryModel.create({ title, parent });
      if (!category)
        throw createHttpError.InternalServerError("internal error");
      return res.status(201).json({
        data: { statusCode: 201, message: "category addded successfully" },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this.checkExistCategory(id);
      const deletedResult = await CategoryModel.deleteMany({
        $or: [
          {
            _id: category._id.toString(),
          },
          {
            parent: category._id.toString(),
          },
        ],
      });
      console.log(deletedResult);
      if (deletedResult == 0)
        throw createHttpError.InternalServerError("deleting category failed");
      return res.status(200).json({
        data: { statusCode: 200, message: "category successfully deleted" },
      });
    } catch (error) {
      next(error);
    }
  }
  async editCategoryTitle(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const category = await this.checkExistCategory(id);
      await updateCategorySchema.validateAsync(req.body);
      const resultOfUpdate = await CategoryModel.updateOne(
        { _id: id },
        { $set: { title } }
      );
      if (resultOfUpdate.modifiedCount == 0)
        throw createHttpError.InternalServerError(
          "updating the category failed"
        );
      return res.status(200).json({
        data: { statusCode: 200, message: "category updated successfully" },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategory(req, res, next) {
    try {
      // avvali ta ye laye nshun mide
      // const categories = await CategoryModel.aggregate([
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "_id",
      //       foreignField: "parent",
      //       as: "children",
      //     },
      //   },
      //   { $project: { __v: 0, "children.__v": 0, "children.parent": 0 } },
      //   { $match: { parent: undefined } },
      // ]);
      // dovvomi ba graph lookup bud vali omqo khub nshun nmidad
      // const categories = await CategoryModel.aggregate([
      //   {
      //     $graphLookup: {
      //       from: "categories",
      //       startWith: "$_id",
      //       connectFromField: "_id",
      //       connectToField: "parent",
      //       maxDepth: 5,
      //       depthField: "depth",
      //       as: "children",
      //     },
      //   },
      //   { $project: { __v: 0, "children.__v": 0, "children.parent": 0 } },
      //   { $match: { parent: undefined } },
      // ]);
      const categories = await CategoryModel.find(
        {
          parent: undefined,
        },
        { __v: 0 }
      ).populate([{ path: "children", select: { __v: 0 } }]);
      return res.status(200).json({ data: { statusCode: 200, categories } });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "children",
          },
        },
        { $project: { __v: 0, "children.__v": 0, "children.parent": 0 } },
      ]);
      return res.status(200).json({ data: { statusCode: 200, category } });
    } catch (error) {
      next(error);
    }
  }
  async getAllParents(req, res, next) {
    try {
      const parents = await CategoryModel.find(
        { parent: undefined },
        { __v: 0 }
      );
      return res.status(200).json({ data: { statusCode: 200, parents } });
    } catch (error) {
      next(error);
    }
  }
  async getChildrenOfParent(req, res, next) {
    try {
      const { parent } = req.params;
      const children = await CategoryModel.find(
        { parent },
        { __v: 0, parent: 0 }
      );
      return res.status(200).json({ data: { statusCode: 200, children } });
    } catch (error) {
      next(error);
    }
  }

  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category) throw createHttpError.NotFound("category didn`t found");
    return category;
  }
}

module.exports = { CategoryController: new CategoryController() };
