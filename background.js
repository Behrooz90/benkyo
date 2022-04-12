chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
      // only override settings on first install, not on updates
      chrome.storage.sync.set({transparency: '80'});
      chrome.storage.sync.set({disabled: false});
      chrome.storage.sync.set({favorites: ["https://imagizer.imageshack.com/img924/7078/Qh80YM.gif","https://imagizer.imageshack.com/img922/4747/D8OUPo.gif"]});
      chrome.storage.sync.set({saveLink: "https://imagizer.imageshack.com/img922/4747/D8OUPo.gif"}); //EDIT HERE FOR INITIAL IMAGE
      chrome.storage.sync.set({previewLink: ""});
    }

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {urlMatches: '[\s\S]*'}, // match any page
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
  });

chrome.webRequest.onHeadersReceived.addListener(info => {
  const headers = info.responseHeaders; // original headers
  for (let i=headers.length-1; i>=0; --i) {
      let header = headers[i].name.toLowerCase();
      if (header === "x-frame-options" || header === "frame-options") {
        headers.splice(i, 1); // Remove the header
      }
      if (header === "content-security-policy") { // csp header is found
          // modifying frame-ancestors; this implies that the directive is already present
          headers[i].value = headers[i].value.replace("frame-ancestors", "frame-ancestors " + window.location.href);
      }
  }

  // Something is messed up still, trying to bypass CORS when getting the largest GIF on some pages
  headers.push({
    name: 'Access-Control-Allow-Origin',
    value: window.location.href
  })
  // return modified headers
  return {responseHeaders: headers};
}, {
    urls: [ "<all_urls>" ], // match all pages
    types: [ "sub_frame" ] // for framing only
}, ["blocking", "responseHeaders"]);
