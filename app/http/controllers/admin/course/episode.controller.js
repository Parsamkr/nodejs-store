const { default: getVideoDurationInSeconds } = require("get-video-duration");
const {
  createEpisodeSchema,
} = require("../../../validators/admin/course.schema");
const Controller = require("../../controller");
const { StatusCodes: httpStatus } = require("http-status-codes");
const path = require("path");
const {
  getTime,
  deleteFileInPublic,
  deleteInvalidPropertyInObject,
  copyObject,
} = require("../../../../utils/functions");
const createHttpError = require("http-errors");
const { CourseModel } = require("../../../../models/course");
const { ObjectIdValidator } = require("../../../validators/public.validator");

class EpisodeController extends Controller {
  async addNewEpisode(req, res, next) {
    try {
      const {
        title,
        text,
        chapterID,
        courseID,
        fileName,
        fileUploadPath,
        type,
      } = await createEpisodeSchema.validateAsync(req.body);
      const videoAddress = path.join(fileUploadPath, fileName);
      const videoUrl = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${videoAddress}`;
      const seconds = await getVideoDurationInSeconds(videoUrl);
      const time = getTime(seconds);
      const episode = { title, text, time, type, videoAddress };

      const createEpisodeResult = await CourseModel.updateOne(
        {
          _id: courseID,
          "chapters._id": chapterID,
        },
        { $push: { "chapters.$.episodes": episode } }
      );
      if (createEpisodeResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError(
          "adding episode countered an error"
        );
      return res.status(httpStatus.CREATED).json({
        statusCode: httpStatus.CREATED,
        data: {
          message: "episode created successfully",
        },
      });
    } catch (error) {
      deleteFileInPublic(req);
      next(error);
    }
  }

  async removeEpisode(req, res, next) {
    try {
      const { id: episodeID } = await ObjectIdValidator.validateAsync({
        id: req.params.episodeID,
      });

      const removeEpisodeResult = await CourseModel.updateOne(
        {
          "chapters.episodes._id": episodeID,
        },
        { $pull: { "chapters.$.episodes": { _id: episodeID } } }
      );
      if (removeEpisodeResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError(
          "removing episode countered an error"
        );

      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
          message: "episode deleted successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEpisode(req, res, next) {
    try {
      let blackListFields = ["_id"];
      const { id: episodeID } = await ObjectIdValidator.validateAsync({
        id: req.params.episodeID,
      });

      const episode = await this.getOneEpisode(episodeID);
      const { fileName, fileUploadPath } = req.body;
      if (fileName && fileUploadPath) {
        req.body.videoAddress = path.join(fileUploadPath, fileName);
        const videoUrl = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${req.body.videoAddress}`;
        const seconds = await getVideoDurationInSeconds(videoUrl);
        req.body.time = getTime(seconds);
        blackListFields.push("fileName");
        blackListFields.push("fileUploadPath");
      } else {
        blackListFields.push("time");
        blackListFields.push("videoAddress");
      }

      const data = copyObject(req.body);
      deleteInvalidPropertyInObject(data, blackListFields);
      const newEpisode = { ...episode, ...data };

      const updateEpisodeResult = await CourseModel.updateOne(
        {
          "chapters.episodes._id": episodeID,
        },
        { $set: { "chapters.$.episodes.$[episode]": newEpisode } },
        {
          arrayFilters: [{ "episode._id": episodeID }],
        }
      );
      console.log(newEpisode, updateEpisodeResult);
      if (updateEpisodeResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError(
          "updating episode countered an error"
        );

      return res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        data: {
          message: "episode updated successfully",
        },
      });
    } catch (error) {
      const { fileName, fileUploadPath } = req.body;
      if (fileName && fileUploadPath) deleteFileInPublic(req.body.videoAddress);
      next(error);
    }
  }

  async getOneEpisode(episodeID) {
    const course = await CourseModel.findOne(
      { "chapters.episodes._id": episodeID },
      { "chapters.$": 1 }
    );
    if (!course) throw new createHttpError.NotFound("didn't find episode");
    const episode = course?.chapters?.[0].episodes?.[0];
    if (!episode) throw new createHttpError.NotFound("didn't find episode");
    return copyObject(episode);
  }
}

module.exports = { EpisodeController: new EpisodeController() };
