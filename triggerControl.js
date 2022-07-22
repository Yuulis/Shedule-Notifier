// 通知時間指定のためのトリガーを起動
function setTrigger(){

  // 通知時刻
  const time = new Date();
  time.setHours(16);
  time.setMinutes(0);
  
  ScriptApp.newTrigger('notify').timeBased().at(time).create();
}

// 使用済みのトリガーを削除 
function delTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  
  for(const trigger of triggers){
    if(trigger.getHandlerFunction() == "notify") ScriptApp.deleteTrigger(trigger);
  }
}