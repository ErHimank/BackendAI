const mongoose = require("mongoose");

const JdSchema = mongoose.Schema({
  // this is model schema
  Position: {
    type: String,
    required: true,
  },
  BriefDescription: {
    type: String,
    default: "",
  },
  JobLocation: {
    type: String,
    required: true,
  },
  JobTitle: {
    type: String,
    default: "",
  },
  JobDescription: {
    type: String,
    required: true,
  },
  RoleType: {
    type: String,
    default: "",
  },
  RoleDescription: {
    type: String,
  },
  BaseSalary: {
    type: Number,
  },
  OTE: {
    type: Number,
    default: 0,
  },
  WorkExperience: {
    type: Number,
    default: 0,
  },
  AgeLimit: {
    type: Number,
    required: true,
  },

  GraduationYear: {
    type: Number,
    required: true,
  },
  HighestQualification: {
    type: String,
    default: "",
  },
  UploadJd: {
    type: String,
    default: "",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
});

exports.Jd = mongoose.model("Jd", JdSchema); //model
// exports.JdSchema = JdSchema;
