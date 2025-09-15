(() => {
    "use strict";
    var t = {};
    t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (t) {
            if ("object" == typeof window) return window
        }
    }();
    var e = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : "object" == typeof window ? window : "object" == typeof t.g ? t.g : {},
        r = "1.9.0",
        n = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/,
        i = function(t) {
            var e = new Set([t]),
                r = new Set,
                i = t.match(n);
            if (!i) return function() {
                return !1
            };
            var o = +i[1],
                s = +i[2],
                a = +i[3];
            if (null != i[4]) return function(e) {
                return e === t
            };

            function u(t) {
                return r.add(t), !1
            }

            function c(t) {
                return e.add(t), !0
            }
            return function(t) {
                if (e.has(t)) return !0;
                if (r.has(t)) return !1;
                var i = t.match(n);
                if (!i) return u(t);
                var l = +i[1],
                    p = +i[2],
                    d = +i[3];
                return null != i[4] || o !== l ? u(t) : 0 === o ? s === p && a <= d ? c(t) : u(t) : s <= p ? c(t) : u(t)
            }
        }(r),
        o = r.split(".")[0],
        s = Symbol.for("opentelemetry.js.api." + o),
        a = e;

    function u(t, e, n, i) {
        var o;
        void 0 === i && (i = !1);
        var u = a[s] = null !== (o = a[s]) && void 0 !== o ? o : {
            version: r
        };
        if (!i && u[t]) {
            var c = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + t);
            return n.error(c.stack || c.message), !1
        }
        return u.version !== r ? (c = new Error("@opentelemetry/api: Registration of version v" + u.version + " for " + t + " does not match previously registered API v" + r), n.error(c.stack || c.message), !1) : (u[t] = e, n.debug("@opentelemetry/api: Registered a global for " + t + " v" + r + "."), !0)
    }

    function c(t) {
        var e, r, n = null === (e = a[s]) || void 0 === e ? void 0 : e.version;
        if (n && i(n)) return null === (r = a[s]) || void 0 === r ? void 0 : r[t]
    }

    function l(t, e) {
        e.debug("@opentelemetry/api: Unregistering a global for " + t + " v" + r + ".");
        var n = a[s];
        n && delete n[t]
    }
    var p, d = function() {
        function t(t) {
            this._namespace = t.namespace || "DiagComponentLogger"
        }
        return t.prototype.debug = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            return h("debug", this._namespace, t)
        }, t.prototype.error = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            return h("error", this._namespace, t)
        }, t.prototype.info = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            return h("info", this._namespace, t)
        }, t.prototype.warn = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            return h("warn", this._namespace, t)
        }, t.prototype.verbose = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            return h("verbose", this._namespace, t)
        }, t
    }();

    function h(t, e, r) {
        var n = c("diag");
        if (n) return r.unshift(e), n[t].apply(n, function(t, e, r) {
            if (r || 2 === arguments.length)
                for (var n, i = 0, o = e.length; i < o; i++) !n && i in e || (n || (n = Array.prototype.slice.call(e, 0, i)), n[i] = e[i]);
            return t.concat(n || Array.prototype.slice.call(e))
        }([], function(t, e) {
            var r = "function" == typeof Symbol && t[Symbol.iterator];
            if (!r) return t;
            var n, i, o = r.call(t),
                s = [];
            try {
                for (;
                    (void 0 === e || e-- > 0) && !(n = o.next()).done;) s.push(n.value)
            } catch (t) {
                i = {
                    error: t
                }
            } finally {
                try {
                    n && !n.done && (r = o.return) && r.call(o)
                } finally {
                    if (i) throw i.error
                }
            }
            return s
        }(r), !1))
    }! function(t) {
        t[t.NONE = 0] = "NONE", t[t.ERROR = 30] = "ERROR", t[t.WARN = 50] = "WARN", t[t.INFO = 60] = "INFO", t[t.DEBUG = 70] = "DEBUG", t[t.VERBOSE = 80] = "VERBOSE", t[t.ALL = 9999] = "ALL"
    }(p || (p = {}));
    var f, g = function() {
            function t() {
                function t(t) {
                    return function() {
                        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
                        var n = c("diag");
                        if (n) return n[t].apply(n, function(t, e, r) {
                            if (r || 2 === arguments.length)
                                for (var n, i = 0, o = e.length; i < o; i++) !n && i in e || (n || (n = Array.prototype.slice.call(e, 0, i)), n[i] = e[i]);
                            return t.concat(n || Array.prototype.slice.call(e))
                        }([], function(t, e) {
                            var r = "function" == typeof Symbol && t[Symbol.iterator];
                            if (!r) return t;
                            var n, i, o = r.call(t),
                                s = [];
                            try {
                                for (;
                                    (void 0 === e || e-- > 0) && !(n = o.next()).done;) s.push(n.value)
                            } catch (t) {
                                i = {
                                    error: t
                                }
                            } finally {
                                try {
                                    n && !n.done && (r = o.return) && r.call(o)
                                } finally {
                                    if (i) throw i.error
                                }
                            }
                            return s
                        }(e), !1))
                    }
                }
                var e = this;
                e.setLogger = function(t, r) {
                    var n, i, o;
                    if (void 0 === r && (r = {
                            logLevel: p.INFO
                        }), t === e) {
                        var s = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                        return e.error(null !== (n = s.stack) && void 0 !== n ? n : s.message), !1
                    }
                    "number" == typeof r && (r = {
                        logLevel: r
                    });
                    var a = c("diag"),
                        l = function(t, e) {
                            function r(r, n) {
                                var i = e[r];
                                return "function" == typeof i && t >= n ? i.bind(e) : function() {}
                            }
                            return t < p.NONE ? t = p.NONE : t > p.ALL && (t = p.ALL), e = e || {}, {
                                error: r("error", p.ERROR),
                                warn: r("warn", p.WARN),
                                info: r("info", p.INFO),
                                debug: r("debug", p.DEBUG),
                                verbose: r("verbose", p.VERBOSE)
                            }
                        }(null !== (i = r.logLevel) && void 0 !== i ? i : p.INFO, t);
                    if (a && !r.suppressOverrideMessage) {
                        var d = null !== (o = (new Error).stack) && void 0 !== o ? o : "<failed to generate stacktrace>";
                        a.warn("Current logger will be overwritten from " + d), l.warn("Current logger will overwrite one already registered from " + d)
                    }
                    return u("diag", l, e, !0)
                }, e.disable = function() {
                    l("diag", e)
                }, e.createComponentLogger = function(t) {
                    return new d(t)
                }, e.verbose = t("verbose"), e.debug = t("debug"), e.info = t("info"), e.warn = t("warn"), e.error = t("error")
            }
            return t.instance = function() {
                return this._instance || (this._instance = new t), this._instance
            }, t
        }(),
        m = g.instance();

    function _(t) {
        return Symbol.for(t)
    }! function(t) {
        t[t.NONE = 0] = "NONE", t[t.SAMPLED = 1] = "SAMPLED"
    }(f || (f = {}));
    var y = new function t(e) {
            var r = this;
            r._currentContext = e ? new Map(e) : new Map, r.getValue = function(t) {
                return r._currentContext.get(t)
            }, r.setValue = function(e, n) {
                var i = new t(r._currentContext);
                return i._currentContext.set(e, n), i
            }, r.deleteValue = function(e) {
                var n = new t(r._currentContext);
                return n._currentContext.delete(e), n
            }
        },
        v = function() {
            function t() {}
            return t.prototype.active = function() {
                return y
            }, t.prototype.with = function(t, e, r) {
                for (var n = [], i = 3; i < arguments.length; i++) n[i - 3] = arguments[i];
                return e.call.apply(e, function(t, e, r) {
                    if (r || 2 === arguments.length)
                        for (var n, i = 0, o = e.length; i < o; i++) !n && i in e || (n || (n = Array.prototype.slice.call(e, 0, i)), n[i] = e[i]);
                    return t.concat(n || Array.prototype.slice.call(e))
                }([r], function(t, e) {
                    var r = "function" == typeof Symbol && t[Symbol.iterator];
                    if (!r) return t;
                    var n, i, o = r.call(t),
                        s = [];
                    try {
                        for (;
                            (void 0 === e || e-- > 0) && !(n = o.next()).done;) s.push(n.value)
                    } catch (t) {
                        i = {
                            error: t
                        }
                    } finally {
                        try {
                            n && !n.done && (r = o.return) && r.call(o)
                        } finally {
                            if (i) throw i.error
                        }
                    }
                    return s
                }(n), !1))
            }, t.prototype.bind = function(t, e) {
                return e
            }, t.prototype.enable = function() {
                return this
            }, t.prototype.disable = function() {
                return this
            }, t
        }(),
        b = "context",
        S = new v,
        w = function() {
            function t() {}
            return t.getInstance = function() {
                return this._instance || (this._instance = new t), this._instance
            }, t.prototype.setGlobalContextManager = function(t) {
                return u(b, t, g.instance())
            }, t.prototype.active = function() {
                return this._getContextManager().active()
            }, t.prototype.with = function(t, e, r) {
                for (var n, i = [], o = 3; o < arguments.length; o++) i[o - 3] = arguments[o];
                return (n = this._getContextManager()).with.apply(n, function(t, e, r) {
                    if (r || 2 === arguments.length)
                        for (var n, i = 0, o = e.length; i < o; i++) !n && i in e || (n || (n = Array.prototype.slice.call(e, 0, i)), n[i] = e[i]);
                    return t.concat(n || Array.prototype.slice.call(e))
                }([t, e, r], function(t, e) {
                    var r = "function" == typeof Symbol && t[Symbol.iterator];
                    if (!r) return t;
                    var n, i, o = r.call(t),
                        s = [];
                    try {
                        for (;
                            (void 0 === e || e-- > 0) && !(n = o.next()).done;) s.push(n.value)
                    } catch (t) {
                        i = {
                            error: t
                        }
                    } finally {
                        try {
                            n && !n.done && (r = o.return) && r.call(o)
                        } finally {
                            if (i) throw i.error
                        }
                    }
                    return s
                }(i), !1))
            }, t.prototype.bind = function(t, e) {
                return this._getContextManager().bind(t, e)
            }, t.prototype._getContextManager = function() {
                return c(b) || S
            }, t.prototype.disable = function() {
                this._getContextManager().disable(), l(b, g.instance())
            }, t
        }(),
        E = w.getInstance();
    class T {
        _promise;
        _resolve;
        _reject;
        constructor() {
            this._promise = new Promise(((t, e) => {
                this._resolve = t, this._reject = e
            }))
        }
        get promise() {
            return this._promise
        }
        resolve(t) {
            this._resolve(t)
        }
        reject(t) {
            this._reject(t)
        }
    }
    class C {
        _callback;
        _that;
        _isCalled = !1;
        _deferred = new T;
        constructor(t, e) {
            this._callback = t, this._that = e
        }
        get isCalled() {
            return this._isCalled
        }
        get promise() {
            return this._deferred.promise
        }
        call(...t) {
            if (!this._isCalled) {
                this._isCalled = !0;
                try {
                    Promise.resolve(this._callback.call(this._that, ...t)).then((t => this._deferred.resolve(t)), (t => this._deferred.reject(t)))
                } catch (t) {
                    this._deferred.reject(t)
                }
            }
            return this._deferred.promise
        }
    }
    const A = _("OpenTelemetry SDK Context Key SUPPRESS_TRACING");

    function O(t) {
        return !0 === t.getValue(A)
    }
    var L;
    ! function(t) {
        t[t.SUCCESS = 0] = "SUCCESS", t[t.FAILED = 1] = "FAILED"
    }(L || (L = {}));

    function P(t) {
        try {
            (t => {
                m.error(function(t) {
                    return "string" == typeof t ? t : JSON.stringify(function(t) {
                        const e = {};
                        let r = t;
                        for (; null !== r;) Object.getOwnPropertyNames(r).forEach((t => {
                            if (e[t]) return;
                            const n = r[t];
                            n && (e[t] = String(n))
                        })), r = Object.getPrototypeOf(r);
                        return e
                    }(t))
                }(t))
            })(t)
        } catch {}
    }
    class x {
        _exporter;
        _maxExportBatchSize;
        _maxQueueSize;
        _scheduledDelayMillis;
        _exportTimeoutMillis;
        _isExporting = !1;
        _finishedSpans = [];
        _timer;
        _shutdownOnce;
        _droppedSpansCount = 0;
        constructor(t, e) {
            this._exporter = t, this._maxExportBatchSize = "number" == typeof e ? .maxExportBatchSize ? e.maxExportBatchSize : 512, this._maxQueueSize = "number" == typeof e ? .maxQueueSize ? e.maxQueueSize : 2048, this._scheduledDelayMillis = "number" == typeof e ? .scheduledDelayMillis ? e.scheduledDelayMillis : 5e3, this._exportTimeoutMillis = "number" == typeof e ? .exportTimeoutMillis ? e.exportTimeoutMillis : 3e4, this._shutdownOnce = new C(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize && (m.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize)
        }
        forceFlush() {
            return this._shutdownOnce.isCalled ? this._shutdownOnce.promise : this._flushAll()
        }
        onStart(t, e) {}
        onEnd(t) {
            this._shutdownOnce.isCalled || t.spanContext().traceFlags & f.SAMPLED && this._addToBuffer(t)
        }
        shutdown() {
            return this._shutdownOnce.call()
        }
        _shutdown() {
            return Promise.resolve().then((() => this.onShutdown())).then((() => this._flushAll())).then((() => this._exporter.shutdown()))
        }
        _addToBuffer(t) {
            if (this._finishedSpans.length >= this._maxQueueSize) return 0 === this._droppedSpansCount && m.debug("maxQueueSize reached, dropping spans"), void this._droppedSpansCount++;
            this._droppedSpansCount > 0 && (m.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0), this._finishedSpans.push(t), this._maybeStartTimer()
        }
        _flushAll() {
            return new Promise(((t, e) => {
                const r = [];
                for (let t = 0, e = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize); t < e; t++) r.push(this._flushOneBatch());
                Promise.all(r).then((() => {
                    t()
                })).catch(e)
            }))
        }
        _flushOneBatch() {
            return this._clearTimer(), 0 === this._finishedSpans.length ? Promise.resolve() : new Promise(((t, e) => {
                const r = setTimeout((() => {
                    e(new Error("Timeout"))
                }), this._exportTimeoutMillis);
                E.with(E.active().setValue(A, !0), (() => {
                    let n;
                    this._finishedSpans.length <= this._maxExportBatchSize ? (n = this._finishedSpans, this._finishedSpans = []) : n = this._finishedSpans.splice(0, this._maxExportBatchSize);
                    const i = () => this._exporter.export(n, (n => {
                        clearTimeout(r), n.code === L.SUCCESS ? t() : e(n.error ? ? new Error("BatchSpanProcessor: span export failed"))
                    }));
                    let o = null;
                    for (let t = 0, e = n.length; t < e; t++) {
                        const e = n[t];
                        e.resource.asyncAttributesPending && e.resource.waitForAsyncAttributes && (o ? ? = [], o.push(e.resource.waitForAsyncAttributes()))
                    }
                    null === o ? i() : Promise.all(o).then(i, (t => {
                        P(t), e(t)
                    }))
                }))
            }))
        }
        _maybeStartTimer() {
            if (this._isExporting) return;
            const t = () => {
                this._isExporting = !0, this._flushOneBatch().finally((() => {
                    this._isExporting = !1, this._finishedSpans.length > 0 && (this._clearTimer(), this._maybeStartTimer())
                })).catch((t => {
                    this._isExporting = !1, P(t)
                }))
            };
            if (this._finishedSpans.length >= this._maxExportBatchSize) return t();
            void 0 === this._timer && (this._timer = setTimeout((() => t()), this._scheduledDelayMillis), this._timer)
        }
        _clearTimer() {
            void 0 !== this._timer && (clearTimeout(this._timer), this._timer = void 0)
        }
    }
    const N = Function.prototype.toString,
        R = N.call(Object),
        D = Object.getPrototypeOf,
        I = Object.prototype,
        M = I.hasOwnProperty,
        j = Symbol ? Symbol.toStringTag : void 0,
        k = I.toString;

    function U(t) {
        if (! function(t) {
                return null != t && "object" == typeof t
            }(t) || "[object Object]" !== function(t) {
                return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : j && j in Object(t) ? function(t) {
                    const e = M.call(t, j),
                        r = t[j];
                    let n = !1;
                    try {
                        t[j] = void 0, n = !0
                    } catch {}
                    const i = k.call(t);
                    return n && (e ? t[j] = r : delete t[j]), i
                }(t) : function(t) {
                    return k.call(t)
                }(t)
            }(t)) return !1;
        const e = D(t);
        if (null === e) return !0;
        const r = M.call(e, "constructor") && e.constructor;
        return "function" == typeof r && r instanceof r && N.call(r) === R
    }

    function F(t) {
        return z(t) ? t.slice() : t
    }

    function B(t, e, r = 0, n) {
        let i;
        if (!(r > 20)) {
            if (r++, G(t) || G(e) || V(e)) i = F(e);
            else if (z(t)) {
                if (i = t.slice(), z(e))
                    for (let t = 0, r = e.length; t < r; t++) i.push(F(e[t]));
                else if (H(e)) {
                    const t = Object.keys(e);
                    for (let r = 0, n = t.length; r < n; r++) {
                        const n = t[r];
                        i[n] = F(e[n])
                    }
                }
            } else if (H(t))
                if (H(e)) {
                    if (! function(t, e) {
                            return !(!U(t) || !U(e))
                        }(t, e)) return e;
                    i = Object.assign({}, t);
                    const o = Object.keys(e);
                    for (let s = 0, a = o.length; s < a; s++) {
                        const a = o[s],
                            u = e[a];
                        if (G(u)) void 0 === u ? delete i[a] : i[a] = u;
                        else {
                            const o = i[a],
                                s = u;
                            if ($(t, a, n) || $(e, a, n)) delete i[a];
                            else {
                                if (H(o) && H(s)) {
                                    const r = n.get(o) || [],
                                        i = n.get(s) || [];
                                    r.push({
                                        obj: t,
                                        key: a
                                    }), i.push({
                                        obj: e,
                                        key: a
                                    }), n.set(o, r), n.set(s, i)
                                }
                                i[a] = B(i[a], u, r, n)
                            }
                        }
                    }
                } else i = e;
            return i
        }
    }

    function $(t, e, r) {
        const n = r.get(t[e]) || [];
        for (let r = 0, i = n.length; r < i; r++) {
            const i = n[r];
            if (i.key === e && i.obj === t) return !0
        }
        return !1
    }

    function z(t) {
        return Array.isArray(t)
    }

    function V(t) {
        return "function" == typeof t
    }

    function H(t) {
        return !G(t) && !z(t) && !V(t) && "object" == typeof t
    }

    function G(t) {
        return "string" == typeof t || "number" == typeof t || "boolean" == typeof t || void 0 === t || t instanceof Date || t instanceof RegExp || null === t
    }
    const Q = "exception.message",
        q = "exception.type",
        K = "service.name",
        W = "telemetry.sdk.language",
        X = "telemetry.sdk.name",
        Y = "telemetry.sdk.version",
        J = "process.runtime.name",
        Z = {
            [X]: "opentelemetry",
            [J]: "browser",
            [W]: "webjs",
            [Y]: "2.1.0"
        },
        tt = t => null !== t && "object" == typeof t && "function" == typeof t.then;
    class et {
        _rawAttributes;
        _asyncAttributesPending = !1;
        _schemaUrl;
        _memoizedAttributes;
        static FromAttributeList(t, e) {
            const r = new et({}, e);
            return r._rawAttributes = it(t), r._asyncAttributesPending = t.filter((([t, e]) => tt(e))).length > 0, r
        }
        constructor(t, e) {
            const r = t.attributes ? ? {};
            this._rawAttributes = Object.entries(r).map((([t, e]) => (tt(e) && (this._asyncAttributesPending = !0), [t, e]))), this._rawAttributes = it(this._rawAttributes), this._schemaUrl = function(t) {
                if ("string" == typeof t || void 0 === t) return t;
                m.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.", t)
            }(e ? .schemaUrl)
        }
        get asyncAttributesPending() {
            return this._asyncAttributesPending
        }
        async waitForAsyncAttributes() {
            if (this.asyncAttributesPending) {
                for (let t = 0; t < this._rawAttributes.length; t++) {
                    const [e, r] = this._rawAttributes[t];
                    this._rawAttributes[t] = [e, tt(r) ? await r : r]
                }
                this._asyncAttributesPending = !1
            }
        }
        get attributes() {
            if (this.asyncAttributesPending && m.error("Accessing resource attributes before async attributes settled"), this._memoizedAttributes) return this._memoizedAttributes;
            const t = {};
            for (const [e, r] of this._rawAttributes) tt(r) ? m.debug(`Unsettled resource attribute ${e} skipped`) : null != r && (t[e] ? ? = r);
            return this._asyncAttributesPending || (this._memoizedAttributes = t), t
        }
        getRawAttributes() {
            return this._rawAttributes
        }
        get schemaUrl() {
            return this._schemaUrl
        }
        merge(t) {
            if (null == t) return this;
            const e = function(t, e) {
                    const r = t ? .schemaUrl,
                        n = e ? .schemaUrl;
                    return void 0 === r || "" === r ? n : void 0 === n || "" === n || r === n ? r : void m.warn('Schema URL merge conflict: old resource has "%s", updating resource has "%s". Resulting resource will have undefined Schema URL.', r, n)
                }(this, t),
                r = e ? {
                    schemaUrl: e
                } : void 0;
            return et.FromAttributeList([...t.getRawAttributes(), ...this.getRawAttributes()], r)
        }
    }

    function rt(t, e) {
        return et.FromAttributeList(Object.entries(t), e)
    }

    function nt() {
        return rt({
            [K]: "unknown_service",
            [W]: Z[W],
            [X]: Z[X],
            [Y]: Z[Y]
        })
    }

    function it(t) {
        return t.map((([t, e]) => tt(e) ? [t, e.catch((e => {
            m.debug("promise rejection for resource attribute: %s - %s", t, e)
        }))] : [t, e]))
    }
    var ot = "0000000000000000",
        st = "00000000000000000000000000000000",
        at = {
            traceId: st,
            spanId: ot,
            traceFlags: f.NONE
        },
        ut = function() {
            function t(t) {
                void 0 === t && (t = at), this._spanContext = t
            }
            return t.prototype.spanContext = function() {
                return this._spanContext
            }, t.prototype.setAttribute = function(t, e) {
                return this
            }, t.prototype.setAttributes = function(t) {
                return this
            }, t.prototype.addEvent = function(t, e) {
                return this
            }, t.prototype.addLink = function(t) {
                return this
            }, t.prototype.addLinks = function(t) {
                return this
            }, t.prototype.setStatus = function(t) {
                return this
            }, t.prototype.updateName = function(t) {
                return this
            }, t.prototype.end = function(t) {}, t.prototype.isRecording = function() {
                return !1
            }, t.prototype.recordException = function(t, e) {}, t
        }(),
        ct = _("OpenTelemetry Context Key SPAN");

    function lt(t) {
        return t.getValue(ct) || void 0
    }

    function pt() {
        return lt(w.getInstance().active())
    }

    function dt(t, e) {
        return t.setValue(ct, e)
    }

    function ht(t) {
        return t.deleteValue(ct)
    }

    function ft(t, e) {
        return dt(t, new ut(e))
    }

    function gt(t) {
        var e;
        return null === (e = lt(t)) || void 0 === e ? void 0 : e.spanContext()
    }
    var mt = /^([0-9a-f]{32})$/i,
        _t = /^[0-9a-f]{16}$/i;

    function yt(t) {
        return mt.test(t) && t !== st
    }

    function vt(t) {
        return yt(t.traceId) && (e = t.spanId, _t.test(e) && e !== ot);
        var e
    }

    function bt(t) {
        return new ut(t)
    }
    var St, wt, Et, Tt = w.getInstance(),
        Ct = function() {
            function t() {}
            return t.prototype.startSpan = function(t, e, r) {
                if (void 0 === r && (r = Tt.active()), Boolean(null == e ? void 0 : e.root)) return new ut;
                var n, i = r && gt(r);
                return "object" == typeof(n = i) && "string" == typeof n.spanId && "string" == typeof n.traceId && "number" == typeof n.traceFlags && vt(i) ? new ut(i) : new ut
            }, t.prototype.startActiveSpan = function(t, e, r, n) {
                var i, o, s;
                if (!(arguments.length < 2)) {
                    2 === arguments.length ? s = e : 3 === arguments.length ? (i = e, s = r) : (i = e, o = r, s = n);
                    var a = null != o ? o : Tt.active(),
                        u = this.startSpan(t, i, a),
                        c = dt(a, u);
                    return Tt.with(c, s, void 0, u)
                }
            }, t
        }(),
        At = new Ct,
        Ot = function() {
            function t(t, e, r, n) {
                this._provider = t, this.name = e, this.version = r, this.options = n
            }
            return t.prototype.startSpan = function(t, e, r) {
                return this._getTracer().startSpan(t, e, r)
            }, t.prototype.startActiveSpan = function(t, e, r, n) {
                var i = this._getTracer();
                return Reflect.apply(i.startActiveSpan, i, arguments)
            }, t.prototype._getTracer = function() {
                if (this._delegate) return this._delegate;
                var t = this._provider.getDelegateTracer(this.name, this.version, this.options);
                return t ? (this._delegate = t, this._delegate) : At
            }, t
        }(),
        Lt = new(function() {
            function t() {}
            return t.prototype.getTracer = function(t, e, r) {
                return new Ct
            }, t
        }()),
        Pt = function() {
            function t() {}
            return t.prototype.getTracer = function(t, e, r) {
                var n;
                return null !== (n = this.getDelegateTracer(t, e, r)) && void 0 !== n ? n : new Ot(this, t, e, r)
            }, t.prototype.getDelegate = function() {
                var t;
                return null !== (t = this._delegate) && void 0 !== t ? t : Lt
            }, t.prototype.setDelegate = function(t) {
                this._delegate = t
            }, t.prototype.getDelegateTracer = function(t, e, r) {
                var n;
                return null === (n = this._delegate) || void 0 === n ? void 0 : n.getTracer(t, e, r)
            }, t
        }(),
        xt = "trace",
        Nt = function() {
            function t() {
                this._proxyTracerProvider = new Pt, this.wrapSpanContext = bt, this.isSpanContextValid = vt, this.deleteSpan = ht, this.getSpan = lt, this.getActiveSpan = pt, this.getSpanContext = gt, this.setSpan = dt, this.setSpanContext = ft
            }
            return t.getInstance = function() {
                return this._instance || (this._instance = new t), this._instance
            }, t.prototype.setGlobalTracerProvider = function(t) {
                var e = u(xt, this._proxyTracerProvider, g.instance());
                return e && this._proxyTracerProvider.setDelegate(t), e
            }, t.prototype.getTracerProvider = function() {
                return c(xt) || this._proxyTracerProvider
            }, t.prototype.getTracer = function(t, e) {
                return this.getTracerProvider().getTracer(t, e)
            }, t.prototype.disable = function() {
                l(xt, g.instance()), this._proxyTracerProvider = new Pt
            }, t
        }().getInstance();

    function Rt(t) {
        const e = {};
        if ("object" != typeof t || null == t) return e;
        for (const [r, n] of Object.entries(t)) Dt(r) ? It(n) ? Array.isArray(n) ? e[r] = n.slice() : e[r] = n : m.warn(`Invalid attribute value set for key: ${r}`) : m.warn(`Invalid attribute key: ${r}`);
        return e
    }

    function Dt(t) {
        return "string" == typeof t && t.length > 0
    }

    function It(t) {
        return null == t || (Array.isArray(t) ? function(t) {
            let e;
            for (const r of t)
                if (null != r) {
                    if (!e) {
                        if (Mt(r)) {
                            e = typeof r;
                            continue
                        }
                        return !1
                    }
                    if (typeof r !== e) return !1
                }
            return !0
        }(t) : Mt(t))
    }

    function Mt(t) {
        switch (typeof t) {
            case "number":
            case "boolean":
            case "string":
                return !0
        }
        return !1
    }! function(t) {
        t[t.INTERNAL = 0] = "INTERNAL", t[t.SERVER = 1] = "SERVER", t[t.CLIENT = 2] = "CLIENT", t[t.PRODUCER = 3] = "PRODUCER", t[t.CONSUMER = 4] = "CONSUMER"
    }(St || (St = {})),
    function(t) {
        t[t.NOT_RECORD = 0] = "NOT_RECORD", t[t.RECORD = 1] = "RECORD", t[t.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    }(wt || (wt = {})),
    function(t) {
        t[t.UNSET = 0] = "UNSET", t[t.OK = 1] = "OK", t[t.ERROR = 2] = "ERROR"
    }(Et || (Et = {}));
    const jt = performance,
        kt = Math.pow(10, 6),
        Ut = Math.pow(10, 9);

    function Ft(t) {
        const e = t / 1e3;
        return [Math.trunc(e), Math.round(t % 1e3 * kt)]
    }

    function Bt() {
        let t = jt.timeOrigin;
        if ("number" != typeof t) {
            const e = jt;
            t = e.timing && e.timing.fetchStart
        }
        return t
    }

    function $t(t) {
        return Array.isArray(t) && 2 === t.length && "number" == typeof t[0] && "number" == typeof t[1]
    }

    function zt(t) {
        return $t(t) || "number" == typeof t || t instanceof Date
    }

    function Vt(t, e) {
        const r = [t[0] + e[0], t[1] + e[1]];
        return r[1] >= Ut && (r[1] -= Ut, r[0] += 1), r
    }
    class Ht {
        _spanContext;
        kind;
        parentSpanContext;
        attributes = {};
        links = [];
        events = [];
        startTime;
        resource;
        instrumentationScope;
        _droppedAttributesCount = 0;
        _droppedEventsCount = 0;
        _droppedLinksCount = 0;
        name;
        status = {
            code: Et.UNSET
        };
        endTime = [0, 0];
        _ended = !1;
        _duration = [-1, -1];
        _spanProcessor;
        _spanLimits;
        _attributeValueLengthLimit;
        _performanceStartTime;
        _performanceOffset;
        _startTimeProvided;
        constructor(t) {
            const e = Date.now();
            this._spanContext = t.spanContext, this._performanceStartTime = jt.now(), this._performanceOffset = e - (this._performanceStartTime + Bt()), this._startTimeProvided = null != t.startTime, this._spanLimits = t.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = t.spanProcessor, this.name = t.name, this.parentSpanContext = t.parentSpanContext, this.kind = t.kind, this.links = t.links || [], this.startTime = this._getTime(t.startTime ? ? e), this.resource = t.resource, this.instrumentationScope = t.scope, null != t.attributes && this.setAttributes(t.attributes), this._spanProcessor.onStart(this, t.context)
        }
        spanContext() {
            return this._spanContext
        }
        setAttribute(t, e) {
            if (null == e || this._isSpanEnded()) return this;
            if (0 === t.length) return m.warn(`Invalid attribute key: ${t}`), this;
            if (!It(e)) return m.warn(`Invalid attribute value set for key: ${t}`), this;
            const {
                attributeCountLimit: r
            } = this._spanLimits;
            return void 0 !== r && Object.keys(this.attributes).length >= r && !Object.prototype.hasOwnProperty.call(this.attributes, t) ? (this._droppedAttributesCount++, this) : (this.attributes[t] = this._truncateToSize(e), this)
        }
        setAttributes(t) {
            for (const [e, r] of Object.entries(t)) this.setAttribute(e, r);
            return this
        }
        addEvent(t, e, r) {
            if (this._isSpanEnded()) return this;
            const {
                eventCountLimit: n
            } = this._spanLimits;
            if (0 === n) return m.warn("No events allowed."), this._droppedEventsCount++, this;
            void 0 !== n && this.events.length >= n && (0 === this._droppedEventsCount && m.debug("Dropping extra events."), this.events.shift(), this._droppedEventsCount++), zt(e) && (zt(r) || (r = e), e = void 0);
            const i = Rt(e);
            return this.events.push({
                name: t,
                attributes: i,
                time: this._getTime(r),
                droppedAttributesCount: 0
            }), this
        }
        addLink(t) {
            return this.links.push(t), this
        }
        addLinks(t) {
            return this.links.push(...t), this
        }
        setStatus(t) {
            return this._isSpanEnded() || (this.status = { ...t
            }, null != this.status.message && "string" != typeof t.message && (m.warn(`Dropping invalid status.message of type '${typeof t.message}', expected 'string'`), delete this.status.message)), this
        }
        updateName(t) {
            return this._isSpanEnded() || (this.name = t), this
        }
        end(t) {
            this._isSpanEnded() ? m.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`) : (this._ended = !0, this.endTime = this._getTime(t), this._duration = function(t, e) {
                let r = e[0] - t[0],
                    n = e[1] - t[1];
                return n < 0 && (r -= 1, n += Ut), [r, n]
            }(this.startTime, this.endTime), this._duration[0] < 0 && (m.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0]), this._droppedEventsCount > 0 && m.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`), this._spanProcessor.onEnd(this))
        }
        _getTime(t) {
            if ("number" == typeof t && t <= jt.now()) return e = t + this._performanceOffset, Vt(Ft(Bt()), Ft("number" == typeof e ? e : jt.now()));
            var e;
            if ("number" == typeof t) return Ft(t);
            if (t instanceof Date) return Ft(t.getTime());
            if ($t(t)) return t;
            if (this._startTimeProvided) return Ft(Date.now());
            const r = jt.now() - this._performanceStartTime;
            return Vt(this.startTime, Ft(r))
        }
        isRecording() {
            return !1 === this._ended
        }
        recordException(t, e) {
            const r = {};
            "string" == typeof t ? r[Q] = t : t && (t.code ? r[q] = t.code.toString() : t.name && (r[q] = t.name), t.message && (r[Q] = t.message), t.stack && (r["exception.stacktrace"] = t.stack)), r[q] || r[Q] ? this.addEvent("exception", r, e) : m.warn(`Failed to record an exception ${t}`)
        }
        get duration() {
            return this._duration
        }
        get ended() {
            return this._ended
        }
        get droppedAttributesCount() {
            return this._droppedAttributesCount
        }
        get droppedEventsCount() {
            return this._droppedEventsCount
        }
        get droppedLinksCount() {
            return this._droppedLinksCount
        }
        _isSpanEnded() {
            if (this._ended) {
                const t = new Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
                m.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, t)
            }
            return this._ended
        }
        _truncateToLimitUtil(t, e) {
            return t.length <= e ? t : t.substring(0, e)
        }
        _truncateToSize(t) {
            const e = this._attributeValueLengthLimit;
            return e <= 0 ? (m.warn(`Attribute value limit must be positive, got ${e}`), t) : "string" == typeof t ? this._truncateToLimitUtil(t, e) : Array.isArray(t) ? t.map((t => "string" == typeof t ? this._truncateToLimitUtil(t, e) : t)) : t
        }
    }
    var Gt, Qt;
    ! function(t) {
        t[t.NOT_RECORD = 0] = "NOT_RECORD", t[t.RECORD = 1] = "RECORD", t[t.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    }(Gt || (Gt = {}));
    class qt {
        shouldSample() {
            return {
                decision: Gt.NOT_RECORD
            }
        }
        toString() {
            return "AlwaysOffSampler"
        }
    }
    class Kt {
        shouldSample() {
            return {
                decision: Gt.RECORD_AND_SAMPLED
            }
        }
        toString() {
            return "AlwaysOnSampler"
        }
    }
    class Wt {
        _root;
        _remoteParentSampled;
        _remoteParentNotSampled;
        _localParentSampled;
        _localParentNotSampled;
        constructor(t) {
            this._root = t.root, this._root || (P(new Error("ParentBasedSampler must have a root sampler configured")), this._root = new Kt), this._remoteParentSampled = t.remoteParentSampled ? ? new Kt, this._remoteParentNotSampled = t.remoteParentNotSampled ? ? new qt, this._localParentSampled = t.localParentSampled ? ? new Kt, this._localParentNotSampled = t.localParentNotSampled ? ? new qt
        }
        shouldSample(t, e, r, n, i, o) {
            const s = Nt.getSpanContext(t);
            return s && vt(s) ? s.isRemote ? s.traceFlags & f.SAMPLED ? this._remoteParentSampled.shouldSample(t, e, r, n, i, o) : this._remoteParentNotSampled.shouldSample(t, e, r, n, i, o) : s.traceFlags & f.SAMPLED ? this._localParentSampled.shouldSample(t, e, r, n, i, o) : this._localParentNotSampled.shouldSample(t, e, r, n, i, o) : this._root.shouldSample(t, e, r, n, i, o)
        }
        toString() {
            return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
        }
    }
    class Xt {
        _ratio;
        _upperBound;
        constructor(t = 0) {
            this._ratio = t, this._ratio = this._normalize(t), this._upperBound = Math.floor(4294967295 * this._ratio)
        }
        shouldSample(t, e) {
            return {
                decision: yt(e) && this._accumulate(e) < this._upperBound ? Gt.RECORD_AND_SAMPLED : Gt.NOT_RECORD
            }
        }
        toString() {
            return `TraceIdRatioBased{${this._ratio}}`
        }
        _normalize(t) {
            return "number" != typeof t || isNaN(t) ? 0 : t >= 1 ? 1 : t <= 0 ? 0 : t
        }
        _accumulate(t) {
            let e = 0;
            for (let r = 0; r < t.length / 8; r++) {
                const n = 8 * r;
                e = (e ^ parseInt(t.slice(n, n + 8), 16)) >>> 0
            }
            return e
        }
    }

    function Yt() {
        return {
            sampler: Jt(),
            forceFlushTimeoutMillis: 3e4,
            generalLimits: {
                attributeValueLengthLimit: 1 / 0,
                attributeCountLimit: 128
            },
            spanLimits: {
                attributeValueLengthLimit: 1 / 0,
                attributeCountLimit: 128,
                linkCountLimit: 128,
                eventCountLimit: 128,
                attributePerEventCountLimit: 128,
                attributePerLinkCountLimit: 128
            }
        }
    }

    function Jt() {
        const t = Qt.ParentBasedAlwaysOn;
        switch (t) {
            case Qt.AlwaysOn:
                return new Kt;
            case Qt.AlwaysOff:
                return new qt;
            case Qt.ParentBasedAlwaysOn:
                return new Wt({
                    root: new Kt
                });
            case Qt.ParentBasedAlwaysOff:
                return new Wt({
                    root: new qt
                });
            case Qt.TraceIdRatio:
                return new Xt(Zt());
            case Qt.ParentBasedTraceIdRatio:
                return new Wt({
                    root: new Xt(Zt())
                });
            default:
                return m.error(`OTEL_TRACES_SAMPLER value "${t}" invalid, defaulting to "${Qt.ParentBasedAlwaysOn}".`), new Wt({
                    root: new Kt
                })
        }
    }

    function Zt() {
        return m.error("OTEL_TRACES_SAMPLER_ARG is blank, defaulting to 1."), 1
    }! function(t) {
        t.AlwaysOff = "always_off", t.AlwaysOn = "always_on", t.ParentBasedAlwaysOff = "parentbased_always_off", t.ParentBasedAlwaysOn = "parentbased_always_on", t.ParentBasedTraceIdRatio = "parentbased_traceidratio", t.TraceIdRatio = "traceidratio"
    }(Qt || (Qt = {}));
    const te = 1 / 0;
    class ee {
        generateTraceId = ne(16);
        generateSpanId = ne(8)
    }
    const re = Array(32);

    function ne(t) {
        return function() {
            for (let e = 0; e < 2 * t; e++) re[e] = Math.floor(16 * Math.random()) + 48, re[e] >= 58 && (re[e] += 39);
            return String.fromCharCode.apply(null, re.slice(0, 2 * t))
        }
    }
    class ie {
        _sampler;
        _generalLimits;
        _spanLimits;
        _idGenerator;
        instrumentationScope;
        _resource;
        _spanProcessor;
        constructor(t, e, r, n) {
            const i = function(t) {
                const e = {
                        sampler: Jt()
                    },
                    r = Yt(),
                    n = Object.assign({}, r, e, t);
                return n.generalLimits = Object.assign({}, r.generalLimits, t.generalLimits || {}), n.spanLimits = Object.assign({}, r.spanLimits, t.spanLimits || {}), n
            }(e);
            this._sampler = i.sampler, this._generalLimits = i.generalLimits, this._spanLimits = i.spanLimits, this._idGenerator = e.idGenerator || new ee, this._resource = r, this._spanProcessor = n, this.instrumentationScope = t
        }
        startSpan(t, e = {}, r = E.active()) {
            e.root && (r = Nt.deleteSpan(r));
            const n = Nt.getSpan(r);
            if (O(r)) return m.debug("Instrumentation suppressed, returning Noop Span"), Nt.wrapSpanContext(at);
            const i = n ? .spanContext(),
                o = this._idGenerator.generateSpanId();
            let s, a, u;
            i && Nt.isSpanContextValid(i) ? (a = i.traceId, u = i.traceState, s = i) : a = this._idGenerator.generateTraceId();
            const c = e.kind ? ? St.INTERNAL,
                l = (e.links ? ? []).map((t => ({
                    context: t.context,
                    attributes: Rt(t.attributes)
                }))),
                p = Rt(e.attributes),
                d = this._sampler.shouldSample(r, a, t, c, p, l);
            u = d.traceState ? ? u;
            const h = {
                traceId: a,
                spanId: o,
                traceFlags: d.decision === wt.RECORD_AND_SAMPLED ? f.SAMPLED : f.NONE,
                traceState: u
            };
            if (d.decision === wt.NOT_RECORD) return m.debug("Recording is off, propagating context in a non-recording span"), Nt.wrapSpanContext(h);
            const g = Rt(Object.assign(p, d.attributes));
            return new Ht({
                resource: this._resource,
                scope: this.instrumentationScope,
                context: r,
                spanContext: h,
                name: t,
                kind: c,
                links: l,
                parentSpanContext: s,
                attributes: g,
                startTime: e.startTime,
                spanProcessor: this._spanProcessor,
                spanLimits: this._spanLimits
            })
        }
        startActiveSpan(t, e, r, n) {
            let i, o, s;
            if (arguments.length < 2) return;
            2 === arguments.length ? s = e : 3 === arguments.length ? (i = e, s = r) : (i = e, o = r, s = n);
            const a = o ? ? E.active(),
                u = this.startSpan(t, i, a),
                c = Nt.setSpan(a, u);
            return E.with(c, s, void 0, u)
        }
        getGeneralLimits() {
            return this._generalLimits
        }
        getSpanLimits() {
            return this._spanLimits
        }
    }
    class oe {
        _spanProcessors;
        constructor(t) {
            this._spanProcessors = t
        }
        forceFlush() {
            const t = [];
            for (const e of this._spanProcessors) t.push(e.forceFlush());
            return new Promise((e => {
                Promise.all(t).then((() => {
                    e()
                })).catch((t => {
                    P(t || new Error("MultiSpanProcessor: forceFlush failed")), e()
                }))
            }))
        }
        onStart(t, e) {
            for (const r of this._spanProcessors) r.onStart(t, e)
        }
        onEnd(t) {
            for (const e of this._spanProcessors) e.onEnd(t)
        }
        shutdown() {
            const t = [];
            for (const e of this._spanProcessors) t.push(e.shutdown());
            return new Promise(((e, r) => {
                Promise.all(t).then((() => {
                    e()
                }), r)
            }))
        }
    }
    var se;
    ! function(t) {
        t[t.resolved = 0] = "resolved", t[t.timeout = 1] = "timeout", t[t.error = 2] = "error", t[t.unresolved = 3] = "unresolved"
    }(se || (se = {}));
    class ae {
        _config;
        _tracers = new Map;
        _resource;
        _activeSpanProcessor;
        constructor(t = {}) {
            const e = function(...t) {
                let e = t.shift();
                const r = new WeakMap;
                for (; t.length > 0;) e = B(e, t.shift(), 0, r);
                return e
            }({}, Yt(), function(t) {
                const e = Object.assign({}, t.spanLimits);
                return e.attributeCountLimit = t.spanLimits ? .attributeCountLimit ? ? t.generalLimits ? .attributeCountLimit ? ? void 0 ? ? void 0 ? ? 128, e.attributeValueLengthLimit = t.spanLimits ? .attributeValueLengthLimit ? ? t.generalLimits ? .attributeValueLengthLimit ? ? void 0 ? ? void 0 ? ? te, Object.assign({}, t, {
                    spanLimits: e
                })
            }(t));
            this._resource = e.resource ? ? nt(), this._config = Object.assign({}, e, {
                resource: this._resource
            });
            const r = [];
            t.spanProcessors ? .length && r.push(...t.spanProcessors), this._activeSpanProcessor = new oe(r)
        }
        getTracer(t, e, r) {
            const n = `${t}@${e||""}:${r?.schemaUrl||""}`;
            return this._tracers.has(n) || this._tracers.set(n, new ie({
                name: t,
                version: e,
                schemaUrl: r ? .schemaUrl
            }, this._config, this._resource, this._activeSpanProcessor)), this._tracers.get(n)
        }
        forceFlush() {
            const t = this._config.forceFlushTimeoutMillis,
                e = this._activeSpanProcessor._spanProcessors.map((e => new Promise((r => {
                    let n;
                    const i = setTimeout((() => {
                        r(new Error(`Span processor did not completed within timeout period of ${t} ms`)), n = se.timeout
                    }), t);
                    e.forceFlush().then((() => {
                        clearTimeout(i), n !== se.timeout && (n = se.resolved, r(n))
                    })).catch((t => {
                        clearTimeout(i), n = se.error, r(t)
                    }))
                }))));
            return new Promise(((t, r) => {
                Promise.all(e).then((e => {
                    const n = e.filter((t => t !== se.resolved));
                    n.length > 0 ? r(n) : t()
                })).catch((t => r([t])))
            }))
        }
        shutdown() {
            return this._activeSpanProcessor.shutdown()
        }
    }
    class ue {
        _enabled = !1;
        _currentContext = y;
        _bindFunction(t = y, e) {
            const r = this,
                n = function(...n) {
                    return r.with(t, (() => e.apply(this, n)))
                };
            return Object.defineProperty(n, "length", {
                enumerable: !1,
                configurable: !0,
                writable: !1,
                value: e.length
            }), n
        }
        active() {
            return this._currentContext
        }
        bind(t, e) {
            return void 0 === t && (t = this.active()), "function" == typeof e ? this._bindFunction(t, e) : e
        }
        disable() {
            return this._currentContext = y, this._enabled = !1, this
        }
        enable() {
            return this._enabled || (this._enabled = !0, this._currentContext = y), this
        }
        with(t, e, r, ...n) {
            const i = this._currentContext;
            this._currentContext = t || y;
            try {
                return e.call(r, ...n)
            } finally {
                this._currentContext = i
            }
        }
    }
    var ce = function() {
            function t() {}
            return t.prototype.inject = function(t, e) {}, t.prototype.extract = function(t, e) {
                return t
            }, t.prototype.fields = function() {
                return []
            }, t
        }(),
        le = {
            get: function(t, e) {
                if (null != t) return t[e]
            },
            keys: function(t) {
                return null == t ? [] : Object.keys(t)
            }
        },
        pe = {
            set: function(t, e, r) {
                null != t && (t[e] = r)
            }
        },
        de = _("OpenTelemetry Baggage Key");

    function he(t) {
        return t.getValue(de) || void 0
    }

    function fe() {
        return he(w.getInstance().active())
    }

    function ge(t, e) {
        return t.setValue(de, e)
    }

    function me(t) {
        return t.deleteValue(de)
    }
    var _e = function() {
            function t(t) {
                this._entries = t ? new Map(t) : new Map
            }
            return t.prototype.getEntry = function(t) {
                var e = this._entries.get(t);
                if (e) return Object.assign({}, e)
            }, t.prototype.getAllEntries = function() {
                return Array.from(this._entries.entries()).map((function(t) {
                    var e = function(t, e) {
                        var r = "function" == typeof Symbol && t[Symbol.iterator];
                        if (!r) return t;
                        var n, i, o = r.call(t),
                            s = [];
                        try {
                            for (;
                                (void 0 === e || e-- > 0) && !(n = o.next()).done;) s.push(n.value)
                        } catch (t) {
                            i = {
                                error: t
                            }
                        } finally {
                            try {
                                n && !n.done && (r = o.return) && r.call(o)
                            } finally {
                                if (i) throw i.error
                            }
                        }
                        return s
                    }(t, 2);
                    return [e[0], e[1]]
                }))
            }, t.prototype.setEntry = function(e, r) {
                var n = new t(this._entries);
                return n._entries.set(e, r), n
            }, t.prototype.removeEntry = function(e) {
                var r = new t(this._entries);
                return r._entries.delete(e), r
            }, t.prototype.removeEntries = function() {
                for (var e, r, n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
                var o = new t(this._entries);
                try {
                    for (var s = function(t) {
                            var e = "function" == typeof Symbol && Symbol.iterator,
                                r = e && t[e],
                                n = 0;
                            if (r) return r.call(t);
                            if (t && "number" == typeof t.length) return {
                                next: function() {
                                    return t && n >= t.length && (t = void 0), {
                                        value: t && t[n++],
                                        done: !t
                                    }
                                }
                            };
                            throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.")
                        }(n), a = s.next(); !a.done; a = s.next()) {
                        var u = a.value;
                        o._entries.delete(u)
                    }
                } catch (t) {
                    e = {
                        error: t
                    }
                } finally {
                    try {
                        a && !a.done && (r = s.return) && r.call(s)
                    } finally {
                        if (e) throw e.error
                    }
                }
                return o
            }, t.prototype.clear = function() {
                return new t
            }, t
        }(),
        ye = Symbol("BaggageEntryMetadata"),
        ve = g.instance();

    function be(t) {
        return void 0 === t && (t = {}), new _e(new Map(Object.entries(t)))
    }
    var Se = "propagation",
        we = new ce,
        Ee = function() {
            function t() {
                this.createBaggage = be, this.getBaggage = he, this.getActiveBaggage = fe, this.setBaggage = ge, this.deleteBaggage = me
            }
            return t.getInstance = function() {
                return this._instance || (this._instance = new t), this._instance
            }, t.prototype.setGlobalPropagator = function(t) {
                return u(Se, t, g.instance())
            }, t.prototype.inject = function(t, e, r) {
                return void 0 === r && (r = pe), this._getGlobalPropagator().inject(t, e, r)
            }, t.prototype.extract = function(t, e, r) {
                return void 0 === r && (r = le), this._getGlobalPropagator().extract(t, e, r)
            }, t.prototype.fields = function() {
                return this._getGlobalPropagator().fields()
            }, t.prototype.disable = function() {
                l(Se, g.instance())
            }, t.prototype._getGlobalPropagator = function() {
                return c(Se) || we
            }, t
        }().getInstance();
    class Te {
        _propagators;
        _fields;
        constructor(t = {}) {
            this._propagators = t.propagators ? ? [], this._fields = Array.from(new Set(this._propagators.map((t => "function" == typeof t.fields ? t.fields() : [])).reduce(((t, e) => t.concat(e)), [])))
        }
        inject(t, e, r) {
            for (const n of this._propagators) try {
                n.inject(t, e, r)
            } catch (t) {
                m.warn(`Failed to inject with ${n.constructor.name}. Err: ${t.message}`)
            }
        }
        extract(t, e, r) {
            return this._propagators.reduce(((t, n) => {
                try {
                    return n.extract(t, e, r)
                } catch (t) {
                    m.warn(`Failed to extract with ${n.constructor.name}. Err: ${t.message}`)
                }
                return t
            }), t)
        }
        fields() {
            return this._fields.slice()
        }
    }
    const Ce = "[_0-9a-z-*/]",
        Ae = new RegExp(`^(?:[a-z]${Ce}{0,255}|[a-z0-9]${Ce}{0,240}@[a-z]${Ce}{0,13})$`),
        Oe = /^[ -~]{0,255}[!-~]$/,
        Le = /,|=/;
    class Pe {
        _internalState = new Map;
        constructor(t) {
            t && this._parse(t)
        }
        set(t, e) {
            const r = this._clone();
            return r._internalState.has(t) && r._internalState.delete(t), r._internalState.set(t, e), r
        }
        unset(t) {
            const e = this._clone();
            return e._internalState.delete(t), e
        }
        get(t) {
            return this._internalState.get(t)
        }
        serialize() {
            return this._keys().reduce(((t, e) => (t.push(e + "=" + this.get(e)), t)), []).join(",")
        }
        _parse(t) {
            t.length > 512 || (this._internalState = t.split(",").reverse().reduce(((t, e) => {
                const r = e.trim(),
                    n = r.indexOf("=");
                if (-1 !== n) {
                    const i = r.slice(0, n),
                        o = r.slice(n + 1, e.length);
                    (function(t) {
                        return Ae.test(t)
                    })(i) && function(t) {
                        return Oe.test(t) && !Le.test(t)
                    }(o) && t.set(i, o)
                }
                return t
            }), new Map), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))))
        }
        _keys() {
            return Array.from(this._internalState.keys()).reverse()
        }
        _clone() {
            const t = new Pe;
            return t._internalState = new Map(this._internalState), t
        }
    }
    const xe = "traceparent",
        Ne = "tracestate",
        Re = new RegExp("^\\s?((?!ff)[\\da-f]{2})-((?![0]{32})[\\da-f]{32})-((?![0]{16})[\\da-f]{16})-([\\da-f]{2})(-.*)?\\s?$");
    class De {
        inject(t, e, r) {
            const n = Nt.getSpanContext(t);
            if (!n || O(t) || !vt(n)) return;
            const i = `00-${n.traceId}-${n.spanId}-0${Number(n.traceFlags||f.NONE).toString(16)}`;
            r.set(e, xe, i), n.traceState && r.set(e, Ne, n.traceState.serialize())
        }
        extract(t, e, r) {
            const n = r.get(e, xe);
            if (!n) return t;
            const i = Array.isArray(n) ? n[0] : n;
            if ("string" != typeof i) return t;
            const o = function(t) {
                const e = Re.exec(t);
                return e ? "00" === e[1] && e[5] ? null : {
                    traceId: e[2],
                    spanId: e[3],
                    traceFlags: parseInt(e[4], 16)
                } : null
            }(i);
            if (!o) return t;
            o.isRemote = !0;
            const s = r.get(e, Ne);
            if (s) {
                const t = Array.isArray(s) ? s.join(",") : s;
                o.traceState = new Pe("string" == typeof t ? t : void 0)
            }
            return Nt.setSpanContext(t, o)
        }
        fields() {
            return [xe, Ne]
        }
    }
    const Ie = "baggage";
    class Me {
        inject(t, e, r) {
            const n = Ee.getBaggage(t);
            if (!n || O(t)) return;
            const i = function(t) {
                    return t.getAllEntries().map((([t, e]) => {
                        let r = `${encodeURIComponent(t)}=${encodeURIComponent(e.value)}`;
                        return void 0 !== e.metadata && (r += ";" + e.metadata.toString()), r
                    }))
                }(n).filter((t => t.length <= 4096)).slice(0, 180),
                o = function(t) {
                    return t.reduce(((t, e) => {
                        const r = `${t}${""!==t?",":""}${e}`;
                        return r.length > 8192 ? t : r
                    }), "")
                }(i);
            o.length > 0 && r.set(e, Ie, o)
        }
        extract(t, e, r) {
            const n = r.get(e, Ie),
                i = Array.isArray(n) ? n.join(",") : n;
            if (!i) return t;
            const o = {};
            return 0 === i.length ? t : (i.split(",").forEach((t => {
                const e = function(t) {
                    const e = t.split(";");
                    if (e.length <= 0) return;
                    const r = e.shift();
                    if (!r) return;
                    const n = r.indexOf("=");
                    if (n <= 0) return;
                    const i = decodeURIComponent(r.substring(0, n).trim()),
                        o = decodeURIComponent(r.substring(n + 1).trim());
                    let s;
                    var a;
                    return e.length > 0 && ("string" != typeof(a = e.join(";")) && (ve.error("Cannot create baggage metadata from unknown type: " + typeof a), a = ""), s = {
                        __TYPE__: ye,
                        toString: function() {
                            return a
                        }
                    }), {
                        key: i,
                        value: o,
                        metadata: s
                    }
                }(t);
                if (e) {
                    const t = {
                        value: e.value
                    };
                    e.metadata && (t.metadata = e.metadata), o[e.key] = t
                }
            })), 0 === Object.entries(o).length ? t : Ee.setBaggage(t, Ee.createBaggage(o)))
        }
        fields() {
            return [Ie]
        }
    }
    var je;

    function ke(t, e) {
        return e in t
    }

    function Ue(t, e, r, n = !0) {
        if (ke(r, e) && "number" == typeof r[e] && (!n || 0 !== r[e])) return t.addEvent(e, r[e])
    }

    function Fe(t, e, r = !1, n, i) {
        if (void 0 === n && (n = 0 !== e[je.START_TIME]), r || (Ue(t, je.FETCH_START, e, n), Ue(t, je.DOMAIN_LOOKUP_START, e, n), Ue(t, je.DOMAIN_LOOKUP_END, e, n), Ue(t, je.CONNECT_START, e, n), Ue(t, je.SECURE_CONNECTION_START, e, n), Ue(t, je.CONNECT_END, e, n), Ue(t, je.REQUEST_START, e, n), Ue(t, je.RESPONSE_START, e, n), Ue(t, je.RESPONSE_END, e, n)), !i) {
            const r = e[je.ENCODED_BODY_SIZE];
            void 0 !== r && t.setAttribute("http.response_content_length", r);
            const n = e[je.DECODED_BODY_SIZE];
            void 0 !== n && r !== n && t.setAttribute("http.response_content_length_uncompressed", n)
        }
    }! function(t) {
        t.CONNECT_END = "connectEnd", t.CONNECT_START = "connectStart", t.DECODED_BODY_SIZE = "decodedBodySize", t.DOM_COMPLETE = "domComplete", t.DOM_CONTENT_LOADED_EVENT_END = "domContentLoadedEventEnd", t.DOM_CONTENT_LOADED_EVENT_START = "domContentLoadedEventStart", t.DOM_INTERACTIVE = "domInteractive", t.DOMAIN_LOOKUP_END = "domainLookupEnd", t.DOMAIN_LOOKUP_START = "domainLookupStart", t.ENCODED_BODY_SIZE = "encodedBodySize", t.FETCH_START = "fetchStart", t.LOAD_EVENT_END = "loadEventEnd", t.LOAD_EVENT_START = "loadEventStart", t.NAVIGATION_START = "navigationStart", t.REDIRECT_END = "redirectEnd", t.REDIRECT_START = "redirectStart", t.REQUEST_START = "requestStart", t.RESPONSE_END = "responseEnd", t.RESPONSE_START = "responseStart", t.SECURE_CONNECTION_START = "secureConnectionStart", t.START_TIME = "startTime", t.UNLOAD_EVENT_END = "unloadEventEnd", t.UNLOAD_EVENT_START = "unloadEventStart"
    }(je || (je = {}));
    var Be, $e = (Be = function(t, e) {
            return Be = Object.setPrototypeOf || {
                __proto__: []
            }
            instanceof Array && function(t, e) {
                t.__proto__ = e
            } || function(t, e) {
                for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r])
            }, Be(t, e)
        }, function(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");

            function r() {
                this.constructor = t
            }
            Be(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r)
        }),
        ze = function() {
            function t() {}
            return t.prototype.createGauge = function(t, e) {
                return tr
            }, t.prototype.createHistogram = function(t, e) {
                return er
            }, t.prototype.createCounter = function(t, e) {
                return Ze
            }, t.prototype.createUpDownCounter = function(t, e) {
                return rr
            }, t.prototype.createObservableGauge = function(t, e) {
                return ir
            }, t.prototype.createObservableCounter = function(t, e) {
                return nr
            }, t.prototype.createObservableUpDownCounter = function(t, e) {
                return or
            }, t.prototype.addBatchObservableCallback = function(t, e) {}, t.prototype.removeBatchObservableCallback = function(t) {}, t
        }(),
        Ve = function() {},
        He = function(t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return $e(e, t), e.prototype.add = function(t, e) {}, e
        }(Ve),
        Ge = function(t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return $e(e, t), e.prototype.add = function(t, e) {}, e
        }(Ve),
        Qe = function(t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return $e(e, t), e.prototype.record = function(t, e) {}, e
        }(Ve),
        qe = function(t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return $e(e, t), e.prototype.record = function(t, e) {}, e
        }(Ve),
        Ke = function() {
            function t() {}
            return t.prototype.addCallback = function(t) {}, t.prototype.removeCallback = function(t) {}, t
        }(),
        We = function(t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return $e(e, t), e
        }(Ke),
        Xe = function(t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return $e(e, t), e
        }(Ke),
        Ye = function(t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return $e(e, t), e
        }(Ke),
        Je = new ze,
        Ze = new He,
        tr = new Qe,
        er = new qe,
        rr = new Ge,
        nr = new We,
        ir = new Xe,
        or = new Ye,
        sr = new(function() {
            function t() {}
            return t.prototype.getMeter = function(t, e, r) {
                return Je
            }, t
        }()),
        ar = "metrics",
        ur = function() {
            function t() {}
            return t.getInstance = function() {
                return this._instance || (this._instance = new t), this._instance
            }, t.prototype.setGlobalMeterProvider = function(t) {
                return u(ar, t, g.instance())
            }, t.prototype.getMeterProvider = function() {
                return c(ar) || sr
            }, t.prototype.getMeter = function(t, e, r) {
                return this.getMeterProvider().getMeter(t, e, r)
            }, t.prototype.disable = function() {
                l(ar, g.instance())
            }, t
        }().getInstance();
    const cr = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : "object" == typeof window ? window : "object" == typeof t.g ? t.g : {},
        lr = Symbol.for("io.opentelemetry.js.api.logs"),
        pr = cr;
    class dr {
        emit(t) {}
    }
    const hr = new dr,
        fr = new class {
            getLogger(t, e, r) {
                return new dr
            }
        };
    class gr {
        constructor(t, e, r, n) {
            this._provider = t, this.name = e, this.version = r, this.options = n
        }
        emit(t) {
            this._getLogger().emit(t)
        }
        _getLogger() {
            if (this._delegate) return this._delegate;
            const t = this._provider._getDelegateLogger(this.name, this.version, this.options);
            return t ? (this._delegate = t, this._delegate) : hr
        }
    }
    class mr {
        getLogger(t, e, r) {
            var n;
            return null !== (n = this._getDelegateLogger(t, e, r)) && void 0 !== n ? n : new gr(this, t, e, r)
        }
        _getDelegate() {
            var t;
            return null !== (t = this._delegate) && void 0 !== t ? t : fr
        }
        _setDelegate(t) {
            this._delegate = t
        }
        _getDelegateLogger(t, e, r) {
            var n;
            return null === (n = this._delegate) || void 0 === n ? void 0 : n.getLogger(t, e, r)
        }
    }
    class _r {
        constructor() {
            this._proxyLoggerProvider = new mr
        }
        static getInstance() {
            return this._instance || (this._instance = new _r), this._instance
        }
        setGlobalLoggerProvider(t) {
            return pr[lr] ? this.getLoggerProvider() : (pr[lr] = (e = t, r = fr, t => 1 === t ? e : r), this._proxyLoggerProvider._setDelegate(t), t);
            var e, r
        }
        getLoggerProvider() {
            var t, e;
            return null !== (e = null === (t = pr[lr]) || void 0 === t ? void 0 : t.call(pr, 1)) && void 0 !== e ? e : this._proxyLoggerProvider
        }
        getLogger(t, e, r) {
            return this.getLoggerProvider().getLogger(t, e, r)
        }
        disable() {
            delete pr[lr], this._proxyLoggerProvider = new mr
        }
    }
    const yr = _r.getInstance();
    let vr = console.error.bind(console);

    function br(t, e, r) {
        const n = !!t[e] && Object.prototype.propertyIsEnumerable.call(t, e);
        Object.defineProperty(t, e, {
            configurable: !0,
            enumerable: n,
            writable: !0,
            value: r
        })
    }
    const Sr = (t, e, r) => {
            if (!t || !t[e]) return void vr("no original function " + String(e) + " to wrap");
            if (!r) return vr("no wrapper function"), void vr((new Error).stack);
            const n = t[e];
            if ("function" != typeof n || "function" != typeof r) return void vr("original object and wrapper must be functions");
            const i = r(n, e);
            return br(i, "__original", n), br(i, "__unwrap", (() => {
                t[e] === i && br(t, e, n)
            })), br(i, "__wrapped", !0), br(t, e, i), i
        },
        wr = (t, e, r) => {
            if (!t) return vr("must provide one or more modules to patch"), void vr((new Error).stack);
            Array.isArray(t) || (t = [t]), e && Array.isArray(e) ? t.forEach((t => {
                e.forEach((e => {
                    Sr(t, e, r)
                }))
            })) : vr("must provide one or more functions to wrap on modules")
        },
        Er = (t, e) => {
            if (!t || !t[e]) return vr("no function to unwrap."), void vr((new Error).stack);
            const r = t[e];
            r.__unwrap ? r.__unwrap() : vr("no original to unwrap to -- has " + String(e) + " already been unwrapped?")
        },
        Tr = (t, e) => {
            if (!t) return vr("must provide one or more modules to patch"), void vr((new Error).stack);
            Array.isArray(t) || (t = [t]), e && Array.isArray(e) ? t.forEach((t => {
                e.forEach((e => {
                    Er(t, e)
                }))
            })) : vr("must provide one or more functions to unwrap on modules")
        };

    function Cr(t) {
        t && t.logger && ("function" != typeof t.logger ? vr("new logger isn't a function, not replacing") : vr = t.logger)
    }
    Cr.wrap = Sr, Cr.massWrap = wr, Cr.unwrap = Er, Cr.massUnwrap = Tr;
    class Ar {
        instrumentationName;
        instrumentationVersion;
        _config = {};
        _tracer;
        _meter;
        _logger;
        _diag;
        constructor(t, e, r) {
            this.instrumentationName = t, this.instrumentationVersion = e, this.setConfig(r), this._diag = m.createComponentLogger({
                namespace: t
            }), this._tracer = Nt.getTracer(t, e), this._meter = ur.getMeter(t, e), this._logger = yr.getLogger(t, e), this._updateMetricInstruments()
        }
        _wrap = Sr;
        _unwrap = Er;
        _massWrap = wr;
        _massUnwrap = Tr;
        get meter() {
            return this._meter
        }
        setMeterProvider(t) {
            this._meter = t.getMeter(this.instrumentationName, this.instrumentationVersion), this._updateMetricInstruments()
        }
        get logger() {
            return this._logger
        }
        setLoggerProvider(t) {
            this._logger = t.getLogger(this.instrumentationName, this.instrumentationVersion)
        }
        getModuleDefinitions() {
            const t = this.init() ? ? [];
            return Array.isArray(t) ? t : [t]
        }
        _updateMetricInstruments() {}
        getConfig() {
            return this._config
        }
        setConfig(t) {
            this._config = {
                enabled: !0,
                ...t
            }
        }
        setTracerProvider(t) {
            this._tracer = t.getTracer(this.instrumentationName, this.instrumentationVersion)
        }
        get tracer() {
            return this._tracer
        }
        _runSpanCustomizationHook(t, e, r, n) {
            if (t) try {
                t(r, n)
            } catch (t) {
                this._diag.error("Error running span customization hook due to exception in handler", {
                    triggerName: e
                }, t)
            }
        }
    }
    class Or extends Ar {
        constructor(t, e, r) {
            super(t, e, r), this._config.enabled && this.enable()
        }
    }

    function Lr(t, e, r) {
        let n, i;
        try {
            i = t()
        } catch (t) {
            n = t
        } finally {
            if (e(n, i), n && !r) throw n;
            return i
        }
    }
    var Pr;
    ! function(t) {
        t.DOCUMENT_LOAD = "documentLoad", t.DOCUMENT_FETCH = "documentFetch", t.RESOURCE_FETCH = "resourceFetch"
    }(Pr || (Pr = {}));
    const xr = "http.url";
    var Nr;
    ! function(t) {
        t.FIRST_PAINT = "firstPaint", t.FIRST_CONTENTFUL_PAINT = "firstContentfulPaint"
    }(Nr || (Nr = {}));
    const Rr = {
        "first-paint": Nr.FIRST_PAINT,
        "first-contentful-paint": Nr.FIRST_CONTENTFUL_PAINT
    };
    class Dr {
        _delegate;
        constructor(t) {
            this._delegate = t
        }
        export (t, e) {
            this._delegate.export(t, e)
        }
        forceFlush() {
            return this._delegate.forceFlush()
        }
        shutdown() {
            return this._delegate.shutdown()
        }
    }

    function Ir(t) {
        const e = {
                attributes: Mr(t.attributes),
                droppedAttributesCount: 0
            },
            r = t.schemaUrl;
        return r && "" !== r && (e.schemaUrl = r), e
    }

    function Mr(t) {
        return Object.keys(t).map((e => jr(e, t[e])))
    }

    function jr(t, e) {
        return {
            key: t,
            value: kr(e)
        }
    }

    function kr(t) {
        const e = typeof t;
        return "string" === e ? {
            stringValue: t
        } : "number" === e ? Number.isInteger(t) ? {
            intValue: t
        } : {
            doubleValue: t
        } : "boolean" === e ? {
            boolValue: t
        } : t instanceof Uint8Array ? {
            bytesValue: t
        } : Array.isArray(t) ? {
            arrayValue: {
                values: t.map(kr)
            }
        } : "object" === e && null != t ? {
            kvlistValue: {
                values: Object.entries(t).map((([t, e]) => jr(t, e)))
            }
        } : {}
    }

    function Ur(t) {
        return t >= 48 && t <= 57 ? t - 48 : t >= 97 && t <= 102 ? t - 87 : t - 55
    }

    function Fr(t) {
        const e = new Uint8Array(t.length / 2);
        let r = 0;
        for (let n = 0; n < t.length; n += 2) {
            const i = Ur(t.charCodeAt(n)),
                o = Ur(t.charCodeAt(n + 1));
            e[r++] = i << 4 | o
        }
        return e
    }

    function Br(t) {
        const e = BigInt(1e9);
        return BigInt(t[0]) * e + BigInt(t[1])
    }

    function $r(t) {
        return e = Br(t), {
            low: Number(BigInt.asUintN(32, e)),
            high: Number(BigInt.asUintN(32, e >> BigInt(32)))
        };
        var e
    }
    const zr = "undefined" != typeof BigInt ? function(t) {
        return Br(t).toString()
    } : function(t) {
        return t[0] * Ut + t[1]
    };

    function Vr(t) {
        return t
    }

    function Hr(t) {
        if (void 0 !== t) return Fr(t)
    }
    const Gr = {
        encodeHrTime: $r,
        encodeSpanContext: Fr,
        encodeOptionalSpanContext: Hr
    };

    function Qr(t, e) {
        const r = t.spanContext(),
            n = t.status,
            i = t.parentSpanContext ? .spanId ? e.encodeSpanContext(t.parentSpanContext ? .spanId) : void 0;
        return {
            traceId: e.encodeSpanContext(r.traceId),
            spanId: e.encodeSpanContext(r.spanId),
            parentSpanId: i,
            traceState: r.traceState ? .serialize(),
            name: t.name,
            kind: null == t.kind ? 0 : t.kind + 1,
            startTimeUnixNano: e.encodeHrTime(t.startTime),
            endTimeUnixNano: e.encodeHrTime(t.endTime),
            attributes: Mr(t.attributes),
            droppedAttributesCount: t.droppedAttributesCount,
            events: t.events.map((t => function(t, e) {
                return {
                    attributes: t.attributes ? Mr(t.attributes) : [],
                    name: t.name,
                    timeUnixNano: e.encodeHrTime(t.time),
                    droppedAttributesCount: t.droppedAttributesCount || 0
                }
            }(t, e))),
            droppedEventsCount: t.droppedEventsCount,
            status: {
                code: n.code,
                message: n.message
            },
            links: t.links.map((t => function(t, e) {
                return {
                    attributes: t.attributes ? Mr(t.attributes) : [],
                    spanId: e.encodeSpanContext(t.context.spanId),
                    traceId: e.encodeSpanContext(t.context.traceId),
                    traceState: t.context.traceState ? .serialize(),
                    droppedAttributesCount: t.droppedAttributesCount || 0
                }
            }(t, e))),
            droppedLinksCount: t.droppedLinksCount
        }
    }

    function qr(t, e) {
        const r = function(t) {
                const e = new Map;
                for (const r of t) {
                    let t = e.get(r.resource);
                    t || (t = new Map, e.set(r.resource, t));
                    const n = `${r.instrumentationScope.name}@${r.instrumentationScope.version||""}:${r.instrumentationScope.schemaUrl||""}`;
                    let i = t.get(n);
                    i || (i = [], t.set(n, i)), i.push(r)
                }
                return e
            }(t),
            n = [],
            i = r.entries();
        let o = i.next();
        for (; !o.done;) {
            const [t, r] = o.value, a = [], u = r.values();
            let c = u.next();
            for (; !c.done;) {
                const t = c.value;
                if (t.length > 0) {
                    const r = t.map((t => Qr(t, e)));
                    a.push({
                        scope: (s = t[0].instrumentationScope, {
                            name: s.name,
                            version: s.version
                        }),
                        spans: r,
                        schemaUrl: t[0].instrumentationScope.schemaUrl
                    })
                }
                c = u.next()
            }
            const l = Ir(t),
                p = {
                    resource: l,
                    scopeSpans: a,
                    schemaUrl: l.schemaUrl
                };
            n.push(p), o = i.next()
        }
        var s;
        return n
    }
    const Kr = {
        serializeRequest: t => {
            const e = function(t, e) {
                const r = function(t) {
                    if (void 0 === t) return Gr;
                    const e = t.useLongBits ? ? !0,
                        r = t.useHex ? ? !1;
                    return {
                        encodeHrTime: e ? $r : zr,
                        encodeSpanContext: r ? Vr : Fr,
                        encodeOptionalSpanContext: r ? Vr : Hr
                    }
                }(e);
                return {
                    resourceSpans: qr(t, r)
                }
            }(t, {
                useHex: !0,
                useLongBits: !1
            });
            return (new TextEncoder).encode(JSON.stringify(e))
        },
        deserializeResponse: t => {
            if (0 === t.length) return {};
            const e = new TextDecoder;
            return JSON.parse(e.decode(t))
        }
    };
    class Wr {
        _transport;
        constructor(t) {
            this._transport = t
        }
        retry(t, e, r) {
            return new Promise(((n, i) => {
                setTimeout((() => {
                    this._transport.send(t, e).then(n, i)
                }), r)
            }))
        }
        async send(t, e) {
            const r = Date.now() + e;
            let n = await this._transport.send(t, e),
                i = 5,
                o = 1e3;
            for (;
                "retryable" === n.status && i > 0;) {
                i--;
                const e = Math.max(Math.min(o, 5e3) + (.4 * Math.random() - .2), 0);
                o *= 1.5;
                const s = n.retryInMillis ? ? e,
                    a = r - Date.now();
                if (s > a) return n;
                n = await this.retry(t, a, s)
            }
            return n
        }
        shutdown() {
            return this._transport.shutdown()
        }
    }

    function Xr(t) {
        return new Wr(t.transport)
    }

    function Yr(t) {
        return [429, 502, 503, 504].includes(t)
    }

    function Jr(t) {
        if (null == t) return;
        const e = Number.parseInt(t, 10);
        if (Number.isInteger(e)) return e > 0 ? 1e3 * e : -1;
        const r = new Date(t).getTime() - Date.now();
        return r >= 0 ? r : 0
    }
    class Zr {
        _parameters;
        constructor(t) {
            this._parameters = t
        }
        send(t, e) {
            return new Promise((r => {
                const n = new XMLHttpRequest;
                n.timeout = e, n.open("POST", this._parameters.url);
                const i = this._parameters.headers();
                Object.entries(i).forEach((([t, e]) => {
                    n.setRequestHeader(t, e)
                })), n.ontimeout = t => {
                    r({
                        status: "failure",
                        error: new Error("XHR request timed out")
                    })
                }, n.onreadystatechange = () => {
                    n.status >= 200 && n.status <= 299 ? (m.debug("XHR success"), r({
                        status: "success"
                    })) : n.status && Yr(n.status) ? r({
                        status: "retryable",
                        retryInMillis: Jr(n.getResponseHeader("Retry-After"))
                    }) : 0 !== n.status && r({
                        status: "failure",
                        error: new Error("XHR request failed with non-retryable status")
                    })
                }, n.onabort = () => {
                    r({
                        status: "failure",
                        error: new Error("XHR request aborted")
                    })
                }, n.onerror = () => {
                    r({
                        status: "failure",
                        error: new Error("XHR request errored")
                    })
                }, n.send(t)
            }))
        }
        shutdown() {}
    }
    class tn {
        _params;
        constructor(t) {
            this._params = t
        }
        send(t) {
            return new Promise((e => {
                navigator.sendBeacon(this._params.url, new Blob([t], {
                    type: this._params.blobType
                })) ? (m.debug("SendBeacon success"), e({
                    status: "success"
                })) : e({
                    status: "failure",
                    error: new Error("SendBeacon failed")
                })
            }))
        }
        shutdown() {}
    }
    class en {
        _concurrencyLimit;
        _sendingPromises = [];
        constructor(t) {
            this._concurrencyLimit = t
        }
        pushPromise(t) {
            if (this.hasReachedLimit()) throw new Error("Concurrency Limit reached");
            this._sendingPromises.push(t);
            const e = () => {
                const e = this._sendingPromises.indexOf(t);
                this._sendingPromises.splice(e, 1)
            };
            t.then(e, e)
        }
        hasReachedLimit() {
            return this._sendingPromises.length >= this._concurrencyLimit
        }
        async awaitAll() {
            await Promise.all(this._sendingPromises)
        }
    }

    function rn(t) {
        return new en(t.concurrencyLimit)
    }
    class nn extends Error {
        code;
        name = "OTLPExporterError";
        data;
        constructor(t, e, r) {
            super(t), this.data = r, this.code = e
        }
    }
    class on {
        _transport;
        _serializer;
        _responseHandler;
        _promiseQueue;
        _timeout;
        _diagLogger;
        constructor(t, e, r, n, i) {
            this._transport = t, this._serializer = e, this._responseHandler = r, this._promiseQueue = n, this._timeout = i, this._diagLogger = m.createComponentLogger({
                namespace: "OTLPExportDelegate"
            })
        }
        export (t, e) {
            if (this._diagLogger.debug("items to be sent", t), this._promiseQueue.hasReachedLimit()) return void e({
                code: L.FAILED,
                error: new Error("Concurrent export limit reached")
            });
            const r = this._serializer.serializeRequest(t);
            null != r ? this._promiseQueue.pushPromise(this._transport.send(r, this._timeout).then((t => {
                if ("success" !== t.status) "failure" === t.status && t.error ? e({
                    code: L.FAILED,
                    error: t.error
                }) : "retryable" === t.status ? e({
                    code: L.FAILED,
                    error: new nn("Export failed with retryable status")
                }) : e({
                    code: L.FAILED,
                    error: new nn("Export failed with unknown error")
                });
                else {
                    if (null != t.data) try {
                        this._responseHandler.handleResponse(this._serializer.deserializeResponse(t.data))
                    } catch (e) {
                        this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", e, t.data)
                    }
                    e({
                        code: L.SUCCESS
                    })
                }
            }), (t => e({
                code: L.FAILED,
                error: t
            })))) : e({
                code: L.FAILED,
                error: new Error("Nothing to send")
            })
        }
        forceFlush() {
            return this._promiseQueue.awaitAll()
        }
        async shutdown() {
            this._diagLogger.debug("shutdown started"), await this.forceFlush(), this._transport.shutdown()
        }
    }

    function sn(t, e, r) {
        return n = {
            transport: r,
            serializer: e,
            promiseHandler: rn(t)
        }, i = {
            timeout: t.timeoutMillis
        }, new on(n.transport, n.serializer, {
            handleResponse(t) {
                null != t && function(t) {
                    return Object.prototype.hasOwnProperty.call(t, "partialSuccess")
                }(t) && null != t.partialSuccess && 0 !== Object.keys(t.partialSuccess).length && m.warn("Received Partial Success response:", JSON.stringify(t.partialSuccess))
            }
        }, n.promiseHandler, i.timeout);
        var n, i
    }
    class an {
        _parameters;
        constructor(t) {
            this._parameters = t
        }
        async send(t, e) {
            const r = new AbortController,
                n = setTimeout((() => r.abort()), e);
            try {
                const e = !!globalThis.location,
                    n = new URL(this._parameters.url),
                    i = await fetch(n.href, {
                        method: "POST",
                        headers: this._parameters.headers(),
                        body: t,
                        signal: r.signal,
                        keepalive: e,
                        mode: e ? globalThis.location ? .origin === n.origin ? "same-origin" : "cors" : "no-cors"
                    });
                if (i.status >= 200 && i.status <= 299) return m.debug("response success"), {
                    status: "success"
                };
                if (Yr(i.status)) {
                    return {
                        status: "retryable",
                        retryInMillis: Jr(i.headers.get("Retry-After"))
                    }
                }
                return {
                    status: "failure",
                    error: new Error("Fetch request failed with non-retryable status")
                }
            } catch (t) {
                return "AbortError" === t ? .name ? {
                    status: "failure",
                    error: new Error("Fetch request timed out", {
                        cause: t
                    })
                } : {
                    status: "failure",
                    error: new Error("Fetch request errored", {
                        cause: t
                    })
                }
            } finally {
                clearTimeout(n)
            }
        }
        shutdown() {}
    }

    function un(t, e) {
        return sn(t, e, Xr({
            transport: (r = t, new Zr(r))
        }));
        var r
    }

    function cn(t, e) {
        return sn(t, e, Xr({
            transport: (r = t, new an(r))
        }));
        var r
    }

    function ln(t, e) {
        return sn(t, e, Xr({
            transport: (r = {
                url: t.url,
                blobType: t.headers()["Content-Type"]
            }, new tn(r))
        }));
        var r
    }

    function pn(t) {
        if (Number.isFinite(t) && t > 0) return t;
        throw new Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${t}')`)
    }

    function dn(t) {
        if (null != t) return () => t
    }

    function hn(t, e, r) {
        return {
            timeoutMillis: pn(t.timeoutMillis ? ? e.timeoutMillis ? ? r.timeoutMillis),
            concurrencyLimit: t.concurrencyLimit ? ? e.concurrencyLimit ? ? r.concurrencyLimit,
            compression: t.compression ? ? e.compression ? ? r.compression
        }
    }

    function fn(t, e, r) {
        const n = { ...r()
            },
            i = {};
        return () => (null != e && Object.assign(i, e()), null != t && Object.assign(i, t()), Object.assign(i, n))
    }

    function gn(t) {
        if (null != t) try {
            const e = globalThis.location ? .href;
            return new URL(t, e).href
        } catch {
            throw new Error(`Configuration: Could not parse user-provided export URL: '${t}'`)
        }
    }

    function mn(t, e, r, n) {
        return (t.headers || "function" != typeof navigator.sendBeacon ? void 0 !== globalThis.fetch ? cn : un : ln)(function(t, e, r) {
            return n = {
                url: t.url,
                timeoutMillis: t.timeoutMillis,
                headers: dn(t.headers),
                concurrencyLimit: t.concurrencyLimit
            }, i = {}, o = function(t, e) {
                return {
                    timeoutMillis: 1e4,
                    concurrencyLimit: 30,
                    compression: "none",
                    headers: () => t,
                    url: "http://localhost:4318/" + e
                }
            }(r, e), { ...hn(n, i, o),
                headers: fn((s = n.headers, () => {
                    const t = {};
                    return Object.entries(s ? .() ? ? {}).forEach((([e, r]) => {
                        void 0 !== r ? t[e] = String(r) : m.warn(`Header "${e}" has invalid value (${r}) and will be ignored`)
                    })), t
                }), i.headers, o.headers),
                url: gn(n.url) ? ? i.url ? ? o.url
            };
            var n, i, o, s
        }(t, r, n), e)
    }
    const _n = new class extends Dr {
            constructor(t = {}) {
                super(mn(t, Kr, "v1/traces", {
                    "Content-Type": "application/json"
                }))
            }
        }({
            url: "/.cloud/rum/otel-rum-collector"
        }),
        yn = {
            export (t, e) {
                const r = t.filter((t => "documentFetch" === t.name));
                _n.export(r, e)
            },
            shutdown: () => _n.shutdown(),
            forceFlush: () => Promise.resolve()
        };
    new class extends ae {
        constructor(t = {}) {
            super(t)
        }
        register(t = {}) {
            var e;
            Nt.setGlobalTracerProvider(this), null !== (e = t.propagator) && (void 0 !== e ? Ee.setGlobalPropagator(e) : Ee.setGlobalPropagator(new Te({
                    propagators: [new De, new Me]
                }))),
                function(t) {
                    if (null !== t) {
                        if (void 0 === t) {
                            const t = new ue;
                            return t.enable(), void E.setGlobalContextManager(t)
                        }
                        t.enable(), E.setGlobalContextManager(t)
                    }
                }(t.contextManager)
        }
    }({
        resource: nt().merge(rt({
            "service.name": "elementor-otel-rum"
        })),
        spanProcessors: [new class extends x {
            _visibilityChangeListener;
            _pageHideListener;
            constructor(t, e) {
                super(t, e), this.onInit(e)
            }
            onInit(t) {
                !0 !== t ? .disableAutoFlushOnDocumentHide && "undefined" != typeof document && (this._visibilityChangeListener = () => {
                    "hidden" === document.visibilityState && this.forceFlush().catch((t => {
                        P(t)
                    }))
                }, this._pageHideListener = () => {
                    this.forceFlush().catch((t => {
                        P(t)
                    }))
                }, document.addEventListener("visibilitychange", this._visibilityChangeListener), document.addEventListener("pagehide", this._pageHideListener))
            }
            onShutdown() {
                "undefined" != typeof document && (this._visibilityChangeListener && document.removeEventListener("visibilitychange", this._visibilityChangeListener), this._pageHideListener && document.removeEventListener("pagehide", this._pageHideListener))
            }
        }(yn)]
    }).register(),
        function(t) {
            const e = t.tracerProvider || Nt.getTracerProvider(),
                r = t.meterProvider || ur.getMeterProvider(),
                n = t.loggerProvider || yr.getLoggerProvider();
            ! function(t, e, r, n) {
                for (let i = 0, o = t.length; i < o; i++) {
                    const o = t[i];
                    e && o.setTracerProvider(e), r && o.setMeterProvider(r), n && o.setLoggerProvider && o.setLoggerProvider(n), o.getConfig().enabled || o.enable()
                }
            }(t.instrumentations ? .flat() ? ? [], e, r, n)
        }({
            instrumentations: [new class extends Or {
                component = "document-load";
                version = "1";
                moduleName = this.component;
                constructor(t = {}) {
                    super("@opentelemetry/instrumentation-document-load", "0.50.0", t)
                }
                init() {}
                _onDocumentLoaded() {
                    window.setTimeout((() => {
                        this._collectPerformance()
                    }))
                }
                _addResourcesSpans(t) {
                    const e = jt.getEntriesByType ? .("resource");
                    e && e.forEach((e => {
                        this._initResourceSpan(e, t)
                    }))
                }
                _collectPerformance() {
                    const t = Array.from(document.getElementsByTagName("meta")).find((t => t.getAttribute("name") === xe)),
                        e = (() => {
                            const t = {},
                                e = jt.getEntriesByType ? .("navigation")[0];
                            if (e) Object.values(je).forEach((r => {
                                if (ke(e, r)) {
                                    const n = e[r];
                                    "number" == typeof n && (t[r] = n)
                                }
                            }));
                            else {
                                const e = jt.timing;
                                e && Object.values(je).forEach((r => {
                                    if (ke(e, r)) {
                                        const n = e[r];
                                        "number" == typeof n && (t[r] = n)
                                    }
                                }))
                            }
                            return t
                        })(),
                        r = t && t.content || "";
                    E.with(Ee.extract(y, {
                        traceparent: r
                    }), (() => {
                        const t = this._startSpan(Pr.DOCUMENT_LOAD, je.FETCH_START, e);
                        t && (E.with(Nt.setSpan(E.active(), t), (() => {
                            const t = this._startSpan(Pr.DOCUMENT_FETCH, je.FETCH_START, e);
                            t && (t.setAttribute(xr, location.href), E.with(Nt.setSpan(E.active(), t), (() => {
                                Fe(t, e, this.getConfig().ignoreNetworkEvents), this._addCustomAttributesOnSpan(t, this.getConfig().applyCustomAttributesOnSpan ? .documentFetch), this._endSpan(t, je.RESPONSE_END, e)
                            })))
                        })), t.setAttribute(xr, location.href), t.setAttribute("http.user_agent", navigator.userAgent), this._addResourcesSpans(t), this.getConfig().ignoreNetworkEvents || (Ue(t, je.FETCH_START, e), Ue(t, je.UNLOAD_EVENT_START, e), Ue(t, je.UNLOAD_EVENT_END, e), Ue(t, je.DOM_INTERACTIVE, e), Ue(t, je.DOM_CONTENT_LOADED_EVENT_START, e), Ue(t, je.DOM_CONTENT_LOADED_EVENT_END, e), Ue(t, je.DOM_COMPLETE, e), Ue(t, je.LOAD_EVENT_START, e), Ue(t, je.LOAD_EVENT_END, e)), this.getConfig().ignorePerformancePaintEvents || (t => {
                            const e = jt.getEntriesByType ? .("paint");
                            e && e.forEach((({
                                name: e,
                                startTime: r
                            }) => {
                                ke(Rr, e) && t.addEvent(Rr[e], r)
                            }))
                        })(t), this._addCustomAttributesOnSpan(t, this.getConfig().applyCustomAttributesOnSpan ? .documentLoad), this._endSpan(t, je.LOAD_EVENT_END, e))
                    }))
                }
                _endSpan(t, e, r) {
                    t && (ke(r, e) ? t.end(r[e]) : t.end())
                }
                _initResourceSpan(t, e) {
                    const r = this._startSpan(Pr.RESOURCE_FETCH, je.FETCH_START, t, e);
                    r && (r.setAttribute(xr, t.name), Fe(r, t, this.getConfig().ignoreNetworkEvents), this._addCustomAttributesOnResourceSpan(r, t, this.getConfig().applyCustomAttributesOnSpan ? .resourceFetch), this._endSpan(r, je.RESPONSE_END, t))
                }
                _startSpan(t, e, r, n) {
                    if (ke(r, e) && "number" == typeof r[e]) return this.tracer.startSpan(t, {
                        startTime: r[e]
                    }, n ? Nt.setSpan(E.active(), n) : void 0)
                }
                _waitForPageLoad() {
                    "complete" === window.document.readyState ? this._onDocumentLoaded() : (this._onDocumentLoaded = this._onDocumentLoaded.bind(this), window.addEventListener("load", this._onDocumentLoaded))
                }
                _addCustomAttributesOnSpan(t, e) {
                    e && Lr((() => e(t)), (t => {
                        t && this._diag.error("addCustomAttributesOnSpan", t)
                    }), !0)
                }
                _addCustomAttributesOnResourceSpan(t, e, r) {
                    r && Lr((() => r(t, e)), (t => {
                        t && this._diag.error("addCustomAttributesOnResourceSpan", t)
                    }), !0)
                }
                enable() {
                    window.removeEventListener("load", this._onDocumentLoaded), this._waitForPageLoad()
                }
                disable() {
                    window.removeEventListener("load", this._onDocumentLoaded)
                }
            }]
        })
})();