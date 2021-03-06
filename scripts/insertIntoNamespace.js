const { exec } = require("child_process");
const fs = require("fs");

function insert(value, index, arr) {
  return [...arr.slice(0, index), value, ...arr.slice(index)];
}

function insertIntoNamespace(
  fnName,
  fnFile,
  fnFileContents,
  namespaceName,
  namespaceFile,
  importLine
) {
  return new Promise(resolve => {
    // Create the file
    fs.writeFileSync(fnFile, fnFileContents);

    // Insert into namespace
    let namespaceFileContents = fs
      .readFileSync(namespaceFile, "utf-8")
      .split("\n");

    namespaceFileContents = insert(
      importLine,
      namespaceFileContents.indexOf(""),
      namespaceFileContents
    );

    namespaceFileContents = insert(
      fnName + ",",
      namespaceFileContents.indexOf(`export const ${namespaceName} = {`) + 1,
      namespaceFileContents
    );

    fs.writeFileSync(namespaceFile, namespaceFileContents.join("\n"));

    exec(
      `npm run lint:fix ${namespaceFile} ${fnFile} && npm run prettier:fix`,
      () => {
        console.log(`[SUCCESS] Wrote new ${namespaceName} to ${fnFile}`);
        resolve();
      }
    );
  });
}

module.exports = {
  insertIntoNamespace,
};
