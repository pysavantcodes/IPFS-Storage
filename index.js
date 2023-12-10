require("dotenv").config();
const { NFTStorage, Blob } = require("nft.storage");
const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 5000;

// Middleware
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
  try {
    const file = req.files.image;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { name, mimetype, data } = file;

    const content = new Blob([data]);
    const cid = await nftStorage.storeBlob(content);

    res.json(`https://${cid}.ipfs.w3s.link`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

if (!process.env.IPFS_GATEWAY_TOKEN) {
  console.error("IPFS_GATEWAY_TOKEN not found in environment variables");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
