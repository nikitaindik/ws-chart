import React from 'react';
import { render } from 'react-testing-library';

import SegmentList from './SegmentList';

test('SegmentList snapshot', () => {
  const mockedProps = {
    segments: [{ name: 'Ten', id: '10' }, { name: 'Twenty', id: '20' }],
    activeSegmentId: '10',
    onSegmentClick: jest.fn(),
  };

  const { container } = render(<SegmentList {...mockedProps} />);
  expect(container).toMatchSnapshot();
});
