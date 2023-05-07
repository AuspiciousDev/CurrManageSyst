const express = require("express");
const router = express.Router();
const loginHistoryController = require("../../controller/loginHistoryController");
router.get("/", loginHistoryController.getAllDoc);
router.get("/:username", loginHistoryController.getAllUserDocByID);
module.exports = router;
