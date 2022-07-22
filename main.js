function notify() {
  let date = new Date()
  date.setDate(date.getDate() + 1);

  // 日付と祝日の取得
  const tomorrow = getDate(date);
  const holiday = getHoliday(date);

  // 天気情報の取得
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

  // flex messeageの作成
  let flex = createFlexMessage(tomorrow, holiday, temp_h, temp_l, weather);

  // LINE Messaging APIへ送信
  lineMessagingAPI(tomorrow, flex);
}
