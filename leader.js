
import { settings } from './settings.js';

export class Leader {

  ext;

  state;

  agents;

  constructor(ext) {
    
    this.ext = ext;

    this.agents = settings.registeredAgents.map(item => new item(this));
  }

  enjoy() {

    this.agents.forEach(item => item.enjoy());
  }

  handleEvent(e) {
    
    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowCompleted':
      case 'Agent.workflowStuck':

        this.ext.handleEvent(e);

        break;

      case 'App.workflowAccepted':
      case 'App.workflowCanceled':

        this.agents.filter(item => item.constructor.name === e.detail.agentName).forEach(item => item.handleEvent(e));

        break;

      case 'Bug.conversationIntercepted':

        this.agents.forEach(item => item.handleEvent(e));

        break;

      case 'Port.stateChanged':

        this.state = e.detail.state;

        this.agents.forEach(item => item.handleEvent(e));

        break;
    }
  }
};
