const getPlaylist = require('./getPlaylist.js');
const grab = require('./grab.js');
const mp3ToFlac = require('./mp3ToFlac.js');
const uploadToGCloud = require('./uploadToGCloud.js');
const speechToText = require('./att.js');

const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const bucket = 'nhk-news';

function speechToTextFunc(flacFilename, bucket, captionsFilename) {
  return async () => {
    return speechToText(flacFilename, bucket, captionsFilename);
  };
}

const processNews = async (mp3, list) => {
  const filename = path.posix.join(mp3.speed, Buffer.from(mp3.title).toString('base64'));
  const mp3Filename = path.posix.join("mp3", filename + ".mp3");
  const flacFilename = path.posix.join("flac", filename + ".flac");
  const captionsFilename = path.posix.join("captions", filename + ".txt");

    try {
      console.log('Start processing ' + filename);
      if (!fs.existsSync(mp3Filename)) {
        console.log(mp3Filename);
        console.log(mp3.url);
        await grab(mp3Filename, mp3.url);
        console.log('Got ' + filename);
      }
      if (!fs.existsSync(flacFilename)) {
        console.log('saidjfisdjf');
        await mp3ToFlac(mp3Filename, flacFilename);
        console.log('Turned ' + filename + ' into FLAC.');
      }      
      console.log('Start uploading ' + flacFilename + ' to gcloud.');
      await uploadToGCloud(flacFilename, bucket);
      console.log('Uploaded ' + flacFilename + ' to gcloud.');
      return speechToTextFunc(flacFilename, bucket, captionsFilename);
    } catch (e) {
      console.log(e);
      throw e;
    }
}



async function main() {
  let pms = [];
  pms.push(fsPromises.mkdir("./mp3/slow", { recursive: true }))
  pms.push(fsPromises.mkdir("./mp3/normal", { recursive: true }))
  pms.push(fsPromises.mkdir("./mp3/fast", { recursive: true }))
  pms.push(fsPromises.mkdir("./flac/slow", { recursive: true }))
  pms.push(fsPromises.mkdir("./flac/normal", { recursive: true }))
  pms.push(fsPromises.mkdir("./flac/fast", { recursive: true }))
  pms.push(fsPromises.mkdir("./captions/slow", { recursive: true }))
  pms.push(fsPromises.mkdir("./captions/normal", { recursive: true }))
  pms.push(fsPromises.mkdir("./captions/fast", { recursive: true }))
  await Promise.all(pms);
  playlist = await getPlaylist();
  playlist = [playlist[4]];
  let taskLength = 0;
  let queue = [];
  pms = [];
  for (let mp3 of playlist) {
    for (let speed in mp3.urls) {
      taskLength += 1;
      let pm = processNews({title: mp3.title, speed: speed, url: mp3.urls[speed]})
                .then(res => {
                  console.log('process end');
                  queue.push(res)
                })
                .catch(e => {
                  console.log('error');
                  taskLength -= 1
                });
                await pm;
      pms.push(pm);
    }
  }
  let i = 0;
  while (i <= taskLength) {
    if (queue.length == 0) {
      continue;
    }
    await queue[0]();
    queue.splice(0, 1);
  }
  await Promise.all(pms);
  console.log('All done.');
}


main()

module.exports = processNews;