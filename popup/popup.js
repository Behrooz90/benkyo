let urlInput = document.getElementById('urlInput');
let transparencySlider = document.getElementById('transparencySlider');
let disableCheckbox = document.getElementById('disableCheckbox');
let currentURLPreview = document.getElementById('currentURLPreview');

// buttons
let loadCurrentUrl = document.getElementById('loadCurrentUrl');
let saveLink = document.getElementById('saveLink');
let saveLinkFavorite = document.getElementById('saveLinkFavorite');

// clear the previewLink sent to the background whenever we open popup
chrome.storage.sync.set({previewLink: ''});


chrome.storage.sync.get('saveLink', function(data) {
  saveLink.value = data.saveLink;
  writeNewContent(data.saveLink, currentURLPreview);
});

chrome.storage.sync.get('disabled', function(data) {
  disableCheckbox.checked = data.disabled;
});

chrome.storage.sync.get('transparency', function(data) {
  transparencySlider.value = data.transparency;
  transparencySlider.setAttribute('value', data.transparency);
});

chrome.storage.sync.get('favorites', function(data) {
  const favorites = data.favorites;
  renderFavorites(favorites);
});

function renderFavorites(favorites) {
  const favoritesRoot = document.getElementById('favorites');
  // remove previous children
  while (favoritesRoot.firstChild) {
    favoritesRoot.firstChild.remove();
  }
  // add new children
  favorites.forEach(favorite => {
    const favDiv = document.createElement("div");
    const text = document.createElement("div");
    const loadFavorite = document.createElement("button");
    loadFavorite.textContent = "Switch GIF"; //instead of Load URL
    const deleteFavorite = document.createElement("button");
    deleteFavorite.textContent = "Delete";
    const preview = document.createElement("div");
    preview.className = "previewGif";
    writeNewContent(favorite, preview);
    text.textContent = favorite;
    favoritesRoot.appendChild(favDiv);
    favDiv.appendChild(text);
    favDiv.appendChild(preview);
    favDiv.appendChild(loadFavorite);
    favDiv.appendChild(deleteFavorite);
    
    loadFavorite.setAttribute('customlink', favorite);
    deleteFavorite.setAttribute('customlink', favorite);

    loadFavorite.onclick = function (ev) {
      const favorite = ev.target.getAttribute('customlink');
      urlInput.value = favorite;
      writeNewContent(favorite, currentURLPreview);
      chrome.storage.sync.set({saveLink: favorite}, function() {
        console.log('newLink is ' + favorite);
      });
    };

    deleteFavorite.onclick = function (ev) {
      const favorite = ev.target.getAttribute('customlink');

      chrome.storage.sync.get('favorites', function(data) {
        let favorites = data.favorites || [];
        if (favorites.includes(favorite)) {
          const newFavorites = favorites.slice();
          const index = favorites.indexOf(favorite);
          newFavorites.splice(index, 1);

          chrome.storage.sync.set({favorites: newFavorites}, function() {
            renderFavorites(newFavorites);
            console.log('remove favorite ' + favorite);
          });
        }
      });
    };
  });
}

urlInput.oninput = function (ev) {
  const url = ev.target.value;
  chrome.storage.sync.set({previewLink: url});
  writeNewContent(url, currentURLPreview);
}

saveLink.onclick = function(element) {
  let newLink = urlInput.value;
  chrome.storage.sync.set({saveLink: newLink}, function() {
    console.log('newLink is ' + newLink);
  });
};

loadCurrentUrl.onclick = function(element) {
  chrome.storage.sync.get('saveLink', function(data) {
    if (data.saveLink) {
      urlInput.value = data.saveLink;
      writeNewContent(data.saveLink, currentURLPreview);
    }
  });
};

saveLinkFavorite.onclick = function(element) {
  const url = urlInput.value;

  if (!url) {
    chrome.storage.sync.get('saveLink', function(data) {
      createFavorite(data.saveLink);
    });
  } else {
    createFavorite(url);
  }
};

function createFavorite(url) {
  chrome.storage.sync.get('favorites', function(data) {
    let favorites = data.favorites || [];
    if (!favorites.includes(url)) {
      favorites.push(url);
      chrome.storage.sync.set({favorites: favorites}, function() {
        console.log('add favorite ' + url);
        renderFavorites(favorites);
      });
    }
  });
}

disableCheckbox.onchange = function(event) {
  const isDisabled = event.target.checked;
  chrome.storage.sync.set({disabled: isDisabled}, function() {
    console.log('disabled is ' + isDisabled);
  });
}

var timer = null;
const MAX_RATE_PER_MINUTE = 110;
const MILLIS_PER_MINUTE = 60*1000;
transparencySlider.oninput = function(element) {
  const newTransparency = element.target.value;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.storage.sync.set({transparency: newTransparency}, function() {
        console.log('transparency is ' + newTransparency);
      });
    });
  }, MILLIS_PER_MINUTE / MAX_RATE_PER_MINUTE);
};

function writeNewContent(newLink, existingRootNode) {
  // remove existing children
  while (existingRootNode.firstChild) {
      existingRootNode.firstChild.remove();
  }

  // injecting the div wrapper
  var divWrapper = document.createElement("div");
  divWrapper.className = "root_div";
  existingRootNode.appendChild(divWrapper);

  // injecting the image
  var content = createContent(newLink);
  divWrapper.appendChild(content);
}

function createContent(link) {
  var split = link.split(".");
  var extension = split[split.length - 1];
  var extension = extension.split("?")[0]

  if (extension == "mp4" || extension == "webm") {
      // create video
      var video = document.createElement("video");
      video.className = "image";
      video.setAttribute("autoplay", true);
      video.setAttribute("loop", true);
      video.setAttribute("muted", true);

      // create source
      var source = document.createElement("source");
      source.setAttribute("src", link);
      source.setAttribute("type", "video/" + extension);
      video.appendChild(source);

      //attemptPlayVideo(video, 4);

      return video;
  }

  // injecting the image
  var img = document.createElement("img");
  img.className = "image";
  img.setAttribute("src", link);
  return img;
}

function attemptPlayVideo(video, triesRemaining) {
  if (triesRemaining > 0) {
    setTimeout(() => {
      try {
          video.play();
      } catch (e) {
          attemptPlayVideo(video, triesRemaining--)
      }
    }, 200);
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.elementSource) {
      console.log('got sources! ' + request.elementSource);
      urlInput.value = request.elementSource;
      writeNewContent(request.elementSource, currentURLPreview);
    }
  }
);