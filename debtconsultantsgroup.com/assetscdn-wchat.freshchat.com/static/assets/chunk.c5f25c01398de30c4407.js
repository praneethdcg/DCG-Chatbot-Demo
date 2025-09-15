(self.webpackChunkhotline_web = self.webpackChunkhotline_web || []).push([
    [7067], {
        27067: function(e, t, i) {
            var a = window.define;
            a("hotline-web/templates/widget", (function() {
                return i(38511)
            })), a("hotline-web/routes/widget", (function() {
                return i(49438)
            }))
        },
        49438: function(e, t, i) {
            "use strict";
            i.r(t), i.d(t, {
                default: function() {
                    return k
                }
            });
            var a, n, r, o, l, s = i(35235),
                u = i(10935),
                d = i(34645),
                c = i(5660),
                p = i(69049),
                f = i(58678),
                m = i(55411),
                h = i(79833),
                w = i(13256),
                b = i(13418),
                g = i(22126),
                v = i(75920),
                E = i(87643),
                y = i(42410),
                M = i(98682);

            function _(e) {
                var t = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                    } catch (e) {
                        return !1
                    }
                }();
                return function() {
                    var i, a = (0, h.Z)(e);
                    if (t) {
                        var n = (0, h.Z)(this).constructor;
                        i = Reflect.construct(a, arguments, n)
                    } else i = a.apply(this, arguments);
                    return (0, m.Z)(this, i)
                }
            }
            var k = (a = Ember.inject.service, n = Ember.inject.service, r = function(e) {
                (0, f.Z)(i, e);
                var t = _(i);

                function i() {
                    var e;
                    (0, d.Z)(this, i);
                    for (var a = arguments.length, n = new Array(a), r = 0; r < a; r++) n[r] = arguments[r];
                    return e = t.call.apply(t, [this].concat(n)), (0, u.Z)((0, p.Z)(e), "locale", o, (0, p.Z)(e)), (0, u.Z)((0, p.Z)(e), "postMessage", l, (0, p.Z)(e)), e
                }
                return (0, c.Z)(i, [{
                    key: "beforeModel",
                    value: function() {
                        this.locale.updateAppLocale()
                    }
                }, {
                    key: "model",
                    value: function(e, t) {
                        var i = this,
                            a = t.to.queryParams.token && t.to.queryParams.token.trim(),
                            n = t.to.queryParams.widgetUuid && t.to.queryParams.widgetUuid.trim(),
                            r = t.to.queryParams.referrer,
                            o = t.to.queryParams.previewMode,
                            l = b.default.EmberModelUrl.config,
                            u = l.url.replace("{token}", a).replace("{domainName}", r),
                            d = this.session,
                            c = t.to.queryParams.eagerLoad;
                        return a && a.toUpperCase() === b.default.SAMPLE_TOKEN ? null : a && r && d ? (Ember.set(d, "token", a), n && (Ember.set(d, "widgetUuid", n), u = b.default.EmberModelUrl.configV2.url.replace("{token}", a).replace("{domainName}", r).replace("{widgetUuid}", t.to.queryParams.widgetUuid)), Ember.set(d, "referrer", r), Ember.set(d, "previewMode", o), Ember.set(d, "config", {}), c ? new Promise(function(e) {
                            var t = this;
                            (0, s.Z)(this, i);
                            var a = !1;
                            Ember.run.later(function() {
                                (0, s.Z)(this, t), a || (window.removeEventListener("message", n), e(this.store.getRequest(l.model, u)))
                            }.bind(this), 3e3);
                            var n = function(t) {
                                var i, r;
                                a = !0, null != t && null !== (i = t.data) && void 0 !== i && null !== (r = i.payload) && void 0 !== r && r.accountId ? e(t.data.payload) : e(this.store.getRequest(l.model, u)), window.removeEventListener("message", n)
                            }.bind(this);
                            window.addEventListener("message", n), this.postMessage.post({
                                action: b.default.impostor.getFreshChatConfigs
                            })
                        }.bind(this)) : this.store.getRequest(l.model, u)) : null
                    }
                }, {
                    key: "afterModel",
                    value: function(e, t) {
                        var i, a, n, r, o = this.session,
                            l = this.hotlineUI,
                            s = e && e.appId,
                            u = e && e.appName,
                            d = e && e.userAuthConfig,
                            c = null == t || null === (i = t.to) || void 0 === i || null === (a = i.queryParams) || void 0 === a ? void 0 : a.metrics,
                            p = e && (0, y.bulidBetaFeatureFlagObject)(e.betaFeatures);
                        e && (e.betaFeatures = p, p[b.default.FEATURES.KUBE_CANARY_ENABLED_FLAG] && (0, M.setWCFCToken)(!0), this.session.previewMode && p[b.default.skipJWTAuth] ? (this.jwt.enable(!1), this.jwt.strict(!1)) : (this.jwt.enable(d && d.jwtAuthEnabled || !1), this.jwt.strict(d && d.strictModeEnabled || !1)), this.jwt.isEnabled && (this.jwt.auth.timeoutInterval = d && d.authTimeOutInterval), "TEXT" === (null == e || null === (n = e.appearanceConfig) || void 0 === n ? void 0 : n.widgetLauncherStyle) && "" === (null == e || null === (r = e.appearanceConfig) || void 0 === r ? void 0 : r.widgetLauncherValue) && (e.appearanceConfig.widgetLauncherValue = this.intl.t("common.labels.help")), Ember.set(l, "config", e), Ember.set(o, "appId", s), Ember.set(o, "appName", u), Ember.set(o, "appDisplayName", u), Ember.set(o, "isKbaseEnabled", e.support360App && e.omniKBaseEnabled || e.cmsEnabled));
                        if (this.session.previewMode && (e.hideMessenger = !1), Ember.set(o, "isMultiWidget", !0), "true" === c) {
                            var f = {
                                action: "load_widget",
                                payload: e,
                                isWebViewMessage: !0
                            };
                            Ember.set(l, "whiteListedDomains", [window.location.origin]), window.postMessage(f, window.location.origin), window.postMessage({
                                action: "open_chat",
                                isWebViewMessage: !0
                            }, window.location.origin)
                        }
                        if (e && e.hideMessenger) return this.postMessage.post({
                            action: "hide_widget"
                        }), t.abort(), this.replaceWith("access-denied"), !1
                    }
                }]), i
            }(E.default.extend(g.default, v.default)), o = (0, w.Z)(r.prototype, "locale", [a], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: null
            }), l = (0, w.Z)(r.prototype, "postMessage", [n], {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                initializer: null
            }), r)
        },
        11824: function(e, t, i) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = void 0;
            var a, n = (a = i(70234)) && a.__esModule ? a : {
                default: a
            };
            window.define("hotline-web/components/app-loader/template", (function() {
                return n.default
            }));
            var r = (0, Ember.HTMLBars.template)({
                id: "pGdpav8T",
                block: '[[[10,0],[14,0,"h-channel"],[12],[1,"\\n  "],[8,[39,0],null,null,null],[1,"\\n"],[13]],[],false,["app-loader"]]',
                moduleName: "hotline-web/components/app-widget/template.hbs",
                isStrictMode: !1
            });
            t.default = r
        },
        38511: function(e, t, i) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = void 0;
            var a, n = (a = i(11824)) && a.__esModule ? a : {
                default: a
            };
            window.define("hotline-web/components/app-widget/template", (function() {
                return n.default
            }));
            var r = (0, Ember.HTMLBars.template)({
                id: "A+RpcPGD",
                block: '[[[8,[39,0],null,null,null]],[],false,["app-widget"]]',
                moduleName: "hotline-web/templates/widget.hbs",
                isStrictMode: !1
            });
            t.default = r
        }
    }
]);