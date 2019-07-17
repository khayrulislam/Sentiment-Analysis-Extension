
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  chrome.tabs.executeScript(null,{file:"content.js"});
});



function onRequest(request, sender, callback) {
    switch(request.action) {
      case 'addUrlToHistory':
        chrome.history.addUrl({url: request.url});
        break;
    }
  };
  
  $(document).ready(function() {
    chrome.extension.onRequest.addListener(onRequest);
  });
  