const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    feedbackID: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    currVerID: {
      type: String,
      required: true,
    },
    feedbackMessage: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Feedback", schema);
