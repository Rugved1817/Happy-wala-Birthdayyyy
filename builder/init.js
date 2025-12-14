const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

// Log environment variables for debugging (without sensitive data)
console.log("=== Build Environment Check ===");
console.log("NAME:", process.env.NAME ? "✓ Set" : "✗ Missing");
console.log("PIC:", process.env.PIC ? "✓ Set" : "✗ Missing");
console.log("SCROLL_MSG:", process.env.SCROLL_MSG ? "✓ Set" : "✗ Not set (optional)");
console.log("HBD_MSG:", process.env.HBD_MSG ? "✓ Set" : "✗ Not set (optional)");
console.log("NICKNAME:", process.env.NICKNAME ? "✓ Set" : "✗ Not set (optional)");
console.log("================================");

if (!process.env.NAME) {
  console.error("ERROR: NAME environment variable is required but not set!");
  console.error("Please set NAME in Netlify: Site settings → Environment variables");
  process.exit(1);
}

if (!process.env.PIC) {
  console.error("ERROR: PIC environment variable is required but not set!");
  console.error("Please set PIC in Netlify: Site settings → Environment variables");
  console.error("PIC should be a valid URL to an image (e.g., https://telegra.ph/file/...)");
  process.exit(1);
}

const picPath = process.env.PIC;
const msgPath = process.env.SCROLL_MSG;

//Local initialization
const setLocalData = async () => {
  try {
    const pic = path.join(__dirname, "../local/", picPath);
    let markup = "";
    if (msgPath) {
      const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
        encoding: "utf-8",
      });
      markup = generateMarkupLocal(text);
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

//Remote initialization
const setRemoteData = async () => {
  try {
    console.log("\n=== Starting Remote Initialization ===");
    
    // Validate PIC URL before attempting fetch
    if (!picPath || typeof picPath !== 'string') {
      throw new Error("PIC environment variable is not set or invalid");
    }
    
    // Check if URL is localhost/local - this won't work on Netlify
    const lowerPath = picPath.toLowerCase();
    if (lowerPath.includes('localhost') || 
        lowerPath.includes('127.0.0.1') || 
        lowerPath.includes('::1') ||
        lowerPath.startsWith('file://') ||
        !lowerPath.startsWith('http://') && !lowerPath.startsWith('https://')) {
      console.error("\n❌ ERROR: Invalid PIC URL detected!");
      console.error("PIC value:", picPath);
      console.error("\nThe PIC URL must be a publicly accessible HTTP/HTTPS URL.");
      console.error("Localhost, file://, or relative paths will NOT work on Netlify.");
      console.error("\nTo fix this:");
      console.error("1. Upload your image to https://telegra.ph");
      console.error("2. Right-click the uploaded image → Copy image address");
      console.error("3. Use that URL (should start with https://telegra.ph/file/...)");
      console.error("4. Set it as the PIC environment variable in Netlify dashboard");
      throw new Error(`PIC URL is not publicly accessible. It appears to be a local path: ${picPath}. Please use a public URL (e.g., from telegra.ph).`);
    }
    
    console.log("Fetching image from:", picPath);
    console.log("URL validation: ✓ (publicly accessible)");
    
    let res;
    try {
      res = await axios.get(picPath, {
        responseType: "arraybuffer",
        timeout: 30000, // 30 second timeout
        validateStatus: function (status) {
          return status >= 200 && status < 300;
        }
      });
    } catch (axiosError) {
      console.error("\n❌ Failed to fetch image from URL:", picPath);
      console.error("Error details:", {
        message: axiosError.message,
        code: axiosError.code,
        response: axiosError.response ? {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText
        } : "No response"
      });
      console.error("\nTroubleshooting:");
      console.error("1. Verify the URL is correct and accessible (try opening it in a browser)");
      console.error("2. Make sure the URL uses HTTPS (not HTTP)");
      console.error("3. Ensure the image is publicly accessible (not behind authentication)");
      throw new Error(`Failed to fetch image: ${axiosError.message}. Please verify the PIC URL is correct and publicly accessible.`);
    }
    
    const pic = res.data;
    console.log("✓ Image fetched successfully (", res.data.length, "bytes)");
    
    let markup = "";
    if (msgPath) {
      console.log("Fetching scroll message from:", msgPath);
      try {
        const article = msgPath.split("/").pop();
        const apiUrl = `https://api.telegra.ph/getPage/${article}?return_content=true`;
        console.log("Telegraph API URL:", apiUrl);
        
        res = await axios.get(apiUrl, { timeout: 30000 });
        const { content } = res.data.result;
        markup = content.reduce(
          (string, node) => string + generateMarkupRemote(node),
          ""
        );
        console.log("✓ Scroll message fetched successfully");
      } catch (msgError) {
        console.error("Failed to fetch scroll message:", msgError.message);
        console.error("This is optional - continuing without scroll message");
        // Don't fail the build if scroll message fails
      }
    } else {
      console.log("No SCROLL_MSG set - skipping scroll message");
    }
    
    console.log("Processing image with Sharp...");
    await setPic(pic);
    console.log("✓ Image processed successfully");
    
    console.log("Generating index.html...");
    genIndex(markup);
    console.log("✓ Index generated successfully");
    
    console.log("\n=== Build Initialization Complete! ===");
  } catch (e) {
    console.error("\n=== BUILD FAILED ===");
    console.error("Error in remote initialization");
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    console.error("\nEnvironment variables at time of error:");
    console.error({
      NAME: process.env.NAME ? "✓ Set" : "✗ Missing",
      PIC: process.env.PIC ? `✓ Set (${process.env.PIC.substring(0, 50)}...)` : "✗ Missing",
      SCROLL_MSG: process.env.SCROLL_MSG ? `✓ Set (${process.env.SCROLL_MSG.substring(0, 50)}...)` : "✗ Not set",
      HBD_MSG: process.env.HBD_MSG ? "✓ Set" : "✗ Not set",
      NICKNAME: process.env.NICKNAME ? "✓ Set" : "✗ Not set"
    });
    console.error("\nTroubleshooting:");
    console.error("1. Verify all environment variables are set in Netlify dashboard");
    console.error("2. Check that PIC URL is valid and accessible");
    console.error("3. If using SCROLL_MSG, verify the telegra.ph article URL is correct");
    console.error("========================\n");
    process.exit(1);
  }
};

if (process.argv[2] === "--local") {
  setLocalData().catch((e) => {
    console.error("Local initialization failed:", e.message);
    console.error(e.stack);
    process.exit(1);
  });
} else if (process.argv[2] === "--remote") {
  setRemoteData().catch((e) => {
    // Error already logged in setRemoteData
    process.exit(1);
  });
} else {
  console.error("ERROR: Fetch mode not specified.");
  console.error("Usage: node builder/init.js --local OR --remote");
  process.exit(1);
}
