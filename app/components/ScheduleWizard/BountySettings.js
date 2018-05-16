import React from 'react';
import { observer, inject } from 'mobx-react';
import AbstractSetting from './AbstractSetting';
import BountyEstimator from './BountySettings/BountyEstimator';

@inject('scheduleStore')
@inject('transactionStore')
@observer
class BountySettings extends AbstractSetting {

  constructor (props) {
    super(props);
    const { _validations, _validationsErrors } = this.props;
    this._validations = _validations.BountySettings;
    this._validationsErrors = _validationsErrors.BountySettings;
    this.toggleRequiredDeposit = this.toggleRequiredDeposit.bind(this);

    this.state = {
      timestamp: null,
      bountiesNum: null,
      bountyAvg: 'Loading...',
      bountyMin: 'Loading...',
      bountyMax: 'Loading...'
    };
  }
  validators = {
    timeBounty: this.decimalValidator(),
    deposit: this.decimalValidator(),
    requireDeposit: this.booleanValidator()
  }

  toggleRequiredDeposit() {
    const { scheduleStore } = this.props;
    scheduleStore.requireDeposit = !scheduleStore.requireDeposit;
  }

  async fillBountiesEstimator(windowStart) {
    const { transactionStore, scheduleStore } = this.props;
    const bounties = await transactionStore.getBountiesForBucket(
      windowStart,
      scheduleStore.isUsingTime
    );
    this.setState(bounties);
  }

  async componentDidMount() {
    // Since we can't use observables in functions other than render()...
    // Use an interval function to track the state of the windowStart
    this.interval = setInterval(async() => {
      const { transactionTimestamp, blockNumber } = this.props.scheduleStore;

      // If the timestamp has changed - fill the bounties widget again
      if (this.state.timestamp !== transactionTimestamp){
        await this.fillBountiesEstimator(transactionTimestamp);
        this.setState({ timestamp: transactionTimestamp });

      // If the starting block number has changed - fill the bounties widget again
      } else if (this.state.blockNumber !== blockNumber) {
        await this.fillBountiesEstimator(blockNumber);
        this.setState({ blockNumber: blockNumber });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { scheduleStore } = this.props;
    const { _validations, _validationsErrors } = this;
    const { bountiesNum, bountyAvg, bountyMax, bountyMin } = this.state;

    const bountyEstimator = bountiesNum > 0
      ? <BountyEstimator bountyAvg={bountyAvg} bountyMin={bountyMin} bountyMax={bountyMax} />
      : <div className="h-100 vertical-align">No bounties scheduled for that time window yet.</div>;

    return (
      <div id="bountySettings" className="tab-pane slide">
        <div className="d-sm-block d-md-none">
          <h2 className="m-b-20">Bounty</h2>
          <hr/>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className={'form-group form-group-default required ' + (_validations.timeBounty ? '' : ' has-error')}>
              <label>Time Bounty</label>
              <input type="number" placeholder="Enter Time Bounty in ETH" value={scheduleStore.timeBounty} onBlur={this.validate('timeBounty')} onChange={this.onChange('timeBounty') } className="form-control"></input>
            </div>
            {!_validations.timeBounty &&
              <label className="error">{_validationsErrors.timeBounty}</label>
              }
          </div>
          <div className="col-md-6">
            {bountyEstimator}
          </div>
        </div>

        <div className={'checkbox check-primary' + (_validations.requireDeposit ? '' : ' has-error')}>
          <input type="checkbox" id="checkboxRequireDeposit" onChange={this.toggleRequiredDeposit} checked={scheduleStore.requireDeposit} />
          <label htmlFor="checkboxRequireDeposit">Require Deposit</label>
        </div>
        {scheduleStore.requireDeposit &&
          <div className="row">
            <div className="col-md-4">
              <div className={'form-group form-group-default required ' + (_validations.deposit ? '' : ' has-error')}>
                <label>Deposit</label>
                <input type="number" value={scheduleStore.deposit} onBlur={this.validate('deposit')} onChange={this.onChange('deposit')} placeholder="Enter Deposit in ETH" className="form-control"></input>
              </div>
              {!_validations.timeBounty &&
                <label className="error">{_validationsErrors.deposit}</label>
                }
            </div>
          </div>
        }
      </div>
    );
  }
}

export default BountySettings;
