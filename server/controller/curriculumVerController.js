const Curriculum = require("../model/Curriculum");
const CurriculumVersions = require("../model/CurriculumVersions");
const User = require("../model/User");
var tempCurrVer;
var existingItem;
var stakeCount, stakeApprovedCount;
var approvedStakeholders;
var item = [];
var stakeHolderApprovalStatus, tempStatus;
var objDoc;
const curriculumController = {
  createDoc: async (req, res) => {
    try {
      let emptyFields = [];
      let currVerID;

      const {
        courseYear,
        currYear,
        createdBy,
        currVer,
        term1,
        term2,
        updatedBy,
      } = req.body;
      console.log(
        "🚀 ~ file: curriculumVerController.js:19 ~ createDoc: ~ currVer:",
        currVer
      );
      if (!courseYear) emptyFields.push("Course Year");
      if (!currYear) emptyFields.push("Curriculum Year");
      if (!createdBy) emptyFields.push("Created By");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      if (!currVer) {
        tempCurrVer = 1;
      } else {
        tempCurrVer = (parseFloat(currVer) + parseFloat(0.1)).toFixed(1);
      }
      console.log(
        "🚀 ~ file: curriculumVerController.js:34 ~ createDoc: ~ tempCurrVer:",
        tempCurrVer
      );

      currVerID = courseYear + "_" + currYear + "_" + tempCurrVer;
      const duplicateID = await CurriculumVersions.findOne({
        currVerID,
      }).exec();
      if (duplicateID)
        return res.status(409).json({
          message: `Curriculum Version ${tempCurrVer}  Already Exists!`,
        });
      const docObject = {
        currVerID,
        currID: courseYear + "_" + currYear,
        createdBy,
        currVer: tempCurrVer,
        updatedBy,
        term1: {
          courses: term1,
        },
        term2: {
          courses: term2,
        },
      };
      console.log(
        "🚀 ~ file: curriculumVerController.js:44 ~ createDoc: ~ c:",
        docObject
      );

      const createDoc = await CurriculumVersions.create(docObject);
      if (createDoc) {
        const update = await Curriculum.findOneAndUpdate(
          { currID: courseYear + "_" + currYear },
          {
            currLatestVersion: tempCurrVer,
          }
        );
        if (update) res.status(201).json(createDoc);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: curriculumVerController.js:45 ~ createDoc: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const doc = await CurriculumVersions.find()
        .sort({ updatedAt: -1 })
        .lean();
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
  getCurrByID: async (req, res) => {
    const currID = req.params.currID;
    console.log(
      "🚀 ~ file: curriculumVerController.js:106 ~ getCurrByID: ~ currID:",
      currID
    );

    if (!currID)
      return res.status(400).json({ message: "Curriculum ID is required!" });

    try {
      const doc = await CurriculumVersions.find({ currID })
        .sort({ createdAt: -1 })
        .lean();
      console.log(
        "🚀 ~ file: curriculumVerController.js:114 ~ getCurrByID: ~ doc:",
        doc
      );

      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getCurrVerByID: async (req, res) => {
    const currVerID = req.params.currVerID;
    console.log(
      "🚀 ~ file: curriculumVerController.js:106 ~ getCurrByID: ~ currID:",
      currVerID
    );

    if (!currVerID)
      return res
        .status(400)
        .json({ message: "Curriculum Ver ID is required!" });

    try {
      const doc = await CurriculumVersions.find({ currVerID })
        .sort({ createdAt: -1 })
        .lean();
      console.log(
        "🚀 ~ file: curriculumVerController.js:114 ~ getCurrByID: ~ doc:",
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
    const currVerID = req.params.currVerID;
    if (!currVerID)
      return res
        .status(400)
        .json({ message: `Curriculum Version is required` });
    try {
      const doc = await CurriculumVersions.findOne({ currVerID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Curriculum Version [${currVerID}] not found!` });
      const deleteDoc = await doc.deleteOne({ currVerID });
      res.json(deleteDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    const currVerID = req.params.currVerID;
    if (!currVerID)
      return res
        .status(400)
        .json({ message: `Curriculum Version ID is required` });
    try {
      const { status, chairApproval, stakeholderID, deanApproval } = req.body;
      console.log(
        "🚀 ~ file: curriculumVerController.js:236 ~ toggleDocStatus: ~ status:",
        status
      );

      if (
        status !== "chairReview" &&
        status !== "stakeReview" &&
        status !== "deanReview" &&
        status !== "approved" &&
        status !== "denied" &&
        status !== ""
      )
        return res.status(400).json({ message: "Invalid Status" });
      const doc = await CurriculumVersions.findOne({ currVerID }).exec();
      if (!doc)
        return res
          .status(204)
          .json({ message: `Curriculum Version [${currVerID}] not found!` });

      console.log(
        "🚀 ~ file: curriculumVerController.js:251 ~ toggleDocStatus: ~ doc:",
        doc
      );

      if (stakeholderID) {
        approvedStakeholders = doc.stakeHolderApprovalUsers;
        stakeApprovedCount = doc.stakeHolderApprovalCount;
        if (!approvedStakeholders.includes(stakeholderID)) {
          if (status === "approved") {
            existingItem = doc.stakeHolderApprovalUsers?.find((item) => {
              return item === stakeholderID;
            });
            console.log(
              "🚀 ~ file: curriculumVerController.js:274 ~ existingItem=doc.stakeHolderApprovalUsers?.find ~ existingItem:",
              existingItem
            );

            if (existingItem) {
              existingItem = stakeholderID;
            } else {
              stakeholderID && approvedStakeholders.push(stakeholderID);
            }
            stakeCount = await User.find({ userType: "stakeholder" }).count();
            if (stakeApprovedCount < stakeCount) {
              stakeApprovedCount = parseInt(stakeApprovedCount) + parseInt(1);
              if (parseInt(stakeApprovedCount) === stakeCount) {
                stakeHolderApprovalStatus = "approved";
                tempStatus = "deanReview";
              }
            }
          }
        }
        objDoc = {
          status: tempStatus,
          stakeHolderApprovalCount: stakeApprovedCount,
          stakeHolderApprovalUsers:
            approvedStakeholders && approvedStakeholders,
          stakeHolderApprovalStatus: stakeHolderApprovalStatus
            ? stakeHolderApprovalStatus
            : "",
        };
      } else if (deanApproval) {
        if (deanApproval === "approved") {
          objDoc = { status, deanApproval, passed: true };
        } else {
          objDoc = { status, deanApproval, passed: false };
        }
      } else {
        objDoc = { status, chairApproval };
      }

      console.log(
        "🚀 ~ file: curriculumVerController.js:301 ~ toggleDocStatus: ~ objDoc:",
        objDoc
      );

      const update = await CurriculumVersions.findOneAndUpdate(
        { currVerID },
        objDoc
      );
      if (!update) {
        return res
          .status(400)
          .json({ message: "Curriculum Version update failed!" });
      }
      console.log(
        "🚀 ~ file: curriculumVerController.js:312 ~ toggleDocStatus: ~ update:",
        update
      );
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: curriculumVerController.js:264 ~ toggleDocStatus: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocArchiveStatus: async (req, res) => {
    const currVerID = req.params.currVerID;
    if (!currVerID)
      return res
        .status(400)
        .json({ message: `Curriculum Version ID is required` });
    try {
      const { status } = req.body;
      console.log(
        "🚀 ~ file: curriculumVerController.js:236 ~ toggleDocStatus: ~ status:",
        status
      );

      if (status !== "archived")
        return res.status(400).json({ message: "Invalid Status" });
      const doc = await CurriculumVersions.findOne({ currVerID }).exec();
      if (!doc)
        return res
          .status(204)
          .json({ message: `Curriculum Version [${currVerID}] not found!` });

      console.log(
        "🚀 ~ file: curriculumVerController.js:251 ~ toggleDocStatus: ~ doc:",
        doc
      );

      const update = await CurriculumVersions.findOneAndUpdate(
        { currVerID },
        { status }
      );
      if (!update) {
        return res
          .status(400)
          .json({ message: "Curriculum Version update failed!" });
      }
      console.log(
        "🚀 ~ file: curriculumVerController.js:312 ~ toggleDocStatus: ~ update:",
        update
      );
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: curriculumVerController.js:264 ~ toggleDocStatus: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = curriculumController;
