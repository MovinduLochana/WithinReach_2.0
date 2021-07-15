const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const sellerModel = mongoose.mongo.model("Seller");

function uploadProfilePicture(data, image) {
    
}

function uploadSellerStockImages(data, image) {

}

module.exports = {
    uploadProfilePicture,
    uploadSellerStockImages
}

