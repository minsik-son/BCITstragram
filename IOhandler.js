/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on('close', () => {
        console.log("Extraction operation complete");
        resolve();
      })
      .on('error', reject);
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files)=>{
      if(err){
        reject(err);
      }
      else{
        const pngType = ".png";
        var pngFiles = files.filter(file => {
          return path.extname(file).toLowerCase() === pngType;
        });
        resolve(pngFiles);
      }
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  fs.createReadStream(pathIn)
    .pipe(new PNG({
      filterType: 4,
    }))
    .on('pared', ()=>{
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          var greyValue = (this.data[idx]+this.data[idx + 1]+this.data[idx + 2])/3;
          this.data[idx] = greyValue;
          this.data[idx + 1] = greyValue;
          this.data[idx + 2] = greyValue;
        }
      }
       this.pack().pipe(fs.createWriteStream(pathOut));
    })
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
