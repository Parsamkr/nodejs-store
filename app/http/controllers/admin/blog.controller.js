const path = require("path");
const { createBlogSchema } = require("../../validators/admin/blog.schema");
const Controller = require("../controller");
const { BlogModel } = require("../../../models/blogs");
const { deleteFileInPublic } = require("../../../utils/functions");
const createHttpError = require("http-errors");

class BlogController extends Controller {
  async createBlog(req, res, next) {
    try {
      const blogDataBody = await createBlogSchema.validateAsync(req.body);
      req.body.image = path.join(
        blogDataBody.fileUploadPath,
        blogDataBody.fileName
      );

      const { title, text, short_text, category, tags } = blogDataBody;
      const image = req.body.image;
      const author = req.user._id;
      const blog = await BlogModel.create({
        title,
        text,
        short_text,
        category,
        tags,
        image,
        author,
      });

      return res.status(201).json({
        data: { statusCode: 201, message: "blog created successfully" },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }
  async getOneBlogById(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await this.findBlog({ _id: id });
      return res.status(200).json({
        data: {
          statusCode: 200,
          blog,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getListOfBlogs(req, res, next) {
    try {
      const blogs = await BlogModel.aggregate([
        { $match: {} },
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "author",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $lookup: {
            from: "categories",
            foreignField: "_id",
            localField: "category",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $project: {
            "author.roles": 0,
            "author.otp": 0,
            "author.__v": 0,
            "author.bills": 0,
            "author.discount": 0,
          },
        },
      ]);
      return res.status(200).json({ data: { statusCode: 200, blogs } });
    } catch (error) {
      next(error);
    }
  }
  async getCommentsOfBlog(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async deleteBlogById(req, res, next) {
    try {
      const { id } = req.params;
      await this.findBlog({ _id: id });
      const result = await BlogModel.deleteOne({ _id: id });
      if (result.deletedCount == 0)
        throw createHttpError.InternalServerError("failed to delete the blog");
      res.status(200).json({
        data: { statusCode: 200, message: "blog deleted successfully" },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBlogById(req, res, next) {
    try {
      const { id } = req.params;
      await this.findBlog({ _id: id });
      if (req.body.fileUploadPath && req.body.fileName) {
        req.body.image = path.join(req.body.fileUploadPath, req.body.fileName);
      }
      const data = req.body;

      let nullishData = ["", " ", "0", 0, null, undefined];
      let blackListFields = [
        "bookmarks",
        "dislikes",
        "likes",
        "comments",
        "author",
      ];
      Object.keys(data).forEach((key) => {
        if (blackListFields.includes(key)) delete data[key];
        if (typeof data[key] == "string") data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key].length > 0)
          data[key] = data[key].map((item) => item.trim());
        if (nullishData.includes(data[key])) delete data[key];
      });

      const updateResult = await BlogModel.updateOne(
        { _id: id },
        { $set: data }
      );
      if (updateResult.modifiedCount == 0)
        throw createHttpError.InternalServerError("updating the blog failed");
      return res.status(200).json({
        data: { statusCode: 200, message: "blog updated successfully" },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image || "");
      next(error);
    }
  }

  async findBlog(query = {}) {
    const blog = await BlogModel.findOne(query).populate([
      { path: "category", select: ["title"] },
      {
        path: "author",
        select: ["mobile", "first_name", "last_name", "username"],
      },
    ]);
    if (!blog) {
      throw createHttpError.NotFound("didn't found blog");
    }
    return blog;
  }
}

module.exports = { AdminBlogController: new BlogController() };
