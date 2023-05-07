const express = require("express");
const router = express.Router();
const curriculumController = require("../../controller/curriculumController");

router.get("/", curriculumController.getAllDoc);
router.get("/perYear", curriculumController.getAllCurrDoc);
router.get("/perYear/:currYear", curriculumController.getAllYearDoc);
router.get("/search/:currID", curriculumController.getDocByID);
router.post("/create", curriculumController.createDoc);
router.patch("/update/:currID", curriculumController.updateDocByID);
router.delete("/delete/:currID", curriculumController.deleteDocByID);
module.exports = router;
