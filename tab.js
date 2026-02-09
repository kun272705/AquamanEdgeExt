
import { settings } from './settings.js';

export class Tab {

  _ext;

  _state;

  constructor(ext) {
    
    this._ext = ext;
  }

  enjoy() {

    chrome.tabs.onUpdated.addListener(tabId => this.handleEvent({ 'type': 'Tab.tabUpdated', 'detail': { 'tabId': tabId } }));
    chrome.debugger.onDetach.addListener(target => this.handleEvent({ 'type': 'Tab.targetDetached', 'detail': { 'tabId': target.tabId } }));
  }

  handleEvent(e) {

    if (!(this._state === 'on' || e.type === 'Port.stateChanged')) return;
    
    switch (e.type) {

      case 'Port.stateChanged':

        this._state = e.detail.state;
        if (this._state === 'off') this._detachTargets();

        break;

      case 'Tab.tabUpdated':

        this._attachTarget(e.detail.tabId);

        break;

      case 'Tab.targetDetached':

        this._attachTarget(e.detail.tabId);

        break;
    }
  }

  async _isAttached(tabId) {

    const targets = await chrome.debugger.getTargets();
    return targets.some(item => item.attached === true && item.tabId === tabId) === true;
  }
    
  async _attachTarget(tabId) {

    if ((await this._isAttached(tabId)) === true) return;

    try {
      await chrome.debugger.attach({ 'tabId': tabId }, settings.CDPVersion);
      await chrome.debugger.sendCommand({ 'tabId': tabId }, 'Fetch.enable', { 'patterns': [{ 'requestStage': 'Response' }] });
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }
  }

  async _detachTarget(tabId) {

    try {
      await chrome.debugger.detach({ 'tabId': tabId });
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }
  }

  async _detachTargets() {

    const targets = await chrome.debugger.getTargets();
    targets
      .filter(item => item.attached === true && item.tabId !== undefined)
      .forEach(item => this._detachTarget(item.tabId));
  }
};
