const grab = require('./grab.js');

let filename = 'mp3/slow/MjAxOOW5tDEw5pyIMTbml6XlpJzvvJjmmYLjga5OSEvjg4vjg6Xjg7z7zjgrk=.mp3jgrk=.mp3';
let url = 'https://www.nhk.or.jp/r-news/ondemand/mp3/20181116200003_19876_3_1_1.mp3_1_2.mp3';
grab(filename, url).then(res => console.log(res));