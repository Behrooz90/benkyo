let beat_volume = document.getElementById('beatVolume');
let rain_volume = document.getElementById('rainVolume');
let fire_volume = document.getElementById('fireVolume');
let bird_volume = document.getElementById('birdVolume');
let mutedCheckbox = document.getElementById('mutedCheckbox');

chrome.storage.sync.get('beatVolume', function(data) {
    beat_volume.value = data.beatVolume;
    beat_volume.setAttribute('value', data.beatVolume);
});

chrome.storage.sync.get('rainVolume', function(data) {
    rain_volume.value = data.rainVolume;
    rain_volume.setAttribute('value', data.rainVolume);
});

chrome.storage.sync.get('fireVolume', function(data) {
    fire_volume.value = data.fireVolume;
    fire_volume.setAttribute('value', data.fireVolume);
});

chrome.storage.sync.get('birdVolume', function(data) {
    bird_volume.value = data.birdVolume;
    bird_volume.setAttribute('value', data.birdVolume);
});

chrome.storage.sync.get('muted', function(data) {
    mutedCheckbox.checked = data.muted;
});

var timer1 = null;
const MAX_RATE_PER_MINUTE = 110;
const MILLIS_PER_MINUTE = 60*1000;
beat_volume.oninput = function(element) {
  const newVolume = element.target.value;
  window.clearTimeout(timer1);
  timer1 = window.setTimeout(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.storage.sync.set({beatVolume: newVolume}, function() {
        console.log('beat volume is ' + newVolume);
      });
      var volume_Value = newVolume / 100;
      chrome.runtime.sendMessage({
        type: "beatVolume",
        value: volume_Value
      }, function(response) {});
    });
  }, MILLIS_PER_MINUTE / MAX_RATE_PER_MINUTE);
};

var timer2 = null;
rain_volume.oninput = function(element) {
  const newVolume = element.target.value;
  window.clearTimeout(timer2);
  timer2 = window.setTimeout(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.storage.sync.set({rainVolume: newVolume}, function() {
        console.log('rain volume is ' + newVolume);
      });
      var volume_Value = newVolume / 100;
      chrome.runtime.sendMessage({
        type: "rainVolume",
        value: volume_Value
      }, function(response) {});
    });
  }, MILLIS_PER_MINUTE / MAX_RATE_PER_MINUTE);
};

var timer3 = null;
fire_volume.oninput = function(element) {
  const newVolume = element.target.value;
  window.clearTimeout(timer3);
  timer3 = window.setTimeout(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.storage.sync.set({fireVolume: newVolume}, function() {
        console.log('fire volume is ' + newVolume);
      });
      var volume_Value = newVolume / 100;
      chrome.runtime.sendMessage({
        type: "fireVolume",
        value: volume_Value
      }, function(response) {});
    });
  }, MILLIS_PER_MINUTE / MAX_RATE_PER_MINUTE);
};

var timer4 = null;
bird_volume.oninput = function(element) {
  const newVolume = element.target.value;
  window.clearTimeout(timer4);
  timer4 = window.setTimeout(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.storage.sync.set({birdVolume: newVolume}, function() {
        console.log('bird volume is ' + newVolume);
      });
      var volume_Value = newVolume / 100;
      chrome.runtime.sendMessage({
        type: "birdVolume",
        value: volume_Value
      }, function(response) {});
    });
  }, MILLIS_PER_MINUTE / MAX_RATE_PER_MINUTE);
};

chrome.storage.sync.get('beatVolume', function(data) {
    var x = data.beatVolume;
    var color = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    beat_volume.style.background = color;
});
beat_volume.addEventListener("mousemove", function() {
    var x = beat_volume.value;
    beat_volume.style.background = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    var volume_Value = beat_volume.value / 100;
    chrome.runtime.sendMessage({
        type: "beatVolume",
        value: volume_Value
    }, function(response) {});
});

chrome.storage.sync.get('rainVolume', function(data) {
    var x = data.rainVolume;
    var color = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    rain_volume.style.background = color;
});
rain_volume.addEventListener("mousemove", function() {
    var x = rain_volume.value;
    rain_volume.style.background = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    var volume_Value = newVolume / 100;
      chrome.runtime.sendMessage({
        type: "rainVolume",
        value: volume_Value
      }, function(response) {});
});

chrome.storage.sync.get('fireVolume', function(data) {
    var x = data.fireVolume;
    var color = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    fire_volume.style.background = color;
});
fire_volume.addEventListener("mousemove", function() {
    var x = fire_volume.value;
    fire_volume.style.background = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    var volume_Value = newVolume / 100;
      chrome.runtime.sendMessage({
        type: "fireVolume",
        value: volume_Value
      }, function(response) {});
});

chrome.storage.sync.get('birdVolume', function(data) {
    var x = data.birdVolume;
    var color = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    bird_volume.style.background = color;
});
bird_volume.addEventListener("mousemove", function() {
    var x = bird_volume.value;
    bird_volume.style.background = 'linear-gradient(90deg, rgb(110,151,255)' + x + '% , rgb(45, 45, 45)' + x + '%)';
    var volume_Value = newVolume / 100;
      chrome.runtime.sendMessage({
        type: "birdVolume",
        value: volume_Value
      }, function(response) {});
});

mutedCheckbox.onchange = function(event) {
    const isMuted = event.target.checked;
    chrome.storage.sync.set({muted : isMuted}, function() {
      console.log('muted is ' + isMuted);
    });
    chrome.runtime.sendMessage({
        type: "muted",
        value: isMuted
    });
}