const mongoose = require("mongoose");
const config = require("../config/config.json");

module.exports = () => {
  mongoose
    .connect(config.mongoDBCS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      console.log("mongoDB conneted!");
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
};
