const mongoose = require("mongoose");


//create geolocation schema
const geoLocationSchema = new mongoose.Schema({
  type : {
    type:String,
    default:"Point",
    enum: ["Point"]
  },
  coordinates: {
    type : [Number],
    index : "2dsphere",
    required: true
  }
})

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [8, "{VALUE} is too short"],
    maxlength: [30, "{VALUE} is too long"],
    required: "name is reqired",
    unique: true,
  },
  email: {
    type: String,
    maxlength: [40, "{VALUE} is too long"],
    unique: true,
    trim: true,
    required: "email is required",
  },
  mobile: {
    type: String,
    required: "mobile is required",
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "{VALUE} is too short"],
    maxlength: [16, "{VALUE} is too loog"],
    trim: true,
  },
  photoURL: {
    type: String,
    trim: true,
  },
  shopName: {
    type: String,
    required: "shopName is required",
  },
  city: {
    type: String,
    required: "city is required",
  },
  stocks : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Stock"
  }],
  location : {
    type: geoLocationSchema,
    required:true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

sellerSchema.path("email").validate((val) => {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");

// sellerSchema.path("name").validate((name) => {
//     nameRegx = /^[a-zA-Z0-9]+$/;
//     return nameRegx.test(name);
// }, "Invalid userName");

// sellerSchema.path("shopName").validate((shopName) => {
//     nameRegx = /^[a-zA-Z0-9]+$/;
//     return nameRegx.test(name);
// }, "Invalid userName");

module.exports = mongoose.model("Seller", sellerSchema);

/*
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], 
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
*/