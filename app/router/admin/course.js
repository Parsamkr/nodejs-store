const {
  CourseController,
} = require("../../http/controllers/admin/course/course.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");
const router = require("express").Router();

router.post(
  "/add",
  uploadFile.single("image"),
  stringToArray("tags"),
  CourseController.addCourse
); //create new course

router.get("/list", CourseController.getListOfCourses); //get all courses

router.get("/:id", CourseController.getCorseById); //get a course
router.patch(
  "/update/:id",
  uploadFile.single("image"),
  stringToArray("tags"),
  CourseController.updateCourse
); //edit
// router.put(); //create new episode
// router.delete(); //remove

module.exports = { AdminApiCourseRouter: router };
