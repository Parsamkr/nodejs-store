const express = require("express");
const path = require("path");
const { AllRoutes } = require("./router/router");
const morgan = require("morgan");
const createError = require("http-errors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");

module.exports = class Application {
  #app = express();
  #PORT;
  #DB_URI;

  constructor(PORT, DB_URI) {
    this.#PORT = PORT;
    this.#DB_URI = DB_URI;
    this.initRedis();
    this.connectToMongoDB();
    this.configApplication();
    this.createServer();
    this.createRoutes();
    this.errorHandling();
  }

  configApplication() {
    this.#app.use(cors());
    this.#app.use(morgan("dev"));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
    this.#app.use(
      "/api-doc",
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJsDoc({
          swaggerDefinition: {
            info: {
              title: "Parsa Store",
              version: "1.0.0",
              description: "a nodejs online store",
              contact: { name: "Parsa", email: "parsamokhtarpour98@gmail.com" },
            },
            servers: [{ url: "http://localhost:5000" }],
          },
          apis: ["./app/router/**/*.js"],
        })
      )
    );
  }

  createServer() {
    const http = require("http");
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log("run on => http://localhost:" + this.#PORT);
    });
  }

  connectToMongoDB() {
    const { default: mongoose } = require("mongoose");
    mongoose.set("strictQuery", true);
    mongoose
      .connect(this.#DB_URI)
      .then(() => console.log("Successfully Connected to DB ..."))
      .catch((error) => {
        if (error) console.log(error.message);
      });
    mongoose.connection.on("disconnected", () => {
      console.log("mongoose disconnected from DB");
    });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("disconnected");
      process.exit(0);
    });
  }

  initRedis() {
    require("./utils/init_redis");
  }

  createRoutes() {
    this.#app.use(AllRoutes);
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("page doesn't exist"));
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error?.status || serverError.status;
      const message = error?.message || serverError.message;
      return res.status(statusCode).json({ errors: { statusCode, message } });
    });
  }
};