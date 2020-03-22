module.exports = function dateParse(e, s) {
  var a, r = e.replace(/\ \+09:00/g, ""), t = new Date(r), l = t.getFullYear(), n = t.getMonth() + 1, i = t.getDate(), o = t.getHours(), c = t.getMinutes();
  o >= 12 ? (o -= 12, a = "午後") : a = "午前", 10 > o && (o = "0" + o), 10 > c && (c = "0" + c);
  var p = ["日", "月", "火", "水", "木", "金", "土"], d = d = "(" + p[t.getDay()] + ")";
  if (10 > n && (n = "0" + n), 10 > i && (i = "0" + i), "start" == s)
      var e = n + "月" + i + "日" + a + o + ":" + c;
  else if ("end" == s)
      var e = a + o + ":" + c;
  else
      var e = l + "年" + n + "月" + i + "日" + a + o + ":" + c;
  return e;
}