import React from 'react';
import { render } from 'react-testing-library';

import Chart from './Chart';

test('Chart snapshot', () => {
  const mockedProps = {
    data: [
      { timestamp: 1, segmentId: '10', added: 1, removed: 1, segmentSize: 1 },
    ],
    setActiveBarData: jest.fn(),
    setIsHovered: jest.fn(),
  };

  const { container } = render(<Chart {...mockedProps} />);
  expect(container).toMatchSnapshot();
});
