const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const errorHandleMiddleware = require("./v1/middlewares/error_handle_middleware");
const initialRouter = require("./v1/routes");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const {
  OPTION_CORS,
  optionsCompression,
  sessionMiddleware,
} = require("./v1/utils/options");
const multer = require("multer");
const { storage } = require("./v1/utils/functions");
const { initialSocketIo } = require("./v1/socket.io");
const upload = multer({ storage: storage });

// init db mongo
require("./v1/databases/init.mongodb");

app.use(express.static(__dirname + "/assets/upload"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("dev"));
app.use(cors(OPTION_CORS));
app.use(express.json());
app.use(compression(optionsCompression(compression)));
sessionMiddleware(app);
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(upload.array("files"));

app.post("/api/v1/upload/image", (req, res, next) => {
  if (!req.files) {
    return next({
      message: "Không tìm thấy file ảnh",
      status: 400,
    });
  }

  if (req.files && req.files.length > 0) {
    res.json(req.files[0]);
  }
});

// * router
initialRouter(app);

// * error handle middleware
errorHandleMiddleware(app);

const httpServer = initialSocketIo(app);

module.exports = httpServer;
