// @flow

let currentEntry = null;
let currentState: StateShape = {};

// talk to extension
let onChangeTimerListener: (entry?: any) => void = () => {};
let onChangeStateListener: (state: StateShape) => void = () => {};

// talk to site
let postMessage: (msg: any) => void = () => {};

function onConnectApp(port) {
  function onChangeState(state: StateShape) {
    // update current state
    currentState = state;
  }

  function onChangeTimer(entry) {
    if (entry.tracking) {
      window.chrome.browserAction.setBadgeText({ text: '…' });
    } else {
      window.chrome.browserAction.setBadgeText({ text: '' });
    }

    // update current entry
    currentEntry = entry;
    onChangeTimerListener(entry);
  }

  function handleMessage(msg) {
    switch (msg.type) {
      case 'changeTimer':
        onChangeTimer(msg.entry);
        break;

      case 'changeState':
        onChangeState(msg.state);
        break;

      default:
        console.error('Unable to handle message from app', msg);
    }
  }

  port.onMessage.addListener(handleMessage);

  port.postMessage({ type: 'connected' });

  postMessage = (msg: any) => port.postMessage(msg);
}

function onConnectPopup(port) {
  function handleDisconnect() {
    onChangeTimerListener = () => {};
    onChangeStateListener = () => {};
  }

  port.onMessage.addListener(msg => postMessage(msg));
  port.onDisconnect.addListener(handleDisconnect);

  onChangeTimerListener = entry => port.postMessage({ type: 'changeTimer', entry });
  onChangeStateListener = state => port.postMessage({ type: 'changeState', state });

  onChangeTimerListener(currentEntry);
  onChangeStateListener(currentState);
}

window.chrome.runtime.onConnectExternal.addListener(onConnectApp);
window.chrome.extension.onConnect.addListener(onConnectPopup);
