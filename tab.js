
import { settings } from './settings.js';

export class Tab {

  ext;

  state;

  constructor(ext) {
    
    this.ext = ext;
  }

  enjoy() {

    chrome.tabs.onUpdated.addListener((tabId) => this.handleEvent({ 'type': 'tabUpdated', 'detail': { 'tabId': tabId } }));

    chrome.debugger.onDetach.addListener((target) => this.handleEvent({ 'type': 'targetDetached', 'detail': { 'tabId': target.tabId } }));
  }

  handleEvent(e) {

    if (this.state !== 'on') return;
    
    switch (e.type) {

      case 'tabUpdated':

        this.attachTarget(e.detail.tabId);

        break;

      case 'targetDetached':

        this.attachTarget(e.detail.tabId);

        break;
    }
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

  async detachTargets() {

    const targets = await chrome.debugger.getTargets();

    targets
      .filter((item) => item.attached === true && item.tabId !== undefined)
      .forEach((item) => this.detachTarget(item.tabId));
  }

  async isAttached(tabId) {

    const targets = await chrome.debugger.getTargets();
    
    return targets.find((item) => item.attached === true && item.tabId === tabId) !== undefined;
  }

  async detachTarget(tabId) {

    try {
      await chrome.debugger.detach({ 'tabId': tabId });
    } catch (error) {
      console.warn(Date.now() / 1000, error);
    }
  }
};
