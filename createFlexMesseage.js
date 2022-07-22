function createFlexMessage(date, holiday, temp_h, temp_l, weather) {
  // flex messageの作成
  let flex = {
    'type': 'bubble',
    'size': 'giga',
    'body': {
      'type': 'box',
      'layout': 'vertical',
      'contents': [
        {
          'type': 'text',
          'text': date,
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
