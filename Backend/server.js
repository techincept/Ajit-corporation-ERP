const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDb = require("./DB.js");

const server = express();

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.send("<h1>Backend@Ajit Corporation ERP");
});

server.use("/api/ajit-corporation/v1/admin", require("./routes/admin.js"));
server.use("/api/ajit-corporation/v1/party", require("./routes/party.js"));
server.use(
  "/api/ajit-corporation/v1/cashbook",
  require("./routes/cashbook.js"),
);
server.use(
  "/api/ajit-corporation/v1/transaction",
  require("./routes/transaction.js"),
);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
  connectDb(process.env.DB_URL);
});
