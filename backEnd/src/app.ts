import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as mongo from "connect-mongo";
import * as path from "path";
import * as mongoose from "mongoose";
import * as expressValidator from "express-validator";
import * as bluebird from "bluebird";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// Controllers (route handlers)
import * as apiController from "./controllers/api";
import * as homeController from "./controllers/home";
import * as glassesController from "./controllers/glasses";

// Create Express server
const app = express();

// Connect to MongoLAB
const mongoUrl = process.env.MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  process.exit();
});

// Express configuration
app.set("port", process.env.HTTP_PORT || 80);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.post("/glasses/saveGlasses", glassesController.saveGlasses);
app.get("/glasses/downloadHTML", glassesController.downloadHTML);
app.get("/glasses/gallery", glassesController.gallery);
app.get("/api", apiController.getApi);

app.get("*", homeController.index);
/**
 * API examples routes.
 */


module.exports = app;