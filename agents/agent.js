
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

        this.startWorkflow(e.detail);

        break;

      case 'App.workflowCanceled':

        this.stopWorkflow();

        break;

      case 'Bug.conversationIntercepted':

        this.examineConversation(e.detail);

        break;

      case 'Port.stateChanged':

        this.state = e.detail.state;

        if (this.state === 'off') this.stopWorkflow();

        break;
    }
  }

  examineConversation(conversation) {

    throw new Error('Not implemented');
  }

  startWorkflow(workflow) {

    throw new Error('Not implemented');
  }

  stopWorkflow() {

    throw new Error('Not implemented');
  }
};
