---
title: Home (variant A)
layout: home
nav_exclude: true
description: "Nomad Services - See your HCL Domino NSF analyzed for migration viability in seconds. No signup required for the preview."
permalink: /variants/a/
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
/* Launching-view styles — used when the user drops/picks a     */
/* file. The whole launching view is hidden by default and      */
/* shown by JS when the URL pushes to /launching/. We're not    */
/* navigating, so the theme header and footer remain in place.  */
/* ============================================================ */
.ns-launching-wrap {
  max-width: 720px;
  margin: 1rem auto 3rem;
  padding: 0 1rem;
  /* Keep theme footer near the viewport bottom while the launching view is short.
     Once content reveals (file card + action panel), the wrap grows past this
     min-height naturally and the page scrolls. */
  min-height: calc(100vh - 18.5rem);
}
.ns-progress-strip {
  background: rgba(108,92,231,0.08);
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 1.5rem 1.5rem 1.25rem;
  margin-bottom: 2rem;
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

/* Stepper card — anchored visual: circles, connecting bars, in a backed card */
.ns-step-card {
  background: linear-gradient(180deg, rgba(108,92,231,0.06) 0%, rgba(108,92,231,0.02) 100%);
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 2rem 1.5rem 1.5rem;
  margin-bottom: 2rem;
}
.ns-stepper { display: flex; align-items: flex-start; justify-content: center; }
.ns-step { display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 130px; }
.ns-step-circle {
  width: 52px; height: 52px; border-radius: 50%;
  border: 2px solid #2a2a4a; background: #1a1a35; color: #6a6a7c;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1.2rem; position: relative; z-index: 2;
}
.ns-step.is-done .ns-step-circle { background: #43a047; border-color: #43a047; color: #ffffff; }
.ns-step.is-active .ns-step-circle {
  background: #6c5ce7; border-color: #6c5ce7; color: #ffffff;
  box-shadow: 0 0 0 6px rgba(108,92,231,0.20);
}
.ns-step-label {
  font-size: 0.9rem; color: #a0a0b8; margin-top: 0.75rem;
  text-align: center; line-height: 1.3; max-width: 110px;
}
.ns-step.is-done .ns-step-label { color: #66bb6a; font-weight: 500; }
.ns-step.is-active .ns-step-label { color: #e8c547; font-weight: 600; }
.ns-step-bar {
  flex: 1; height: 3px; background: #2a2a4a;
  margin: 26px 4px 0; border-radius: 2px;
  position: relative; z-index: 1;
}
.ns-step-bar.is-done { background: #43a047; }

/* File card */
.ns-file-card {
  display: flex; align-items: center; gap: 1rem;
  background: rgba(108,92,231,0.04); border: 1px solid #2a2a4a;
  border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 2rem;
}
.ns-file-icon {
  flex: 0 0 auto; width: 48px; height: 48px;
  background: linear-gradient(135deg, #6c5ce7, #a855f7);
  border-radius: 8px; display: flex; align-items: center;
  justify-content: center; font-size: 1.5rem;
}
.ns-file-meta { flex: 1 1 auto; min-width: 0; }
.ns-file-name {
  font-family: monospace; font-size: 1rem; color: #e0e0f0;
  word-break: break-all; line-height: 1.3;
}
.ns-file-size { font-size: 0.85rem; color: #a0a0b8; margin-top: 0.2rem; }
.ns-file-status {
  flex: 0 0 auto; color: #66bb6a;
  font-size: 0.9rem; font-weight: 600; white-space: nowrap;
}

/* Action panel */
.ns-action-panel { text-align: center; padding: 1rem 0 0; }
.ns-action-headline {
  color: #e8c547; font-size: 1.6rem; font-weight: 700; margin: 0 0 0.5rem;
}
.ns-action-sub {
  color: #c8c8d8; font-size: 1rem; margin: 0 auto 2rem; max-width: 520px;
}
.ns-button-row {
  display: flex; flex-direction: column; gap: 0.75rem;
  max-width: 420px; margin: 0 auto 1.5rem;
}
.ns-btn {
  display: inline-block; padding: 14px 24px;
  font-size: 1rem; font-weight: 600;
  text-decoration: none; border-radius: 8px; text-align: center;
  cursor: pointer; border: 1px solid transparent;
  transition: background 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box;
}
.ns-btn-primary { background: #6c5ce7; color: #ffffff; }
.ns-btn-primary:hover { background: #7a6ee8; }
.ns-btn-secondary {
  background: rgba(255,255,255,0.04); color: #e0e0f0;
  border: 1px solid rgba(255,255,255,0.25);
}
.ns-btn-secondary:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.45);
}
.ns-reassurance { color: #6a6a7c; font-size: 0.85rem; margin: 0 0 1.5rem; }
.ns-exit-link {
  display: inline-block; color: #6a6a7c;
  font-size: 0.9rem; text-decoration: underline; cursor: pointer;
  background: none; border: none; padding: 0; font-family: inherit;
}
.ns-exit-link:hover { color: #9d8df1; }

/* Reveal animation when launching content fades in */
.ns-fade-in { opacity: 0; animation: ns-fade-in 0.5s ease-out forwards; }
@keyframes ns-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Narrow viewport: shrink stepper */
/* ============================================================ */
/* Belt-and-suspenders hide rules for launching mode.            */
/* When body has .ns-launching-active, we hide:                 */
/*   - the entire #marketing-view wrapper (in case kramdown      */
/*     kept it intact)                                           */
/*   - everything between the announcement banner and the        */
/*     final-cta section (in case kramdown un-wrapped them)      */
/*   - the inline sample analysis panel                          */
/* This guarantees the marketing content is hidden no matter     */
/* how kramdown handled the raw-HTML wrappers.                   */
/* ============================================================ */
body.ns-launching-active #marketing-view,
body.ns-launching-active #analysis-results,
body.ns-launching-active #upload-dropzone {
  display: none !important;
}
/* Hide the loose siblings that kramdown may have promoted out of
   #marketing-view, identified by their unique ids. */
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
/* And their parent sections, identified structurally. */
body.ns-launching-active #marketing-view ~ div:not(#launching-view),
body.ns-launching-active #marketing-view ~ hr,
body.ns-launching-active #marketing-view ~ p,
body.ns-launching-active #marketing-view ~ h2 {
  display: none !important;
}

</style>

<div id="marketing-view" markdown="1">
<div style="background: linear-gradient(135deg, #6c5ce7 0%, #a855f7 50%, #6c5ce7 100%); margin: -2rem -2rem 2rem -2rem; padding: 1rem 2rem; text-align: center; position: relative; overflow: hidden;">
  <div style="position: relative; z-index: 1;">
    <span style="color: #ffffff; font-size: 1.1rem; font-weight: 600; letter-spacing: 0.02em;">&#128640; See your NSF analyzed in seconds - free preview, no signup required.</span>
    <a href="#upload-dropzone" style="display: inline-block; margin-left: 1.5rem; background: #e8c547; color: #0f0f23; font-weight: 700; padding: 6px 20px; border-radius: 20px; text-decoration: none; font-size: 0.95rem;">Try it now &darr;</a>
  </div>
</div>

<h2 class="fs-9" style="text-align: center; font-weight: 800; font-size: 4rem; margin-bottom: 0.25rem;">Nomad Services</h2>

<p class="fs-5 fw-300" style="margin-top: 5.0rem; text-align: center;">Upload your NSF and get a full migration viability report in seconds - before you ever create an account.</p>

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
    <input type="file" id="nsf-file-input" accept=".nsf" style="display: none;" aria-hidden="true">
  </div>

  <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; font-size: 1rem; color: #c8c8d8;">
  <span>Don't have an NSF handy?</span>
  <a href="#analysis-results" id="sample-db-link" style="display: inline-block; padding: 8px 20px; background: rgba(255,255,255,0.04); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: background 0.2s ease, border-color 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.10)'; this.style.borderColor='rgba(255,255,255,0.45)';" onmouseout="this.style.background='rgba(255,255,255,0.04)'; this.style.borderColor='rgba(255,255,255,0.25)';">Try with our sample database &rarr;</a>
  <span style="color: #6a6a7c;">|</span>
  <a href="#demo-video" style="color: #9d8df1;">Watch the 60-second demo &rarr;</a>
</div>

  <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: #6a6a7c;">
    &#128274; Analyzed and deleted within 15 minutes &middot; Never stored &middot; TLS encrypted in transit
  </div>

</div>

<!-- ============================================================ -->
<!-- INLINE ANALYSIS PROGRESS + RESULTS CARD                      -->
<!-- Hidden by default; shown after drop or sample click.          -->
<!-- TODO(backend): replace mock data with real API response.     -->
<!-- ============================================================ -->

<div id="analysis-results" style="display: none; margin: 2rem 0;">

  <div id="analysis-loading" style="padding: 2rem; background: rgba(108,92,231,0.08); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div style="font-size: 1.1rem; color: #c8c8d8; margin-bottom: 1rem;" id="analysis-loading-text">Analyzing your NSF&hellip;</div>
    <div style="height: 6px; background: rgba(108,92,231,0.15); border-radius: 3px; overflow: hidden; max-width: 400px; margin: 0 auto;">
      <div id="analysis-progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #6c5ce7, #a855f7); transition: width 0.4s ease;"></div>
    </div>
    <div style="font-size: 0.85rem; color: #6a6a7c; margin-top: 0.75rem;" id="analysis-loading-sub">Parsing forms, views, agents&hellip;</div>
  </div>

  <div id="analysis-report" style="display: none; padding: 2rem; background: linear-gradient(135deg, rgba(76,175,80,0.08) 0%, rgba(76,175,80,0.02) 100%); border: 1px solid #43a047; border-radius: 12px;">
    <div id="analysis-status" style="color: #9d8df1; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; margin-bottom: 0.5rem;">Sample analysis</div>
    <h3 id="analysis-title" style="color: #e8c547; margin: 0 0 1.5rem; font-size: 1.5rem;">CRM.nsf &mdash; Customer Relationship Management</h3>

    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
      <div style="flex: 1; min-width: 120px; text-align: center;">
        <div style="font-size: 2.5rem; font-weight: 700; color: #e8c547; line-height: 1;">42</div>
        <div style="font-size: 0.9rem; color: #a0a0b8; margin-top: 0.25rem;">Forms</div>
      </div>
      <div style="flex: 1; min-width: 120px; text-align: center;">
        <div style="font-size: 2.5rem; font-weight: 700; color: #e8c547; line-height: 1;">17</div>
        <div style="font-size: 0.9rem; color: #a0a0b8; margin-top: 0.25rem;">Views</div>
      </div>
      <div style="flex: 1; min-width: 120px; text-align: center;">
        <div style="font-size: 2.5rem; font-weight: 700; color: #e8c547; line-height: 1;">8</div>
        <div style="font-size: 0.9rem; color: #a0a0b8; margin-top: 0.25rem;">Agents</div>
      </div>
      <div style="flex: 1; min-width: 120px; text-align: center;">
        <div style="font-size: 2.5rem; font-weight: 700; color: #66bb6a; line-height: 1;">A</div>
        <div style="font-size: 0.9rem; color: #a0a0b8; margin-top: 0.25rem;">Viability</div>
      </div>
    </div>

    <div style="padding: 1rem; background: rgba(67,160,71,0.1); border-left: 3px solid #43a047; border-radius: 4px; margin-bottom: 1.5rem;">
      <strong style="color: #66bb6a;">&check; Ready to migrate.</strong>
      <span style="color: #c8c8d8;">No blockers detected. Standard LotusScript and Formula patterns throughout. Estimated Nomad rendering time: under 30 seconds.</span>
    </div>

    <div style="text-align: center; padding-top: 0.5rem;">
      <a href="https://app.moonshine.dev/public/file/serve/domino-integration/index.html" target="_blank" rel="noopener" class="btn btn-primary fs-5">Sign in to see it running live &rarr;</a>
      <p style="color: #6a6a7c; font-size: 0.85rem; margin-top: 0.75rem;">Free for 30 days. No credit card required.</p>
    </div>
  </div>

</div>

<!-- Note: dropzone, sample, and view-switching logic is handled by the
     unified script at the bottom of this file. -->


---

<div style="text-align: center; padding: 2rem 0;">
  <h2 id="accelerate-your-domino-modernization" style="font-size: 2rem; color: #e0e0f0;">Accelerate Your Domino Modernization</h2>
  <p style="font-size: 1.2rem; color: #c8c8d8; max-width: 800px; margin: 0 auto;">
    Legacy applications shouldn't hold your organization back. Nomad Services bridges the gap between your existing Domino investments and the modern, mobile-first experiences your users demand.
  </p>
</div>

---

<div style="display: flex; gap: 2rem; flex-wrap: wrap; margin: 2rem 0; justify-content: center;">

  <div style="flex: 1; min-width: 250px; max-width: 350px; padding: 2rem; background: linear-gradient(135deg, rgba(108,92,231,0.1) 0%, rgba(168,85,247,0.05) 100%); border: 1px solid #2a2a4a; border-radius: 12px;">
    <h3 style="color: #e8c547; margin-top: 0;">See Results Before You Sign Up</h3>
    <p>Skip the account creation. Drop an NSF or try our sample - your viability report shows up in seconds, not forms-to-fill-out later.</p>
  </div>

  <div style="flex: 1; min-width: 250px; max-width: 350px; padding: 2rem; background: linear-gradient(135deg, rgba(108,92,231,0.1) 0%, rgba(168,85,247,0.05) 100%); border: 1px solid #2a2a4a; border-radius: 12px;">
    <h3 style="color: #e8c547; margin-top: 0;">Enterprise-Grade Cloud</h3>
    <p>Built on the <a href="https://moonshine.team">moonshine.team</a> infrastructure - a secure, scalable, cloud-native environment purpose-built for Domino workloads.</p>
  </div>

  <div style="flex: 1; min-width: 250px; max-width: 350px; padding: 2rem; background: linear-gradient(135deg, rgba(108,92,231,0.1) 0%, rgba(168,85,247,0.05) 100%); border: 1px solid #2a2a4a; border-radius: 12px;">
    <h3 style="color: #e8c547; margin-top: 0;">Cross-Platform, Mobile-First</h3>
    <p>See exactly how your application renders on desktop, tablet, and mobile. HCL Nomad delivers your Domino apps to <strong>every device</strong>, everywhere.</p>
  </div>

</div>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 id="how-it-works" style="font-size: 2rem; color: #e0e0f0;">How It Works</h2>
  <p style="font-size: 1.1rem; color: #9d8df1;">From NSF to live application in four simple steps</p>
</div>

<div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 1.5rem 0; justify-content: center;">

  <div style="flex: 1; min-width: 180px; max-width: 260px; padding: 2rem 1.5rem; background: rgba(108, 92, 231, 0.08); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div style="font-size: 2.5rem; color: #e8c547; font-weight: 700; margin-bottom: 0.5rem;">01</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Drop or sample</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">Upload your NSF or try our sample database - no signup required to start.</p>
  </div>

  <div style="flex: 1; min-width: 180px; max-width: 260px; padding: 2rem 1.5rem; background: rgba(108, 92, 231, 0.08); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div style="font-size: 2.5rem; color: #e8c547; font-weight: 700; margin-bottom: 0.5rem;">02</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Instant analysis</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">See forms, views, agents, and migration viability scored in seconds.</p>
  </div>

  <div style="flex: 1; min-width: 180px; max-width: 260px; padding: 2rem 1.5rem; background: rgba(108, 92, 231, 0.08); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div style="font-size: 2.5rem; color: #e8c547; font-weight: 700; margin-bottom: 0.5rem;">03</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Review the report</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">Full compatibility breakdown with zero commitment - still no account needed.</p>
  </div>

  <div style="flex: 1; min-width: 180px; max-width: 260px; padding: 2rem 1.5rem; background: linear-gradient(135deg, rgba(232,197,71,0.12) 0%, rgba(232,197,71,0.04) 100%); border: 1px solid #e8c547; border-radius: 12px; text-align: center;">
    <div style="font-size: 2.5rem; color: #e8c547; font-weight: 700; margin-bottom: 0.5rem;">04</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Sign in to run live</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">Free 30-day trial unlocks your database running interactively in HCL Nomad.</p>
  </div>

</div>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 id="demo-video" style="font-size: 2rem; color: #e0e0f0;">Prefer to Watch First?</h2>
  <p style="font-size: 1.1rem; color: #c8c8d8; max-width: 700px; margin: 0 auto 1.5rem;">
    A 60-second tour of what happens between drop and live-in-Nomad.
  </p>
  <div style="max-width: 720px; margin: 0 auto; aspect-ratio: 16/9; background: rgba(108,92,231,0.08); border: 1px solid #2a2a4a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #6a6a7c;">
    <!-- TODO(marketing): replace with <iframe> to YouTube/Vimeo embed when the demo video is recorded -->
    <span>Demo video &mdash; coming soon</span>
  </div>
</div>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 id="domino-online-editor" style="font-size: 2rem; color: #e8c547;">Domino Online Editor</h2>
  <p style="font-size: 1.2rem; color: #c8c8d8; max-width: 800px; margin: 0 auto;">
    A complete <strong>browser-based environment</strong> for building, managing, and deploying Domino applications across your entire infrastructure. No Notes client required.
  </p>
</div>

<div style="display: flex; gap: 2rem; flex-wrap: wrap; margin: 2rem 0; justify-content: center;">

  <div style="flex: 1; min-width: 250px; max-width: 280px; padding: 2rem; background: linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.03) 100%); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div aria-hidden="true" style="width: 56px; height: 56px; margin: 0 auto 1rem; background: linear-gradient(135deg, #43a047, #66bb6a); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">&#128187;</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Agent Development</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">Create and edit <strong>LotusScript</strong>, <strong>Java</strong>, and <strong>Formula</strong> agents directly in your browser. Full syntax highlighting and debugging.</p>
  </div>

  <div style="flex: 1; min-width: 250px; max-width: 280px; padding: 2rem; background: linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.03) 100%); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div aria-hidden="true" style="width: 56px; height: 56px; margin: 0 auto 1rem; background: linear-gradient(135deg, #43a047, #66bb6a); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">&#128451;</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Database Management</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">Browse, manage, and edit Domino <strong>database elements</strong> online. Full CRUD operations without a desktop client.</p>
  </div>

  <div style="flex: 1; min-width: 250px; max-width: 280px; padding: 2rem; background: linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(156,39,176,0.03) 100%); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div aria-hidden="true" style="width: 56px; height: 56px; margin: 0 auto 1rem; background: linear-gradient(135deg, #8e24aa, #ab47bc); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">&#127760;</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Multi-Server Support</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">Connect to <strong>multiple Domino servers</strong> with a single ID file. Manage your entire infrastructure from one interface.</p>
  </div>

  <div style="flex: 1; min-width: 250px; max-width: 280px; padding: 2rem; background: linear-gradient(135deg, rgba(156,39,176,0.1) 0%, rgba(156,39,176,0.03) 100%); border: 1px solid #2a2a4a; border-radius: 12px; text-align: center;">
    <div aria-hidden="true" style="width: 56px; height: 56px; margin: 0 auto 1rem; background: linear-gradient(135deg, #8e24aa, #ab47bc); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">&#128260;</div>
    <h4 style="color: #e0e0f0; margin: 0.5rem 0;">Version Control</h4>
    <p style="color: #a0a0b8; font-size: 0.95rem;">Built-in <strong>backup and restore</strong> for design elements. Track changes and roll back with confidence.</p>
  </div>

</div>

<div style="text-align: center; padding: 1rem 0 0;">
  <p style="font-size: 1.1rem; color: #9d8df1; margin-bottom: 1rem;">Secure ID file management - connect to any Domino server from your browser</p>
</div>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 id="built-for-the-enterprise" style="font-size: 2rem; color: #e0e0f0;">Built for the Enterprise</h2>
</div>

<div style="display: flex; gap: 3rem; flex-wrap: wrap; margin: 1rem 0 2rem; justify-content: center;">

  <div style="text-align: center; max-width: 200px;">
    <div aria-hidden="true" style="font-size: 2.5rem; color: #e8c547;">&#9889;</div>
    <h4 style="color: #e0e0f0;">Rapid Prototyping</h4>
    <p style="color: #a0a0b8; font-size: 0.9rem;">Validate before you commit. Test modernization strategies in minutes, not quarters.</p>
  </div>

  <div style="text-align: center; max-width: 200px;">
    <div aria-hidden="true" style="font-size: 2.5rem; color: #e8c547;">&#128274;</div>
    <h4 style="color: #e0e0f0;">Secure by Design</h4>
    <p style="color: #a0a0b8; font-size: 0.9rem;">Enterprise-grade security with ID file management. Your data stays protected in our managed cloud.</p>
  </div>

  <div style="text-align: center; max-width: 200px;">
    <div aria-hidden="true" style="font-size: 2.5rem; color: #e8c547;">&#128268;</div>
    <h4 style="color: #e0e0f0;">REST API Access</h4>
    <p style="color: #a0a0b8; font-size: 0.9rem;">Full NoSQL database access via REST APIs. Integrate with modern toolchains and CI/CD workflows.</p>
  </div>

  <div style="text-align: center; max-width: 200px;">
    <div aria-hidden="true" style="font-size: 2.5rem; color: #e8c547;">&#128640;</div>
    <h4 style="color: #e0e0f0;">Digital Transformation</h4>
    <p style="color: #a0a0b8; font-size: 0.9rem;">Bridge legacy Domino to modern mobile-first experiences without rewriting a single line of code.</p>
  </div>

</div>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 id="moonshine-platform" style="font-size: 2rem; color: #e0e0f0;">The Moonshine.dev Platform</h2>
  <p style="font-size: 1.1rem; color: #c8c8d8; max-width: 700px; margin: 0 auto;">
    Nomad Services is part of a complete <strong>rapid application development</strong> ecosystem. Build, test, and deploy - all from one platform.
  </p>
</div>

<div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 2rem 0; justify-content: center;">

  <div style="flex: 1; min-width: 220px; max-width: 270px; padding: 2rem 1.5rem; background: linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.06) 100%); border: 1px solid #2a2a4a; border-radius: 12px;">
    <h4 style="color: #e8c547; margin-top: 0;">Canvas Editor</h4>
    <p style="color: #c8c8d8; font-size: 0.95rem;">Drag-and-drop <strong>WYSIWYG</strong> UI designer. Build mockups visually and deploy to any platform.</p>
    <a href="https://app.moonshine.dev/public/file/serve/moonshine-dev-private/index.html" style="color: #9d8df1; font-size: 0.9rem;">Try Now &rarr;</a>
  </div>

  <div style="flex: 1; min-width: 220px; max-width: 270px; padding: 2rem 1.5rem; background: linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.06) 100%); border: 1px solid #2a2a4a; border-radius: 12px;">
    <h4 style="color: #e8c547; margin-top: 0;">Form Builder</h4>
    <p style="color: #c8c8d8; font-size: 0.95rem;"><strong>Low-code</strong> form creation with built-in validation, fields, and components.</p>
    <a href="https://app.moonshine.dev/public/file/serve/form-builder/index.html" style="color: #9d8df1; font-size: 0.9rem;">Try Now &rarr;</a>
  </div>

  <div style="flex: 1; min-width: 220px; max-width: 270px; padding: 2rem 1.5rem; background: linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.06) 100%); border: 1px solid #2a2a4a; border-radius: 12px;">
    <h4 style="color: #e8c547; margin-top: 0;">AI Tooling</h4>
    <p style="color: #c8c8d8; font-size: 0.95rem;">Describe your UI in <strong>plain English</strong> and watch AI generate your mockup instantly.</p>
    <a href="https://app.moonshine.dev/public/file/serve/moonshine-dev-private/assets/ai/index.html" style="color: #9d8df1; font-size: 0.9rem;">Try Now &rarr;</a>
  </div>

  <div style="flex: 1; min-width: 220px; max-width: 270px; padding: 2rem 1.5rem; background: linear-gradient(135deg, rgba(108,92,231,0.12) 0%, rgba(168,85,247,0.06) 100%); border: 1px solid #2a2a4a; border-radius: 12px;">
    <h4 style="color: #e8c547; margin-top: 0;">Domino Integration</h4>
    <p style="color: #c8c8d8; font-size: 0.95rem;"><strong>NoSQL database</strong> with REST API access and a complete web testing interface.</p>
    <a href="https://app.moonshine.dev/public/file/serve/domino-integration/index.html" style="color: #9d8df1; font-size: 0.9rem;">Try Now &rarr;</a>
  </div>

</div>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 id="pricing" style="font-size: 2rem; color: #e0e0f0;">Pricing</h2>
  <p style="font-size: 1.1rem; color: #c8c8d8; max-width: 700px; margin: 0 auto;">
    From free exploration to full-service modernization - choose the plan that fits your needs.
  </p>
</div>

<div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 2rem 0; justify-content: center; align-items: stretch;">

  <div style="flex: 1; min-width: 280px; max-width: 340px; padding: 2.5rem 2rem; background: linear-gradient(135deg, rgba(108,92,231,0.08) 0%, rgba(108,92,231,0.03) 100%); border: 1px solid #2a2a4a; border-radius: 12px; display: flex; flex-direction: column;">
    <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #9d8df1; margin-bottom: 0.5rem;">Starter</div>
    <div style="font-size: 3rem; font-weight: 700; color: #e8c547; line-height: 1;">Free</div>
    <div style="color: #9d8df1; font-size: 0.85rem; margin-top: 0.25rem;">30-day trial</div>
    <p style="color: #a0a0b8; margin: 1rem 0; font-size: 0.95rem; flex-grow: 1;">Upload your NSF and preview it running in HCL Nomad on our cloud servers. No credit card required.</p>
    <ul style="color: #c8c8d8; font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 1.5rem;">
      <li>NSF upload and deployment</li>
      <li>HCL Nomad web preview</li>
      <li>Cross-platform testing</li>
      <li>Community support</li>
    </ul>
    <a href="#upload-dropzone" class="btn btn-primary" style="text-align: center; width: 100%;">Start with a free preview</a>
  </div>

  <div style="flex: 1; min-width: 280px; max-width: 340px; padding: 2.5rem 2rem; background: linear-gradient(135deg, rgba(108,92,231,0.08) 0%, rgba(168,85,247,0.04) 100%); border: 1px solid #2a2a4a; border-radius: 12px; display: flex; flex-direction: column;">
    <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #9d8df1; margin-bottom: 0.5rem;">Security Audit</div>
    <div style="font-size: 3rem; font-weight: 700; color: #e8c547; line-height: 1;">$200</div>
    <p style="color: #a0a0b8; margin: 1rem 0; font-size: 0.95rem; flex-grow: 1;">Comprehensive security vulnerability assessment of your Domino NSF application by our expert team.</p>
    <ul style="color: #c8c8d8; font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 1.5rem;">
      <li>Full vulnerability scan</li>
      <li>Security risk report</li>
      <li>Remediation recommendations</li>
      <li>Priority email support</li>
    </ul>
    <a href="https://www.moonshine.dev/" class="btn" style="text-align: center; width: 100%; border: 1px solid #6c5ce7; color: #9d8df1;">Request audit</a>
  </div>

  <div style="flex: 1; min-width: 280px; max-width: 340px; padding: 2.5rem 2rem; background: linear-gradient(135deg, rgba(232,197,71,0.12) 0%, rgba(232,197,71,0.04) 100%); border: 2px solid #e8c547; border-radius: 12px; display: flex; flex-direction: column; position: relative;">
    <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #e8c547; color: #0f0f23; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 16px; border-radius: 20px; font-weight: 700;">Most Popular</div>
    <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #e8c547; margin-bottom: 0.5rem;">Enterprise</div>
    <div style="font-size: 3rem; font-weight: 700; color: #e8c547; line-height: 1;">Custom</div>
    <p style="color: #a0a0b8; margin: 1rem 0; font-size: 0.95rem; flex-grow: 1;">End-to-end modernization of your legacy Domino applications. Scope and pricing tailored to your environment.</p>
    <ul style="color: #c8c8d8; font-size: 0.9rem; padding-left: 1.2rem; margin-bottom: 1.5rem;">
      <li>Full application modernization</li>
      <li>Architecture consulting</li>
      <li>Migration planning &amp; execution</li>
      <li>Dedicated support team</li>
    </ul>
    <a href="https://www.moonshine.dev/" class="btn btn-primary" style="text-align: center; width: 100%;">Contact sales</a>
  </div>

</div>

---

<div style="text-align: center; padding: 3rem 0;">
  <h2 id="final-cta" style="font-size: 2.2rem; color: #e8c547; margin-bottom: 1rem;">Ready to See What's Really in Your NSF?</h2>
  <p style="font-size: 1.2rem; color: #c8c8d8; max-width: 600px; margin: 0 auto 2rem;">
    Drop a file or try our sample - get your migration viability report in seconds. No credit card, no signup, nothing to cancel.
  </p>
  <a href="#upload-dropzone" class="btn btn-primary fs-5" style="margin-right: 1rem;">Analyze an NSF now</a>
  <a href="https://www.moonshine.dev/" class="btn fs-5">Contact us</a>
</div>

</div><!-- /#marketing-view -->


<!-- ============================================================ -->
<!-- LAUNCHING VIEW                                                -->
<!-- Hidden by default. Shown by JS when the user drops or picks   -->
<!-- a file. We don't navigate to a new page; we use pushState to  -->
<!-- change the URL to /launching/, hide the marketing view, and   -->
<!-- show this view. The theme header and footer stay in place.    -->
<!-- ============================================================ -->
<div id="launching-view" style="display: none;" markdown="0">
  <div class="ns-launching-wrap">    <div class="ns-progress-strip" id="progress-strip">
      <div class="ns-progress-status">Preparing your file</div>
      <div class="ns-progress-title" id="progress-title">Loading&hellip;</div>
      <div class="ns-progress-track">
        <div class="ns-progress-bar" id="progress-bar"></div>
      </div>
      <div class="ns-progress-sub" id="progress-sub">Securing your upload&hellip;</div>
    </div>

    <div class="ns-step-card ns-fade-in" id="step-card" style="display: none;">
      <div class="ns-stepper">
        <div class="ns-step is-done">
          <div class="ns-step-circle" aria-label="Step 1, completed">&check;</div>
          <div class="ns-step-label">Uploaded</div>
        </div>
        <div class="ns-step-bar is-done"></div>
        <div class="ns-step is-active">
          <div class="ns-step-circle" aria-current="step" aria-label="Step 2, current">2</div>
          <div class="ns-step-label">Sign in</div>
        </div>
        <div class="ns-step-bar"></div>
        <div class="ns-step">
          <div class="ns-step-circle" aria-label="Step 3, pending">3</div>
          <div class="ns-step-label">Run live in Nomad</div>
        </div>
      </div>
    </div>

    <div class="ns-file-card ns-fade-in" id="file-card" style="display: none; animation-delay: 0.1s;">
      <div class="ns-file-icon" aria-hidden="true">&#128196;</div>
      <div class="ns-file-meta">
        <div class="ns-file-name" id="file-name">your-file.nsf</div>
        <div class="ns-file-size" id="file-size">&mdash;</div>
      </div>
      <div class="ns-file-status">&check; Ready</div>
    </div>

    <div class="ns-action-panel ns-fade-in" id="action-panel" style="display: none; animation-delay: 0.2s;">
      <h2 class="ns-action-headline">You're almost there</h2>
      <p class="ns-action-sub">Sign in and we'll launch your file live in HCL Nomad in your browser. The free trial unlocks everything.</p>

      <div class="ns-button-row">
        <a href="https://app.moonshine.dev/public/file/serve/domino-integration/index.html?intent=signup" class="ns-btn ns-btn-primary" id="btn-signup">I'm new here, create my account</a>
        <a href="https://app.moonshine.dev/public/file/serve/domino-integration/index.html?intent=login" class="ns-btn ns-btn-secondary" id="btn-login">I already have an account, sign in</a>
      </div>

      <p class="ns-reassurance">30-day free trial &middot; No credit card &middot; Cancel anytime</p>

      <button type="button" class="ns-exit-link" id="exit-link">Not now, just exploring</button>
    </div>

  </div>
</div><!-- /#launching-view -->


<script>
/* ============================================================ */
/* Unified script: dropzone, sample-DB, and view switching.     */
/*                                                               */
/* The page has two views in the DOM:                            */
/*   - #marketing-view   shown by default                        */
/*   - #launching-view   hidden by default                       */
/* When the user drops or picks a file we use history.pushState  */
/* to change the URL to /launching/ and toggle visibility. We do */
/* NOT actually navigate, so the file stays in JS memory and the */
/* theme header/footer remain rendered above and below.          */
/*                                                               */
/* See docs/FUNNEL.md (or the comparison doc shipped alongside   */
/* this file) for context on why we picked pushState (Option 2)  */
/* over IndexedDB (Option 1) and over a real upload-then-navigate*/
/* token flow (Option 3).                                        */
/* ============================================================ */
(function() {
  /* The actual File object lives here while the launching view is
     active. It's intentionally not persisted across page reloads — if
     the user refreshes /launching/ we treat it as a deep-link without
     a file and bring them back to the marketing view. */
  var pendingFile = null;

  /* Marketing-view elements */
  var dropzone = document.getElementById('upload-dropzone');
  var fileInput = document.getElementById('nsf-file-input');
  var sampleLink = document.getElementById('sample-db-link');
  var results = document.getElementById('analysis-results');
  var loadingPanel = document.getElementById('analysis-loading');
  var loadingSub = document.getElementById('analysis-loading-sub');
  var sampleProgressBar = document.getElementById('analysis-progress-bar');
  var reportPanel = document.getElementById('analysis-report');
  var analysisStatus = document.getElementById('analysis-status');
  var analysisTitle = document.getElementById('analysis-title');

  /* View containers */
  var marketingView = document.getElementById('marketing-view');
  var launchingView = document.getElementById('launching-view');

  /* Launching-view elements */
  var progressTitle = document.getElementById('progress-title');
  var progressBar = document.getElementById('progress-bar');
  var progressSub = document.getElementById('progress-sub');
  var fileNameEl = document.getElementById('file-name');
  var fileSizeEl = document.getElementById('file-size');
  var stepCard = document.getElementById('step-card');
  var fileCard = document.getElementById('file-card');
  var actionPanel = document.getElementById('action-panel');
  var exitLink = document.getElementById('exit-link');

  if (!dropzone || !fileInput || !marketingView || !launchingView) return;

  /* On page load: if URL is /launching/ but we don't have a file in
     memory (i.e. user refreshed or deep-linked), quietly correct the
     URL to / and show the marketing view. The launching view requires
     a file reference that only lives in memory across pushState. */
  (function bootstrapView() {
    var path = window.location.pathname;
    var atLaunching = /\/launching\/?$/.test(path);
    if (atLaunching) {
      try {
        history.replaceState({ view: 'marketing' }, '', '{{ "/" | relative_url }}');
      } catch (_) { /* replaceState unsupported, ignore */ }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUserFile(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) handleUserFile(e.target.files[0]);
  });
  if (sampleLink) {
    sampleLink.addEventListener('click', function(e) {
      e.preventDefault();
      runSampleAnalysis();
    });
  }
  if (exitLink) {
    exitLink.addEventListener('click', function() {
      /* Triggers popstate which calls showMarketingView. */
      history.back();
    });
  }

  /* Browser back/forward buttons */
  window.addEventListener('popstate', function(e) {
    var state = (e && e.state) || {};
    if (state.view === 'launching' && pendingFile) {
      showLaunchingView({ animate: false });
    } else {
      showMarketingView({ scroll: false });
    }
  });

  /* --- View switching ---
     We don't rely on a single wrapper div anymore (kramdown's behavior
     with raw HTML wrappers can be inconsistent across Jekyll setups).
     Instead we add/remove a class on <body>, and the CSS above hides the
     marketing content and the analysis-results card while we're in
     launching mode. */
  function showMarketingView(opts) {
    opts = opts || {};
    pendingFile = null;
    document.body.classList.remove('ns-launching-active');
    if (results) results.style.display = 'none';
    if (launchingView) launchingView.style.display = 'none';
    if (marketingView) marketingView.style.display = '';
    if (opts.scroll !== false) {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
    }
  }

  function showLaunchingView(opts) {
    opts = opts || {};
    document.body.classList.add('ns-launching-active');
    /* Hide the inline sample analysis panel too, in case it was visible
       from a previous sample-DB click. */
    if (results) results.style.display = 'none';
    if (marketingView) marketingView.style.display = 'none';
    if (launchingView) launchingView.style.display = '';
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
    if (opts.animate !== false) runLaunchingAnimation();
  }

  /* --- User upload path --- */
  function handleUserFile(file) {
    pendingFile = file;
    var label = file.name + ' (' + formatSize(file.size) + ')';
    /* Prime visible content BEFORE swapping views, so the launching
       view paints with correct values from frame 1. */
    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = formatSize(file.size);
    if (progressTitle) progressTitle.textContent = 'Preparing ' + file.name + '...';
    /* Reset reveal state in case the user comes back here twice. */
    if (stepCard) stepCard.style.display = 'none';
    if (fileCard) fileCard.style.display = 'none';
    if (actionPanel) actionPanel.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
    if (progressSub) progressSub.textContent = 'Securing your upload...';

    /* pushState to /launching/ — URL changes, no navigation. */
    var launchingPath = '{{ "/launching/" | relative_url }}';
    try {
      history.pushState({ view: 'launching' }, '', launchingPath);
    } catch (_) {
      /* If pushState fails, still show the launching view in place. */
    }
    showLaunchingView({ animate: true });
  }

  function runLaunchingAnimation() {
    /* Honest preparation copy, no fake "analyzing forms/views". The
       sequence is intentionally short; the user shouldn't be made to
       wait, just feel that the system did something. */
    setTimeout(function() {
      if (progressBar) progressBar.style.width = '40%';
      if (progressSub) progressSub.textContent = 'Verifying file integrity...';
    }, 250);
    setTimeout(function() {
      if (progressBar) progressBar.style.width = '85%';
      if (progressSub) progressSub.textContent = 'Almost ready...';
    }, 950);
    setTimeout(function() {
      if (progressBar) progressBar.style.width = '100%';
    }, 1500);
    setTimeout(function() {
      if (progressSub) progressSub.textContent = 'Done.';
      if (stepCard) stepCard.style.display = 'block';
      if (fileCard) fileCard.style.display = 'flex';
      if (actionPanel) actionPanel.style.display = 'block';
    }, 1800);
  }

  /* --- Sample-DB path (unchanged behavior — fake stats are fine for
         the canonical sample) --- */
  function runSampleAnalysis() {
    showSampleLoading('CRM.nsf - Customer Relationship Management', 'Sample analysis');
  }

  function showSampleLoading(title, statusLabel) {
    if (!results) return;
    if (analysisStatus) analysisStatus.textContent = statusLabel;
    if (analysisTitle) analysisTitle.textContent = title;
    results.style.display = 'block';
    if (loadingPanel) loadingPanel.style.display = 'block';
    if (reportPanel) reportPanel.style.display = 'none';
    if (sampleProgressBar) sampleProgressBar.style.width = '0%';
    if (loadingSub) loadingSub.textContent = 'Parsing forms, views, agents...';
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function() {
      if (sampleProgressBar) sampleProgressBar.style.width = '35%';
      if (loadingSub) loadingSub.textContent = 'Parsing forms, views, agents...';
    }, 200);
    setTimeout(function() {
      if (sampleProgressBar) sampleProgressBar.style.width = '70%';
      if (loadingSub) loadingSub.textContent = 'Checking migration blockers...';
    }, 1100);
    setTimeout(function() {
      if (sampleProgressBar) sampleProgressBar.style.width = '100%';
      if (loadingSub) loadingSub.textContent = 'Scoring viability...';
    }, 1900);
    setTimeout(function() {
      if (loadingPanel) loadingPanel.style.display = 'none';
      if (reportPanel) reportPanel.style.display = 'block';
    }, 2500);
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
})();
</script>

<!-- markdownlint-enable MD033 MD013 -->
