/**
 * processing data
 * --------implemented function--------
 * *******************
 * @author movindu lochana
 * @copyright Point Breakers
 *
 */

const mongoose = require("mongoose");
const sellerModel = mongoose.model("Seller");
const stockModel = mongoose.model("Stock");

function getNearShops(longitude, latitude, maxDist) {

  return new Promise(async (resolve, reject) => {
    const data = await sellerModel.aggregate().near({
      near: [parseFloat(longitude), parseFloat(latitude)],
      maxDistance: parseFloat(maxDist),
      spherical: true,
      distanceField: "dist.calculated",
    });

    if (!data) return reject("Not Found");

    const returnData = data.map((e) => {
      return  {
            shopOwner: e.name,
            shopName: e.shopName,
            coordinates: e.location.coordinates,
          };
    });

    resolve(returnData);
  });
}

function getNearShopsMeth2(longitude, latitude, maxDist, inner) {
  return new Promise(async (resolve, reject) => {
    const option_02 = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDist * 1609.34, //miles to meter
        },
      },
    };


    sellerModel
      .find(option_02)
      .then((data) => resolve(data))
      .catch((err) => reject(err));

  });
}


function optimalSearch(
  userId,
  searchTags,
  longitude,
  latitude,
  maxDist,
  numOfResults
) {
  return new Promise(async (resolve, reject) => {

    const data = await sellerModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], maxDist / (3963.2 * 1.60934)],
        },
      },
    }).populate({path : "stocks", select: "searchTags"});

    if (!data) return reject("error");

    //const re = data.map(e => e.stocks);

    searchTags = ["item", "biscults"];
    let locations = []
    searchTags.map((e) => {
      if(e.stocks === ""){
        locations.push(e.location)
      }
    })

    console.log(re.search);
    resolve(locations);
  });
}



function findAllStocks() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await stockModel.find();

      resolve(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function addStocks(
  stockName,
  stockOwner,
  stockPrice,
  stockDiscription,
  stockImageURL,
  searchTags,
  catagory
) {
  return new Promise(async (resolve, reject) => {

    
    sellerModel.findById(
      {_id: stockOwner},{useFindAndModify: false}
    ).exec().then(seller => {

      const newStock = new stockModel({
        stockName,
        stockOwner: mongoose.Types.ObjectId(stockOwner),
        stockPrice,
        stockDiscription,
        stockImageURL,
        searchTags,
        catagory
      });

      stockModel.validate(newStock).then(async () => {
        const msg = await newStock.save();

        if(!msg) return reject("saving failed");

        await seller.stocks.push(newStock._id);

        seller.save().then((sellerDoc) => {
          resolve(sellerDoc);
        }).catch(err => reject(err))

        //resolve(doneMsg);

      }).catch(err => reject(err))
    }).catch(err => reject(err));
});
}

function getStocks(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await (id
        ? stockModel.findOne({ _id: id })
        : stockModel.find());
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}

function deleteStocks(id) {
  return new Promise((resolve, reject) => {
    stockModel.findByIdAndRemove(id).then((doc) => {
      resolve(data);
    });
  });
}

module.exports = {
  getNearShops,
  findAllStocks,
  addStocks,
  getStocks,
  deleteStocks,
  getNearShopsMeth2,
  optimalSearch,
};
