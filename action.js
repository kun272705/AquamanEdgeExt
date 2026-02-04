
import { settings } from './settings.js';

export class Action {

  ext;

  state;

  constructor(ext) {

    this.ext = ext;
  }

  enjoy() {

    this.syncState();

    browser.action.onClicked.addListener(() => this.handleEvent({ 'type': 'actionClicked' }));
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

        const result = await browser.storage.local.get({ 'state': 'on' });
        this.state = result.state;

        break;

      case 'on':
      case 'off':

        this.state = state;
        browser.storage.local.set({ 'state': this.state });

        break;
    }

    this.ext.handleEvent({ 'type': 'stateChanged', 'detail': { 'state': this.state } });

    browser.action.setIcon({
      'path': {
        '16': `./icons/icon16-${this.state}.png`,
        '48': `./icons/icon48-${this.state}.png`,
        '128': `./icons/icon128-${this.state}.png`
      }
    });

    browser.action.setTitle({ 'title': settings.extName + browser.i18n.getMessage(`_is_${this.state}`) });
  }
};
