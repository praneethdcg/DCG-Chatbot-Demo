(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [552], {
        4058: (e, t, r) => {
            Promise.resolve().then(r.bind(r, 8975))
        },
        4477: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), ! function(e, t) {
                for (var r in t) Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
            }(t, {
                callServer: function() {
                    return a.callServer
                },
                createServerReference: function() {
                    return s
                },
                findSourceMapURL: function() {
                    return n.findSourceMapURL
                }
            });
            let a = r(3806),
                n = r(1818),
                s = r(4979).createServerReference
        },
        8975: (e, t, r) => {
            "use strict";
            r.r(t), r.d(t, {
                default: () => C
            });
            var a = r(5155),
                n = r(2115);
            let s = () => !!document.querySelector('script[src*="/recaptcha/"]:not([src*="gstatic"])'),
                o = () => ".grecaptcha-badge{display: none !important;}",
                i = () => {
                    let e = document.createElement("style");
                    e.innerHTML = o(), document.body.appendChild(e)
                },
                l = ({
                    host: e = "google.com",
                    isEnterprise: t = !1,
                    render: r,
                    hl: a,
                    badge: n
                }) => {
                    let s = new URLSearchParams({ ...a && {
                            hl: a
                        },
                        ...n && {
                            badge: n
                        },
                        render: r
                    });
                    return `https://www.${e}/recaptcha/${t?"enterprise.js":"api.js"}?${s}`
                },
                c = ({
                    onload: e,
                    appendTo: t = "head",
                    isEnterprise: r = !1,
                    host: a,
                    render: n,
                    badge: s,
                    hl: o,
                    ...i
                }) => {
                    let c = l({
                            host: a,
                            isEnterprise: r,
                            render: n,
                            hl: o,
                            badge: s
                        }),
                        d = document.createElement("script");
                    Object.entries(i).forEach(([e, t]) => {
                        d.setAttribute(e, (null == t ? void 0 : t.toString()) ? ? "")
                    }), d.src = c, d.onload = e, document[t].appendChild(d)
                },
                d = () => {
                    window.___grecaptcha_cfg = void 0;
                    let e = document.querySelector('script[src*="/recaptcha/"]:not([src*="gstatic"])');
                    e && e.remove();
                    let t = document.querySelector('script[src^="https://www.gstatic.com/recaptcha/releases"]');
                    t && t.remove()
                },
                u = e => {
                    let t = document.getElementById(e);
                    if (t)
                        for (; t.lastChild;) t.lastChild.remove()
                },
                m = () => {
                    let e = document.querySelector(".grecaptcha-badge");
                    e && e.parentNode && document.body.removeChild(e.parentNode)
                },
                p = "GoogleReCaptcha Context has not yet been implemented, if you are using useGoogleReCaptcha hook, make sure the hook is called inside component wrapped by GoogleRecaptchaProvider",
                h = (0, n.createContext)({
                    instance: void 0,
                    siteKey: "",
                    language: "",
                    isLoading: !0,
                    executeV3: () => {
                        throw Error(p)
                    },
                    executeV2Invisible: () => {
                        throw Error(p)
                    },
                    reset: () => {
                        throw Error(p)
                    },
                    getResponse: () => {
                        throw Error(p)
                    },
                    render: () => {
                        throw Error(p)
                    }
                }),
                x = ({
                    type: e,
                    siteKey: t,
                    language: r,
                    scriptProps: o,
                    isEnterprise: l = !1,
                    host: p,
                    children: x,
                    explicit: g,
                    onLoad: v,
                    onError: f
                }) => {
                    let [y, b] = (0, n.useState)(!0), [j, N] = (0, n.useState)();
                    (0, n.useEffect)(() => {
                        let a = (null == o ? void 0 : o.id) ? ? `google-recaptcha-${e}-script`,
                            n = s(),
                            h = () => {
                                var r;
                                b(!0);
                                let a = l ? null == (r = window.grecaptcha) ? void 0 : r.enterprise : window.grecaptcha;
                                if (!a) {
                                    f && f();
                                    return
                                }
                                if (g || a.ready(async () => {
                                        N(a), v && await v(a), b(!1)
                                    }), g) {
                                    let r = {
                                        size: "v3" === e || "v2-invisible" === e ? "invisible" : "normal",
                                        ...("v3" === e || "v2-invisible" === e) && {
                                            badge: "bottomright"
                                        },
                                        sitekey: t,
                                        ...g,
                                        "expired-callback": g.expiredCallback,
                                        "error-callback": g.errorCallback
                                    };
                                    n || ("v3" === e || "v2-invisible" === e) && (null == g ? void 0 : g.badge) === "hidden" && i(), a.ready(async () => {
                                        g.container && a.render(g.container, r, !!g.inherit), N(a), v && await v(a), b(!1)
                                    })
                                }
                            };
                        return window.onGoogleReCaptchaLoad = h, n ? h() : c({
                            isEnterprise: l,
                            host: p,
                            ...("v3" === e || "v2-invisible" === e) && (null == g ? void 0 : g.badge) && {
                                badge: (null == g ? void 0 : g.badge) === "hidden" ? "bottomright" : null == g ? void 0 : g.badge
                            },
                            ...r && {
                                hl: r
                            },
                            render: ("v3" === e || "v2-invisible" === e) && null != g && g.container || "v2-checkbox" === e ? "explicit" : t,
                            ...o,
                            onload: h,
                            id: a
                        }), () => {
                            s() && d(), ("v3" === e || "v2-invisible" === e) && !(null != g && g.container) && null != g && g.badge ? u("google-recaptcha-container") : m()
                        }
                    }, [l, r, p, t, e]);
                    let w = e => {
                            if (!(null != j && j.execute)) throw Error("Google ReCaptcha has not been loaded");
                            return j.execute(t, {
                                action: e
                            })
                        },
                        C = e => {
                            if (!(null != j && j.execute)) throw Error("Google ReCaptcha has not been loaded");
                            return j.execute(e)
                        },
                        S = (0, n.useMemo)(() => ({
                            instance: j,
                            siteKey: t,
                            isLoading: y,
                            executeV2Invisible: C,
                            executeV3: w,
                            reset: null == j ? void 0 : j.reset,
                            getResponse: null == j ? void 0 : j.getResponse,
                            render: null == j ? void 0 : j.render,
                            ...r && {
                                language: r
                            }
                        }), [j, t, y, r]);
                    return (0, a.jsx)(h.Provider, {
                        value: S,
                        children: x
                    })
                };
            var g = r(8999);
            let v = () => (0, n.useContext)(h);
            var f = r(4477);
            let y = (0, f.createServerReference)("60faeb6a0c8cadd4e878cb51e7e99131f3ed636095", f.callServer, void 0, f.findSourceMapURL, "submitLeadAction");
            var b = r(9509);
            let j = e => {
                var t, r, s, o, i, l, c, d, u;
                let {
                    initialUtmSource: m = "",
                    initialUtmMedium: p = "",
                    initialUtmCampaign: h = "",
                    initialUtmContent: x = "",
                    initialUtmTerm: g = "",
                    className: f = ""
                } = e, [j, N] = (0, n.useState)(""), [w, C] = (0, n.useState)(""), [S, k] = (0, n.useState)(""), [A, T] = (0, n.useState)(""), [P, _] = (0, n.useState)(""), [O, E] = (0, n.useState)(""), [D, M] = (0, n.useState)(""), [R, L] = (0, n.useState)(!1), [I, U] = (0, n.useState)(""), [V, F] = (0, n.useState)(""), [H, K] = (0, n.useState)(""), [G, W] = (0, n.useState)(m), [Y, $] = (0, n.useState)(p), [B, q] = (0, n.useState)(h), [z, J] = (0, n.useState)(x), [X, Z] = (0, n.useState)(g), [Q, ee] = (0, n.useState)(""), [et, er] = (0, n.useState)(1), [ea, en] = (0, n.useState)(""), [es, eo] = (0, n.useState)(""), [ei, el] = (0, n.useState)(null), [ec, ed] = (0, n.useState)(null), [eu, em] = (0, n.useState)(!1), [ep, eh] = (0, n.useState)(!1), [ex, eg] = (0, n.useState)(!1), [ev, ef] = (0, n.useActionState)(y, {
                    message: null,
                    errors: {}
                }), {
                    executeV3: ey
                } = v(), [, eb] = (0, n.useTransition)(), ej = (null == ev ? void 0 : ev.message) === "Lead submitted successfully! Thank you." && eu, eN = (0, n.useRef)(null), ew = (0, n.useRef)(Array(6).fill(null)), eC = (0, n.useRef)(null), eS = "#0AA3A3", ek = "#089097", eA = "#0AA3A3", eT = "#0A7A58", eP = b.env.NEXT_PUBLIC_PARENT_ORIGIN_URL || "*";
                (0, n.useEffect)(() => {
                    let e = new Date,
                        t = e.getTimezoneOffset();
                    if (K(new Date(e.getTime() - 60 * t * 1e3).toISOString().split("T")[0]), !m && !p && !h && !x && !g) {
                        let e = new URLSearchParams(window.location.search);
                        W(e.get("utm_source") || ""), $(e.get("utm_medium") || ""), q(e.get("utm_campaign") || ""), J(e.get("utm_content") || ""), Z(e.get("utm_term") || "")
                    }
                    if (window.parent !== window) try {
                        ee(window.parent.location.href)
                    } catch (e) {
                        ee(document.referrer || "")
                    } else ee(window.location.href)
                }, [m, p, h, x, g]), (0, n.useLayoutEffect)(() => {
                    let e = eN.current;
                    if (!e) return;
                    let t = Math.max(600, .5 * window.innerHeight),
                        r = () => {
                            let r, a = e.scrollHeight;
                            1 !== et || eC.current || (eC.current = a + 25), r = 2 === et && eC.current ? Math.max(eC.current, a + 25, t) : Math.max(a + 25, t), window.parent !== window && window.parent.postMessage({
                                type: "iframeHeight",
                                height: r
                            }, eP)
                        },
                        a = new ResizeObserver(() => {
                            r()
                        });
                    return a.observe(e), r(), () => {
                        a.disconnect()
                    }
                }, [et, ej, ev.message, ev.errors, eP]), (0, n.useEffect)(() => {
                    if ((null == ev ? void 0 : ev.message) === "Lead submitted successfully! Thank you." && eu) {
                        let e = Number.parseInt(j.replace(/[^0-9]/g, ""), 10),
                            t = "";
                        if (e < 25e3 ? t = "https://debtconsultantsgroup.com/thank-you-3/" : e >= 25e3 && e < 125e3 ? t = "https://debtconsultantsgroup.com/thank-you-2/" : e >= 125e3 && (t = "https://debtconsultantsgroup.com/thank-you/"), t) {
                            let e = setTimeout(() => {
                                let e = new URLSearchParams;
                                G && e.append("utm_source", G), Y && e.append("utm_medium", Y), B && e.append("utm_campaign", B), z && e.append("utm_content", z), X && e.append("utm_term", X);
                                let r = "".concat(t).concat(e.toString() ? "?" + e.toString() : "");
                                window.parent !== window ? window.parent.postMessage({
                                    type: "formRedirect",
                                    url: r
                                }, eP) : window.location.href = r
                            }, 500);
                            return () => clearTimeout(e)
                        }
                    }
                }, [ev, j, G, Y, B, z, X, eP, eu]);
                let e_ = e => {
                        let t = e.replace(/\D/g, "");
                        if (10 === t.length);
                        else if (11 === t.length && t.startsWith("1")) return t.substring(1);
                        else if (t.length > 10) return t.slice(-10);
                        return t
                    },
                    eO = (0, n.useCallback)(async () => {
                        if (!ey) return void el("CAPTCHA service not ready. Please wait and try again.");
                        el(null), ed(null);
                        try {
                            let e = await ey("submit_lead_form");
                            F(e);
                            let t = new FormData;
                            t.append("debtAmount", j), t.append("selectedState", w), t.append("firstName", S), t.append("lastName", A), t.append("email", P), t.append("phone", O), t.append("businessName", D), t.append("acceptance", R ? "on" : ""), t.append("honeypot", I), t.append("captchaToken", e), t.append("date", H), t.append("utm_source", G), t.append("utm_medium", Y), t.append("utm_campaign", B), t.append("utm_content", z), t.append("utm_term", X), t.append("parentUrl", Q), eb(() => {
                                ef(t)
                            })
                        } catch (e) {
                            console.error("Error executing reCAPTCHA or preparing for final form submission:", e), el("An error occurred while preparing your submission. Please try again.")
                        }
                    }, [ey, j, w, S, A, P, O, D, R, I, H, G, Y, B, z, X, Q, ef, eb]),
                    eE = (0, n.useCallback)(async () => {
                        if (!es || !/^\d{6}$/.test(es)) return void el("Please enter a valid 6-digit OTP code.");
                        eg(!0), el(null), ed(null);
                        try {
                            let e = await fetch("/api/verify-otp", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        phone: O,
                                        otpCode: es
                                    })
                                }),
                                t = await e.json();
                            e.ok && t.verified ? (ed(t.message || "OTP verified successfully! Preparing to submit your information..."), em(!0), el(null), await eO()) : (el(t.message || "Invalid OTP. Please double-check the code and try again."), em(!1))
                        } catch (e) {
                            console.error("Error verifying OTP:", e), el("An unexpected error occurred while verifying OTP. Please try again."), em(!1)
                        } finally {
                            eg(!1)
                        }
                    }, [es, O, eO]);
                (0, n.useEffect)(() => {
                    if (2 === et && !eu && "OTPCredential" in window) {
                        let e = new AbortController;
                        return navigator.credentials.get({
                            otp: {
                                transport: ["sms"]
                            },
                            signal: e.signal
                        }).then(e => {
                            e && e.code && (eo(e.code), setTimeout(() => {
                                eE()
                            }, 500))
                        }).catch(() => {
                            console.log("WebOTP cancelled or not available")
                        }), () => {
                            e.abort()
                        }
                    }
                }, [et, eu, eE]), (0, n.useEffect)(() => {
                    2 === et && !eu && ew.current[0] && ew.current[0].focus()
                }, [et, eu]);
                let eD = (e, t) => {
                        let r = t.replace(/\D/g, "").slice(-1),
                            a = es.padEnd(6, " ").split("");
                        if (a[e] = r, eo(a.join("").replace(/\s/g, "")), r && e < 5) {
                            var n;
                            null == (n = ew.current[e + 1]) || n.focus()
                        }
                    },
                    eM = (e, t) => {
                        if ("Backspace" === t.key && !es[e] && e > 0) {
                            var r;
                            null == (r = ew.current[e - 1]) || r.focus()
                        } else "Enter" === t.key && 6 === es.length && eE()
                    },
                    eR = e => {
                        var t;
                        e.preventDefault();
                        let r = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        eo(r);
                        let a = Math.min(r.length, 5);
                        null == (t = ew.current[a]) || t.focus()
                    },
                    eL = async () => {
                        if (j.replace(/[^0-9]/g, "").length < 4) return void el("Please enter a valid debt amount (minimum $1,000).");
                        if (!w) return void el("Please select your state.");
                        if (!S.trim()) return void el("Please enter your first name.");
                        if (!A.trim()) return void el("Please enter your last name.");
                        if (!P.trim() || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(P)) return void el("Please enter a valid email address.");
                        if (!O || !/^\d{10}$/.test(O)) return void el("Please enter a valid 10-digit phone number to receive an OTP.");
                        if (!D.trim()) return void el("Please enter your business name.");
                        if (!R) return void el("You must accept the terms and conditions.");
                        if (!ey) return void el("CAPTCHA service not available. Please try again later.");
                        eh(!0), el(null), ed(null);
                        try {
                            let e = await ey("send_otp"),
                                t = await fetch("/api/send-otp", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        phone: O,
                                        captchaToken: e
                                    })
                                }),
                                r = await t.json();
                            if (t.ok) {
                                ed(r.message || "OTP sent successfully.");
                                let e = 10 === O.length ? "(".concat(O.slice(0, 3), ") ").concat(O.slice(3, 6), "-****") : O;
                                en(e), er(2)
                            } else el(r.message || "Failed to send OTP. Please try again.")
                        } catch (e) {
                            console.error("Error sending OTP:", e), el("An unexpected error occurred while sending OTP. Please try again.")
                        } finally {
                            eh(!1)
                        }
                    },
                    eI = async e => {
                        if (e.preventDefault(), !eu) return void el("OTP not verified. Please complete OTP verification first.");
                        await eO()
                    };
                return (0, a.jsxs)("div", {
                    ref: eN,
                    className: f || "",
                    children: [!ej && (0, a.jsx)("h2", {
                        className: "text-2xl font-semibold text-gray-800 mb-6",
                        children: "Sign-Up for Debt Relief: Check Eligibility"
                    }), (null == ev ? void 0 : ev.message) && !ej && !ei && !ec && (0, a.jsxs)("div", {
                        className: "p-3 rounded-md text-sm ".concat(ev.errors && Object.keys(ev.errors).length > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"),
                        "aria-live": "polite",
                        children: [ev.message, ev.errors && Object.keys(ev.errors).length > 0 && (0, a.jsxs)("div", {
                            className: "mt-2",
                            children: [(0, a.jsx)("strong", {
                                children: "Errors:"
                            }), (0, a.jsx)("ul", {
                                className: "list-disc pl-5 mt-1",
                                children: Object.entries(ev.errors).map(e => {
                                    let [t, r] = e;
                                    return (0, a.jsxs)("li", {
                                        children: [t, ": ", r.join(", ")]
                                    }, t)
                                })
                            })]
                        })]
                    }), ei && (0, a.jsx)("div", {
                        className: "p-3 rounded-md text-sm bg-red-100 text-red-700",
                        "aria-live": "assertive",
                        children: ei
                    }), ec && !(2 === et && !eu) && (0, a.jsx)("div", {
                        className: "p-3 rounded-md text-sm bg-green-100 text-green-700",
                        "aria-live": "polite",
                        children: ec
                    }), ej ? (0, a.jsxs)("div", {
                        className: "flex flex-col items-center justify-center h-full space-y-6 py-10",
                        children: [(0, a.jsx)("h2", {
                            className: "text-2xl font-semibold text-gray-800",
                            children: "Thank you!"
                        }), (0, a.jsx)("p", {
                            className: "text-lg text-gray-700 text-center",
                            children: "Your form has been submitted successfully."
                        })]
                    }) : (0, a.jsxs)("form", {
                        onSubmit: 1 === et ? e => {
                            e.preventDefault(), eL()
                        } : eI,
                        className: "space-y-6",
                        children: [1 === et && (0, a.jsxs)(a.Fragment, {
                            children: [(0, a.jsxs)("div", {
                                className: "grid grid-cols-2 max-[449px]:grid-cols-1 gap-y-6 min-[450px]:gap-x-6",
                                children: [(0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("label", {
                                        htmlFor: "debtAmount",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "Debt Amount"
                                    }), (0, a.jsx)("input", {
                                        type: "text",
                                        name: "debtAmount",
                                        id: "debtAmount",
                                        value: j,
                                        onChange: e => N(e.target.value),
                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] sm:text-sm text-gray-900 placeholder-gray-400",
                                        placeholder: "$10,000",
                                        "aria-describedby": "debtAmount-error"
                                    }), (null == (t = ev.errors) ? void 0 : t.debtAmount) && (0, a.jsx)("div", {
                                        id: "debtAmount-error",
                                        "aria-live": "polite",
                                        className: "mt-2 text-sm text-red-600",
                                        children: ev.errors.debtAmount.map(e => (0, a.jsx)("p", {
                                            children: e
                                        }, e))
                                    })]
                                }), (0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("label", {
                                        htmlFor: "selectedState",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "State"
                                    }), (0, a.jsxs)("select", {
                                        name: "selectedState",
                                        id: "selectedState",
                                        value: w,
                                        onChange: e => C(e.target.value),
                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] sm:text-sm text-gray-900",
                                        "aria-describedby": "selectedState-error",
                                        children: [(0, a.jsx)("option", {
                                            value: "",
                                            children: "Select State"
                                        }), (0, a.jsx)("option", {
                                            value: "AL",
                                            children: "Alabama"
                                        }), (0, a.jsx)("option", {
                                            value: "AK",
                                            children: "Alaska"
                                        }), (0, a.jsx)("option", {
                                            value: "AZ",
                                            children: "Arizona"
                                        }), (0, a.jsx)("option", {
                                            value: "AR",
                                            children: "Arkansas"
                                        }), (0, a.jsx)("option", {
                                            value: "CA",
                                            children: "California"
                                        }), (0, a.jsx)("option", {
                                            value: "CO",
                                            children: "Colorado"
                                        }), (0, a.jsx)("option", {
                                            value: "CT",
                                            children: "Connecticut"
                                        }), (0, a.jsx)("option", {
                                            value: "DE",
                                            children: "Delaware"
                                        }), (0, a.jsx)("option", {
                                            value: "FL",
                                            children: "Florida"
                                        }), (0, a.jsx)("option", {
                                            value: "GA",
                                            children: "Georgia"
                                        }), (0, a.jsx)("option", {
                                            value: "HI",
                                            children: "Hawaii"
                                        }), (0, a.jsx)("option", {
                                            value: "ID",
                                            children: "Idaho"
                                        }), (0, a.jsx)("option", {
                                            value: "IL",
                                            children: "Illinois"
                                        }), (0, a.jsx)("option", {
                                            value: "IN",
                                            children: "Indiana"
                                        }), (0, a.jsx)("option", {
                                            value: "IA",
                                            children: "Iowa"
                                        }), (0, a.jsx)("option", {
                                            value: "KS",
                                            children: "Kansas"
                                        }), (0, a.jsx)("option", {
                                            value: "KY",
                                            children: "Kentucky"
                                        }), (0, a.jsx)("option", {
                                            value: "LA",
                                            children: "Louisiana"
                                        }), (0, a.jsx)("option", {
                                            value: "ME",
                                            children: "Maine"
                                        }), (0, a.jsx)("option", {
                                            value: "MD",
                                            children: "Maryland"
                                        }), (0, a.jsx)("option", {
                                            value: "MA",
                                            children: "Massachusetts"
                                        }), (0, a.jsx)("option", {
                                            value: "MI",
                                            children: "Michigan"
                                        }), (0, a.jsx)("option", {
                                            value: "MN",
                                            children: "Minnesota"
                                        }), (0, a.jsx)("option", {
                                            value: "MS",
                                            children: "Mississippi"
                                        }), (0, a.jsx)("option", {
                                            value: "MO",
                                            children: "Missouri"
                                        }), (0, a.jsx)("option", {
                                            value: "MT",
                                            children: "Montana"
                                        }), (0, a.jsx)("option", {
                                            value: "NE",
                                            children: "Nebraska"
                                        }), (0, a.jsx)("option", {
                                            value: "NV",
                                            children: "Nevada"
                                        }), (0, a.jsx)("option", {
                                            value: "NH",
                                            children: "New Hampshire"
                                        }), (0, a.jsx)("option", {
                                            value: "NJ",
                                            children: "New Jersey"
                                        }), (0, a.jsx)("option", {
                                            value: "NM",
                                            children: "New Mexico"
                                        }), (0, a.jsx)("option", {
                                            value: "NY",
                                            children: "New York"
                                        }), (0, a.jsx)("option", {
                                            value: "NC",
                                            children: "North Carolina"
                                        }), (0, a.jsx)("option", {
                                            value: "ND",
                                            children: "North Dakota"
                                        }), (0, a.jsx)("option", {
                                            value: "OH",
                                            children: "Ohio"
                                        }), (0, a.jsx)("option", {
                                            value: "OK",
                                            children: "Oklahoma"
                                        }), (0, a.jsx)("option", {
                                            value: "OR",
                                            children: "Oregon"
                                        }), (0, a.jsx)("option", {
                                            value: "PA",
                                            children: "Pennsylvania"
                                        }), (0, a.jsx)("option", {
                                            value: "RI",
                                            children: "Rhode Island"
                                        }), (0, a.jsx)("option", {
                                            value: "SC",
                                            children: "South Carolina"
                                        }), (0, a.jsx)("option", {
                                            value: "SD",
                                            children: "South Dakota"
                                        }), (0, a.jsx)("option", {
                                            value: "TN",
                                            children: "Tennessee"
                                        }), (0, a.jsx)("option", {
                                            value: "TX",
                                            children: "Texas"
                                        }), (0, a.jsx)("option", {
                                            value: "UT",
                                            children: "Utah"
                                        }), (0, a.jsx)("option", {
                                            value: "VT",
                                            children: "Vermont"
                                        }), (0, a.jsx)("option", {
                                            value: "VA",
                                            children: "Virginia"
                                        }), (0, a.jsx)("option", {
                                            value: "WA",
                                            children: "Washington"
                                        }), (0, a.jsx)("option", {
                                            value: "WV",
                                            children: "West Virginia"
                                        }), (0, a.jsx)("option", {
                                            value: "WI",
                                            children: "Wisconsin"
                                        }), (0, a.jsx)("option", {
                                            value: "WY",
                                            children: "Wyoming"
                                        })]
                                    }), (null == (r = ev.errors) ? void 0 : r.selectedState) && (0, a.jsx)("div", {
                                        id: "selectedState-error",
                                        "aria-live": "polite",
                                        className: "mt-2 text-sm text-red-600",
                                        children: ev.errors.selectedState.map(e => (0, a.jsx)("p", {
                                            children: e
                                        }, e))
                                    })]
                                })]
                            }), (0, a.jsxs)("div", {
                                className: "grid grid-cols-2 max-[449px]:grid-cols-1 gap-y-6 min-[450px]:gap-x-6",
                                children: [(0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("label", {
                                        htmlFor: "firstName",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "First Name"
                                    }), (0, a.jsx)("input", {
                                        type: "text",
                                        name: "firstName",
                                        id: "firstName",
                                        value: S,
                                        onChange: e => k(e.target.value),
                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] sm:text-sm text-gray-900 placeholder-gray-400",
                                        placeholder: "John",
                                        "aria-describedby": "firstName-error"
                                    }), (null == (s = ev.errors) ? void 0 : s.firstName) && (0, a.jsx)("div", {
                                        id: "firstName-error",
                                        "aria-live": "polite",
                                        className: "mt-2 text-sm text-red-600",
                                        children: ev.errors.firstName.map(e => (0, a.jsx)("p", {
                                            children: e
                                        }, e))
                                    })]
                                }), (0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("label", {
                                        htmlFor: "lastName",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "Last Name"
                                    }), (0, a.jsx)("input", {
                                        type: "text",
                                        name: "lastName",
                                        id: "lastName",
                                        value: A,
                                        onChange: e => T(e.target.value),
                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] sm:text-sm text-gray-900 placeholder-gray-400",
                                        placeholder: "Doe",
                                        "aria-describedby": "lastName-error"
                                    }), (null == (o = ev.errors) ? void 0 : o.lastName) && (0, a.jsx)("div", {
                                        id: "lastName-error",
                                        "aria-live": "polite",
                                        className: "mt-2 text-sm text-red-600",
                                        children: ev.errors.lastName.map(e => (0, a.jsx)("p", {
                                            children: e
                                        }, e))
                                    })]
                                })]
                            }), (0, a.jsxs)("div", {
                                className: "grid grid-cols-2 max-[449px]:grid-cols-1 gap-y-6 min-[450px]:gap-x-6",
                                children: [(0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("label", {
                                        htmlFor: "email",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "Email Address"
                                    }), (0, a.jsx)("input", {
                                        type: "email",
                                        name: "email",
                                        id: "email",
                                        value: P,
                                        onChange: e => _(e.target.value),
                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] sm:text-sm text-gray-900 placeholder-gray-400",
                                        placeholder: "you@example.com",
                                        "aria-describedby": "email-error"
                                    }), (null == (i = ev.errors) ? void 0 : i.email) && (0, a.jsx)("div", {
                                        id: "email-error",
                                        "aria-live": "polite",
                                        className: "mt-2 text-sm text-red-600",
                                        children: ev.errors.email.map(e => (0, a.jsx)("p", {
                                            children: e
                                        }, e))
                                    })]
                                }), (0, a.jsxs)("div", {
                                    children: [(0, a.jsx)("label", {
                                        htmlFor: "phone",
                                        className: "block text-sm font-medium text-gray-700",
                                        children: "Phone Number"
                                    }), (0, a.jsx)("input", {
                                        type: "tel",
                                        name: "phone",
                                        id: "phone",
                                        value: O.length >= 3 ? (e => {
                                            let t = e_(e);
                                            return 10 === t.length || t.length >= 6 ? "(".concat(t.slice(0, 3), ") ").concat(t.slice(3, 6), "-").concat(t.slice(6)) : t.length >= 3 ? "(".concat(t.slice(0, 3), ") ").concat(t.slice(3)) : t
                                        })(O) : O,
                                        onChange: e => {
                                            E(e_(e.target.value))
                                        },
                                        className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] sm:text-sm text-gray-900 placeholder-gray-400",
                                        placeholder: "(123) 456-7890",
                                        "aria-describedby": "phone-error"
                                    }), (null == (l = ev.errors) ? void 0 : l.phone) && (0, a.jsx)("div", {
                                        id: "phone-error",
                                        "aria-live": "polite",
                                        className: "mt-2 text-sm text-red-600",
                                        children: ev.errors.phone.map(e => (0, a.jsx)("p", {
                                            children: e
                                        }, e))
                                    })]
                                })]
                            }), (0, a.jsxs)("div", {
                                children: [(0, a.jsx)("label", {
                                    htmlFor: "businessName",
                                    className: "block text-sm font-medium text-gray-700",
                                    children: "Business Name"
                                }), (0, a.jsx)("input", {
                                    type: "text",
                                    name: "businessName",
                                    id: "businessName",
                                    value: D,
                                    onChange: e => M(e.target.value),
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] sm:text-sm text-gray-900 placeholder-gray-400",
                                    placeholder: "Acme Corp",
                                    "aria-describedby": "businessName-error"
                                }), (null == (c = ev.errors) ? void 0 : c.businessName) && (0, a.jsx)("div", {
                                    id: "businessName-error",
                                    "aria-live": "polite",
                                    className: "mt-2 text-sm text-red-600",
                                    children: ev.errors.businessName.map(e => (0, a.jsx)("p", {
                                        children: e
                                    }, e))
                                })]
                            }), (0, a.jsxs)("div", {
                                className: "flex items-start",
                                children: [(0, a.jsx)("div", {
                                    className: "flex items-center h-5",
                                    children: (0, a.jsx)("input", {
                                        id: "acceptance",
                                        name: "acceptance",
                                        type: "checkbox",
                                        checked: R,
                                        onChange: e => L(e.target.checked),
                                        className: "focus:ring-[#0C8D64] h-4 w-4 text-[#0C8D64] border-gray-300 rounded",
                                        "aria-describedby": "acceptance-error"
                                    })
                                }), (0, a.jsx)("div", {
                                    className: "ml-3 text-sm",
                                    children: (0, a.jsx)("label", {
                                        htmlFor: "acceptance",
                                        className: "font-medium text-gray-700",
                                        children: (0, a.jsxs)("p", {
                                            className: "font-medium text-gray-700",
                                            children: ["By providing your phone number, you agree to receive text messages from ", "Debt Consultants Group", " subject to our ", (0, a.jsx)("a", {
                                                href: "https://debtconsultantsgroup.com/privacy-policy/",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                style: { ...eA && {
                                                        color: eA
                                                    }
                                                },
                                                onMouseOver: e => {
                                                    eT && (e.currentTarget.style.color = eT)
                                                },
                                                onMouseOut: e => {
                                                    eA ? e.currentTarget.style.color = eA : e.currentTarget.style.color = ""
                                                },
                                                className: "underline",
                                                children: " Privacy Policy"
                                            }), " and ", (0, a.jsx)("a", {
                                                href: "https://debtconsultantsgroup.com/terms-of-use/",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                style: { ...eA && {
                                                        color: eA
                                                    }
                                                },
                                                onMouseOver: e => {
                                                    eT && (e.currentTarget.style.color = eT)
                                                },
                                                onMouseOut: e => {
                                                    eA ? e.currentTarget.style.color = eA : e.currentTarget.style.color = ""
                                                },
                                                className: "underline",
                                                children: "Terms of Use "
                                            }), ". Message & data rates may apply. Message frequency varies. Reply Stop to opt out."]
                                        })
                                    })
                                })]
                            }), (null == (d = ev.errors) ? void 0 : d.acceptance) && (0, a.jsx)("div", {
                                id: "acceptance-error",
                                "aria-live": "polite",
                                className: "mt-2 text-sm text-red-600",
                                children: ev.errors.acceptance.map(e => (0, a.jsx)("p", {
                                    children: e
                                }, e))
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "date",
                                value: H
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "utm_source",
                                value: G
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "utm_medium",
                                value: Y
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "utm_campaign",
                                value: B
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "utm_content",
                                value: z
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "utm_term",
                                value: X
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "parentUrl",
                                value: Q
                            }), (0, a.jsx)("input", {
                                type: "hidden",
                                name: "captchaToken",
                                value: V
                            }), (0, a.jsxs)("div", {
                                style: {
                                    position: "absolute",
                                    left: "-5000px"
                                },
                                "aria-hidden": "true",
                                children: [(0, a.jsx)("label", {
                                    htmlFor: "honeypot",
                                    children: "Do not fill this out"
                                }), (0, a.jsx)("input", {
                                    type: "text",
                                    id: "honeypot",
                                    name: "honeypot",
                                    tabIndex: -1,
                                    value: I,
                                    onChange: e => U(e.target.value),
                                    autoComplete: "off",
                                    "aria-describedby": "honeypot-error"
                                })]
                            }), (null == (u = ev.errors) ? void 0 : u.honeypot) && (0, a.jsx)("div", {
                                id: "honeypot-error",
                                "aria-live": "polite",
                                className: "mt-2 text-sm text-red-600",
                                style: {
                                    position: "absolute",
                                    left: "-5000px"
                                },
                                children: ev.errors.honeypot.map(e => (0, a.jsx)("p", {
                                    children: e
                                }, e))
                            }), (0, a.jsx)("div", {
                                children: (0, a.jsx)("button", {
                                    type: "submit",
                                    style: { ...eS && {
                                            backgroundColor: eS
                                        }
                                    },
                                    onMouseOver: e => {
                                        ek && (e.currentTarget.style.backgroundColor = ek)
                                    },
                                    onMouseOut: e => {
                                        eS ? e.currentTarget.style.backgroundColor = eS : e.currentTarget.style.backgroundColor = ""
                                    },
                                    className: "w-2/5 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0AA3A3] disabled:opacity-50",
                                    disabled: !ey || ep,
                                    children: ep ? "Sending..." : "Send Verification Code"
                                })
                            })]
                        }), 2 === et && (0, a.jsxs)(a.Fragment, {
                            children: [(0, a.jsxs)("div", {
                                className: "text-center space-y-4",
                                children: [(0, a.jsx)("h3", {
                                    className: "text-lg font-medium text-gray-900",
                                    children: "Verify Your Phone Number"
                                }), (0, a.jsxs)("p", {
                                    className: "text-sm text-gray-600",
                                    children: ["We've sent a 6-digit verification code to ", ea]
                                })]
                            }), (0, a.jsx)("div", {
                                className: "flex justify-center space-x-2",
                                children: Array.from({
                                    length: 6
                                }).map((e, t) => (0, a.jsx)("input", {
                                    ref: e => {
                                        ew.current[t] = e
                                    },
                                    type: "text",
                                    className: "w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-[#0C8D64] focus:border-[#0C8D64] text-lg font-medium",
                                    maxLength: 1,
                                    value: es[t] || "",
                                    onChange: e => eD(t, e.target.value),
                                    onKeyDown: e => eM(t, e),
                                    onPaste: eR
                                }, t))
                            }), (0, a.jsxs)("div", {
                                className: "flex space-x-4",
                                children: [(0, a.jsx)("button", {
                                    type: "button",
                                    onClick: () => er(1),
                                    className: "flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
                                    children: "Back"
                                }), (0, a.jsx)("button", {
                                    type: "button",
                                    onClick: eE,
                                    disabled: ex || 6 !== es.length,
                                    style: { ...eS && {
                                            backgroundColor: eS
                                        }
                                    },
                                    onMouseOver: e => {
                                        ek && (e.currentTarget.style.backgroundColor = ek)
                                    },
                                    onMouseOut: e => {
                                        eS ? e.currentTarget.style.backgroundColor = eS : e.currentTarget.style.backgroundColor = ""
                                    },
                                    className: "flex-1 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0AA3A3] disabled:opacity-50",
                                    children: ex ? "Verifying..." : "Verify Code"
                                })]
                            })]
                        })]
                    })]
                })
            };

            function N() {
                let e = (0, g.useSearchParams)();
                return (0, a.jsx)(j, {
                    className: "flex-grow w-full overflow-y-auto",
                    initialUtmSource: e.get("utm_source") || void 0,
                    initialUtmMedium: e.get("utm_medium") || void 0,
                    initialUtmCampaign: e.get("utm_campaign") || void 0,
                    initialUtmContent: e.get("utm_content") || void 0,
                    initialUtmTerm: e.get("utm_term") || void 0
                })
            }

            function w() {
                return (0, a.jsx)("div", {
                    className: "flex items-center justify-center h-full text-gray-600",
                    children: (0, a.jsx)("p", {
                        children: "Loading form..."
                    })
                })
            }

            function C() {
                let e = "6LciuN0qAAAAAGN5KY2ktCcg0ltvAP9PgsHzZ98i";
                return e ? (0, a.jsx)(x, {
                    type: "v3",
                    siteKey: e,
                    children: (0, a.jsx)("div", {
                        className: "h-full w-full flex flex-col p-4 bg-white",
                        children: (0, a.jsx)(n.Suspense, {
                            fallback: (0, a.jsx)(w, {}),
                            children: (0, a.jsx)(N, {})
                        })
                    })
                }) : (console.error("Missing NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY environment variable."), (0, a.jsx)("div", {
                    className: "p-4 text-red-600",
                    children: "Error: reCAPTCHA site key is not configured."
                }))
            }
        }
    },
    e => {
        var t = t => e(e.s = t);
        e.O(0, [441, 684, 358], () => t(4058)), _N_E = e.O()
    }
]);