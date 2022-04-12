var timeout = 1000;
chrome.storage.sync.get('previewLink', function(data) {
    const previewLink = data.previewLink;
    if (previewLink == window.location.href) {
        // we're in the current tab for the iframe that we're searching for content!
        // so do the search I guess
        setTimeout(() => {
            parseFrame(3);
        }, timeout);
    }
});

function parseFrame(attempts) {
    var filteredElements = [].concat(parseImages()).concat(parseVideos());

    // if we don't have any media files in their link, try again later
    if (!filteredElements || filteredElements.length == 0) {
        if (--attempts > 0) {
            // Elements not found, and some attempts left. Try again soon.
            setTimeout(parseFrame, 250, attempts);
        }
    }

    // we have media links - now lets just narrow it down right here to the one that we want and we can send that back
    // iterate over elements and compute the sizes, filter out ones off page, then grab the largest one on the page
    var largestSize = 0;
    var largest = '';
    filteredElements.forEach(object => {
        var el = object.el;
        // if element isn't currently visible, we don't care
        if (!isVisible(el)) {
            return;
        }

        var rect = el.getBoundingClientRect();
        var size = rect.width * rect.height;
        if (size > largestSize) {
            largestSize = size;
            largest = object;
        }
    })

    // we now have the largest visible element. Return it
    chrome.runtime.sendMessage({
        elementSource: largest.src
    });
}

function parseImages() {
    var elements = document.querySelectorAll("[src]")
    var elementsArray = Array.from(elements)
    var filteredElements = elementsArray.filter(el => el.src && (el.src.endsWith('.gif') || el.src.endsWith('.png') || el.src.endsWith('.jpg'))) // only search for images, not videos here
    return filteredElements.map(element => {
        return {
            el: element,
            src: element.src,
        }
    });
}

function parseVideos() {
    var elements = document.getElementsByTagName('video');
    var elementsArray = Array.from(elements)
    var filteredElements = elementsArray.filter(el => el.currentSrc && (el.currentSrc.endsWith('.gif') || el.currentSrc.endsWith('.mp4') || el.currentSrc.endsWith('.webm')))
    return filteredElements.map(element => {
        return {
            el: element,
            src: element.currentSrc,
        }
    });
}

// copied from https://stackoverflow.com/a/41698614
function isVisible(elem) {
    if (!(elem instanceof Element)) return false;
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    if (pointContainer) {
        do {
            if (pointContainer === elem) return true;
        } while (pointContainer = pointContainer.parentNode);
    }
    return false;
}

/**
 * The current tab listens for changes to the propery and spawns a new iframe
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        switch (key) {
            case 'previewLink':
                if (storageChange.newValue) {
                    var val = storageChange.newValue;
                    // if it's a valid image link, do nothing
                    if (!(val.endsWith('.gif') || val.endsWith('.png') || val.endsWith('.jpg') || val.endsWith('.mp4') || val.endsWith('.webm'))) {
                        if (window.location.href != storageChange.newValue) {
                            injectFrame(storageChange.newValue);
                        } else {
                            // pasted the url of the page they're currently on... so just parse the page directly
                            parseFrame(1);
                        }
                    }
                }
                break;
        }
    }
});

function injectFrame(url) {
    var docToUse = document; // replace back with document later
    var iframe = docToUse.createElement('iframe');
    iframe.setAttribute('is', "x-frame-bypass");// will probably have to remove this
    iframe.src = url; // this is the src sent by message from popup.js
    // Remove iframe when the content has (not) loaded
    iframe.onerror =
    iframe.onload = function() {
        setTimeout(function() {
            iframe.parentNode.removeChild(iframe);
        }, 5*timeout);
    };
    // Put security restrictions on the iframe
    // // iframe.sandbox = 'allow-scripts';
    // Make frame invisible
    iframe.style.pointerEvents = 'none';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.position = 'fixed';
    iframe.style.opacity = 0.5;
    iframe.style.visibility = 'hidden';
    iframe.style.display = 'flex';
    iframe.style.top = '0';
    iframe.style.left = '0';

    // Insert iframe in the document, and load its content
    docToUse.body.appendChild(iframe);
}