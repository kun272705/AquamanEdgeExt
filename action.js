
export class Action {

  _ext;

  _state;

  _extName;

  constructor(ext) {

    this._ext = ext;

    this._extName = 'Aquaman';
  }

  enjoy() {
  }

  handleEvent(e) {

    if (!(this._state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

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

    const title = chrome.i18n.getMessage(`ext_is_${this._state}`, this._extName);
    chrome.action.setTitle({ 'title': title });
  }
};
