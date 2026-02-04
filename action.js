
import { settings } from './settings.js';

export class Action {

  ext;

  state;

  constructor(ext) {

    this.ext = ext;
  }

  enjoy() {

    this.syncState();

    chrome.action.onClicked.addListener(() => this.handleEvent({ 'type': 'actionClicked' }));
  }

  handleEvent(e) {

    switch (e.type) {

      case 'actionClicked':

        this.syncState({ 'on': 'off', 'off': 'on' }[this.state]);

        break;
    }
  }

  async syncState(state) {

    switch (state) {

      case undefined:

        const result = await chrome.storage.local.get({ 'state': 'on' });
        this.state = result.state;

        break;

      case 'on':
      case 'off':

        this.state = state;
        chrome.storage.local.set({ 'state': this.state });

        break;
    }

    this.ext.handleEvent({ 'type': 'stateChanged', 'detail': { 'state': this.state } });

    chrome.action.setIcon({
      'path': {
        '16': `./icons/icon16-${this.state}.png`,
        '48': `./icons/icon48-${this.state}.png`,
        '128': `./icons/icon128-${this.state}.png`
      }
    });

    chrome.action.setTitle({ 'title': settings.extName + chrome.i18n.getMessage(`_is_${this.state}`) });
  }
};
