const Curriculum = require("../model/Curriculum");

const curriculumController = {
  createDoc: async (req, res) => {
    try {
      let emptyFields = [];
      let currID;
      const { courseYear, currYear, createdBy } = req.body;
      if (!currYear) emptyFields.push("Curriculum Year");
      if (!courseYear) emptyFields.push("Course Year");
      if (!createdBy) emptyFields.push("Created By");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      currID = courseYear + "_" + currYear;
      const duplicateID = await Curriculum.findOne({ currID }).exec();
      if (duplicateID)
        return res
          .status(409)
          .json({ message: "Curriculum Year Already Exists!" });
      const docObject = { currID, courseYear, currYear, createdBy };
      const createDoc = await Curriculum.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const doc = await Curriculum.find().sort({ updatedAt: -1 }).lean();
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllCurrDoc: async (req, res) => {
    try {
      const doc = await Curriculum.aggregate([
        {
          $group: {
            _id: "$currYear",
            count: {
              $sum: 1,
            },
            currLatestVersion: {
              $max: "$currLatestVersion",
            },
            createdBy: {
              $first: "$createdBy",
            },
          },
        },
        {
          $match: {
            _id: {
              $ne: null,
            },
            count: {
              $gte: 1,
            },
          },
        },
        {
          $project: {
            curriculumYear: "$_id",
            currLatestVersion: "$curriculumVersion",
            createdBy: "$createdBy",
            _id: 0,
          },
        },
        {
          $sort: {
            curriculumYear: -1,
          },
        },
      ]);
      console.log(
        "🚀 ~ file: curriculumController.js:73 ~ getAllCurrDoc: ~ doc:",
        doc
      );
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllYearDoc: async (req, res) => {
    const currYear = req.params.currYear;
    console.log(
      "🚀 ~ file: curriculumController.js:94 ~ getAllYearDoc: ~ currYear:",
      currYear
    );
    if (!currYear)
      return res.status(400).json({ message: "Curriculum Year is required!" });

    try {
      const doc = await Curriculum.find({ curriculumYear: currYear })
        .sort({ curriculumVersion: -1 })
        .lean();
      console.log(
        "🚀 ~ file: curriculumController.js:101 ~ getAllYearDoc: ~ doc:",
        doc
      );
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    const currID = req.params.currID;
    if (!currID)
      return res.status(400).json({ message: `Curriculum ID is required` });
    try {
      const doc = await Curriculum.findOne({ currID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Curriculum [${currID}] not found!` });
      const deleteDoc = await doc.deleteOne({ currID });
      res.json(deleteDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = curriculumController;
