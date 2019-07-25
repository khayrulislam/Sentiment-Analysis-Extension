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


function doSomething(data){
  var mp = new Map;

  var key = Object.keys(data)

  key.forEach(element => {
    mp.set(element,data[element])
  });

  console.log(mp.get("nm"));
  console.log(mp.get("name"));

  
  console.log(key);
}
doSomething(Emoticon);
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
  