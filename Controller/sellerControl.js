
/**
 * Database rules
 * userSchema for mongodb
 * *******************
 * @author movindu lochana
 * @copyright Point Breakers
 * 
 */

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { auth } = require("../Validation/Authorization");
const { AuthenticationSellerSignUp, AuthenticationLogin, verify } = require("../Validation/Authentication");
const sellerModel = mongoose.model("Seller");
const { addStocks, getStocks, deleteStocks } = require("../Controller/proccessControl");

router.post("/signin", async (req, res) => {
   const {filter, identity, sellerPassword } = req.body;

   try {
     AuthenticationLogin(filter, identity, sellerPassword, sellerModel).then((msg) => {
      //console.log("here " + msg);
      res.json(msg);
     }).catch((err) => {
       console.log("error " + err);
       res.send(err);
     })

   } catch (error) {
     res.status(400).send(error);
   }
});
//add auth here
router.get("/list", async (req, res) => {
  try {
    const sellerDataAll = await sellerModel.find();
    res.json(sellerDataAll);
  } catch (err) {
    res.send("Error XY " + err);
  }
});

router.get("/list/:id", async (req, res) => {

  try {
    const sellerDataById = await sellerModel.findById(req.params.id);
    res.json(sellerDataById);
  } catch (err) {
    res.status(404).send("Id Not found");
    res.send("Error " + err);
  }
});
//add auth here
router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, password, photoURL, shopName, city, location } = req.body;

    if(!(name &&  email && mobile && password && photoURL && shopName && city && location)) return res.sendStatus(400);

    AuthenticationSellerSignUp(sellerModel,name, email, mobile, password, photoURL, shopName, city, location)
      .then((msg) => {
        res.send(msg);
      })
      .catch((err) => {
        res.status(406).send(err);
      });

  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/list/:id",auth, async (req, res) => {
  try {

    const msg = await sellerModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    );

    res.json(msg);
  } catch (err) {
    res.status(404).send("Id Not found");
    res.send(err);
  }
});

//add auth here
router.delete("/list/:id",auth, async (req, res) => {
  try {
    const msg = await sellerModel.findByIdAndRemove(req.params.id);
    res.json(msg);
  } catch (error) {
    res.status(404).send("Id Not found");
    res.send(error);
  }
});

router.post("/addstock", async (req, res) => {

  const {stockName, stockOwner, stockPrice, stockDiscription, stockImageURL, searchTags, catagory} = req.body;
  try {
    const msg = await addStocks(stockName, stockOwner, stockPrice, stockDiscription, stockImageURL, searchTags, catagory);
    res.send(msg);
  } catch (error) {
    console.log(error)
  }
});

router.get("/getStock", async (req, res) => {

  try{
    const stock = await getStocks();

    res.send(stock);
  }
  catch(err){
    res.send(err);
  }
})

router.get("/getStock/:id", async (req, res) => {

  try{
    const stock = await getStocks(req.params.id);

    res.send(stock);
  }
  catch(err){
    res.send(err);
  }
})



router.get("/stocks/:sellerId", async (req, res) => {

   const {sellerId} = req.params;
  try{

     const seller = await sellerModel.findOne({ _id: sellerId})

    console.log([seller.stocks])


    res.send(seller);
  } catch(err) {
    res.send(err);
  }
})


module.exports = router;
