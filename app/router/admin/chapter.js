const {
  ChapterController,
} = require("../../http/controllers/admin/course/chapter.controller");

const router = require("express").Router();

router.put("/add", ChapterController.addChapter); //create new chapter
router.get("/list/:courseID", ChapterController.chaptersOfCourse); //get list of chapters of course
router.patch("/remove/:chapterID", ChapterController.removeChapterById); //remove one chapter
router.patch("/update/:chapterID", ChapterController.updateChapterById); //update one chapter

module.exports = { AdminApiChapterRouter: router };
