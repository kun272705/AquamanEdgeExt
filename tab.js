
import { settings } from './settings.js';

export class Tab {

  ext;

  state;

  constructor(ext) {
    
    this.ext = ext;
  }

  enjoy() {

    chrome.tabs.onUpdated.addListener(tabId => this.handleEvent({ 'type': 'Tab.tabUpdated', 'detail': { 'tabId': tabId } }));

    chrome.debugger.onDetach.addListener(target => this.handleEvent({ 'type': 'Tab.targetDetached', 'detail': { 'tabId': target.tabId } }));
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;
    
    switch (e.type) {

      case 'Port.stateChanged':

        this.state = e.detail.state;

        if (this.state === 'off') this.detachTargets();

        break;

      case 'Tab.tabUpdated':

        this.attachTarget(e.detail.tabId);

        break;

      case 'Tab.targetDetached':

        this.attachTarget(e.detail.tabId);

        break;
    }
  }

  async isAttached(tabId) {

    const targets = await chrome.debugger.getTargets();
    
    return targets.find(item => item.attached === true && item.tabId === tabId) !== undefined;
  }
    
  async attachTarget(tabId) {

    if ((await this.isAttached(tabId)) === true) return;

    try {
      await chrome.debugger.attach({ 'tabId': tabId }, settings.CDPVersion);
      await chrome.debugger.sendCommand({ 'tabId': tabId }, 'Fetch.enable', { 'patterns': [{ 'requestStage': 'Response' }] });
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }
  }

  async detachTarget(tabId) {

    try {
      await chrome.debugger.detach({ 'tabId': tabId });
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }
  }

  async detachTargets() {

    const targets = await chrome.debugger.getTargets();

    targets
      .filter(item => item.attached === true && item.tabId !== undefined)
      .forEach(item => this.detachTarget(item.tabId));
  }
};
