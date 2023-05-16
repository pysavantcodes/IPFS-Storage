require("dotenv").config();
const { NFTStorage, File } = require("nft.storage");
const formidable = require("formidable");
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");
app.use(cors({ origin: "*", methods: "GET, PUT" }));

const nftStorage = new NFTStorage({
  token: process.env.IPFS_GATEWAY_TOKEN,
});

app.get("/", (req, res) => {
  res.send("Welcome to Pysavant Unlimited Storage");
});

app.post("/upload", async (req, res, next) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, files) => {
    if (err) {
      next(err);
      return;
    }

    const { originalFilename, mimetype, filepath } = files.image;
    const data = await fs.promises.readFile(filepath);

    const metadata = await nftStorage.store({
      name: originalFilename,
      description: mimetype,
      image: new File([data], originalFilename, { mimetype }),
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
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
