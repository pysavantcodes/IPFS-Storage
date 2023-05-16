require("dotenv").config();
const { NFTStorage, File } = require("nft.storage");
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

  const metadata = await nftStorage.store({
    name: name,
    description: mimetype,
    image: new File([data.toString("utf8")], name, { mimetype }),
  });

  await fetch(`https://ipfs.io/ipfs/${metadata.ipnft}/metadata.json`)
    .then(async (response) => {
      return response.json();
    })
    .then(async (data) => {
      const url = `https://${
        data.image.split("ipfs://")[1].split("/")[0]
      }.ipfs.dweb.link/${data.image.split("ipfs://")[1].split("/")[1]}`;
      res.json(url);
    });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
