const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Constants
const SELECTOR_NAMESPACE_FILE = path.resolve("./src/store/StoreSelector.ts");
const SELECTOR_FN_FOLDER = path.resolve("./src/store/storeSelectors");

// Script start
const [selectorName] = process.argv.slice(2);

if (!selectorName) {
  console.log("[Error] Please specify the name of your selector.");
  process.exit(1);
}

const selectorFileName = selectorName + ".ts";
const selectorFilePath = SELECTOR_FN_FOLDER + "/" + selectorFileName;

// Create file
fs.writeFileSync(
  selectorFilePath,
  `
import {TStore} from "../store";

export const ${selectorName} = (s: TStore) => {};
`
);

// Append file to StoreSelector namespace
function insert(value, index, arr) {
  return [...arr.slice(0, index), value, ...arr.slice(index)];
}

let namespaceFileContents = fs
  .readFileSync(SELECTOR_NAMESPACE_FILE, "utf-8")
  .split("\n");

namespaceFileContents = insert(
  `import {${selectorName}} from "./storeSelectors/${selectorName}"`,
  namespaceFileContents.indexOf(""),
  namespaceFileContents
);

namespaceFileContents = insert(
  selectorName + ",",
  namespaceFileContents.indexOf("export const StoreSelector = {") + 1,
  namespaceFileContents
);

fs.writeFileSync(SELECTOR_NAMESPACE_FILE, namespaceFileContents.join("\n"));

exec(
  `npm run lint:fix ${SELECTOR_NAMESPACE_FILE} && npm run prettier:fix`,
  () => {
    console.log(`[SUCCESS] Wrote new StoreSelector to ${selectorFileName}`);
    process.exit(0);
  }
);
