// server/utils/ruleMap.js
module.exports = {
  // === VISUAL IMPAIRMENT ===
  'image-alt': { groups: ['visual'], weight: 3 },
  'area-alt': { groups: ['visual'], weight: 3 },
  'object-alt': { groups: ['visual'], weight: 3 },
  'input-image-alt': { groups: ['visual'], weight: 3 },
  'aria-label-misuse': { groups: ['visual'], weight: 2 },

  'html-has-lang': { groups: ['visual'], weight: 1 },
  'document-title': { groups: ['visual'], weight: 2 },
  'landmark-one-main': { groups: ['visual'], weight: 1 },
  'heading-order': { groups: ['visual'], weight: 2 },
  'list': { groups: ['visual'], weight: 1 },
  'link-name': { groups: ['visual', 'motor'], weight: 2 },
  'button-name': { groups: ['visual', 'motor'], weight: 2 },
  'form-field-label': { groups: ['visual', 'motor'], weight: 2 },
  'definition-list': { groups: ['visual'], weight: 1 },
  'dlitem': { groups: ['visual'], weight: 1 },

  'color-contrast': { groups: ['visual'], weight: 2 },
  'non-text-contrast': { groups: ['visual'], weight: 2 },
  'focus-visible': { groups: ['visual', 'motor'], weight: 3 },

  // === MOTOR IMPAIRMENT ===
  'tabindex': { groups: ['motor'], weight: 2 },
  'input-button-name': { groups: ['motor'], weight: 2 },
  'aria-input-field-name': { groups: ['motor'], weight: 2 },
  'bypass': { groups: ['motor'], weight: 1 },

  'blink': { groups: ['motor'], weight: 2 },
  'marquee': { groups: ['motor'], weight: 2 },

  // === DEAF ===
  'audio-caption': { groups: ['deaf'], weight: 3 },
  'video-caption': { groups: ['deaf'], weight: 3 },
  'audio-control': { groups: ['deaf'], weight: 1 },

  // === MANUAL-ONLY CHECKS (examples) ===
  '_manual_video_sync': { groups: ['deaf'], weight: 2, manualOnly: true },
  '_manual_live_caption': { groups: ['deaf'], weight: 2, manualOnly: true },
  '_manual_keyboard_trap': { groups: ['motor'], weight: 2, manualOnly: true },
  '_manual_form_instruction': { groups: ['motor'], weight: 1, manualOnly: true },
  '_manual_alt_text_quality': { groups: ['visual'], weight: 2, manualOnly: true },
};
