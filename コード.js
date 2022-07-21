// ===== TimeTree API Methods =====
// TimeTree API
function timetreeAPI(url, method, payload) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('TIMETREE_TOKEN');
  const headers = {
    'Authorization': 'Bearer '+ accessToken
  };
  const options = {
    'method': method,
    'headers': headers,
    'payload': payload
  };

  return UrlFetchApp.fetch(url, options);
}

// カレンダーリストの取得
function timetreeGetCalendars() {
  var url = 'https://timetreeapis.com/calendars';
  var method = 'GET';
  var payload = '';
  return timetreeAPI(url, method, payload);
}

// カレンダーから特定のカレンダーのみを取得する
function timetreeGetCalendarIdByName(name) {
  var response = timetreeGetCalendars();
  var calendars = JSON.parse(response).data;

  var calendar = calendars.filter(function(data){
    return data.attributes.name.toString() === name;
  });
  return calendar[0].id;
}

// カレンダーの当日以降の予定を取得(daysは1以上7以下)
function timetreeGetUpcomingEvents(id, days) {
  var url = 'https://timetreeapis.com/calendars/' + id + '/upcoming_events?timezone=Asia/Tokyo&days=' + days;
  var method = 'GET'; 
  var payload = '';
  return timetreeAPI(url, method, payload);
}


// ===== LINE Messaging API =====
function lineMessagingAPI(date, flex) {
  const LINE_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');

  const payload = {
    'messages': [
      {
        'type': 'flex',
        'altText': date,
        'contents': flex
      }
    ]
  };

  const options = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + LINE_TOKEN
    },
    'method': 'post',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/broadcast', options);
}


// ===== Main =====
function notify() {
  const d = new Date();
  const today = (d.getMonth() + 1) + '月' + d.getDate() + '日（' + '日月火水木金土'[d.getDay()] + '）';


  const [event_holiday] = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com').getEventsForDay(d);
  const holiday = event_holiday ? event_holiday.getTitle() : '';


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


  let flex = {
    'type': 'bubble',
    'size': 'giga',
    'body': {
      'type': 'box',
      'layout': 'vertical',
      'contents': [
        {
          'type': 'text',
          'text': today,
          'weight': 'bold',
          'size': 'xxl',
          'flex': 0
        }, {
          'type': 'box',
          'layout': 'horizontal',
          'contents': [
            {
              'type': 'filler'
            }, {
              'type': 'text',
              'text': weather,
              'size': 'lg',
              'color': '#444444',
              'flex': 0,
              'gravity': 'center'
            }
          ]
        }, {
          'type': 'box',
          'layout': 'horizontal',
          'contents': [
            {
              'type': 'filler'
            }, {
              'type': 'text',
              'text': temp_l + '℃',
              'size': 'lg',
              'color': '#3f51b5',
              'flex': 0
            }, {
              'type': 'text',
              'text': '/',
              'size': 'lg',
              'color': '#444444',
              'margin': 'xs',
              'flex': 0
            }, {
              'type': 'text',
              'text': temp_h + '℃',
              'size': 'lg',
              'color': '#f44336',
              'margin': 'xs',
              'flex': 0,
              'gravity': 'center'
            }
          ]
        }, {
          'type': 'separator',
          'margin': 'xl',
          'color': '#808080'
        }, {
          'type': 'box',
          'layout': 'vertical',
          'contents': [
            //EVENTS
          ],
          'margin': 'xl'
        }
      ]
    }
  };


  if (holiday != '') {
    flex.body.contents[1].contents.splice(0, 0, {
      'type': 'text',
      'text': holiday,
      'size': 'md',
      'color': '#808080',
      'flex': 0,
      'gravity': 'center'
    });
  }

  const response = timetreeGetCalendars();
  const calendars = JSON.parse(response).data;
  const z = (t) => ('0' + t).slice(-2);

  let ev_exists = false;
  for (let calendar of calendars) {
    let events = JSON.parse(timetreeGetUpcomingEvents(calendar.id, 1)).data;

    for (let event of events) {
      let {title, start_at, end_at, all_day} = event.attributes;
      start_at = new Date(start_at);
      end_at = new Date(end_at);
      let time = all_day ? '終日' : z(start_at.getHours()) + ':' + z(start_at.getMinutes()) + '-' + 
        z(end_at.getHours()) + ':' + z(end_at.getMinutes());
      let schedule = {
        'type': 'box',
        'layout': 'horizontal',
        'contents': [
          {
            'type': 'text',
            'text': time,
            'flex': 0,
            'color': '#808080',
            'gravity': 'center',
            'size': 'md'
          }, {
            'type': 'text',
            'text': title,
            'size': 'lg',
            'weight': 'bold',
            'color': '#606060',
            'flex': 0,
            'gravity': 'center',
            'margin': 'lg'
          }
        ],
        'margin': 'sm'
      };
      flex.body.contents[4].contents.push(schedule);
      ev_exists = true;
    }
  }

  if (!ev_exists) {
    flex.body.contents.splice(3, 2);
  }

  lineMessagingAPI(today, flex);
}
