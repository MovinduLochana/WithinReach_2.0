/**
 * Controller for user
 * Router for server
 * *******************
 * @author movindu lochana
 * @copyright Point Breakers
 * @async functions
 */

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { auth } = require("../Validation/Authorization");
const { getNearShops, optimalSearch } = require("../Controller/proccessControl");
const userModel = mongoose.model("User");
const {AuthenticationUserSignUp,AuthenticationLogin} = require("../Validation/Authentication");
const { generateUploadURL } = require("../AWS/Upload_S3");

router.post("/signin", async (req, res) => {

  const { filter, identity, userPassword } = req.body;

  try {
    AuthenticationLogin(filter, identity, userPassword, userModel)
      .then((msg) => {
       // console.log("here " + msg);
        res.json(msg);
      })
      .catch((err) => {
        console.log("error : " + err);
        res.send(err);
      });
  } catch (error) {
    res.send(err);
  }
});


//add auth
router.get("/list",async (req, res) => {

  // console.log("search stared");
  try {
    const userDataAll = await userModel.find();
    res.json(userDataAll);
  } catch (err) {
    res.send("Error XY " + err);
  }
});


router.get("/list/:id", auth, async (req, res) => {
  try {

    const userDataById = await userModel.findById(req.params.id);
    res.json(userDataById);

  } catch (err) {

    res.status(404).send("Id Not found");
    res.send("Error " + err);
  }
});


//add auth
router.post("/signup", async (req, res) => {

  try {
    const { name, email, mobile, password, address, photoURL } = req.body && req.body;

    if (!(name && email && mobile && password && address && photoURL))
      return res.sendStatus(400);

    AuthenticationUserSignUp(userModel, name, email, mobile, password,address,photoURL)
      .then((msg) => {
        res.send(msg);
      })
      .catch((err) => {
        res.status(406).send(err);
      });

    // res.send("done saving new user");
  } catch (err) {
    res.status(400).send("Invalid");
  }
});

router.patch("/list/:id", auth, async (req, res) => {

  try {
    //const userData = await userModel.findById(req.params.id)
    // userData.sub = req.body.sub

    const msg = await userModel.findOneAndUpdate({
        _id: req.params.id,
      },
      req.body,{
        new: true,
      }
    );
    
    //const a1 = await userData.save()
    res.json(msg);

  } catch (err) {
    res.status(404).send("Id Not found");
    res.send(err);
  }
});

router.delete("/list/:id", auth, async (req, res) => {

  try {

    const msg = await userModel.findByIdAndRemove(req.params.id);
    res.json(msg);

  } 
  catch (error) {

    res.status(404).send("Id Not found");
    res.send(error);
  }
});


//add auth here
router.get("/find", async (req, res) => {

  const { longitude, latitude, maxDist } = req.query;

  try {

    getNearShops(longitude, latitude, maxDist)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });

  } 
  catch (error) {
    res.send(error);
  }
});

router.post("/search", (req, res) => {
  try{
    const {userId, searchTags } = req.body;
    const {longitude, latitude, maxDist, numOfResults} = req.query;

    if(!(userId && searchTags && longitude && latitude && maxDist  && numOfResults)) return res.send("bad Data");
    optimalSearch(userId, searchTags, longitude, latitude, maxDist, numOfResults).then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });

   // if(userId !== req.user.id) return res.send("you have no access");
  }
  catch(err) {
    res.send(err)
  }

});

router.get("/imageURL", (req, res) => {
  try {

    const url = await generateUploadURL();
    res.send({ url });

    const updateProfileImage = userModel.findById(req.user.id)
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
