const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      lowercase: true,
    },
    descTitle: {
      type: String,
      required: true,
      lowercase: true,
    },
    lecUnits: {
      type: Number,
      required: true,
    },
    labUnits: {
      type: Number,
      required: true,
    },
    totalUnits: {
      type: Number,
      required: true,
    },
    hoursPerWeek: {
      type: Number,
      required: true,
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
    createdBy: {
      type: String,
      required: true,
    },
    courseYear: {
      type: String,
      required: true,
    },
    courseTerm: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", schema);
