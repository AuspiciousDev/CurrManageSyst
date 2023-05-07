const express = require("express");
const router = express.Router();
const curriculumVerController = require("../../controller/curriculumVerController");

router.get("/", curriculumVerController.getAllDoc);
router.get("/perYear", curriculumVerController.getAllCurrDoc);
router.get("/versions/:currID", curriculumVerController.getCurrByID);
router.get("/version/:currVerID", curriculumVerController.getCurrVerByID);
router.get("/search/:currVerID", curriculumVerController.getDocByID);
router.post("/create", curriculumVerController.createDoc);
router.patch(
  "/update/:mainCurriculumID",
  curriculumVerController.updateDocByID
);
router.delete("/delete/:currVerID", curriculumVerController.deleteDocByID);
router.patch("/status/:currVerID", curriculumVerController.toggleDocStatus);
router.patch(
  "/status/archive/:currVerID",
  curriculumVerController.toggleDocArchiveStatus
);
module.exports = router;
