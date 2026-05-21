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

  /* Generic send. Variadic — every arg after `action` is independently
     base64-encoded and joined with '#' to form the protocol body:
        <action>#<base64(arg1)>#<base64(arg2)>#...
     Backward-compatible: a single-payload call like send('helloWorld',
     'ping') still produces <action>#<base64(payload)> as before.
     Returns true if queued, false if the socket wasn't open. */
  NSWebSocket.prototype.send = function(action /*, ...args */) {
    if (!this.isOpen()) {
      this._log('send("' + action + '") skipped — socket not open', 'warn');
      return false;
    }
    var parts = [action];
    var summary = [];
    for (var i = 1; i < arguments.length; i++) {
      var raw = arguments[i];
      var str = (raw == null) ? '' : String(raw);
      parts.push(b64encode(str));
      summary.push(str.length + ' chars');
    }
    var body = parts.join('#');
    var envelope = JSON.stringify({
      username: this.config.serverToken,
      message: body
    });
    this._log('send: ' + action + ' [' + summary.join(', ') + ']');
    this.ws.send(envelope);
    return true;
  };

  /* Proof-of-life convenience — exactly the call the team's test
     snippet describes. Returns the same boolean as send(). */
  NSWebSocket.prototype.helloWorld = function(payload) {
    return this.send('helloWorld', payload == null ? 'ping from browser' : payload);
  };

  /* Convenience for the analyzeDatabase action. Sends:
        analyzeDatabase#<base64(nsfPath)>#<base64("anonymous")>
     This site is the unauthenticated public flow, so the second
     argument is always the literal string "anonymous" - never a UUID
     or any other identifier. Response shape isn't yet documented; the
     server is expected to emit multiple progress frames over time,
     each delivered through the on('message', fn) listener. */
  NSWebSocket.prototype.analyzeDatabase = function(nsfPath) {
    if (typeof nsfPath !== 'string' || nsfPath === '') {
      this._log('analyzeDatabase: nsfPath is required', 'error');
      return false;
    }
    return this.send('analyzeDatabase', nsfPath, 'anonymous');
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
    var rawStr = String(raw);
    var decoded = null;

    /* Documented analyze-server inbound format (Moonshine-Websocket-
       Server / Moonshine-DB-Analyzer):
         raw frame = base64-encoded JSON string
         JSON.parse(atob(raw)) = { status, action, message, ... }
       Some flows (e.g. analyzeDatabase) may also emit *plain-text*
       progress frames before the final JSON. We try the
       most-specific decode first, but every branch logs full content
       and emits through on('message') so listeners never miss a frame
       and progress strings aren't silently dropped. */

    /* Path 1: base64 frame. Inner content is either JSON (final
       result) or plain text (in-progress status). */
    try {
      var inner = b64decode(rawStr.trim());
      try {
        decoded = JSON.parse(inner);
        this._log('recv:', decoded);
        this._emit('message', { decoded: decoded, raw: raw, format: 'base64-json' });
      } catch (e) {
        /* base64 decoded fine but inner wasn't JSON - progress string. */
        this._log('recv (text):', inner);
        this._emit('message', { decoded: inner, raw: raw, format: 'base64-text' });
      }
      return;
    } catch (e) {
      /* Frame wasn't base64 - fall through to plaintext / legacy paths. */
    }

    /* Path 2: known authenticated-Domino rejection strings. Logged
       loudly because they almost always indicate a misconfigured
       NS_WEBSOCKET_BASE, but still emitted so listeners aren't blind. */
    if (rawStr.indexOf('User not message') === 0 ||
        rawStr.indexOf('User not authenticated') === 0) {
      this._log('recv (rejection): server rejected the connection - "' +
        rawStr + '". This is the AUTHENTICATED Domino server\'s ' +
        'rejection text; check NS_WEBSOCKET_BASE.', 'error');
      this._emit('message', { decoded: rawStr, raw: raw, format: 'rejection' });
      return;
    }

    /* Path 3: legacy { username, message } envelope (defensive - covers
       any transitional server build that might still wrap responses). */
    try {
      var envelope = JSON.parse(rawStr);
      if (envelope && typeof envelope.message === 'string') {
        var legacyInner = b64decode(envelope.message);
        try { decoded = JSON.parse(legacyInner); }
        catch (e2) { decoded = legacyInner; }
        this._log('recv (legacy envelope):', decoded);
        this._emit('message', { decoded: decoded, envelope: envelope, raw: raw, format: 'legacy-envelope' });
        return;
      }
    } catch (e) { /* not JSON either */ }

    /* Path 4: catch-all. Raw plain text we couldn't classify - could
       be a progress string or any other server output we didn't
       anticipate. Log full content (capped to keep huge frames from
       spamming the console) and emit so listeners see everything. */
    var capped = rawStr.length > 2000
      ? rawStr.substring(0, 2000) + '... [truncated, ' + (rawStr.length - 2000) + ' more chars]'
      : rawStr;
    this._log('recv (raw):', capped);
    this._emit('message', { decoded: rawStr, raw: raw, format: 'raw' });
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
