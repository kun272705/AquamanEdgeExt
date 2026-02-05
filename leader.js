
import { settings } from './settings.js';

export class Leader {

  ext;

  state;

  agents;

  constructor(ext) {
    
    this.ext = ext;

    this.agents = settings.registeredAgents.map((item) => new item(this));
  }

  enjoy() {

    this.agents.forEach((item) => item.enjoy());
  }

  handleEvent(e) {
    
    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowStuck':
      case 'Agent.workflowCompleted':

        this.ext.handleEvent(e);

        break;

      case 'App.workflowAccepted':
      case 'App.workflowRejected':
      case 'App.workflowCanceled':

        const agent = e.detail.agent;

        this.agents
          .filter((item) => item.constructor.name === agent)
          .forEach((item) => item.handleEvent(e));

        break;

      case 'Bug.conversationIntercepted':

        const url = e.detail.tab.url;

        this.agents
          .filter((item) => item.pattern.test(url) === true)
          .forEach((item) => item.handleEvent(e));

        break;

      case 'Port.stateChanged':

        this.state = e.detail.state;

        this.agents.forEach((item) => item.handleEvent(e));

        break;
    }
  }
};
