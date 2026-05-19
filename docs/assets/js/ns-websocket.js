/* ==========================================================================
   NSWebSocket — singleton wrapper around the Nomad.Services analyze
   WebSocket. Designed for the unauthenticated public flow:

     - The URL path identifies the per-browser client (random id).
     - The outgoing envelope's `username` field is the server-side
       routing token (the same value on every connection — the server
       uses it to dispatch, not to identify the client).
     - Outgoing message format:  "<action>#<base64(payload)>"
     - Inbound message format:   { ..., message: base64(JSON-string) }
       (asymmetric on purpose — we don't yet know whether responses
       will carry an `action` field, so this class leaves inbound
       routing to the consumer via on('message', fn).)

   Extensibility model:
     - Add new outgoing commands by either calling send(action, payload)
       directly or wrapping it in a method on this prototype.
     - Add new inbound handling by attaching on('message', fn). When the
       server's response contract stabilizes (likely a `type` or
       `action` field on the decoded object) we can layer action-keyed
       dispatch on top without changing existing callers.

   Mirrors the lifecycle / reconnect shape of the team's
   com.moonshine.haxeScripts.websocket.DominoCompile.hx class, minus
   the authentication branches (no OAUTH2 USER handling, no design-
   element heartbeat — those are authenticated-flow concerns).

   No build step: this file is loaded by a plain <script src> from the
   Jekyll page, attaches NSWebSocket to window, and uses ES5-compatible
   prototype style to stay consistent with the rest of the inline JS.
   ========================================================================== */

(function() {
  'use strict';

  /* Same-origin WS URL fallback — used only when the caller doesn't
     pass `url`. The page should normally set NS_WEBSOCKET_BASE (derived
     from NS_BACKEND) and pass that in, so this default just keeps the
     class from being unusable in isolation. */
  function defaultUrl() {
    var loc = (typeof window !== 'undefined' && window.location) || {};
    var scheme = (loc.protocol === 'https:') ? 'wss://' : 'ws://';
    return scheme + (loc.host || '') + '/websocket';
  }

  /* Defaults are overridden by anything passed into getInstance(config),
     and individual fields can be left out — only the override keys are
     replaced. */
  var DEFAULTS = {
    /* Base URL up to and including any fixed prefix the server expects.
       For the analyze server the team gave us: "wss://<host>/websocket".
       The client id is appended as the final path segment. */
    url: defaultUrl(),

    /* Server-side routing token. Same value on every connection — this
       is NOT a per-client identifier, it tells the server which
       backend to dispatch the message to. */
    serverToken: 'ANALYZE-REPLACE-ME',

    /* Path segment inserted between `url` and the client id. Lets us
       reuse this class for other endpoints (e.g. /upload, /validate)
       without rewriting the URL builder. */
    pathPrefix: 'analyze',

    /* Prefix for the auto-generated client id (clientPrefix + Date.now()). */
    clientPrefix: 'client-',

    /* Reconnect tuning. Matches DominoCompile.hx defaults. */
    reconnectDelayMs: 5000,
    maxReconnectAttempts: 3,

    /* Console-log every send/recv/lifecycle event. Flip to false when
       the flow is stable; leave on while we're proving the contract. */
    debug: true
  };

  var _instance = null;

  function NSWebSocket(config) {
    this.config = mergeConfig(DEFAULTS, config || {});
    this.ws = null;
    this.clientId = this.config.clientPrefix + Date.now();
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    /* Lifecycle listener buckets: 'open' | 'close' | 'error' | 'message'
       | 'reconnectFailed'. We keep them in plain arrays since the set
       of events is small and fixed. */
    this.listeners = {};
    /* When true, an explicit caller .close() — suppress reconnect. */
    this.closedByCaller = false;
  }

  /* --- Singleton accessor. First call may pass config; later calls
         get back the same instance and ignore config. */
  NSWebSocket.getInstance = function(config) {
    if (!_instance) _instance = new NSWebSocket(config);
    return _instance;
  };

  /* --- Connection lifecycle --- */

  NSWebSocket.prototype.open = function() {
    if (this.ws && (this.ws.readyState === 0 /* CONNECTING */ ||
                    this.ws.readyState === 1 /* OPEN */)) {
      this._log('open() skipped — already ' +
        (this.ws.readyState === 1 ? 'open' : 'connecting'));
      return;
    }
    this.closedByCaller = false;
    var url = this.buildUrl();
    this._log('connecting to ' + url);
    var self = this;
    try {
      this.ws = new WebSocket(url);
    } catch (e) {
      this._log('construction failed: ' + e.message, 'error');
      return;
    }
    this.ws.onopen    = function()   { self._onOpen(); };
    this.ws.onmessage = function(ev) { self._onMessage(ev); };
    this.ws.onerror   = function(ev) { self._onError(ev); };
    this.ws.onclose   = function(ev) { self._onClose(ev); };
  };

  NSWebSocket.prototype.close = function() {
    this.closedByCaller = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try { this.ws.close(); } catch (e) { /* swallow */ }
      this.ws = null;
    }
  };

  NSWebSocket.prototype.isOpen = function() {
    return !!this.ws && this.ws.readyState === 1;
  };

  /* --- Outbound: action + payload -> envelope -> wire --- */

  /* Generic send. Returns true if queued, false if the socket wasn't
     open (callers can decide whether to wait, retry, or surface an
     error). */
  NSWebSocket.prototype.send = function(action, payload) {
    if (!this.isOpen()) {
      this._log('send("' + action + '") skipped — socket not open', 'warn');
      return false;
    }
    var payloadStr = (payload == null) ? '' : String(payload);
    var body = action + '#' + b64encode(payloadStr);
    var envelope = JSON.stringify({
      username: this.config.serverToken,
      message: body
    });
    this._log('send: ' + action + ' (' + payloadStr.length + ' chars payload)');
    this.ws.send(envelope);
    return true;
  };

  /* Proof-of-life convenience — exactly the call the team's test
     snippet describes. Returns the same boolean as send(). */
  NSWebSocket.prototype.helloWorld = function(payload) {
    return this.send('helloWorld', payload == null ? 'ping from browser' : payload);
  };

  /* --- Listener API --- */

  /* Events:
       'open'             — connected; arg = { clientId }
       'close'            — disconnected; arg = the CloseEvent
       'error'            — socket error; arg = the Event
       'message'          — every inbound frame; arg = {
                              decoded: <object | string>,
                              envelope: <parsed envelope>,
                              raw: <original ev.data string>
                            }
       'reconnectFailed'  — gave up after maxReconnectAttempts;
                            arg = { attempts }
  */
  NSWebSocket.prototype.on = function(event, fn) {
    if (typeof fn !== 'function') return;
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  };

  NSWebSocket.prototype._emit = function(event, arg) {
    var list = this.listeners[event];
    if (!list) return;
    for (var i = 0; i < list.length; i++) {
      try { list[i](arg); }
      catch (e) { this._log('listener for "' + event + '" threw: ' + e.message, 'error'); }
    }
  };

  /* --- Internal socket handlers --- */

  NSWebSocket.prototype._onOpen = function() {
    this._log('connected (clientId=' + this.clientId + ')');
    this.reconnectAttempts = 0;
    this._emit('open', { clientId: this.clientId });
  };

  NSWebSocket.prototype._onError = function(ev) {
    this._log('socket error', 'error');
    this._emit('error', ev);
  };

  /* Close codes where reconnecting won't change the outcome — these
     indicate the server actively rejected us, not a transient drop.
       1000 — Normal closure
       1002 — Protocol error
       1003 — Unsupported data
       1008 — Policy violation (auth/routing rejected — what the
              "User not message!" / "User not authenticated" Domino
              server returns)
       4000+ — Application-defined; libraries usually mean "don't retry"
     1011 (Internal Server Error) is intentionally NOT here — server
     hiccups are often transient and a reconnect can recover. */
  function isFatalCloseCode(code) {
    if (code === 1000 || code === 1002 || code === 1003 || code === 1008) return true;
    if (code >= 4000 && code <= 4999) return true;
    return false;
  }

  NSWebSocket.prototype._onClose = function(ev) {
    this._log('closed (code ' + ev.code +
      (ev.reason ? ', reason="' + ev.reason + '"' : '') + ')');
    this._emit('close', ev);
    this.ws = null;
    if (this.closedByCaller) return;
    if (isFatalCloseCode(ev.code)) {
      this._log('not reconnecting — close code ' + ev.code +
        ' indicates the server rejected the connection (auth, policy, or' +
        ' app-defined fatal). Fix the URL/token and call open() again.', 'warn');
      this._emit('rejected', { code: ev.code, reason: ev.reason });
      return;
    }
    this._scheduleReconnect();
  };

  NSWebSocket.prototype._scheduleReconnect = function() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this._log('max reconnect attempts (' +
        this.config.maxReconnectAttempts + ') reached — giving up', 'warn');
      this._emit('reconnectFailed', { attempts: this.reconnectAttempts });
      return;
    }
    this.reconnectAttempts++;
    var attempt = this.reconnectAttempts;
    var delay   = this.config.reconnectDelayMs;
    this._log('reconnect attempt ' + attempt + '/' +
      this.config.maxReconnectAttempts + ' in ' + delay + 'ms');
    var self = this;
    this.reconnectTimer = setTimeout(function() {
      self.reconnectTimer = null;
      self.open();
    }, delay);
  };

  NSWebSocket.prototype._onMessage = function(ev) {
    var raw = ev.data;
    var decoded = null;

    /* Documented analyze-server inbound format (Moonshine-Websocket-
       Server / Moonshine-DB-Analyzer, M1 helloWorld round-trip):

         raw frame = base64-encoded JSON string
         JSON.parse(atob(raw)) = { status, action, message, echo }

       There is NO outer envelope on inbound — only outbound carries
       the { username, message } envelope. So we decode base64 first,
       then JSON.parse the result. */
    try {
      var inner = b64decode(String(raw).trim());
      try { decoded = JSON.parse(inner); }
      catch (e) {
        /* Base64 decoded fine but content wasn't JSON. Surface the
           string so consumers can still inspect it. */
        decoded = inner;
      }
      this._log('recv:', decoded);
      this._emit('message', { decoded: decoded, raw: raw });
      return;
    } catch (e) {
      /* Frame wasn't base64. Fall through to legacy/diagnostic paths. */
    }

    /* Fallback 1: known plaintext rejection strings from the
       authenticated Domino WS server (DominoCompile.hx). Hitting these
       means NS_WEBSOCKET_BASE points at the wrong server — log
       explicitly so the next person doesn't have to decode the symptom. */
    var preview = String(raw).substring(0, 80);
    if (preview.indexOf('User not message') === 0 ||
        preview.indexOf('User not authenticated') === 0) {
      this._log('inbound: server rejected the connection — "' + preview + '". ' +
        'This is the AUTHENTICATED Domino server\'s rejection text; ' +
        'check NS_WEBSOCKET_BASE.', 'error');
      return;
    }

    /* Fallback 2: maybe it's an old-style { username, message } JSON
       envelope (kept for resilience if a transitional server build is
       ever encountered). */
    try {
      var envelope = JSON.parse(raw);
      if (envelope && typeof envelope.message === 'string') {
        var legacyInner = b64decode(envelope.message);
        try { decoded = JSON.parse(legacyInner); }
        catch (e2) { decoded = legacyInner; }
        this._log('recv (legacy envelope):', decoded);
        this._emit('message', { decoded: decoded, envelope: envelope, raw: raw });
        return;
      }
    } catch (e) { /* not JSON either */ }

    this._log('inbound: unparseable frame, ignoring (first 80 chars: "' +
      preview + '")', 'warn');
  };

  /* --- URL builder. Splits the path-prefix off so a future endpoint
         (e.g. /upload, /validate) can reuse the class with a different
         prefix. */
  NSWebSocket.prototype.buildUrl = function() {
    var base   = this.config.url.replace(/\/+$/, '');
    var prefix = this.config.pathPrefix
      ? '/' + this.config.pathPrefix.replace(/^\/+|\/+$/g, '')
      : '';
    return base + prefix + '/' + encodeURIComponent(this.clientId);
  };

  /* --- Helpers --- */

  /* UTF-8-safe base64 encode. btoa() alone rejects characters outside
     latin-1 (e.g. filenames with accented characters), so we encode
     to a UTF-8 byte string first. */
  function b64encode(s) {
    return btoa(unescape(encodeURIComponent(s)));
  }
  function b64decode(s) {
    return decodeURIComponent(escape(atob(s)));
  }

  function mergeConfig(base, over) {
    var out = {};
    var k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    for (k in over) if (Object.prototype.hasOwnProperty.call(over, k)) out[k] = over[k];
    return out;
  }

  NSWebSocket.prototype._log = function(/* msg, ..., level */) {
    if (!this.config.debug) return;
    /* Last arg = level if it's one of our known strings; otherwise all
       args are message parts. Lets callers pass objects for inspection
       (e.g. ._log('recv:', decoded)). */
    var args = Array.prototype.slice.call(arguments);
    var level = 'log';
    var last  = args[args.length - 1];
    if (last === 'warn' || last === 'error') { level = last; args.pop(); }
    args.unshift('[ns-ws]');
    (console[level] || console.log).apply(console, args);
  };

  window.NSWebSocket = NSWebSocket;
})();
