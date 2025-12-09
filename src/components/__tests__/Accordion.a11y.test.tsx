import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Accordion from '../Accordion';

const items = [
  { id: 'a', title: 'Question A', content: 'Answer A' },
  { id: 'b', title: 'Question B', content: 'Answer B' },
];

test('has no detectable accessibility violations', async () => {
  const { container } = render(<Accordion items={items} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
