const path = require("path");
const { insertIntoNamespace } = require("./insertIntoNamespace");

// Script start
const [selectorName] = process.argv.slice(2);

if (!selectorName) {
  console.log("[Error] Please specify the name of your selector.");
  process.exit(1);
}

const fileContents = `
import {TStore} from "../store";

export const ${selectorName} = (s: TStore) => {};
`;

const namespaceImportLine = `import {${selectorName}} from "./storeSelectors/${selectorName}"`;

insertIntoNamespace(
  selectorName,
  path.resolve("./src/store/storeSelectors/" + selectorName + ".ts"),
  fileContents,
  "StoreSelector",
  path.resolve("./src/store/StoreSelector.ts"),
  namespaceImportLine
)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
