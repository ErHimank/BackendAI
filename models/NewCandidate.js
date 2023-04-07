const mongoose = require("mongoose");

const NewCandidateSchema = mongoose.Schema({
  // this is model schema
  FullName: {
    type: String,
    required: true,
  },
  JobLocation: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    default: "",
  },
  Country: {
    type: String,
    default: "",
  },
  JobTitle: {
    type: String,
  },
  CompanyName: {
    type: String,
    default: 0,
  },
  LinkedinLink: {
    type: String,
    default: "",
  },
  FacebookLink: {
    type: String,
  },

  PersonalEmail: {
    type: String,
    required: true,
  },
  ProfessionalEmail: {
    type: String,
    default: "",
  },
  PersonalPhoneNumber: {
    type: String,
    default: "",
  },
  HighestQualification: {
    type: String,
    required: true,
  },

  GraduationYear: {
    type: Number,
    required: true,
  },
  Salary: {
    type: Number,
    default: 0,
  },
  JobDescription: {
    type: String,
    default: "",
  },
  ResumeUpload: {
    type: String,
    default: "",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
});

exports.NewCandidate = mongoose.model("NewCandidate", NewCandidateSchema); //model
// exports.JdSchema = JdSchema;
