const fs = require('fs');
const request = require('request');
const path = require('path');

module.exports = async function (filename, url) {
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream(filename);
    console.log(url);
    request
      .get(url)
      .on('error', function (err) {
        console.error('ERROR:', e);
      })
      .pipe(stream);
    stream.on('finish', () => {
      console.log('finished');  
      resolve('finished');
    });
  });
}
