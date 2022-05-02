chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
      // only override settings on first install, not on updates
      chrome.storage.sync.set({beatVolume: '50'});
      chrome.storage.sync.set({rainVolume: '50'});
      chrome.storage.sync.set({fireVolume: '50'});
      chrome.storage.sync.set({birdVolume: '50'});
      // chrome.storage.sync.set({muted: true});

      // DEFAULT VOLUME 
      chrome.storage.sync.get('beatVolume', function(data) {
        beatAudio.volume = data.beatVolume / 100;
      });
      chrome.storage.sync.get('rainVolume', function(data) {
        rainAudio.volume = data.rainVolume / 100;
      });
      chrome.storage.sync.get('fireVolume', function(data) {
        fireAudio.volume = data.fireVolume / 100;
      })
      chrome.storage.sync.get('birdVolume', function(data) {
        birdAudio.volume = data.birdVolume / 100;
      });

      chrome.storage.sync.set({transparency: '100'});//demo at 100
      chrome.storage.sync.set({disabled: true}); // set default disabled value to true 
      chrome.storage.sync.set({favorites: ["https://imagizer.imageshack.com/img923/9748/BDp9GP.gif", "https://imagizer.imageshack.com/img924/8222/XQnTmO.gif"]});
      chrome.storage.sync.set({saveLink: "https://imagizer.imageshack.com/img924/8222/XQnTmO.gif"}); //EDIT HERE FOR INITIAL IMAGE
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

// AUDIO MIXER FUNCTIONALITY
var beatAudio = document.createElement("audio");
var rainAudio = document.createElement("audio");
var fireAudio = document.createElement("audio");
var birdAudio = document.createElement("audio");

// LOOP ALWAYS TRUE
beatAudio.loop = true;
rainAudio.loop = true;
fireAudio.loop = true;
birdAudio.loop = true;

// DEFAULT SET TO MUTED
// beatAudio.muted = true;
// rainAudio.muted = true;
// fireAudio.muted = true;
// birdAudio.muted = true;

// ASSIGN THE SOURCE FOR EACH VARIABLE
beatAudio.src = "/audio/cozy-place.mp3";
rainAudio.src = "/audio/rain-forest.mp3";
fireAudio.src = "/audio/fireplace.mp3";
birdAudio.src = "/audio/spring-bird.mp3";

// PLAY THE AUDIO
beatAudio.play();
rainAudio.play();
fireAudio.play();
birdAudio.play(); 


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // CHANGING BEAT VOLUME
  if (request.type == "beatVolume") {
    beatAudio.volume = request.value;
  }
  // CHANGING RAIN VOLUME
  if (request.type == "rainVolume") {
    rainAudio.volume = request.value;
  }
  // CHANGING FIRE VOLUME
  if (request.type == "fireVolume") {
    fireAudio.volume = request.value;
  }
  // CHANGING BIRD VOLUME
  if (request.type == "birdVolume") {
    birdAudio.volume = request.value;
  }
});