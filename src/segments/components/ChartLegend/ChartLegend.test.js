import React from 'react';
import { render } from 'react-testing-library';

import ChartLegend from './ChartLegend';

test('ChartLegend snapshot', () => {
  const mockedProps = {
    hoveredBarData: {
      timestamp: 1,
      segmentId: '10',
      added: 1,
      removed: 1,
      segmentSize: 1,
    },
    latestBarData: {
      timestamp: 3,
      segmentId: '10',
      added: 1,
      removed: 1,
      segmentSize: 1,
    },
    showLatestBarData: false,
    activeBarSize: '360000',
  };

  const { container } = render(<ChartLegend {...mockedProps} />);
  expect(container).toMatchSnapshot();
});
