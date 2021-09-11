const express = require("express");
const path = require("path");
const cors = require("cors");

async function startNodeService() {
  console.log("starting app");
  const app = express();
  app.use(express.json());
  app.use(cors());
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log("app set up");

  // host static files
  app.use(express.static(path.join(__dirname, "./images")));

  app.listen(4080, () => console.log(`App is running on 4080`));
}

startNodeService();
