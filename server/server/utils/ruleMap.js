// server/utils/ruleMap.js

/**
 * Each rule maps to:
 * - groups: [visual, motor, cognitive]
 * - weight: 1–3 (3 = high severity)
 */

module.exports = {
  // === Visual Impairment ===
  'color-contrast': { groups: ['visual'], weight: 3 },
  'image-alt': { groups: ['visual'], weight: 3 },
  'object-alt': { groups: ['visual'], weight: 2 },
  'input-image-alt': { groups: ['visual'], weight: 2 },
  'aria-allowed-attr': { groups: ['visual'], weight: 1 },
  'aria-valid-attr-value': { groups: ['visual'], weight: 1 },
  'aria-valid-attr': { groups: ['visual'], weight: 1 },
  'document-title': { groups: ['visual'], weight: 2 },
  'html-has-lang': { groups: ['visual'], weight: 2 },
  'heading-order': { groups: ['visual'], weight: 2 },
  'label': { groups: ['visual'], weight: 3 },

  // === Motor Impairment ===
  'focus-visible': { groups: ['motor'], weight: 3 },
  'tabindex': { groups: ['motor'], weight: 2 },
  'bypass': { groups: ['motor'], weight: 1 },
  'landmark-one-main': { groups: ['motor'], weight: 2 },
  'region': { groups: ['motor'], weight: 1 },
  'button-name': { groups: ['motor'], weight: 2 },
  'link-name': { groups: ['motor'], weight: 2 },
  'form-field-multiple-labels': { groups: ['motor'], weight: 1 },

  // === Cognitive Impairment ===
  'duplicate-id': { groups: ['cognitive'], weight: 2 },
  'page-has-heading-one': { groups: ['cognitive'], weight: 2 },
  'landmark-unique': { groups: ['cognitive'], weight: 2 },
  'aria-roles': { groups: ['cognitive'], weight: 1 },
  'html-lang-valid': { groups: ['cognitive'], weight: 1 },
  'aria-required-children': { groups: ['cognitive'], weight: 1 },
  'aria-required-parent': { groups: ['cognitive'], weight: 1 },
  'autocomplete-valid': { groups: ['cognitive'], weight: 2 },
};
