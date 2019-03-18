import React from 'react';
import Button from '../../../components/Button';

const SegmentList = ({ segments, activeSegmentId, onSegmentClick }) => (
  <div>
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

export default SegmentList;
