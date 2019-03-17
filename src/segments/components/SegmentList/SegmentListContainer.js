import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { loadSegmentList, chooseSegment } from '../../actions';
import {
  selectSegments,
  selectIsListLoaded,
  selectActiveSegmentId,
} from '../../selectors';

import SegmentList from './SegmentList';

const SegmentListContainer = ({
  isListLoaded,
  loadList,
  chooseSegment,
  segments,
  activeSegmentId,
}) => {
  useEffect(() => {
    loadList();
  }, []);

  if (!isListLoaded) {
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
  isListLoaded: selectIsListLoaded(state),
  activeSegmentId: selectActiveSegmentId(state),
});

const mapDispatchToProps = {
  loadList: loadSegmentList,
  chooseSegment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SegmentListContainer);
