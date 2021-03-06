function debounce(t, r) {
    var e = null;
    return function() {
        var n = this,
            o = arguments;
        clearTimeout(e), e = setTimeout(function() {
            t.apply(n, o)
        }, r)
    }
}
Array.prototype.every || (Array.prototype.every = function(t, r) {
        "use strict";
        var e, n;
        if (null == this) throw new TypeError("this is null or not defined");
        var o = Object(this),
            i = o.length >>> 0;
        if ("function" != typeof t) throw new TypeError;
        for (arguments.length > 1 && (e = r), n = 0; i > n;) {
            var u;
            if (n in o) {
                u = o[n];
                var s = t.call(e, u, n, o);
                if (!s) return !1
            }
            n++
        }
        return !0
    }), Array.prototype.forEach || (Array.prototype.forEach = function(t, r) {
        var e, n;
        if (null == this) throw new TypeError(" this is null or not defined");
        var o = Object(this),
            i = o.length >>> 0;
        if ("function" != typeof t) throw new TypeError(t + " is not a function");
        for (arguments.length > 1 && (e = r), n = 0; i > n;) {
            var u;
            n in o && (u = o[n], t.call(e, u, n, o)), n++
        }
    }), Array.prototype.reduce || (Array.prototype.reduce = function(t) {
        "use strict";
        if (null == this) throw new TypeError("Array.prototype.reduce called on null or undefined");
        if ("function" != typeof t) throw new TypeError(t + " is not a function");
        var r, e = Object(this),
            n = e.length >>> 0,
            o = 0;
        if (2 == arguments.length) r = arguments[1];
        else {
            for (; n > o && !(o in e);) o++;
            if (o >= n) throw new TypeError("Reduce of empty array with no initial value");
            r = e[o++]
        }
        for (; n > o; o++) o in e && (r = t(r, e[o], o, e));
        return r
    }),
    function() {
        "use strict";

        function t(t) {
            return "function" == typeof t || "object" == typeof t && null !== t
        }

        function r(t) {
            return "function" == typeof t
        }

        function e(t) {
            return "object" == typeof t && null !== t
        }

        function n(t) {
            R = t
        }

        function o(t) {
            B = t
        }

        function i() {
            return function() {
                process.nextTick(f)
            }
        }

        function u() {
            return function() {
                N(f)
            }
        }

        function s() {
            var t = 0,
                r = new J(f),
                e = document.createTextNode("");
            return r.observe(e, {
                    characterData: !0
                }),
                function() {
                    e.data = t = ++t % 2
                }
        }

        function a() {
            var t = new MessageChannel;
            return t.port1.onmessage = f,
                function() {
                    t.port2.postMessage(0)
                }
        }

        function c() {
            return function() {
                setTimeout(f, 1)
            }
        }

        function f() {
            for (var t = 0; z > t; t += 2) {
                var r = X[t],
                    e = X[t + 1];
                r(e), X[t] = void 0, X[t + 1] = void 0
            }
            z = 0
        }

        function l() {
            try {
                var t = require,
                    r = t("vertx");
                return N = r.runOnLoop || r.runOnContext, u()
            } catch (e) {
                return c()
            }
        }

        function p() {}

        function h() {
            return new TypeError("You cannot resolve a promise with itself")
        }

        function y() {
            return new TypeError("A promises callback cannot return that same promise.")
        }

        function v(t) {
            try {
                return t.then
            } catch (r) {
                return rt.error = r, rt
            }
        }

        function d(t, r, e, n) {
            try {
                t.call(r, e, n)
            } catch (o) {
                return o
            }
        }

        function _(t, r, e) {
            B(function(t) {
                var n = !1,
                    o = d(e, r, function(e) {
                        n || (n = !0, r !== e ? g(t, e) : A(t, e))
                    }, function(r) {
                        n || (n = !0, E(t, r))
                    }, "Settle: " + (t._label || " unknown promise"));
                !n && o && (n = !0, E(t, o))
            }, t)
        }

        function m(t, r) {
            r._state === $ ? A(t, r._result) : r._state === tt ? E(t, r._result) : T(r, void 0, function(r) {
                g(t, r)
            }, function(r) {
                E(t, r)
            })
        }

        function w(t, e) {
            if (e.constructor === t.constructor) m(t, e);
            else {
                var n = v(e);
                n === rt ? E(t, rt.error) : void 0 === n ? A(t, e) : r(n) ? _(t, e, n) : A(t, e)
            }
        }

        function g(r, e) {
            r === e ? E(r, h()) : t(e) ? w(r, e) : A(r, e)
        }

        function b(t) {
            t._onerror && t._onerror(t._result), j(t)
        }

        function A(t, r) {
            t._state === Z && (t._result = r, t._state = $, 0 !== t._subscribers.length && B(j, t))
        }

        function E(t, r) {
            t._state === Z && (t._state = tt, t._result = r, B(b, t))
        }

        function T(t, r, e, n) {
            var o = t._subscribers,
                i = o.length;
            t._onerror = null, o[i] = r, o[i + $] = e, o[i + tt] = n, 0 === i && t._state && B(j, t)
        }

        function j(t) {
            var r = t._subscribers,
                e = t._state;
            if (0 !== r.length) {
                for (var n, o, i = t._result, u = 0; u < r.length; u += 3) n = r[u], o = r[u + e], n ? S(e, n, o, i) : o(i);
                t._subscribers.length = 0
            }
        }

        function M() {
            this.error = null
        }

        function O(t, r) {
            try {
                return t(r)
            } catch (e) {
                return et.error = e, et
            }
        }

        function S(t, e, n, o) {
            var i, u, s, a, c = r(n);
            if (c) {
                if (i = O(n, o), i === et ? (a = !0, u = i.error, i = null) : s = !0, e === i) return void E(e, y())
            } else i = o, s = !0;
            e._state !== Z || (c && s ? g(e, i) : a ? E(e, u) : t === $ ? A(e, i) : t === tt && E(e, i))
        }

        function x(t, r) {
            try {
                r(function(r) {
                    g(t, r)
                }, function(r) {
                    E(t, r)
                })
            } catch (e) {
                E(t, e)
            }
        }

        function P(t, r) {
            var e = this;
            e._instanceConstructor = t, e.promise = new t(p), e._validateInput(r) ? (e._input = r, e.length = r.length, e._remaining = r.length, e._init(), 0 === e.length ? A(e.promise, e._result) : (e.length = e.length || 0, e._enumerate(), 0 === e._remaining && A(e.promise, e._result))) : E(e.promise, e._validationError())
        }

        function C(t) {
            return new nt(this, t).promise
        }

        function k(t) {
            function r(t) {
                g(o, t)
            }

            function e(t) {
                E(o, t)
            }
            var n = this,
                o = new n(p);
            if (!W(t)) return E(o, new TypeError("You must pass an array to race.")), o;
            for (var i = t.length, u = 0; o._state === Z && i > u; u++) T(n.resolve(t[u]), void 0, r, e);
            return o
        }

        function Y(t) {
            var r = this;
            if (t && "object" == typeof t && t.constructor === r) return t;
            var e = new r(p);
            return g(e, t), e
        }

        function q(t) {
            var r = this,
                e = new r(p);
            return E(e, t), e
        }

        function F() {
            throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
        }

        function I() {
            throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
        }

        function D(t) {
            this._id = at++, this._state = void 0, this._result = void 0, this._subscribers = [], p !== t && (r(t) || F(), this instanceof D || I(), x(this, t))
        }

        function K() {
            var t;
            if ("undefined" != typeof global) t = global;
            else if ("undefined" != typeof self) t = self;
            else try {
                t = Function("return this")()
            } catch (r) {
                throw new Error("polyfill failed because global object is unavailable in this environment")
            }
            var e = t.Promise;
            (!e || "[object Promise]" !== Object.prototype.toString.call(e.resolve()) || e.cast) && (t.Promise = ct)
        }
        var L;
        L = Array.isArray ? Array.isArray : function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        };
        var N, R, U, W = L,
            z = 0,
            B = ({}.toString, function(t, r) {
                X[z] = t, X[z + 1] = r, z += 2, 2 === z && (R ? R(f) : U())
            }),
            G = "undefined" != typeof window ? window : void 0,
            H = G || {},
            J = H.MutationObserver || H.WebKitMutationObserver,
            Q = "undefined" != typeof process && "[object process]" === {}.toString.call(process),
            V = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
            X = new Array(1e3);
        U = Q ? i() : J ? s() : V ? a() : void 0 === G && "function" == typeof require ? l() : c();
        var Z = void 0,
            $ = 1,
            tt = 2,
            rt = new M,
            et = new M;
        P.prototype._validateInput = function(t) {
            return W(t)
        }, P.prototype._validationError = function() {
            return new Error("Array Methods must be provided an Array")
        }, P.prototype._init = function() {
            this._result = new Array(this.length)
        };
        var nt = P;
        P.prototype._enumerate = function() {
            for (var t = this, r = t.length, e = t.promise, n = t._input, o = 0; e._state === Z && r > o; o++) t._eachEntry(n[o], o)
        }, P.prototype._eachEntry = function(t, r) {
            var n = this,
                o = n._instanceConstructor;
            e(t) ? t.constructor === o && t._state !== Z ? (t._onerror = null, n._settledAt(t._state, r, t._result)) : n._willSettleAt(o.resolve(t), r) : (n._remaining--, n._result[r] = t)
        }, P.prototype._settledAt = function(t, r, e) {
            var n = this,
                o = n.promise;
            o._state === Z && (n._remaining--, t === tt ? E(o, e) : n._result[r] = e), 0 === n._remaining && A(o, n._result)
        }, P.prototype._willSettleAt = function(t, r) {
            var e = this;
            T(t, void 0, function(t) {
                e._settledAt($, r, t)
            }, function(t) {
                e._settledAt(tt, r, t)
            })
        };
        var ot = C,
            it = k,
            ut = Y,
            st = q,
            at = 0,
            ct = D;
        D.all = ot, D.race = it, D.resolve = ut, D.reject = st, D._setScheduler = n, D._setAsap = o, D._asap = B, D.prototype = {
            constructor: D,
            then: function(t, r) {
                var e = this,
                    n = e._state;
                if (n === $ && !t || n === tt && !r) return this;
                var o = new this.constructor(p),
                    i = e._result;
                if (n) {
                    var u = arguments[n - 1];
                    B(function() {
                        S(n, o, u, i)
                    })
                } else T(e, o, t, r);
                return o
            },
            "catch": function(t) {
                return this.then(null, t)
            }
        };
        var ft = K,
            lt = {
                Promise: ct,
                polyfill: ft
            };
        "function" == typeof define && define.amd ? define(function() {
            return lt
        }) : "undefined" != typeof module && module.exports ? module.exports = lt : "undefined" != typeof this && (this.ES6Promise = lt), ft()
    }.call(this), Array.prototype.fill || (Array.prototype.fill = function(t) {
        if (null == this) throw new TypeError("this is null or not defined");
        for (var r = Object(this), e = r.length >>> 0, n = arguments[1], o = n >> 0, i = 0 > o ? Math.max(e + o, 0) : Math.min(o, e), u = arguments[2], s = void 0 === u ? e : u >> 0, a = 0 > s ? Math.max(e + s, 0) : Math.min(s, e); a > i;) r[i] = t, i++;
        return r
    });
