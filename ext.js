
import { Action } from './action.js';
import { Tab } from './tab.js';
import { Bug } from './bug.js';
import { Leader } from './leader.js';
import { Port } from './port.js';

export class Ext {

  _action;

  _tab;

  _bug;

  _leader;

  _port;

  _state;

  constructor() {

    this._action = new Action(this);

    this._tab = new Tab(this);

    this._bug = new Bug(this);

    this._leader = new Leader(this);

    this._port = new Port(this);
  }

  enjoy() {

    this._action.enjoy();

    this._tab.enjoy();

    this._bug.enjoy();

    this._leader.enjoy();

    this._port.enjoy();
  }

  handleEvent(e) {

    if (!(this._state === 'on' || e.type === 'Port.stateChanged')) return;

    switch (e.type) {

      case 'Agent.workflowQueued':
      case 'Agent.workflowProgressed':

        this._port.handleEvent(e);

        break;

      case 'Console.workflowAccepted':
      case 'Console.workflowCanceled':

        this._leader.handleEvent(e);

        break;

      case 'Bug.conversationIntercepted':

        this._leader.handleEvent(e);

        break;

      case 'Port.stateChanged':

        this._state = e.detail.state;

        this._action.handleEvent(e);

        this._tab.handleEvent(e);

        this._bug.handleEvent(e);

        this._leader.handleEvent(e);

        break;
    }
  }
};
