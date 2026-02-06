
export class Agent {

  leader;

  state;

  constructor(leader) {

    this.leader = leader;
  }

  enjoy() {
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'App.workflowAccepted':

        const workflow = e.detail;
        this.startWorkflow(workflow);

        break;

      case 'App.workflowCanceled':

        this.stopWorkflow();

        break;

      case 'Bug.conversationIntercepted':

        const conversation = e.detail;
        this.examineConversation(conversation);

        break;

      case 'Port.stateChanged':

        this.state = e.detail.state;

        if (this.state === 'off') this.stopWorkflow();

        break;
    }
  }

  async examineConversation(conversation) {

    throw new Error('Not implemented');
  }

  async startWorkflow(workflow) {

    throw new Error('Not implemented');
  }

  async stopWorkflow() {

    throw new Error('Not implemented');
  }
};
