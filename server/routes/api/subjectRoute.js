const express = require("express");
const router = express.Router();
const subjectController = require("../../controller/subjectController");

router.get("/", subjectController.getAllDoc);
router.patch("/update/:subjectCode", subjectController.updateDocByID);
router.get("/search/:subjectCode", subjectController.getDocByID);
router.post("/create", subjectController.createDoc);
router.delete("/delete/:subjectCode", subjectController.deleteDocByID);
router.patch("/status/:subjectCode", subjectController.toggleDocStatus);

module.exports = router;
