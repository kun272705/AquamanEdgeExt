
import { settings } from './settings.js';

export class Port {

  ext;

  state;

  port;

  constructor(ext) {
    
    this.ext = ext;
  }
  
  enjoy() {

    this.connect();

    setInterval(() => this.ping(), 3000);

    this.port.onMessage.addListener(e => this.handleEvent(e));
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'App.pong')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowCompleted':
      case 'Agent.workflowStuck':

        try {
          this.port.postMessage(e);
        } catch (error) {
          console.warn(Date.now() / 1000, error);
        }

        break;

      case 'App.pong':

        const state = e.detail.state;
        if (!(state === 'on' || state === 'off')) return;
        this.syncState(state);

        break;

      case 'App.workflowAccepted':
      case 'App.workflowCanceled':

        this.ext.handelEvent(e);

        break;
    }
  }

  connect() {
    
    this.port = chrome.runtime.connectNative(settings.nativeMessagingHostName);

    this.port.onDisconnect.addListener(() => {
      const error = chrome.runtime.lastError;
      if (error !== undefined) console.warn(Date.now() / 1000, error);
    });
  }

  ping() {

    try {

      this.port.postMessage({ 'type': 'Port.ping' });
    } catch (error) {

      console.warn(Date.now() / 1000, error);

      this.syncState('off');

      this.connect();
    }
  }

  syncState(state) {

    if (this.state !== state) {
      this.state = state;
      this.ext.handleEvent({ 'type': 'Port.stateChanged', 'detail': { 'state': this.state } });
    }
  }
};
