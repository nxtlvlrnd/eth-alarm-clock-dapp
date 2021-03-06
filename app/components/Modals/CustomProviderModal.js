import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { CUSTOM_PROVIDER_NET_ID } from '../../config/web3Config';
import isUrl from 'is-url';

@inject('timeNodeStore')
@observer
class CustomProviderModal extends Component {
  constructor() {
    super();
    this.state = {
      disabled: true,
      error: null
    };
    this.setCustomProvider = this.setCustomProvider.bind(this);
    this.validateProviderUrl = this.validateProviderUrl.bind(this);
  }

  async setCustomProvider() {
    const { disabled } = this.state;
    const url = this.providerInputField.value;
    const providerHasNecessaryMethods = await this.props.timeNodeStore.testCustomProvider(url);

    if (!disabled) {
      if (providerHasNecessaryMethods) {
        this.props.timeNodeStore.setCustomProvider(CUSTOM_PROVIDER_NET_ID, url);
        return;
      }
      this.setState({
        error: providerHasNecessaryMethods
          ? null
          : 'Your provider does not support eth_getFilter method. Please provide a compatible web3 provider.'
      });
    }
  }

  async validateProviderUrl() {
    const urlValid = isUrl(this.providerInputField.value);

    this.setState({
      error: urlValid ? null : 'Not a valid URL',
      disabled: !urlValid
    });
  }

  render() {
    return (
      <div
        className="modal fade stick-up"
        id="customProviderModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="customProviderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header clearfix text-left separator">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                <i className="pg-close fs-14" />
              </button>
              <h3 className="timenode-modal-title m-0">
                Enter a <span className="semi-bold">custom RPC provider URL</span>
              </h3>
            </div>
            <div className="modal-body">
              <hr />
              <div className={'form-group form-group-default required'}>
                <label>Custom RPC provider URL</label>
                <input
                  type="text"
                  placeholder="http://localhost:8545"
                  className="form-control"
                  ref={el => (this.providerInputField = el)}
                  onChange={this.validateProviderUrl}
                  autoFocus
                />
              </div>
              <span className="text-danger semi-bold">{this.state.error}</span>
            </div>
            <div className="modal-footer">
              <div className="row">
                <div className="col-md-6">
                  <button className="btn btn-light btn-block" type="button" data-dismiss="modal">
                    Cancel
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={this.setCustomProvider}
                    disabled={this.state.disabled}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CustomProviderModal.propTypes = {
  timeNodeStore: PropTypes.any
};

export { CustomProviderModal };
