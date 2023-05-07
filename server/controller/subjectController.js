const Subject = require("../model/Subject");
const subjectController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    let tempSubjectCode;
    try {
      const {
        subjectCode,
        descTitle,
        createdBy,
        courseYear,
        lecUnits,
        labUnits,
        hoursPerWeek,
        preReq,
        coReq,
        courseTerm,
      } = req.body;
      if (!subjectCode) emptyFields.push("Subject ID");
      if (!descTitle) emptyFields.push("Level ID");
      if (!courseYear) emptyFields.push("Course Year");
      if (!createdBy) emptyFields.push("Created By");
      if (!lecUnits) emptyFields.push("Lecture Units");
      if (!labUnits) emptyFields.push("Lab Units");
      if (!hoursPerWeek) emptyFields.push("Hours per Week");
      if (!courseTerm) emptyFields.push("Term");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      tempSubjectCode = subjectCode.replace(/\s/g, "");
      console.log(
        "🚀 ~ file: subjectController.js:33 ~ createDoc: ~ tempSubjectCode:",
        tempSubjectCode
      );
      console.log(
        "🚀 ~ file: subjectController.js:33 ~ createDoc: ~ subjectCode:",
        subjectCode
      );
      const duplicate = await Subject.findOne({
        subjectCode: tempSubjectCode,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Subject ID!" });

      const docObject = {
        subjectCode: tempSubjectCode,
        descTitle,
        createdBy,
        courseYear,
        lecUnits: parseFloat(lecUnits).toFixed(2),
        labUnits: parseFloat(labUnits).toFixed(2),
        totalUnits: (parseInt(lecUnits) + parseInt(labUnits)).toFixed(2),
        hoursPerWeek,
        preReq,
        coReq,
        courseTerm,
      };
      const createDoc = await Subject.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const subject = await Subject.find().lean();
      if (!subject)
        return res.status(204).json({ message: "No record found!" });
      res.status(200).json(subject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req?.params?.subjectCode) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const subjectCode = req?.params?.subjectCode;
      const findDoc = await Subject.findOne({ subjectCode }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject Code ${subjectCode} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
      if (!req?.params?.subjectCode) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const subjectCode = req?.params?.subjectCode;
      const findDoc = await Subject.findOne({ subjectCode }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject Code ${subjectCode} not found!` });
      }
      const {
        descTitle,
        courseYear,
        lecUnits,
        labUnits,
        hoursPerWeek,
        preReq,
        coReq,
        courseTerm,
      } = req.body;
      const docObject = {
        descTitle,
        courseYear,
        lecUnits: parseFloat(lecUnits).toFixed(2),
        labUnits: parseFloat(labUnits).toFixed(2),
        totalUnits: (parseInt(lecUnits) + parseInt(labUnits)).toFixed(2),
        hoursPerWeek,
        preReq,
        coReq,
        courseTerm,
      };
      const update = await Subject.findOneAndUpdate({ subjectCode }, docObject);
      if (!update)
        return res.status(400).json({ message: "Subject update failed!" });
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: subjectController.js:97 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    try {
      if (!req?.params?.subjectCode) {
        return res.status(400).json({ message: "Subject Code is required!" });
      }
      const subjectCode = req?.params?.subjectCode;
      const findDoc = await Subject.findOne({ subjectCode }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject Code ${subjectCode} not found!` });
      }
      const deleteItem = await findDoc.deleteOne({ subjectCode });
      res.status(200).json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: subjectController.js:119 ~ deleteDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      if (!req?.params?.subjectCode) {
        return res.status(400).json({ message: "Subject Code is required!" });
      }
      const subjectCode = req?.params?.subjectCode;
      const { status } = req.body;
      const findDoc = await Subject.findOne({ subjectCode }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject Code ${subjectCode} not found!` });
      }
      const updateStatus = await Subject.findOneAndUpdate(
        { subjectCode },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res
          .status(400)
          .json({ message: "Subject status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      console.log(
        "🚀 ~ file: subjectController.js:153 ~ toggleDocStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = subjectController;
