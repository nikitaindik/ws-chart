import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { loadSegmentList, chooseSegment } from '../actions';
import { selectSegments } from '../selectors';

import SegmentList from './SegmentList';

const SegmentListContainer = ({
  areSegmentsLoaded,
  loadList,
  chooseSegment,
  segments,
  activeSegmentId,
}) => {
  useEffect(loadList, []);

  if (!areSegmentsLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <SegmentList
      segments={segments}
      onSegmentClick={chooseSegment}
      activeSegmentId={activeSegmentId}
    />
  );
};

const mapStateToProps = state => ({
  segments: selectSegments(state),
  areSegmentsLoaded: state.segments.isListLoaded,
  activeSegmentId: state.segments.activeSegmentId,
});

const mapDispatchToProps = {
  loadList: loadSegmentList,
  chooseSegment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SegmentListContainer);
