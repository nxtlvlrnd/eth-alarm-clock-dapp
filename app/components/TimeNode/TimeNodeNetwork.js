import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { ActiveTimeNodesGraph, TimeBountiesGraph, ProcessedTransactionsGraph } from './Network';
import { BeatLoader } from 'react-spinners';

@inject('keenStore')
@inject('timeNodeStore')
@observer
class TimeNodeNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyPollingInterval: props.keenStore.historyPollingInterval
    };
  }

  componentDidMount() {
    this.activeTimeNodesFetchInterval = setInterval(
      () => this.props.keenStore.refreshActiveTimeNodesHistory(),
      this.props.keenStore.historyPollingInterval
    );
  }

  componentWillUnmount() {
    if (this.activeTimeNodesFetchInterval) {
      clearInterval(this.activeTimeNodesFetchInterval);
    }
  }

  componentDidUpdate() {
    const newInterval = this.props.keenStore.historyPollingInterval;
    const { historyPollingInterval } = this.state;

    if (historyPollingInterval !== newInterval) {
      this.setState({ historyPollingInterval: newInterval });
      clearInterval(this.activeTimeNodesFetchInterval);
      this.activeTimeNodesFetchInterval = setInterval(
        () => this.props.keenStore.refreshActiveTimeNodesHistory(),
        newInterval
      );
    }
  }

  deepCopy(array) {
    return JSON.parse(JSON.stringify(array));
  }

  render() {
    const {
      bountiesGraphData,
      updatingBountiesGraphInProgress,
      processedTxs,
      updatingProcessedTxsGraphInProgress
    } = this.props.timeNodeStore;
    const {
      historyActiveTimeNodes,
      gettingActiveTimeNodesHistory,
      isBlacklisted
    } = this.props.keenStore;

    const shouldShowActiveTimeNodesGraph =
      (historyActiveTimeNodes.length > 0 && !gettingActiveTimeNodesHistory) || isBlacklisted;

    const shouldShowTimeBountiesGraph =
      bountiesGraphData !== null && !updatingBountiesGraphInProgress;

    const shouldShowProcessedTxsGraph =
      processedTxs !== null && !updatingProcessedTxsGraphInProgress;

    return (
      <div id="timeNodeNetwork">
        <div className="row">
          <div className="col-md-6" style={{ display: 'flex' }}>
            <div data-pages="card" className="card card-default" style={{ alignItems: 'stretch' }}>
              <div className="card-header">
                <div className="card-title">Active TimeNodes (last 24h)</div>
                <div className="card-controls">
                  <ul>
                    <li>
                      {shouldShowActiveTimeNodesGraph ? (
                        <a
                          data-toggle="refresh"
                          className="card-refresh"
                          onClick={async () =>
                            await this.props.keenStore.refreshActiveTimeNodesHistory()
                          }
                        >
                          <i className="card-icon card-icon-refresh" />
                        </a>
                      ) : (
                        <BeatLoader size={6} />
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body horizontal-center">
                {isBlacklisted ? (
                  <div>
                    <h3 className="text-warning">
                      <i className="fa fa-info-circle" />
                    </h3>
                    <p>Please whitelist our site to see this graph.</p>
                  </div>
                ) : (
                  <ActiveTimeNodesGraph data={this.deepCopy(historyActiveTimeNodes)} />
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div data-pages="card" className="card card-default">
              <div className="card-header">
                <div className="card-title">Average TimeBounty (last 24h)</div>
                <div className="card-controls">
                  <ul>
                    <li>
                      {shouldShowTimeBountiesGraph ? (
                        <a
                          data-toggle="refresh"
                          className="card-refresh"
                          onClick={() => this.props.timeNodeStore.updateBountiesGraph()}
                        >
                          {' '}
                          <i className="card-icon card-icon-refresh" />{' '}
                        </a>
                      ) : (
                        <BeatLoader size={6} />
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body horizontal-center">
                <TimeBountiesGraph data={this.deepCopy(bountiesGraphData)} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div data-pages="card" className="card card-default">
              <div className="card-header">
                <div className="card-title">Processed Transactions (last 24h)</div>
                <div className="card-controls">
                  <ul>
                    <li>
                      {shouldShowProcessedTxsGraph ? (
                        <a
                          data-toggle="refresh"
                          className="card-refresh"
                          onClick={() => this.props.timeNodeStore.updateProcessedTxsGraph()}
                        >
                          <i className="card-icon card-icon-refresh" />
                        </a>
                      ) : (
                        <BeatLoader size={6} />
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body horizontal-center">
                <ProcessedTransactionsGraph data={this.deepCopy(processedTxs)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TimeNodeNetwork.propTypes = {
  keenStore: PropTypes.any,
  timeNodeStore: PropTypes.any
};

export default TimeNodeNetwork;
