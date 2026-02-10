
export class Action {

  _ext;

  _state;

  constructor(ext) {

    this._ext = ext;
  }

  enjoy() {
  }

  handleEvent(e) {

    if (!(this._state === 'on' || `${e.publisher}.${e.type}` === 'Port.stateChanged')) return;

    switch (`${e.publisher}.${e.type}`) {

      case 'Port.stateChanged':

        this._syncState(e.detail.state);

        break;
    }
  }

  _syncState(state) {

    this._state = state;

    const path = {
      '16': `./icons/icon16-${this._state}.png`,
      '48': `./icons/icon48-${this._state}.png`,
      '128': `./icons/icon128-${this._state}.png`
    };
    chrome.action.setIcon({ 'path': path });

    const title = chrome.i18n.getMessage(`aquaman_is_${this._state}`);
    chrome.action.setTitle({ 'title': title });
  }
};
