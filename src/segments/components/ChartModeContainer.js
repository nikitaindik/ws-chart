import { connect } from 'react-redux';

import { changeMode } from '../actions';

import ChartMode from './ChartMode';

const mapStateToProps = state => ({
  activeBarSize: state.segments.activeBarSize,
});

const mapDispatchToProps = {
  onChangeModeClick: changeMode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartMode);
