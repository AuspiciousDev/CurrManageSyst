const express = require("express");
const router = express.Router();
const feedbacksController = require("../../controller/feedbacksController");

router.get("/", feedbacksController.getAllDoc);
router.get("/search/:feedbackID", feedbacksController.getDocByID);
router.get("/versions/:currVerID", feedbacksController.getDocVersionsByID);
router.post("/create", feedbacksController.createDoc);
router.delete("/delete/:feedbackID", feedbacksController.deleteDocByID);
module.exports = router;
