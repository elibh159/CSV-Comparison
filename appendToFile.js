const fs = require("fs");

const updateFile = (pathToTargetFile, pathForInputFileName) => {
  let targetFileContent = "",
    newFileContent = "";
  return new Promise((resolve, reject) => {
    const targetFileReadstream = fs.createReadStream(pathToTargetFile);
    targetFileReadstream
      .on("data", (chunk) => {
        targetFileContent = targetFileContent + chunk;
        targetFileContent = targetFileContent.replace("{", "").replace("}", "");
      })
      .on("error", (err) => reject(err))
      .on("end", () => {
        const inputFileReadstream = fs.createReadStream(pathForInputFileName);
        inputFileReadstream
          .on("data", (newData) => {
            newFileContent = targetFileContent + newData;
            newFileContent =
              "{" + newFileContent.replace("{", "").replace("}", "") + "}";
          })
          .on("error", (err) => reject(err))
          .on("end", () => {
            fs.writeFile(pathToTargetFile, newFileContent, (err) => {
              if (err) throw err;
              console.log("Data appended to file");
              resolve(" \r\n \r\n  🎉DONE🎉 \r\n \r\n  please check target file:\r\n  "+ pathToTargetFile +" \r\n \r\n  ");
            });
          });
      });
  });
};

exports.updateFile = updateFile;

// (async () => {
//   console.time("csv comparison time taken");
//   console.log(await updateFile("./assets/2-secondary-file.csv"));
//   console.timeEnd("csv comparison time taken");
// })();
