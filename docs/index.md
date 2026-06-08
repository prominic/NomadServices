---
title: Home
layout: home
nav_exclude: true
description: "Nomad.Services - See your HCL Domino NSF analyzed for migration viability in seconds. No signup required for the preview."
permalink: /
---

<!-- markdownlint-disable MD033 MD013 -->
<!--
  Funnel strategy (see docs/FUNNEL.md if we ever extract this):
  Public zone  -> Upload or sample DB -> Analysis -> Results report  (no auth)
  Private zone -> Live-running Nomad preview                         (auth-gated)
  The goal is to let the user experience value before the sign-in wall.
  TODOs around wiring the dropzone to a real analysis endpoint are
  flagged "TODO(backend)" below.

  Section <h2> elements ALL carry an explicit id="..." attribute. This is
  what makes the just-the-docs lunr search results deep-link into the
  correct section on click. Kramdown only auto-generates ids on
  markdown-syntax headings (## ...); these are raw HTML headings, so the
  ids must be hand-written. If you add a new <h2> section, give it an id.
-->

<style>
/*
  Smooth scrolling for in-page anchor jumps (search-result clicks,
  "Try it now" banner link, "Analyze an NSF now" CTA, etc.).
  Falls back to instant scroll for users with prefers-reduced-motion.
*/
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .ns-fade-in { animation: none !important; opacity: 1 !important; }
}

/* ============================================================ */
/* Launching-view styles - used when the user drops/picks a     */
/* file. The whole launching view is hidden by default and      */
/* shown by JS when the URL pushes to /launching/. We're not    */
/* navigating, so the theme header and footer remain in place.  */
/* ============================================================ */
.ns-launching-wrap {
  margin: 1rem auto 3rem;
  /* No inner max-width - defers to the parent .main-content-wrap
     (1200px from the wider color scheme), so analytical card, file
     card and email panel match the marketing content width. The
     progress strip pins itself narrow via its own max-width below. */
  min-height: calc(100vh - 18.5rem);
  padding: 0 1rem;
}
.ns-progress-strip {
  background: rgba(108,92,231,0.08);
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 1.5rem 1.5rem 1.25rem;
  margin: 0 auto 2rem;
  max-width: 640px;
  text-align: center;
}
.ns-progress-status {
  font-size: 0.85rem; color: #9d8df1; text-transform: uppercase;
  letter-spacing: 0.1em; margin-bottom: 0.5rem;
}
.ns-progress-title {
  font-size: 1.1rem; color: #e0e0f0; margin: 0 0 1rem; font-weight: 500;
}
.ns-progress-track {
  height: 6px; background: rgba(108,92,231,0.15); border-radius: 3px;
  overflow: hidden; max-width: 480px; margin: 0 auto;
}
.ns-progress-bar {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, #6c5ce7, #a855f7);
  transition: width 0.4s ease;
}
.ns-progress-sub { font-size: 0.85rem; color: #6a6a7c; margin-top: 0.75rem; }

/* File card - bigger and more prominent in Variant B since it's the
   visual anchor (no stepper). */
.ns-file-card {
  display: flex; align-items: center; gap: 1.25rem;
  background: linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.05) 100%);
  border: 1px solid #6c5ce7;
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}
.ns-file-icon {
  flex: 0 0 auto; width: 56px; height: 56px;
  background: linear-gradient(135deg, #6c5ce7, #a855f7);
  border-radius: 10px; display: flex; align-items: center;
  justify-content: center; font-size: 1.7rem;
}
.ns-file-meta { flex: 1 1 auto; min-width: 0; }
.ns-file-name {
  font-family: monospace; font-size: 1.1rem; color: #e0e0f0;
  word-break: break-all; line-height: 1.3;
}
.ns-file-size { font-size: 0.9rem; color: #a0a0b8; margin-top: 0.25rem; }
.ns-file-status {
  flex: 0 0 auto; color: #66bb6a;
  font-size: 0.95rem; font-weight: 600; white-space: nowrap;
}

/* Action panel: email form */
.ns-action-panel { text-align: center; padding: 0; }
.ns-action-headline {
  color: #e8c547; font-size: 1.6rem; font-weight: 700; margin: 0 0 0.5rem;
}
.ns-action-sub {
  color: #c8c8d8; font-size: 1rem; margin: 0 auto 1.75rem; max-width: 640px;
  line-height: 1.5;
  /* Distributes line breaks across full width instead of leaving an
     orphaned "HCL Nomad." dangling on its own line. Supported in
     Chrome 114+ / Safari 17.4+ / Firefox 121+; older browsers ignore
     it harmlessly and fall back to default wrapping. */
  text-wrap: balance;
}
.ns-email-form { max-width: 420px; margin: 0 auto 0.75rem; }
.ns-email-input {
  width: 100%; padding: 14px 16px; font-size: 1rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid #2a2a4a; border-radius: 8px; color: #e0e0f0;
  box-sizing: border-box; margin-bottom: 0.75rem;
  font-family: inherit;
}
.ns-email-input:focus {
  outline: none; border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.20);
}
.ns-email-input.is-invalid {
  border-color: #e57373;
  box-shadow: 0 0 0 3px rgba(229,115,115,0.18);
}
.ns-btn {
  display: inline-block; padding: 14px 24px;
  font-size: 1rem; font-weight: 600; text-decoration: none;
  border-radius: 8px; text-align: center; cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box; width: 100%;
  font-family: inherit;
}
.ns-btn-primary { background: #6c5ce7; color: #ffffff; border-color: #6c5ce7; }
.ns-btn-primary:hover { background: #7a6ee8; }
.ns-btn-primary:disabled { opacity: 0.6; cursor: wait; }

.ns-form-hint { font-size: 0.9rem; color: #a0a0b8; margin: 0.5rem 0 1.5rem; }
.ns-alt-link { font-size: 0.95rem; color: #c8c8d8; margin: 0 0 1.5rem; }
.ns-alt-link a { color: #e8c547; font-weight: 600; text-decoration: none; }
.ns-alt-link a:hover { text-decoration: underline; }

/* Back-to-home control. Was a faint underlined link styled like
   "Not now, just exploring"; promoted to a visible outline button
   so users have a clear, scannable way out without scrolling for it. */
.ns-exit-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding: 0.65rem 1.4rem;
  background: transparent;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  color: #c8c8d8;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}
.ns-exit-link:hover,
.ns-exit-link:focus-visible {
  color: #e0e0f0;
  border-color: #6c5ce7;
  background: rgba(108,92,231,0.08);
  outline: none;
}

/* Confirmation card after email submit */
.ns-confirmation-card {
  background: linear-gradient(135deg, rgba(76,175,80,0.10) 0%, rgba(76,175,80,0.03) 100%);
  border: 1px solid #43a047;
  border-radius: 14px;
  padding: 2rem 1.5rem;
  text-align: center;
}
.ns-confirmation-icon {
  width: 64px; height: 64px;
  background: rgba(67,160,71,0.18);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.8rem;
}
.ns-confirmation-headline {
  color: #66bb6a; font-size: 1.6rem; font-weight: 700; margin: 0 0 0.5rem;
}
.ns-confirmation-body {
  color: #c8c8d8; font-size: 1rem; margin: 0 auto 1rem; max-width: 440px;
}
.ns-confirmation-email {
  font-family: monospace; color: #e0e0f0; word-break: break-all;
}
.ns-confirmation-hint {
  color: #6a6a7c; font-size: 0.9rem; margin: 0 0 1.5rem;
}
.ns-confirmation-action {
  display: inline-block; padding: 12px 28px;
  font-size: 1rem; font-weight: 600; text-decoration: none;
  border-radius: 8px;
  background: #6c5ce7; color: #ffffff; border: 1px solid #6c5ce7;
  cursor: pointer; font-family: inherit;
}
.ns-confirmation-action:hover { background: #7a6ee8; }
.ns-try-again {
  display: block; color: #6a6a7c;
  font-size: 0.85rem; text-decoration: underline;
  margin-top: 1rem; cursor: pointer;
  background: none; border: none; padding: 0; font-family: inherit;
}
.ns-try-again:hover { color: #9d8df1; }

/* Reveal animation when launching content fades in */
.ns-fade-in { opacity: 0; animation: ns-fade-in 0.5s ease-out forwards; }
@keyframes ns-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade-out for stage transitions (preparing -> analyzing -> results). */
.ns-fade-out { animation: ns-fade-out 0.3s ease-out forwards; }
@keyframes ns-fade-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
}
@media (prefers-reduced-motion: reduce) {
  .ns-fade-out { animation: none !important; opacity: 0 !important; }
}

/* ============================================================ */
/* Stage layout. The launching wrap contains three stages:       */
/*   #stage-preparing  - "Preparing your file" (NSF drop only)   */
/*   #stage-analyzing  - "Analyzing your NSF" (NSF + sample DB)  */
/*   #stage-results    - analytical card (+ optional post-cta)  */
/* See variant-a for full notes.                                 */
/* ============================================================ */
.ns-stage { width: 100%; }
.ns-stage-centered {
  min-height: calc(100vh - 18.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ns-stage-centered > .ns-progress-strip {
  width: 100%;
  margin-bottom: 0;
}
#stage-results.ns-mode-results-only {
  min-height: calc(100vh - 18.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#stage-results.ns-mode-results-only > .ns-analysis-report {
  margin-bottom: 0;
}

/* ============================================================ */
/* Shared analytical report card - used by all three flows.      */
/* (Lifted from the old inline #analysis-report block in the     */
/* marketing view, which is now removed.)                        */
/* ============================================================ */
.ns-analysis-report {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(76,175,80,0.08) 0%, rgba(76,175,80,0.02) 100%);
  border: 1px solid #43a047;
  border-radius: 12px;
  margin-bottom: 2rem;
}
/* File metadata strip — sits at the top of the analytical report     */
/* card. Visually de-emphasized vs. the report content below, and     */
/* separated from it by a thin divider so the file context doesn't   */
/* compete with the analysis itself. */
.ns-report-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #a0a0b8;
  padding-bottom: 1rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid rgba(67,160,71,0.20);
}
.ns-report-meta-name {
  font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;
  color: #e0e0f0;
  font-weight: 500;
}
.ns-report-meta-sep { color: #4a4a64; }
.ns-report-meta-tag {
  margin-left: auto;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: #9d8df1;
  padding: 0.15rem 0.55rem;
  background: rgba(108,92,231,0.10);
  border: 1px solid rgba(108,92,231,0.4);
  border-radius: 999px;
}

.ns-analysis-status {
  color: #9d8df1; text-transform: uppercase; letter-spacing: 0.1em;
  font-size: 0.85rem; margin-bottom: 0.5rem;
}
/* Retained for callers that may still rely on the class, but the
   h3.ns-analysis-title element is removed from the markup so this
   becomes inert in practice. */
.ns-analysis-title {
  color: #e8c547; margin: 0 0 1.5rem; font-size: 1.5rem;
}
.ns-analysis-stats {
  display: flex; gap: 1.5rem; flex-wrap: wrap;
  margin: 0.75rem 0 1.5rem;
}
.ns-stat {
  flex: 1; min-width: 120px; text-align: center;
  padding: 0.75rem 0.5rem;
  background: rgba(255,255,255,0.025);
  border-radius: 10px;
}
.ns-stat-num {
  font-size: 3rem; font-weight: 800; color: #e8c547;
  line-height: 1; letter-spacing: -0.02em;
}
.ns-stat-num-good { color: #66bb6a; }
.ns-stat-num-warn { color: #e8c547; }
.ns-stat-num-bad  { color: #ff8a80; }
.ns-stat-num-sep {
  color: #6a6a7c; font-weight: 500;
  font-size: 1.5rem; margin: 0 0.15rem;
}
.ns-stat-label {
  font-size: 0.85rem; color: #a0a0b8; margin-top: 0.5rem;
  letter-spacing: 0.02em;
}
.ns-analysis-callout {
  padding: 1rem 1.25rem; background: rgba(67,160,71,0.1);
  border-left: 3px solid #43a047; border-radius: 4px;
  margin-bottom: 0;
  font-size: 0.98rem;
}
.ns-analysis-callout strong {
  color: #66bb6a;
  font-size: 1.05rem;
  display: block; margin-bottom: 0.25rem;
}
.ns-analysis-callout span { color: #c8c8d8; }
.ns-analysis-cta { text-align: center; padding-top: 1.25rem; }
.ns-analysis-cta-sub {
  color: #6a6a7c; font-size: 0.85rem; margin-top: 0.75rem;
}

/* Confidence-building text — kept in CSS so the class doesn't break  */
/* if reused elsewhere, but the element is now removed from the post- */
/* content (its job is done by the report card meta strip + the      */
/* unlock card headline below). */
.ns-confidence-text {
  text-align: center; color: #c8c8d8;
  font-size: 1.1rem; margin: 1.5rem auto;
  line-height: 1.4;
}
.ns-confidence-text strong { color: #e8c547; font-weight: 700; }

/* "What you unlock" value-prop card - sits between the confidence  */
/* line and the email form. Answers "what's actually behind the     */
/* sign-up wall?" - biggest conversion lever on this screen.        */
.ns-unlock-card {
  background: linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.05) 100%);
  border: 1px solid #6c5ce7;
  border-radius: 12px;
  padding: 1.75rem 2rem 1.5rem;
  margin-bottom: 2rem;
}
.ns-unlock-eyebrow {
  text-align: center;
  color: #9d8df1;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin: 0 0 0.5rem;
}
.ns-unlock-headline {
  color: #e8c547;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 1.5rem;
  text-align: center;
}
.ns-unlock-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.85rem 2rem;
}
.ns-unlock-list li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  color: #c8c8d8;
  font-size: 0.98rem;
  padding-left: 0.8rem;
  line-height: 1.4;
}
.ns-unlock-list li::before {
  content: "\2713";
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  top: auto;
  left: 0;
  background: rgba(76,175,80,0.18);
  border: 1px solid rgba(67,160,71,0.55);
  border-radius: 50%;
  color: #66bb6a;
  font-weight: 700;
  font-size: 0.85rem;
}
.ns-unlock-tagline {
  text-align: center;
  color: #8888a0;
  font-size: 0.88rem;
  margin: 1.5rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(108,92,231,0.20);
}

/* Privacy reassurance strip - footer of #post-content, addresses   */
/* the "what happened to my file?" worry at the choice point.       */
.ns-privacy-strip {
  text-align: center;
  color: #8888a0;
  font-size: 0.85rem;
  margin: 2rem auto 0;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(42,42,74,0.6);
  max-width: 720px;
}
.ns-privacy-strip span { white-space: nowrap; }
.ns-privacy-strip .ns-privacy-sep { color: #4a4a64; margin: 0 0.5rem; }

/* Inline validation error shown below the dropzone when the file the
   user dropped/picked is rejected by client-side checks (extension,
   size, name sanity, magic bytes). UX guardrail only - the server
   must still validate. */
.ns-validation-error {
  margin: 1rem auto 0;
  /*max-width: 720px;*/
  padding: 0.9rem 1.25rem;
  background: rgba(229,115,115,0.10);
  border: 1px solid #e57373;
  border-radius: 8px;
  color: #f8bbbb;
  text-align: left;
  font-size: 0.95rem;
  line-height: 1.45;
}
.ns-validation-error strong { color: #ff8a80; display: block; margin-bottom: 0.25rem; }
.ns-validation-error ul { margin: 0.25rem 0 0; padding-left: 1.25rem; }
.ns-validation-error li { margin-bottom: 0.15rem; }
.ns-validation-error a { color: #ff8a80; text-decoration: underline; }

/* Green "Connecting to server.." status beside the sample-DB button.
   Pulses its alpha between 0.5 and 1.0 to draw the eye while the WS
   handshake is in flight. */
.ns-connecting {
  color: #66bb6a;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  animation: nsConnectingPulse 1.6s ease-in-out infinite;
}
@keyframes nsConnectingPulse {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
}
/* Honour reduced-motion: keep it fully visible, just don't pulse. */
@media (prefers-reduced-motion: reduce) {
  .ns-connecting { animation: none; opacity: 1; }
}

/* ============================================================ */
/* Belt-and-suspenders hide rules for launching mode.            */
/* See Variant A comment for details.                            */
/* ============================================================ */
body.ns-launching-active #marketing-view,
body.ns-launching-active #analysis-results,
body.ns-launching-active #upload-dropzone {
  display: none !important;
}
body.ns-launching-active #accelerate-your-domino-modernization,
body.ns-launching-active #how-it-works,
body.ns-launching-active #demo-video,
body.ns-launching-active #domino-online-editor,
body.ns-launching-active #built-for-the-enterprise,
body.ns-launching-active #moonshine-platform,
body.ns-launching-active #pricing,
body.ns-launching-active #final-cta {
  display: none !important;
}
body.ns-launching-active #marketing-view ~ div:not(#launching-view),
body.ns-launching-active #marketing-view ~ hr,
body.ns-launching-active #marketing-view ~ p,
body.ns-launching-active #marketing-view ~ h2 {
  display: none !important;
}

/* ============================================================ */
/* Disclaimer trigger - small "? Disclaimer" button shown below */
/* the "click to choose a file" text inside the dropzone. The   */
/* JS handler stops click propagation so this doesn't also fire */
/* the dropzone's file-picker click.                            */
/* ============================================================ */
.ns-disclaimer-row {
  margin-top: 0.85rem;
  font-size: 0.85rem;
  color: #6a6a7c;
}
.ns-disclaimer-trigger {
  background: none;
  border: none;
  color: #a0a0b8;
  font: inherit;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}
.ns-disclaimer-trigger:hover,
.ns-disclaimer-trigger:focus-visible {
  color: #e0e0f0;
  background: rgba(108,92,231,0.12);
  outline: none;
}
.ns-disclaimer-trigger .ns-disclaimer-label {
  text-decoration: underline;
  text-decoration-color: rgba(160,160,184,0.4);
  text-underline-offset: 2px;
}
.ns-disclaimer-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

/* ============================================================ */
/* Modal - centered card with a dimmed backdrop. Hidden until   */
/* JS removes the `hidden` attribute. Used by the disclaimer    */
/* trigger above; generic enough to host other dialogs later.   */
/* ============================================================ */
.ns-modal[hidden] { display: none; }
.ns-modal {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.ns-modal-backdrop {
  position: absolute; inset: 0;
  background: rgba(8,8,20,0.78);
  -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
}
.ns-modal-card {
  position: relative; z-index: 1;
  max-width: 540px; width: 100%;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f20 100%);
  border: 1px solid #2a2a4a;
  border-radius: 14px;
  padding: 2rem 2rem 1.75rem;
  color: #e0e0f0;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  max-height: 90vh; overflow-y: auto;
}
.ns-modal-close {
  position: absolute; top: 0.6rem; right: 0.7rem;
  background: none; border: none;
  color: #a0a0b8; font-size: 1.6rem; line-height: 1;
  width: 32px; height: 32px; border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}
.ns-modal-close:hover,
.ns-modal-close:focus-visible {
  color: #fff; background: rgba(255,255,255,0.08); outline: none;
}
.ns-modal-title {
  margin: 0 0 1rem; font-size: 1.3rem; color: #fff; font-weight: 600;
}
.ns-modal-body p { margin: 0 0 1rem; line-height: 1.55; color: #c8c8d8; }
.ns-modal-body p:last-child { margin-bottom: 0; }
.ns-modal-body strong { color: #fff; }
.ns-modal-cta {
  display: inline-block;
  padding: 0.65rem 1.4rem;
  background: linear-gradient(135deg, #6c5ce7, #a855f7);
  color: #fff !important;
  border-radius: 8px;
  text-decoration: none !important;
  font-weight: 500;
  transition: filter 0.15s ease;
}
.ns-modal-cta:hover,
.ns-modal-cta:focus-visible {
  filter: brightness(1.15); outline: none;
}

/* ============================================================ */
/* Viability + callout variants. Default is the existing green  */
/* "good" styling. B = yellow caveats, C = red blockers.        */
/* The stat-num and callout both get a variant class applied at */
/* render time from report.viability.                           */
/* ============================================================ */
.ns-stat-num-warn { color: #e8c547; }
.ns-stat-num-bad  { color: #e57373; }

/* Split agents tile: number reads "2 / 0" where left=Java,    */
/* right=LotusScript. Separator muted so the digits dominate.  */
.ns-stat-num-sep {
  color: #6a6a7c;
  font-weight: 400;
  margin: 0 0.25rem;
}

.ns-analysis-callout.ns-callout-warn {
  background: rgba(232,197,71,0.10);
  border-left-color: #e8c547;
}
.ns-analysis-callout.ns-callout-warn strong { color: #e8c547; }

.ns-analysis-callout.ns-callout-bad {
  background: rgba(229,115,115,0.10);
  border-left-color: #e57373;
}
.ns-analysis-callout.ns-callout-bad strong { color: #e57373; }

/* ============================================================ */
/* Error stage - shown when upload or analyze fails. Borrows    */
/* the analysis-report layout for visual consistency but with a */
/* red accent.                                                  */
/* ============================================================ */
.ns-error-report {
  border-color: #e57373 !important;
  background: linear-gradient(135deg, rgba(229,115,115,0.08) 0%, rgba(229,115,115,0.02) 100%) !important;
}
.ns-error-status { color: #e57373 !important; }
.ns-error-title  { color: #e57373 !important; }
.ns-error-message {
  color: #c8c8d8;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

</style>

<div id="marketing-view" markdown="1">
<div style="background: linear-gradient(135deg, #6c5ce7 0%, #a855f7 50%, #6c5ce7 100%); margin: -2rem -2rem 2rem -2rem; padding: 1rem 2rem; text-align: center; position: relative; overflow: hidden;">
  <div style="position: relative; z-index: 1;">
    <span style="color: #ffffff; font-size: 1.2rem; font-weight: 600; letter-spacing: 0.02em;">&#128640; Eliminate the Notes client forever. Free preview. No signup.</span>
    <a href="#" id="try-it-now-banner" style="display: inline-block; margin-left: 1.5rem; background: #e8c547; color: #0f0f23; font-weight: 700; padding: 6px 20px; border-radius: 20px; text-decoration: none; font-size: 0.95rem;">Try it now &darr;</a>
  </div>
</div>

<h2 class="fs-9" style="text-align: center; font-weight: 800; font-size: 4rem; margin-bottom: 0.25rem;">Nomad.Services</h2>

<p class="fs-5 fw-300" style="margin-top: 5.0rem; text-align: center;">Upload your NSF and get a full <span style="color: #fff; font-weight: 500;">migration viability report</span> in seconds - before you ever create an account.</p>

<!-- ============================================================ -->
<!-- DUAL-ENTRY HERO WIDGET                                        -->
<!-- Primary: drag-and-drop zone for user's NSF                   -->
<!-- Secondary: one-click sample database for hesitant visitors    -->
<!-- Tertiary: 60-second demo video for skimmers                   -->
<!-- ============================================================ -->

<div style="margin: 2rem 0;">

  <div id="upload-dropzone" role="button" tabindex="0" aria-label="Drop your NSF here to analyze, or click to choose a file" style="display: block; padding: 2.5rem 2rem; background: linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.06) 100%); border: 2px dashed #6c5ce7; border-radius: 16px; text-align: center; cursor: pointer; transition: border-color 0.2s ease, background 0.2s ease;">
    <div aria-hidden="true" style="font-size: 3rem; line-height: 1; margin-bottom: 0.5rem; color: #9d8df1;">&#8613;</div>
    <div style="font-size: 1.4rem; font-weight: 600; color: #e0e0f0; margin-bottom: 0.5rem;">
      Drop your NSF here to analyze
    </div>
    <div style="font-size: 1rem; color: #a0a0b8;">
      or <span style="color: #e8c547; text-decoration: underline;">click to choose a file</span> &middot; free preview, no signup
    </div>
    <div class="ns-disclaimer-row">
      <button type="button" id="disclaimer-trigger" class="ns-disclaimer-trigger" aria-haspopup="dialog" aria-controls="disclaimer-modal">
        <span class="ns-disclaimer-icon" aria-hidden="true">?</span>
        <span class="ns-disclaimer-label">Disclaimer</span>
      </button>
    </div>
    <input type="file" id="nsf-file-input" accept=".nsf,.ntf" style="display: none;" aria-hidden="true">
  </div>

  <!-- Disclaimer modal. Hidden until JS opens it. role/aria attrs make -->
  <!-- it announceable to screen readers; data-close on the backdrop +  -->
  <!-- close button hooks the same dismiss handler.                     -->
  <div id="disclaimer-modal" class="ns-modal" role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title" hidden>
    <div class="ns-modal-backdrop" data-close></div>
    <div class="ns-modal-card" role="document">
      <button type="button" class="ns-modal-close" data-close aria-label="Close disclaimer">&times;</button>
      <h2 id="disclaimer-modal-title" class="ns-modal-title">Before you upload</h2>
      <div class="ns-modal-body">
        <p>This is a free, unauthenticated preview. Uploaded files are analyzed and deleted within 15 minutes, and we never store them - but the analysis runs in a shared environment.</p>
        <p>For an extra layer of safety, please <strong>avoid uploading databases containing sensitive or confidential information</strong>. A sanitized copy or a non-production NSF is ideal for the preview.</p>
        <p>If you'd like to test on production-style data in an isolated, authenticated environment, sign in here:</p>
        <p style="text-align: center; margin-top: 1.25rem;">
          <a class="ns-modal-cta" href="{{ site.backend_url }}/public/file/serve/domino-integration/index.html?brand=nomad.services" target="_blank" rel="noopener">Open the authenticated environment &rarr;</a>
        </p>
      </div>
    </div>
  </div>

  <div id="ns-validation-error" class="ns-validation-error" style="display: none;" role="alert">
    <strong>Can't accept this file:</strong>
    <ul id="ns-validation-error-list"></ul>
  </div>

  <!-- Shown when the analyze WS server replies with an "ERROR: ..."     -->
  <!-- string (e.g. the analyzer backend is down). Toggled by the        -->
  <!-- WebSocket message handler in the script block at the foot of the  -->
  <!-- page.                                                             -->
  <div id="ns-analyzer-error" class="ns-validation-error" style="display: none;" role="alert">
    Oops! Something went wrong.. Please contact <a href="mailto:santanu@prominic.net">support</a>!
  </div>

  <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; font-size: 1rem; color: #c8c8d8;">
  <span>Don't have an NSF handy?</span>
  <a href="#analysis-results" id="sample-db-link" style="display: inline-block; padding: 8px 20px; background: rgba(255,255,255,0.04); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: background 0.2s ease, border-color 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.10)'; this.style.borderColor='rgba(255,255,255,0.45)';" onmouseout="this.style.background='rgba(255,255,255,0.04)'; this.style.borderColor='rgba(255,255,255,0.25)';">Try with our sample database &rarr;</a>
  <!-- Live connection status for the analyze WS. Shown while the         -->
  <!-- helloWorld handshake is in flight; hidden once the server replies  -->
  <!-- (success) or the connection/analyzer fails. Toggled by the script  -->
  <!-- block at the foot of the page.                                     -->
  <span id="ns-connecting" class="ns-connecting" role="status" style="display: none;">Connecting to server...</span>
</div>

  <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: #6a6a7c;">
    &#128274; Analyzed and deleted within 15 minutes &middot; Never stored &middot; TLS encrypted in transit
  </div>

</div>

<!-- Note: dropzone and sample-DB clicks now route through the launching
     view (see #launching-view below). The old inline analysis card was
     removed when the analytical block became shared across flows. -->


</div><!-- /#marketing-view -->


<!-- ============================================================ -->
<!-- LAUNCHING VIEW (Variant B: email-first)                       -->
<!-- Hidden by default. Shown by JS when the user drops or picks   -->
<!-- a file. We use pushState (no real navigation), so the theme   -->
<!-- header and footer remain in place. No stepper here - the     -->
<!-- prominent file card serves as the visual anchor instead.      -->
<!-- ============================================================ -->
<div id="launching-view" style="display: none;" markdown="0">
  <div class="ns-launching-wrap">

    <!-- Stage 1: Preparing your file (real NSF drop only) -->
    <div class="ns-stage ns-stage-centered" id="stage-preparing" style="display: none;">
      <div class="ns-progress-strip">
        <div class="ns-progress-status">Preparing your file</div>
        <div class="ns-progress-title" id="prep-title">Loading&hellip;</div>
        <div class="ns-progress-track">
          <div class="ns-progress-bar" id="prep-bar"></div>
        </div>
        <div class="ns-progress-sub" id="prep-sub">Securing your upload&hellip;</div>
      </div>
    </div>

    <!-- Stage 2: Analyzing your NSF (both NSF and sample-DB paths) -->
    <div class="ns-stage ns-stage-centered" id="stage-analyzing" style="display: none;">
      <div class="ns-progress-strip">
        <div class="ns-progress-status">Analyzing your NSF</div>
        <div class="ns-progress-title" id="analyze-title">Reading database structure&hellip;</div>
        <div class="ns-progress-track">
          <div class="ns-progress-bar" id="analyze-bar"></div>
        </div>
        <div class="ns-progress-sub" id="analyze-sub">Parsing forms, views, agents&hellip;</div>
      </div>
    </div>

    <!-- Stage 3: Results - analytical card (shared) + post-content for NSF flow -->
    <div class="ns-stage" id="stage-results" style="display: none;">

      <div class="ns-analysis-report ns-fade-in" id="analysis-report-card">
        <!-- Subdued file-meta strip — visually separated from the     -->
        <!-- report content below by a thin divider. Carries the file -->
        <!-- name + size + a short report-kind tag. populateReport()  -->
        <!-- and the sample/real flow scripts fill these in.           -->
        <div class="ns-report-meta">
          <span class="ns-report-meta-name" id="report-meta-name">your-file.nsf</span>
          <span class="ns-report-meta-sep" aria-hidden="true">&middot;</span>
          <span class="ns-report-meta-size" id="report-meta-size">&mdash;</span>
          <span class="ns-report-meta-tag" id="report-meta-tag">PREVIEW REPORT</span>
        </div>

        <!-- Stat tiles. Values are placeholder dashes; populateReport() -->
        <!-- in the main script swaps them in from the analyzeDatabase    -->
        <!-- response (or from the mock sample data in the sample flow).  -->
        <div class="ns-analysis-stats">
          <div class="ns-stat">
            <div class="ns-stat-num" id="report-stat-forms">-</div>
            <div class="ns-stat-label">Forms</div>
          </div>
          <div class="ns-stat">
            <div class="ns-stat-num" id="report-stat-views">-</div>
            <div class="ns-stat-label">Views</div>
          </div>
          <div class="ns-stat">
            <div class="ns-stat-num">
              <span id="report-stat-java-agents">-</span><span class="ns-stat-num-sep">/</span><span id="report-stat-ls-agents">-</span>
            </div>
            <div class="ns-stat-label">Java / LotusScript Agents</div>
          </div>
          <div class="ns-stat">
            <div class="ns-stat-num ns-stat-num-good" id="report-stat-viability">-</div>
            <div class="ns-stat-label">Viability</div>
          </div>
        </div>

        <!-- Callout text + heading both get replaced at render time.    -->
        <!-- Heading is derived from viability letter; message is        -->
        <!-- report.message verbatim. Variant class (default green /    -->
        <!-- ns-callout-warn / ns-callout-bad) controls colors.          -->
        <div class="ns-analysis-callout" id="analysis-callout">
          <strong id="analysis-callout-heading">&check; Ready to migrate.</strong>
          <span id="analysis-callout-message">No blockers detected. Standard LotusScript and Formula patterns throughout. Estimated Nomad rendering time: under 30 seconds.</span>
        </div>

        <div class="ns-analysis-cta" id="analysis-cta">
          <a href="{{ site.backend_url }}/public/file/serve/domino-integration/index.html" target="_blank" rel="noopener" class="btn btn-primary fs-5">Sign in to see it running live &rarr;</a>
          <p class="ns-analysis-cta-sub">Free for 30 days. No credit card required.</p>
        </div>
      </div>

      <!-- Post-content: shown only when a real NSF was dropped (variant-b: email-first) -->
      <div id="post-content" style="display: none;">

        <!-- Value-prop card — the conversion pivot. Eyebrow signals    -->
        <!-- this is a sub-section of the flow, headline does the sell, -->
        <!-- five bullets do the proof, tagline closes the loop.        -->
        <div class="ns-unlock-card ns-fade-in" style="animation-delay: 0.05s;">
          <div class="ns-unlock-eyebrow">Free preview &middot; full report just an email away</div>
          <h3 class="ns-unlock-headline">Your full report unlocks</h3>
          <ul class="ns-unlock-list">
            <li>Per-form &amp; per-view risk flags</li>
            <li>LotusScript &amp; Formula complexity scores</li>
            <li>Live HCL Nomad preview in your browser</li>
            <li>Downloadable PDF migration report</li>
            <li>Prioritized migration roadmap</li>
          </ul>
          <p class="ns-unlock-tagline">Available the moment you have access to the magic link.</p>
        </div>

        <div class="ns-action-panel ns-fade-in" id="action-panel" style="animation-delay: 0.2s;">
          <h2 class="ns-action-headline">Get your full report</h2>
          <p class="ns-action-sub" id="action-sub">We&rsquo;ll send a magic link to your inbox. One click, no password.</p>

          <form class="ns-email-form" id="email-form" novalidate>
            <input type="email" class="ns-email-input" id="email-input" required placeholder="you@company.com" autocomplete="email" aria-label="Your email address">
            <button type="submit" class="ns-btn ns-btn-primary" id="email-submit">Continue with email</button>
          </form>
          <p class="ns-form-hint">We'll send a magic link. No password to remember.</p>

          <p class="ns-alt-link">
            Already have an account?
            <a href="https://auth.moonshine.dev/login" id="alt-signin">Sign in</a>
          </p>

          <button type="button" class="ns-exit-link" id="exit-link">&larr; Back to home</button>
        </div>

        <div class="ns-confirmation-card" id="confirmation-card" style="display: none;">
          <div class="ns-confirmation-icon" aria-hidden="true">&#9993;&#65039;</div>
          <h2 class="ns-confirmation-headline">Check your inbox</h2>
          <p class="ns-confirmation-body">
            A magic link is on its way to <span class="ns-confirmation-email" id="confirmation-email">you@example.com</span>.
            Open it to launch your file in HCL Nomad.
          </p>
          <p class="ns-confirmation-hint">Don't see it in a minute or two? Check your spam folder &mdash; or, if you've requested several links recently, wait a few minutes and try again.</p>
          <button type="button" class="ns-confirmation-action" id="back-home">Back to home</button>
          <button type="button" class="ns-try-again" id="try-again">Wrong email? Try again</button>
        </div>

        <div class="ns-privacy-strip ns-fade-in" style="animation-delay: 0.4s;">
          <span>&#128274; File analyzed and deleted within 15 minutes</span>
          <span class="ns-privacy-sep">&middot;</span>
          <span>Never stored</span>
          <span class="ns-privacy-sep">&middot;</span>
          <span>TLS encrypted in transit</span>
        </div>

      </div><!-- /#post-content -->

    </div><!-- /#stage-results -->

    <!-- Stage 4: Error - shown when upload or analyze fails. Sibling   -->
    <!-- of the other stages so resetStages() can hide it the same way. -->
    <div class="ns-stage" id="stage-error" style="display: none;">
      <div class="ns-analysis-report ns-fade-in ns-error-report">
        <div class="ns-analysis-status ns-error-status">Something went wrong</div>
        <h3 class="ns-analysis-title ns-error-title" id="stage-error-title">We couldn't analyze your file.</h3>
        <p id="stage-error-message" class="ns-error-message">Please try again, or use a different database.</p>
        <div class="ns-analysis-cta">
          <button type="button" class="btn btn-primary fs-5" id="stage-error-retry">Try again</button>
          <p class="ns-analysis-cta-sub">Or refresh the page to start over.</p>
        </div>
      </div>
    </div><!-- /#stage-error -->

  </div>
</div><!-- /#launching-view -->


<script>
/* ============================================================ */
/* Unified script: dropzone, sample-DB, and view switching.     */
/*                                                               */
/* See variant-a for the shared design notes. Variant B differs */
/* in the post-content shown after the analytical card: an      */
/* email-magic-link form and post-submit confirmation panel,    */
/* both swapped within the same launching view (no pushState).  */
/* ============================================================ */
(function() {
  /* The File object lives here while the launching view is active.
     Not persisted across reloads - refreshing /launching/ takes the
     user back to the marketing view. */
  var pendingFile = null;
  var pendingMode = null;  /* 'file' | 'sample' | null */

  /* Full upload response for the current pending file:
       { claim_token, expires_at, path, size }
     Set by startUpload() after the server responds; consumed by
     handleEmailSubmit() to forward claim_token to /api/nomad/magic-link.
     Reset to null on every showMarketingView / runSampleAnalysis. */
  var pendingUploadResult = null;

  /* Track stage timers so we can cancel them if the user exits the
     launching view mid-animation (back button, exit link, etc.). */
  var stageTimers = [];
  function clearTimers() {
    while (stageTimers.length) clearTimeout(stageTimers.pop());
  }
  function schedule(fn, delay) {
    var id = setTimeout(fn, delay);
    stageTimers.push(id);
    return id;
  }

  /* Marketing-view elements */
  var dropzone = document.getElementById('upload-dropzone');
  var fileInput = document.getElementById('nsf-file-input');
  var sampleLink = document.getElementById('sample-db-link');

  /* View containers */
  var marketingView = document.getElementById('marketing-view');
  var launchingView = document.getElementById('launching-view');

  /* Launching-view stages */
  var stagePreparing = document.getElementById('stage-preparing');
  var stageAnalyzing = document.getElementById('stage-analyzing');
  var stageResults = document.getElementById('stage-results');

  /* Preparing-stage elements */
  var prepTitle = document.getElementById('prep-title');
  var prepBar = document.getElementById('prep-bar');
  var prepSub = document.getElementById('prep-sub');

  /* Analyzing-stage elements */
  var analyzeTitle = document.getElementById('analyze-title');
  var analyzeBar = document.getElementById('analyze-bar');
  var analyzeSub = document.getElementById('analyze-sub');

  /* Results-stage elements */
  var analysisCta = document.getElementById('analysis-cta');
  /* analysis-report-status, analysis-report-title, file-name, file-size,
     confidence-filename, confidence-viability, confidence-qualifier are
     all gone from the markup after the report-card redesign — these
     getElementById calls return null, the if-guards below no-op them.
     Kept as documentation; safe to remove on cleanup. */
  var analysisReportStatus = document.getElementById('analysis-report-status');
  var analysisReportTitle = document.getElementById('analysis-report-title');
  var postContent = document.getElementById('post-content');
  var fileNameEl = document.getElementById('file-name');
  var fileSizeEl = document.getElementById('file-size');
  var confidenceFilename = document.getElementById('confidence-filename');

  /* New file-meta strip at the top of the analytical report card. */
  var reportMetaName = document.getElementById('report-meta-name');
  var reportMetaSize = document.getElementById('report-meta-size');
  var reportMetaTag  = document.getElementById('report-meta-tag');

  var actionPanel = document.getElementById('action-panel');
  var exitLink = document.getElementById('exit-link');
  var emailForm = document.getElementById('email-form');
  var emailInput = document.getElementById('email-input');
  var emailSubmit = document.getElementById('email-submit');
  var confirmationCard = document.getElementById('confirmation-card');
  var confirmationEmail = document.getElementById('confirmation-email');
  var backHome = document.getElementById('back-home');
  var tryAgain = document.getElementById('try-again');

  /* Error stage + report card targets (populated at render time). */
  var stageError       = document.getElementById('stage-error');
  var stageErrorTitle  = document.getElementById('stage-error-title');
  var stageErrorMessage= document.getElementById('stage-error-message');
  var stageErrorRetry  = document.getElementById('stage-error-retry');
  var reportStatForms  = document.getElementById('report-stat-forms');
  var reportStatViews  = document.getElementById('report-stat-views');
  var reportStatJava   = document.getElementById('report-stat-java-agents');
  var reportStatLs     = document.getElementById('report-stat-ls-agents');
  var reportStatViab   = document.getElementById('report-stat-viability');
  var analysisCallout  = document.getElementById('analysis-callout');
  var calloutHeading   = document.getElementById('analysis-callout-heading');
  var calloutMessage   = document.getElementById('analysis-callout-message');
  var confidenceViability = document.getElementById('confidence-viability');
  var confidenceQualifier = document.getElementById('confidence-qualifier');
  var actionSub           = document.getElementById('action-sub');

  /* Mock report data for the sample-DB flow. Keeps the sample
     visually identical to the real flow without hitting the backend. */
  var MOCK_SAMPLE_REPORT = {
    status: 'success',
    action: 'analyzeDatabase',
    databaseFilePath: '/sample/CRM.nsf',
    uuid: 'anonymous',
    report: {
      forms: 42,
      views: 17,
      lotusScriptAgents: 6,
      javaAgents: 2,
      viability: 'A',
      message: 'No blockers detected. Standard LotusScript and Formula patterns throughout. Estimated Nomad rendering time: under 30 seconds.',
      problemCategories: [],
      fileSizeBytes: 0
    },
    checks: []
  };

  if (!dropzone || !fileInput || !marketingView || !launchingView) return;

  /* On page load: if URL is /launching/ but we have no active mode
     (refresh, deep link), correct the URL to / and show marketing. */
  (function bootstrapView() {
    var path = window.location.pathname;
    var atLaunching = /\/launching\/?$/.test(path);
    if (atLaunching) {
      try {
        history.replaceState({ view: 'marketing' }, '', '{{ "/" | relative_url }}');
      } catch (_) {}
    } else {
      try {
        history.replaceState({ view: 'marketing' }, '', window.location.href);
      } catch (_) {}
    }
    showMarketingView({ scroll: false });
  })();

  /* --- Marketing dropzone wiring --- */
  dropzone.addEventListener('click', function() { fileInput.click(); });
  dropzone.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });
  dropzone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropzone.style.borderColor = '#e8c547';
    dropzone.style.background = 'linear-gradient(135deg, rgba(232,197,71,0.15) 0%, rgba(232,197,71,0.05) 100%)';
  });
  dropzone.addEventListener('dragleave', function() {
    dropzone.style.borderColor = '#6c5ce7';
    dropzone.style.background = 'linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.06) 100%)';
  });
  dropzone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropzone.style.borderColor = '#6c5ce7';
    dropzone.style.background = 'linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.06) 100%)';

    /* Single-file enforcement: reject multi-file drops and directory
       drops up-front. stopImmediatePropagation also blocks the
       upload-test block's drop handler from running on the same event. */
    var files = (e.dataTransfer && e.dataTransfer.files) || [];
    var items = (e.dataTransfer && e.dataTransfer.items) || null;
    if (items && items.length === 1 && typeof items[0].webkitGetAsEntry === 'function') {
      var entry = items[0].webkitGetAsEntry();
      if (entry && entry.isDirectory) {
        e.stopImmediatePropagation();
        showValidationError([{ code: 'DIR',
          message: 'Folders are not supported - drop a single .nsf file.' }]);
        return;
      }
    }
    if (files.length === 0) {
      e.stopImmediatePropagation();
      showValidationError([{ code: 'NO_FILE',
        message: 'No file was dropped. Drop a single .nsf file from your computer.' }]);
      return;
    }
    if (files.length > 1) {
      e.stopImmediatePropagation();
      showValidationError([{ code: 'MULTI',
        message: 'Only one file at a time, please. (' + files.length + ' files were dropped.)' }]);
      return;
    }
    handleUserFile(files[0]);
  });
  fileInput.addEventListener('change', function(e) {
    /* The input element has no `multiple` attribute, so the browser
       already enforces single-file here. Defensive check anyway. */
    if (e.target.files && e.target.files.length === 1) {
      handleUserFile(e.target.files[0]);
    } else if (e.target.files && e.target.files.length > 1) {
      showValidationError([{ code: 'MULTI',
        message: 'Only one file at a time, please.' }]);
    }
  });
  if (sampleLink) {
    sampleLink.addEventListener('click', function(e) {
      e.preventDefault();
      runSampleAnalysis();
    });
  }
  if (exitLink) {
    exitLink.addEventListener('click', function() { history.back(); });
  }
  if (backHome) {
    backHome.addEventListener('click', function() { history.back(); });
  }
  if (tryAgain) {
    tryAgain.addEventListener('click', function() {
      /* Stay in launching view, swap inner panel back to email form. */
      if (confirmationCard) confirmationCard.style.display = 'none';
      if (actionPanel) actionPanel.style.display = 'block';
      setTimeout(function() {
        try { emailInput.focus(); emailInput.select(); } catch (_) {}
      }, 50);
    });
  }
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleEmailSubmit();
    });
  }
  if (stageErrorRetry) {
    /* "Try again" on the error stage: drop back to marketing view so
       the user can re-drop a file. The cleanest reset since pendingFile
       is already invalidated by showMarketingView(). */
    stageErrorRetry.addEventListener('click', function() {
      try { history.back(); } catch (_) { showMarketingView(); }
    });
  }

  /* Browser back/forward buttons */
  window.addEventListener('popstate', function(e) {
    var state = (e && e.state) || {};
    if (state.view === 'launching' && pendingMode === 'file' && pendingFile) {
      runFullFlow();
    } else if (state.view === 'launching' && pendingMode === 'sample') {
      runAnalyzingThenResults(false);
    } else {
      /* If we land on /launching/ with no mode (forward navigation
         after exit), repair the URL to /. */
      if (/\/launching\/?$/.test(window.location.pathname)) {
        try { history.replaceState({ view: 'marketing' }, '', '{{ "/" | relative_url }}'); } catch (_) {}
      }
      showMarketingView({ scroll: false });
    }
  });

  /* --- View switching --- */
  function showMarketingView(opts) {
    opts = opts || {};
    clearTimers();
    pendingFile = null;
    pendingMode = null;
    pendingUploadResult = null;
    document.body.classList.remove('ns-launching-active');
    resetStages();
    /* Reset email-form state so a fresh visit starts clean. */
    if (emailInput) {
      emailInput.value = '';
      emailInput.classList.remove('is-invalid');
    }
    if (emailSubmit) {
      emailSubmit.disabled = false;
      emailSubmit.textContent = 'Continue with email';
    }
    if (launchingView) launchingView.style.display = 'none';
    if (marketingView) marketingView.style.display = '';
    if (opts.scroll !== false) {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
    }
  }

  function showLaunchingView() {
    document.body.classList.add('ns-launching-active');
    if (marketingView) marketingView.style.display = 'none';
    if (launchingView) launchingView.style.display = '';
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
  }

  function resetStages() {
    [stagePreparing, stageAnalyzing, stageResults, stageError].forEach(function(el) {
      if (!el) return;
      el.style.display = 'none';
      el.classList.remove('ns-fade-out', 'ns-fade-in');
    });
    if (stageResults) stageResults.classList.remove('ns-mode-results-only');
    if (prepBar) prepBar.style.width = '0%';
    if (analyzeBar) analyzeBar.style.width = '0%';
    if (postContent) postContent.style.display = 'none';
    if (analysisCta) analysisCta.style.display = '';
    /* Make sure the email form is the visible inner panel of post-content
       and the confirmation card is hidden, in case a previous flow ended
       on the confirmation. */
    if (actionPanel) actionPanel.style.display = '';
    if (confirmationCard) confirmationCard.style.display = 'none';
  }

  function pushStateToLaunching() {
    var launchingPath = '{{ "/launching/" | relative_url }}';
    try {
      history.pushState({ view: 'launching' }, '', launchingPath);
    } catch (_) {}
  }

  /* --- NSF drop / pick path --- */
  function handleUserFile(file) {
    /* Client-side validation gate. Promise resolves with
       { ok, errors }. If invalid we show inline + console errors and
       skip the visual flow entirely. NOT a security boundary - server
       must validate independently. */
    validateUpload(file).then(function(result) {
      if (!result.ok) {
        showValidationError(result.errors);
        return;
      }
      clearValidationError();
      proceedWithFile(file);
    });
  }

  function proceedWithFile(file) {
    pendingFile = file;
    pendingMode = 'file';
    /* Prime visible content BEFORE swapping views. */
    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = formatSize(file.size);
    if (confidenceFilename) confidenceFilename.textContent = file.name;
    if (analysisReportStatus) analysisReportStatus.textContent = 'Analysis report';
    if (analysisReportTitle) analysisReportTitle.textContent = file.name + ' - analysis report';
    /* File meta strip at the top of the report card. */
    if (reportMetaName) reportMetaName.textContent = file.name;
    if (reportMetaSize) reportMetaSize.textContent = formatSize(file.size);
    if (reportMetaTag)  reportMetaTag.textContent  = 'PREVIEW REPORT';
    if (prepTitle) prepTitle.textContent = 'Preparing ' + file.name + '…';

    pushStateToLaunching();
    showLaunchingView();
    runFullFlow();
  }

  /* ---------- client-side validation ---------- */

  /* Per-file memoized Promise so the main flow and the upload-test
     block can both await the same result without re-reading the file. */
  var validationCache = (typeof WeakMap === 'function') ? new WeakMap() : null;

  function validateUpload(file) {
    if (validationCache && validationCache.has(file)) return validationCache.get(file);
    var promise = doValidate(file);
    if (validationCache) validationCache.set(file, promise);
    return promise;
  }

  function doValidate(file) {
    var errors = [];

    /* 1. Extension whitelist (case-insensitive). */
    var nameLower = (file.name || '').toLowerCase();
    if (!/\.(nsf|ntf)$/.test(nameLower)) {
      errors.push({
        code: 'EXT',
        message: 'File must have a .nsf or .ntf extension. Got: "' + (file.name || '(no name)') + '".'
      });
    }

    /* 2. Size bounds - NSF header alone is bigger than a few KB; cap
          at 100 MB to keep the public upload light. Adjust both bounds
          if your backend allows more. */
    var MIN_BYTES = 4 * 1024;
    var MAX_BYTES = 100 * 1024 * 1024;
    if (file.size < MIN_BYTES) {
      errors.push({
        code: 'SIZE_MIN',
        message: 'File is too small (' + file.size + ' bytes). Real NSFs are at least 4 KB.'
      });
    }
    if (file.size > MAX_BYTES) {
      errors.push({
        code: 'SIZE_MAX',
        message: 'File is too large (' + (file.size / 1024 / 1024).toFixed(1) + ' MB). Max is 100 MB.'
      });
    }

    /* 3. Filename sanity - length, path separators, traversal markers,
          control characters. */
    var name = file.name || '';
    if (name.length > 255) {
      errors.push({ code: 'NAME_LEN',    message: 'Filename is longer than 255 characters.' });
    }
    if (/[\\\/]/.test(name)) {
      errors.push({ code: 'NAME_PATH',   message: 'Filename contains a path separator (\\ or /).' });
    }
    if (name.indexOf('..') !== -1) {
      errors.push({ code: 'NAME_DOTDOT', message: 'Filename contains "..".' });
    }
    if (/[\x00-\x1F\x7F]/.test(name)) {
      errors.push({ code: 'NAME_CTRL',   message: 'Filename contains control or non-printable characters.' });
    }

    /* If any sync check failed, skip the async magic-byte read. */
    if (errors.length > 0) {
      return Promise.resolve({ ok: false, errors: errors });
    }

    /* 5. Magic-byte check - best-effort heuristic. NSF files start with
          0x1A (ASCII SUB). Verify with a known-good NSF and tighten the
          check if needed. We always log the hex of the first 32 bytes
          so you can confirm what real files look like. */
    return new Promise(function(resolve) {
      var reader = new FileReader();
      reader.onload = function() {
        var buf = new Uint8Array(reader.result);
        var hex = Array.prototype.map.call(buf, function(b) {
          return ('0' + b.toString(16)).slice(-2);
        }).join(' ');
        console.log('[validation] first ' + buf.length + ' bytes of "' + file.name + '" (hex):', hex);
        if (buf[0] !== 0x1A) {
          errors.push({
            code: 'MAGIC',
            message: 'File header does not start with the expected NSF signature (0x1A). First byte was 0x' + ('0' + buf[0].toString(16)).slice(-2) + '.'
          });
        }
        resolve({ ok: errors.length === 0, errors: errors });
      };
      reader.onerror = function() {
        errors.push({ code: 'READ', message: 'Could not read the file header for inspection.' });
        resolve({ ok: false, errors: errors });
      };
      reader.readAsArrayBuffer(file.slice(0, 32));
    });
  }

  function showValidationError(errors) {
    console.warn('[validation] rejected - ' + errors.length + ' error(s):');
    errors.forEach(function(e) {
      console.warn('[validation]   ' + e.code + ': ' + e.message);
    });
    var el = document.getElementById('ns-validation-error');
    var list = document.getElementById('ns-validation-error-list');
    if (!el || !list) return;
    list.innerHTML = '';
    errors.forEach(function(e) {
      var li = document.createElement('li');
      li.textContent = e.message;
      list.appendChild(li);
    });
    el.style.display = 'block';
    /* Scroll the dropzone area into view in case the user dropped while
       scrolled away. */
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (_) {}
  }

  function clearValidationError() {
    var el = document.getElementById('ns-validation-error');
    if (el) el.style.display = 'none';
  }

  /* Expose for the upload-test block (and anything else) to consult
     the same cached decision. */
  window.__nsValidate = validateUpload;

  function runFullFlow() {
    resetStages();
    if (!pendingFile) {
      console.warn('[flow] runFullFlow called with no pendingFile');
      return;
    }

    /* Both async tracks start in parallel:
         - upload  (HTTP POST) -> { claim_token, path, … }
         - prep-stage animation
       Promise.all gates on whichever finishes last — i.e. the
       preparing block stays on screen until BOTH the animation has
       reached 100% AND the server has actually responded. Only then
       do we fade the block out (via hideStage) and start the analyze
       track. Same pattern again for analyze + analyzing-animation. */
    var uploadP   = startUpload(pendingFile);
    var prepAnimP = runPreparingStage();

    Promise.all([uploadP, prepAnimP])
      .then(function(results) {
        var uploadResult = results[0];
        return hideStage(stagePreparing).then(function() { return uploadResult; });
      })
      .then(function(uploadResult) {
        var analyzeP = startAnalyze(uploadResult.path);
        var animP    = runAnalyzingStage();
        return Promise.all([analyzeP, animP]);
      })
      .then(function(results) {
        var report = results[0];
        return hideStage(stageAnalyzing).then(function() { return report; });
      })
      .then(function(report) {
        populateReport(report);
        showResultsStage(true);
        /* Focus the email input so keyboard users can start typing.
           preventScroll keeps the viewport at the top of the results
           stage - without it, browsers scroll the input into view and
           skip the user past the analytical card. */
        schedule(function() {
          try { emailInput.focus({ preventScroll: true }); } catch (_) {}
        }, 300);
      })
      .catch(function(err) {
        console.error('[flow] failed:', err);
        var msg = (err && err.message) ? err.message : String(err);
        showErrorStage(msg);
      });
  }

  /* --- Sample-DB path. Inject mock report so the visual flow matches
         the real upload flow without hitting the backend. ----------- */
  function runSampleAnalysis() {
    pendingFile = null;
    pendingMode = 'sample';
    pendingUploadResult = null;  /* sample flow doesn't upload */
    if (analysisReportStatus) analysisReportStatus.textContent = 'Sample analysis';
    if (analysisReportTitle) analysisReportTitle.textContent = 'CRM.nsf - Customer Relationship Management';
    /* File meta strip — for the sample flow we use a fixed name+size. */
    if (reportMetaName) reportMetaName.textContent = 'CRM.nsf';
    if (reportMetaSize) reportMetaSize.textContent = '256.0 KB';
    if (reportMetaTag)  reportMetaTag.textContent  = 'SAMPLE ANALYSIS';

    pushStateToLaunching();
    showLaunchingView();
    runAnalyzingThenResults(false);
  }

  function runAnalyzingThenResults(withPostContent) {
    resetStages();
    runAnalyzingStage()
      .then(function() { return hideStage(stageAnalyzing); })
      .then(function() {
        populateReport(MOCK_SAMPLE_REPORT);
        showResultsStage(withPostContent);
      });
  }

  /* --- Upload: HTTP POST to /api/nomad/upload, returns a Promise
         that resolves with the parsed JSON body:
           { claim_token, expires_at, path, size }
         The whole object is also stashed on the module-scope
         `pendingUploadResult` so handleEmailSubmit() can forward
         claim_token to /api/nomad/magic-link. ---------------------- */
  function startUpload(file) {
    var tag = '[upload]';
    var names = makeUploadNames(file);
    var url = window.NS_BACKEND + '/api/nomad/upload';

    console.log(tag, 'starting', { url: url, targetName: names.targetName, sizeBytes: file.size });

    var formData = new FormData();
    formData.append('_csrf', '');                 /* anonymous flow */
    formData.append('file', file, names.targetName);

    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();

    return fetch(url, { method: 'POST', body: formData })
      .then(function(res) {
        var elapsed = (((window.performance && performance.now) ? performance.now() : Date.now()) - t0).toFixed(0);
        if (!res.ok) {
          throw new Error('Upload failed: HTTP ' + res.status + ' ' + res.statusText + ' (' + elapsed + 'ms)');
        }
        console.log(tag, 'HTTP ' + res.status + ' (' + elapsed + 'ms)');
        return res.text();
      })
      .then(function(body) {
        console.log(tag, 'response body:', body);
        var parsed;
        try { parsed = JSON.parse(body); }
        catch (e) { throw new Error('Upload response was not JSON: ' + body.substring(0, 200)); }
        if (!parsed || typeof parsed.path !== 'string' || !parsed.path) {
          throw new Error('Upload response is missing .path');
        }
        if (typeof parsed.claim_token !== 'string' || !parsed.claim_token) {
          throw new Error('Upload response is missing .claim_token');
        }
        /* Stash for downstream use (magic-link POST in handleEmailSubmit). */
        pendingUploadResult = parsed;
        console.log(tag, 'claim_token =', parsed.claim_token,
          '| expires_at =', parsed.expires_at);
        return parsed;  /* { claim_token, expires_at, path, size } */
      });
  }

  /* --- Analyze: send analyzeDatabase via the existing WS instance,
         and resolve when a frame arrives with the matching action +
         status. Intermediate progress frames (plain text / non-matching
         JSON) keep streaming through the class's on('message') log but
         don't fulfil this promise. Times out after 90s. ------------- */
  function startAnalyze(nsfPath) {
    var tag = '[analyze]';
    return new Promise(function(resolve, reject) {
      var ws = (window.NSWebSocket && typeof window.NSWebSocket.getInstance === 'function')
        ? window.NSWebSocket.getInstance()
        : null;
      if (!ws || !ws.isOpen()) {
        reject(new Error('WebSocket is not connected. Refresh the page and try again.'));
        return;
      }

      var settled = false;
      function settle(fn, arg) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        fn(arg);
      }

      var listener = function(evt) {
        var d = evt && evt.decoded;
        if (!d || typeof d !== 'object') return;          /* progress strings etc. */
        if (d.action !== 'analyzeDatabase') return;       /* not our response */
        if (d.status === 'success') {
          console.log(tag, 'report received');
          settle(resolve, d);
        } else {
          var msg = d.message || ('analyzeDatabase returned status="' + d.status + '"');
          settle(reject, new Error(msg));
        }
      };
      ws.on('message', listener);

      var timeoutId = setTimeout(function() {
        settle(reject, new Error('Analysis timed out after 90s.'));
      }, 90000);

      console.log(tag, 'sending analyzeDatabase for path:', nsfPath);
      var queued = ws.analyzeDatabase(nsfPath);
      if (!queued) {
        settle(reject, new Error('analyzeDatabase send was rejected by the WS class (socket closed?).'));
      }
    });
  }

  /* --- Populate the analytical report card from a report frame. ---- */
  function populateReport(frame) {
    var r = (frame && frame.report) || {};
    var v = String(r.viability || '').toUpperCase();

    if (reportStatForms) reportStatForms.textContent = (r.forms != null ? r.forms : '-');
    if (reportStatViews) reportStatViews.textContent = (r.views != null ? r.views : '-');
    if (reportStatJava)  reportStatJava.textContent  = (r.javaAgents != null ? r.javaAgents : '-');
    if (reportStatLs)    reportStatLs.textContent    = (r.lotusScriptAgents != null ? r.lotusScriptAgents : '-');

    if (reportStatViab) {
      reportStatViab.textContent = (v || '-');
      reportStatViab.classList.remove('ns-stat-num-good', 'ns-stat-num-warn', 'ns-stat-num-bad');
      if (v === 'A')      reportStatViab.classList.add('ns-stat-num-good');
      else if (v === 'B') reportStatViab.classList.add('ns-stat-num-warn');
      else if (v === 'C') reportStatViab.classList.add('ns-stat-num-bad');
    }

    if (calloutHeading) {
      if (v === 'A')      calloutHeading.innerHTML = '&check; Ready to migrate.';
      else if (v === 'B') calloutHeading.innerHTML = '&#9888; Migration with caveats.';
      else if (v === 'C') calloutHeading.innerHTML = '&times; Significant changes needed.';
      else                calloutHeading.textContent = '';
    }
    if (calloutMessage) calloutMessage.textContent = r.message || '';

    if (analysisCallout) {
      analysisCallout.classList.remove('ns-callout-warn', 'ns-callout-bad');
      if (v === 'B') analysisCallout.classList.add('ns-callout-warn');
      else if (v === 'C') analysisCallout.classList.add('ns-callout-bad');
    }

    /* Confidence line below the report card: "Your <file> scored
       <letter> for viability - <qualifier>." Letter + qualifier
       both follow the viability so the sentence stays consistent
       with the score. */
    if (confidenceViability) {
      confidenceViability.textContent = (v || '-') + ' for viability';
    }
    if (confidenceQualifier) {
      if (v === 'A')      confidenceQualifier.textContent = 'no migration blockers found';
      else if (v === 'B') confidenceQualifier.textContent = 'migration is feasible with some caveats';
      else if (v === 'C') confidenceQualifier.textContent = 'significant changes will be needed before migration';
      else                confidenceQualifier.textContent = '';
    }

    /* Email-form description. For A/B the magic link launches the
       file in Nomad; for C, launching a problematic file is a poor
       framing - pivot to "send the full breakdown" instead. */
    if (actionSub) {
      if (v === 'C') {
        actionSub.textContent = "Enter your email and we'll send a magic link with the full breakdown of changes needed.";
      } else {
        actionSub.textContent = "Enter your email and we'll send a magic link to launch your file in HCL Nomad.";
      }
    }
  }

  /* --- Error stage: hide other stages, show the red error card. ---- */
  function showErrorStage(message) {
    clearTimers();
    [stagePreparing, stageAnalyzing, stageResults].forEach(function(el) {
      if (el) el.style.display = 'none';
    });
    if (stageError) {
      stageError.style.display = '';
      stageError.classList.remove('ns-fade-out');
      stageError.classList.add('ns-fade-in');
    }
    if (stageErrorMessage) stageErrorMessage.textContent = message || 'Please try again, or use a different database.';
  }

  /* --- Upload filename helpers (lifted from the old upload-test
         block - the analyzer expects randomized filenames so two
         uploads of "Real.nsf" don't collide on the server). --------- */
  function makeUploadNames(file) {
    var dot  = file.name.lastIndexOf('.');
    var stem = dot > 0 ? file.name.slice(0, dot) : file.name;
    var ext  = dot > 0 ? file.name.slice(dot)    : '';
    var id   = generateRandomId();
    var targetStem = stem + '-nomad-' + id;
    return {
      originalName: file.name,
      originalStem: stem,
      extension:    ext,
      targetStem:   targetStem,
      targetName:   targetStem + ext
    };
  }
  function generateRandomId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID().replace(/-/g, '');
    }
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.prototype.map.call(bytes, function(b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    }
    return (Math.random().toString(36).slice(2) +
            Math.random().toString(36).slice(2)).slice(0, 32);
  }

  /* --- Stage runners. Return a Promise that resolves when the
         progress bar reaches 100% (the *animation* is done) — they no
         longer hide the block on their own. The block stays on screen
         until the caller invokes hideStage(), which lets us gate the
         disappearance on the actual server response and avoid the
         "blank screen while we wait" gap. onDone fires at the same
         point as resolve for any legacy callers. ----------------- */
  function runPreparingStage(onDone) {
    return new Promise(function(resolve) {
      if (!stagePreparing) { if (onDone) onDone(); resolve(); return; }
      stagePreparing.style.display = '';
      stagePreparing.classList.remove('ns-fade-out');
      stagePreparing.classList.add('ns-fade-in');
      if (prepBar) prepBar.style.width = '0%';
      if (prepSub) prepSub.textContent = 'Securing your upload…';

      schedule(function() {
        if (prepBar) prepBar.style.width = '40%';
        if (prepSub) prepSub.textContent = 'Verifying file integrity…';
      }, 450);
      schedule(function() {
        if (prepBar) prepBar.style.width = '85%';
        if (prepSub) prepSub.textContent = 'Almost ready…';
      }, 1500);
      schedule(function() {
        if (prepBar) prepBar.style.width = '100%';
        /* Bar is full but we may still be waiting on the server. The
           sub-copy stays in-progress so users don't read "Done." while
           nothing visibly happens. hideStage() will be triggered by
           runFullFlow once the upload response actually arrives. */
        if (prepSub) prepSub.textContent = 'Finishing upload…';
        if (onDone) onDone();
        resolve();
      }, 2250);
    });
  }

  function runAnalyzingStage(onDone) {
    return new Promise(function(resolve) {
      if (!stageAnalyzing) { if (onDone) onDone(); resolve(); return; }
      stageAnalyzing.style.display = '';
      stageAnalyzing.classList.remove('ns-fade-out');
      stageAnalyzing.classList.add('ns-fade-in');
      if (analyzeBar) analyzeBar.style.width = '0%';
      if (analyzeTitle) analyzeTitle.textContent = 'Reading database structure…';
      if (analyzeSub) analyzeSub.textContent = 'Parsing forms, views, agents…';

      schedule(function() {
        if (analyzeBar) analyzeBar.style.width = '35%';
        if (analyzeSub) analyzeSub.textContent = 'Parsing forms, views, agents…';
      }, 300);
      schedule(function() {
        if (analyzeBar) analyzeBar.style.width = '70%';
        if (analyzeSub) analyzeSub.textContent = 'Checking migration blockers…';
      }, 1100);
      schedule(function() {
        if (analyzeBar) analyzeBar.style.width = '100%';
        /* Same pattern as runPreparingStage — bar full, but if the
           backend isn't finished yet we sit with "Scoring viability…"
           rather than a misleading "Done." */
        if (analyzeSub) analyzeSub.textContent = 'Scoring viability…';
        if (onDone) onDone();
        resolve();
      }, 1900);
    });
  }

  /* Caller-driven fade-out + hide for a stage block. Resolves once the
     block is fully removed from the visual flow, so the next stage can
     fade in cleanly with no flash of overlap. Used by runFullFlow and
     runAnalyzingThenResults to time the disappearance against the
     actual server response. */
  function hideStage(stage) {
    return new Promise(function(resolve) {
      if (!stage) { resolve(); return; }
      stage.classList.remove('ns-fade-in');
      stage.classList.add('ns-fade-out');
      schedule(function() {
        stage.style.display = 'none';
        stage.classList.remove('ns-fade-out');
        resolve();
      }, 350);
    });
  }

  function showResultsStage(withPostContent) {
    if (!stageResults) return;
    stageResults.style.display = '';
    stageResults.classList.remove('ns-fade-out');
    stageResults.classList.add('ns-fade-in');
    /* Hide the analytical block's standalone CTA when post-content
       is also showing - avoids two redundant sign-in CTAs. */
    if (analysisCta) {
      analysisCta.style.display = withPostContent ? 'none' : '';
    }
    if (postContent) {
      postContent.style.display = withPostContent ? 'block' : 'none';
    }
    /* Sample-DB-only mode: stretch results stage so the analytical
       block fills the available page height. */
    stageResults.classList.toggle('ns-mode-results-only', !withPostContent);
  }

  /* --- Email form handling ---
     POSTs { email, claim_token } to /api/nomad/magic-link. The
     claim_token comes from the upload response stashed earlier on
     `pendingUploadResult`. Under the normal flow the email form is
     only revealed AFTER the upload promise has resolved, so the
     token is always available here; we still guard defensively. */
  function handleEmailSubmit() {
    if (!emailInput || !emailSubmit) return;
    var email = (emailInput.value || '').trim();
    /* Lightweight shape-check; real validation is server-side. Requires:
       - at least one non-whitespace, non-@ char before the @
       - a literal @
       - non-whitespace, non-@ chars on the domain side
       - at least one dot in the domain, followed by more chars (TLD)
       This correctly accepts "user.name@example.com", "j+sales@a.co.uk",
       etc. The previous indexOf('.')/indexOf('@') check rejected any
       address whose first dot happened to be in the local part. */
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add('is-invalid');
      emailInput.focus();
      return;
    }
    emailInput.classList.remove('is-invalid');
    emailSubmit.disabled = true;
    emailSubmit.textContent = 'Sending…';

    var tag = '[magic-link]';
    var claimToken = pendingUploadResult ? pendingUploadResult.claim_token : null;
    if (!claimToken) {
      console.warn(tag, 'no claim_token available — upload result missing or expired');
    }
    var url = window.NS_BACKEND + '/api/nomad/magic-link';
    var payload = { email: email, claim_token: claimToken || '' };
    console.log(tag, 'POST', url, payload);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function(res) {
        console.log(tag, 'HTTP ' + res.status + ' ' + res.statusText);
        if (!res.ok) {
          /* Try to read the body for a useful error message before bailing. */
          return res.text().then(function(b) {
            throw new Error('Magic-link request failed: HTTP ' + res.status + (b ? ' - ' + b.substring(0, 200) : ''));
          });
        }
        return res.text();
      })
      .then(function(body) {
        if (body) console.log(tag, 'response body:', body);
        /* Success: swap to the confirmation card. */
        emailSubmit.disabled = false;
        emailSubmit.textContent = 'Continue with email';
        if (confirmationEmail) confirmationEmail.textContent = email;
        if (actionPanel) actionPanel.style.display = 'none';
        if (confirmationCard) confirmationCard.style.display = 'block';
      })
      .catch(function(err) {
        console.error(tag, 'failed:', err);
        emailSubmit.disabled = false;
        emailSubmit.textContent = 'Continue with email';
        /* Flag the input so the user knows something went wrong; the
           console carries the real error for the dev. Server-driven
           inline error copy can replace this once the API contract
           settles. */
        emailInput.classList.add('is-invalid');
      });
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
})();
</script>

<!-- ============================================================ -->
<!-- Disclaimer modal wiring. Trigger lives inside the dropzone,  -->
<!-- so stopPropagation/stopImmediatePropagation on its click is   -->
<!-- required - otherwise the click bubbles to the dropzone's     -->
<!-- file-picker handler. Escape key + backdrop click + close     -->
<!-- button all dismiss. Focus is moved to the close button on    -->
<!-- open and restored to the trigger on close.                   -->
<!-- ============================================================ -->
<script>
(function() {
  var trigger = document.getElementById('disclaimer-trigger');
  var modal   = document.getElementById('disclaimer-modal');
  if (!trigger || !modal) return;

  var lastFocus = null;

  function openModal(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
    lastFocus = document.activeElement;
    modal.hidden = false;
    /* Focus the close button so keyboard users can dismiss with Enter. */
    var closeBtn = modal.querySelector('.ns-modal-close');
    if (closeBtn) { try { closeBtn.focus(); } catch (_) {} }
    document.addEventListener('keydown', onKey);
  }

  function closeModal() {
    modal.hidden = true;
    document.removeEventListener('keydown', onKey);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (_) {}
    }
  }

  function onKey(e) {
    if (e.key === 'Escape' || e.keyCode === 27) closeModal();
  }

  /* Capture phase: ensures we intercept the click before the dropzone's
     bubble-phase listener runs (some browsers serialize handlers in
     unexpected orders when an ancestor has its own click handler). */
  trigger.addEventListener('click', openModal, true);
  /* Also block keyboard activation (Enter/Space) from reaching the
     dropzone, since the dropzone itself responds to those keys. */
  trigger.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); }
  });

  /* Any element with data-close (backdrop, X button) dismisses. */
  modal.addEventListener('click', function(e) {
    var t = e.target;
    if (t && t.hasAttribute && t.hasAttribute('data-close')) closeModal();
  });
})();
</script>

<!-- ============================================================ -->
<!-- TEMP: shared config for the test scripts below.               -->
<!--                                                               -->
<!-- NS_BACKEND comes from `backend_url` in _config.yml (single    -->
<!-- source of truth used by both HTML hrefs and JS code). The WS  -->
<!-- base is derived from it by swapping the scheme to wss://.     -->
<!--                                                               -->
<!-- The WS server uses a self-signed cert. If the browser rejects -->
<!-- the WSS connection, visit https://<host>/ once and            -->
<!-- accept the cert warning; that trusts it for the session.      -->
<!--                                                               -->
<!-- NS_ANALYZE_SERVER: server-side routing token expected in the  -->
<!--   envelope's `username` field. Same value every connection - -->
<!--   NOT a per-user identifier.                                  -->
<!-- ============================================================ -->
<script>
  window.NS_BACKEND         = '{{ site.backend_url }}';
  window.NS_WEBSOCKET_BASE  = window.NS_BACKEND.replace(/^http/, 'ws') + '/ws/anonymous';
  window.NS_ANALYZE_SERVER  = 'ANALYZEx9pVRTzQ5sbK1wMnHd7Yfg2Lj';
</script>

<!-- WebSocket client class. Loaded once; both the test block below   -->
<!-- and (later) the real analyze flow share the same singleton.      -->
<!-- URL prefix is /docs/ because the Jekyll source is the project   -->
<!-- root, not docs/ - see _config.yml and .github/workflows/pages.yml -->
<script src="{{ '/assets/js/ns-websocket.js' | relative_url }}"></script>

<!-- ============================================================ -->
<!-- TEMP: CORS sandbox bound to the "Try it now" banner button.   -->
<!-- Click the button -> two cross-origin fetches run in parallel: -->
<!--   1. https://example.com/    (no CORS header, expect failure) -->
<!--   2. https://api.github.com/zen  (CORS allowed, expect ok)   -->
<!--   3. NS_BACKEND/public/file/serve/...  (test success)         -->
<!-- Open DevTools console + Network tab before clicking. To       -->
<!-- remove: delete this <script> block and the id="try-it-now-    -->
<!-- banner" attribute on the banner link above.                   -->
<!-- ============================================================ -->
<script>
(function() {
  var btn = document.getElementById('try-it-now-banner');
  if (btn) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('%c[CORS test] click', 'font-weight:bold;color:#9d8df1');
    runFetch('https://example.com/',         'no Access-Control-Allow-Origin header (expect CORS block)');
    runFetch('https://api.github.com/zen',   'CORS-friendly endpoint (expect success)');
    runFetch(window.NS_BACKEND + '/public/file/serve/moonshine-dev-private/resources/config.json',
             window.NS_BACKEND + ' endpoint (test success)');
  });

  function runFetch(url, label) {
    var tag = '[' + url + ']';
    console.log(tag, 'starting -', label);
    fetch(url)
      .then(function(response) {
        console.log(tag, '%cSUCCESS', 'color:#66bb6a;font-weight:bold',
          '- HTTP ' + response.status + ' ' + response.statusText);
        console.log(tag, 'response.type =', response.type, '(should be "basic" or "cors")');
        var headers = {};
        response.headers.forEach(function(v, k) { headers[k] = v; });
        console.log(tag, 'visible headers:', headers);
        return response.text();
      })
      .then(function(body) {
        console.log(tag, 'body (first 300 chars):',
          body.length > 300 ? body.substring(0, 300) + '... [truncated]' : body);
      })
      .catch(function(err) {
        console.warn(tag, '%cFAILED', 'color:#e57373;font-weight:bold',
          '-', err.name + ': ' + err.message);
        console.warn(tag, 'fetch() rejects with an opaque TypeError on CORS blocks.',
          'Check the Network tab for the actual request/response and the browser-emitted',
          'CORS reason (e.g. "No \'Access-Control-Allow-Origin\' header").');
      });
  }
})();
</script>


<!-- ============================================================ -->
<!-- TEMP: WebSocket proof-of-life test. On page load, opens a    -->
<!-- connection to the analyze WS server and fires a helloWorld   -->
<!-- message; the server echoes back a decoded JSON object that   -->
<!-- we log to the console. Mirrors the test snippet the backend  -->
<!-- team provided, but goes through the reusable NSWebSocket     -->
<!-- class so the same instance can drive the real analyze flow   -->
<!-- once that contract is wired up.                              -->
<!--                                                              -->
<!-- Host and routing token come from NS_WEBSOCKET_BASE and       -->
<!-- NS_ANALYZE_SERVER in the config block above; the WS base is  -->
<!-- itself derived from NS_BACKEND so the whole page points at   -->
<!-- one environment from a single setting.                       -->
<!--                                                              -->
<!-- To remove: delete this <script> block.                       -->
<!-- ============================================================ -->
<script>
(function() {
  if (!window.NS_WEBSOCKET_BASE || !window.NS_ANALYZE_SERVER) {
    console.warn('[ws test] skipped - NS_WEBSOCKET_BASE or NS_ANALYZE_SERVER not configured');
    return;
  }

  var ws = NSWebSocket.getInstance({
    url:          window.NS_WEBSOCKET_BASE,
    serverToken:  window.NS_ANALYZE_SERVER,
    pathPrefix:   'analyze',
    clientPrefix: 'client-'
  });

  /* Show/hide the green "Connecting to server.." status beside the
     sample-DB button. It stays up while the helloWorld handshake is in
     flight and comes down on the first definitive outcome — a server
     reply (success or "ERROR:") or a dropped/failed connection. */
  function setConnecting(on) {
    var el = document.getElementById('ns-connecting');
    if (el) el.style.display = on ? 'inline' : 'none';
  }

  /* Log every inbound frame so we can see the round-trip in DevTools. */
  ws.on('message', function(evt) {
    console.log('[ws test] %cdecoded response', 'color:#66bb6a;font-weight:bold', evt.decoded);
    /* Any reply means the handshake resolved — stop the connecting pulse. */
    setConnecting(false);
    /* The analyze server replies to helloWorld with a plain
       "ERROR: ..." string when the analyzer backend is unavailable.
       Surface that to the user as the red error block beneath the
       dropzone; hide it again on any non-error reply (e.g. after a
       successful reconnect). */
    var errEl = document.getElementById('ns-analyzer-error');
    if (errEl) {
      var isError = typeof evt.decoded === 'string' && /^\s*ERROR:/i.test(evt.decoded);
      errEl.style.display = isError ? 'block' : 'none';
    }
  });

  ws.on('open', function(info) {
    console.log('[ws test] %cconnected', 'color:#9d8df1;font-weight:bold',
      'clientId=' + info.clientId);
    /* Connected — clear any error shown by a previous failed attempt so
       a successful reconnect within the retry budget removes the block. */
    var errEl = document.getElementById('ns-analyzer-error');
    if (errEl) errEl.style.display = 'none';
    /* Fire the proof-of-life ping. The server should reply with a
       JSON object echoing/acknowledging the payload. */
    ws.helloWorld('ping from browser');
  });

  ws.on('close', function() {
    /* Connection dropped or never established (timeout / refused). Show
       the red error block immediately — on the very first failed attempt
       — rather than waiting for all retries to be exhausted. If a later
       reconnect succeeds, the 'open' handler above hides it again. */
    setConnecting(false);
    var errEl = document.getElementById('ns-analyzer-error');
    if (errEl) errEl.style.display = 'block';
  });

  ws.on('reconnectFailed', function(info) {
    console.warn('[ws test] gave up after ' + info.attempts + ' reconnect attempt(s)');
  });

  /* Kick off the connection and start the connecting indicator. */
  setConnecting(true);
  ws.open();
})();
</script>

<!-- markdownlint-enable MD033 MD013 -->
