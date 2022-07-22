function createFlexMessage(date, holiday, temp_h, temp_l, weather) {
  // flex messageの作成
  let flex = {
    "type": "bubble",
    "size": "giga",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "Tomorrow's Events",
          "size": "lg",
          "style": "italic",
          "color": "#444444",
          "flex": 0
        }
      ]
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": date,
          "size": "xxl",
          "weight": "bold",
          "color": "#444444",
          "flex": 0,
          "margin": "xs"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": weather,
              "align": "end",
              "size": "lg",
              "color": "#444444",
              "gravity": "center"
            }
          ]
        },
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "filler"
            },
            {
              "type": "text",
              "text": temp_l + '℃',
              "flex": 0,
              "color": "#3f51b5",
              "size": "lg"
            },
            {
              "type": "text",
              "text": "/",
              "flex": 0,
              "color": "#444444",
              "size": "lg",
              "margin": "xs"
            },
            {
              "type": "text",
              "text": temp_h + '℃',
              "margin": "xs",
              "flex": 0,
              "color": "#f44336",
              "size": "lg",
              "gravity": "center"
            }
          ]
        },
        {
          "type": "separator",
          "color": "#808080",
          "margin": "xl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            // Events
          ],
          "margin": "xl"
        }
      ]
    },
    "styles": {
      "header": {
        "backgroundColor": "#a3ffa3"
      }
    }
  };

  // 祝日情報の挿入
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

  createScheduleFlexMesseage(flex);

  return flex;
}

function createScheduleFlexMesseage(flex) {
  // カレンダー情報の取得
  const calendars = JSON.parse(timetreeGetCalendars()).data;

  const zero_padding = (t) => ('0' + t).slice(-2);

  let event_exists = false;
  for (let calendar of calendars) {
    let events = JSON.parse(timetreeGetUpcomingEvents(calendar.id, 2)).data;

    for (let event of events) {
      let {title, start_at, end_at, all_day} = event.attributes;
      start_at = new Date(start_at);

      // 今日の日付は通知しない
      let today_str = Utilities.formatDate(new Date(), 'JST', 'MM/dd');
      let eventDate_str = Utilities.formatDate(start_at, 'JST', 'MM/dd');
      if (today_str == eventDate_str) continue;

      end_at = new Date(end_at);
      let time = all_day ? '終日' : zero_padding(start_at.getHours()) + ':' + zero_padding(start_at.getMinutes()) + '-' + zero_padding(end_at.getHours()) + ':' + zero_padding(end_at.getMinutes());
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
      event_exists = true;
    }
  }

  if (!event_exists) {
    flex.body.contents.splice(3, 2);
  }
}
