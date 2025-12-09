import React from 'react';
import { createRoot } from 'react-dom/client';
import Accordion from './components/Accordion';
import './styles.css';

const items = [
  { id: 'q1', title: 'What is the return policy?', content: 'You can return items within 30 days of purchase with a receipt.' },
  { id: 'q2', title: 'How long does shipping take?', content: 'Shipping usually takes 3-5 business days.' },
  { id: 'q3', title: 'Do you ship internationally?', content: 'Yes — international shipping is available to selected countries.' },
];

function App(){
  return (
    <main>
      <h1>FAQ — Accessible Accordion (TypeScript)</h1>
      <p>Accordion with roving tabindex keyboard behavior.</p>
      <Accordion items={items} />
    </main>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
