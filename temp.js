const speechToText = require('./att.js');
const uploadToGCloud = require('./uploadToGCloud.js');

let bucket = 'nhk-news'
let flacFilename = 'flac/slow/MjAxOeW5tDDmnIgyOOaXpeato+WNiOOBrk5IS+ODi+ODpeODvOOCuQ==.flac';
console.log('Start uploading ' + flacFilename + ' to gcloud.');
uploadToGCloud(flacFilename, bucket).then(() => {
console.log('Uploaded ' + flacFilename + ' to gcloud.');
speechToText(flacFilename, bucket, 'captions/slow/MjAxOeW5tDDmnIgyOOaXpeato+WNiOOBrk5IS+ODi+ODpeODvOOCuQ==.txt');
});