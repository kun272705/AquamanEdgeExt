
import { settings } from './settings.js';

export class Leader {

  _ext;

  _state;

  _agents;

  constructor(ext) {
    
    this._ext = ext;

    this._agents = settings.registeredAgents.map(item => new item(this));
  }

  enjoy() {

    this._agents.forEach(item => item.enjoy());
  }

  handleEvent(e) {
    
    if (!(this._state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowProgressed':

        this._ext.handleEvent(e);

        break;

      case 'Bar.workflowAccepted':
      case 'Bar.workflowCanceled':

        this._agents.filter(item => item.constructor.name === e.detail.agent).forEach(item => item.handleEvent(e));

        break;

      case 'Bug.conversationIntercepted':

        this._agents.forEach(item => item.handleEvent(e));

        break;

      case 'Port.stateChanged':

        this._state = e.detail.state;
        this._agents.forEach(item => item.handleEvent(e));

        break;
    }
  }
};
