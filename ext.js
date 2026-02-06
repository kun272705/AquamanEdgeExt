
import { Action } from './action.js';
import { Tab } from './tab.js';
import { Bug } from './bug.js';
import { Leader } from './leader.js';
import { Port } from './port.js';

export class Ext {

  action;

  tab;

  bug;

  leader;

  port;

  state;

  constructor() {

    this.action = new Action(this);

    this.tab = new Tab(this);

    this.bug = new Bug(this);

    this.leader = new Leader(this);

    this.port = new Port(this);
  }

  enjoy() {

    this.action.enjoy();

    this.tab.enjoy();

    this.bug.enjoy();

    this.leader.enjoy();

    this.port.enjoy();
  }

  handleEvent(e) {

    if (!(this.state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowCompleted':
      case 'Agent.workflowStuck':

        this.port.handleEvent(e);

        break;

      case 'App.workflowAccepted':
      case 'App.workflowCanceled':

        this.leader.handleEvent(e);

        break;

      case 'Bug.conversationIntercepted':

        this.leader.handleEvent(e);

        break;

      case 'Port.stateChanged':

        this.state = e.detail.state;

        this.action.handleEvent(e);

        this.tab.handleEvent(e);

        this.bug.handleEvent(e);

        this.leader.handleEvent(e);

        break;
    }
  }
};
