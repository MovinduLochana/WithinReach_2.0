/**
 * Database rules
 * userSchema for mongodb
 * *******************
 * @author movindu lochana
 * @copyright Point Breakers
 *
 */

const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [8, "{VALUE} is too short"],
    maxlength: [30,"{VALUE} is too loong"],
    required: true,
    unique: true,
  },
  email: {
    type: String,
    maxlength:[40,"this is too long"],
    unique: true,
    trim: true,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    minlength:[10, "{VALUE} is too short"]
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "{VALUE} is too short"],
    maxlength: [20,"{VALUE} is too long"],
  },
  photoURL: {
    type: String,
    default:"null"
  },
  address: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

userSchema.path("email").validate((val) => {
  // /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");

userSchema.path("name").validate((val) => {
  username = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
  return !username.test(val);
}, "Invalid username");

userSchema.pre("save", async function(next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);

    if(!hashedPassword) return next("error");

    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

//Export the models
module.exports = mongoose.model("User", userSchema);
