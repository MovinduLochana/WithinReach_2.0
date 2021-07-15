/**
 * Main server backend
 * server connection
 * *******************
 * @author movindu lochana
 * @copyright Point Breakers
 * 
 */

require("./models/database.conifg");
const express = require("express");
const userController = require("./Controller/userControl");
const sellerController = require("./Controller/sellerControl");
const { authRouter } = require("./Validation/Authorization");

const app = express();

app.use(express.json());

app.use("/api", authRouter);
app.use("/api/user", userController);
app.use("/api/seller", sellerController);

const port = process.env.PORT || 9090;
const host = "ec2-18-220-6-66.us-east-2.compute.amazonaws.com" ||

app.listen(port, host, () => {
    console.log(`Server listening on port:${port}`);
});
