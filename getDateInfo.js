// 今日の日付を取得
function getDate() {
  const date = new Date();
  return (date.getMonth() + 1) + '月' + date.getDate() + '日（' + '日月火水木金土'[date.getDay()] + '）';
}

// 祝日の情報を取得
function getHoliday() {
  const [event_holiday] = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com').getEventsForDay(date);
  return event_holiday ? event_holiday.getTitle() : '';
}
