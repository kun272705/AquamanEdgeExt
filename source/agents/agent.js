
export class Agent {

  _leader;

  _state;

  constructor(leader) {

    this._leader = leader;
  }

  enjoy() {
  }

  handleEvent(e) {

    if (!(this._state === 'on' || `${e.sender}.${e.type}` === 'Port.stateChanged')) return;

    switch (`${e.sender}.${e.type}`) {

      case 'Port.stateChanged':

        this._state = e.detail.state;
        if (this._state === 'off') this._stopWorkflow();

        break;

      case 'Bug.conversationIntercepted':

        this._examineConversation(e.detail);

        break;

      case 'Aquaman.executeWorkflow':

        this._startWorkflow(e.detail);

        break;

      case 'Aquaman.cancelWorkflow':

        this._stopWorkflow();

        break;
    }
  }

  _examineConversation(_conversation) {

    throw new Error('Not implemented');
  }

  _startWorkflow(_workflow) {

    throw new Error('Not implemented');
  }

  _stopWorkflow() {

    throw new Error('Not implemented');
  }
};
