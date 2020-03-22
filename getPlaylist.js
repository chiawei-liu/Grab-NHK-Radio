const request = require('request');
const playlsitUrl = "https://api.nhk.or.jp/r-news/v1/newslist.js";
const soundURL = "https://www.nhk.or.jp/r-news/ondemand/mp3/";

let getJsonFromJsonP = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let jsonpData = body;
        let json;
        //if you don't know for sure that you are getting jsonp, then i'd do something like this
        try {
           json = JSON.parse(jsonpData);
        }
        catch(e) {
            let startPos = jsonpData.indexOf('({');
            let endPos = jsonpData.indexOf('})');
            let jsonString = jsonpData.substring(startPos+1, endPos+1);
            json = JSON.parse(jsonString);
        }
        resolve(json);
      } else {
        reject(error);
      }
    });
  });
}

const getPlaylist = async () => {
  try {
    let jsonp = await getJsonFromJsonP(playlsitUrl);
    let playlist = [];
    let a = jsonp.news;
    for (i = 0; i < a.length; i++) {
      let l = { 
        title: "", 
        urls: {
          slow: "",
          normal: "",
          fast: ""
        } 
      };
      let date = new Date(a[i].startdate);
      l.title = date.getFullYear() + "年" + date.getMonth() + "月" + date.getDate() + "日" + a[i].title;
      l.urls.normal = soundURL + a[i].soundlist.sound_normal.filename + "." + a[i].soundlist.sound_normal.type;
      l.urls.fast = soundURL + a[i].soundlist.sound_fast.filename + "." + a[i].soundlist.sound_fast.type
      l.urls.slow = soundURL + a[i].soundlist.sound_slow.filename + "." + a[i].soundlist.sound_slow.type;
      playlist.push(l);
    }
    console.log(playlist);
    return playlist; 
  } catch (e) {
    throw e;
  }
}

module.exports = getPlaylist;


