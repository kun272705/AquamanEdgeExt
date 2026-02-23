
export class Leader {

  _aquamanEdgeExt;

  _state;

  _registeredAgents;

  constructor(aquamanEdgeExt) {
    
    this._aquamanEdgeExt = aquamanEdgeExt;

    this._registeredAgents = [
    ];
  }

  enjoy() {

    this._registeredAgents.forEach(item => item.enjoy());
  }

  handleEvent(e) {
    
    if (!(this._state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'Port.stateChanged':

        this._state = e.detail.state;

        this._registeredAgents.forEach(item => item.handleEvent(e));

        break;

      case 'Bug.conversationIntercepted':

        this._registeredAgents.forEach(item => item.handleEvent(e));

        break;

      case 'AquamanEdgeExt.workflowQueued':
      case 'AquamanEdgeExt.workflowProgressed':

        this._aquamanEdgeExt.handleEvent(e);

        break;

      case 'Aquaman.workflowApproved':
      case 'Aquaman.workflowCanceled':

        this._registeredAgents.filter(item => item.constructor.name === e.detail.agent).forEach(item => item.handleEvent(e));

        break;
    }
  }
};
