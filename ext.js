
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

    if (!(e.type === 'stateChanged' || this.state === 'on')) return;

    switch (e.type) {

      case 'stateChanged':

        this.changeState(e.detail.state);

        break;

      case 'conversationIntercepted':

        this.leader.discoverTask(e.detail.conversation);

        break;

      case 'taskDiscovered':
      case 'CAPTCHAPopped':
      case 'executionCompleted':
      case 'executionInterrupted':
      case 'errorOccurred':

        this.port.sendMessage({ 'title': e.type, 'content': e.detail });

        break;

      case 'startExecution':

        this.leader.startExecution(e.detail.execution);

        break;

      case 'stopExecution':

        this.leader.stopExecution(e.detail.execution);

        break;
    }
  }

  changeState(state) {

    this.state = state;

    this.tab.state = this.state;
    this.bug.state = this.state;
    this.leader.state = this.state;
    this.port.state = this.state;

    if (this.state === 'off') this.tab.detachTargets();
  }
};
