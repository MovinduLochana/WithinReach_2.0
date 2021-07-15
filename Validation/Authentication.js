const { tokenGenerate } = require("./Authorization");

async function AuthenticationLogin(filter, identity, password, model) {
  return new Promise(async (resolve, reject) => {
    const newLogin = await (filter == "name"
      ? model.findOne({
          name: identity,
        })
      : model.findOne({
          email: identity,
        }));

    if (!newLogin) return reject("Not Found");

    if (await newLogin.comparePassword(password)) {
      const returnData = [
        {
          tokens: JSON.parse(tokenGenerate(newLogin.name, newLogin.password)),
        },
        {
          id: newLogin._id,
        },
      ];
      resolve(returnData);
    }
    reject("Invalid Password");
  });
}

async function AuthenticationUserSignUp(
  userModel,
  name,
  email,
  mobile,
  password,
  address,
  photoURL
) {
  //implement a method to check if user  already exsits before signUp
  return new Promise(async (resolve, reject) => {
    const newUser = new userModel({
      name: name,
      email: email,
      mobile: mobile,
      password: password,
      address: address,
      photoURL: photoURL,
    });

   userModel
      .validate(newUser)
      .then(() => {
        newUser
          .save()
          .then((msg) => resolve(msg))
          .catch((err) => reject(err));
      })
      .catch((err) => {
        reject("error" + err);
        console.log(err);
      });
  });
}

function AuthenticationSellerSignUp(
  sellerModel,
  name,
  email,
  mobile,
  password,
  photoURL,
  shopName,
  city,
  location
) {
  //implement a method to check if user  already exsits before signUp
  return new Promise((resolve, reject) => {
    const newSeller = new sellerModel({
      name: name,
      email: email,
      mobile: mobile,
      password: password,
      photoURL: photoURL,
      shopName: shopName,
      city: city,
      location: location,
    });

    sellerModel
      .validate(newSeller)
      .then(() => {
        newSeller
          .save()
          .then((msg) => resolve(msg))
          .catch((err) => reject(err));
      })
      .catch((err) => {
        reject("error");
        console.log(err);
      });
  });
}

function verify(name, password, model) {
  return new Promise(async (resolve, reject) => {
    const thisUser = await model.findOne({
      name: name,
    });

    if (!thisUser) return reject("not a user");
    if (thisUser.password !== password) return resolve("you have no access");
  });
}

module.exports = {
  AuthenticationLogin,
  AuthenticationUserSignUp,
  AuthenticationSellerSignUp,
  verify,
};
