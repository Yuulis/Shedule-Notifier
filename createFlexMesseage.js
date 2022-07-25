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
          "text": "Tomorrow's events",
          "size": "lg",
          "style": "italic",
          "color": "#444444"
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
    "footer": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "今日の英単語",
          "margin": "xs",
          "size": "xl",
          "color": "#444444"
        },
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            // English word
          ]
        }
      ],
      "paddingStart": "xxl"
    },
    "styles": {
      "header": {
        "backgroundColor": "#a3ffa3"
      },
      "footer": {
        "backgroundColor": "#ffead6"
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

  // スケジュール
  createScheduleFlexMesseage(flex);

  // 今日の英単語
  let englishWord = getWord();
  let wordMeaning = getMeaning();
  flex.footer.contents[1].contents.push(englishWord);
  flex.footer.contents[1].contents.push(wordMeaning);

  return flex;
}

function createScheduleFlexMesseage(flex) {
  // カレンダー情報の取得
  const calendars = JSON.parse(timetreeGetCalendars()).data;

  const zero_padding = (t) => ('0' + t).slice(-2);

  let event_exists = false;
  
  for (let calendar of calendars) {
    let events = JSON.parse(timetreeGetUpcomingEvents(calendar.id, 2)).data;

    // 予定なしの時は通知しない
    if (events.length == 0) {
      let schedule = createNoEventsMessage();
      flex.body.contents[4].contents.push(schedule);
      event_exists = true;
      continue;
    }

    for (let event of events) {
      let {title, description, start_at, end_at, all_day} = event.attributes;
      start_at = new Date(start_at);

      // 今日の予定は通知しない
      let today_str = Utilities.formatDate(new Date(), 'JST', 'MM/dd');
      let eventDate_str = Utilities.formatDate(start_at, 'JST', 'MM/dd');
      if (today_str == eventDate_str) continue;

      end_at = new Date(end_at);
      let time = all_day ? '終日' : zero_padding(start_at.getHours()) + ':' + zero_padding(start_at.getMinutes()) + '-' + zero_padding(end_at.getHours()) + ':' + zero_padding(end_at.getMinutes());
      
      // メモがないとき
      if (description === null) description = 'メモはありません';
      
      let schedule = {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "text",
            "text": time,
            "flex": 0,
            "size": "md",
            "color": "#808080",
            "gravity": "center"
          },
          {
            "type": "text",
            "text": title,
            "size": "lg",
            "margin": "lg",
            "color": "#606060",
            "weight": "bold",
            "flex": 0,
            "gravity": "center"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "color": "#606060",
                "gravity": "center",
                "margin": "lg",
                "size": "sm",
                "flex": 0,
                "wrap": true,
                "text": description
              }
            ],
            "margin": "none"
          }
        ],
        "margin": "sm"
      };

      flex.body.contents[4].contents.push(schedule);
      event_exists = true;
    }
  }

  // 予定なしの時は通知しない
    if (!event_exists) {
      let schedule = createNoEventsMessage();
      flex.body.contents[4].contents.push(schedule);
    }
}

function createNoEventsMessage() {
  return {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": "予定はありません :)",
        "size": "lg",
        "margin": "lg",
        "color": "#606060",
        "weight": "bold",
        "gravity": "center",
        "flex": 0
      }
    ],
    "margin": "sm"
  }
}
