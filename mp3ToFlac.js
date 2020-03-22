const sox = require('sox');

mp3ToFlac = async (input, output) => {
  return new Promise((resolve, reject) => {
    console.log('aaaaa');
    console.log(input, output);
    let job = sox.transcode(input, output, {
      channelCount: 1,
      sampleRate: 32000,
      format: 'flac',
      compressionQuality: 5 - 192,
    });
    job.on('end', () => {
      console.log('cccc');
      resolve('sox done.');
    });
    job.on('error', err => {
      console.log(err);

      reject(err);
    });
    job.start();
  });
}

module.exports = mp3ToFlac;

//mp3ToFlac('test.mp3', 'test333.flac');