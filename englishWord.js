const sheet =  SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("ENGLISHWORD_SHEET")).getSheetByName("必修英単語");
const wordNum = sheet.getLastRow();
let wordIndex = Math.floor(Math.random() * wordNum) + 1;

function getWord() {
  const wordID = sheet.getRange(wordIndex, 1).getValue();
  const word = sheet.getRange(wordIndex, 2).getValue();
  const wordType = sheet.getRange(wordIndex, 3).getValue();

  return {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": '【' + wordID + '】',
        "flex": 0,
        "size": "md",
        "color": "#444444"
      },
      {
        "type": "text",
        "text": word,
        "flex": 0,
        "size": "md",
        "color": "#444444"
      },
      {
        "type": "text",
        "text": '(' + wordType + ')',
        "flex": 0,
        "size": "md",
        "margin": "md",
        "color": "#444444",
        "gravity": "center"
      }
    ],
    "margin": "xs"
  }
}

function getMeaning() {
  const wordMeaning = sheet.getRange(wordIndex, 4).getValue();

  return {
    "type": "text",
    "text": wordMeaning,
    "wrap": true,
    "gravity": "center",
    "margin": "xs",
    "size": "sm",
    "color": "#444444",
    "offsetStart": "50px"
  }
}
