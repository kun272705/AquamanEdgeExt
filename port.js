
import { settings } from './settings.js';

export class Port {

  ext;

  state;

  port;

  pingDelayMilliseconds;

  constructor(ext) {
    
    this.ext = ext;

    this.pingDelayMilliseconds = 3000;
  }
  
  enjoy() {

    this.connect();

    setInterval(() => this.ping(), this.pingDelayMilliseconds);

    this.port.onMessage.addListener((e) => this.handleEvent(e));
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'App.ponged')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowStuck':
      case 'Agent.workflowCompleted':

        try {
          this.port.postMessage(e);
        } catch (error) {
          console.warn(Date.now() / 1000, error);
        }

        break;

      case 'App.ponged':
        
        this.syncState(e.detail.state);

        break;

      case 'App.workflowAccepted':
      case 'App.workflowRejected':
      case 'App.workflowCanceled':

        this.ext.handelEvent(e);

        break;
    }
  }

  connect() {
    
    this.port = chrome.runtime.connectNative(settings.nativeMessagingHostName);

    this.port.onDisconnect.addListener(() => {
      const error = chrome.runtime.lastError;
      if (error !== undefined) {
        console.warn(Date.now() / 1000, error);
      }
    });
  }

  ping() {

    try {

      this.port.postMessage({ 'type': 'Port.pinged' });
    } catch (error) {

      console.warn(Date.now() / 1000, error);

      this.syncState('off');

      this.connect();
    }
  }

  syncState(state) {

    if (!(state === 'on' || state === 'off')) return;

    if (this.state !== state) {
      this.state = state;
      this.ext.handleEvent({ 'type': 'Port.stateChanged', 'detail': { 'state': this.state } });
    }
  }
};
