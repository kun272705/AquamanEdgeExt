
export class Port {

  _aquamanEdgeExt;

  _state;

  _remoteAddress;

  _port;

  constructor(aquamanEdgeExt) {
    
    this._aquamanEdgeExt = aquamanEdgeExt;

    this._remoteAddress = 'ws://[::1]:2705/';
  }
  
  enjoy() {

    this._connect();

    this._port.addEventListener('message', e => {

      try {
        const data = JSON.parse(e.data);
        this.handleEvent(data);
      } catch (error) {
        console.warn(Date.now() / 1000, error);
      }
    });
  }

  handleEvent(e) {

    if (this._state !== 'on') return;

    switch (`${e.sender}.${e.type}`) {

      case 'AquamanEdgeExt.workflowQueued':
      case 'AquamanEdgeExt.workflowProgressed':

        try {
          const data = JSON.stringify(e);
          this._port.send(data);
        } catch (error) {
          console.warn(Date.now() / 1000, error);
        }

        break;

      case 'Aquaman.workflowApproved':
      case 'Aquaman.workflowCanceled':

        this._aquamanEdgeExt.handelEvent(e);

        break;
    }
  }

  _connect() {

    this._port = new WebSocket(this._remoteAddress);

    this._port.addEventListener('open', e => {

      console.info(Date.now() / 1000, e);
      this._syncState('on');
    });

    this._port.addEventListener('close', e => {

      console.warn(Date.now() / 1000, e);
      this._syncState('off');
      setTimeout(() => this._connect(), 3000);
    });
  }

  _syncState(state) {

    if (this._state !== state) {

      this._state = state;
      this._aquamanEdgeExt.handleEvent({ 'sender': 'Port', 'type': 'stateChanged', 'detail': { 'state': this._state } });
    }
  }
};
