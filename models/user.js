const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  // this is model schema
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
 
});
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", UserSchema); //model
exports.UserSchema = UserSchema;