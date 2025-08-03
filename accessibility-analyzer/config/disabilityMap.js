// config/disabilityMap.js

/*
  This map translates axe-core rule IDs to disability impacts.
  The weights are on a scale of 1-3:
  1: Minor impact / Best Practice
  2: Moderate impact / Recommended
  3: Critical impact / Essential
*/

export const disabilityMap = {
  // Existing Rules from your list
  'image-alt': {
    cognitive: { weight: 3, description: 'Understanding of purpose' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 3, description: 'Screen reader users' },
  },
  'audio-caption': { // This is not a standard axe-core rule ID. `audio-caption` is a good placeholder.
    cognitive: { weight: 1, description: 'No direct impact' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 2, description: 'Hard of hearing users' },
  },
  'video-caption': {
    cognitive: { weight: 1, description: 'No direct impact' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 2, description: 'Hard of hearing users' },
  },
  'tabindex': {
    cognitive: { weight: 1, description: 'No direct impact' },
    motor: { weight: 2, description: 'Core for keyboard users' },
    visual: { weight: 2, description: 'Keyboard-reliant screen reader users' },
  },
  'focus-order': {
    cognitive: { weight: 2, description: 'Predictability' },
    motor: { weight: 3, description: 'Core for keyboard users' },
    visual: { weight: 2, description: 'Screen reader users' },
  },
  'aria-required-parent': {
    cognitive: { weight: 2, description: 'Understanding of structure' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 3, description: 'Screen reader users' },
  },
  'link-name': {
    cognitive: { weight: 3, description: 'Predictability of navigation' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 3, description: 'Screen reader users' },
  },
  'heading-levels': {
    cognitive: { weight: 3, description: 'Content structure' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 3, description: 'Screen reader users' },
  },
  'color-contrast': {
    cognitive: { weight: 2, description: 'Readability' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 3, description: 'Low-vision users' },
  },
  'resize-text': {
    cognitive: { weight: 2, description: 'Readability' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 3, description: 'Low-vision users' },
  },
  'focus-visible': {
    cognitive: { weight: 2, description: 'Predictability' },
    motor: { weight: 3, description: 'Essential for keyboard use' },
    visual: { weight: 3, description: 'Sighted keyboard users' },
  },
  'label': {
    cognitive: { weight: 3, description: 'Understanding form' },
    motor: { weight: 2, description: 'Easier to interact' },
    visual: { weight: 3, description: 'Screen reader users' },
  },
  'skip-link': {
    cognitive: { weight: 1, description: 'No direct impact' },
    motor: { weight: 3, description: 'Essential for keyboard users' },
    visual: { weight: 2, description: 'Screen reader users' },
  },
  'html-has-lang': {
    cognitive: { weight: 2, description: 'Understanding content' },
    motor: { weight: 1, description: 'No direct impact' },
    visual: { weight: 3, description: 'Screen reader pronunciation' },
  },
  // New WCAG 2.2 Rules from your list
  'consistent-help': {
    cognitive: { weight: 3, description: 'Crucial for finding help' },
    motor: { weight: 2, description: 'Less cognitive load' },
    visual: { weight: 2, description: 'Less time spent finding' },
  },
  'redundant-entry': {
    cognitive: { weight: 3, description: 'Minimizes memory burden' },
    motor: { weight: 2, description: 'Reduces re-typing' },
    visual: { weight: 1, description: 'No direct impact' },
  },
  'dragging-movements': {
    cognitive: { weight: 1, description: 'No direct impact' },
    motor: { weight: 3, description: 'Provides alternatives' },
    visual: { weight: 2, description: 'Can be difficult with magnification' },
  },
  'target-size': {
    cognitive: { weight: 2, description: 'Easier to tap' },
    motor: { weight: 3, description: 'Essential for touch/motor control' },
    visual: { weight: 2, description: 'Easier to see and select' },
  },
  'accessible-auth': {
    cognitive: { weight: 3, description: 'Crucial for memory' },
    motor: { weight: 2, description: 'Reduces re-typing' },
    visual: { weight: 2, description: 'Less cognitive load' },
  },
  'focus-not-obscured': {
    cognitive: { weight: 2, description: 'Maintains focus' },
    motor: { weight: 3, description: 'Essential for keyboard use' },
    visual: { weight: 3, description: 'Sighted keyboard users' },
  },
};