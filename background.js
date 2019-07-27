chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  chrome.tabs.executeScript(null,{file:"content.js"});
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var output = {};
  // calculate sentiment value
  output.value = -100;
  output.text = request.data.message;
  output.type = request.data.type;
  sendResponse( { data: output });
});


var boosterWordMap = new Map;
var emotionWordMap = new Map;
var emotionPefixMap = new Map;
var slangMap = new Map;
var idiomMap = new Map;
var emoticonMap = new Map;
var englishWordsMap = new Map;
var negatingWordsMap = new Map;
var questionWordsMap = new Map;


loadAllData();

function loadAllData(){
  var keys = Object.keys(BoosterWord);
  keys.forEach(element=>{
    boosterWordMap.set(element,BoosterWord[element]);
  });

  keys = Object.keys(EmotionWord);
  keys.forEach(element=>{
    emotionWordMap.set(element,EmotionWord[element]);
  });

  keys = Object.keys(EmotionPefix);
  keys.forEach(element=>{
    emotionPefixMap.set(element,EmotionPefix[element]);
  });

  keys = Object.keys(Slang);
  keys.forEach(element=>{
    slangMap.set(element,Slang[element]);
  });

  keys = Object.keys(Idiom);
  keys.forEach(element=>{
    idiomMap.set(element,Idiom[element]);
  });

  keys = Object.keys(Emoticon);
  keys.forEach(element=>{
    emoticonMap.set(element,Emoticon[element]);
  });

  keys = EnglishWords;
  keys.forEach(element=>{
    englishWordsMap.set(element,true);
  });

  keys = NegatingWords;
  keys.forEach(element=>{
    negatingWordsMap.set(element,true);
  });

  keys = QuestionWords;
  keys.forEach(element=>{
    questionWordsMap.set(element,true);
  });
}


// load all the data file




// function doSomething(data){
//   var mp = new Map;

//   var key = Object.keys(data)

//   key.forEach(element => {
//     mp.set(element,data[element])
//   });

//   console.log(mp.get("nm"));
//   console.log(mp.get("name"));

  
//   console.log(key);
// }
// doSomething(Emoticon);
// var url = chrome.runtime.getURL('/test.json');
// fetch(url)
//     .then((response) => {response.json()}) //assuming file contains json
//     .then((json) => doSomething(json));



// function onRequest(request, sender, callback) {
//     switch(request.action) {
//       case 'addUrlToHistory':
//         chrome.history.addUrl({url: request.url});
//         break;
//     }
//   };
  
//   $(document).ready(function() {
//     chrome.extension.onRequest.addListener(onRequest);
//   });
  