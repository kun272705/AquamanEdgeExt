
export class DouyinChannelExporter {

  leader;

  state;

  pattern;

  workflows;

  constructor(leader) {

    this.leader = leader;

    this.pattern = new URLPattern('https://www.douyin.com/user/:channelId{/}?');

    this.workflows = new Map();
  }

  enjoy() {
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.tpye) {

      case 'App.workflowAccepted':

        break;

      case 'App.workflowRejected':

        break;

      case 'App.workflowCanceled':

        break;

      case 'Bug.conversationIntercepted':

        break;

      case 'Port.stateChanged':

        this.state = e.detail.state;

        break;
    }
  }
};
