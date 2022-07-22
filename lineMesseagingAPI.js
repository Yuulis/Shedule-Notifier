// LINE Messeaging API
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