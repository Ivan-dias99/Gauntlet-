// @gauntlet/composer — single Composer shared across runtime shells.
//
// Doctrine: there is one Gauntlet Composer. The Composer may run in
// different shells (browser-extension, desktop) but its identity,
// behaviour, rendering, output contract and feel must remain 1:1.
// Runtime differences are expressed through the Ambient capability
// adapter (transport, selection, screenshot, storage, domActions),
// never through a forked Composer.
//
// Shells stay thin: they construct an Ambient and mount the Composer.

export * from './voice';
export * from './markdown';
export * from './types';
export * from './dom-actions';
export * from './ambient';
export * from './composer-client';
export * from './pill-prefs';
export * from './Capsule';
export * from './CommandPalette';
export * from './SettingsDrawer';
export * from './CompactContextSummary';
export * from './placement';
export * from './helpers';
export * from './useTTS';
export * from './useVoiceCapture';
export * from './useAttachments';
export * from './plan-dispatcher';
export * from './ShellPanel';
export * from './ComposeResult';
export * from './PlanRenderer';
export * from './AttachmentChips';
export * from './SlashMenu';
export * from './capsule.css';
export * from './Pill';
export * from './Onboarding';
