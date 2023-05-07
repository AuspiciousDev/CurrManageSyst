const Feedback = require("../model/Feedback");
const feedbackController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const { createdBy, currVerID, feedbackMessage } = req.body;
      if (!createdBy) emptyFields.push("Created By");
      if (!currVerID) emptyFields.push("Curriculum Version ID");
      if (!feedbackMessage) emptyFields.push("Feedback");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const docObject = {
        createdBy,
        currVerID,
        feedbackMessage,
      };
      const createDoc = await Feedback.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const subject = await Feedback.find().lean();
      if (!subject)
        return res.status(204).json({ message: "No record found!" });
      res.status(200).json(subject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      const feedbackID = req?.params?.feedbackID;
      if (!req?.params?.feedbackID) {
        return res.status(400).json({ message: "Feedback ID is required!" });
      }

      const findDoc = await Feedback.findOne({ feedbackID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Feedback ID ${feedbackID} not found!` });
      }
      res.status(200).json(findDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocVersionsByID: async (req, res) => {
    try {
      const currVerID = req?.params?.currVerID;
      if (!req?.params?.currVerID) {
        return res
          .status(400)
          .json({ message: "Curriculum Version ID is required!" });
      }

      const findDoc = await Feedback.find({ currVerID }).exec();
      console.log(
        "🚀 ~ file: feedbacksController.js:64 ~ getDocVersionsByID: ~ findDoc:",
        findDoc
      );
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Curriculum Version ID ${currVerID} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: feedbacksController.js:71 ~ getDocVersionsByID: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    const feedbackID = req.params.feedbackID;
    if (!feedbackID)
      return res.status(400).json({ message: `Feedback ID is required` });
    try {
      const doc = await Feedback.findOne({ feedbackID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Feedback [${feedbackID}] not found!` });
      const deleteDoc = await doc.deleteOne({ feedbackID });
      res.json(deleteDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = feedbackController;
