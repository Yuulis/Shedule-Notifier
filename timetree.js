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
  let url = 'https://timetreeapis.com/calendars';
  let method = 'GET';
  let payload = '';
  return timetreeAPI(url, method, payload);
}

// カレンダーから特定のカレンダーのみを取得する
function timetreeGetCalendarIdByName(name) {
  let response = timetreeGetCalendars();
  let calendars = JSON.parse(response).data;

  let calendar = calendars.filter(function(data){
    return data.attributes.name.toString() === name;
  });
  return calendar[0].id;
}

// カレンダーの当日以降の予定を取得(daysは1以上7以下)
function timetreeGetUpcomingEvents(id, days) {
  let url = 'https://timetreeapis.com/calendars/' + id + '/upcoming_events?timezone=Asia/Tokyo&days=' + days;
  let method = 'GET'; 
  let payload = '';
  return timetreeAPI(url, method, payload);
}
