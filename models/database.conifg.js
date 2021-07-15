
/**
 * Database connection
 * Handle database
 * *******************
 * @author movindu lochana
 * @copyright Point Breakers
 * 
 */
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('succefilly connected');
}).catch(err =>{
    console.log('didnlt coneect to db "Check your Internet Connection" ', err);
});

require("../models/userModel");
require("../models/sellerModel");
require("../models/stocksModel");


