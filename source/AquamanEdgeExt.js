
import { Action } from './Action.js';
import { Tab } from './Tab.js';
import { Bug } from './Bug.js';
import { Leader } from './Leader.js';
import { Port } from './Port.js';

export class AquamanEdgeExt {

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

      case 'Port.stateChanged':

        this._state = e.detail.state;

        this._action.handleEvent(e);

        this._tab.handleEvent(e);

        this._bug.handleEvent(e);

        this._leader.handleEvent(e);

        break;

      case 'Bug.conversationIntercepted':

        this._leader.handleEvent(e);

        break;

      case 'AquamanEdgeExt.workflowQueued':
      case 'AquamanEdgeExt.workflowProgressed':

        this._port.handleEvent(e);

        break;

      case 'Aquaman.workflowApproved':
      case 'Aquaman.workflowCanceled':

        this._leader.handleEvent(e);

        break;
    }
  }
};
