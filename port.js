
import { settings } from './settings.js';

export class Port {

  _ext;

  _state;

  _port;

  constructor(ext) {
    
    this._ext = ext;
  }
  
  enjoy() {

    this._connect();

    this._ping();

    setInterval(() => this._ping(), 3000);

    this._port.onMessage.addListener(e => this.handleEvent(e));
  }

  handleEvent(e) {

    if (!(this._state === 'on' || e.type === 'NMH.pong')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowProgressed':

        try {
          this._port.postMessage(e);
        } catch (error) {
          console.warn(Date.now() / 1000, error);
        }

        break;

      case 'NMH.pong':

        const { state } = e.detail;
        if (!(state === 'on' || state === 'off')) return;
        this._syncState(state);

        break;

      case 'Bar.workflowAccepted':
      case 'Bar.workflowCanceled':

        this._ext.handelEvent(e);

        break;
    }
  }

  _connect() {
    
    this._port = chrome.runtime.connectNative(settings.nativeMessagingHostName);

    this._port.onDisconnect.addListener(() => {
      const error = chrome.runtime.lastError;
      if (error !== undefined) console.warn(Date.now() / 1000, error);
    });
  }

  _ping() {

    try {
      this._port.postMessage({ 'type': 'Port.ping' });
    } catch (error) {

      console.warn(Date.now() / 1000, error);

      this._syncState('off');

      this._connect();
    }
  }

  _syncState(state) {

    if (this._state === state) return;

    this._state = state;

    this._ext.handleEvent({ 'type': 'Port.stateChanged', 'detail': { 'state': this._state } });
  }
};
