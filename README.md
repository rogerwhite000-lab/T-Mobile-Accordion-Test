# Accessible Accordion (TypeScript)

This repository contains a small sized React + TypeScript project with a reusable, accessible Accordion (disclosure) component that implements a roving tabindex.

## What changed
- Component converted to TypeScript (`src/components/Accordion.tsx`).
- Keyboard behavior extended to implement roving tabindex: only one header is focusable (tabindex=0) and arrows/home/end change focus and the focusable header.
- Tests updated to TypeScript.

## Quickstart
```bash
npm install
npm start
```
Run tests:
```bash
npm test
```
