const mongoose = require("mongoose");

const ApplySchema = mongoose.Schema({
  // this is model schema
  Position: {
    type: String,
    required: true,
  },
  JobTitle: {
    type: String,
    default: "",
  },
  BaseSalary: {
    type: Number,
  },
  JobDescription: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
});

exports.Apply = mongoose.model("Apply", ApplySchema); //model
