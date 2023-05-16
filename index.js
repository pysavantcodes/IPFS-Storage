require("dotenv").config();
const { NFTStorage, Blob } = require("nft.storage");
const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const fileUpload = require("express-fileupload");
app.use(cors({ origin: "*", methods: "GET, POST" }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const nftStorage = new NFTStorage({
  token: process.env.IPFS_GATEWAY_TOKEN,
});

app.get("/", (req, res) => {
  res.send("Welcome to Pysavant Unlimited Storage");
});

app.post("/upload", async (req, res, next) => {
  const file = req.files.image;

  const { name, mimetype, data } = file;

  const content = new Blob([data]);
  const cid = await nftStorage.storeBlob(content);

  res.json(`https://${cid}.ipfs.dweb.link`)
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
