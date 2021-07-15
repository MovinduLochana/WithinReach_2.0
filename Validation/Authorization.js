require("dotenv").config();
const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
}

let refreshTokens = [];

authRouter.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.send(err);

        const accessToken = generateAccessToken({
            name:user.name,
            password:user.password
        });

        res.json({ accessToken : accessToken});
    })
})

authRouter.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

function tokenGenerate(username, password) {
    const user = {
      name: username,
      password:password
    };
  
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  
    refreshTokens.push(refreshToken);
  
    return JSON.stringify({
      accessToken: accessToken,
      refrshToken: refreshToken,
    });
}
// authRouter.post("/login", (req, res) => {

//   const username = req.body.username;

//   const user = {
//     name: username,
//   };

//   const accessToken = generateAccessToken(user);
//   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

//   refreshTokens.push(refreshToken);

//   res.json({
//     accessToken: accessToken,
//     refrshToken: refreshToken,
//   });
// });

function auth (req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token , process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user

        next()
    });
}

// module.exports.rt = authRouter;
module.exports = {
    auth, authRouter, tokenGenerate
}




