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
console.log("PIC:", "✓ Hardcoded in CSS (not needed for remote builds)");
console.log("SCROLL_MSG:", process.env.SCROLL_MSG ? "✓ Set" : "✗ Not set (optional)");
console.log("HBD_MSG:", process.env.HBD_MSG ? "✓ Set" : "✗ Not set (optional)");
console.log("NICKNAME:", process.env.NICKNAME ? "✓ Set" : "✗ Not set (optional)");
console.log("================================");

if (!process.env.NAME) {
  console.error("ERROR: NAME environment variable is required but not set!");
  console.error("Please set NAME in Netlify: Site settings → Environment variables");
  process.exit(1);
}

const msgPath = process.env.SCROLL_MSG;

//Local initialization
const setLocalData = async () => {
  try {
    // For local builds, use PIC from env var or default to local file
    const picFileName = process.env.PIC || "sample-pic.jpeg";
    const pic = path.join(__dirname, "../local/", picFileName);
    
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
    console.log("Note: Photo URL is hardcoded in CSS - skipping photo fetch/processing");
    
    let markup = "";
    if (msgPath) {
      console.log("Fetching scroll message from:", msgPath);
      
      // Check if SCROLL_MSG is a URL or local file path
      const lowerMsg = msgPath.toLowerCase();
      if (lowerMsg.startsWith('http://') || lowerMsg.startsWith('https://')) {
        // It's a URL (telegra.ph article)
        try {
          const article = msgPath.split("/").pop();
          const apiUrl = `https://api.telegra.ph/getPage/${article}?return_content=true`;
          console.log("Telegraph API URL:", apiUrl);
          
          const res = await axios.get(apiUrl, { timeout: 30000 });
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
        // It's a local file path - skip for remote builds
        console.log("SCROLL_MSG appears to be a local file path - skipping (use telegra.ph URL for remote builds)");
      }
    } else {
      console.log("No SCROLL_MSG set - skipping scroll message");
    }
    
    // Photo is hardcoded in CSS, so we don't need to fetch/process it
    // Create a placeholder pic.jpeg file to avoid build errors (if needed)
    const picPath = path.join(__dirname, "../src/pic.jpeg");
    if (!fs.existsSync(picPath)) {
      console.log("Creating placeholder pic.jpeg (photo is loaded from CSS)");
      // Create a minimal placeholder if file doesn't exist
      fs.writeFileSync(picPath, "");
    }
    
    console.log("Generating index.html...");
    genIndex(markup);
    console.log("✓ Index generated successfully");
    
    console.log("\n=== Build Initialization Complete! ===");
    console.log("Note: Photo loads directly from GitHub (hardcoded in CSS)");
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
    console.error("1. Verify NAME environment variable is set in Netlify dashboard");
    console.error("2. If using SCROLL_MSG, verify the telegra.ph article URL is correct");
    console.error("3. Note: Photo is hardcoded in CSS - no PIC variable needed");
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
