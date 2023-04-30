const session = require("express-session");
const MongoStore = require("connect-mongo");

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

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  // credentials: true,
  store: storeMongo,
  name: "sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: 1000 * 60 * 60 * 24 * 7,
  },
});

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

module.exports = {
  OPTION_CORS,
  optionsCompression,
  sessionMiddleware,
  wrap,
};
