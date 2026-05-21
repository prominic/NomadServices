/* ============================================================
 * ns-email-capture.js
 *
 * Owns the contract between the marketing-site email-capture form
 * and the BFF's POST /api/nomad/magic-link endpoint.
 *
 * Exposes a single global:
 *
 *   window.NSEmailCapture.submit(email) -> Promise<Result>
 *
 *   Result is one of:
 *     { ok: true }                       - BFF returned 2xx (always 202
 *                                          in practice; anti-enumeration)
 *     { ok: false, reason: 'no_claim_token' }
 *                                        - sessionStorage has no
 *                                          ns_claim_token. The caller
 *                                          should prompt the visitor to
 *                                          upload an NSF first.
 *     { ok: false, reason: 'network' }   - fetch threw (offline, DNS
 *                                          failure, CORS, etc.).
 *     { ok: false, reason: 'http',
 *       status: <number> }               - BFF returned non-2xx.
 *
 *   The Promise NEVER rejects. The caller branches on `result.ok`.
 *
 * Contract notes (authoritative):
 *
 *   - Method: POST
 *   - URL:    ${window.NS_BACKEND}/api/nomad/magic-link
 *   - Body:   application/json, { email, claim_token }
 *   - credentials: 'omit' - the marketing site never reads cross-origin
 *     cookies (they live on the BFF host). This is load-bearing for the
 *     BFF's CORS allow-list (which allows nomad.services with credentials
 *     disabled).
 *
 * Anti-enumeration is the BFF's contract: it ALWAYS returns 202
 * regardless of email existence, send success, or per-email rate-limit
 * state. The caller MUST NOT show server response body details to the
 * visitor; "check your inbox" on success and a generic "try again" on
 * failure is the contract. This module enforces that by returning only
 * `{ ok, reason, status }` - never the parsed body.
 * ============================================================ */
(function() {
  'use strict';

  var SESSION_KEY = 'ns_claim_token';

  function readClaimToken() {
    try {
      return sessionStorage.getItem(SESSION_KEY);
    } catch (_) {
      /* sessionStorage can throw in private-mode browsers or when the
         storage quota is exceeded. Treat as "no token" - the UI surfaces
         the "please upload an NSF first" path. */
      return null;
    }
  }

  function submit(email) {
    var tag = '[email-capture]';
    var claimToken = readClaimToken();

    if (!claimToken) {
      console.warn(tag, 'no claim_token in sessionStorage; visitor must upload first');
      return Promise.resolve({ ok: false, reason: 'no_claim_token' });
    }

    var backend = (typeof window !== 'undefined' && window.NS_BACKEND) ? window.NS_BACKEND : '';
    var url = backend + '/api/nomad/magic-link';

    console.log(tag, 'POST', url);

    var payload = JSON.stringify({ email: email, claim_token: claimToken });

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: payload,
      credentials: 'omit'
    }).then(function(res) {
      if (res.ok) {
        console.log(tag, 'HTTP ' + res.status);
        /* Drain the body so the connection can close cleanly, but do
           NOT surface its contents - anti-enumeration is the BFF's
           contract. */
        res.text().catch(function() {});
        return { ok: true };
      }
      console.warn(tag, 'non-2xx HTTP ' + res.status);
      res.text().catch(function() {});
      return { ok: false, reason: 'http', status: res.status };
    }).catch(function(err) {
      console.error(tag, 'fetch failed:', err);
      return { ok: false, reason: 'network' };
    });
  }

  window.NSEmailCapture = { submit: submit };
})();
