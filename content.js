document.addEventListener('keydown', (event) => {
    chrome.runtime.sendMessage({action: 'keyPressed', key: event.key});
  });
  