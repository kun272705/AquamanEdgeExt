
import { settings } from './settings.js';

export class Leader {

  ext;

  state;

  agents;

  constructor(ext) {
    
    this.ext = ext;

    this.agents = settings.agentRegistry.map((item) => ({
      'patterns': item.patterns.map((element) => new URLPattern(element)),
      'instance': new item['class'](this.ext)
    }));
  }

  enjoy() {
  }

  discoverTask(conversation) {

    const agents = this.agents.filter((item) => (
      item.patterns.find((element) => element.test(conversation.tab.url) === true) !== undefined
    ));

    agents.forEach((item) => item.instance.discoverTask(conversation));
  }

  startExecution(execution) {

    const agent = this.agents.find((item) => item.constructor.name === execution.agent);

    if (agent !== undefined) agent.instance.startExecution(execution);
  }

  stopExecution(execution) {

    const agent = this.agents.find((item) => item.constructor.name === execution.agent);

    if (agent !== undefined) agent.instance.stopExecution(execution);
  }
};
