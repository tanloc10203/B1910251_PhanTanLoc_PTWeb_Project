const session = require("express-session");
const MongoStore = require("connect-mongo");
const { Express } = require("express");

const OPTION_CORS = {
  origin: process.env.URL_CLIENT,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin",
  ],
};

const optionsCompression = (compression) => {
  return {
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }

      return compression.filter(req, res);
    },
  };
};

const storeMongo = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
});

/**
 *
 * @param {Express} app
 */
const sessionMiddleware = (app) => {
  let options = {
    secret: process.env.COOKIE_SECRET,
    // credentials: true,
    store: storeMongo,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3.154e10,
    },
  };

  if (app.get("env") === "production") {
    app.enable("trust proxy");
    options = {
      ...options,
      proxy: true,
      cookie: {
        ...options.cookie,
        secure: true,
        sameSite: "none",
      },
    };
  }

  return session(options);
};

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

module.exports = {
  OPTION_CORS,
  optionsCompression,
  sessionMiddleware,
  wrap,
};
