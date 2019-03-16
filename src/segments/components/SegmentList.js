import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { loadSegmentList, chooseSegment } from '../actions';
import { selectSegments } from '../selectors';

import Button from '../../components/Button';

import style from './SegmentList.module.css';

const SegmentList = ({ segments, activeSegmentId, onSegmentClick }) => (
  <div className={style.list}>
    {segments.map(segment => (
      <div key={segment.id}>
        <Button
          isActive={segment.id === activeSegmentId}
          onClick={() => onSegmentClick(segment.id)}
        >
          {segment.name}
        </Button>
      </div>
    ))}
  </div>
);

const SegmentListContainer = ({
  areSegmentsLoaded,
  loadList,
  chooseSegment,
  segments,
  activeSegmentId,
}) => {
  useEffect(() => {
    loadList();
  }, []);

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
