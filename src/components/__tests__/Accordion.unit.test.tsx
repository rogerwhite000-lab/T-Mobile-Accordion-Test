import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from '../Accordion';

const items = [
  { id: 'x', title: 'X', content: 'x' },
  { id: 'y', title: 'Y', content: 'y' },
];

test('roving tabindex: only one button has tabindex=0', () => {
  render(<Accordion items={items} />);
  const buttons = screen.getAllByRole('button');
  const tabIndices = buttons.map((b) => b.getAttribute('tabindex'));
  // first should be "0", others "-1"
  expect(tabIndices[0]).toBe('0');
  for (let i = 1; i < tabIndices.length; i++) {
    expect(tabIndices[i]).toBe('-1');
  }
});

test('ArrowDown moves focus and updates tabindex', () => {
  render(<Accordion items={items} />);
  const [btnX, btnY] = screen.getAllByRole('button');
  btnX.focus();
  fireEvent.keyDown(btnX, { key: 'ArrowDown' });
  expect(btnY).toHaveFocus();
  // now btnY should be tabindex=0
  expect(btnY).toHaveAttribute('tabindex', '0');
  expect(btnX).toHaveAttribute('tabindex', '-1');
});
