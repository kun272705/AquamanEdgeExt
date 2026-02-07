
import { settings } from './settings.js';

export class Action {

  ext;

  state;

  constructor(ext) {

    this.ext = ext;
  }

  enjoy() {
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'Port.stateChanged':

        this.syncState(e.detail.state);

        break;
    }
  }

  syncState(state) {

    this.state = state;

    const path = {
      '16': `./icons/icon16-${this.state}.png`,
      '48': `./icons/icon48-${this.state}.png`,
      '128': `./icons/icon128-${this.state}.png`
    };
    chrome.action.setIcon({ 'path': path });

    chrome.action.setTitle({ 'title': chrome.i18n.getMessage(`ext_is_${this.state}`, settings.extName) });
  }
};
