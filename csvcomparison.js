const fs = require("fs");
const generateDeltaFile = (
  pathToBaseFile,
  pathToFileForComparison,
  pathForOutputFileName = "./assets/difference.csv"
) => {
  let baseFileContent = "",
    secondaryFileContent = "",
    changedLine = "";
  return new Promise((resolve, reject) => {
    const baseFileReadstream = fs.createReadStream(pathToBaseFile);
    baseFileReadstream
      .on("data", (chunk) => {
        baseFileContent = baseFileContent + chunk;
      })
      .on("error", (err) => reject(err))
      .on("end", () => {
        const secondaryFileReadstream = fs.createReadStream(
          pathToFileForComparison
        );
        secondaryFileReadstream
          .on("data", (data) => {
            secondaryFileContent = secondaryFileContent + data;
          })
          .on("error", (err) => reject(err))
          .on("end", () => {
            // split all lines by \n to form an array for both base and secondary files
            const internLines = baseFileContent.toString().split("\r\n");
            const externLines = secondaryFileContent.toString().split("\r\n");

            // Create a json object with each secondary file line as its key and value as true
            const externLookup = {};
            externLines.forEach(
              (eLine) => (externLookup[eLine.split(":")[0].trim()] = true)
            );

            // Iterate through each line of base file
            internLines.forEach((iLine) => {
              // use above formed json object and pass each line as key
              // value of externLookup[iLine] would be undefined if secondary file didn't have same line
              // in that case current line is considered as changed line and will be eventually written to output file
              if (!externLookup[iLine.split(":")[0].trim()])
                changedLine = changedLine + iLine.split(":")[0].trim() + "\n";
            });

            fs.writeFileSync(pathForOutputFileName, changedLine);
            resolve(" \r\n \r\n  🎉DONE🎉 \r\n \r\n  report file ready in this path:\r\n  "+ pathForOutputFileName+" \r\n");
          });
      });
  });
};

exports.generateDeltaFile = generateDeltaFile;

// (async () => {
//     console.time("csv comparison time taken");
//     console.log(await generateDeltaFile('./assets/base-file.csv', './assets/secondary-file.csv'))
//     console.timeEnd("csv comparison time taken")
// })()
