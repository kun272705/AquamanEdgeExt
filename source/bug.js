
export class Bug {

  _ext;

  _state;

  constructor(ext) {

    this._ext = ext;
  }

  enjoy() {

    chrome.debugger.onEvent.addListener((source, type, args) => this.handleEvent({ 'sender': '', 'type': type, 'detail': { 'source': source, 'args': args } }));
  }

  handleEvent(e) {

    if (!(this._state === 'on' || `${e.sender}.${e.type}` === 'Port.stateChanged')) return;

    switch (`${e.sender}.${e.type}`) {

      case 'Port.stateChanged':

        this._state = e.detail.state;

        break;
    
      case 'Fetch.requestPaused':

        this._interceptConversation(e.detail.source, e.detail.args);

        break;
    }
  }

  async _interceptConversation(source, args) {

    const { tabId } = source;
    const { requestId } = args;

    try {
      const tab = await chrome.tabs.get(tabId);
      const responseBody = await chrome.debugger.sendCommand({ 'tabId': tabId }, 'Fetch.getResponseBody', { 'requestId': requestId });
      this._ext.handleEvent({ 'sender': 'Bug', 'type': 'conversationIntercepted', 'detail': { 'tab': tab, ...args, 'responseBody': responseBody } });
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }

    try {
      await chrome.debugger.sendCommand({ 'tabId': tabId }, 'Fetch.continueRequest', { 'requestId': requestId });
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }
  }
};
