require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./api");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/api", router);

// Setup your Middleware and API Router here



module.exports = app;
