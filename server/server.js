require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const transactionRoutes = require("./router/transactionRoutes");

const connectDb = require("./utils/db");
const { router } = require("server");
 const errorMiddleware = require("./middlewares/error-middleware");

//let's tackle cors
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  Credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
//? Mount the Router: To use the   router in your main Express app, you can "mount" it at a specific URL prefix.

// Routes
app.use("/api", transactionRoutes);

 app.use(errorMiddleware);

const PORT = 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}🚀`);
  });
});

module.exports = router;
