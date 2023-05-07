const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    currID: {
      type: String,
      required: true,
    },
    courseYear: {
      type: String,
      required: true,
    },
    currYear: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    currLatestVersion: {
      type: String,
      default: "-",
    },
    // status: {
    //   type: String,
    //   default: "",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Curriculum", schema);
