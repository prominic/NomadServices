---
title: Home
layout: home
nav_order: 1
description: "Nomad Services - See your HCL Domino NSF analyzed for migration viability in seconds. No signup required for the preview."
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
-->

<div style="background: linear-gradient(135deg, #6c5ce7 0%, #a855f7 50%, #6c5ce7 100%); margin: -2rem -2rem 2rem -2rem; padding: 1rem 2rem; text-align: center; position: relative; overflow: hidden;">
  <div style="position: relative; z-index: 1;">
    <span style="color: #ffffff; font-size: 1.1rem; font-weight: 600; letter-spacing: 0.02em;">&#128640; See your NSF analyzed in seconds - free preview, no signup required.</span>
    <a href="#upload-dropzone" style="display: inline-block; margin-left: 1.5rem; background: #e8c547; color: #0f0f23; font-weight: 700; padding: 6px 20px; border-radius: 20px; text-decoration: none; font-size: 0.95rem;">Try it now &darr;</a>
  </div>
</div>

## Nomad Services
{: .fs-9 style="text-align: center; font-weight: 800; font-size: 4rem; margin-bottom: 0.25rem;" }

<div style="min-height: 4.5rem;">
  <strong id="hero-tagline" class="fs-6 fw-300" style="transition: opacity 0.6s ease; opacity: 1; display: block;"></strong>
</div>

<p class="fs-5 fw-300" style="margin-top: 0.5rem; text-align: center;">Upload your NSF and get a full migration viability report in seconds - before you ever create an account.</p>

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

  <div style="text-align: center; margin-top: 1.5rem; font-size: 1rem; color: #c8c8d8;">
    Don't have an NSF handy?
    <a href="#analysis-results" id="sample-db-link" style="color: #e8c547; font-weight: 600; margin: 0 0.4rem;">Try with our sample database &rarr;</a>
    <span style="color: #6a6a7c;">|</span>
    <a href="#demo-video" style="color: #9d8df1; margin: 0 0.4rem;">Watch the 60-second demo &rarr;</a>
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

<script>
/* Rotating hero tagline */
(function() {
  var phrases = [
    "Your Domino Database - In a Browser, Right in Front of You.",
    "Cloud-Powered HCL Nomad Testing - In Seconds, Not Months.",
    "Modernize Legacy Domino - Without Rewriting a Single Line.",
    "From NSF to Live Application - In Under 60 Seconds.",
    "Enterprise Domino, Meet the Modern Web."
  ];
  var el = document.getElementById('hero-tagline');
  if (!el) return;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.textContent = phrases[0];
  if (prefersReducedMotion) return;
  var i = 0;
  setInterval(function() {
    el.style.opacity = '0';
    setTimeout(function() {
      i = (i + 1) % phrases.length;
      el.textContent = phrases[i];
      el.style.opacity = '1';
    }, 600);
  }, 4000);
})();

/* Dropzone + sample DB analysis flow */
(function() {
  var dropzone = document.getElementById('upload-dropzone');
  var fileInput = document.getElementById('nsf-file-input');
  var sampleLink = document.getElementById('sample-db-link');
  var results = document.getElementById('analysis-results');
  var loadingPanel = document.getElementById('analysis-loading');
  var loadingText = document.getElementById('analysis-loading-text');
  var loadingSub = document.getElementById('analysis-loading-sub');
  var progressBar = document.getElementById('analysis-progress-bar');
  var reportPanel = document.getElementById('analysis-report');
  var analysisStatus = document.getElementById('analysis-status');
  var analysisTitle = document.getElementById('analysis-title');

  if (!dropzone || !fileInput || !results) return;

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

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function showLoading(title, statusLabel) {
    analysisStatus.textContent = statusLabel;
    analysisTitle.textContent = title;
    results.style.display = 'block';
    loadingPanel.style.display = 'block';
    reportPanel.style.display = 'none';
    progressBar.style.width = '0%';
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function() { progressBar.style.width = '35%'; loadingSub.textContent = 'Parsing forms, views, agents...'; }, 200);
    setTimeout(function() { progressBar.style.width = '70%'; loadingSub.textContent = 'Checking migration blockers...'; }, 1100);
    setTimeout(function() { progressBar.style.width = '100%'; loadingSub.textContent = 'Scoring viability...'; }, 1900);
    setTimeout(function() {
      loadingPanel.style.display = 'none';
      reportPanel.style.display = 'block';
    }, 2500);
  }

  function handleUserFile(file) {
    /* TODO(backend): POST the file to /api/analyze, then populate the report panel from the server's response. Showing the mock report for now so the UX flow can be reviewed end-to-end. */
    showLoading(file.name + ' (' + formatSize(file.size) + ')', 'Your NSF');
  }

  function runSampleAnalysis() {
    showLoading('CRM.nsf - Customer Relationship Management', 'Sample analysis');
  }
})();
</script>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 style="font-size: 2rem; color: #e0e0f0;">Accelerate Your Domino Modernization</h2>
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
  <h2 style="font-size: 2rem; color: #e0e0f0;">How It Works</h2>
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

<div id="demo-video" style="text-align: center; padding: 2rem 0;">
  <h2 style="font-size: 2rem; color: #e0e0f0;">Prefer to Watch First?</h2>
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
  <h2 style="font-size: 2rem; color: #e8c547;">Domino Online Editor</h2>
  <p style="font-size: 1.2rem; color: #c8c8d8; max-width: 800px; margin: 0 auto;">
    A complete <strong>browser-based environment</strong> for building, managing, and deploying Domino applications across your entire infrastructure. No Notes client required.
  </p>
</div>

<div style="margin: 2rem 0; border: 1px solid #2a2a4a; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
  <img src="{{ '/assets/images/welcome.png' | relative_url }}" alt="Domino Online Editor - Browser-based Domino development environment with Agent Development, Database Management, Multi-Server Support, and Version Control" style="width: 100%; display: block;">
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

<div style="margin: 0 0 2rem; border: 1px solid #2a2a4a; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
  <img src="{{ '/assets/images/demo.png' | relative_url }}" alt="Domino Online Editor - ID File management interface for secure multi-server access" style="width: 100%; display: block;">
</div>

---

<div style="text-align: center; padding: 2rem 0;">
  <h2 style="font-size: 2rem; color: #e0e0f0;">Built for the Enterprise</h2>
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
  <h2 style="font-size: 2rem; color: #e0e0f0;">The Moonshine.dev Platform</h2>
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
  <h2 style="font-size: 2rem; color: #e0e0f0;">Pricing</h2>
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
  <h2 style="font-size: 2.2rem; color: #e8c547; margin-bottom: 1rem;">Ready to See What's Really in Your NSF?</h2>
  <p style="font-size: 1.2rem; color: #c8c8d8; max-width: 600px; margin: 0 auto 2rem;">
    Drop a file or try our sample - get your migration viability report in seconds. No credit card, no signup, nothing to cancel.
  </p>
  <a href="#upload-dropzone" class="btn btn-primary fs-5" style="margin-right: 1rem;">Analyze an NSF now</a>
  <a href="https://www.moonshine.dev/" class="btn fs-5">Contact us</a>
</div>

<!-- markdownlint-enable MD033 MD013 -->