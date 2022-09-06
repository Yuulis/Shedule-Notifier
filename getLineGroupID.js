function doPost(e){
  var json = JSON.parse(e.postData.contents);
  var UID = json.events[0].source.userId;
  var GID = json.events[0].source.groupId;

  const sheet =  SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID")).getSheetByName("シート1");
  sheet.appendRow([GID, UID]);
}
