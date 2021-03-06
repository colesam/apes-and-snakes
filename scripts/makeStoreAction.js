const path = require("path");
const { insertIntoNamespace } = require("./insertIntoNamespace");

// Script start
const [name] = process.argv.slice(2);

if (!name) {
  console.log("[Error] Please specify the name of your selector.");
  process.exit(1);
}

const fileContents = `
import {TStore} from "../store";

export const ${name} = (s: TStore) => {};
`;

const namespaceImportLine = `import {${name}} from "./storeActions/${name}"`;

insertIntoNamespace(
  name,
  path.resolve("./src/store/storeActions/" + name + ".ts"),
  fileContents,
  "StoreAction",
  path.resolve("./src/store/StoreAction.ts"),
  namespaceImportLine
)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
