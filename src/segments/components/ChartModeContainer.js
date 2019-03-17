import { connect } from 'react-redux';

import { changeMode } from '../actions';

import { selectActiveBarSize } from '../selectors';

import ChartMode from './ChartMode';

const mapStateToProps = state => ({
  activeBarSize: selectActiveBarSize(state),
});

const mapDispatchToProps = {
  onChangeModeClick: changeMode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartMode);
