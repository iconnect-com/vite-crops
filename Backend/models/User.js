const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please add your Fullname"],
  },
  email: {
    type: String,
    required: [true, "Please add Email"],
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },

  role: {
    type: String,
    enum: ["Admin", "User", "SuperAdmin"],
    default: "User",
  },
  date_of_birth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  loginAttempts: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  alert:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commodity",
  }
});
//Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.path("phone").validate(function (value) {
  console.log(value);
});

//match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      fullname: this.fullname,
      email: this.email,
      phone: this.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};
//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
