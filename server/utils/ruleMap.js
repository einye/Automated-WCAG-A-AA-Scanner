// server/utils/ruleMap.js

/**
 * Each rule maps to:
 * - groups: [visual, motor, cognitive]
 * - weight: 1–3 (3 = high severity)
 */

module.exports = {
  
  // VISUAL IMPAIRMENT
  
  'color-contrast': { groups: ['visual'], weight: 3 },
  'color-contrast-enhanced': { groups: ['visual'], weight: 2 }, // best practice fallback
  'image-alt': { groups: ['visual'], weight: 3 },
  'object-alt': { groups: ['visual'], weight: 2 },
  'input-image-alt': { groups: ['visual'], weight: 2 },
  'area-alt': { groups: ['visual'], weight: 2 },
  'svg-img-alt': { groups: ['visual'], weight: 2 },
  'role-img-alt': { groups: ['visual'], weight: 2 },
  'image-redundant-alt': { groups: ['visual'], weight: 1 },
  'alt-space-value': { groups: ['visual'], weight: 1 },

  'label': { groups: ['visual'], weight: 3 },
  'form-field-multiple-labels': { groups: ['visual'], weight: 1 },
  'aria-label': { groups: ['visual'], weight: 1 },

  'heading-order': { groups: ['visual'], weight: 2 },
  'page-has-heading-one': { groups: ['visual'], weight: 2 },

  'document-title': { groups: ['visual'], weight: 2 },

  'html-has-lang': { groups: ['visual'], weight: 2 },
  'html-lang-valid': { groups: ['visual'], weight: 1 },
  'html-xml-lang-mismatch': { groups: ['visual'], weight: 1 },

  'link-in-text-block': { groups: ['visual'], weight: 2 },
  'link-name': { groups: ['visual'], weight: 2 },

  'empty-heading': { groups: ['visual'], weight: 2 },
  'p-as-heading': { groups: ['visual'], weight: 1 },

  'aria-allowed-attr': { groups: ['visual'], weight: 1 },
  'aria-valid-attr': { groups: ['visual'], weight: 1 },
  'aria-valid-attr-value': { groups: ['visual'], weight: 1 },

  
  // MOTOR IMPAIRMENT
  
  'focus-visible': { groups: ['motor'], weight: 3 },
  'focus-order-semantics': { groups: ['motor'], weight: 2 },
  'tabindex': { groups: ['motor'], weight: 2 },
  'accesskeys': { groups: ['motor'], weight: 1 },

  'bypass': { groups: ['motor'], weight: 2 },
  'skip-link': { groups: ['motor'], weight: 2 },

  'landmark-one-main': { groups: ['motor'], weight: 2 },
  'landmark-unique': { groups: ['motor'], weight: 2 },
  'region': { groups: ['motor'], weight: 1 },

  'button-name': { groups: ['motor'], weight: 3 },
  'link-name': { groups: ['motor'], weight: 2 },

  'scrollable-region-focusable': { groups: ['motor'], weight: 2 },

  'keyboard': { groups: ['motor'], weight: 3 }, // inferred grouping for keyboard accessibility
  'no-keyboard-trap': { groups: ['motor'], weight: 3 },

  
  // COGNITIVE IMPAIRMENT

  'duplicate-id': { groups: ['cognitive'], weight: 2 },
  'duplicate-id-active': { groups: ['cognitive'], weight: 2 },
  'duplicate-id-aria': { groups: ['cognitive'], weight: 2 },

  'aria-roles': { groups: ['cognitive'], weight: 1 },
  'aria-required-children': { groups: ['cognitive'], weight: 1 },
  'aria-required-parent': { groups: ['cognitive'], weight: 1 },
  'aria-command-name': { groups: ['cognitive'], weight: 2 },
  'aria-input-field-name': { groups: ['cognitive'], weight: 2 },
  'aria-toggle-field-name': { groups: ['cognitive'], weight: 2 },

  'autocomplete-valid': { groups: ['cognitive'], weight: 2 },

  'label-title-only': { groups: ['cognitive'], weight: 1 },
  'form-field-multiple-labels': { groups: ['cognitive'], weight: 1 },

  'aria-hidden-focus': { groups: ['cognitive'], weight: 2 },
  'aria-dialog-name': { groups: ['cognitive'], weight: 2 },

  'meta-refresh': { groups: ['cognitive'], weight: 3 },
  'meta-viewport': { groups: ['cognitive'], weight: 1 },

  'blink': { groups: ['cognitive'], weight: 3 },
  'marquee': { groups: ['cognitive'], weight: 3 },

  'frame-title': { groups: ['cognitive'], weight: 2 },
  'iframe-title': { groups: ['cognitive'], weight: 2 },

  
  // SHARED (MULTI-GROUP IMPACT)
  
  'document-title': { groups: ['visual', 'cognitive'], weight: 2 },
  'link-name': { groups: ['visual', 'motor', 'cognitive'], weight: 3 },
  'button-name': { groups: ['motor', 'cognitive'], weight: 3 },
  'label': { groups: ['visual', 'cognitive'], weight: 3 },
  'heading-order': { groups: ['visual', 'cognitive'], weight: 2 },
  'bypass': { groups: ['motor', 'cognitive'], weight: 2 },
};
