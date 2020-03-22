
// Imports the Google Cloud client library
const path = require('path');
const speech = require('@google-cloud/speech');
const fs = require('fs');
// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const gcsUriHead = 'gs://';
const encoding = 'FLAC';
const sampleRateHertz = 32000;
const languageCode = 'ja-JP';


const speechToText = async (filename, bucket, outputFilename) => {
  console.log(filename);
  console.log(bucket);
  console.log(outputFilename);
  const audio = {
    uri: gcsUriHead + path.posix.join(bucket, filename),
  };
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const request = {
    config: config,
    audio: audio,
  };
  return new Promise((resolve, reject) => {
    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
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
          .join();
        fs.writeFile(outputFilename, JSON.stringify(data, null, 2), function (err) {
          if (err) throw err;
          console.log('Saved!');
          resolve('Saved!');
        });
    })
    .catch(err => {
      console.error('ERROR:', err);
      reject(err);
    });
  });
}

module.exports = speechToText;





