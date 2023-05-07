const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    currVerID: {
      type: String,
      required: true,
    },
    currID: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
    },
    currVer: {
      type: Number,
      required: true,
    },
    stakeHolderApprovalStatus: {
      type: String,
      default: "",
    },
    stakeHolderApprovalCount: {
      type: Number,
      default: 0,
    },
    stakeHolderApprovalUsers: [
      {
        type: String,
      },
    ],
    chairApproval: {
      type: String,
      default: "",
    },
    deanApproval: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "ongoing",
    },
    passed: {
      type: Boolean,
      required: false,
    },

    term1: {
      courses: [
        {
          subjectCode: {
            type: String,
          },
          descTitle: {
            type: String,
          },
          lecUnits: {
            type: Number,
          },
          labUnits: {
            type: Number,
          },
          totalUnits: {
            type: Number,
          },
          hoursPerWeek: {
            type: Number,
          },
          preReq: [
            {
              type: String,
            },
          ],
          coReq: [
            {
              type: String,
            },
          ],
        },
      ],
    },
    term2: {
      courses: [
        {
          subjectCode: {
            type: String,
          },
          descTitle: {
            type: String,
          },
          lecUnits: {
            type: Number,
          },
          labUnits: {
            type: Number,
          },
          totalUnits: {
            type: Number,
          },
          hoursPerWeek: {
            type: Number,
          },
          preReq: [
            {
              type: String,
            },
          ],
          coReq: [
            {
              type: String,
            },
          ],
        },
      ],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("CurriculumVer", schema);
