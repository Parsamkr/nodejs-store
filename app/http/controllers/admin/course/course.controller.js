const { CourseModel } = require("../../../../models/course");
const {
  deleteFileInPublic,
  copyObject,
  deleteInvalidPropertyInObject,
  getTimeOfCourse,
} = require("../../../../utils/functions");
const {
  createCourseSchema,
} = require("../../../validators/admin/course.schema");
const Controller = require("../../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");
const path = require("path");
const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");

class CourseController extends Controller {
  async getListOfCourses(req, res, next) {
    try {
      let { search } = req.query;
      let courses;
      if (search) {
        // Create a regex pattern to match any part of the word
        const regex = new RegExp(search, "i"); // 'i' for case-insensitive

        courses = await CourseModel.find({
          $or: [
            { title: { $regex: regex } },
            { short_text: { $regex: regex } },
            { text: { $regex: regex } },
            // Add other fields if necessary
          ],
        })
          .populate([
            { path: "category", select: { parent: 0 } },
            {
              path: "teacher",
              select: { first_name: 1, last_name: 1, mobile: 1, email: 1 },
            },
          ])
          .sort({ _id: -1 });
      } else {
        courses = await CourseModel.find({})
          .populate([
            { path: "category", select: { parent: 0 } },
            {
              path: "teacher",
              select: { first_name: 1, last_name: 1, mobile: 1, email: 1 },
            },
          ])
          .sort({ _id: -1 });
      }
      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { courses } });
    } catch (error) {
      next(error);
    }
  }

  async addCourse(req, res, next) {
    try {
      const data = await createCourseSchema.validateAsync(req.body);
      const {
        title,
        text,
        short_text,
        tags,
        category,
        fileUploadPath,
        fileName,
        price,
        discount,
        discountedPrice,
        type,
      } = data;

      const image = path.join(fileUploadPath, fileName);
      req.body.image = image;
      const teacher = req.user._id;
      if (Number(price) > 0 && type == "free")
        throw createHttpError.BadRequest(
          "you can't set price for a free course"
        );

      const course = await CourseModel.create({
        title,
        text,
        short_text,
        tags,
        type,
        category,
        fileUploadPath,
        fileName,
        price,
        discount,
        image,
        status: "notStarted",
        teacher,
      });
      if (!course?._id)
        throw createHttpError.InternalServerError("creating course failed ");
      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED,
        data: { message: "course created successfully" },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }

  async getCorseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await this.findCourseById(id);

      return res
        .status(httpStatus.OK)
        .json({ statusCode: httpStatus.OK, data: { course } });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const course = await this.findCourseById(id);
      const data = copyObject(req.body);
      let blackListFields = [
        "time",
        "chapters",
        "students",
        "episodes",
        "bookmarks",
        "dislikes",
        "likes",
        "comments",
        "fileUploadPath",
        "fileName",
      ];
      deleteInvalidPropertyInObject(data, blackListFields);
      const { fileName, fileUploadPath } = req.body;
      if (req.file) {
        data.image = path.join(fileUploadPath, fileName);
        req.body.image = data.image;
        deleteFileInPublic(course.image);
      }

      const updateCourseResult = await CourseModel.updateOne(
        { _id: id },
        { $set: data }
      );

      if (updateCourseResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError("updating course failed");
      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: { message: "course updated successfully" },
      });
    } catch (error) {
      deleteFileInPublic(req.body.image);
      next(error);
    }
  }

  async findCourseById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("id is incorrect");
    const course = await CourseModel.findById(id);
    if (!course)
      throw createHttpError.NotFound("didn't find course by this id");
    return course;
  }
}
module.exports = {
  CourseController: new CourseController(),
};
