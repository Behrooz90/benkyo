let mutedCheckbox = document.getElementById('mutedCheckbox');

chrome.storage.sync.get('muted', function(data) {
    mutedCheckbox.checked = data.muted;
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