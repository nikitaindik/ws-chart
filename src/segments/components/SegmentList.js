import React from 'react';
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

export default SegmentList;
