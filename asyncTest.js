
// Imports the Google Cloud client library
const fs = require('fs');
const path = require('path');
const speech = require('@google-cloud/speech');


// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const filename = 'flac/normal/goodname.flac';
const encoding = 'FLAC';
const sampleRateHertz = 32000;
const languageCode = 'ja-JP';
const bucket = 'nhk-news'

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};
const audio = {
  uri: 'gs://' + path.posix.join(bucket, filename)
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
client
  .longRunningRecognize(request)
  .then(data => {
    const operation = data[0];
    // Get a Promise representation of the final result of the job
    return operation.promise();
  })
  .then(data => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
      fs.writeFile('log', JSON.stringify(response), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    console.log(`Transcription: ${transcription}`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });