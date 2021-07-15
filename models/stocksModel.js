const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var stockSchema = new mongoose.Schema({
    stockName:{
        type:String,
        required:true,
    },
    stockOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Seller",
        required:true
    },
    stockPrice:{
        type: Number,
        required:true,
    },
    stockDiscription:{
        type:String,
        required:true,
        maxlength:[50, 'whoah {VALUE} is too long']
    },
    stockImageURL:{
        type:String,
        required:true,
    },
    rating: {
        type:Number,
        enum :{
            values : [1, 2, 3, 4, 5],
            message : "{VALUE} not allowed",
            default : 1
        }
    },
    searchTags : [{
        type:String,
        maxlength: [20, "{VALUE} is too long"],
        required: true
    }],  
    catagory : {
        type:String,
        required:true,
        enum: { 
            values: ['Groccery', 'Pharmacy', 'BabyItems','Foods', 'stationary',' ', 'Other'],
            message: '{VALUE} is not a catagory you shou put this into other' 
        }
    }
});

/*
Books.find(
    { "authors": { "$regex": "Alex", "$options": "i" } },
    function(err,docs) { 
    } 
);
You can also do this:

Books.find(
    { "authors": /Alex/i }, 
    function(err,docs) { 

    }
);

-------------------------------------------------------------------

Books.aggregate(
    [
        // Match first to reduce documents to those where the array contains the match
        { "$match": {
            "authors": { "$regex": "Alex", "$options": i }
        }},

        // Unwind to "de-normalize" the document per array element
        { "$unwind": "$authors" },

        // Now filter those document for the elements that match
        { "$match": {
            "authors": { "$regex": "Alex", "$options": i }
        }},

        // Group back as an array with only the matching elements
        { "$group": {
            "_id": "$_id",
            "title": { "$first": "$title" },
            "authors": { "$push": "$authors" },
            "subjects": { "$first": "$subjects" }
        }}
    ],
    function(err,results) {

    }
)
*/
//Export the model
module.exports = mongoose.model('Stock', stockSchema);