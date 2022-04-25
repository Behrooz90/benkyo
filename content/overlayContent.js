var ROOT_DIV_ID = "root_container_bchrome_overlay";
var CSS_LINK_ID = "root_container_bchrome_overlay_css";

injectOverlayContent();

window.addEventListener('load', () => {
    onContentScriptInitialized();
});

function onContentScriptInitialized() {
    injectOverlayContent();
}

function removeOverlayContent() {
    var existingRootNode = document.getElementById(ROOT_DIV_ID);
    existingRootNode.remove();
}

function injectOverlayContent() {
    var existingRootNode = document.getElementById(ROOT_DIV_ID);
    if (existingRootNode) {
        return;
    }
    
    // injecting the html root
    var div = document.createElement("div");
    div.id = ROOT_DIV_ID;
    // inject styles directly so we don't get classname collisions or removing of style sheet
    //div.style.backgroundColor = "black"; //remove later
    div.style.pointerEvents = "none";
    div.style.width = "15vw"; //EDIT THIS AND NEXT LINE FOR POSTIONING //25vw
    div.style.height = "15vh"; //40
    div.style.position = "fixed";
    div.style.opacity = "0.50"; /* this is probably going to be variable*/
    div.style.zIndex = "1000000";
    div.style.display = "flex";
    div.style.alignItems = "end";
    //div.style.paddingTop = "0";
    div.style.border = "none";
    div.style.bottom = "-5.5px"; //exactly bottom of screen
    div.style.right = "0px";//all the way to the right for suspended boy and girl GIFs
    document.body.appendChild(div);
    //$( ".overlay" ).draggable({ handle: ".overlay" });

    chrome.storage.sync.get('transparency', function(data) { //FUTURE FEATURE: make changes here for mouseover transparency
        var existingRootNode = document.getElementById(ROOT_DIV_ID);
        existingRootNode.style.opacity = (data.transparency / 100.0);
    });
    
    chrome.storage.sync.get('disabled', function(data) {
        var existingRootNode = document.getElementById(ROOT_DIV_ID);
        if (data.disabled) {
            existingRootNode.style.opacity = 0;
        }
    });

    //saveLink = "https://imagizer.imageshack.com/img924/7130/gHAd7d.gif";

    chrome.storage.sync.get('saveLink', function(data) {
        var existingRootNode = document.getElementById(ROOT_DIV_ID);
        writeNewContent(data.saveLink, existingRootNode);
        if (data.saveLink) {
            writeNewContent(data.saveLink, existingRootNode);
        }
    });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    var existingRootNode = document.getElementById(ROOT_DIV_ID);
    for (var key in changes) {
        var storageChange = changes[key];
        switch (key) {
            case 'transparency':
                existingRootNode.style.opacity = (storageChange.newValue / 100.0);
                break;
            case 'disabled':
                if (storageChange.newValue) {
                    // if disabled, rip out of the DOM
                    removeOverlayContent();
                } else {
                    // if enabled, insert into DOM
                    injectOverlayContent();
                }
                break;
            case 'saveLink':
                if (storageChange.newValue) {
                    writeNewContent(storageChange.newValue, existingRootNode);
                }
                break;
        }
    }
});

function writeNewContent(newLink, existingRootNode) {
    // remove existing children
    while (existingRootNode.firstChild) {
        existingRootNode.firstChild.remove();
    }

    // injecting the div wrapper
    var divWrapper = document.createElement("div");
    divWrapper.style.flexGrow = "1";
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
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "contain";
        video.setAttribute("autoplay", true);
        video.setAttribute("loop", true);
        video.setAttribute("muted", true);

        // create source
        var source = document.createElement("source");
        source.setAttribute("src", link);
        source.setAttribute("type", "video/" + extension);
        video.appendChild(source);

        attemptPlayVideo(video, 4);

        return video;
    }

    // injecting the image
    //#img; {
    //    cursor: move;
    //}
    var img = document.createElement("img");
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    //$( ".overlay" ).draggable({ handle: ".img" });
    img.setAttribute("src", link);
    return img;
}

function attemptPlayVideo(video, triesRemaining) {
    if (triesRemaining > 0) {
      setTimeout(() => {
        try {
            var promise = video.play();
            promise.catch(error => {
                attemptPlayVideo(video, triesRemaining--)
            })
        } catch (e) {
            attemptPlayVideo(video, triesRemaining--)
        }
      }, 200);
    }
  }