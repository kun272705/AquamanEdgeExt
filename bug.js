
export class Bug {

  ext;

  state;

  constructor(ext) {

    this.ext = ext;
  }

  enjoy() {

    chrome.debugger.onEvent.addListener((source, type, args) => this.handleEvent({ 'type': type, 'detail': { 'source': source, 'args': args } }));
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {
    
      case 'Fetch.requestPaused':

        this.interceptConversation(e.detail.source, e.detail.args);

        break;

      case 'Port.stateChanged':

        this.state = e.detail.state;

        break;
    }
  }

  async interceptConversation(source, args) {

    const tabId = source.tabId;
    const requestId = args.requestId;

    try {
      const tab = await chrome.tabs.get(tabId);
      const responseBody = await chrome.debugger.sendCommand({ 'tabId': tabId }, 'Fetch.getResponseBody', { 'requestId': requestId });
      this.ext.handleEvent({ 'type': 'Bug.conversationIntercepted', 'detail': { 'tab': tab, ...args, 'responseBody': responseBody } });
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
