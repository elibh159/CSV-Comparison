const { generateDeltaFile } = require("./csvcomparison");
const { updateFile } = require("./appendToFile");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let source = "",
  target = "";
const filePath = "./assets/";

async function prompt(msg) {
  return new Promise((resolve, rejects) => {
    readline.question(msg, (input) => {
      resolve(input);
    });
  });
}
async function selectFile(files, msg) {
  while (true) {
    console.log("File list:");
    files.forEach((item, index) => {
      console.log("   " + (index + 1) + ". " + item);
    });
    let input = await prompt(msg);
    if (+input < 1 || +input > files.length) {
      console.log("\r\n Error‼ Please enter right number! \r\n\r\n ");
    } else {
      return files[input - 1];
    }
  }
}

async function defineTypeOfRequest() {
  while (true) {
    let input = await prompt(
      "Do you want to Get Report or Update File ( enter r/u )?"
    );
    if (input === "r" || input === "u") {
      return input;
    } else {
      console.log("please enter r/u");
    }
  }
}

(async () => {
  const fs = require("fs");
  const files = fs.readdirSync("./assets/");
  const typeOfRequest = await defineTypeOfRequest();
  if (typeOfRequest === "r") {
    source = await selectFile(files, "Please enter number of source file: ");
    target = await selectFile(files, "Please enter number of target file: ");
    console.time("csv comparison time taken");
    console.log(await generateDeltaFile(filePath + source, filePath + target));
    console.timeEnd("csv comparison time taken");
    readline.close();
  }
  if (typeOfRequest === "u") {
    target = await selectFile(files, "Please enter number of target file: ");
    const inputFile = await selectFile(
      files,
      "Please number of input File(new content): "
    );
    console.time("update target file time taken");
    console.log(await updateFile(filePath + target, filePath + inputFile));
    console.timeEnd("update target file time taken");
    readline.close();
  }
})();
