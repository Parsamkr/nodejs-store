const path = require("path");
const { createBlogSchema } = require("../../../validators/admin/blog.schema");
const Controller = require("../../controller");
const { BlogModel } = require("../../../../models/blogs");
const {
  deleteFileInPublic,
  deleteInvalidPropertyInObject,
} = require("../../../../utils/functions");
const createHttpError = require("http-errors");
const { StatusCodes: httpStatus } = require("http-status-codes");
const BlogBlackList = {
  BOOKMARKS: "bookmarks",
  LIKES: "likes",
  DISLIKES: "dislikes",
  COMMENTS: "comments",
  AUTHOR: "author",
};
Object.freeze(BlogBlackList);

class BlogController extends Controller {
  async createBlog(req, res, next) {
    try {
      const blogDataBody = await createBlogSchema.validateAsync(req.body);
      req.body.image = path.join(
        blogDataBody.fileUploadPath,
        blogDataBody.fileName
      );

      const { title, text, short_text, category, tags } = blogDataBody;

      const author = req.user._id;
      const image = req.body.image;
      const blog = await BlogModel.create({
        title,
        text,
        short_text,
        category,
        tags,
        image,
        author,
      });

      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED,
        data: {
          message: "blog created successfully",
        },
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
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
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
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { blogs } });
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
      res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
          message: "blog deleted successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBlogById(req, res, next) {
    try {
      const { id } = req.params;
      await this.findBlog({ _id: id });
      if (req?.body?.fileUploadPath && req?.body?.fileName) {
        req.body.image = path.join(req.body.fileUploadPath, req.body.fileName);
      }
      const data = req.body;

      let blackListFields = Object.values(BlogBlackList);

      deleteInvalidPropertyInObject(data, blackListFields);

      const updateResult = await BlogModel.updateOne(
        { _id: id },
        { $set: data }
      );
      if (updateResult.modifiedCount == 0)
        throw createHttpError.InternalServerError("updating the blog failed");
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
          message: "blog updated successfully",
        },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
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
