
import { settings } from './settings.js';

export class Port {

  ext;

  state;

  reconnectTimerId;

  port;

  constructor(ext) {
    
    this.ext = ext;
  }
  
  enjoy() {

    this.connect();

    this.port.onMessage.addListener((message) => this.ext.handleEvent({ 'type': message.title, 'detail': message.content }));
  }

  connect() {
    
    this.port = chrome.runtime.connectNative(settings.nativeMessagingHostName);

    this.port.onDisconnect.addListener(() => {
      const error = chrome.runtime.lastError;
      if (error !== undefined) {
        console.warn(Date.now() / 1000, error);
        clearTimeout(this.reconnectTimerId);
        this.reconnectTimerId = setTimeout(() => this.connect(), 7000);
      }
    });
  }

  sendMessage(message) {

    try {
      this.port.postMessage(message);
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }
  }
};
