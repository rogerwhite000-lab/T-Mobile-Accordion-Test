# Documentation — Accessible Accordion (TypeScript)

Added TypeScript types and roving tabindex behavior.

Roving tabindex rationale:
- Improves keyboard navigation: users tab once into the accordion, then use arrow keys to move between headers.
- Reduces number of focusable elements for keyboard users.

The component props are strictly typed in `AccordionProps`.
