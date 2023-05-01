const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// console.log("connect url => ", process.env.MONGO_URI);

//connect mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => console.log("Connected mongoose success!..."))
  .catch((err) => console.error(`Error: connect:::`, err));

// // all executed methods log output to console
// mongoose.set("debug", false);

// // disable colors in debug mode
// mongoose.set("debug", { color: false });

// // get mongodb-shell friendly output (ISODate)
// mongoose.set("debug", { shell: false });

module.exports = mongoose;
