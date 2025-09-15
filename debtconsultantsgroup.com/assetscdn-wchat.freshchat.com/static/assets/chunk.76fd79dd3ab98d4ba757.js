(self.webpackChunkhotline_web = self.webpackChunkhotline_web || []).push([
    [7126], {
        87126: function(e, t, n) {
            (0, window.define)("hotline-web/routes/access-denied", (function() {
                return n(13576)
            }))
        },
        13576: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, {
                default: function() {
                    return l
                }
            });
            var r = n(34645),
                c = n(69049),
                u = n(58678),
                o = n(55411),
                f = n(79833),
                i = n(52626);

            function a(e) {
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
                    var n, r = (0, f.Z)(e);
                    if (t) {
                        var c = (0, f.Z)(this).constructor;
                        n = Reflect.construct(r, arguments, c)
                    } else n = r.apply(this, arguments);
                    return (0, o.Z)(this, n)
                }
            }
            var l = function(e) {
                (0, u.Z)(n, e);
                var t = a(n);

                function n() {
                    var e;
                    (0, r.Z)(this, n);
                    for (var u = arguments.length, o = new Array(u), f = 0; f < u; f++) o[f] = arguments[f];
                    return e = t.call.apply(t, [this].concat(o)), (0, i.Z)((0, c.Z)(e), "templateName", "error/access-denied"), e
                }
                return n
            }(Ember.Route)
        }
    }
]);