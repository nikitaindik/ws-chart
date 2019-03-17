import React from 'react';

import Button from '../../components/Button';

import style from './ChartMode.module.css';

const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
const sixHoursInMs = 6 * 60 * 60 * 1000;
const oneHourInMs = 1 * 60 * 60 * 1000;
const fiveMinsInMs = 5 * 60 * 1000;

const modes = [
  { label: 'Last 30 days', barSize: oneDayInMs },
  { label: 'Last 7 days', barSize: sixHoursInMs },
  { label: 'Last 24 hours', barSize: oneHourInMs },
  { label: 'Last 60 minutes', barSize: fiveMinsInMs },
];

const ChartMode = ({ activeBarSize, onChangeModeClick }) => (
  <div className={style.wrap}>
    {modes.map(mode => (
      <Button
        isActive={activeBarSize === mode.barSize}
        onClick={() => onChangeModeClick(mode.barSize)}
        key={mode.barSize}
      >
        {mode.label}
      </Button>
    ))}
  </div>
);

export default ChartMode;
