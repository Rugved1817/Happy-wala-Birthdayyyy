const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const setPic = async function (pic) {
  try {
    // Ensure src directory exists
    const srcDir = path.join(__dirname, "../src");
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }
    
    console.log("Processing image with Sharp...");
    await sharp(pic)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(srcDir, "pic.jpeg"));
    console.log("IMAGE Downloaded successfully!!!");
  } catch (error) {
    console.error("Error processing image:", error.message);
    throw error;
  }
};

module.exports = setPic;
