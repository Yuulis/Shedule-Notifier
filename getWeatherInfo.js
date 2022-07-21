function getWeather() {
  const area = '13104';
  let content = UrlFetchApp.fetch('https://static.tenki.jp/static-api/history/forecast/' + area + '.js').getContentText();
  content = JSON.parse(content.substring(content.indexOf('(') + 1, content.indexOf(');')));
  let {max_t: temp_h = "不明", min_t: temp_l = "不明", t: weather = "不明"} = content;

  const words = {
    '時々': '|',
    '一時': '|',
    'のち': '»',
    '晴': '☀',
    '曇': '☁',
    '雨': '☔',
    '雪': '⛄'
  };
  
  for (let key in words) {
    weather = weather.replace(key, words[key]);
  }
}
