import React, { Component } from 'react';
import TransactionScanner from '../TransactionScanner/TransactionScanner';
import { inject, observer } from 'mobx-react';
import NetworkUnsupported from '../Common/NetworkUnsupported';
import PropTypes from 'prop-types';

@inject('loadingStateStore')
@inject('featuresService')
@observer
class TransactionsScheduled extends Component {
  componentDidMount() {
    this.props.loadingStateStore.reset();
  }

  render() {
    const { isCurrentNetworkSupported } = this.props.featuresService;

    return (
      <div className="container-fluid container-fixed-lg">
        <h1 className="view-title">Transaction Scanner - Scheduled</h1>
        <div className="widget-12 card no-border widget-loader-circle no-margin">
          {isCurrentNetworkSupported !== false ? (
            <TransactionScanner includeUnresolved />
          ) : (
            <div className="tab-content p-1 pl-4 pt-4">
              <div className="tab-pane active">
                <NetworkUnsupported />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

TransactionsScheduled.propTypes = {
  featuresService: PropTypes.any,
  loadingStateStore: PropTypes.any
};

export default TransactionsScheduled;
