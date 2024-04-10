const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Routes Files
const user = require("./routes/user");
const commodity = require("./routes/commodity");
const marketnews = require("./routes/market_news");
const configuration = require("./routes/configuration");
const weather = require("./routes/weather");
//load env vars
dotenv.config({ path: "./config/.env" });

//connect to database
connectDB();

const app = express();

//Boy Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//file uploads
app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// app.use(
//   helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
// );

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "*"],
        imgSrc: ["'self'", "data:", "*"],
        connectSrc: ["'self'", "*"],
        fontSrc: ["'self'", "*"],
      },
    },
  })
);

//Rate limiting
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 mins
  max: 300,
});
app.use(limiter);

//prevent http param pollution
app.use(hpp());

//enable CORS
app.use(cors());

//Mount Routers
app.use("/api/v1/auth/", user);
app.use("/api/v1/commodity/", commodity);
app.use("/api/v1/marketnews/", marketnews);
app.use("/api/v1/configuration/", configuration);
app.use("/api/v1/weather/", weather);
app.use(errorHandler);

//Set static folder
app.use(express.static(path.join(__dirname, "client/build")));

// app.use("*", function (req, res) {
//   res.status(404).json({ message: "route does not exist" });
// });

// Serving the front-end from here
// app.get("*", function (req, res) {
//   res.sendFile(
//     path.join(__dirname, "client/build", "index.html"),
//     function (err) {
//       if (err) {
//         res.status(500).send(err);
//       }
//     }
//   );
// });

// Serving the front-end from here
app.get("*", function (req, res, next) {
  if (
    !req.path.startsWith("/api/v1/") &&
    !req.path.endsWith(".js") &&
    !req.path.endsWith(".css")
  ) {
    res.sendFile(
      path.join(__dirname, "client/build", "index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  } else {
    next();
  }
});

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "public/index.html"), function (err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close Server & exit Process

  server.close(() => process.exit(1));
});
