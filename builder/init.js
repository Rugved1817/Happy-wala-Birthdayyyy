const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

// All values are hardcoded - no .env file needed
console.log("=== Build Environment Check ===");
console.log("NAME: ✓ Hardcoded (Jiya)");
console.log("PIC: ✓ Hardcoded in CSS");
console.log("SCROLL_MSG: ✓ Hardcoded in template");
console.log("HBD_MSG: ✓ Hardcoded in template");
console.log("NICKNAME: ✓ Hardcoded (Ritwika)");
console.log("================================");

//Local initialization
const setLocalData = async () => {
  try {
    // Photo is hardcoded in CSS - no processing needed
    console.log("Photo is hardcoded in CSS - skipping image processing");
    
    // Local builds can use local scroll message file if needed
    let markup = "";
    const msgPath = process.env.SCROLL_MSG;
    if (msgPath) {
      try {
        const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
          encoding: "utf-8",
        });
        markup = generateMarkupLocal(text);
      } catch (e) {
        console.log("No local scroll message file found - continuing without it");
      }
    }
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

//Remote initialization
const setRemoteData = async () => {
  try {
    console.log("\n=== Starting Remote Initialization ===");
    console.log("All values are hardcoded - no environment variables needed");
    console.log("Photo is hardcoded in CSS - no image processing needed");
    
    console.log("Generating index.html...");
    genIndex(""); // Empty markup - scroll message is hardcoded in template
    console.log("✓ Index generated successfully");
    
    console.log("\n=== Build Initialization Complete! ===");
    console.log("All content is hardcoded - no .env file needed!");
  } catch (e) {
    console.error("\n=== BUILD FAILED ===");
    console.error("Error in remote initialization");
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    console.error("\nTroubleshooting:");
    console.error("All values are hardcoded - check template.html and config.js");
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
