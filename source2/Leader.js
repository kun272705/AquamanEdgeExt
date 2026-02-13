
export class Leader {

  _ext;

  _state;

  _registeredAgents;

  constructor(ext) {
    
    this._ext = ext;

    this._registeredAgents = [
    ];
  }

  enjoy() {

    this._registeredAgents.forEach(item => item.enjoy());
  }

  handleEvent(e) {
    
    if (!(this._state === 'on' || `${e.sender}.${e.type}` === 'Port.stateChanged')) return;

    switch (`${e.sender}.${e.type}`) {

      case 'Port.stateChanged':

        this._state = e.detail.state;
        this._registeredAgents.forEach(item => item.handleEvent(e));

        break;

      case 'Bug.conversationIntercepted':

        this._registeredAgents.forEach(item => item.handleEvent(e));

        break;

      case 'AquamanEdgeExt.workflowQueued':
      case 'AquamanEdgeExt.workflowProgressed':

        this._ext.handleEvent(e);

        break;

      case 'Aquaman.workflowApproved':
      case 'Aquaman.workflowCanceled':

        this._registeredAgents.filter(item => item.constructor.name === e.detail.agent).forEach(item => item.handleEvent(e));

        break;
    }
  }
};
