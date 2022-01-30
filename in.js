var _securedTouchUtils, _securedTouchUtils, _securedTouchUtils, _securedTouchUtils;
!function(e) {
    e._securedTouchDependencies || (e._securedTouchDependencies = {}),
    window._securedTouch && console.warn("SecuredTouch script was imported multiple times")
}(window),
function(e, t) {
    "use strict";
    e.StPromiseQueue = function() {
        var e = function() {};
        function t(e, t, a) {
            this.options = a = a || {},
            this.pendingPromises = 0,
            this.maxPendingPromises = void 0 !== e ? e : 1 / 0,
            this.maxQueuedPromises = void 0 !== t ? t : 1 / 0,
            this.queue = []
        }
        return t.prototype.add = function(t) {
            var a = this;
            return new Promise(function(r, n, o) {
                a.queue.length >= a.maxQueuedPromises ? n(new Error("Queue limit reached")) : (a.queue.push({
                    promiseGenerator: t,
                    resolve: r,
                    reject: n,
                    notify: o || e
                }),
                a._dequeue())
            }
            )
        }
        ,
        t.prototype.getPendingLength = function() {
            return this.pendingPromises
        }
        ,
        t.prototype.getQueueLength = function() {
            return this.queue.length
        }
        ,
        t.prototype._dequeue = function() {
            var e = this;
            if (this.pendingPromises >= this.maxPendingPromises)
                return !1;
            var t, a = this.queue.shift();
            if (!a)
                return this.options.onEmpty && this.options.onEmpty(),
                !1;
            try {
                this.pendingPromises++,
                (t = a.promiseGenerator(),
                t && "function" == typeof t.then ? t : new Promise(function(e) {
                    e(t)
                }
                )).then(function(t) {
                    e.pendingPromises--,
                    a.resolve(t),
                    e._dequeue()
                }, function(t) {
                    e.pendingPromises--,
                    a.reject(t),
                    e._dequeue()
                }, function(e) {
                    a.notify(e)
                })
            } catch (t) {
                e.pendingPromises--,
                a.reject(t),
                e._dequeue()
            }
            return !0
        }
        ,
        t
    }()
}(window._securedTouchDependencies),
function(root) {
    "use strict";
    var ERROR = "input is invalid type"
      , NODE_JS = !1
      , ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer
      , HEX_CHARS = "0123456789abcdef".split("")
      , EXTRA = [-2147483648, 8388608, 32768, 128]
      , SHIFT = [24, 16, 8, 0]
      , K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]
      , OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"]
      , blocks = [];
    !root.JS_SHA256_NO_NODE_JS && Array.isArray || (Array.isArray = function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }
    ),
    !ARRAY_BUFFER || !root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function(e) {
        return "object" == typeof e && e.buffer && e.buffer.constructor === ArrayBuffer
    }
    );
    var createOutputMethod = function(e, t) {
        return function(a) {
            return new Sha256(t,!0).update(a)[e]()
        }
    }
      , createMethod = function(e) {
        var t = createOutputMethod("hex", e);
        NODE_JS && (t = nodeWrap(t, e)),
        t.create = function() {
            return new Sha256(e)
        }
        ,
        t.update = function(e) {
            return t.create().update(e)
        }
        ;
        for (var a = 0; a < OUTPUT_TYPES.length; ++a) {
            var r = OUTPUT_TYPES[a];
            t[r] = createOutputMethod(r, e)
        }
        return t
    }
      , nodeWrap = function(method, is224) {
        var crypto = eval("require('crypto')")
          , Buffer = eval("require('buffer').Buffer")
          , algorithm = is224 ? "sha224" : "sha256"
          , nodeMethod = function(e) {
            if ("string" == typeof e)
                return crypto.createHash(algorithm).update(e, "utf8").digest("hex");
            if (null === e || void 0 === e)
                throw new Error(ERROR);
            return e.constructor === ArrayBuffer && (e = new Uint8Array(e)),
            Array.isArray(e) || ArrayBuffer.isView(e) || e.constructor === Buffer ? crypto.createHash(algorithm).update(new Buffer(e)).digest("hex") : method(e)
        };
        return nodeMethod
    }
      , createHmacOutputMethod = function(e, t) {
        return function(a, r) {
            return new HmacSha256(a,t,!0).update(r)[e]()
        }
    }
      , createHmacMethod = function(e) {
        var t = createHmacOutputMethod("hex", e);
        t.create = function(t) {
            return new HmacSha256(t,e)
        }
        ,
        t.update = function(e, a) {
            return t.create(e).update(a)
        }
        ;
        for (var a = 0; a < OUTPUT_TYPES.length; ++a) {
            var r = OUTPUT_TYPES[a];
            t[r] = createHmacOutputMethod(r, e)
        }
        return t
    };
    function Sha256(e, t) {
        t ? (blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0,
        this.blocks = blocks) : this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        e ? (this.h0 = 3238371032,
        this.h1 = 914150663,
        this.h2 = 812702999,
        this.h3 = 4144912697,
        this.h4 = 4290775857,
        this.h5 = 1750603025,
        this.h6 = 1694076839,
        this.h7 = 3204075428) : (this.h0 = 1779033703,
        this.h1 = 3144134277,
        this.h2 = 1013904242,
        this.h3 = 2773480762,
        this.h4 = 1359893119,
        this.h5 = 2600822924,
        this.h6 = 528734635,
        this.h7 = 1541459225),
        this.block = this.start = this.bytes = this.hBytes = 0,
        this.finalized = this.hashed = !1,
        this.first = !0,
        this.is224 = e
    }
    function HmacSha256(e, t, a) {
        var r, n = typeof e;
        if ("string" === n) {
            var o, c = [], s = e.length, i = 0;
            for (r = 0; r < s; ++r)
                (o = e.charCodeAt(r)) < 128 ? c[i++] = o : o < 2048 ? (c[i++] = 192 | o >> 6,
                c[i++] = 128 | 63 & o) : o < 55296 || o >= 57344 ? (c[i++] = 224 | o >> 12,
                c[i++] = 128 | o >> 6 & 63,
                c[i++] = 128 | 63 & o) : (o = 65536 + ((1023 & o) << 10 | 1023 & e.charCodeAt(++r)),
                c[i++] = 240 | o >> 18,
                c[i++] = 128 | o >> 12 & 63,
                c[i++] = 128 | o >> 6 & 63,
                c[i++] = 128 | 63 & o);
            e = c
        } else {
            if ("object" !== n)
                throw new Error(ERROR);
            if (null === e)
                throw new Error(ERROR);
            if (ARRAY_BUFFER && e.constructor === ArrayBuffer)
                e = new Uint8Array(e);
            else if (!(Array.isArray(e) || ARRAY_BUFFER && ArrayBuffer.isView(e)))
                throw new Error(ERROR)
        }
        e.length > 64 && (e = new Sha256(t,!0).update(e).array());
        var u = []
          , d = [];
        for (r = 0; r < 64; ++r) {
            var h = e[r] || 0;
            u[r] = 92 ^ h,
            d[r] = 54 ^ h
        }
        Sha256.call(this, t, a),
        this.update(d),
        this.oKeyPad = u,
        this.inner = !0,
        this.sharedMemory = a
    }
    Sha256.prototype.update = function(e) {
        if (!this.finalized) {
            var t, a = typeof e;
            if ("string" !== a) {
                if ("object" !== a)
                    throw new Error(ERROR);
                if (null === e)
                    throw new Error(ERROR);
                if (ARRAY_BUFFER && e.constructor === ArrayBuffer)
                    e = new Uint8Array(e);
                else if (!(Array.isArray(e) || ARRAY_BUFFER && ArrayBuffer.isView(e)))
                    throw new Error(ERROR);
                t = !0
            }
            for (var r, n, o = 0, c = e.length, s = this.blocks; o < c; ) {
                if (this.hashed && (this.hashed = !1,
                s[0] = this.block,
                s[16] = s[1] = s[2] = s[3] = s[4] = s[5] = s[6] = s[7] = s[8] = s[9] = s[10] = s[11] = s[12] = s[13] = s[14] = s[15] = 0),
                t)
                    for (n = this.start; o < c && n < 64; ++o)
                        s[n >> 2] |= e[o] << SHIFT[3 & n++];
                else
                    for (n = this.start; o < c && n < 64; ++o)
                        (r = e.charCodeAt(o)) < 128 ? s[n >> 2] |= r << SHIFT[3 & n++] : r < 2048 ? (s[n >> 2] |= (192 | r >> 6) << SHIFT[3 & n++],
                        s[n >> 2] |= (128 | 63 & r) << SHIFT[3 & n++]) : r < 55296 || r >= 57344 ? (s[n >> 2] |= (224 | r >> 12) << SHIFT[3 & n++],
                        s[n >> 2] |= (128 | r >> 6 & 63) << SHIFT[3 & n++],
                        s[n >> 2] |= (128 | 63 & r) << SHIFT[3 & n++]) : (r = 65536 + ((1023 & r) << 10 | 1023 & e.charCodeAt(++o)),
                        s[n >> 2] |= (240 | r >> 18) << SHIFT[3 & n++],
                        s[n >> 2] |= (128 | r >> 12 & 63) << SHIFT[3 & n++],
                        s[n >> 2] |= (128 | r >> 6 & 63) << SHIFT[3 & n++],
                        s[n >> 2] |= (128 | 63 & r) << SHIFT[3 & n++]);
                this.lastByteIndex = n,
                this.bytes += n - this.start,
                n >= 64 ? (this.block = s[16],
                this.start = n - 64,
                this.hash(),
                this.hashed = !0) : this.start = n
            }
            return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 << 0,
            this.bytes = this.bytes % 4294967296),
            this
        }
    }
    ,
    Sha256.prototype.finalize = function() {
        if (!this.finalized) {
            this.finalized = !0;
            var e = this.blocks
              , t = this.lastByteIndex;
            e[16] = this.block,
            e[t >> 2] |= EXTRA[3 & t],
            this.block = e[16],
            t >= 56 && (this.hashed || this.hash(),
            e[0] = this.block,
            e[16] = e[1] = e[2] = e[3] = e[4] = e[5] = e[6] = e[7] = e[8] = e[9] = e[10] = e[11] = e[12] = e[13] = e[14] = e[15] = 0),
            e[14] = this.hBytes << 3 | this.bytes >>> 29,
            e[15] = this.bytes << 3,
            this.hash()
        }
    }
    ,
    Sha256.prototype.hash = function() {
        var e, t, a, r, n, o, c, s, i, u = this.h0, d = this.h1, h = this.h2, _ = this.h3, l = this.h4, T = this.h5, x = this.h6, f = this.h7, p = this.blocks;
        for (e = 16; e < 64; ++e)
            t = ((n = p[e - 15]) >>> 7 | n << 25) ^ (n >>> 18 | n << 14) ^ n >>> 3,
            a = ((n = p[e - 2]) >>> 17 | n << 15) ^ (n >>> 19 | n << 13) ^ n >>> 10,
            p[e] = p[e - 16] + t + p[e - 7] + a << 0;
        for (i = d & h,
        e = 0; e < 64; e += 4)
            this.first ? (this.is224 ? (o = 300032,
            f = (n = p[0] - 1413257819) - 150054599 << 0,
            _ = n + 24177077 << 0) : (o = 704751109,
            f = (n = p[0] - 210244248) - 1521486534 << 0,
            _ = n + 143694565 << 0),
            this.first = !1) : (t = (u >>> 2 | u << 30) ^ (u >>> 13 | u << 19) ^ (u >>> 22 | u << 10),
            r = (o = u & d) ^ u & h ^ i,
            f = _ + (n = f + (a = (l >>> 6 | l << 26) ^ (l >>> 11 | l << 21) ^ (l >>> 25 | l << 7)) + (l & T ^ ~l & x) + K[e] + p[e]) << 0,
            _ = n + (t + r) << 0),
            t = (_ >>> 2 | _ << 30) ^ (_ >>> 13 | _ << 19) ^ (_ >>> 22 | _ << 10),
            r = (c = _ & u) ^ _ & d ^ o,
            x = h + (n = x + (a = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7)) + (f & l ^ ~f & T) + K[e + 1] + p[e + 1]) << 0,
            t = ((h = n + (t + r) << 0) >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10),
            r = (s = h & _) ^ h & u ^ c,
            T = d + (n = T + (a = (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)) + (x & f ^ ~x & l) + K[e + 2] + p[e + 2]) << 0,
            t = ((d = n + (t + r) << 0) >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10),
            r = (i = d & h) ^ d & _ ^ s,
            l = u + (n = l + (a = (T >>> 6 | T << 26) ^ (T >>> 11 | T << 21) ^ (T >>> 25 | T << 7)) + (T & x ^ ~T & f) + K[e + 3] + p[e + 3]) << 0,
            u = n + (t + r) << 0;
        this.h0 = this.h0 + u << 0,
        this.h1 = this.h1 + d << 0,
        this.h2 = this.h2 + h << 0,
        this.h3 = this.h3 + _ << 0,
        this.h4 = this.h4 + l << 0,
        this.h5 = this.h5 + T << 0,
        this.h6 = this.h6 + x << 0,
        this.h7 = this.h7 + f << 0
    }
    ,
    Sha256.prototype.hex = function() {
        this.finalize();
        var e = this.h0
          , t = this.h1
          , a = this.h2
          , r = this.h3
          , n = this.h4
          , o = this.h5
          , c = this.h6
          , s = this.h7
          , i = HEX_CHARS[e >> 28 & 15] + HEX_CHARS[e >> 24 & 15] + HEX_CHARS[e >> 20 & 15] + HEX_CHARS[e >> 16 & 15] + HEX_CHARS[e >> 12 & 15] + HEX_CHARS[e >> 8 & 15] + HEX_CHARS[e >> 4 & 15] + HEX_CHARS[15 & e] + HEX_CHARS[t >> 28 & 15] + HEX_CHARS[t >> 24 & 15] + HEX_CHARS[t >> 20 & 15] + HEX_CHARS[t >> 16 & 15] + HEX_CHARS[t >> 12 & 15] + HEX_CHARS[t >> 8 & 15] + HEX_CHARS[t >> 4 & 15] + HEX_CHARS[15 & t] + HEX_CHARS[a >> 28 & 15] + HEX_CHARS[a >> 24 & 15] + HEX_CHARS[a >> 20 & 15] + HEX_CHARS[a >> 16 & 15] + HEX_CHARS[a >> 12 & 15] + HEX_CHARS[a >> 8 & 15] + HEX_CHARS[a >> 4 & 15] + HEX_CHARS[15 & a] + HEX_CHARS[r >> 28 & 15] + HEX_CHARS[r >> 24 & 15] + HEX_CHARS[r >> 20 & 15] + HEX_CHARS[r >> 16 & 15] + HEX_CHARS[r >> 12 & 15] + HEX_CHARS[r >> 8 & 15] + HEX_CHARS[r >> 4 & 15] + HEX_CHARS[15 & r] + HEX_CHARS[n >> 28 & 15] + HEX_CHARS[n >> 24 & 15] + HEX_CHARS[n >> 20 & 15] + HEX_CHARS[n >> 16 & 15] + HEX_CHARS[n >> 12 & 15] + HEX_CHARS[n >> 8 & 15] + HEX_CHARS[n >> 4 & 15] + HEX_CHARS[15 & n] + HEX_CHARS[o >> 28 & 15] + HEX_CHARS[o >> 24 & 15] + HEX_CHARS[o >> 20 & 15] + HEX_CHARS[o >> 16 & 15] + HEX_CHARS[o >> 12 & 15] + HEX_CHARS[o >> 8 & 15] + HEX_CHARS[o >> 4 & 15] + HEX_CHARS[15 & o] + HEX_CHARS[c >> 28 & 15] + HEX_CHARS[c >> 24 & 15] + HEX_CHARS[c >> 20 & 15] + HEX_CHARS[c >> 16 & 15] + HEX_CHARS[c >> 12 & 15] + HEX_CHARS[c >> 8 & 15] + HEX_CHARS[c >> 4 & 15] + HEX_CHARS[15 & c];
        return this.is224 || (i += HEX_CHARS[s >> 28 & 15] + HEX_CHARS[s >> 24 & 15] + HEX_CHARS[s >> 20 & 15] + HEX_CHARS[s >> 16 & 15] + HEX_CHARS[s >> 12 & 15] + HEX_CHARS[s >> 8 & 15] + HEX_CHARS[s >> 4 & 15] + HEX_CHARS[15 & s]),
        i
    }
    ,
    Sha256.prototype.toString = Sha256.prototype.hex,
    Sha256.prototype.digest = function() {
        this.finalize();
        var e = this.h0
          , t = this.h1
          , a = this.h2
          , r = this.h3
          , n = this.h4
          , o = this.h5
          , c = this.h6
          , s = this.h7
          , i = [e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t, a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, 255 & a, r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, 255 & r, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, 255 & n, o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, 255 & o, c >> 24 & 255, c >> 16 & 255, c >> 8 & 255, 255 & c];
        return this.is224 || i.push(s >> 24 & 255, s >> 16 & 255, s >> 8 & 255, 255 & s),
        i
    }
    ,
    Sha256.prototype.array = Sha256.prototype.digest,
    Sha256.prototype.arrayBuffer = function() {
        this.finalize();
        var e = new ArrayBuffer(this.is224 ? 28 : 32)
          , t = new DataView(e);
        return t.setUint32(0, this.h0),
        t.setUint32(4, this.h1),
        t.setUint32(8, this.h2),
        t.setUint32(12, this.h3),
        t.setUint32(16, this.h4),
        t.setUint32(20, this.h5),
        t.setUint32(24, this.h6),
        this.is224 || t.setUint32(28, this.h7),
        e
    }
    ,
    HmacSha256.prototype = new Sha256,
    HmacSha256.prototype.finalize = function() {
        if (Sha256.prototype.finalize.call(this),
        this.inner) {
            this.inner = !1;
            var e = this.array();
            Sha256.call(this, this.is224, this.sharedMemory),
            this.update(this.oKeyPad),
            this.update(e),
            Sha256.prototype.finalize.call(this)
        }
    }
    ;
    var exports = createMethod();
    exports.sha256 = exports,
    exports.sha224 = createMethod(!0),
    exports.sha256.hmac = createHmacMethod(),
    exports.sha224.hmac = createHmacMethod(!0),
    root.sha256 = exports.sha256,
    root.sha224 = exports.sha224
}(window._securedTouchDependencies),
window._securedTouchDependencies.FingerprintJS = function(e) {
    "use strict";
    function t(e, t) {
        e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]],
        t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
        var a = [0, 0, 0, 0];
        return a[3] += e[3] + t[3],
        a[2] += a[3] >>> 16,
        a[3] &= 65535,
        a[2] += e[2] + t[2],
        a[1] += a[2] >>> 16,
        a[2] &= 65535,
        a[1] += e[1] + t[1],
        a[0] += a[1] >>> 16,
        a[1] &= 65535,
        a[0] += e[0] + t[0],
        a[0] &= 65535,
        [a[0] << 16 | a[1], a[2] << 16 | a[3]]
    }
    function a(e, t) {
        e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]],
        t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
        var a = [0, 0, 0, 0];
        return a[3] += e[3] * t[3],
        a[2] += a[3] >>> 16,
        a[3] &= 65535,
        a[2] += e[2] * t[3],
        a[1] += a[2] >>> 16,
        a[2] &= 65535,
        a[2] += e[3] * t[2],
        a[1] += a[2] >>> 16,
        a[2] &= 65535,
        a[1] += e[1] * t[3],
        a[0] += a[1] >>> 16,
        a[1] &= 65535,
        a[1] += e[2] * t[2],
        a[0] += a[1] >>> 16,
        a[1] &= 65535,
        a[1] += e[3] * t[1],
        a[0] += a[1] >>> 16,
        a[1] &= 65535,
        a[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0],
        a[0] &= 65535,
        [a[0] << 16 | a[1], a[2] << 16 | a[3]]
    }
    function r(e, t) {
        return 32 == (t %= 64) ? [e[1], e[0]] : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t | e[0] >>> 32 - t] : (t -= 32,
        [e[1] << t | e[0] >>> 32 - t, e[0] << t | e[1] >>> 32 - t])
    }
    function n(e, t) {
        return 0 == (t %= 64) ? e : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t] : [e[1] << t - 32, 0]
    }
    function o(e, t) {
        return [e[0] ^ t[0], e[1] ^ t[1]]
    }
    function c(e) {
        return e = o(e = a(e = o(e = a(e = o(e, [0, e[0] >>> 1]), [4283543511, 3981806797]), [0, e[0] >>> 1]), [3301882366, 444984403]), [0, e[0] >>> 1])
    }
    function s(e, s) {
        e = e || "",
        s = s || 0;
        var i, u = e.length % 16, d = e.length - u, h = [0, s], _ = [0, s], l = [0, 0], T = [0, 0], x = [2277735313, 289559509], f = [1291169091, 658871167];
        for (i = 0; i < d; i += 16)
            l = [255 & e.charCodeAt(i + 4) | (255 & e.charCodeAt(i + 5)) << 8 | (255 & e.charCodeAt(i + 6)) << 16 | (255 & e.charCodeAt(i + 7)) << 24, 255 & e.charCodeAt(i) | (255 & e.charCodeAt(i + 1)) << 8 | (255 & e.charCodeAt(i + 2)) << 16 | (255 & e.charCodeAt(i + 3)) << 24],
            T = [255 & e.charCodeAt(i + 12) | (255 & e.charCodeAt(i + 13)) << 8 | (255 & e.charCodeAt(i + 14)) << 16 | (255 & e.charCodeAt(i + 15)) << 24, 255 & e.charCodeAt(i + 8) | (255 & e.charCodeAt(i + 9)) << 8 | (255 & e.charCodeAt(i + 10)) << 16 | (255 & e.charCodeAt(i + 11)) << 24],
            h = t(a(h = t(h = r(h = o(h, l = a(l = r(l = a(l, x), 31), f)), 27), _), [0, 5]), [0, 1390208809]),
            _ = t(a(_ = t(_ = r(_ = o(_, T = a(T = r(T = a(T, f), 33), x)), 31), h), [0, 5]), [0, 944331445]);
        switch (l = [0, 0],
        T = [0, 0],
        u) {
        case 15:
            T = o(T, n([0, e.charCodeAt(i + 14)], 48));
        case 14:
            T = o(T, n([0, e.charCodeAt(i + 13)], 40));
        case 13:
            T = o(T, n([0, e.charCodeAt(i + 12)], 32));
        case 12:
            T = o(T, n([0, e.charCodeAt(i + 11)], 24));
        case 11:
            T = o(T, n([0, e.charCodeAt(i + 10)], 16));
        case 10:
            T = o(T, n([0, e.charCodeAt(i + 9)], 8));
        case 9:
            _ = o(_, T = a(T = r(T = a(T = o(T, [0, e.charCodeAt(i + 8)]), f), 33), x));
        case 8:
            l = o(l, n([0, e.charCodeAt(i + 7)], 56));
        case 7:
            l = o(l, n([0, e.charCodeAt(i + 6)], 48));
        case 6:
            l = o(l, n([0, e.charCodeAt(i + 5)], 40));
        case 5:
            l = o(l, n([0, e.charCodeAt(i + 4)], 32));
        case 4:
            l = o(l, n([0, e.charCodeAt(i + 3)], 24));
        case 3:
            l = o(l, n([0, e.charCodeAt(i + 2)], 16));
        case 2:
            l = o(l, n([0, e.charCodeAt(i + 1)], 8));
        case 1:
            h = o(h, l = a(l = r(l = a(l = o(l, [0, e.charCodeAt(i)]), x), 31), f))
        }
        return h = o(h, [0, e.length]),
        _ = t(_ = o(_, [0, e.length]), h = t(h, _)),
        h = c(h),
        _ = t(_ = c(_), h = t(h, _)),
        ("00000000" + (h[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (_[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (_[1] >>> 0).toString(16)).slice(-8)
    }
    var i = function() {
        return (i = Object.assign || function(e) {
            for (var t, a = 1, r = arguments.length; a < r; a++)
                for (var n in t = arguments[a])
                    Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
            return e
        }
        ).apply(this, arguments)
    };
    function u(e, t, a, r) {
        return new (a || (a = Promise))(function(n, o) {
            function c(e) {
                try {
                    i(r.next(e))
                } catch (e) {
                    o(e)
                }
            }
            function s(e) {
                try {
                    i(r.throw(e))
                } catch (e) {
                    o(e)
                }
            }
            function i(e) {
                var t;
                e.done ? n(e.value) : (t = e.value,
                t instanceof a ? t : new a(function(e) {
                    e(t)
                }
                )).then(c, s)
            }
            i((r = r.apply(e, t || [])).next())
        }
        )
    }
    function d(e, t) {
        var a, r, n, o, c = {
            label: 0,
            sent: function() {
                if (1 & n[0])
                    throw n[1];
                return n[1]
            },
            trys: [],
            ops: []
        };
        return o = {
            next: s(0),
            throw: s(1),
            return: s(2)
        },
        "function" == typeof Symbol && (o[Symbol.iterator] = function() {
            return this
        }
        ),
        o;
        function s(o) {
            return function(s) {
                return function(o) {
                    if (a)
                        throw new TypeError("Generator is already executing.");
                    for (; c; )
                        try {
                            if (a = 1,
                            r && (n = 2 & o[0] ? r.return : o[0] ? r.throw || ((n = r.return) && n.call(r),
                            0) : r.next) && !(n = n.call(r, o[1])).done)
                                return n;
                            switch (r = 0,
                            n && (o = [2 & o[0], n.value]),
                            o[0]) {
                            case 0:
                            case 1:
                                n = o;
                                break;
                            case 4:
                                return c.label++,
                                {
                                    value: o[1],
                                    done: !1
                                };
                            case 5:
                                c.label++,
                                r = o[1],
                                o = [0];
                                continue;
                            case 7:
                                o = c.ops.pop(),
                                c.trys.pop();
                                continue;
                            default:
                                if (!(n = (n = c.trys).length > 0 && n[n.length - 1]) && (6 === o[0] || 2 === o[0])) {
                                    c = 0;
                                    continue
                                }
                                if (3 === o[0] && (!n || o[1] > n[0] && o[1] < n[3])) {
                                    c.label = o[1];
                                    break
                                }
                                if (6 === o[0] && c.label < n[1]) {
                                    c.label = n[1],
                                    n = o;
                                    break
                                }
                                if (n && c.label < n[2]) {
                                    c.label = n[2],
                                    c.ops.push(o);
                                    break
                                }
                                n[2] && c.ops.pop(),
                                c.trys.pop();
                                continue
                            }
                            o = t.call(e, c)
                        } catch (e) {
                            o = [6, e],
                            r = 0
                        } finally {
                            a = n = 0
                        }
                    if (5 & o[0])
                        throw o[1];
                    return {
                        value: o[0] ? o[1] : void 0,
                        done: !0
                    }
                }([o, s])
            }
        }
    }
    var h = window;
    function _(e) {
        return parseInt(e)
    }
    function l(e) {
        return parseFloat(e)
    }
    function T(e) {
        return e.reduce(function(e, t) {
            return e + (t ? 1 : 0)
        }, 0)
    }
    var x = window
      , f = navigator
      , p = document;
    function g() {
        return T(["MSCSSMatrix"in x, "msSetImmediate"in x, "msIndexedDB"in x, "msMaxTouchPoints"in f, "msPointerEnabled"in f]) >= 4
    }
    function M() {
        return T(["msWriteProfilerMark"in x, "MSStream"in x, "msLaunchUri"in f, "msSaveBlob"in f]) >= 3 && !g()
    }
    function m() {
        return T(["webkitPersistentStorage"in f, "webkitTemporaryStorage"in f, 0 === f.vendor.indexOf("Google"), "webkitResolveLocalFileSystemURL"in x, "BatteryManager"in x, "webkitMediaStream"in x, "webkitSpeechGrammar"in x]) >= 5
    }
    function b() {
        return T(["ApplePayError"in x, "CSSPrimitiveValue"in x, "Counter"in x, 0 === f.vendor.indexOf("Apple"), "getStorageUpdates"in f, "WebKitMediaKeys"in x]) >= 4
    }
    function v() {
        return T(["safari"in x, !("DeviceMotionEvent"in x), !("ongestureend"in x), !("standalone"in f)]) >= 3
    }
    var S = window
      , y = document;
    function E(e, t, a) {
        (function(e) {
            return e && "function" == typeof e.setValueAtTime
        }
        )(t) && t.setValueAtTime(a, e.currentTime)
    }
    function w(e) {
        var t = new Error(e);
        return t.name = e,
        t
    }
    var U = document
      , R = "mmMwWLliI0O&1"
      , I = ["monospace", "sans-serif", "serif"]
      , A = ["sans-serif-thin", "ARNO PRO", "Agency FB", "Arabic Typesetting", "Arial Unicode MS", "AvantGarde Bk BT", "BankGothic Md BT", "Batang", "Bitstream Vera Sans Mono", "Calibri", "Century", "Century Gothic", "Clarendon", "EUROSTILE", "Franklin Gothic", "Futura Bk BT", "Futura Md BT", "GOTHAM", "Gill Sans", "HELV", "Haettenschweiler", "Helvetica Neue", "Humanst521 BT", "Leelawadee", "Letter Gothic", "Levenim MT", "Lucida Bright", "Lucida Sans", "Menlo", "MS Mincho", "MS Outlook", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MYRIAD PRO", "Marlett", "Meiryo UI", "Microsoft Uighur", "Minion Pro", "Monotype Corsiva", "PMingLiU", "Pristina", "SCRIPTINA", "Segoe UI Light", "Serifa", "SimHei", "Small Fonts", "Staccato222 BT", "TRAJAN PRO", "Univers CE 55 Medium", "Vrinda", "ZWAdobeF"]
      , C = {
        fontStyle: "normal",
        fontWeight: "normal",
        letterSpacing: "normal",
        lineBreak: "auto",
        lineHeight: "normal",
        textTransform: "none",
        textAlign: "left",
        textDecoration: "none",
        textShadow: "none",
        whiteSpace: "normal",
        wordBreak: "normal",
        wordSpacing: "normal",
        position: "absolute",
        left: "-9999px",
        fontSize: "48px"
    }
      , V = navigator
      , L = window
      , D = navigator
      , F = window
      , P = window
      , k = window
      , O = document
      , N = {
        osCpu: function() {
            return navigator.oscpu
        },
        languages: function() {
            var e = []
              , t = D.language || D.userLanguage || D.browserLanguage || D.systemLanguage;
            if (void 0 !== t && e.push([t]),
            Array.isArray(D.languages))
                m() && T([!("MediaSettingsRange"in x), "RTCEncodedAudioFrame"in x, "" + x.Intl == "[object Intl]", "" + x.Reflect == "[object Reflect]"]) >= 3 || e.push(D.languages);
            else if ("string" == typeof D.languages) {
                var a = D.languages;
                a && e.push(a.split(","))
            }
            return e
        },
        colorDepth: function() {
            return window.screen.colorDepth
        },
        deviceMemory: function() {
            return e = l(navigator.deviceMemory),
            t = void 0,
            "number" == typeof e && isNaN(e) ? t : e;
            var e, t
        },
        screenResolution: function() {
            var e = [_(F.screen.width), _(F.screen.height)];
            return e.sort().reverse(),
            e
        },
        availableScreenResolution: function() {
            if (P.screen.availWidth && P.screen.availHeight) {
                var e = [_(P.screen.availWidth), _(P.screen.availHeight)];
                return e.sort().reverse(),
                e
            }
        },
        hardwareConcurrency: function() {
            try {
                var e = _(navigator.hardwareConcurrency);
                return isNaN(e) ? 1 : e
            } catch (e) {
                return 1
            }
        },
        timezoneOffset: function() {
            var e = (new Date).getFullYear();
            return Math.max(l(new Date(e,0,1).getTimezoneOffset()), l(new Date(e,6,1).getTimezoneOffset()))
        },
        timezone: function() {
            var e;
            if (null === (e = k.Intl) || void 0 === e ? void 0 : e.DateTimeFormat)
                return (new k.Intl.DateTimeFormat).resolvedOptions().timeZone
        },
        sessionStorage: function() {
            try {
                return !!window.sessionStorage
            } catch (e) {
                return !0
            }
        },
        localStorage: function() {
            try {
                return !!window.localStorage
            } catch (e) {
                return !0
            }
        },
        indexedDB: function() {
            if (!g() && !M())
                try {
                    return !!window.indexedDB
                } catch (e) {
                    return !0
                }
        },
        openDatabase: function() {
            return !!window.openDatabase
        },
        cpuClass: function() {
            return navigator.cpuClass
        },
        platform: function() {
            return navigator.platform
        },
        plugins: function() {
            if (g())
                return [];
            if (navigator.plugins) {
                for (var e = [], t = 0; t < navigator.plugins.length; ++t) {
                    var a = navigator.plugins[t];
                    if (a) {
                        for (var r = [], n = 0; n < a.length; ++n) {
                            var o = a[n];
                            r.push({
                                type: o.type,
                                suffixes: o.suffixes
                            })
                        }
                        e.push({
                            name: a.name,
                            description: a.description,
                            mimeTypes: r
                        })
                    }
                }
                return e
            }
        },
        canvas: function() {
            var e = function() {
                var e = document.createElement("canvas");
                return e.width = 240,
                e.height = 140,
                e.style.display = "inline",
                [e, e.getContext("2d")]
            }()
              , t = e[0]
              , a = e[1];
            if (!function(e, t) {
                return !(!t || !e.toDataURL)
            }(t, a))
                return {
                    winding: !1,
                    data: ""
                };
            a.rect(0, 0, 10, 10),
            a.rect(2, 2, 6, 6);
            var r = !a.isPointInPath(5, 5, "evenodd");
            return a.textBaseline = "alphabetic",
            a.fillStyle = "#f60",
            a.fillRect(125, 1, 62, 20),
            a.fillStyle = "#069",
            a.font = "11pt no-real-font-123",
            a.fillText("Cwm fjordbank 😃 gly", 2, 15),
            a.fillStyle = "rgba(102, 204, 0, 0.2)",
            a.font = "18pt Arial",
            a.fillText("Cwm fjordbank 😃 gly", 4, 45),
            a.globalCompositeOperation = "multiply",
            a.fillStyle = "rgb(255,0,255)",
            a.beginPath(),
            a.arc(50, 50, 50, 0, 2 * Math.PI, !0),
            a.closePath(),
            a.fill(),
            a.fillStyle = "rgb(0,255,255)",
            a.beginPath(),
            a.arc(100, 50, 50, 0, 2 * Math.PI, !0),
            a.closePath(),
            a.fill(),
            a.fillStyle = "rgb(255,255,0)",
            a.beginPath(),
            a.arc(75, 100, 50, 0, 2 * Math.PI, !0),
            a.closePath(),
            a.fill(),
            a.fillStyle = "rgb(255,0,255)",
            a.arc(75, 75, 75, 0, 2 * Math.PI, !0),
            a.arc(75, 75, 25, 0, 2 * Math.PI, !0),
            a.fill("evenodd"),
            {
                winding: r,
                data: function(e) {
                    return e.toDataURL()
                }(t)
            }
        },
        touchSupport: function() {
            var e, t = 0;
            void 0 !== V.maxTouchPoints ? t = _(V.maxTouchPoints) : void 0 !== V.msMaxTouchPoints && (t = V.msMaxTouchPoints);
            try {
                document.createEvent("TouchEvent"),
                e = !0
            } catch (t) {
                e = !1
            }
            return {
                maxTouchPoints: t,
                touchEvent: e,
                touchStart: "ontouchstart"in L
            }
        },
        fonts: function() {
            var e = U.body
              , t = U.createElement("div")
              , a = U.createElement("div")
              , r = {}
              , n = {}
              , o = function() {
                var e = U.createElement("span");
                e.textContent = R;
                for (var t = 0, a = Object.keys(C); t < a.length; t++) {
                    var r = a[t];
                    e.style[r] = C[r]
                }
                return e
            }
              , c = function(e) {
                return I.some(function(t, a) {
                    return e[a].offsetWidth !== r[t] || e[a].offsetHeight !== n[t]
                })
            }
              , s = I.map(function(e) {
                var a = o();
                return a.style.fontFamily = e,
                t.appendChild(a),
                a
            });
            e.appendChild(t);
            for (var i = 0, u = I.length; i < u; i++)
                r[I[i]] = s[i].offsetWidth,
                n[I[i]] = s[i].offsetHeight;
            var d = function() {
                for (var e = {}, t = function(t) {
                    e[t] = I.map(function(e) {
                        var r = function(e, t) {
                            var a = o();
                            return a.style.fontFamily = "'" + e + "'," + t,
                            a
                        }(t, e);
                        return a.appendChild(r),
                        r
                    })
                }, r = 0, n = A; r < n.length; r++)
                    t(n[r]);
                return e
            }();
            e.appendChild(a);
            for (var h = [], _ = 0, l = A.length; _ < l; _++)
                c(d[A[_]]) && h.push(A[_]);
            return e.removeChild(a),
            e.removeChild(t),
            h
        },
        audio: function() {
            return u(this, void 0, void 0, function() {
                var e, t, a, r, n, o;
                return d(this, function(c) {
                    switch (c.label) {
                    case 0:
                        if (!(e = S.OfflineAudioContext || S.webkitOfflineAudioContext))
                            return [2, -2];
                        if (b() && !v() && !(T(["DOMRectList"in x, "RTCPeerConnectionIceEvent"in x, "SVGGeometryElement"in x, "ontransitioncancel"in x]) >= 3))
                            return [2, -1];
                        t = new e(1,44100,44100),
                        (a = t.createOscillator()).type = "triangle",
                        E(t, a.frequency, 1e4),
                        r = t.createDynamicsCompressor(),
                        E(t, r.threshold, -50),
                        E(t, r.knee, 40),
                        E(t, r.ratio, 12),
                        E(t, r.reduction, -20),
                        E(t, r.attack, 0),
                        E(t, r.release, .25),
                        a.connect(r),
                        r.connect(t.destination),
                        a.start(0),
                        c.label = 1;
                    case 1:
                        return c.trys.push([1, 3, 4, 5]),
                        [4, function(e) {
                            return new Promise(function(t, a) {
                                e.oncomplete = function(e) {
                                    return t(e.renderedBuffer)
                                }
                                ;
                                var r = 3
                                  , n = function() {
                                    switch (e.startRendering(),
                                    e.state) {
                                    case "running":
                                        setTimeout(function() {
                                            return a(w("timeout"))
                                        }, 1e3);
                                        break;
                                    case "suspended":
                                        y.hidden || r--,
                                        r > 0 ? setTimeout(n, 500) : a(w("suspended"))
                                    }
                                };
                                n()
                            }
                            )
                        }(t)];
                    case 2:
                        return n = c.sent(),
                        [3, 5];
                    case 3:
                        if ("timeout" === (o = c.sent()).name || "suspended" === o.name)
                            return [2, -3];
                        throw o;
                    case 4:
                        return a.disconnect(),
                        r.disconnect(),
                        [7];
                    case 5:
                        return [2, function(e) {
                            for (var t = 0, a = 4500; a < 5e3; ++a)
                                t += Math.abs(e[a]);
                            return t
                        }(n.getChannelData(0))]
                    }
                })
            })
        },
        pluginsSupport: function() {
            return void 0 !== navigator.plugins
        },
        productSub: function() {
            return navigator.productSub
        },
        emptyEvalLength: function() {
            return eval.toString().length
        },
        errorFF: function() {
            try {
                throw "a"
            } catch (e) {
                try {
                    return e.toSource(),
                    !0
                } catch (e) {
                    return !1
                }
            }
        },
        vendor: function() {
            return navigator.vendor
        },
        chrome: function() {
            return void 0 !== window.chrome
        },
        cookiesEnabled: function() {
            try {
                O.cookie = "cookietest=1; SameSite=Strict;";
                var e = -1 !== O.cookie.indexOf("cookietest=");
                return O.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT",
                e
            } catch (e) {
                return !1
            }
        }
    };
    function Z(e, t, a) {
        return u(this, void 0, void 0, function() {
            var r, n, o, c, s, u, h, _, l;
            return d(this, function(d) {
                switch (d.label) {
                case 0:
                    r = Date.now(),
                    n = {},
                    o = 0,
                    c = Object.keys(e),
                    d.label = 1;
                case 1:
                    if (!(o < c.length))
                        return [3, 7];
                    if (s = c[o],
                    function(e, t) {
                        for (var a = 0, r = e.length; a < r; ++a)
                            if (e[a] === t)
                                return !0;
                        return !1
                    }(a, s))
                        return [3, 6];
                    u = void 0,
                    d.label = 2;
                case 2:
                    return d.trys.push([2, 4, , 5]),
                    l = {},
                    [4, e[s](t)];
                case 3:
                    return l.value = d.sent(),
                    u = l,
                    [3, 5];
                case 4:
                    return h = d.sent(),
                    u = h && "object" == typeof h && "message"in h ? {
                        error: h
                    } : {
                        error: {
                            message: h
                        }
                    },
                    [3, 5];
                case 5:
                    _ = Date.now(),
                    n[s] = i(i({}, u), {
                        duration: _ - r
                    }),
                    r = _,
                    d.label = 6;
                case 6:
                    return o++,
                    [3, 1];
                case 7:
                    return [2, n]
                }
            })
        })
    }
    function W(e) {
        return JSON.stringify(e, function(e, t) {
            return t instanceof Error ? i({
                name: (a = t).name,
                message: a.message,
                stack: null === (r = a.stack) || void 0 === r ? void 0 : r.split("\n")
            }, a) : t;
            var a, r
        }, 2)
    }
    function X(e) {
        return s(function(e) {
            for (var t = "", a = 0, r = Object.keys(e); a < r.length; a++) {
                var n = r[a]
                  , o = e[n]
                  , c = o.error ? "error" : JSON.stringify(o.value);
                t += (t ? "|" : "") + n.replace(/([:|\\])/g, "\\$1") + ":" + c
            }
            return t
        }(e))
    }
    var G = function() {
        function e() {}
        return e.prototype.get = function(e) {
            return void 0 === e && (e = {}),
            u(this, void 0, void 0, function() {
                var t, a;
                return d(this, function(r) {
                    switch (r.label) {
                    case 0:
                        return [4, Z(N, void 0, [])];
                    case 1:
                        return t = r.sent(),
                        a = function(e) {
                            var t;
                            return {
                                components: e,
                                get visitorId() {
                                    return void 0 === t && (t = X(this.components)),
                                    t
                                },
                                set visitorId(e) {
                                    t = e
                                }
                            }
                        }(t),
                        e.debug && console.log("Copy the text below to get the debug data:\n\n```\nversion: 3.0.5\nuserAgent: " + navigator.userAgent + "\ngetOptions: " + JSON.stringify(e, void 0, 2) + "\nvisitorId: " + a.visitorId + "\ncomponents: " + W(t) + "\n```"),
                        [2, a]
                    }
                })
            })
        }
        ,
        e
    }();
    function H(e) {
        var t = (void 0 === e ? {} : e).delayFallback
          , a = void 0 === t ? 50 : t;
        return u(this, void 0, void 0, function() {
            return d(this, function(e) {
                switch (e.label) {
                case 0:
                    return [4, (t = a,
                    r = 2 * a,
                    void 0 === r && (r = 1 / 0),
                    new Promise(function(e) {
                        h.requestIdleCallback ? h.requestIdleCallback(function() {
                            return e()
                        }, {
                            timeout: r
                        }) : setTimeout(e, Math.min(t, r))
                    }
                    ))];
                case 1:
                    return e.sent(),
                    [2, new G]
                }
                var t, r
            })
        })
    }
    var B = {
        load: H,
        hashComponents: X,
        componentsToDebugString: W
    }
      , Y = s;
    return e.componentsToDebugString = W,
    e.default = B,
    e.getComponents = Z,
    e.hashComponents = X,
    e.isChromium = m,
    e.isDesktopSafari = v,
    e.isEdgeHTML = M,
    e.isGecko = function() {
        var e;
        return T(["buildID"in f, (null === (e = p.documentElement) || void 0 === e ? void 0 : e.style) && "MozAppearance"in p.documentElement.style, "MediaRecorderErrorEvent"in x, "mozInnerScreenX"in x, "CSSMozDocumentRule"in x, "CanvasCaptureMediaStream"in x]) >= 4
    }
    ,
    e.isTrident = g,
    e.isWebKit = b,
    e.load = H,
    e.murmurX64Hash128 = Y,
    e
}({}),
function(e) {
    function t(e, a) {
        var r;
        a = a || {},
        this._id = t._generateUUID(),
        this._promise = a.promise || Promise,
        this._frameId = a.frameId || "CrossStorageClient-" + this._id,
        this._origin = t._getOrigin(e),
        this._requests = {},
        this._connected = !1,
        this._closed = !1,
        this._count = 0,
        this._timeout = a.timeout || 5e3,
        this._listener = null,
        this._installListener(),
        a.frameId && (r = document.getElementById(a.frameId)),
        r && this._poll(),
        r = r || this._createFrame(e),
        this._hub = r.contentWindow
    }
    t.frameStyle = {
        width: 0,
        height: 0,
        border: "none",
        display: "none",
        position: "absolute",
        top: "-999px",
        left: "-999px"
    },
    t._getOrigin = function(e) {
        var t;
        return (t = document.createElement("a")).href = e,
        t.host || (t = window.location),
        ((t.protocol && ":" !== t.protocol ? t.protocol : window.location.protocol) + "//" + t.host).replace(/:80$|:443$/, "")
    }
    ,
    t._generateUUID = function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
            var t = 16 * Math.random() | 0;
            return ("x" == e ? t : 3 & t | 8).toString(16)
        })
    }
    ,
    t.prototype.onConnect = function() {
        var e = this;
        return this._connected ? this._promise.resolve() : this._closed ? this._promise.reject(new Error("CrossStorageClient has closed")) : (this._requests.connect || (this._requests.connect = []),
        new this._promise(function(t, a) {
            var r = setTimeout(function() {
                a(new Error("CrossStorageClient could not connect"))
            }, e._timeout);
            e._requests.connect.push(function(e) {
                if (clearTimeout(r),
                e)
                    return a(e);
                t()
            })
        }
        ))
    }
    ,
    t.prototype.set = function(e, t) {
        return this._request("set", {
            key: e,
            value: t
        })
    }
    ,
    t.prototype.get = function(e) {
        var t = Array.prototype.slice.call(arguments);
        return this._request("get", {
            keys: t
        })
    }
    ,
    t.prototype.del = function() {
        var e = Array.prototype.slice.call(arguments);
        return this._request("del", {
            keys: e
        })
    }
    ,
    t.prototype.clear = function() {
        return this._request("clear")
    }
    ,
    t.prototype.getKeys = function() {
        return this._request("getKeys")
    }
    ,
    t.prototype.close = function() {
        var e = document.getElementById(this._frameId);
        e && e.parentNode.removeChild(e),
        window.removeEventListener ? window.removeEventListener("message", this._listener, !1) : window.detachEvent("onmessage", this._listener),
        this._connected = !1,
        this._closed = !0
    }
    ,
    t.prototype._installListener = function() {
        var e = this;
        this._listener = function(t) {
            var a, r, n;
            if (!e._closed && t.data && "string" == typeof t.data && ("null" === t.origin ? "file://" : t.origin) === e._origin)
                if ("cross-storage:unavailable" !== t.data) {
                    if (-1 !== t.data.indexOf("cross-storage:") && !e._connected) {
                        if (e._connected = !0,
                        !e._requests.connect)
                            return;
                        for (a = 0; a < e._requests.connect.length; a++)
                            e._requests.connect[a](r);
                        delete e._requests.connect
                    }
                    if ("cross-storage:ready" !== t.data) {
                        try {
                            n = JSON.parse(t.data)
                        } catch (e) {
                            return
                        }
                        n.id && e._requests[n.id] && e._requests[n.id](n.error, n.result)
                    }
                } else {
                    if (e._closed || e.close(),
                    !e._requests.connect)
                        return;
                    for (r = new Error("Closing client. Could not access localStorage in hub."),
                    a = 0; a < e._requests.connect.length; a++)
                        e._requests.connect[a](r)
                }
        }
        ,
        window.addEventListener ? window.addEventListener("message", this._listener, !1) : window.attachEvent("onmessage", this._listener)
    }
    ,
    t.prototype._poll = function() {
        var e, t, a;
        a = "file://" === (e = this)._origin ? "*" : e._origin,
        t = setInterval(function() {
            if (e._connected)
                return clearInterval(t);
            e._hub && e._hub.postMessage("cross-storage:poll", a)
        }, 1e3)
    }
    ,
    t.prototype._createFrame = function(e) {
        var a, r;
        for (r in (a = window.document.createElement("iframe")).id = this._frameId,
        t.frameStyle)
            t.frameStyle.hasOwnProperty(r) && (a.style[r] = t.frameStyle[r]);
        return window.document.body.appendChild(a),
        a.src = e,
        a
    }
    ,
    t.prototype._request = function(e, t) {
        var a, r;
        return this._closed ? this._promise.reject(new Error("CrossStorageClient has closed")) : ((r = this)._count++,
        a = {
            id: this._id + ":" + r._count,
            method: "cross-storage:" + e,
            params: t
        },
        new this._promise(function(e, t) {
            var n, o, c;
            n = setTimeout(function() {
                r._requests[a.id] && (delete r._requests[a.id],
                t(new Error("Timeout: could not perform " + a.method)))
            }, r._timeout),
            r._requests[a.id] = function(o, c) {
                if (clearTimeout(n),
                delete r._requests[a.id],
                o)
                    return t(new Error(o));
                e(c)
            }
            ,
            Array.prototype.toJSON && (o = Array.prototype.toJSON,
            Array.prototype.toJSON = null),
            c = "file://" === r._origin ? "*" : r._origin,
            r._hub.postMessage(JSON.stringify(a), c),
            o && (Array.prototype.toJSON = o)
        }
        ))
    }
    ,
    e.CrossStorageClient = t
}(window._securedTouchDependencies),
function(e, t) {
    "use strict";
    "function" != typeof e.CustomEvent && (e.CustomEvent = function() {
        return function(e, t) {
            t = t || {
                bubbles: !1,
                cancelable: !1,
                detail: null
            };
            var a = document.createEvent("CustomEvent");
            return a.initCustomEvent(e, t.bubbles, t.cancelable, t.detail),
            a
        }
    }())
}(window),
function() {
    "use strict";
    "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
        value: function(e, t) {
            if (null === e || void 0 === e)
                throw new TypeError("Cannot convert undefined or null to object");
            for (var a = Object(e), r = 1; r < arguments.length; r++) {
                var n = arguments[r];
                if (null !== n && void 0 !== n)
                    for (var o in n)
                        Object.prototype.hasOwnProperty.call(n, o) && (a[o] = n[o])
            }
            return a
        },
        writable: !0,
        configurable: !0
    })
}(),
function(e) {
    var t = e.history;
    if (t) {
        var a = t.pushState;
        a && (t.pushState = function(r) {
            "function" == typeof t.onpushstate && t.onpushstate({
                state: r
            });
            var n = a.apply(t, arguments);
            return e.dispatchEvent(new CustomEvent("_onlocationchange")),
            n
        }
        )
    }
}(window),
Array.from || (Array.from = function() {
    var e = Object.prototype.toString
      , t = function(t) {
        return "function" == typeof t || "[object Function]" === e.call(t)
    }
      , a = Math.pow(2, 53) - 1
      , r = function(e) {
        var t = function(e) {
            var t = Number(e);
            return isNaN(t) ? 0 : 0 !== t && isFinite(t) ? (t > 0 ? 1 : -1) * Math.floor(Math.abs(t)) : t
        }(e);
        return Math.min(Math.max(t, 0), a)
    };
    return function(e) {
        var a = Object(e);
        if (null == e)
            throw new TypeError("Array.from requires an array-like object - not null or undefined");
        var n, o = arguments.length > 1 ? arguments[1] : void 0;
        if (void 0 !== o) {
            if (!t(o))
                throw new TypeError("Array.from: when provided, the second argument must be a function");
            arguments.length > 2 && (n = arguments[2])
        }
        for (var c, s = r(a.length), i = t(this) ? Object(new this(s)) : new Array(s), u = 0; u < s; )
            c = a[u],
            i[u] = o ? void 0 === n ? o(c, u) : o.call(n, c, u) : c,
            u += 1;
        return i.length = s,
        i
    }
}()),
function(e) {
    "use strict";
    function t(e) {
        var t = this.constructor;
        return this.then(function(a) {
            return t.resolve(e()).then(function() {
                return a
            })
        }, function(a) {
            return t.resolve(e()).then(function() {
                return t.reject(a)
            })
        })
    }
    var a = setTimeout;
    function r(e) {
        return Boolean(e && void 0 !== e.length)
    }
    function n() {}
    function o(e) {
        if (!(this instanceof o))
            throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof e)
            throw new TypeError("not a function");
        this._state = 0,
        this._handled = !1,
        this._value = void 0,
        this._deferreds = [],
        d(e, this)
    }
    function c(e, t) {
        for (; 3 === e._state; )
            e = e._value;
        0 !== e._state ? (e._handled = !0,
        o._immediateFn(function() {
            var a = 1 === e._state ? t.onFulfilled : t.onRejected;
            if (null !== a) {
                var r;
                try {
                    r = a(e._value)
                } catch (e) {
                    return void i(t.promise, e)
                }
                s(t.promise, r)
            } else
                (1 === e._state ? s : i)(t.promise, e._value)
        })) : e._deferreds.push(t)
    }
    function s(e, t) {
        try {
            if (t === e)
                throw new TypeError("A promise cannot be resolved with itself.");
            if (t && ("object" == typeof t || "function" == typeof t)) {
                var a = t.then;
                if (t instanceof o)
                    return e._state = 3,
                    e._value = t,
                    void u(e);
                if ("function" == typeof a)
                    return void d((r = a,
                    n = t,
                    function() {
                        r.apply(n, arguments)
                    }
                    ), e)
            }
            e._state = 1,
            e._value = t,
            u(e)
        } catch (t) {
            i(e, t)
        }
        var r, n
    }
    function i(e, t) {
        e._state = 2,
        e._value = t,
        u(e)
    }
    function u(e) {
        2 === e._state && 0 === e._deferreds.length && o._immediateFn(function() {
            e._handled || o._unhandledRejectionFn(e._value)
        });
        for (var t = 0, a = e._deferreds.length; t < a; t++)
            c(e, e._deferreds[t]);
        e._deferreds = null
    }
    function d(e, t) {
        var a = !1;
        try {
            e(function(e) {
                a || (a = !0,
                s(t, e))
            }, function(e) {
                a || (a = !0,
                i(t, e))
            })
        } catch (e) {
            if (a)
                return;
            a = !0,
            i(t, e)
        }
    }
    o.prototype.catch = function(e) {
        return this.then(null, e)
    }
    ,
    o.prototype.then = function(e, t) {
        var a = new this.constructor(n);
        return c(this, new function(e, t, a) {
            this.onFulfilled = "function" == typeof e ? e : null,
            this.onRejected = "function" == typeof t ? t : null,
            this.promise = a
        }
        (e,t,a)),
        a
    }
    ,
    o.prototype.finally = t,
    o.all = function(e) {
        return new o(function(t, a) {
            if (!r(e))
                return a(new TypeError("Promise.all accepts an array"));
            var n = Array.prototype.slice.call(e);
            if (0 === n.length)
                return t([]);
            var o = n.length;
            function c(e, r) {
                try {
                    if (r && ("object" == typeof r || "function" == typeof r)) {
                        var s = r.then;
                        if ("function" == typeof s)
                            return void s.call(r, function(t) {
                                c(e, t)
                            }, a)
                    }
                    n[e] = r,
                    0 == --o && t(n)
                } catch (e) {
                    a(e)
                }
            }
            for (var s = 0; s < n.length; s++)
                c(s, n[s])
        }
        )
    }
    ,
    o.resolve = function(e) {
        return e && "object" == typeof e && e.constructor === o ? e : new o(function(t) {
            t(e)
        }
        )
    }
    ,
    o.reject = function(e) {
        return new o(function(t, a) {
            a(e)
        }
        )
    }
    ,
    o.race = function(e) {
        return new o(function(t, a) {
            if (!r(e))
                return a(new TypeError("Promise.race accepts an array"));
            for (var n = 0, c = e.length; n < c; n++)
                o.resolve(e[n]).then(t, a)
        }
        )
    }
    ,
    o._immediateFn = "function" == typeof setImmediate && function(e) {
        setImmediate(e)
    }
    || function(e) {
        a(e, 0)
    }
    ,
    o._unhandledRejectionFn = function(e) {
        "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", e)
    }
    ,
    "function" != typeof e.Promise ? e.Promise = o : e.Promise.prototype.finally || (e.Promise.prototype.finally = t)
}(window),
function(e, t) {
    "use strict";
    var a = "model"
      , r = "name"
      , n = "type"
      , o = "vendor"
      , c = "version"
      , s = "mobile"
      , i = "tablet"
      , u = "smarttv"
      , d = {
        extend: function(e, t) {
            var a = {};
            for (var r in e)
                t[r] && t[r].length % 2 == 0 ? a[r] = t[r].concat(e[r]) : a[r] = e[r];
            return a
        },
        has: function(e, t) {
            return "string" == typeof e && -1 !== t.toLowerCase().indexOf(e.toLowerCase())
        },
        lowerize: function(e) {
            return e.toLowerCase()
        },
        major: function(e) {
            return "string" == typeof e ? e.replace(/[^\d\.]/g, "").split(".")[0] : void 0
        },
        trim: function(e) {
            return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
        }
    }
      , h = {
        rgx: function(e, t) {
            for (var a, r, n, o, c, s, i = 0; i < t.length && !c; ) {
                var u = t[i]
                  , d = t[i + 1];
                for (a = r = 0; a < u.length && !c; )
                    if (c = u[a++].exec(e))
                        for (n = 0; n < d.length; n++)
                            s = c[++r],
                            "object" == typeof (o = d[n]) && o.length > 0 ? 2 == o.length ? "function" == typeof o[1] ? this[o[0]] = o[1].call(this, s) : this[o[0]] = o[1] : 3 == o.length ? "function" != typeof o[1] || o[1].exec && o[1].test ? this[o[0]] = s ? s.replace(o[1], o[2]) : void 0 : this[o[0]] = s ? o[1].call(this, s, o[2]) : void 0 : 4 == o.length && (this[o[0]] = s ? o[3].call(this, s.replace(o[1], o[2])) : void 0) : this[o] = s || void 0;
                i += 2
            }
        },
        str: function(e, t) {
            for (var a in t)
                if ("object" == typeof t[a] && t[a].length > 0) {
                    for (var r = 0; r < t[a].length; r++)
                        if (d.has(t[a][r], e))
                            return "?" === a ? void 0 : a
                } else if (d.has(t[a], e))
                    return "?" === a ? void 0 : a;
            return e
        }
    }
      , _ = {
        browser: {
            oldsafari: {
                version: {
                    "1.0": "/8",
                    1.2: "/1",
                    1.3: "/3",
                    "2.0": "/412",
                    "2.0.2": "/416",
                    "2.0.3": "/417",
                    "2.0.4": "/419",
                    "?": "/"
                }
            }
        },
        device: {
            amazon: {
                model: {
                    "Fire Phone": ["SD", "KF"]
                }
            },
            sprint: {
                model: {
                    "Evo Shift 4G": "7373KT"
                },
                vendor: {
                    HTC: "APA",
                    Sprint: "Sprint"
                }
            }
        },
        os: {
            windows: {
                version: {
                    ME: "4.90",
                    "NT 3.11": "NT3.51",
                    "NT 4.0": "NT4.0",
                    2000: "NT 5.0",
                    XP: ["NT 5.1", "NT 5.2"],
                    Vista: "NT 6.0",
                    7: "NT 6.1",
                    8: "NT 6.2",
                    8.1: "NT 6.3",
                    10: ["NT 6.4", "NT 10.0"],
                    RT: "ARM"
                }
            }
        }
    }
      , l = {
        browser: [[/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i], [r, c], [/(opios)[\/\s]+([\w\.]+)/i], [[r, "Opera Mini"], c], [/\s(opr)\/([\w\.]+)/i], [[r, "Opera"], c], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i, /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i, /(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]*)/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i], [r, c], [/(konqueror)\/([\w\.]+)/i], [[r, "Konqueror"], c], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i], [[r, "IE"], c], [/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i], [[r, "Edge"], c], [/(yabrowser)\/([\w\.]+)/i], [[r, "Yandex"], c], [/(Avast)\/([\w\.]+)/i], [[r, "Avast Secure Browser"], c], [/(AVG)\/([\w\.]+)/i], [[r, "AVG Secure Browser"], c], [/(puffin)\/([\w\.]+)/i], [[r, "Puffin"], c], [/(focus)\/([\w\.]+)/i], [[r, "Firefox Focus"], c], [/(opt)\/([\w\.]+)/i], [[r, "Opera Touch"], c], [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i], [[r, "UCBrowser"], c], [/(comodo_dragon)\/([\w\.]+)/i], [[r, /_/g, " "], c], [/(windowswechat qbcore)\/([\w\.]+)/i], [[r, "WeChat(Win) Desktop"], c], [/(micromessenger)\/([\w\.]+)/i], [[r, "WeChat"], c], [/(brave)\/([\w\.]+)/i], [[r, "Brave"], c], [/(qqbrowserlite)\/([\w\.]+)/i], [r, c], [/(QQ)\/([\d\.]+)/i], [r, c], [/m?(qqbrowser)[\/\s]?([\w\.]+)/i], [r, c], [/(baiduboxapp)[\/\s]?([\w\.]+)/i], [r, c], [/(2345Explorer)[\/\s]?([\w\.]+)/i], [r, c], [/(MetaSr)[\/\s]?([\w\.]+)/i], [r], [/(LBBROWSER)/i], [r], [/xiaomi\/miuibrowser\/([\w\.]+)/i], [c, [r, "MIUI Browser"]], [/;fbav\/([\w\.]+);/i], [c, [r, "Facebook"]], [/safari\s(line)\/([\w\.]+)/i, /android.+(line)\/([\w\.]+)\/iab/i], [r, c], [/headlesschrome(?:\/([\w\.]+)|\s)/i], [c, [r, "Chrome Headless"]], [/\swv\).+(chrome)\/([\w\.]+)/i], [[r, /(.+)/, "$1 WebView"], c], [/((?:oculus|samsung)browser)\/([\w\.]+)/i], [[r, /(.+(?:g|us))(.+)/, "$1 $2"], c], [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i], [c, [r, "Android Browser"]], [/(sailfishbrowser)\/([\w\.]+)/i], [[r, "Sailfish Browser"], c], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i], [r, c], [/(dolfin)\/([\w\.]+)/i], [[r, "Dolphin"], c], [/(qihu|qhbrowser|qihoobrowser|360browser)/i], [[r, "360 Browser"]], [/((?:android.+)crmo|crios)\/([\w\.]+)/i], [[r, "Chrome"], c], [/(coast)\/([\w\.]+)/i], [[r, "Opera Coast"], c], [/fxios\/([\w\.-]+)/i], [c, [r, "Firefox"]], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i], [c, [r, "Mobile Safari"]], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i], [c, r], [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [[r, "GSA"], c], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i], [r, [c, h.str, _.browser.oldsafari.version]], [/(webkit|khtml)\/([\w\.]+)/i], [r, c], [/(navigator|netscape)\/([\w\.-]+)/i], [[r, "Netscape"], c], [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i, /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]*)/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i], [r, c]],
        cpu: [[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i], [["architecture", "amd64"]], [/(ia32(?=;))/i], [["architecture", d.lowerize]], [/((?:i[346]|x)86)[;\)]/i], [["architecture", "ia32"]], [/windows\s(ce|mobile);\sppc;/i], [["architecture", "arm"]], [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i], [["architecture", /ower/, "", d.lowerize]], [/(sun4\w)[;\)]/i], [["architecture", "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i], [["architecture", d.lowerize]]],
        device: [[/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i], [a, o, [n, i]], [/applecoremedia\/[\w\.]+ \((ipad)/], [a, [o, "Apple"], [n, i]], [/(apple\s{0,1}tv)/i], [[a, "Apple TV"], [o, "Apple"], [n, u]], [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(hp).+(tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i], [o, a, [n, i]], [/(kf[A-z]+)\sbuild\/.+silk\//i], [a, [o, "Amazon"], [n, i]], [/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i], [[a, h.str, _.device.amazon.model], [o, "Amazon"], [n, s]], [/android.+aft([bms])\sbuild/i], [a, [o, "Amazon"], [n, u]], [/\((ip[honed|\s\w*]+);.+(apple)/i], [a, o, [n, s]], [/\((ip[honed|\s\w*]+);/i], [a, [o, "Apple"], [n, s]], [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i], [o, a, [n, s]], [/\(bb10;\s(\w+)/i], [a, [o, "BlackBerry"], [n, s]], [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i], [a, [o, "Asus"], [n, i]], [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i], [[o, "Sony"], [a, "Xperia Tablet"], [n, i]], [/android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [a, [o, "Sony"], [n, s]], [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i], [o, a, [n, "console"]], [/android.+;\s(shield)\sbuild/i], [a, [o, "Nvidia"], [n, "console"]], [/(playstation\s[34portablevi]+)/i], [a, [o, "Sony"], [n, "console"]], [/(sprint\s(\w+))/i], [[o, h.str, _.device.sprint.vendor], [a, h.str, _.device.sprint.model], [n, s]], [/(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i, /(zte)-(\w*)/i, /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i], [o, [a, /_/g, " "], [n, s]], [/(nexus\s9)/i], [a, [o, "HTC"], [n, i]], [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p|vog-l29|ane-lx1|eml-l29)/i], [a, [o, "Huawei"], [n, s]], [/android.+(bah2?-a?[lw]\d{2})/i], [a, [o, "Huawei"], [n, i]], [/(microsoft);\s(lumia[\s\w]+)/i], [o, a, [n, s]], [/[\s\(;](xbox(?:\sone)?)[\s\);]/i], [a, [o, "Microsoft"], [n, "console"]], [/(kin\.[onetw]{3})/i], [[a, /\./g, " "], [o, "Microsoft"], [n, s]], [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w*)/i, /(XT\d{3,4}) build\//i, /(nexus\s6)/i], [a, [o, "Motorola"], [n, s]], [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i], [a, [o, "Motorola"], [n, i]], [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i], [[o, d.trim], [a, d.trim], [n, u]], [/hbbtv.+maple;(\d+)/i], [[a, /^/, "SmartTV"], [o, "Samsung"], [n, u]], [/\(dtv[\);].+(aquos)/i], [a, [o, "Sharp"], [n, u]], [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i], [[o, "Samsung"], a, [n, i]], [/smart-tv.+(samsung)/i], [o, [n, u], a], [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i, /sec-((sgh\w+))/i], [[o, "Samsung"], a, [n, s]], [/sie-(\w*)/i], [a, [o, "Siemens"], [n, s]], [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]*)/i], [[o, "Nokia"], a, [n, s]], [/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i], [a, [o, "Acer"], [n, i]], [/android.+([vl]k\-?\d{3})\s+build/i], [a, [o, "LG"], [n, i]], [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i], [[o, "LG"], a, [n, i]], [/(lg) netcast\.tv/i], [o, a, [n, u]], [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w*)/i, /android.+lg(\-?[\d\w]+)\s+build/i], [a, [o, "LG"], [n, s]], [/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i], [o, a, [n, i]], [/android.+(ideatab[a-z0-9\-\s]+)/i], [a, [o, "Lenovo"], [n, i]], [/(lenovo)[_\s-]?([\w-]+)/i], [o, a, [n, s]], [/linux;.+((jolla));/i], [o, a, [n, s]], [/((pebble))app\/[\d\.]+\s/i], [o, a, [n, "wearable"]], [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i], [o, a, [n, s]], [/crkey/i], [[a, "Chromecast"], [o, "Google"], [n, u]], [/android.+;\s(glass)\s\d/i], [a, [o, "Google"], [n, "wearable"]], [/android.+;\s(pixel c)[\s)]/i], [a, [o, "Google"], [n, i]], [/android.+;\s(pixel( [23])?( xl)?)[\s)]/i], [a, [o, "Google"], [n, s]], [/android.+;\s(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i, /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i], [[a, /_/g, " "], [o, "Xiaomi"], [n, s]], [/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i], [[a, /_/g, " "], [o, "Xiaomi"], [n, i]], [/android.+;\s(m[1-5]\snote)\sbuild/i], [a, [o, "Meizu"], [n, s]], [/(mz)-([\w-]{2,})/i], [[o, "Meizu"], a, [n, s]], [/android.+a000(1)\s+build/i, /android.+oneplus\s(a\d{4})[\s)]/i], [a, [o, "OnePlus"], [n, s]], [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i], [a, [o, "RCA"], [n, i]], [/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i], [a, [o, "Dell"], [n, i]], [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i], [a, [o, "Verizon"], [n, i]], [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i], [[o, "Barnes & Noble"], a, [n, i]], [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i], [a, [o, "NuVision"], [n, i]], [/android.+;\s(k88)\sbuild/i], [a, [o, "ZTE"], [n, i]], [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i], [a, [o, "Swiss"], [n, s]], [/android.+[;\/]\s*(zur\d{3})\s+build/i], [a, [o, "Swiss"], [n, i]], [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i], [a, [o, "Zeki"], [n, i]], [/(android).+[;\/]\s+([YR]\d{2})\s+build/i, /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i], [[o, "Dragon Touch"], a, [n, i]], [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i], [a, [o, "Insignia"], [n, i]], [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i], [a, [o, "NextBook"], [n, i]], [/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i], [[o, "Voice"], a, [n, s]], [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i], [[o, "LvTel"], a, [n, s]], [/android.+;\s(PH-1)\s/i], [a, [o, "Essential"], [n, s]], [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i], [a, [o, "Envizen"], [n, i]], [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i], [o, a, [n, i]], [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i], [a, [o, "MachSpeed"], [n, i]], [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i], [o, a, [n, i]], [/android.+[;\/]\s*TU_(1491)\s+build/i], [a, [o, "Rotor"], [n, i]], [/android.+(KS(.+))\s+build/i], [a, [o, "Amazon"], [n, i]], [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i], [o, a, [n, i]], [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i], [[n, d.lowerize], o, a], [/[\s\/\(](smart-?tv)[;\)]/i], [[n, u]], [/(android[\w\.\s\-]{0,9});.+build/i], [a, [o, "Generic"]]],
        engine: [[/windows.+\sedge\/([\w\.]+)/i], [c, [r, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [c, [r, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i], [r, c], [/rv\:([\w\.]{1,9}).+(gecko)/i], [c, r]],
        os: [[/microsoft\s(windows)\s(vista|xp)/i], [r, c], [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [r, [c, h.str, _.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[r, "Windows"], [c, h.str, _.os.windows.version]], [/\((bb)(10);/i], [[r, "BlackBerry"], c], [/(blackberry)\w*\/?([\w\.]*)/i, /(tizen|kaios)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i], [r, c], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i], [[r, "Symbian"], c], [/\((series40);/i], [r], [/mozilla.+\(mobile;.+gecko.+firefox/i], [[r, "Firefox OS"], c], [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w*)/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i, /(hurd|linux)\s?([\w\.]*)/i, /(gnu)\s?([\w\.]*)/i], [r, c], [/(cros)\s[\w]+\s([\w\.]+\w)/i], [[r, "Chromium OS"], c], [/(sunos)\s?([\w\.\d]*)/i], [[r, "Solaris"], c], [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i], [r, c], [/(haiku)\s(\w+)/i], [r, c], [/cfnetwork\/.+darwin/i, /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i], [[c, /_/g, "."], [r, "iOS"]], [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i], [[r, "Mac OS"], [c, /_/g, "."]], [/((?:open)?solaris)[\/\s-]?([\w\.]*)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i, /(unix)\s?([\w\.]*)/i], [r, c]]
    }
      , T = function(t, a) {
        if ("object" == typeof t && (a = t,
        t = void 0),
        !(this instanceof T))
            return new T(t,a).getResult();
        var r = t || (e && e.navigator && e.navigator.userAgent ? e.navigator.userAgent : "")
          , n = a ? d.extend(l, a) : l;
        return this.getBrowser = function() {
            var e = {
                name: void 0,
                version: void 0
            };
            return h.rgx.call(e, r, n.browser),
            e.major = d.major(e.version),
            e
        }
        ,
        this.getCPU = function() {
            var e = {
                architecture: void 0
            };
            return h.rgx.call(e, r, n.cpu),
            e
        }
        ,
        this.getDevice = function() {
            var e = {
                vendor: void 0,
                model: void 0,
                type: void 0
            };
            return h.rgx.call(e, r, n.device),
            e
        }
        ,
        this.getEngine = function() {
            var e = {
                name: void 0,
                version: void 0
            };
            return h.rgx.call(e, r, n.engine),
            e
        }
        ,
        this.getOS = function() {
            var e = {
                name: void 0,
                version: void 0
            };
            return h.rgx.call(e, r, n.os),
            e
        }
        ,
        this.getResult = function() {
            return {
                ua: this.getUA(),
                browser: this.getBrowser(),
                engine: this.getEngine(),
                os: this.getOS(),
                device: this.getDevice(),
                cpu: this.getCPU()
            }
        }
        ,
        this.getUA = function() {
            return r
        }
        ,
        this.setUA = function(e) {
            return r = e,
            this
        }
        ,
        this
    };
    T.VERSION = "0.7.21",
    T.BROWSER = {
        NAME: r,
        MAJOR: "major",
        VERSION: c
    },
    T.CPU = {
        ARCHITECTURE: "architecture"
    },
    T.DEVICE = {
        MODEL: a,
        VENDOR: o,
        TYPE: n,
        CONSOLE: "console",
        MOBILE: s,
        SMARTTV: u,
        TABLET: i,
        WEARABLE: "wearable",
        EMBEDDED: "embedded"
    },
    T.ENGINE = {
        NAME: r,
        VERSION: c
    },
    T.OS = {
        NAME: r,
        VERSION: c
    },
    e._securedTouchDependencies.UAParser = T
}(window),
window._securedTouchDependencies.pako = function e(t, a, r) {
    function n(c, s) {
        if (!a[c]) {
            if (!t[c]) {
                var i = "function" == typeof require && require;
                if (!s && i)
                    return i(c, !0);
                if (o)
                    return o(c, !0);
                var u = new Error("Cannot find module '" + c + "'");
                throw u.code = "MODULE_NOT_FOUND",
                u
            }
            var d = a[c] = {
                exports: {}
            };
            t[c][0].call(d.exports, function(e) {
                var a = t[c][1][e];
                return n(a || e)
            }, d, d.exports, e, t, a, r)
        }
        return a[c].exports
    }
    for (var o = "function" == typeof require && require, c = 0; c < r.length; c++)
        n(r[c]);
    return n
}({
    1: [function(e, t, a) {
        "use strict";
        function r(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
        a.assign = function(e) {
            for (var t = Array.prototype.slice.call(arguments, 1); t.length; ) {
                var a = t.shift();
                if (a) {
                    if ("object" != typeof a)
                        throw new TypeError(a + "must be non-object");
                    for (var n in a)
                        r(a, n) && (e[n] = a[n])
                }
            }
            return e
        }
        ,
        a.shrinkBuf = function(e, t) {
            return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t,
            e)
        }
        ;
        var o = {
            arraySet: function(e, t, a, r, n) {
                if (t.subarray && e.subarray)
                    e.set(t.subarray(a, a + r), n);
                else
                    for (var o = 0; o < r; o++)
                        e[n + o] = t[a + o]
            },
            flattenChunks: function(e) {
                var t, a, r, n, o, c;
                for (r = 0,
                t = 0,
                a = e.length; t < a; t++)
                    r += e[t].length;
                for (c = new Uint8Array(r),
                n = 0,
                t = 0,
                a = e.length; t < a; t++)
                    o = e[t],
                    c.set(o, n),
                    n += o.length;
                return c
            }
        }
          , c = {
            arraySet: function(e, t, a, r, n) {
                for (var o = 0; o < r; o++)
                    e[n + o] = t[a + o]
            },
            flattenChunks: function(e) {
                return [].concat.apply([], e)
            }
        };
        a.setTyped = function(e) {
            e ? (a.Buf8 = Uint8Array,
            a.Buf16 = Uint16Array,
            a.Buf32 = Int32Array,
            a.assign(a, o)) : (a.Buf8 = Array,
            a.Buf16 = Array,
            a.Buf32 = Array,
            a.assign(a, c))
        }
        ,
        a.setTyped(n)
    }
    , {}],
    2: [function(e, t, a) {
        "use strict";
        function r(e, t) {
            if (t < 65537 && (e.subarray && c || !e.subarray && o))
                return String.fromCharCode.apply(null, n.shrinkBuf(e, t));
            for (var a = "", r = 0; r < t; r++)
                a += String.fromCharCode(e[r]);
            return a
        }
        var n = e("./common")
          , o = !0
          , c = !0;
        try {
            String.fromCharCode.apply(null, [0])
        } catch (e) {
            o = !1
        }
        try {
            String.fromCharCode.apply(null, new Uint8Array(1))
        } catch (e) {
            c = !1
        }
        for (var s = new n.Buf8(256), i = 0; i < 256; i++)
            s[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
        s[254] = s[254] = 1,
        a.string2buf = function(e) {
            var t, a, r, o, c, s = e.length, i = 0;
            for (o = 0; o < s; o++)
                55296 == (64512 & (a = e.charCodeAt(o))) && o + 1 < s && 56320 == (64512 & (r = e.charCodeAt(o + 1))) && (a = 65536 + (a - 55296 << 10) + (r - 56320),
                o++),
                i += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
            for (t = new n.Buf8(i),
            c = 0,
            o = 0; c < i; o++)
                55296 == (64512 & (a = e.charCodeAt(o))) && o + 1 < s && 56320 == (64512 & (r = e.charCodeAt(o + 1))) && (a = 65536 + (a - 55296 << 10) + (r - 56320),
                o++),
                a < 128 ? t[c++] = a : a < 2048 ? (t[c++] = 192 | a >>> 6,
                t[c++] = 128 | 63 & a) : a < 65536 ? (t[c++] = 224 | a >>> 12,
                t[c++] = 128 | a >>> 6 & 63,
                t[c++] = 128 | 63 & a) : (t[c++] = 240 | a >>> 18,
                t[c++] = 128 | a >>> 12 & 63,
                t[c++] = 128 | a >>> 6 & 63,
                t[c++] = 128 | 63 & a);
            return t
        }
        ,
        a.buf2binstring = function(e) {
            return r(e, e.length)
        }
        ,
        a.binstring2buf = function(e) {
            for (var t = new n.Buf8(e.length), a = 0, r = t.length; a < r; a++)
                t[a] = e.charCodeAt(a);
            return t
        }
        ,
        a.buf2string = function(e, t) {
            var a, n, o, c, i = t || e.length, u = new Array(2 * i);
            for (n = 0,
            a = 0; a < i; )
                if ((o = e[a++]) < 128)
                    u[n++] = o;
                else if ((c = s[o]) > 4)
                    u[n++] = 65533,
                    a += c - 1;
                else {
                    for (o &= 2 === c ? 31 : 3 === c ? 15 : 7; c > 1 && a < i; )
                        o = o << 6 | 63 & e[a++],
                        c--;
                    c > 1 ? u[n++] = 65533 : o < 65536 ? u[n++] = o : (o -= 65536,
                    u[n++] = 55296 | o >> 10 & 1023,
                    u[n++] = 56320 | 1023 & o)
                }
            return r(u, n)
        }
        ,
        a.utf8border = function(e, t) {
            var a;
            for ((t = t || e.length) > e.length && (t = e.length),
            a = t - 1; a >= 0 && 128 == (192 & e[a]); )
                a--;
            return a < 0 ? t : 0 === a ? t : a + s[e[a]] > t ? a : t
        }
    }
    , {
        "./common": 1
    }],
    3: [function(e, t, a) {
        "use strict";
        t.exports = function(e, t, a, r) {
            for (var n = 65535 & e | 0, o = e >>> 16 & 65535 | 0, c = 0; 0 !== a; ) {
                a -= c = a > 2e3 ? 2e3 : a;
                do {
                    o = o + (n = n + t[r++] | 0) | 0
                } while (--c);
                n %= 65521,
                o %= 65521
            }
            return n | o << 16 | 0
        }
    }
    , {}],
    4: [function(e, t, a) {
        "use strict";
        var r = function() {
            for (var e, t = [], a = 0; a < 256; a++) {
                e = a;
                for (var r = 0; r < 8; r++)
                    e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
                t[a] = e
            }
            return t
        }();
        t.exports = function(e, t, a, n) {
            var o = r
              , c = n + a;
            e ^= -1;
            for (var s = n; s < c; s++)
                e = e >>> 8 ^ o[255 & (e ^ t[s])];
            return -1 ^ e
        }
    }
    , {}],
    5: [function(e, t, a) {
        "use strict";
        function r(e, t) {
            return e.msg = U[t],
            t
        }
        function n(e) {
            return (e << 1) - (e > 4 ? 9 : 0)
        }
        function o(e) {
            for (var t = e.length; --t >= 0; )
                e[t] = 0
        }
        function c(e) {
            var t = e.state
              , a = t.pending;
            a > e.avail_out && (a = e.avail_out),
            0 !== a && (S.arraySet(e.output, t.pending_buf, t.pending_out, a, e.next_out),
            e.next_out += a,
            t.pending_out += a,
            e.total_out += a,
            e.avail_out -= a,
            t.pending -= a,
            0 === t.pending && (t.pending_out = 0))
        }
        function s(e, t) {
            y._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t),
            e.block_start = e.strstart,
            c(e.strm)
        }
        function i(e, t) {
            e.pending_buf[e.pending++] = t
        }
        function u(e, t) {
            e.pending_buf[e.pending++] = t >>> 8 & 255,
            e.pending_buf[e.pending++] = 255 & t
        }
        function d(e, t, a, r) {
            var n = e.avail_in;
            return n > r && (n = r),
            0 === n ? 0 : (e.avail_in -= n,
            S.arraySet(t, e.input, e.next_in, n, a),
            1 === e.state.wrap ? e.adler = E(e.adler, t, n, a) : 2 === e.state.wrap && (e.adler = w(e.adler, t, n, a)),
            e.next_in += n,
            e.total_in += n,
            n)
        }
        function h(e, t) {
            var a, r, n = e.max_chain_length, o = e.strstart, c = e.prev_length, s = e.nice_match, i = e.strstart > e.w_size - B ? e.strstart - (e.w_size - B) : 0, u = e.window, d = e.w_mask, h = e.prev, _ = e.strstart + H, l = u[o + c - 1], T = u[o + c];
            e.prev_length >= e.good_match && (n >>= 2),
            s > e.lookahead && (s = e.lookahead);
            do {
                if (u[(a = t) + c] === T && u[a + c - 1] === l && u[a] === u[o] && u[++a] === u[o + 1]) {
                    o += 2,
                    a++;
                    do {} while (u[++o] === u[++a] && u[++o] === u[++a] && u[++o] === u[++a] && u[++o] === u[++a] && u[++o] === u[++a] && u[++o] === u[++a] && u[++o] === u[++a] && u[++o] === u[++a] && o < _);
                    if (r = H - (_ - o),
                    o = _ - H,
                    r > c) {
                        if (e.match_start = t,
                        c = r,
                        r >= s)
                            break;
                        l = u[o + c - 1],
                        T = u[o + c]
                    }
                }
            } while ((t = h[t & d]) > i && 0 != --n);
            return c <= e.lookahead ? c : e.lookahead
        }
        function _(e) {
            var t, a, r, n, o, c = e.w_size;
            do {
                if (n = e.window_size - e.lookahead - e.strstart,
                e.strstart >= c + (c - B)) {
                    S.arraySet(e.window, e.window, c, c, 0),
                    e.match_start -= c,
                    e.strstart -= c,
                    e.block_start -= c,
                    t = a = e.hash_size;
                    do {
                        r = e.head[--t],
                        e.head[t] = r >= c ? r - c : 0
                    } while (--a);
                    t = a = c;
                    do {
                        r = e.prev[--t],
                        e.prev[t] = r >= c ? r - c : 0
                    } while (--a);
                    n += c
                }
                if (0 === e.strm.avail_in)
                    break;
                if (a = d(e.strm, e.window, e.strstart + e.lookahead, n),
                e.lookahead += a,
                e.lookahead + e.insert >= G)
                    for (o = e.strstart - e.insert,
                    e.ins_h = e.window[o],
                    e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + G - 1]) & e.hash_mask,
                    e.prev[o & e.w_mask] = e.head[e.ins_h],
                    e.head[e.ins_h] = o,
                    o++,
                    e.insert--,
                    !(e.lookahead + e.insert < G)); )
                        ;
            } while (e.lookahead < B && 0 !== e.strm.avail_in)
        }
        function l(e, t) {
            for (var a, r; ; ) {
                if (e.lookahead < B) {
                    if (_(e),
                    e.lookahead < B && t === R)
                        return z;
                    if (0 === e.lookahead)
                        break
                }
                if (a = 0,
                e.lookahead >= G && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + G - 1]) & e.hash_mask,
                a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h],
                e.head[e.ins_h] = e.strstart),
                0 !== a && e.strstart - a <= e.w_size - B && (e.match_length = h(e, a)),
                e.match_length >= G)
                    if (r = y._tr_tally(e, e.strstart - e.match_start, e.match_length - G),
                    e.lookahead -= e.match_length,
                    e.match_length <= e.max_lazy_match && e.lookahead >= G) {
                        e.match_length--;
                        do {
                            e.strstart++,
                            e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + G - 1]) & e.hash_mask,
                            a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h],
                            e.head[e.ins_h] = e.strstart
                        } while (0 != --e.match_length);
                        e.strstart++
                    } else
                        e.strstart += e.match_length,
                        e.match_length = 0,
                        e.ins_h = e.window[e.strstart],
                        e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
                else
                    r = y._tr_tally(e, 0, e.window[e.strstart]),
                    e.lookahead--,
                    e.strstart++;
                if (r && (s(e, !1),
                0 === e.strm.avail_out))
                    return z
            }
            return e.insert = e.strstart < G - 1 ? e.strstart : G - 1,
            t === I ? (s(e, !0),
            0 === e.strm.avail_out ? Q : K) : e.last_lit && (s(e, !1),
            0 === e.strm.avail_out) ? z : J
        }
        function T(e, t) {
            for (var a, r, n; ; ) {
                if (e.lookahead < B) {
                    if (_(e),
                    e.lookahead < B && t === R)
                        return z;
                    if (0 === e.lookahead)
                        break
                }
                if (a = 0,
                e.lookahead >= G && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + G - 1]) & e.hash_mask,
                a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h],
                e.head[e.ins_h] = e.strstart),
                e.prev_length = e.match_length,
                e.prev_match = e.match_start,
                e.match_length = G - 1,
                0 !== a && e.prev_length < e.max_lazy_match && e.strstart - a <= e.w_size - B && (e.match_length = h(e, a),
                e.match_length <= 5 && (e.strategy === L || e.match_length === G && e.strstart - e.match_start > 4096) && (e.match_length = G - 1)),
                e.prev_length >= G && e.match_length <= e.prev_length) {
                    n = e.strstart + e.lookahead - G,
                    r = y._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - G),
                    e.lookahead -= e.prev_length - 1,
                    e.prev_length -= 2;
                    do {
                        ++e.strstart <= n && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + G - 1]) & e.hash_mask,
                        a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h],
                        e.head[e.ins_h] = e.strstart)
                    } while (0 != --e.prev_length);
                    if (e.match_available = 0,
                    e.match_length = G - 1,
                    e.strstart++,
                    r && (s(e, !1),
                    0 === e.strm.avail_out))
                        return z
                } else if (e.match_available) {
                    if ((r = y._tr_tally(e, 0, e.window[e.strstart - 1])) && s(e, !1),
                    e.strstart++,
                    e.lookahead--,
                    0 === e.strm.avail_out)
                        return z
                } else
                    e.match_available = 1,
                    e.strstart++,
                    e.lookahead--
            }
            return e.match_available && (r = y._tr_tally(e, 0, e.window[e.strstart - 1]),
            e.match_available = 0),
            e.insert = e.strstart < G - 1 ? e.strstart : G - 1,
            t === I ? (s(e, !0),
            0 === e.strm.avail_out ? Q : K) : e.last_lit && (s(e, !1),
            0 === e.strm.avail_out) ? z : J
        }
        function x(e, t) {
            for (var a, r, n, o, c = e.window; ; ) {
                if (e.lookahead <= H) {
                    if (_(e),
                    e.lookahead <= H && t === R)
                        return z;
                    if (0 === e.lookahead)
                        break
                }
                if (e.match_length = 0,
                e.lookahead >= G && e.strstart > 0 && (n = e.strstart - 1,
                (r = c[n]) === c[++n] && r === c[++n] && r === c[++n])) {
                    o = e.strstart + H;
                    do {} while (r === c[++n] && r === c[++n] && r === c[++n] && r === c[++n] && r === c[++n] && r === c[++n] && r === c[++n] && r === c[++n] && n < o);
                    e.match_length = H - (o - n),
                    e.match_length > e.lookahead && (e.match_length = e.lookahead)
                }
                if (e.match_length >= G ? (a = y._tr_tally(e, 1, e.match_length - G),
                e.lookahead -= e.match_length,
                e.strstart += e.match_length,
                e.match_length = 0) : (a = y._tr_tally(e, 0, e.window[e.strstart]),
                e.lookahead--,
                e.strstart++),
                a && (s(e, !1),
                0 === e.strm.avail_out))
                    return z
            }
            return e.insert = 0,
            t === I ? (s(e, !0),
            0 === e.strm.avail_out ? Q : K) : e.last_lit && (s(e, !1),
            0 === e.strm.avail_out) ? z : J
        }
        function f(e, t) {
            for (var a; ; ) {
                if (0 === e.lookahead && (_(e),
                0 === e.lookahead)) {
                    if (t === R)
                        return z;
                    break
                }
                if (e.match_length = 0,
                a = y._tr_tally(e, 0, e.window[e.strstart]),
                e.lookahead--,
                e.strstart++,
                a && (s(e, !1),
                0 === e.strm.avail_out))
                    return z
            }
            return e.insert = 0,
            t === I ? (s(e, !0),
            0 === e.strm.avail_out ? Q : K) : e.last_lit && (s(e, !1),
            0 === e.strm.avail_out) ? z : J
        }
        function p(e, t, a, r, n) {
            this.good_length = e,
            this.max_lazy = t,
            this.nice_length = a,
            this.max_chain = r,
            this.func = n
        }
        function g() {
            this.strm = null,
            this.status = 0,
            this.pending_buf = null,
            this.pending_buf_size = 0,
            this.pending_out = 0,
            this.pending = 0,
            this.wrap = 0,
            this.gzhead = null,
            this.gzindex = 0,
            this.method = P,
            this.last_flush = -1,
            this.w_size = 0,
            this.w_bits = 0,
            this.w_mask = 0,
            this.window = null,
            this.window_size = 0,
            this.prev = null,
            this.head = null,
            this.ins_h = 0,
            this.hash_size = 0,
            this.hash_bits = 0,
            this.hash_mask = 0,
            this.hash_shift = 0,
            this.block_start = 0,
            this.match_length = 0,
            this.prev_match = 0,
            this.match_available = 0,
            this.strstart = 0,
            this.match_start = 0,
            this.lookahead = 0,
            this.prev_length = 0,
            this.max_chain_length = 0,
            this.max_lazy_match = 0,
            this.level = 0,
            this.strategy = 0,
            this.good_match = 0,
            this.nice_match = 0,
            this.dyn_ltree = new S.Buf16(2 * W),
            this.dyn_dtree = new S.Buf16(2 * (2 * N + 1)),
            this.bl_tree = new S.Buf16(2 * (2 * Z + 1)),
            o(this.dyn_ltree),
            o(this.dyn_dtree),
            o(this.bl_tree),
            this.l_desc = null,
            this.d_desc = null,
            this.bl_desc = null,
            this.bl_count = new S.Buf16(X + 1),
            this.heap = new S.Buf16(2 * O + 1),
            o(this.heap),
            this.heap_len = 0,
            this.heap_max = 0,
            this.depth = new S.Buf16(2 * O + 1),
            o(this.depth),
            this.l_buf = 0,
            this.lit_bufsize = 0,
            this.last_lit = 0,
            this.d_buf = 0,
            this.opt_len = 0,
            this.static_len = 0,
            this.matches = 0,
            this.insert = 0,
            this.bi_buf = 0,
            this.bi_valid = 0
        }
        function M(e) {
            var t;
            return e && e.state ? (e.total_in = e.total_out = 0,
            e.data_type = F,
            (t = e.state).pending = 0,
            t.pending_out = 0,
            t.wrap < 0 && (t.wrap = -t.wrap),
            t.status = t.wrap ? Y : j,
            e.adler = 2 === t.wrap ? 0 : 1,
            t.last_flush = R,
            y._tr_init(t),
            A) : r(e, C)
        }
        function m(e) {
            var t = M(e);
            return t === A && function(e) {
                e.window_size = 2 * e.w_size,
                o(e.head),
                e.max_lazy_match = v[e.level].max_lazy,
                e.good_match = v[e.level].good_length,
                e.nice_match = v[e.level].nice_length,
                e.max_chain_length = v[e.level].max_chain,
                e.strstart = 0,
                e.block_start = 0,
                e.lookahead = 0,
                e.insert = 0,
                e.match_length = e.prev_length = G - 1,
                e.match_available = 0,
                e.ins_h = 0
            }(e.state),
            t
        }
        function b(e, t, a, n, o, c) {
            if (!e)
                return C;
            var s = 1;
            if (t === V && (t = 6),
            n < 0 ? (s = 0,
            n = -n) : n > 15 && (s = 2,
            n -= 16),
            o < 1 || o > k || a !== P || n < 8 || n > 15 || t < 0 || t > 9 || c < 0 || c > D)
                return r(e, C);
            8 === n && (n = 9);
            var i = new g;
            return e.state = i,
            i.strm = e,
            i.wrap = s,
            i.gzhead = null,
            i.w_bits = n,
            i.w_size = 1 << i.w_bits,
            i.w_mask = i.w_size - 1,
            i.hash_bits = o + 7,
            i.hash_size = 1 << i.hash_bits,
            i.hash_mask = i.hash_size - 1,
            i.hash_shift = ~~((i.hash_bits + G - 1) / G),
            i.window = new S.Buf8(2 * i.w_size),
            i.head = new S.Buf16(i.hash_size),
            i.prev = new S.Buf16(i.w_size),
            i.lit_bufsize = 1 << o + 6,
            i.pending_buf_size = 4 * i.lit_bufsize,
            i.pending_buf = new S.Buf8(i.pending_buf_size),
            i.d_buf = 1 * i.lit_bufsize,
            i.l_buf = 3 * i.lit_bufsize,
            i.level = t,
            i.strategy = c,
            i.method = a,
            m(e)
        }
        var v, S = e("../utils/common"), y = e("./trees"), E = e("./adler32"), w = e("./crc32"), U = e("./messages"), R = 0, I = 4, A = 0, C = -2, V = -1, L = 1, D = 4, F = 2, P = 8, k = 9, O = 286, N = 30, Z = 19, W = 2 * O + 1, X = 15, G = 3, H = 258, B = H + G + 1, Y = 42, j = 113, z = 1, J = 2, Q = 3, K = 4;
        v = [new p(0,0,0,0,function(e, t) {
            var a = 65535;
            for (a > e.pending_buf_size - 5 && (a = e.pending_buf_size - 5); ; ) {
                if (e.lookahead <= 1) {
                    if (_(e),
                    0 === e.lookahead && t === R)
                        return z;
                    if (0 === e.lookahead)
                        break
                }
                e.strstart += e.lookahead,
                e.lookahead = 0;
                var r = e.block_start + a;
                if ((0 === e.strstart || e.strstart >= r) && (e.lookahead = e.strstart - r,
                e.strstart = r,
                s(e, !1),
                0 === e.strm.avail_out))
                    return z;
                if (e.strstart - e.block_start >= e.w_size - B && (s(e, !1),
                0 === e.strm.avail_out))
                    return z
            }
            return e.insert = 0,
            t === I ? (s(e, !0),
            0 === e.strm.avail_out ? Q : K) : (e.strstart > e.block_start && (s(e, !1),
            e.strm.avail_out),
            z)
        }
        ), new p(4,4,8,4,l), new p(4,5,16,8,l), new p(4,6,32,32,l), new p(4,4,16,16,T), new p(8,16,32,32,T), new p(8,16,128,128,T), new p(8,32,128,256,T), new p(32,128,258,1024,T), new p(32,258,258,4096,T)],
        a.deflateInit = function(e, t) {
            return b(e, t, P, 15, 8, 0)
        }
        ,
        a.deflateInit2 = b,
        a.deflateReset = m,
        a.deflateResetKeep = M,
        a.deflateSetHeader = function(e, t) {
            return e && e.state ? 2 !== e.state.wrap ? C : (e.state.gzhead = t,
            A) : C
        }
        ,
        a.deflate = function(e, t) {
            var a, s, d, h;
            if (!e || !e.state || t > 5 || t < 0)
                return e ? r(e, C) : C;
            if (s = e.state,
            !e.output || !e.input && 0 !== e.avail_in || 666 === s.status && t !== I)
                return r(e, 0 === e.avail_out ? -5 : C);
            if (s.strm = e,
            a = s.last_flush,
            s.last_flush = t,
            s.status === Y)
                if (2 === s.wrap)
                    e.adler = 0,
                    i(s, 31),
                    i(s, 139),
                    i(s, 8),
                    s.gzhead ? (i(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (s.gzhead.extra ? 4 : 0) + (s.gzhead.name ? 8 : 0) + (s.gzhead.comment ? 16 : 0)),
                    i(s, 255 & s.gzhead.time),
                    i(s, s.gzhead.time >> 8 & 255),
                    i(s, s.gzhead.time >> 16 & 255),
                    i(s, s.gzhead.time >> 24 & 255),
                    i(s, 9 === s.level ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0),
                    i(s, 255 & s.gzhead.os),
                    s.gzhead.extra && s.gzhead.extra.length && (i(s, 255 & s.gzhead.extra.length),
                    i(s, s.gzhead.extra.length >> 8 & 255)),
                    s.gzhead.hcrc && (e.adler = w(e.adler, s.pending_buf, s.pending, 0)),
                    s.gzindex = 0,
                    s.status = 69) : (i(s, 0),
                    i(s, 0),
                    i(s, 0),
                    i(s, 0),
                    i(s, 0),
                    i(s, 9 === s.level ? 2 : s.strategy >= 2 || s.level < 2 ? 4 : 0),
                    i(s, 3),
                    s.status = j);
                else {
                    var _ = P + (s.w_bits - 8 << 4) << 8;
                    _ |= (s.strategy >= 2 || s.level < 2 ? 0 : s.level < 6 ? 1 : 6 === s.level ? 2 : 3) << 6,
                    0 !== s.strstart && (_ |= 32),
                    _ += 31 - _ % 31,
                    s.status = j,
                    u(s, _),
                    0 !== s.strstart && (u(s, e.adler >>> 16),
                    u(s, 65535 & e.adler)),
                    e.adler = 1
                }
            if (69 === s.status)
                if (s.gzhead.extra) {
                    for (d = s.pending; s.gzindex < (65535 & s.gzhead.extra.length) && (s.pending !== s.pending_buf_size || (s.gzhead.hcrc && s.pending > d && (e.adler = w(e.adler, s.pending_buf, s.pending - d, d)),
                    c(e),
                    d = s.pending,
                    s.pending !== s.pending_buf_size)); )
                        i(s, 255 & s.gzhead.extra[s.gzindex]),
                        s.gzindex++;
                    s.gzhead.hcrc && s.pending > d && (e.adler = w(e.adler, s.pending_buf, s.pending - d, d)),
                    s.gzindex === s.gzhead.extra.length && (s.gzindex = 0,
                    s.status = 73)
                } else
                    s.status = 73;
            if (73 === s.status)
                if (s.gzhead.name) {
                    d = s.pending;
                    do {
                        if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > d && (e.adler = w(e.adler, s.pending_buf, s.pending - d, d)),
                        c(e),
                        d = s.pending,
                        s.pending === s.pending_buf_size)) {
                            h = 1;
                            break
                        }
                        h = s.gzindex < s.gzhead.name.length ? 255 & s.gzhead.name.charCodeAt(s.gzindex++) : 0,
                        i(s, h)
                    } while (0 !== h);
                    s.gzhead.hcrc && s.pending > d && (e.adler = w(e.adler, s.pending_buf, s.pending - d, d)),
                    0 === h && (s.gzindex = 0,
                    s.status = 91)
                } else
                    s.status = 91;
            if (91 === s.status)
                if (s.gzhead.comment) {
                    d = s.pending;
                    do {
                        if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > d && (e.adler = w(e.adler, s.pending_buf, s.pending - d, d)),
                        c(e),
                        d = s.pending,
                        s.pending === s.pending_buf_size)) {
                            h = 1;
                            break
                        }
                        h = s.gzindex < s.gzhead.comment.length ? 255 & s.gzhead.comment.charCodeAt(s.gzindex++) : 0,
                        i(s, h)
                    } while (0 !== h);
                    s.gzhead.hcrc && s.pending > d && (e.adler = w(e.adler, s.pending_buf, s.pending - d, d)),
                    0 === h && (s.status = 103)
                } else
                    s.status = 103;
            if (103 === s.status && (s.gzhead.hcrc ? (s.pending + 2 > s.pending_buf_size && c(e),
            s.pending + 2 <= s.pending_buf_size && (i(s, 255 & e.adler),
            i(s, e.adler >> 8 & 255),
            e.adler = 0,
            s.status = j)) : s.status = j),
            0 !== s.pending) {
                if (c(e),
                0 === e.avail_out)
                    return s.last_flush = -1,
                    A
            } else if (0 === e.avail_in && n(t) <= n(a) && t !== I)
                return r(e, -5);
            if (666 === s.status && 0 !== e.avail_in)
                return r(e, -5);
            if (0 !== e.avail_in || 0 !== s.lookahead || t !== R && 666 !== s.status) {
                var l = 2 === s.strategy ? f(s, t) : 3 === s.strategy ? x(s, t) : v[s.level].func(s, t);
                if (l !== Q && l !== K || (s.status = 666),
                l === z || l === Q)
                    return 0 === e.avail_out && (s.last_flush = -1),
                    A;
                if (l === J && (1 === t ? y._tr_align(s) : 5 !== t && (y._tr_stored_block(s, 0, 0, !1),
                3 === t && (o(s.head),
                0 === s.lookahead && (s.strstart = 0,
                s.block_start = 0,
                s.insert = 0))),
                c(e),
                0 === e.avail_out))
                    return s.last_flush = -1,
                    A
            }
            return t !== I ? A : s.wrap <= 0 ? 1 : (2 === s.wrap ? (i(s, 255 & e.adler),
            i(s, e.adler >> 8 & 255),
            i(s, e.adler >> 16 & 255),
            i(s, e.adler >> 24 & 255),
            i(s, 255 & e.total_in),
            i(s, e.total_in >> 8 & 255),
            i(s, e.total_in >> 16 & 255),
            i(s, e.total_in >> 24 & 255)) : (u(s, e.adler >>> 16),
            u(s, 65535 & e.adler)),
            c(e),
            s.wrap > 0 && (s.wrap = -s.wrap),
            0 !== s.pending ? A : 1)
        }
        ,
        a.deflateEnd = function(e) {
            var t;
            return e && e.state ? (t = e.state.status) !== Y && 69 !== t && 73 !== t && 91 !== t && 103 !== t && t !== j && 666 !== t ? r(e, C) : (e.state = null,
            t === j ? r(e, -3) : A) : C
        }
        ,
        a.deflateSetDictionary = function(e, t) {
            var a, r, n, c, s, i, u, d, h = t.length;
            if (!e || !e.state)
                return C;
            if (a = e.state,
            2 === (c = a.wrap) || 1 === c && a.status !== Y || a.lookahead)
                return C;
            for (1 === c && (e.adler = E(e.adler, t, h, 0)),
            a.wrap = 0,
            h >= a.w_size && (0 === c && (o(a.head),
            a.strstart = 0,
            a.block_start = 0,
            a.insert = 0),
            d = new S.Buf8(a.w_size),
            S.arraySet(d, t, h - a.w_size, a.w_size, 0),
            t = d,
            h = a.w_size),
            s = e.avail_in,
            i = e.next_in,
            u = e.input,
            e.avail_in = h,
            e.next_in = 0,
            e.input = t,
            _(a); a.lookahead >= G; ) {
                r = a.strstart,
                n = a.lookahead - (G - 1);
                do {
                    a.ins_h = (a.ins_h << a.hash_shift ^ a.window[r + G - 1]) & a.hash_mask,
                    a.prev[r & a.w_mask] = a.head[a.ins_h],
                    a.head[a.ins_h] = r,
                    r++
                } while (--n);
                a.strstart = r,
                a.lookahead = G - 1,
                _(a)
            }
            return a.strstart += a.lookahead,
            a.block_start = a.strstart,
            a.insert = a.lookahead,
            a.lookahead = 0,
            a.match_length = a.prev_length = G - 1,
            a.match_available = 0,
            e.next_in = i,
            e.input = u,
            e.avail_in = s,
            a.wrap = c,
            A
        }
        ,
        a.deflateInfo = "pako deflate (from Nodeca project)"
    }
    , {
        "../utils/common": 1,
        "./adler32": 3,
        "./crc32": 4,
        "./messages": 6,
        "./trees": 7
    }],
    6: [function(e, t, a) {
        "use strict";
        t.exports = {
            2: "need dictionary",
            1: "stream end",
            0: "",
            "-1": "file error",
            "-2": "stream error",
            "-3": "data error",
            "-4": "insufficient memory",
            "-5": "buffer error",
            "-6": "incompatible version"
        }
    }
    , {}],
    7: [function(e, t, a) {
        "use strict";
        function r(e) {
            for (var t = e.length; --t >= 0; )
                e[t] = 0
        }
        function n(e, t, a, r, n) {
            this.static_tree = e,
            this.extra_bits = t,
            this.extra_base = a,
            this.elems = r,
            this.max_length = n,
            this.has_stree = e && e.length
        }
        function o(e, t) {
            this.dyn_tree = e,
            this.max_code = 0,
            this.stat_desc = t
        }
        function c(e) {
            return e < 256 ? H[e] : H[256 + (e >>> 7)]
        }
        function s(e, t) {
            e.pending_buf[e.pending++] = 255 & t,
            e.pending_buf[e.pending++] = t >>> 8 & 255
        }
        function i(e, t, a) {
            e.bi_valid > V - a ? (e.bi_buf |= t << e.bi_valid & 65535,
            s(e, e.bi_buf),
            e.bi_buf = t >> V - e.bi_valid,
            e.bi_valid += a - V) : (e.bi_buf |= t << e.bi_valid & 65535,
            e.bi_valid += a)
        }
        function u(e, t, a) {
            i(e, a[2 * t], a[2 * t + 1])
        }
        function d(e, t) {
            var a = 0;
            do {
                a |= 1 & e,
                e >>>= 1,
                a <<= 1
            } while (--t > 0);
            return a >>> 1
        }
        function h(e, t, a) {
            var r, n, o = new Array(C + 1), c = 0;
            for (r = 1; r <= C; r++)
                o[r] = c = c + a[r - 1] << 1;
            for (n = 0; n <= t; n++) {
                var s = e[2 * n + 1];
                0 !== s && (e[2 * n] = d(o[s]++, s))
            }
        }
        function _(e) {
            var t;
            for (t = 0; t < U; t++)
                e.dyn_ltree[2 * t] = 0;
            for (t = 0; t < R; t++)
                e.dyn_dtree[2 * t] = 0;
            for (t = 0; t < I; t++)
                e.bl_tree[2 * t] = 0;
            e.dyn_ltree[2 * D] = 1,
            e.opt_len = e.static_len = 0,
            e.last_lit = e.matches = 0
        }
        function l(e) {
            e.bi_valid > 8 ? s(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf),
            e.bi_buf = 0,
            e.bi_valid = 0
        }
        function T(e, t, a, r) {
            var n = 2 * t
              , o = 2 * a;
            return e[n] < e[o] || e[n] === e[o] && r[t] <= r[a]
        }
        function x(e, t, a) {
            for (var r = e.heap[a], n = a << 1; n <= e.heap_len && (n < e.heap_len && T(t, e.heap[n + 1], e.heap[n], e.depth) && n++,
            !T(t, r, e.heap[n], e.depth)); )
                e.heap[a] = e.heap[n],
                a = n,
                n <<= 1;
            e.heap[a] = r
        }
        function f(e, t, a) {
            var r, n, o, s, d = 0;
            if (0 !== e.last_lit)
                do {
                    r = e.pending_buf[e.d_buf + 2 * d] << 8 | e.pending_buf[e.d_buf + 2 * d + 1],
                    n = e.pending_buf[e.l_buf + d],
                    d++,
                    0 === r ? u(e, n, t) : (u(e, (o = B[n]) + w + 1, t),
                    0 !== (s = O[o]) && i(e, n -= Y[o], s),
                    u(e, o = c(--r), a),
                    0 !== (s = N[o]) && i(e, r -= j[o], s))
                } while (d < e.last_lit);
            u(e, D, t)
        }
        function p(e, t) {
            var a, r, n, o = t.dyn_tree, c = t.stat_desc.static_tree, s = t.stat_desc.has_stree, i = t.stat_desc.elems, u = -1;
            for (e.heap_len = 0,
            e.heap_max = A,
            a = 0; a < i; a++)
                0 !== o[2 * a] ? (e.heap[++e.heap_len] = u = a,
                e.depth[a] = 0) : o[2 * a + 1] = 0;
            for (; e.heap_len < 2; )
                o[2 * (n = e.heap[++e.heap_len] = u < 2 ? ++u : 0)] = 1,
                e.depth[n] = 0,
                e.opt_len--,
                s && (e.static_len -= c[2 * n + 1]);
            for (t.max_code = u,
            a = e.heap_len >> 1; a >= 1; a--)
                x(e, o, a);
            n = i;
            do {
                a = e.heap[1],
                e.heap[1] = e.heap[e.heap_len--],
                x(e, o, 1),
                r = e.heap[1],
                e.heap[--e.heap_max] = a,
                e.heap[--e.heap_max] = r,
                o[2 * n] = o[2 * a] + o[2 * r],
                e.depth[n] = (e.depth[a] >= e.depth[r] ? e.depth[a] : e.depth[r]) + 1,
                o[2 * a + 1] = o[2 * r + 1] = n,
                e.heap[1] = n++,
                x(e, o, 1)
            } while (e.heap_len >= 2);
            e.heap[--e.heap_max] = e.heap[1],
            function(e, t) {
                var a, r, n, o, c, s, i = t.dyn_tree, u = t.max_code, d = t.stat_desc.static_tree, h = t.stat_desc.has_stree, _ = t.stat_desc.extra_bits, l = t.stat_desc.extra_base, T = t.stat_desc.max_length, x = 0;
                for (o = 0; o <= C; o++)
                    e.bl_count[o] = 0;
                for (i[2 * e.heap[e.heap_max] + 1] = 0,
                a = e.heap_max + 1; a < A; a++)
                    (o = i[2 * i[2 * (r = e.heap[a]) + 1] + 1] + 1) > T && (o = T,
                    x++),
                    i[2 * r + 1] = o,
                    r > u || (e.bl_count[o]++,
                    c = 0,
                    r >= l && (c = _[r - l]),
                    s = i[2 * r],
                    e.opt_len += s * (o + c),
                    h && (e.static_len += s * (d[2 * r + 1] + c)));
                if (0 !== x) {
                    do {
                        for (o = T - 1; 0 === e.bl_count[o]; )
                            o--;
                        e.bl_count[o]--,
                        e.bl_count[o + 1] += 2,
                        e.bl_count[T]--,
                        x -= 2
                    } while (x > 0);
                    for (o = T; 0 !== o; o--)
                        for (r = e.bl_count[o]; 0 !== r; )
                            (n = e.heap[--a]) > u || (i[2 * n + 1] !== o && (e.opt_len += (o - i[2 * n + 1]) * i[2 * n],
                            i[2 * n + 1] = o),
                            r--)
                }
            }(e, t),
            h(o, u, e.bl_count)
        }
        function g(e, t, a) {
            var r, n, o = -1, c = t[1], s = 0, i = 7, u = 4;
            for (0 === c && (i = 138,
            u = 3),
            t[2 * (a + 1) + 1] = 65535,
            r = 0; r <= a; r++)
                n = c,
                c = t[2 * (r + 1) + 1],
                ++s < i && n === c || (s < u ? e.bl_tree[2 * n] += s : 0 !== n ? (n !== o && e.bl_tree[2 * n]++,
                e.bl_tree[2 * F]++) : s <= 10 ? e.bl_tree[2 * P]++ : e.bl_tree[2 * k]++,
                s = 0,
                o = n,
                0 === c ? (i = 138,
                u = 3) : n === c ? (i = 6,
                u = 3) : (i = 7,
                u = 4))
        }
        function M(e, t, a) {
            var r, n, o = -1, c = t[1], s = 0, d = 7, h = 4;
            for (0 === c && (d = 138,
            h = 3),
            r = 0; r <= a; r++)
                if (n = c,
                c = t[2 * (r + 1) + 1],
                !(++s < d && n === c)) {
                    if (s < h)
                        do {
                            u(e, n, e.bl_tree)
                        } while (0 != --s);
                    else
                        0 !== n ? (n !== o && (u(e, n, e.bl_tree),
                        s--),
                        u(e, F, e.bl_tree),
                        i(e, s - 3, 2)) : s <= 10 ? (u(e, P, e.bl_tree),
                        i(e, s - 3, 3)) : (u(e, k, e.bl_tree),
                        i(e, s - 11, 7));
                    s = 0,
                    o = n,
                    0 === c ? (d = 138,
                    h = 3) : n === c ? (d = 6,
                    h = 3) : (d = 7,
                    h = 4)
                }
        }
        function m(e, t, a, r) {
            i(e, (y << 1) + (r ? 1 : 0), 3),
            function(e, t, a, r) {
                l(e),
                r && (s(e, a),
                s(e, ~a)),
                b.arraySet(e.pending_buf, e.window, t, a, e.pending),
                e.pending += a
            }(e, t, a, !0)
        }
        var b = e("../utils/common")
          , v = 0
          , S = 1
          , y = 0
          , E = 29
          , w = 256
          , U = w + 1 + E
          , R = 30
          , I = 19
          , A = 2 * U + 1
          , C = 15
          , V = 16
          , L = 7
          , D = 256
          , F = 16
          , P = 17
          , k = 18
          , O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
          , N = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
          , Z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
          , W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
          , X = new Array(2 * (U + 2));
        r(X);
        var G = new Array(2 * R);
        r(G);
        var H = new Array(512);
        r(H);
        var B = new Array(256);
        r(B);
        var Y = new Array(E);
        r(Y);
        var j = new Array(R);
        r(j);
        var z, J, Q, K = !1;
        a._tr_init = function(e) {
            K || (function() {
                var e, t, a, r, o, c = new Array(C + 1);
                for (a = 0,
                r = 0; r < E - 1; r++)
                    for (Y[r] = a,
                    e = 0; e < 1 << O[r]; e++)
                        B[a++] = r;
                for (B[a - 1] = r,
                o = 0,
                r = 0; r < 16; r++)
                    for (j[r] = o,
                    e = 0; e < 1 << N[r]; e++)
                        H[o++] = r;
                for (o >>= 7; r < R; r++)
                    for (j[r] = o << 7,
                    e = 0; e < 1 << N[r] - 7; e++)
                        H[256 + o++] = r;
                for (t = 0; t <= C; t++)
                    c[t] = 0;
                for (e = 0; e <= 143; )
                    X[2 * e + 1] = 8,
                    e++,
                    c[8]++;
                for (; e <= 255; )
                    X[2 * e + 1] = 9,
                    e++,
                    c[9]++;
                for (; e <= 279; )
                    X[2 * e + 1] = 7,
                    e++,
                    c[7]++;
                for (; e <= 287; )
                    X[2 * e + 1] = 8,
                    e++,
                    c[8]++;
                for (h(X, U + 1, c),
                e = 0; e < R; e++)
                    G[2 * e + 1] = 5,
                    G[2 * e] = d(e, 5);
                z = new n(X,O,w + 1,U,C),
                J = new n(G,N,0,R,C),
                Q = new n(new Array(0),Z,0,I,L)
            }(),
            K = !0),
            e.l_desc = new o(e.dyn_ltree,z),
            e.d_desc = new o(e.dyn_dtree,J),
            e.bl_desc = new o(e.bl_tree,Q),
            e.bi_buf = 0,
            e.bi_valid = 0,
            _(e)
        }
        ,
        a._tr_stored_block = m,
        a._tr_flush_block = function(e, t, a, r) {
            var n, o, c = 0;
            e.level > 0 ? (2 === e.strm.data_type && (e.strm.data_type = function(e) {
                var t, a = 4093624447;
                for (t = 0; t <= 31; t++,
                a >>>= 1)
                    if (1 & a && 0 !== e.dyn_ltree[2 * t])
                        return v;
                if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26])
                    return S;
                for (t = 32; t < w; t++)
                    if (0 !== e.dyn_ltree[2 * t])
                        return S;
                return v
            }(e)),
            p(e, e.l_desc),
            p(e, e.d_desc),
            c = function(e) {
                var t;
                for (g(e, e.dyn_ltree, e.l_desc.max_code),
                g(e, e.dyn_dtree, e.d_desc.max_code),
                p(e, e.bl_desc),
                t = I - 1; t >= 3 && 0 === e.bl_tree[2 * W[t] + 1]; t--)
                    ;
                return e.opt_len += 3 * (t + 1) + 5 + 5 + 4,
                t
            }(e),
            n = e.opt_len + 3 + 7 >>> 3,
            (o = e.static_len + 3 + 7 >>> 3) <= n && (n = o)) : n = o = a + 5,
            a + 4 <= n && -1 !== t ? m(e, t, a, r) : 4 === e.strategy || o === n ? (i(e, 2 + (r ? 1 : 0), 3),
            f(e, X, G)) : (i(e, 4 + (r ? 1 : 0), 3),
            function(e, t, a, r) {
                var n;
                for (i(e, t - 257, 5),
                i(e, a - 1, 5),
                i(e, r - 4, 4),
                n = 0; n < r; n++)
                    i(e, e.bl_tree[2 * W[n] + 1], 3);
                M(e, e.dyn_ltree, t - 1),
                M(e, e.dyn_dtree, a - 1)
            }(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, c + 1),
            f(e, e.dyn_ltree, e.dyn_dtree)),
            _(e),
            r && l(e)
        }
        ,
        a._tr_tally = function(e, t, a) {
            return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255,
            e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t,
            e.pending_buf[e.l_buf + e.last_lit] = 255 & a,
            e.last_lit++,
            0 === t ? e.dyn_ltree[2 * a]++ : (e.matches++,
            t--,
            e.dyn_ltree[2 * (B[a] + w + 1)]++,
            e.dyn_dtree[2 * c(t)]++),
            e.last_lit === e.lit_bufsize - 1
        }
        ,
        a._tr_align = function(e) {
            i(e, 2, 3),
            u(e, D, X),
            function(e) {
                16 === e.bi_valid ? (s(e, e.bi_buf),
                e.bi_buf = 0,
                e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = 255 & e.bi_buf,
                e.bi_buf >>= 8,
                e.bi_valid -= 8)
            }(e)
        }
    }
    , {
        "../utils/common": 1
    }],
    8: [function(e, t, a) {
        "use strict";
        t.exports = function() {
            this.input = null,
            this.next_in = 0,
            this.avail_in = 0,
            this.total_in = 0,
            this.output = null,
            this.next_out = 0,
            this.avail_out = 0,
            this.total_out = 0,
            this.msg = "",
            this.state = null,
            this.data_type = 2,
            this.adler = 0
        }
    }
    , {}],
    "/lib/deflate.js": [function(e, t, a) {
        "use strict";
        function r(e) {
            if (!(this instanceof r))
                return new r(e);
            this.options = c.assign({
                level: _,
                method: T,
                chunkSize: 16384,
                windowBits: 15,
                memLevel: 8,
                strategy: l,
                to: ""
            }, e || {});
            var t = this.options;
            t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16),
            this.err = 0,
            this.msg = "",
            this.ended = !1,
            this.chunks = [],
            this.strm = new u,
            this.strm.avail_out = 0;
            var a = o.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
            if (a !== h)
                throw new Error(i[a]);
            if (t.header && o.deflateSetHeader(this.strm, t.header),
            t.dictionary) {
                var n;
                if (n = "string" == typeof t.dictionary ? s.string2buf(t.dictionary) : "[object ArrayBuffer]" === d.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary,
                (a = o.deflateSetDictionary(this.strm, n)) !== h)
                    throw new Error(i[a]);
                this._dict_set = !0
            }
        }
        function n(e, t) {
            var a = new r(t);
            if (a.push(e, !0),
            a.err)
                throw a.msg || i[a.err];
            return a.result
        }
        var o = e("./zlib/deflate")
          , c = e("./utils/common")
          , s = e("./utils/strings")
          , i = e("./zlib/messages")
          , u = e("./zlib/zstream")
          , d = Object.prototype.toString
          , h = 0
          , _ = -1
          , l = 0
          , T = 8;
        r.prototype.push = function(e, t) {
            var a, r, n = this.strm, i = this.options.chunkSize;
            if (this.ended)
                return !1;
            r = t === ~~t ? t : !0 === t ? 4 : 0,
            "string" == typeof e ? n.input = s.string2buf(e) : "[object ArrayBuffer]" === d.call(e) ? n.input = new Uint8Array(e) : n.input = e,
            n.next_in = 0,
            n.avail_in = n.input.length;
            do {
                if (0 === n.avail_out && (n.output = new c.Buf8(i),
                n.next_out = 0,
                n.avail_out = i),
                1 !== (a = o.deflate(n, r)) && a !== h)
                    return this.onEnd(a),
                    this.ended = !0,
                    !1;
                0 !== n.avail_out && (0 !== n.avail_in || 4 !== r && 2 !== r) || ("string" === this.options.to ? this.onData(s.buf2binstring(c.shrinkBuf(n.output, n.next_out))) : this.onData(c.shrinkBuf(n.output, n.next_out)))
            } while ((n.avail_in > 0 || 0 === n.avail_out) && 1 !== a);
            return 4 === r ? (a = o.deflateEnd(this.strm),
            this.onEnd(a),
            this.ended = !0,
            a === h) : 2 !== r || (this.onEnd(h),
            n.avail_out = 0,
            !0)
        }
        ,
        r.prototype.onData = function(e) {
            this.chunks.push(e)
        }
        ,
        r.prototype.onEnd = function(e) {
            e === h && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = c.flattenChunks(this.chunks)),
            this.chunks = [],
            this.err = e,
            this.msg = this.strm.msg
        }
        ,
        a.Deflate = r,
        a.deflate = n,
        a.deflateRaw = function(e, t) {
            return (t = t || {}).raw = !0,
            n(e, t)
        }
        ,
        a.gzip = function(e, t) {
            return (t = t || {}).gzip = !0,
            n(e, t)
        }
    }
    , {
        "./utils/common": 1,
        "./utils/strings": 2,
        "./zlib/deflate": 5,
        "./zlib/messages": 6,
        "./zlib/zstream": 8
    }]
}, {}, [])("/lib/deflate.js"),
_securedTouchDependencies.evaluateModernizr = function() {
    !function(e, t, a, r) {
        function n(e, t) {
            return typeof e === t
        }
        function o() {
            return "function" != typeof a.createElement ? a.createElement(arguments[0]) : b ? a.createElementNS.call(a, "http://www.w3.org/2000/svg", arguments[0]) : a.createElement.apply(a, arguments)
        }
        function c(e, t) {
            return !!~("" + e).indexOf(t)
        }
        function s(e, t, r, n) {
            var c, s, i, u, d = "modernizr", h = o("div"), _ = function() {
                var e = a.body;
                return e || ((e = o(b ? "svg" : "body")).fake = !0),
                e
            }();
            if (parseInt(r, 10))
                for (; r--; )
                    (i = o("div")).id = n ? n[r] : d + (r + 1),
                    h.appendChild(i);
            return (c = o("style")).type = "text/css",
            c.id = "s" + d,
            (_.fake ? _ : h).appendChild(c),
            _.appendChild(h),
            c.styleSheet ? c.styleSheet.cssText = e : c.appendChild(a.createTextNode(e)),
            h.id = d,
            _.fake && (_.style.background = "",
            _.style.overflow = "hidden",
            u = m.style.overflow,
            m.style.overflow = "hidden",
            m.appendChild(_)),
            s = t(h, e),
            _.fake ? (_.parentNode.removeChild(_),
            m.style.overflow = u,
            m.offsetHeight) : h.parentNode.removeChild(h),
            !!s
        }
        function i(e) {
            return e.replace(/([A-Z])/g, function(e, t) {
                return "-" + t.toLowerCase()
            }).replace(/^ms-/, "-ms-")
        }
        function u(e, a, r) {
            var n;
            if ("getComputedStyle"in t) {
                n = getComputedStyle.call(t, e, a);
                var o = t.console;
                if (null !== n)
                    r && (n = n.getPropertyValue(r));
                else if (o) {
                    o[o.error ? "error" : "log"].call(o, "getComputedStyle returning null, its possible modernizr test results are inaccurate")
                }
            } else
                n = !a && e.currentStyle && e.currentStyle[r];
            return n
        }
        function d(e, a) {
            var n = e.length;
            if ("CSS"in t && "supports"in t.CSS) {
                for (; n--; )
                    if (t.CSS.supports(i(e[n]), a))
                        return !0;
                return !1
            }
            if ("CSSSupportsRule"in t) {
                for (var o = []; n--; )
                    o.push("(" + i(e[n]) + ":" + a + ")");
                return s("@supports (" + (o = o.join(" or ")) + ") { #modernizr { position: absolute; } }", function(e) {
                    return "absolute" === u(e, null, "position")
                })
            }
            return r
        }
        function h(e) {
            return e.replace(/([a-z])-([a-z])/g, function(e, t, a) {
                return t + a.toUpperCase()
            }).replace(/^-/, "")
        }
        function _(e, t, a, s) {
            function i() {
                _ && (delete w.style,
                delete w.modElem)
            }
            if (s = !n(s, "undefined") && s,
            !n(a, "undefined")) {
                var u = d(e, a);
                if (!n(u, "undefined"))
                    return u
            }
            for (var _, l, T, x, f, p = ["modernizr", "tspan", "samp"]; !w.style && p.length; )
                _ = !0,
                w.modElem = o(p.shift()),
                w.style = w.modElem.style;
            for (T = e.length,
            l = 0; l < T; l++)
                if (x = e[l],
                f = w.style[x],
                c(x, "-") && (x = h(x)),
                w.style[x] !== r) {
                    if (s || n(a, "undefined"))
                        return i(),
                        "pfx" !== t || x;
                    try {
                        w.style[x] = a
                    } catch (e) {}
                    if (w.style[x] !== f)
                        return i(),
                        "pfx" !== t || x
                }
            return i(),
            !1
        }
        function l(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        function T(e, t, a, r, o) {
            var c = e.charAt(0).toUpperCase() + e.slice(1)
              , s = (e + " " + y.join(c + " ") + c).split(" ");
            return n(t, "string") || n(t, "undefined") ? _(s, t, r, o) : function(e, t, a) {
                var r;
                for (var o in e)
                    if (e[o]in t)
                        return !1 === a ? e[o] : n(r = t[e[o]], "function") ? l(r, a || t) : r;
                return !1
            }(s = (e + " " + U.join(c + " ") + c).split(" "), t, a)
        }
        function x(e, t, a) {
            return T(e, r, r, t, a)
        }
        var f = []
          , p = {
            _version: "3.11.1",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function(e, t) {
                var a = this;
                setTimeout(function() {
                    t(a[e])
                }, 0)
            },
            addTest: function(e, t, a) {
                f.push({
                    name: e,
                    fn: t,
                    options: a
                })
            },
            addAsyncTest: function(e) {
                f.push({
                    name: null,
                    fn: e
                })
            }
        }
          , g = function() {};
        g.prototype = p,
        g = new g;
        var M = []
          , m = a.documentElement
          , b = "svg" === m.nodeName.toLowerCase()
          , v = function() {
            var e = !("onblur"in m);
            return function(t, a) {
                var n;
                return !!t && (a && "string" != typeof a || (a = o(a || "div")),
                !(n = (t = "on" + t)in a) && e && (a.setAttribute || (a = o("div")),
                a.setAttribute(t, ""),
                n = "function" == typeof a[t],
                a[t] !== r && (a[t] = r),
                a.removeAttribute(t)),
                n)
            }
        }();
        p.hasEvent = v,
        g.addTest("ambientlight", v("devicelight", t)),
        g.addTest("applicationcache", "applicationCache"in t),
        function() {
            var e = o("audio");
            g.addTest("audio", function() {
                var t = !1;
                try {
                    (t = !!e.canPlayType) && (t = new Boolean(t))
                } catch (e) {}
                return t
            });
            try {
                e.canPlayType && (g.addTest("audio.ogg", e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, "")),
                g.addTest("audio.mp3", e.canPlayType('audio/mpeg; codecs="mp3"').replace(/^no$/, "")),
                g.addTest("audio.opus", e.canPlayType('audio/ogg; codecs="opus"') || e.canPlayType('audio/webm; codecs="opus"').replace(/^no$/, "")),
                g.addTest("audio.wav", e.canPlayType('audio/wav; codecs="1"').replace(/^no$/, "")),
                g.addTest("audio.m4a", (e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/aac;")).replace(/^no$/, "")))
            } catch (e) {}
        }();
        var S = "Moz O ms Webkit"
          , y = p._config.usePrefixes ? S.split(" ") : [];
        p._cssomPrefixes = y;
        var E = {
            elem: o("modernizr")
        };
        g._q.push(function() {
            delete E.elem
        });
        var w = {
            style: E.elem.style
        };
        g._q.unshift(function() {
            delete w.style
        });
        var U = p._config.usePrefixes ? S.toLowerCase().split(" ") : [];
        p._domPrefixes = U,
        p.testAllProps = T;
        var R = function(e) {
            var a, n = V.length, o = t.CSSRule;
            if (void 0 === o)
                return r;
            if (!e)
                return !1;
            if ((a = (e = e.replace(/^@/, "")).replace(/-/g, "_").toUpperCase() + "_RULE")in o)
                return "@" + e;
            for (var c = 0; c < n; c++) {
                var s = V[c];
                if (s.toUpperCase() + "_" + a in o)
                    return "@-" + s.toLowerCase() + "-" + e
            }
            return !1
        };
        p.atRule = R;
        var I = p.prefixed = function(e, t, a) {
            return 0 === e.indexOf("@") ? R(e) : (-1 !== e.indexOf("-") && (e = h(e)),
            t ? T(e, t, a) : T(e, "pfx"))
        }
        ;
        g.addTest("batteryapi", !!I("battery", navigator) || !!I("getBattery", navigator), {
            aliases: ["battery-api"]
        }),
        g.addTest("blobconstructor", function() {
            try {
                return !!new Blob
            } catch (e) {
                return !1
            }
        }, {
            aliases: ["blob-constructor"]
        }),
        g.addTest("contextmenu", "contextMenu"in m && "HTMLMenuItemElement"in t),
        g.addTest("cors", "XMLHttpRequest"in t && "withCredentials"in new XMLHttpRequest);
        var A = I("crypto", t);
        g.addTest("crypto", !!I("subtle", A)),
        g.addTest("customelements", "customElements"in t),
        g.addTest("customprotocolhandler", function() {
            if (!navigator.registerProtocolHandler)
                return !1;
            try {
                navigator.registerProtocolHandler("thisShouldFail")
            } catch (e) {
                return e instanceof TypeError
            }
            return !1
        }),
        g.addTest("customevent", "CustomEvent"in t && "function" == typeof t.CustomEvent),
        g.addTest("dart", !!I("startDart", navigator)),
        g.addTest("dataview", "undefined" != typeof DataView && "getFloat64"in DataView.prototype),
        g.addTest("eventlistener", "addEventListener"in t),
        g.addTest("forcetouch", function() {
            return !!v(I("mouseforcewillbegin", t, !1), t) && MouseEvent.WEBKIT_FORCE_AT_MOUSE_DOWN && MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN
        }),
        g.addTest("fullscreen", !(!I("exitFullscreen", a, !1) && !I("cancelFullScreen", a, !1))),
        g.addTest("gamepads", !!I("getGamepads", navigator)),
        g.addTest("geolocation", "geolocation"in navigator),
        g.addTest("ie8compat", !t.addEventListener && !!a.documentMode && 7 === a.documentMode),
        g.addTest("intl", !!I("Intl", t)),
        g.addTest("json", "JSON"in t && "parse"in JSON && "stringify"in JSON),
        p.testAllProps = x,
        g.addTest("ligatures", x("fontFeatureSettings", '"liga" 1')),
        g.addTest("messagechannel", "MessageChannel"in t),
        g.addTest("notification", function() {
            if (!t.Notification || !t.Notification.requestPermission)
                return !1;
            if ("granted" === t.Notification.permission)
                return !0;
            try {
                new t.Notification("")
            } catch (e) {
                if ("TypeError" === e.name)
                    return !1
            }
            return !0
        }),
        g.addTest("pagevisibility", !!I("hidden", a, !1)),
        g.addTest("performance", !!I("performance", t));
        var C = [""].concat(U);
        p._domPrefixesAll = C,
        g.addTest("pointerevents", function() {
            for (var e = 0, t = C.length; e < t; e++)
                if (v(C[e] + "pointerdown"))
                    return !0;
            return !1
        }),
        g.addTest("pointerlock", !!I("exitPointerLock", a)),
        g.addTest("queryselector", "querySelector"in a && "querySelectorAll"in a),
        g.addTest("quotamanagement", function() {
            var e = I("temporaryStorage", navigator)
              , t = I("persistentStorage", navigator);
            return !(!e || !t)
        }),
        g.addTest("requestanimationframe", !!I("requestAnimationFrame", t), {
            aliases: ["raf"]
        }),
        g.addTest("serviceworker", "serviceWorker"in navigator);
        var V = p._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
        p._prefixes = V;
        var L = function() {
            var e = t.matchMedia || t.msMatchMedia;
            return e ? function(t) {
                var a = e(t);
                return a && a.matches || !1
            }
            : function(e) {
                var t = !1;
                return s("@media " + e + " { #modernizr { position: absolute; } }", function(e) {
                    t = "absolute" === u(e, null, "position")
                }),
                t
            }
        }();
        p.mq = L,
        g.addTest("touchevents", function() {
            if ("ontouchstart"in t || t.TouchEvent || t.DocumentTouch && a instanceof DocumentTouch)
                return !0;
            var e = ["(", V.join("touch-enabled),("), "heartz", ")"].join("");
            return L(e)
        }),
        g.addTest("typedarrays", "ArrayBuffer"in t),
        g.addTest("vibrate", !!I("vibrate", navigator)),
        function() {
            var e = o("video");
            g.addTest("video", function() {
                var t = !1;
                try {
                    (t = !!e.canPlayType) && (t = new Boolean(t))
                } catch (e) {}
                return t
            });
            try {
                e.canPlayType && (g.addTest("video.ogg", e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, "")),
                g.addTest("video.h264", e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, "")),
                g.addTest("video.h265", e.canPlayType('video/mp4; codecs="hev1"').replace(/^no$/, "")),
                g.addTest("video.webm", e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")),
                g.addTest("video.vp9", e.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, "")),
                g.addTest("video.hls", e.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, "")),
                g.addTest("video.av1", e.canPlayType('video/mp4; codecs="av01"').replace(/^no$/, "")))
            } catch (e) {}
        }(),
        g.addTest("webgl", function() {
            return "WebGLRenderingContext"in t
        });
        var D = !1;
        try {
            D = "WebSocket"in t && 2 === t.WebSocket.CLOSING
        } catch (e) {}
        g.addTest("websockets", D),
        g.addTest("xdomainrequest", "XDomainRequest"in t),
        g.addTest("matchmedia", !!I("matchMedia", t)),
        function() {
            var e, t, a, r, o, c;
            for (var s in f)
                if (f.hasOwnProperty(s)) {
                    if (e = [],
                    (t = f[s]).name && (e.push(t.name.toLowerCase()),
                    t.options && t.options.aliases && t.options.aliases.length))
                        for (a = 0; a < t.options.aliases.length; a++)
                            e.push(t.options.aliases[a].toLowerCase());
                    for (r = n(t.fn, "function") ? t.fn() : t.fn,
                    o = 0; o < e.length; o++)
                        1 === (c = e[o].split(".")).length ? g[c[0]] = r : (g[c[0]] && (!g[c[0]] || g[c[0]]instanceof Boolean) || (g[c[0]] = new Boolean(g[c[0]])),
                        g[c[0]][c[1]] = r),
                        M.push((r ? "" : "no-") + c.join("-"))
                }
        }(),
        delete p.addTest,
        delete p.addAsyncTest;
        for (var F = 0; F < g._q.length; F++)
            g._q[F]();
        e.Modernizr = g
    }(_securedTouchDependencies, window, document)
}
,
function(e) {
    var t = function() {
        function t() {
            this._isIphoneOrIPad = !1,
            (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) && (this._isIphoneOrIPad = !0),
            this.initUAParser()
        }
        return Object.defineProperty(t.prototype, "userAgentData", {
            get: function() {
                return this._userAgentData
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "deviceType", {
            get: function() {
                return this._deviceType || (e.SecuredTouchUtil.isMobile ? this._deviceType = this.mobileType || this.desktopType || t.UNKNOWN_DEVICE_TYPE : this._deviceType = this.desktopType || this.mobileType || t.UNKNOWN_DEVICE_TYPE),
                this._deviceType
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "isIphoneOrIPad", {
            get: function() {
                return this._isIphoneOrIPad
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "browserName", {
            get: function() {
                return this._userAgentData && this._userAgentData.browser && this._userAgentData.browser.name ? this._userAgentData.browser.name.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "browserVersion", {
            get: function() {
                return this._userAgentData && this._userAgentData.browser && this._userAgentData.browser.version ? this._userAgentData.browser.version.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "osName", {
            get: function() {
                return this._userAgentData && this._userAgentData.os && this._userAgentData.os.name ? this._userAgentData.os.name.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "osVersion", {
            get: function() {
                return this._userAgentData && this._userAgentData.os && this._userAgentData.os.version ? this._userAgentData.os.version.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "deviceCategory", {
            get: function() {
                return this._userAgentData && this._userAgentData.device ? this._userAgentData.device.type : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "engineName", {
            get: function() {
                return this._userAgentData && this._userAgentData.engine && this._userAgentData.engine.name ? this._userAgentData.engine.name.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "engineVersion", {
            get: function() {
                return this._userAgentData && this._userAgentData.engine && this._userAgentData.engine.version ? this._userAgentData.engine.version.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "cpuArchitecture", {
            get: function() {
                return this._userAgentData && this._userAgentData.cpu && this._userAgentData.cpu.architecture ? this._userAgentData.cpu.architecture.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "deviceModel", {
            get: function() {
                return this._userAgentData && this._userAgentData.device && this._userAgentData.device.model ? this._userAgentData.device.model.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "deviceVendor", {
            get: function() {
                return this._userAgentData && this._userAgentData.device && this._userAgentData.device.vendor ? this._userAgentData.device.vendor.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "desktopType", {
            get: function() {
                var e = this.browserName;
                this.browserVersion && (e = e + "(" + this.browserVersion + ")");
                var t = this.osName;
                this.osVersion && (t = t + "(" + this.osVersion + ")");
                var a = e && t ? e + "-" + t : e || t;
                return a ? a.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "mobileType", {
            get: function() {
                var e = this.deviceModel
                  , t = this.deviceVendor
                  , a = e && t ? e + " " + t : e || t;
                return a ? a.trim() : ""
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.initUAParser = function() {
            try {
                var t = new _securedTouchDependencies.UAParser;
                t.setUA(navigator.userAgent),
                this._userAgentData = t.getResult()
            } catch (t) {
                e.STLogger.warn("UAParser failure", t)
            }
        }
        ,
        t.UNKNOWN_DEVICE_TYPE = "unknown",
        t
    }();
    e.BrowserInfo = t
}(_securedTouchUtils || (_securedTouchUtils = {})),
function(e) {
    var t = function() {
        function e() {}
        return Object.defineProperty(e, "CLIENT_VERSION", {
            get: function() {
                return "3.13.2w"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SALT", {
            get: function() {
                return "ST8irbd3bB"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "WINDOW_ID_KEY", {
            get: function() {
                return "SecuredTouchWindowId"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "OPS_KEY", {
            get: function() {
                return "Ops"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "WEB_GL_KEY", {
            get: function() {
                return "WebGlId"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "INIT_PARAMS_KEY", {
            get: function() {
                return "SecuredTouchInitParams"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "INIT_PARAMS_KEY_V2", {
            get: function() {
                return "SecuredTouchPointerParams"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "INIT_PARAMS_TS_KEY", {
            get: function() {
                return "SecuredTouchInitParamsTS"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "INIT_PARAMS_TTL_KEY", {
            get: function() {
                return "SecuredTouchInitParamsTTL"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "ST_INIT_KEY", {
            get: function() {
                return "SecuredTouchInitST"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "APP_SESSION_ID_KEY", {
            get: function() {
                return "SecuredTouchAppSessionId"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "LAST_DISPOSED_PAYLOAD_KEY", {
            get: function() {
                return "SecuredTouchDisposedPayload"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "LAST_DISPOSED_TS_KEY", {
            get: function() {
                return "SecuredTouchDisposedTimestamp"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "DEVICE_ID_KEY", {
            get: function() {
                return "SecuredTouchDeviceId"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "REMOTE_LOG_ENABLED_KEY", {
            get: function() {
                return "SecuredTouchRemoteLogEnabled"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "USER_ID_KEY", {
            get: function() {
                return "SecuredTouchUserId"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "USER_ID_TS_KEY", {
            get: function() {
                return "SecuredTouchUserIdTs"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SDK_MODE_KEY", {
            get: function() {
                return "SecuredTouchSdkMode"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SDK_FIRST_LOAD_KEY", {
            get: function() {
                return "SecuredTouchSdkFirstLoad"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SDK_METADATA_STARTED_KEY", {
            get: function() {
                return "SecuredTouchSdkMetadataStarted"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "ENVELOPE_KEY", {
            get: function() {
                return "SecuredTouchEnvelopeData"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "CAPTURED_KEYBOARD_INTERACTIONS", {
            get: function() {
                return "SecuredTouchCapturedKeyboard"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "CAPTURED_MOUSE_INTERACTIONS", {
            get: function() {
                return "SecuredTouchCapturedMouse"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "CAPTURED_GESTURES", {
            get: function() {
                return "SecuredTouchCapturedGestures"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "CAPTURED_INDIRECT", {
            get: function() {
                return "SecuredTouchCapturedIndirect"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "CANCELED_INTERACTIONS", {
            get: function() {
                return "SecuredTouchCanceledInteractions"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SESSION_STORAGE_UPDATE_TS", {
            get: function() {
                return "SecuredTouchBufferPushedTs"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SESSION_STORAGE_TTL_MILLIS", {
            get: function() {
                return 1e4
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "METADATA_TTL_MILLIS", {
            get: function() {
                return 5184e5
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "HEART_BEAT_TAG", {
            get: function() {
                return "HeartBeat"
            },
            enumerable: !1,
            configurable: !0
        }),
        e
    }();
    e.SecuredTouchConstants = t
}(_securedTouchUtils || (_securedTouchUtils = {})),
function(e) {
    var t = function() {
        function e() {}
        return Object.defineProperty(e, "isLogEnabled", {
            get: function() {
                return this._isLogEnabled || window["enable-logs-securedtouch"]
            },
            set: function(e) {
                this._isLogEnabled = e
            },
            enumerable: !1,
            configurable: !0
        }),
        e.debug = function(t) {
            for (var a = [], r = 1; r < arguments.length; r++)
                a[r - 1] = arguments[r];
            t = "[WebSDK] " + t,
            e.isLogEnabled && (a && a.length > 0 ? console.debug ? console.debug(t, a) : console.log(t, a) : console.debug ? console.debug(t) : console.log(t))
        }
        ,
        e.error = function(t) {
            for (var a = [], r = 1; r < arguments.length; r++)
                a[r - 1] = arguments[r];
            t = "[WebSDK] " + t,
            e.isLogEnabled && (a && a.length > 0 ? console.error(t, a) : console.error(t))
        }
        ,
        e.warn = function(t) {
            for (var a = [], r = 1; r < arguments.length; r++)
                a[r - 1] = arguments[r];
            t = "[WebSDK] " + t,
            e.isLogEnabled && (a && a.length > 0 ? console.warn(t, a) : console.warn(t))
        }
        ,
        e.info = function(t) {
            for (var a = [], r = 1; r < arguments.length; r++)
                a[r - 1] = arguments[r];
            t = "[WebSDK] " + t,
            e.isLogEnabled && (a && a.length > 0 ? console.info(t, a) : console.info(t))
        }
        ,
        e
    }();
    e.STLogger = t
}(_securedTouchUtils || (_securedTouchUtils = {})),
function(e) {
    var t = function() {
        function t() {}
        return Object.defineProperty(t, "isMobile", {
            get: function() {
                var e, t = !1;
                return e = navigator.userAgent || navigator.vendor || window.opera,
                (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4))) && (t = !0),
                t
            },
            enumerable: !1,
            configurable: !0
        }),
        t.newGuid = function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                var t = 16 * Math.random() | 0;
                return ("x" === e ? t : 3 & t | 8).toString(16)
            })
        }
        ,
        t.ieFix = function() {
            (-1 != navigator.userAgent.indexOf("MSIE") ? /MSIE (\d+\.\d+);/ : /Trident.*rv[ :]*(\d+\.\d+)/).test(navigator.userAgent) && (document.body.setAttribute("style", "-ms-touch-action:none;"),
            document.body.style.touchAction = "none",
            document.body.style.msTouchAction = "none")
        }
        ,
        t.now = function() {
            var e = window.performance || {};
            return e.now = e.now || e.webkitNow || e.msNow || e.oNow || e.mozNow || function() {
                return (new Date).getTime()
            }
            ,
            e.now()
        }
        ,
        t.encodeBase64 = function(e) {
            var a, r, n, o, c, s, i, u = "", d = 0;
            for (e = t.utf8Encode(e); d < e.length; )
                o = (a = e.charCodeAt(d++)) >> 2,
                c = (3 & a) << 4 | (r = e.charCodeAt(d++)) >> 4,
                s = (15 & r) << 2 | (n = e.charCodeAt(d++)) >> 6,
                i = 63 & n,
                isNaN(r) ? s = i = 64 : isNaN(n) && (i = 64),
                u = u + t.keyStr.charAt(o) + t.keyStr.charAt(c) + t.keyStr.charAt(s) + t.keyStr.charAt(i);
            return u
        }
        ,
        t.utf8Encode = function(e) {
            e = e.replace(/\r\n/g, "\n");
            for (var t = "", a = 0; a < e.length; a++) {
                var r = e.charCodeAt(a);
                r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192),
                t += String.fromCharCode(63 & r | 128)) : (t += String.fromCharCode(r >> 12 | 224),
                t += String.fromCharCode(r >> 6 & 63 | 128),
                t += String.fromCharCode(63 & r | 128))
            }
            return t
        }
        ,
        t.hash = function(a) {
            var r = t.hashCache.get(a);
            return r || (r = _securedTouchDependencies.sha256(a + e.SecuredTouchConstants.SALT),
            t.hashCache.set(a, r)),
            r
        }
        ,
        t.hashMini = function(e) {
            var t, a, r = "" + JSON.stringify(e), n = 2166136261;
            for (t = 0,
            a = r.length; t < a; t++)
                n = Math.imul(31, n) + r.charCodeAt(t) | 0;
            return ("0000000" + (n >>> 0).toString(16)).substr(-8)
        }
        ,
        t.hashCode = function(e) {
            var t = 0
              , a = e ? e.length : 0
              , r = 0;
            if (a > 0)
                for (; r < a; )
                    t = (t << 5) - t + e.charCodeAt(r++) | 0;
            return t
        }
        ,
        t.mod = function(e, a) {
            return (t.hashCode(e) % a + a) % a
        }
        ,
        t.isEmail = function(t) {
            try {
                return t && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t.toLowerCase())
            } catch (t) {
                return e.STLogger.warn("isEmail function failed to parse string", t),
                !1
            }
        }
        ,
        t.getEmailDomain = function(e) {
            return t.isEmail(e) ? e.substring(e.lastIndexOf("@") + 1) : ""
        }
        ,
        t.extendPrimitiveValues = function(e, a, r) {
            for (var n = t.allKeys(a), o = 0; o < n.length; )
                t.isObject(a[n[o]]) || r && (!r || void 0 !== e[n[o]]) || (e[n[o]] = a[n[o]]),
                o++;
            return e
        }
        ,
        t.flatten = function(e) {
            var a = {};
            return t.dive("", e, a),
            a
        }
        ,
        t.isFunction = function(e) {
            return e && "function" == typeof e
        }
        ,
        t.isPassiveSupported = function() {
            var e = !1
              , t = function() {};
            try {
                var a = {
                    get passive() {
                        return e = !0,
                        !0
                    }
                };
                window.addEventListener("test", t, a),
                window.removeEventListener("test", t, !1)
            } catch (t) {
                e = !1
            }
            return e
        }
        ,
        t.getAttribute = function(e, t) {
            try {
                if (e && this.isFunction(e.getAttribute))
                    return e.getAttribute(t) || ""
            } catch (e) {}
            return ""
        }
        ,
        t.createInvisibleElement = function(t) {
            try {
                var a = document.createElement(t);
                return a.style.display = "none",
                a.style.border = "none",
                a.style.position = "absolute",
                a.style.top = "-999px",
                a.style.left = "-999px",
                a.style.width = "0",
                a.style.height = "0",
                a.style.visibility = "hidden",
                a
            } catch (t) {
                return e.STLogger.warn("Failed to create element", t),
                null
            }
        }
        ,
        t.values = function(e) {
            for (var a = t.allKeys(e), r = a.length, n = Array(r), o = 0; o < r; o++)
                n[o] = e[a[o]];
            return n
        }
        ,
        t.getValuesOfMap = function(e) {
            if (this.isFunction(e.values))
                return Array.from(e.values());
            var t = [];
            return e.forEach(function(e) {
                return t.push(e)
            }),
            t
        }
        ,
        t.modifiersKeys = function(e) {
            var t = [];
            return e.getModifierState && ["Alt", "AltGraph", "CapsLock", "Control", "Fn", "FnLock", "Hyper", "Meta", "NumLock", "OS", "ScrollLock", "Shift", "Super", "Symbol", "SymbolLock"].forEach(function(a) {
                e.getModifierState(a.toString()) && t.push(a)
            }),
            t
        }
        ,
        t.getElementText = function(e) {
            return e instanceof HTMLInputElement ? ["checkbox", "radio"].indexOf(e.type) >= 0 ? "" + e.checked : e.value : e.innerText
        }
        ,
        t.getSrcElement = function(e) {
            return e.srcElement || e.target
        }
        ,
        t.getObjectType = function(e) {
            try {
                var t = /function (.{1,})\(/.exec(e.constructor.toString());
                return t && t.length > 1 ? t[1] : ""
            } catch (e) {
                return ""
            }
        }
        ,
        t.isSelectorMatches = function(e, t, a) {
            try {
                var r = Element.prototype
                  , n = r.matches || r.webkitMatchesSelector || r.mozMatchesSelector || r.msMatchesSelector
                  , o = 0;
                do {
                    if (n.call(e, t))
                        return !0;
                    e = e.parentElement || e.parentNode
                } while (null !== e && 1 === e.nodeType && o++ < a);
                return !1
            } catch (e) {
                return !1
            }
        }
        ,
        t.isArray = function(e) {
            return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e)
        }
        ,
        t.safeJsonParse = function(t) {
            var a = null;
            try {
                t && (a = JSON.parse(t))
            } catch (t) {
                e.STLogger.warn("Failed to parse object " + t),
                a = null
            }
            return a
        }
        ,
        t.getElementSelectionStart = function(e) {
            var t;
            try {
                t = e.selectionStart
            } catch (e) {
                t = ""
            }
            return t
        }
        ,
        t.getElementSelectionEnd = function(e) {
            var t;
            try {
                t = e.selectionEnd
            } catch (e) {
                t = ""
            }
            return t
        }
        ,
        t.getDeviceOrientation = function() {
            var e = screen.orientation || screen.mozOrientation || {}
              , t = screen.msOrientation || e.type
              , a = e.angle;
            return {
                orientation: t ? t.toString() : "",
                angle: void 0 !== a && null !== a ? a.toString() : ""
            }
        }
        ,
        t.getCookie = function(e) {
            var t = document.cookie.match("(^|;) ?" + e + "=([^;]*)(;|$)");
            return t ? t[2] : null
        }
        ,
        t.setCookie = function(e, t, a) {
            var r = new Date;
            r.setTime(r.getTime() + 1e3 * a),
            document.cookie = e + "=" + t + ";path=/;secure;expires=" + r.toUTCString()
        }
        ,
        t.deleteCookie = function(e) {
            t.setCookie(e, "", -1)
        }
        ,
        t.delay = function(e) {
            return new Promise(function(t) {
                return setTimeout(t, e)
            }
            )
        }
        ,
        t.validateAndCreateError = function(e, t) {
            var a = {
                errMsg: t,
                errCode: 0,
                error: null
            };
            return e ? ("object" == typeof e && e.hasOwnProperty("errMsg") && e.hasOwnProperty("errCode") && e.hasOwnProperty("error") ? (a.errMsg = t + " " + e.errMsg,
            a.errCode = e.errCode,
            a.error = e.error) : "string" == typeof e && (a.errMsg = t + " " + e),
            a) : a
        }
        ,
        t.createError = function(e, t, a) {
            return {
                errCode: e,
                errMsg: t,
                error: a
            }
        }
        ,
        t.getErrorAsString = function(e) {
            var t;
            if (e)
                try {
                    t = "string" == typeof e || e instanceof String ? e : e.stack ? e.stack : e instanceof Error ? e.toString() : JSON.stringify(e)
                } catch (a) {
                    t = e.toString()
                }
            return t || ""
        }
        ,
        t.getHostnameFromRegex = function(e) {
            if (e) {
                var t = e.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                return t && t[1]
            }
            return null
        }
        ,
        t.inIframe = function() {
            try {
                return window.self !== window.top
            } catch (e) {
                return !0
            }
        }
        ,
        t.promiseTimeout = function(e, t) {
            var a = new Promise(function(t, a) {
                var r = setTimeout(function() {
                    clearTimeout(r),
                    a("Timed out in " + e + "ms.")
                }, e)
            }
            );
            return Promise.race([t, a])
        }
        ,
        t.dive = function(e, a, r) {
            for (var n in a)
                if (a.hasOwnProperty(n)) {
                    var o = n
                      , c = a[n];
                    e.length > 0 && (o = e + "." + n),
                    t.isObject(c) ? t.dive(o, c, r) : r[o] = c
                }
        }
        ,
        t.isObject = function(e) {
            var t = typeof e;
            return "function" === t || "object" === t && !!e
        }
        ,
        t.allKeys = function(e) {
            if (!t.isObject(e))
                return [];
            var a = [];
            for (var r in e)
                a.push(r);
            return a
        }
        ,
        t.hashCache = new Map,
        t.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        t
    }();
    e.SecuredTouchUtil = t
}(_securedTouchUtils || (_securedTouchUtils = {}));
var __awaiter = this && this.__awaiter || function(e, t, a, r) {
    return new (a || (a = Promise))(function(n, o) {
        function c(e) {
            try {
                i(r.next(e))
            } catch (e) {
                o(e)
            }
        }
        function s(e) {
            try {
                i(r.throw(e))
            } catch (e) {
                o(e)
            }
        }
        function i(e) {
            var t;
            e.done ? n(e.value) : (t = e.value,
            t instanceof a ? t : new a(function(e) {
                e(t)
            }
            )).then(c, s)
        }
        i((r = r.apply(e, t || [])).next())
    }
    )
}
, __generator = this && this.__generator || function(e, t) {
    var a, r, n, o, c = {
        label: 0,
        sent: function() {
            if (1 & n[0])
                throw n[1];
            return n[1]
        },
        trys: [],
        ops: []
    };
    return o = {
        next: s(0),
        throw: s(1),
        return: s(2)
    },
    "function" == typeof Symbol && (o[Symbol.iterator] = function() {
        return this
    }
    ),
    o;
    function s(o) {
        return function(s) {
            return function(o) {
                if (a)
                    throw new TypeError("Generator is already executing.");
                for (; c; )
                    try {
                        if (a = 1,
                        r && (n = 2 & o[0] ? r.return : o[0] ? r.throw || ((n = r.return) && n.call(r),
                        0) : r.next) && !(n = n.call(r, o[1])).done)
                            return n;
                        switch (r = 0,
                        n && (o = [2 & o[0], n.value]),
                        o[0]) {
                        case 0:
                        case 1:
                            n = o;
                            break;
                        case 4:
                            return c.label++,
                            {
                                value: o[1],
                                done: !1
                            };
                        case 5:
                            c.label++,
                            r = o[1],
                            o = [0];
                            continue;
                        case 7:
                            o = c.ops.pop(),
                            c.trys.pop();
                            continue;
                        default:
                            if (!(n = (n = c.trys).length > 0 && n[n.length - 1]) && (6 === o[0] || 2 === o[0])) {
                                c = 0;
                                continue
                            }
                            if (3 === o[0] && (!n || o[1] > n[0] && o[1] < n[3])) {
                                c.label = o[1];
                                break
                            }
                            if (6 === o[0] && c.label < n[1]) {
                                c.label = n[1],
                                n = o;
                                break
                            }
                            if (n && c.label < n[2]) {
                                c.label = n[2],
                                c.ops.push(o);
                                break
                            }
                            n[2] && c.ops.pop(),
                            c.trys.pop();
                            continue
                        }
                        o = t.call(e, c)
                    } catch (e) {
                        o = [6, e],
                        r = 0
                    } finally {
                        a = n = 0
                    }
                if (5 & o[0])
                    throw o[1];
                return {
                    value: o[0] ? o[1] : void 0,
                    done: !0
                }
            }([o, s])
        }
    }
}
, _securedTouchStorage, _securedTouchStorage, _securedTouchStorage, _securedTouchRemoteLogger, _securedTouchRemoteLogger, _securedTouchMetrics, _securedTouchMetrics, _securedTouchMetrics, _securedTouchMetrics, _securedTouchMetrics, _securedTouchMetrics;
!function(e) {
    var t = function() {
        function e(e, t) {
            this.crossStorageClient = new _securedTouchDependencies.CrossStorageClient(e,t)
        }
        return e.prototype.get = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.hash(e);
            return this.crossStorageClient.get(t)
        }
        ,
        e.prototype.del = function(e) {
            return this.crossStorageClient.del(_securedTouchUtils.SecuredTouchUtil.hash(e))
        }
        ,
        e.prototype.set = function(e, t, a) {
            return this.crossStorageClient.set(_securedTouchUtils.SecuredTouchUtil.hash(e), t, a)
        }
        ,
        e.prototype.onConnect = function() {
            return this.crossStorageClient.onConnect()
        }
        ,
        e
    }();
    e.SecuredTouchCrossStorage = t;
    var a = function() {
        function e(e) {
            this.storage = e
        }
        return e.prototype.get = function(e) {
            return Promise.resolve(this.storage.getItem(e))
        }
        ,
        e.prototype.del = function(e) {
            return this.storage.removeItem(e),
            Promise.resolve()
        }
        ,
        e.prototype.set = function(e, t) {
            return this.storage.setItem(e, t),
            Promise.resolve()
        }
        ,
        e.prototype.onConnect = function() {
            return Promise.resolve()
        }
        ,
        e
    }();
    e.SecuredTouchCrossStorageFallback = a
}(_securedTouchStorage || (_securedTouchStorage = {})),
function(e) {
    var t = function() {
        function t() {
            this.appId = "",
            this._disabledStorage = [];
            try {
                window.sessionStorage.setItem("_st_storage_enabled_check", "test"),
                window.sessionStorage.removeItem("_st_storage_enabled_check"),
                this.stSessionStorage = window.sessionStorage
            } catch (t) {
                _securedTouchUtils.STLogger.warn("session storage disabled"),
                this._disabledStorage.push("sessionStorage"),
                this.stSessionStorage = new e.SecuredTouchStorageFallback
            }
            try {
                window.localStorage.setItem("_st_storage_enabled_check", "test"),
                window.localStorage.removeItem("_st_storage_enabled_check"),
                this.stLocalStorage = new e.SecuredTouchStorageWrapper(window.localStorage)
            } catch (t) {
                _securedTouchUtils.STLogger.warn("local storage disabled"),
                this._disabledStorage.push("localStorage"),
                this.stLocalStorage = new e.SecuredTouchStorageWrapper(new e.SecuredTouchStorageFallback),
                this.crossStorage = new e.SecuredTouchCrossStorageFallback(this.stLocalStorage)
            }
        }
        return Object.defineProperty(t, "instance", {
            get: function() {
                return t._instance || (t._instance = new t),
                t._instance
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "windowId", {
            get: function() {
                return this.cachedWindowId || (this.cachedWindowId = this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.WINDOW_ID_KEY),
                this.cachedWindowId || (this.cachedWindowId = _securedTouchUtils.SecuredTouchUtil.newGuid(),
                this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.WINDOW_ID_KEY, this.cachedWindowId))),
                this.cachedWindowId
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "ops", {
            get: function() {
                var e = Number(this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.OPS_KEY));
                return isNaN(e) ? null : e
            },
            set: function(e) {
                e ? this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.OPS_KEY, e.toString()) : this.stSessionStorage.removeItem(_securedTouchUtils.SecuredTouchConstants.OPS_KEY)
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "disabledStorage", {
            get: function() {
                return this._disabledStorage
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "sessionStorage", {
            get: function() {
                return this.stSessionStorage
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "localStorage", {
            get: function() {
                return this.stLocalStorage
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "webGlID", {
            get: function() {
                return this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.WEB_GL_KEY)
            },
            set: function(e) {
                e ? this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.WEB_GL_KEY, e) : this.stSessionStorage.removeItem(_securedTouchUtils.SecuredTouchConstants.WEB_GL_KEY)
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "lastInitParamsTs", {
            get: function() {
                var e = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_TS_KEY + "-" + this.appId);
                return Number(this.stLocalStorage.getItem(e)) || 0
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "initParams", {
            get: function() {
                var e = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_KEY_V2 + "-" + this.appId)
                  , t = this.stLocalStorage.getItem(e);
                try {
                    return t ? JSON.parse(t) : null
                } catch (e) {
                    return _securedTouchUtils.STLogger.debug("SecuredTouchSession FAILED to deserialize initParams!"),
                    null
                }
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "initST", {
            get: function() {
                return Boolean(this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.ST_INIT_KEY))
            },
            set: function(e) {
                this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.ST_INIT_KEY, e.toString())
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "usernameTs", {
            get: function() {
                return Number(this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.USER_ID_TS_KEY)) || 0
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "appSessionId", {
            get: function() {
                return this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.APP_SESSION_ID_KEY) || ""
            },
            set: function(e) {
                e ? (_securedTouchUtils.STLogger.info("Set Session ID: " + e),
                this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.APP_SESSION_ID_KEY, e)) : this.stSessionStorage.removeItem(_securedTouchUtils.SecuredTouchConstants.APP_SESSION_ID_KEY)
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "lastDisposedPayload", {
            get: function() {
                var e = null;
                try {
                    var t = this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.LAST_DISPOSED_TS_KEY);
                    (new Date).getTime() - t <= _securedTouchUtils.SecuredTouchConstants.SESSION_STORAGE_TTL_MILLIS && (e = JSON.parse(this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.LAST_DISPOSED_PAYLOAD_KEY)))
                } catch (e) {
                    _securedTouchUtils.STLogger.warn("Failed to get last disposed payload", e)
                }
                return this.stSessionStorage.removeItem(_securedTouchUtils.SecuredTouchConstants.LAST_DISPOSED_PAYLOAD_KEY),
                this.stSessionStorage.removeItem(_securedTouchUtils.SecuredTouchConstants.LAST_DISPOSED_TS_KEY),
                e
            },
            set: function(e) {
                try {
                    e && (this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.LAST_DISPOSED_PAYLOAD_KEY, JSON.stringify(e)),
                    this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.LAST_DISPOSED_TS_KEY, (new Date).getTime()))
                } catch (e) {
                    _securedTouchUtils.STLogger.warn("Failed to save last disposed payload", e)
                }
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "applicationId", {
            set: function(e) {
                this.appId = e
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "passedBufferTimeout", {
            get: function() {
                var e = this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.SESSION_STORAGE_UPDATE_TS) || 0;
                return (new Date).getTime() - e > _securedTouchUtils.SecuredTouchConstants.SESSION_STORAGE_TTL_MILLIS
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "remoteLogEnabledByFactor", {
            get: function() {
                var e = this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.REMOTE_LOG_ENABLED_KEY);
                return null != e ? "true" === e : null
            },
            set: function(e) {
                this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.REMOTE_LOG_ENABLED_KEY, e)
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.initDeviceStorage = function(t, a) {
            return __awaiter(this, void 0, void 0, function() {
                var r;
                return __generator(this, function(n) {
                    switch (n.label) {
                    case 0:
                        return r = {
                            deviceId: this.stLocalStorage.getItem(_securedTouchUtils.SecuredTouchConstants.DEVICE_ID_KEY)
                        },
                        t && (this.crossStorage = new e.SecuredTouchCrossStorageFallback(this.stLocalStorage)),
                        r.deviceId ? (this.cachedDeviceId = r.deviceId,
                        this.crossStorage = new e.SecuredTouchCrossStorageFallback(this.stLocalStorage),
                        [3, 3]) : [3, 1];
                    case 1:
                        return this.crossStorage ? [3, 3] : [4, this.initCrossStorage(a)];
                    case 2:
                        n.sent(),
                        n.label = 3;
                    case 3:
                        return [2]
                    }
                })
            })
        }
        ,
        t.prototype.getLastMetadataTimeStamp = function() {
            return Number(this.stLocalStorage.getItem(this.getMetadataTsKey())) || 0
        }
        ,
        t.prototype.setLastMetadataTimeStamp = function(e) {
            this.stLocalStorage.setItem(this.getMetadataTsKey(), e)
        }
        ,
        t.prototype.getInitParamsTTLInMinutes = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_TTL_KEY + "-" + this.appId);
            return Number(this.stLocalStorage.getItem(t)) || e
        }
        ,
        t.prototype.setInitParams = function(e, t, a) {
            var r = e ? JSON.stringify(e) : null
              , n = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_KEY_V2 + "-" + this.appId);
            this.stLocalStorage.setItem(n, r);
            var o = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_TS_KEY + "-" + this.appId);
            this.stLocalStorage.setItem(o, (new Date).getTime());
            var c = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_TTL_KEY + "-" + this.appId);
            this.stLocalStorage.setItem(c, t),
            this.setSdkMode(a)
        }
        ,
        t.prototype.removeInitParams = function() {
            var e = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_KEY + "-" + this.appId)
              , t = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.INIT_PARAMS_KEY_V2 + "-" + this.appId)
              , a = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.SDK_MODE_KEY + "-" + this.appId);
            this.stLocalStorage.removeItem(e),
            this.stLocalStorage.removeItem(t),
            this.stLocalStorage.removeItem(a)
        }
        ,
        t.prototype.getUsername = function() {
            return this.stSessionStorage.getItem(_securedTouchUtils.SecuredTouchConstants.USER_ID_KEY) || ""
        }
        ,
        t.prototype.setUsername = function(e) {
            this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.USER_ID_TS_KEY, (new Date).getTime()),
            e ? this.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.USER_ID_KEY, e) : this.stSessionStorage.removeItem(_securedTouchUtils.SecuredTouchConstants.USER_ID_KEY)
        }
        ,
        t.prototype.getMetadataStartedTimeStamp = function() {
            var e = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.SDK_METADATA_STARTED_KEY + "-" + this.appId);
            return Number(this.stLocalStorage.getItem(e)) || 0
        }
        ,
        t.prototype.setMetadataStartedTimeStamp = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.SDK_METADATA_STARTED_KEY + "-" + this.appId);
            this.stLocalStorage.setItem(t, e)
        }
        ,
        t.prototype.getSdkMode = function() {
            var e = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.SDK_MODE_KEY + "-" + this.appId);
            return this.stLocalStorage.getItem(e)
        }
        ,
        t.prototype.setSdkMode = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.SDK_MODE_KEY + "-" + this.appId);
            this.stLocalStorage.setItem(t, e)
        }
        ,
        t.prototype.getFirstLoadedTimeMillis = function() {
            var e = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.SDK_FIRST_LOAD_KEY + "-" + this.appId);
            return this.stLocalStorage.getItem(e)
        }
        ,
        t.prototype.setFirstLoadedTimeMillis = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.SDK_FIRST_LOAD_KEY + "-" + this.appId);
            this.stLocalStorage.setItem(t, e)
        }
        ,
        t.prototype.getEnvelope = function() {
            var e = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.ENVELOPE_KEY + "-" + this.appId)
              , t = this.stLocalStorage.getItem(e);
            try {
                if (t)
                    return JSON.parse(t)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("failed to parse envelope data", e)
            }
            return {}
        }
        ,
        t.prototype.setEnvelope = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.hash(_securedTouchUtils.SecuredTouchConstants.ENVELOPE_KEY + "-" + this.appId);
            this.stLocalStorage.setItem(t, JSON.stringify(e))
        }
        ,
        t.prototype.resetDeviceCredentials = function(e) {
            e && e === this.cachedDeviceId || (this.cachedDeviceId = e || "Id-" + _securedTouchUtils.SecuredTouchUtil.newGuid(),
            this.crossStorage.set(_securedTouchUtils.SecuredTouchConstants.DEVICE_ID_KEY, this.cachedDeviceId),
            this.stLocalStorage.setItem(_securedTouchUtils.SecuredTouchConstants.DEVICE_ID_KEY, this.cachedDeviceId),
            _securedTouchUtils.STLogger.info("SecuredTouch deviceId: " + this.cachedDeviceId))
        }
        ,
        t.prototype.getDeviceCredentials = function() {
            return this.cachedDeviceId || this.resetDeviceCredentials(),
            {
                deviceId: this.cachedDeviceId
            }
        }
        ,
        t.prototype.initCrossStorage = function(t) {
            return __awaiter(this, void 0, void 0, function() {
                var a, r, n;
                return __generator(this, function(o) {
                    switch (o.label) {
                    case 0:
                        a = (t || "https://hub.securedtouch.com").replace(/\/$/, "") + "/hub.html",
                        o.label = 1;
                    case 1:
                        return o.trys.push([1, 4, , 5]),
                        this.crossStorage = new e.SecuredTouchCrossStorage(a,{
                            timeout: 1e4
                        }),
                        [4, this.crossStorage.onConnect()];
                    case 2:
                        return o.sent(),
                        r = this,
                        [4, this.crossStorage.get(_securedTouchUtils.SecuredTouchConstants.DEVICE_ID_KEY)];
                    case 3:
                        return r.cachedDeviceId = o.sent(),
                        this.cachedDeviceId && this.stLocalStorage.setItem(_securedTouchUtils.SecuredTouchConstants.DEVICE_ID_KEY, this.cachedDeviceId),
                        [3, 5];
                    case 4:
                        return n = o.sent(),
                        _securedTouchUtils.STLogger.warn("SecuredTouchSession crossStorage failed to connect " + n),
                        this._disabledStorage.push("hub"),
                        this.crossStorage = new e.SecuredTouchCrossStorageFallback(this.stLocalStorage),
                        [3, 5];
                    case 5:
                        return [2]
                    }
                })
            })
        }
        ,
        t.prototype.getMetadataTsKey = function() {
            return _securedTouchUtils.SecuredTouchUtil.hash("SecuredTouchMetadataTs-" + this.cachedDeviceId + "-" + this.appId)
        }
        ,
        t
    }();
    e.SecuredTouchSessionStorage = t
}(_securedTouchStorage || (_securedTouchStorage = {})),
function(e) {
    var t = function() {
        function e(e) {
            this.storage = e
        }
        return e.prototype.getItem = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.hash(e)
              , a = this.storage.getItem(t);
            return a || (a = this.storage.getItem(e)) && (this.storage.setItem(t, a),
            this.storage.removeItem(e)),
            a
        }
        ,
        e.prototype.removeItem = function(e) {
            return this.storage.removeItem(_securedTouchUtils.SecuredTouchUtil.hash(e))
        }
        ,
        e.prototype.setItem = function(e, t) {
            return this.storage.setItem(_securedTouchUtils.SecuredTouchUtil.hash(e), t)
        }
        ,
        e
    }();
    e.SecuredTouchStorageWrapper = t;
    var a = function() {
        function e() {
            this.internalStorageMap = new Map
        }
        return e.prototype.getItem = function(e) {
            return this.internalStorageMap.get(e)
        }
        ,
        e.prototype.removeItem = function(e) {
            this.internalStorageMap.delete(e)
        }
        ,
        e.prototype.setItem = function(e, t) {
            this.internalStorageMap.set(e, t)
        }
        ,
        e
    }();
    e.SecuredTouchStorageFallback = a
}(_securedTouchStorage || (_securedTouchStorage = {})),
function(e) {
    var t = function() {
        function e() {}
        return Object.defineProperty(e, "INITIALIZATION_ERROR", {
            get: function() {
                return 1e3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "UPDATING_USER_NAME_ERROR", {
            get: function() {
                return 1001
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "POST_INIT_ERROR", {
            get: function() {
                return 1002
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SEND_INIT_FAILED", {
            get: function() {
                return 3e3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SENDING_METADATA_ERROR", {
            get: function() {
                return 4e3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "GET_FINGERPRINT_ERROR", {
            get: function() {
                return 4001
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "MISSED_INTERACTIONS_ERROR", {
            get: function() {
                return 5e3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "QUEUE_OR_CREATE_PAYLOAD_ERROR", {
            get: function() {
                return 5001
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "GENERAL_ERROR", {
            get: function() {
                return 6e3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "PARSING_ERROR", {
            get: function() {
                return 6001
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "SERVER_ERROR", {
            get: function() {
                return 6002
            },
            enumerable: !1,
            configurable: !0
        }),
        e
    }();
    e.SecuredTouchErrorCodes = t
}(_securedTouchRemoteLogger || (_securedTouchRemoteLogger = {})),
function(e) {
    var t = function() {
        function t(e, a, r) {
            this.enabledFactor = window._remoteLogEnabledFactor ? Number(window._remoteLogEnabledFactor) : .01,
            this.counter = 0,
            this._deviceId = "",
            this.enabledByHostingApp = "boolean" != typeof e.externalLogsEnabled || e.externalLogsEnabled,
            this.logUrl = (e.externalLogsUrl || t.DEFAULT_LOGS_URL).replace(/\/$/, ""),
            this.applicationId = e.appId,
            this.pointerServerUrl = e.url,
            this.clientVersion = a,
            this.browserInfo = r,
            null == _securedTouchStorage.SecuredTouchSessionStorage.instance.remoteLogEnabledByFactor && (_securedTouchStorage.SecuredTouchSessionStorage.instance.remoteLogEnabledByFactor = Math.random() <= this.enabledFactor)
        }
        return Object.defineProperty(t.prototype, "deviceId", {
            set: function(e) {
                this._deviceId = e || ""
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.sendRemoteLog = function(t, a, r, n) {
            if (this.enabledByHostingApp && t.enabled && _securedTouchStorage.SecuredTouchSessionStorage.instance.remoteLogEnabledByFactor && this.counter < t.maxRemoteLogs) {
                var o = {
                    appId: this.applicationId,
                    instanceUUID: _securedTouchStorage.SecuredTouchSessionStorage.instance.windowId,
                    pointerServerUrl: this.pointerServerUrl,
                    clientVersion: this.clientVersion,
                    packageName: _securedTouchUtils.SecuredTouchUtil.getHostnameFromRegex(location.href),
                    deviceId: this._deviceId,
                    deviceType: this.browserInfo.deviceType,
                    osName: this.browserInfo.osName,
                    osVersion: this.browserInfo.osVersion,
                    browserName: this.browserInfo.browserName,
                    browserVersion: this.browserInfo.browserVersion,
                    location: location.href,
                    logsCount: this.counter++,
                    errorCode: a || e.SecuredTouchErrorCodes.GENERAL_ERROR,
                    message: r,
                    errorReason: _securedTouchUtils.SecuredTouchUtil.getErrorAsString(n),
                    enabledFactor: this.enabledFactor
                };
                this.postLog(o).catch(function(e) {
                    _securedTouchUtils.STLogger.warn("Failed to send log to SecuredTouch", e)
                })
            }
        }
        ,
        t.prototype.postLog = function(t) {
            var a = this;
            return new Promise(function(r, n) {
                try {
                    var o = new XMLHttpRequest;
                    o.open("POST", a.logUrl + "/log", !0),
                    o.timeout = 1e4,
                    o.setRequestHeader("Content-Type", "application/json"),
                    o.setRequestHeader("Accept", "application/json"),
                    o.onload = function() {
                        if (o.status >= 200 && o.status < 400)
                            r();
                        else {
                            var t = 0 !== o.status ? {
                                status: o.status,
                                statsText: o.statusText
                            } : null;
                            n(_securedTouchUtils.SecuredTouchUtil.createError(e.SecuredTouchErrorCodes.SERVER_ERROR, "failed to send log. ", t))
                        }
                    }
                    ,
                    o.ontimeout = function(t) {
                        n(_securedTouchUtils.SecuredTouchUtil.createError(e.SecuredTouchErrorCodes.SERVER_ERROR, "failed to send log. timeout error.", null))
                    }
                    ,
                    o.onerror = function(t) {
                        n(_securedTouchUtils.SecuredTouchUtil.createError(e.SecuredTouchErrorCodes.SERVER_ERROR, "network failure", null))
                    }
                    ;
                    var c = JSON.stringify(t)
                      , s = void 0;
                    try {
                        s = Boolean(_securedTouchDependencies.pako) && !window["unzip-securedtouch"]
                    } catch (e) {
                        s = !1
                    }
                    s ? (o.setRequestHeader("Content-Encoding", "gzip"),
                    o.send(_securedTouchDependencies.pako.gzip(c))) : o.send(c)
                } catch (e) {
                    n(e)
                }
            }
            )
        }
        ,
        t.DEFAULT_LOGS_URL = "https://logs.securedtouch.com",
        t
    }();
    e.SecuredTouchRemoteLogger = t
}(_securedTouchRemoteLogger || (_securedTouchRemoteLogger = {})),
function(e) {
    var t = function() {
        function e() {
            this.counter = 0,
            this._avg = 0
        }
        return Object.defineProperty(e.prototype, "avg", {
            get: function() {
                return this._avg
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.addValue = function(e) {
            this.counter++,
            this._avg = (this._avg * (this.counter - 1) + e) / this.counter
        }
        ,
        e.prototype.reset = function() {
            this.counter = 0,
            this._avg = 0
        }
        ,
        e
    }();
    e.IncrementalAverage = t
}(_securedTouchMetrics || (_securedTouchMetrics = {})),
function(e) {
    var t = function() {
        function e() {
            this._initTime = void 0
        }
        return e.prototype.onInitEnded = function(e) {
            e > 0 && (this._initTime = _securedTouchUtils.SecuredTouchUtil.now() - e)
        }
        ,
        e.prototype.resetValues = function() {
            this._initTime = void 0
        }
        ,
        e.prototype.setMetrics = function(e) {
            var t = this;
            e.addMetric("time.init.flow.max", this._initTime, function(e) {
                return !e || t._initTime > e
            })
        }
        ,
        e
    }();
    e.InitMetrics = t
}(_securedTouchMetrics || (_securedTouchMetrics = {})),
function(e) {
    var t = function() {
        function e() {
            this._calcTime = void 0
        }
        return e.prototype.onCalcEnded = function(e) {
            e > 0 && (this._calcTime = _securedTouchUtils.SecuredTouchUtil.now() - e)
        }
        ,
        e.prototype.resetValues = function() {
            this._calcTime = void 0
        }
        ,
        e.prototype.setMetrics = function(e) {
            var t = this;
            e.addMetric("time.metadata.calculation.max", this._calcTime, function(e) {
                return !e || t._calcTime > e
            })
        }
        ,
        e
    }();
    e.MetadataMetrics = t
}(_securedTouchMetrics || (_securedTouchMetrics = {})),
function(e) {
    var t = function() {
        function e() {}
        return Object.defineProperty(e, "METRIC_PREFIX", {
            get: function() {
                return "st.metrics"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e, "METRICS_ENABLED", {
            get: function() {
                return "stMetricsEnabled"
            },
            enumerable: !1,
            configurable: !0
        }),
        e
    }();
    e.MetricsConstants = t
}(_securedTouchMetrics || (_securedTouchMetrics = {})),
function(e) {
    var t = function() {
        function t() {
            this.avgInteractionTime = new e.IncrementalAverage,
            this.avgQueueSize = new e.IncrementalAverage,
            this.avgAttempt = new e.IncrementalAverage
        }
        return t.prototype.onInteractionSuccess = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.now() - e;
            this.avgInteractionTime.addValue(t)
        }
        ,
        t.prototype.setQueueSize = function(e) {
            this.avgQueueSize.addValue(e)
        }
        ,
        t.prototype.setAttempt = function(e) {
            this.avgAttempt.addValue(e)
        }
        ,
        t.prototype.resetValues = function() {
            this.avgInteractionTime.reset(),
            this.avgQueueSize.reset(),
            this.avgAttempt.reset()
        }
        ,
        t.prototype.setMetrics = function(e) {
            e.addMetric("time.interactions.e2e.avg", this.avgInteractionTime.avg),
            e.addMetric("count.queue.size.avg", this.avgQueueSize.avg),
            e.addMetric("count.request.attempt.avg", this.avgAttempt.avg)
        }
        ,
        t
    }();
    e.NetworkMetrics = t
}(_securedTouchMetrics || (_securedTouchMetrics = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.enabledFactor = window._metricsEnabledFactor ? Number(window._metricsEnabledFactor) : .01,
            this.stSessionStorage = t,
            this.metadata = new e.MetadataMetrics,
            this.init = new e.InitMetrics,
            this.network = new e.NetworkMetrics;
            var a = this.stSessionStorage.getItem(e.MetricsConstants.METRICS_ENABLED);
            null != a ? this.enabled = "true" === a : (this.enabled = Math.random() <= this.enabledFactor,
            this.stSessionStorage.setItem(e.MetricsConstants.METRICS_ENABLED, this.enabled))
        }
        return t.prototype.getMetricsData = function(t, a) {
            var r = {};
            try {
                if (this.enabled && t % a == 0) {
                    var n = this
                      , o = {
                        addMetric: function(t, a, o) {
                            if (t && null != a) {
                                var c = n.stSessionStorage.getItem(e.MetricsConstants.METRIC_PREFIX + "." + t);
                                o && !o(c) || (n.stSessionStorage.setItem(e.MetricsConstants.METRIC_PREFIX + "." + t, a),
                                r[t] = a)
                            }
                        }
                    };
                    this.metadata.setMetrics(o),
                    this.init.setMetrics(o),
                    this.network.setMetrics(o),
                    this.metadata.resetValues(),
                    this.init.resetValues(),
                    this.network.resetValues()
                }
            } catch (e) {
                _securedTouchUtils.STLogger.warn("Failed to add metrics", e)
            }
            return r
        }
        ,
        t
    }();
    e.SecuredTouchMetrics = t
}(_securedTouchMetrics || (_securedTouchMetrics = {}));
var _securedTouchMetadata_0x550c = ["TkFWSUdBVE9SX0FQUF9WRVJTSU9O", "YXBwVmVyc2lvbg==", "TkFWSUdBVE9SX09OX0xJTkU=", "b25MaW5l", "TkFWSUdBVE9SX1BMQVRGT1JN", "TkFWSUdBVE9SX1BST0RVQ1Q=", "cHJvZHVjdA==", "TkFWSUdBVE9SX1VTRVJfQUdFTlQ=", "TkFWSUdBVE9SX0RFVklDRV9NRU1PUlk=", "TkFWSUdBVE9SX0NPTk5FQ1RJT05fUlRU", "Y29ubmVjdGlvbg==", "cnR0", "bW9kZXJuaXpy", "c2FmZUFkZE1vZGVybml6ckZlYXR1cmVz", "X3NlY3VyZWRUb3VjaFBpbmdSZXN1bHQ=", "X1NUX1BJTkc=", "SlNfQ0hBTExFTkdF", "dW5rbm93bg==", "SVNfV0VCR0w=", "V0VCR0xWRU5ET1JBTkRSRU5ERVJFUg==", "SVNfV0VCR0wy", "V0VCR0wyVkVORE9SQU5EUkVOREVSRVI=", "SEFTTElFRExBTkdVQUdFUw==", "SEFTTElFRFJFU09MVVRJT04=", "SEFTTElFRE9T", "SEFTTElFREJST1dTRVI=", "aGFzT3duUHJvcGVydHk=", "Y29udGludWU=", "SlNfRk9OVFM=", "SVNfQ0FOVkFT", "UkVTT0xVVElPTg==", "am9pbg==", "QVZBSUxBQkxFX1JFU09MVVRJT04=", "VE9VQ0hfU1VQUE9SVA==", "QVVESU9fRklOR0VSUFJJTlQ=", "T1NfQ1BV", "UFJPRFVDVF9TVUI=", "RU1QVFlfRVZBTF9MRU5HVEg=", "RVJST1JfRkY=", "Q0hST01F", "Q09PS0lFU19FTkFCTEVE", "dG9VcHBlckNhc2U=", "SVNfSU5DT0dOSVRP", "SVNfUFJJVkFURV9NT0RF", "SVNfV0VCX0dMU1RBVFVT", "Z2V0QXR0cmlidXRl", "ZG9jdW1lbnQ=", "ZG9jdW1lbnRFbGVtZW50", "X3BoYW50b20=", "X19waGFudG9tYXM=", "Y2FsbFBoYW50b20=", "QnVmZmVy", "ZW1pdA==", "c3Bhd24=", "ZG9tQXV0b21hdGlvbkNvbnRyb2xsZXI=", "ZG9tQXV0b21hdGlvbg==", "b3V0ZXJXaWR0aA==", "b3V0ZXJIZWlnaHQ=", "SEVBRExFU1M=", "TElFUw==", "c3RyaW5naWZ5", "a2V5cw==", "U1RFQUxUSA==", "RGV0ZWN0U3RlYWx0aA==", "Z2V0U3RlYWx0aFJlc3VsdA==", "UkVGX0xJTks=", "cmVmZXJyZXI=", "UExVR0lOUw==", "ZGV0YWlscw==", "bmFtZQ==", "dmVyc2lvbg==", "ZmlsZW5hbWU=", "QVVESU8=", "VklERU8=", "VklERU9fSU5QVVRfREVWSUNFUw==", "QVVESU9fSU5QVVRfREVWSUNFUw==", "QVVESU9fT1VUUFVUX0RFVklDRVM=", "TUVESUFfQ09ERUNfTVA0X0FWQzE=", "Z2V0TWVkaWFDb2RlYw==", "dmlkZW8vbXA0OzsgY29kZWNzID0gImF2YzEuNDJFMDFFIg==", "TUVESUFfQ09ERUNfWF9NNEE=", "YXVkaW8veC1tNGE=", "TUVESUFfQ09ERUNfQUFD", "YXVkaW8vYWFj", "YWRkaXRpb25hbE1lZGlhQ29kZWNz", "TUVESUFfQ09ERUNf", "cGVyZm9ybWFuY2U=", "bWVtb3J5", "TUVNT1JZX0hFQVBfU0laRV9MSU1JVA==", "anNIZWFwU2l6ZUxpbWl0", "TUVNT1JZX1RPVEFMX0hFQVBfU0laRQ==", "dG90YWxKU0hlYXBTaXpl", "TUVNT1JZX1VTRURfSEVBUF9TSVpF", "dXNlZEpTSGVhcFNpemU=", "SVNfQUNDRVBUX0NPT0tJRVM=", "Y29va2llRW5hYmxlZA==", "Y29va2llQ2hhbGxlbmdl", "U1QtVEVTVA==", "c2V0Q29va2ll", "VEVTVA==", "Z2V0Q29va2ll", "ZGVsZXRlQ29va2ll", "c2VsZW5pdW1faW5fZG9jdW1lbnQ=", "U2VsZW5pdW1Qcm9wZXJ0aWVz", "c2VsZW5pdW1JbkRvY3VtZW50", "c2VsZW5pdW1faW5fd2luZG93", "c2VsZW5pdW1JbldpbmRvdw==", "c2VsZW5pdW1faW5fbmF2aWdhdG9y", "c2VsZW5pdW1Jbk5hdmlnYXRvcg==", "c2VsZW5pdW1fc2VxdWVudHVt", "c2VsZW5pdW1TZXF1ZW50dW0=", "RE9DVU1FTlRfRUxFTUVOVF9TRUxFTklVTQ==", "c2VsZW5pdW0=", "RE9DVU1FTlRfRUxFTUVOVF9XRUJEUklWRVI=", "RE9DVU1FTlRfRUxFTUVOVF9EUklWRVI=", "ZHJpdmVy", "d2luZG93X2h0bWxfd2ViZHJpdmVy", "Z2V0RWxlbWVudHNCeVRhZ05hbWU=", "aHRtbA==", "d2luZG93X2dlYg==", "Z2Vi", "d2luZG93X2F3ZXNvbWl1bQ==", "YXdlc29taXVt", "d2luZG93X1J1blBlcmZUZXN0", "UnVuUGVyZlRlc3Q=", "d2luZG93X2ZtZ2V0X3RhcmdldHM=", "Zm1nZXRfdGFyZ2V0cw==", "aGFzVHJ1c3RUb2tlbg==", "dHJ1c3RUb2tlbk9wZXJhdGlvbkVycm9y", "c2V0VHJ1c3RUb2tlbg==", "dHJ1c3RUb2tlbg==", "bG9jYWxTdG9yYWdlLmxlbmd0aA==", "c2Vzc2lvblN0b3JhZ2UubGVuZ3Ro", "ZGlzYWJsZWRTdG9yYWdl", "X0ZBSUxFRA==", "V0VCX1JUQ19FTkFCTEVE", "Y2xlYXI=", "bWF0Y2hNZWRpYQ==", "TVFfU0NSRUVO", "KG1pbi13aWR0aDog", "aW5uZXJXaWR0aA==", "cHgp", "bWF0Y2hlcw==", "bWVkaWE=", "YWRkSWZyYW1lRGF0YQ==", "Tk9USUZJQ0FUSU9OX1BFUk1JU1NJT04=", "cGVybWlzc2lvbg==", "SEFTX0NIUk9NRV9BUFA=", "YXBw", "SEFTX0NIUk9NRV9DU0k=", "Y3Np", "SEFTX0NIUk9NRV9MT0FEVElNRVM=", "bG9hZFRpbWVz", "SEFTX0NIUk9NRV9SVU5USU1F", "cnVudGltZQ==", "Q0hST01JVU1fTUFUSA==", "ZGV0ZWN0Q2hyb21pdW0=", "ZmxvYw==", "aXNGdW5jdGlvbg==", "aW50ZXJlc3RDb2hvcnQ=", "ZmxvY19pZA==", "ZmxvY192ZXJzaW9u", "cHJvcGVydHlEZXNjcmlwdG9ycw==", "d2luZG93", "YWRkUHJvcGVydHlEZXNjcmlwdG9ySW5mbw==", "X1BST1BFUlRZX0RFU0NSSVBUT1I=", "Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9y", "Y29uZmlndXJhYmxl", "ZW51bWVyYWJsZQ==", "d3JpdGFibGU=", "ZmFpbGVkIHRvIGFkZCBwcm9wZXJ0aWVzIGRlc2NyaXB0b3I=", "SUZSQU1FX0RBVEE=", "Y3JlYXRlSW52aXNpYmxlRWxlbWVudA==", "aWZyYW1l", "c3JjZG9j", "YmxhbmsgcGFnZQ==", "Ym9keQ==", "YXBwZW5kQ2hpbGQ=", "SUZSQU1FX0NIUk9NRQ==", "Y29udGVudFdpbmRvdw==", "SUZSQU1FX1dJRFRI", "SUZSQU1FX0hFSUdIVA==", "cmVtb3Zl", "ZmFpbGVkIHRvIGFkZCBpZnJhbWUgZGF0YQ==", "YWNjZWxlcm9tZXRlcg==", "YWNjZXNzaWJpbGl0eS1ldmVudHM=", "YW1iaWVudC1saWdodC1zZW5zb3I=", "YmFja2dyb3VuZC1zeW5j", "Y2FtZXJh", "Y2xpcGJvYXJkLXJlYWQ=", "Y2xpcGJvYXJkLXdyaXRl", "Z3lyb3Njb3Bl", "bWFnbmV0b21ldGVy", "bWljcm9waG9uZQ==", "bWlkaQ==", "bm90aWZpY2F0aW9ucw==", "cGF5bWVudC1oYW5kbGVy", "cGVyc2lzdGVudC1zdG9yYWdl", "cXVlcnk=", "c3RhdGU=", "dmlkZW8=", "Y2FuUGxheVR5cGU=", "ZXZhbHVhdGVNb2Rlcm5penI=", "TW9kZXJuaXpy", "cHJlZml4ZWQ=", "aGFzRXZlbnQ=", "YW1iaWVudF9saWdodA==", "YW1iaWVudGxpZ2h0", "YXBwbGljYXRpb25fY2FjaGU=", "YXBwbGljYXRpb25jYWNoZQ==", "YmF0dGVyeV9hcGk=", "YmF0dGVyeQ==", "YmxvYl9jb25zdHJ1Y3Rvcg==", "YmxvYmNvbnN0cnVjdG9y", "Y29udGV4dF9tZW51", "Y29udGV4dG1lbnU=", "Y29ycw==", "Y3J5cHRvZ3JhcGh5", "Y3VzdG9tX2VsZW1lbnRz", "Y3VzdG9tZWxlbWVudHM=", "Y3VzdG9tX3Byb3RvY29sX2hhbmRsZXI=", "Y3VzdG9tcHJvdG9jb2xoYW5kbGVy", "Y3VzdG9tX2V2ZW50", "Y3VzdG9tZXZlbnQ=", "ZGFydA==", "ZGF0YV92aWV3", "ZGF0YXZpZXc=", "ZXZlbnRfbGlzdGVuZXI=", "ZXZlbnRsaXN0ZW5lcg==", "c2FmZU1vZGVybml6ck9u", "ZXhpZm9yaWVudGF0aW9u", "ZXhpZl9vcmllbnRhdGlvbg==", "Zm9yY2VfdG91Y2g=", "Zm9yY2V0b3VjaA==", "Zm9yY2VfdG91Y2gubW91c2VfZm9yY2Vfd2lsbF9iZWdpbg==", "bW91c2Vmb3JjZXdpbGxiZWdpbg==", "Zm9yY2VfdG91Y2gud2Via2l0X2ZvcmNlX2F0X21vdXNlX2Rvd24=", "V0VCS0lUX0ZPUkNFX0FUX01PVVNFX0RPV04=", "Zm9yY2VfdG91Y2gud2Via2l0X2ZvcmNlX2F0X2ZvcmNlX21vdXNlX2Rvd24=", "V0VCS0lUX0ZPUkNFX0FUX0ZPUkNFX01PVVNFX0RPV04=", "ZnVsbF9zY3JlZW4=", "ZnVsbHNjcmVlbg==", "Z2FtZV9wYWRz", "Z2FtZXBhZHM=", "Z2VvX2xvY2F0aW9u", "aWU4Y29tcGF0", "aW5kZXhlZGRi", "aW5kZXhlZF9kYg==", "aW5kZXhlZF9kYl9ibG9i", "aW5kZXhlZGRiYmxvYg==", "aW50ZXJuYXRpb25hbGl6YXRpb24=", "aW50bA==", "anNvbg==", "bGlnYXR1cmVz", "bWVkaWFfc291cmNl", "TWVkaWFTb3VyY2U=", "bWVzc2FnZV9jaGFubmVs", "bWVzc2FnZWNoYW5uZWw=", "bm90aWZpY2F0aW9u", "cGFnZV92aXNpYmlsaXR5", "cGFnZXZpc2liaWxpdHk=", "cG9pbnRlcl9ldmVudHM=", "cG9pbnRlcmV2ZW50cw==", "cG9pbnRlcl9sb2Nr", "cG9pbnRlcmxvY2s=", "cHJveGltaXR5", "cXVlcnlfc2VsZWN0b3I=", "cXVlcnlzZWxlY3Rvcg==", "cXVvdGFfbWFuYWdlbWVudA==", "cXVvdGFtYW5hZ2VtZW50", "cmVxdWVzdF9hbmltYXRpb25fZnJhbWU=", "cmVxdWVzdGFuaW1hdGlvbmZyYW1l", "c2VydmljZV93b3JrZXI=", "c2VydmljZXdvcmtlcg==", "dG91Y2hfZXZlbnRz", "dG91Y2hldmVudHM=", "dHlwZWRfYXJyYXlz", "dHlwZWRhcnJheXM=", "d2ViX2ds", "d2ViX3NvY2tldHM=", "d2Vic29ja2V0cw==", "eF9kb21haW5fcmVxdWVzdA==", "eGRvbWFpbnJlcXVlc3Q=", "bWF0Y2htZWRpYQ==", "bW96Q29ubmVjdGlvbg==", "d2Via2l0Q29ubmVjdGlvbg==", "TkVUV09SS19UWVBF", "dHlwZQ==", "TkVUV09SS19ET1dOTE9BRF9NQVg=", "ZG93bmxpbmtNYXg=", "QkxVVE9PVEhfU1VQUE9SVEVE", "Ymx1ZXRvb3Ro", "SEFTX1NQRUFLRVJT", "SEFTX01JQ1JPUEhPTkU=", "SEFTX0NBTUVSQQ==", "QkFUVEVSWV9TVVBQT1JURUQ=", "QkFUVEVSWV9MRVZFTA==", "QkFUVEVSWV9DSEFSR0lORw==", "QkFUVEVSWV9DSEFSR0lOR19USU1F", "QkFUVEVSWV9ESVNDSEFSR0lOR19USU1F", "R1BTX1NVUFBPUlRFRA==", "SVNfTU9CSUxF", "aXNNb2JpbGU=", "SEFTX1RPVUNI", "UEVSTUlTU0lPTlM=", "UFJFRkVSU19DT0xPUl9TQ0hFTUU=", "KHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodCk=", "bGlnaHQ=", "KHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKQ==", "ZGFyaw==", "c2FmZUFkZE1ldGFkYXRh", "RmFpbGVkIHRvIGFkZCA=", "IC0+IA==", "TW9kZXJuaXpyLm9uIEZhaWxlZCB3aXRoIGZlYXR1cmUg", "b2JqZWN0", "ZmxhdHRlbg==", "c3FydA==", "cmFuZG9t", "T3BzIDog", "Z2V0V2ViR2w=", "bW96LXdlYmds", "d2Via2l0LTNk", "VkVSU0lPTg==", "V2VnR2wgZGVidWdJbmZvOiA=", "V2VnR2wgZmFpbHVyZSwgY29udGV4dCBpcyBudWxs", "V2VnR2wgZGlzY292ZXJ5IGZhaWx1cmU=", "V2VnR2wgOiA=", "ZGV0ZWN0UHJpdmF0ZU1vZGU=", "YmluZA==", "cmVtb3ZlSXRlbQ==", "d2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0=", "TW96QXBwZWFyYW5jZQ==", "c3R5bGU=", "b3Blbg==", "b25lcnJvcg==", "b25zdWNjZXNz", "SFRNTEVsZW1lbnQ=", "UG9pbnRlckV2ZW50", "TVNQb2ludGVyRXZlbnQ=", "YWNvcw==", "YWNvc2g=", "U1FSVDI=", "YXRhbg==", "YXRhbmg=", "Y2JydA==", "Y29z", "TE4y", "Y29zaA==", "TE9HMkU=", "ZXhwbTE=", "aHlwb3Q=", "bG9nMTA=", "c2lu", "c2luaA==", "dGFu", "dGFuaA==", "cG93", "U2VjdXJlZFRvdWNoTWV0YWRhdGE=", "X193ZWJkcml2ZXJfZXZhbHVhdGU=", "X19zZWxlbml1bV9ldmFsdWF0ZQ==", "X193ZWJkcml2ZXJfc2NyaXB0X2Z1bmN0aW9u", "X193ZWJkcml2ZXJfc2NyaXB0X2Z1bmM=", "X193ZWJkcml2ZXJfc2NyaXB0X2Zu", "X19meGRyaXZlcl9ldmFsdWF0ZQ==", "X19kcml2ZXJfdW53cmFwcGVk", "X193ZWJkcml2ZXJfdW53cmFwcGVk", "X19kcml2ZXJfZXZhbHVhdGU=", "X19zZWxlbml1bV91bndyYXBwZWQ=", "X19meGRyaXZlcl91bndyYXBwZWQ=", "X19uaWdodG1hcmU=", "X3NlbGVuaXVt", "Y2FsbGVkU2VsZW5pdW0=", "Y2FsbFNlbGVuaXVt", "X1NlbGVuaXVtX0lERV9SZWNvcmRlcg==", "X1dFQkRSSVZFUl9FTEVNX0NBQ0hF", "Q2hyb21lRHJpdmVydw==", "ZHJpdmVyLWV2YWx1YXRl", "d2ViZHJpdmVyLWV2YWx1YXRl", "c2VsZW5pdW0tZXZhbHVhdGU=", "d2ViZHJpdmVyQ29tbWFuZA==", "d2ViZHJpdmVyLWV2YWx1YXRlLXJlc3BvbnNl", "X193ZWJkcml2ZXJGdW5j", "X18kd2ViZHJpdmVyQXN5bmNFeGVjdXRvcg==", "X19sYXN0V2F0aXJBbGVydA==", "X19sYXN0V2F0aXJDb25maXJt", "X19sYXN0V2F0aXJQcm9tcHQ=", "JGNocm9tZV9hc3luY1NjcmlwdEluZm8=", "JGNkY19hc2RqZmxhc3V0b3BmaHZjWkxtY2ZsXw==", "ZXh0ZXJuYWw=", "U2VxdWVudHVt", "cHJvcGVydHlCbGFja0xpc3Q=", "cmVzdWx0", "ZG9jdW1lbnRMaWU=", "bGllZA==", "bGllVHlwZXM=", "Z2V0TGllcw==", "cmVwbGFjZQ==", "Z2V0VW5kZWZpbmVkVmFsdWVMaWU=", "Z2V0VG9TdHJpbmdMaWU=", "aWZyYW1lV2luZG93", "Z2V0UHJvdG90eXBlSW5GdW5jdGlvbkxpZQ==", "Z2V0T3duUHJvcGVydHlMaWU=", "Z2V0TmV3T2JqZWN0VG9TdHJpbmdUeXBlRXJyb3JMaWU=", "ZmlsdGVy", "TElFUy4=", "TElFU19JRlJBTUU=", "c2VhcmNoTGllcw==", "bWluRGVjaWJlbHM=", "Y29weUZyb21DaGFubmVs", "Z2V0RnJlcXVlbmN5UmVzcG9uc2U=", "Z2V0TGluZURhc2g=", "bGVmdA==", "Z2V0Q2xpZW50UmVjdHM=", "dGFyZ2V0", "aWdub3Jl", "Z2V0T3duUHJvcGVydHlOYW1lcw==", "Y29uc3RydWN0b3I=", "ZmFpbGVkIA==", "IHRlc3QgZXhlY3V0aW9u", "Y2hhckF0", "c2xpY2U=", "RnVuY3Rpb24=", "ZnVuY3Rpb24g", "KCkgeyBbbmF0aXZlIGNvZGVdIH0=", "ZnVuY3Rpb24gZ2V0IA==", "ZnVuY3Rpb24gKCkgeyBbbmF0aXZlIGNvZGVdIH0=", "KCkgew==", "ICAgIFtuYXRpdmUgY29kZV0=", "ZnVuY3Rpb24gKCkgew==", "YXJndW1lbnRz", "Y2FsbGVy", "Y3JlYXRl", "c3RhY2s=", "c3BsaXQ=", "ZmluZA==", "VHlwZUVycm9y", "YWRkU3RlYWx0aFRlc3Q=", "c3JjZG9jX3Rocm93c19lcnJvcg==", "c3JjZG9jX3RyaWdnZXJzX3dpbmRvd19wcm94eQ==", "aGFzaE1pbmk=", "Z2V0UmFuZG9tVmFsdWVz", "aW5kZXhfY2hyb21lX3Rvb19oaWdo", "Y29va2llU3RvcmU=", "b25kZXZpY2Vtb3Rpb24=", "c3BlZWNoU3ludGhlc2lz", "Y2hyb21lX3J1bnRpbWVfZnVuY3Rpb25zX2ludmFsaWQ=", "c2VuZE1lc3NhZ2U=", "Y29ubmVjdA==", "RnVuY3Rpb25fcHJvdG90eXBlX3RvU3RyaW5nX2ludmFsaWRfdHlwZUVycm9y", "U3RhY2tUcmFjZVRlc3Rlcg==", "aXNJbnZhbGlkU3RhY2tUcmFjZVNpemU=", "c3RlYWx0aCB0ZXN0IA==", "IGZhaWxlZA==", "eW91", "Y2FudA==", "aGlkZQ==", "aGVhZGxlc3NSZXN1bHRz", "aWZyYW1lX3dpbmRvdw==", "Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycw==", "cGFnZSBpbnRlbnRpb25hbGx5IGxlZnQgYmxhbms=", "ZnVuY3Rpb24gZ2V0IGNvbnRlbnRXaW5kb3coKSB7IFtuYXRpdmUgY29kZV0gfQ==", "aGVhZGxlc3NfY2hyb21l", "bmF2aWdhdG9y", "bmF2aWdhdG9yLndlYmRyaXZlcl9wcmVzZW50", "d2luZG93LmNocm9tZV9taXNzaW5n", "cGVybWlzc2lvbnNfYXBp", "ZGVuaWVk", "cHJvbXB0", "cGVybWlzc2lvbnNfYXBpX292ZXJyaWRlbg==", "ZnVuY3Rpb24gcXVlcnkoKSB7IFtuYXRpdmUgY29kZV0gfQ==", "ZnVuY3Rpb24gdG9TdHJpbmcoKSB7IFtuYXRpdmUgY29kZV0gfQ==", "W1tIYW5kbGVyXV0=", "W1tUYXJnZXRdXQ==", "W1tJc1Jldm9rZWRdXQ==", "bmF2aWdhdG9yLnBsdWdpbnNfZW1wdHk=", "bmF2aWdhdG9yLmxhbmd1YWdlc19ibGFuaw==", "Y29uc2lzdGVudF9wbHVnaW5zX3Byb3RvdHlwZQ==", "X19wcm90b19f", "Y29uc2lzdGVudF9taW1ldHlwZXNfcHJvdG90eXBl", "IGhlYWRsZXNzIHRlc3Qgd2FzIGZhaWxlZA==", "c3RvcmFnZQ==", "ZXN0aW1hdGU=", "cXVvdGE=", "aW5Qcml2YXRl", "bWF0Y2g=", "c2V0SXRlbQ==", "X19hd2FpdGVy", "bmV4dA==", "dGhyb3c=", "ZG9uZQ==", "dmFsdWU=", "dGhlbg==", "YXBwbHk=", "X19nZW5lcmF0b3I=", "ZnVuY3Rpb24=", "aXRlcmF0b3I=", "R2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLg==", "cmV0dXJu", "Y2FsbA==", "bGFiZWw=", "b3Bz", "cG9w", "dHJ5cw==", "bGVuZ3Ro", "cHVzaA==", "cHJvdG90eXBl", "aXNDYW52YXNTdXBwb3J0ZWQ=", "Y3JlYXRlRWxlbWVudA==", "Y2FudmFz", "Z2V0Q29udGV4dA==", "Z2V0V2ViZ2xDYW52YXM=", "d2ViZ2w=", "ZXhwZXJpbWVudGFsLXdlYmds", "d2ViZ2wy", "aXNXZWJHbFN1cHBvcnRlZA==", "V2ViR0xSZW5kZXJpbmdDb250ZXh0", "V2ViR0wyUmVuZGVyaW5nQ29udGV4dA==", "aXNXZWJHbA==", "Z2V0V2ViZ2xWZW5kb3JBbmRSZW5kZXJlcg==", "Z2V0RXh0ZW5zaW9u", "V0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbw==", "Z2V0UGFyYW1ldGVy", "VU5NQVNLRURfVkVORE9SX1dFQkdM", "VU5NQVNLRURfUkVOREVSRVJfV0VCR0w=", "Z2V0SGFzTGllZExhbmd1YWdlcw==", "bGFuZ3VhZ2Vz", "dW5kZWZpbmVk", "c3Vic3Ry", "bGFuZ3VhZ2U=", "Z2V0SGFzTGllZFJlc29sdXRpb24=", "c2NyZWVu", "d2lkdGg=", "YXZhaWxXaWR0aA==", "aGVpZ2h0", "YXZhaWxIZWlnaHQ=", "Z2V0SGFzTGllZE9z", "dXNlckFnZW50", "dG9Mb3dlckNhc2U=", "b3NjcHU=", "cGxhdGZvcm0=", "aW5kZXhPZg==", "d2luZG93cyBwaG9uZQ==", "V2luZG93cyBQaG9uZQ==", "d2lu", "V2luZG93cw==", "YW5kcm9pZA==", "QW5kcm9pZA==", "bGludXg=", "Y3Jvcw==", "TGludXg=", "aXBob25l", "aXBhZA==", "aU9T", "bWFj", "TWFj", "T3RoZXI=", "b250b3VjaHN0YXJ0", "bWF4VG91Y2hQb2ludHM=", "bXNNYXhUb3VjaFBvaW50cw==", "cGlrZQ==", "aXBvZA==", "cGx1Z2lucw==", "Z2V0SGFzTGllZEJyb3dzZXI=", "cHJvZHVjdFN1Yg==", "ZmlyZWZveA==", "RmlyZWZveA==", "b3BlcmE=", "b3By", "T3BlcmE=", "Y2hyb21l", "Q2hyb21l", "c2FmYXJp", "U2FmYXJp", "dHJpZGVudA==", "SW50ZXJuZXQgRXhwbG9yZXI=", "MjAwMzAxMDc=", "dG9TdHJpbmc=", "dG9Tb3VyY2U=", "RmluZ2VycHJpbnRMZWdhY3lNZXRhZGF0YQ==", "c2Vzc2lvbkRhdGE=", "c3RNZXRyaWNz", "bWV0YWRhdGFQYXJhbXM=", "aGFzTWljcm9waG9uZQ==", "aGFzU3BlYWtlcnM=", "aGFzV2ViY2Ft", "aXNCYXR0ZXJ5U3VwcG9ydGVk", "YmF0dGVyeUxldmVs", "YmF0dGVyeUNoYXJnaW5n", "YmF0dGVyeUNoYXJnaW5nVGltZQ==", "YmF0dGVyeURpc2NoYXJnaW5nVGltZQ==", "aGVhZGxlc3NUZXN0cw==", "bGllVGVzdHM=", "Z3BzU3VwcG9ydGVk", "ZmluZ2VyUHJpbnRDb21wb25lbnRLZXlz", "bmF2aWdhdG9yUGxhdGZvcm0=", "Y29sb3JEZXB0aA==", "ZGV2aWNlTWVtb3J5", "cGl4ZWxSYXRpbw==", "aGFyZHdhcmVDb25jdXJyZW5jeQ==", "c2NyZWVuUmVzb2x1dGlvbg==", "YXZhaWxhYmxlU2NyZWVuUmVzb2x1dGlvbg==", "dGltZXpvbmVPZmZzZXQ=", "dGltZXpvbmU=", "c2Vzc2lvblN0b3JhZ2U=", "bG9jYWxTdG9yYWdl", "aW5kZXhlZERC", "YWRkQmVoYXZpb3I=", "b3BlbkRhdGFiYXNl", "Y3B1Q2xhc3M=", "YWRCbG9jaw==", "dG91Y2hTdXBwb3J0", "Zm9udHM=", "YXVkaW8=", "b3NDcHU=", "ZW1wdHlFdmFsTGVuZ3Ro", "ZXJyb3JGRg==", "Y29va2llc0VuYWJsZWQ=", "d2ViR2xTdGF0dXM=", "bnVtYmVyT2ZWaWRlb0RldmljZXM=", "bnVtYmVyT2ZBdWRpb0RldmljZXM=", "dmlkZW9JbnB1dERldmljZXM=", "YXVkaW9JbnB1dERldmljZXM=", "YXVkaW9PdXRwdXREZXZpY2Vz", "d2ViUnRjSXBz", "aXNEZWxheVBhc3NlZA==", "aXNBdXRvRGVsZXRlQ29va2ll", "ZGVmaW5lUHJvcGVydHk=", "V0VCX0dMX0lE", "YnJvd3NlckluZm8=", "aXNJcGhvbmVPcklQYWQ=", "T1BT", "Z2V0T3Bz", "Z2V0RGV2aWNlTWV0YWRhdGE=", "U2VjdXJlZFRvdWNoVXRpbA==", "bm93", "Z2VvbG9jYXRpb24=", "bWV0YWRhdGFCbGFja0xpc3Q=", "Z2V0RmluZ2VyUHJpbnQ=", "Y2F0Y2g=", "U1RMb2dnZXI=", "d2Fybg==", "ZmFpbGVkIHRvIGdldCBmaW5nZXJwcmludCBpbmZv", "bWVzc2FnZQ==", "c2VuZFJlbW90ZUxvZw==", "cmVtb3RlTG9ncw==", "U2VjdXJlZFRvdWNoRXJyb3JDb2Rlcw==", "R0VUX0ZJTkdFUlBSSU5UX0VSUk9S", "ZXJy", "Z2V0UHJpdmF0ZU1vZGU=", "ZmFpbGVkIHRvIGdldCBpbmNvZ25pdG8gaW5mbw==", "U2VjdXJlZFRvdWNoSW5jb2duaXRv", "aXNQcml2YXRlTW9kZQ==", "ZmFpbGVkIHRvIGdldCBwcml2YXRlIG1vZGUgaW5mbw==", "Z2V0UGVybWlzc2lvbnNNZXRhZGF0YQ==", "ZmFpbGVkIHRvIGdldCBwZXJtaXNzaW9ucyBpbmZv", "U2VjdXJlZFRvdWNoRGV0ZWN0SGVhZGxlc3M=", "Z2V0SGVhZGxlc3NSZXN1bHRz", "ZmFpbGVkIHRvIGdldCBoZWFkbGVzcyByZXN1bHRz", "RGV0ZWN0TGllcw==", "Z2V0QWxsTGllcw==", "ZmFpbGVkIHRvIGdldCBsaWVzIHJlc3VsdHM=", "YXVkaW9JbnRWaWRlb0luaXQ=", "ZmFpbGVkIHRvIGdldCBhdWRpby12aWRlbyBpbmZv", "YmF0dGVyeUluaXQ=", "ZmFpbGVkIHRvIGdldCBiYXR0ZXJ5IGluZm8=", "YWxs", "c2VudA==", "ZmluZ2VyUHJpbnQ=", "aXNQcml2YXRlTW9kZVYy", "cGVybWlzc2lvbnM=", "ZGV2aWNlUGl4ZWxSYXRpbw==", "ZXh0ZW5kUHJpbWl0aXZlVmFsdWVz", "Z2V0VGltZQ==", "ZGV2aWNlVHlwZQ==", "Z2V0RGV2aWNlQ3JlZGVudGlhbHM=", "ZGV2aWNlSWQ=", "YXBwU2Vzc2lvbklk", "b3NOYW1l", "b3NWZXJzaW9u", "dHJpbQ==", "Z2V0U2Vuc29yc01ldGFkYXRh", "Z2V0SWRlbnRpZmljYXRpb25NZXRhZGF0YQ==", "aWRlbnRpZmljYXRpb25NZXRhZGF0YQ==", "aW9NZXRhZGF0YQ==", "Z2V0SW9NZXRhZGF0YQ==", "YmFzZVRpbWVzdGFtcA==", "ZXBvY2hUaW1lSW5NaWxsaXM=", "bWV0YWRhdGE=", "b25DYWxjRW5kZWQ=", "cHJvbWlzZVRpbWVvdXQ=", "Z2V0QmF0dGVyeQ==", "bGV2ZWw=", "Y2hhcmdpbmc=", "Y2hhcmdpbmdUaW1l", "ZGlzY2hhcmdpbmdUaW1l", "QmF0dGVyeSA=", "ZGVidWc=", "QmF0dGVyeSBub3Qgc3VwcG9ydGVkIQ==", "ZW51bWVyYXRlRGV2aWNlc0VuYWJsZWQ=", "dGVzdA==", "aW5JZnJhbWU=", "Z2V0UlRDUGVlckNvbm5lY3Rpb24=", "UlRDUGVlckNvbm5lY3Rpb24=", "bW96UlRDUGVlckNvbm5lY3Rpb24=", "d2Via2l0UlRDUGVlckNvbm5lY3Rpb24=", "aWZyYW1lLmNvbnRlbnRXaW5kb3c=", "Y29sbGVjdFdlYlJ0Yw==", "d2ViUnRjVXJs", "b25pY2VjYW5kaWRhdGU=", "Y2FuZGlkYXRl", "ZXhlYw==", "aG9zdA==", "c2V0", "V0VCX1JUQ19IT1NUX0lQ", "c3JmbHg=", "V0VCX1JUQ19TUkZMWF9JUA==", "Y3JlYXRlRGF0YUNoYW5uZWw=", "Y3JlYXRlT2ZmZXI=", "c2V0TG9jYWxEZXNjcmlwdGlvbg==", "ZW51bWVyYXRlRGV2aWNlcygpIGNhbm5vdCBydW4gd2l0aGluIHNhZmFyaSBpZnJhbWU=", "bWVkaWFEZXZpY2Vz", "ZW51bWVyYXRlRGV2aWNlcw==", "ZW51bWVyYXRlRGV2aWNlcygpIG5vdCBzdXBwb3J0ZWQu", "Zm9yRWFjaA==", "a2luZA==", "YXVkaW9pbnB1dA==", "dmlkZW9pbnB1dA==", "YXVkaW9vdXRwdXQ=", "ZW51bWVyYXRlRGV2aWNlcyBmYWlsZWQ=", "aGFz", "ZmluZ2VycHJpbnQ=", "cmVzb2x2ZQ==", "RmluZ2VycHJpbnRKUw==", "bG9hZA==", "Z2V0", "dmlzaXRvcklk", "ZmluZ2VyUHJpbnRDb21wb25lbnRz", "Y29tcG9uZW50cw==", "RmFpbGVkIHRvIGdldCBGaW5nZXJQcmludCA=", "RmluZ2VyUHJpbnQgZmFpbGVk", "ZGVsYXk=", "ZmluZ2VycHJpbnRUaW1lb3V0TWlsbGlz", "RmluZ2VycHJpbnQgdGltZW91dA==", "cmFjZQ==", "ZmxhdEFuZEFkZE1ldGFkYXRh", "REVEVkNFX0xJR0hUX1NVUFBPUlRFRA==", "b25kZXZpY2VsaWdodA==", "SVNfVE9VQ0hfREVWSUNF", "RGV2aWNlTW90aW9uRXZlbnQ=", "QUNDRUxFUk9NRVRFUl9TVVBQT1JURUQ=", "RGV2aWNlT3JpZW50YXRpb25FdmVudA==", "R1lST1NDT1BFX1NVUFBPUlRFRA==", "UFJPWElNSVRZX1NVUFBPUlRFRA==", "b25kZXZpY2Vwcm94aW1pdHk=", "RklOR0VSX1BSSU5U", "dXNlckFnZW50RGF0YQ==", "T1NfTkFNRQ==", "T1NfVkVSU0lPTg==", "REVWSUNFX01PREVM", "ZGV2aWNlTW9kZWw=", "REVWSUNFX1ZFTkRPUg==", "ZGV2aWNlVmVuZG9y", "QlJPV1NFUl9FTkdJTkVfTkFNRQ==", "ZW5naW5lTmFtZQ==", "QlJPV1NFUl9FTkdJTkVfVkVSU0lPTg==", "ZW5naW5lVmVyc2lvbg==", "Q1BVX0FSQ0hJVEVDVFVSRQ==", "Y3B1QXJjaGl0ZWN0dXJl", "TkFWSUdBVE9SX1ZFTkRPUg==", "dmVuZG9y", "TkFWSUdBVE9SX1BMVUdJTlNfTEVOR1RI", "TkFWSUdBVE9SX01JTUVfVFlQRVNfTEVOR1RI", "bWltZVR5cGVz", "TkFWSUdBVE9SX0xBTkdVQUdF", "dXNlckxhbmd1YWdl", "YnJvd3Nlckxhbmd1YWdl", "c3lzdGVtTGFuZ3VhZ2U=", "TkFWSUdBVE9SX0xBTkdVQUdFUw==", "TkFWSUdBVE9SX01BWF9UT1VDSF9QT0lOVFM=", "TkFWSUdBVE9SX1BPSU5URVJfRU5BQkxFRA==", "cG9pbnRlckVuYWJsZWQ=", "bXNQb2ludGVyRW5hYmxlZA==", "TkFWSUdBVE9SX1dFQl9EUklWRVI=", "d2ViZHJpdmVy", "TkFWSUdBVE9SX0hBUkRXQVJFX0NPTkNVUlJFTkNZ", "TkFWSUdBVE9SX1ZJQlJBVEU=", "dmlicmF0ZQ==", "UFVTSF9OT1RJRklDQVRJT05TX1NVUFBPUlRFRA==", "Tm90aWZpY2F0aW9u", "TkFWSUdBVE9SX0FQUF9DT0RFX05BTUU=", "YXBwQ29kZU5hbWU=", "TkFWSUdBVE9SX0FQUF9OQU1F", "YXBwTmFtZQ=="];
!function(e, t) {
    !function(t) {
        for (; --t; )
            e.push(e.shift())
    }(++t)
}(_securedTouchMetadata_0x550c, 486);
var _securedTouchMetadata_0x56ae = function(e, t) {
    var a, r = _securedTouchMetadata_0x550c[e -= 0];
    void 0 === _securedTouchMetadata_0x56ae.WeaAyl && ((a = function() {
        var e;
        try {
            e = Function('return (function() {}.constructor("return this")( ));')()
        } catch (t) {
            e = window
        }
        return e
    }()).atob || (a.atob = function(e) {
        for (var t, a, r = String(e).replace(/=+$/, ""), n = 0, o = 0, c = ""; a = r.charAt(o++); ~a && (t = n % 4 ? 64 * t + a : a,
        n++ % 4) ? c += String.fromCharCode(255 & t >> (-2 * n & 6)) : 0)
            a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a);
        return c
    }
    ),
    _securedTouchMetadata_0x56ae.oiKcbw = function(e) {
        for (var t = atob(e), a = [], r = 0, n = t.length; r < n; r++)
            a += "%" + ("00" + t.charCodeAt(r).toString(16)).slice(-2);
        return decodeURIComponent(a)
    }
    ,
    _securedTouchMetadata_0x56ae.wxBAyC = {},
    _securedTouchMetadata_0x56ae.WeaAyl = !0);
    var n = _securedTouchMetadata_0x56ae.wxBAyC[e];
    return void 0 === n ? (r = _securedTouchMetadata_0x56ae.oiKcbw(r),
    _securedTouchMetadata_0x56ae.wxBAyC[e] = r) : r = n,
    r
}, __awaiter = this && this[_securedTouchMetadata_0x56ae("0x0")] || function(e, t, a, r) {
    return new (a || (a = Promise))(function(n, o) {
        function c(e) {
            try {
                i(r[_securedTouchMetadata_0x56ae("0x1")](e))
            } catch (e) {
                o(e)
            }
        }
        function s(e) {
            try {
                i(r[_securedTouchMetadata_0x56ae("0x2")](e))
            } catch (e) {
                o(e)
            }
        }
        function i(e) {
            var t;
            e[_securedTouchMetadata_0x56ae("0x3")] ? n(e[_securedTouchMetadata_0x56ae("0x4")]) : (t = e[_securedTouchMetadata_0x56ae("0x4")],
            t instanceof a ? t : new a(function(e) {
                e(t)
            }
            ))[_securedTouchMetadata_0x56ae("0x5")](c, s)
        }
        i((r = r[_securedTouchMetadata_0x56ae("0x6")](e, t || []))[_securedTouchMetadata_0x56ae("0x1")]())
    }
    )
}
, __generator = this && this[_securedTouchMetadata_0x56ae("0x7")] || function(e, t) {
    var a, r, n, o, c = {
        label: 0,
        sent: function() {
            if (1 & n[0])
                throw n[1];
            return n[1]
        },
        trys: [],
        ops: []
    };
    return o = {
        next: s(0),
        throw: s(1),
        return: s(2)
    },
    typeof Symbol === _securedTouchMetadata_0x56ae("0x8") && (o[Symbol[_securedTouchMetadata_0x56ae("0x9")]] = function() {
        return this
    }
    ),
    o;
    function s(o) {
        return function(s) {
            return function(o) {
                if (a)
                    throw new TypeError(_securedTouchMetadata_0x56ae("0xa"));
                for (; c; )
                    try {
                        if (a = 1,
                        r && (n = 2 & o[0] ? r[_securedTouchMetadata_0x56ae("0xb")] : o[0] ? r[_securedTouchMetadata_0x56ae("0x2")] || ((n = r[_securedTouchMetadata_0x56ae("0xb")]) && n[_securedTouchMetadata_0x56ae("0xc")](r),
                        0) : r[_securedTouchMetadata_0x56ae("0x1")]) && !(n = n[_securedTouchMetadata_0x56ae("0xc")](r, o[1]))[_securedTouchMetadata_0x56ae("0x3")])
                            return n;
                        switch (r = 0,
                        n && (o = [2 & o[0], n[_securedTouchMetadata_0x56ae("0x4")]]),
                        o[0]) {
                        case 0:
                        case 1:
                            n = o;
                            break;
                        case 4:
                            return c[_securedTouchMetadata_0x56ae("0xd")]++,
                            {
                                value: o[1],
                                done: !1
                            };
                        case 5:
                            c[_securedTouchMetadata_0x56ae("0xd")]++,
                            r = o[1],
                            o = [0];
                            continue;
                        case 7:
                            o = c[_securedTouchMetadata_0x56ae("0xe")][_securedTouchMetadata_0x56ae("0xf")](),
                            c[_securedTouchMetadata_0x56ae("0x10")][_securedTouchMetadata_0x56ae("0xf")]();
                            continue;
                        default:
                            if (!(n = (n = c[_securedTouchMetadata_0x56ae("0x10")])[_securedTouchMetadata_0x56ae("0x11")] > 0 && n[n[_securedTouchMetadata_0x56ae("0x11")] - 1]) && (6 === o[0] || 2 === o[0])) {
                                c = 0;
                                continue
                            }
                            if (3 === o[0] && (!n || o[1] > n[0] && o[1] < n[3])) {
                                c[_securedTouchMetadata_0x56ae("0xd")] = o[1];
                                break
                            }
                            if (6 === o[0] && c[_securedTouchMetadata_0x56ae("0xd")] < n[1]) {
                                c[_securedTouchMetadata_0x56ae("0xd")] = n[1],
                                n = o;
                                break
                            }
                            if (n && c[_securedTouchMetadata_0x56ae("0xd")] < n[2]) {
                                c[_securedTouchMetadata_0x56ae("0xd")] = n[2],
                                c[_securedTouchMetadata_0x56ae("0xe")][_securedTouchMetadata_0x56ae("0x12")](o);
                                break
                            }
                            n[2] && c[_securedTouchMetadata_0x56ae("0xe")][_securedTouchMetadata_0x56ae("0xf")](),
                            c[_securedTouchMetadata_0x56ae("0x10")][_securedTouchMetadata_0x56ae("0xf")]();
                            continue
                        }
                        o = t[_securedTouchMetadata_0x56ae("0xc")](e, c)
                    } catch (e) {
                        o = [6, e],
                        r = 0
                    } finally {
                        a = n = 0
                    }
                if (5 & o[0])
                    throw o[1];
                return {
                    value: o[0] ? o[1] : void 0,
                    done: !0
                }
            }([o, s])
        }
    }
}
, _securedTouchMetadata, _securedTouchMetadata, _securedTouchMetadata, _securedTouchMetadata, _securedTouchMetadata, _securedTouchMetadata, _securedTouchMetadata;
!function(e) {
    var t = function() {
        function e() {}
        return e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x14")] = function() {
            var e = document[_securedTouchMetadata_0x56ae("0x15")](_securedTouchMetadata_0x56ae("0x16"));
            return !(!e[_securedTouchMetadata_0x56ae("0x17")] || !e[_securedTouchMetadata_0x56ae("0x17")]("2d"))
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x18")] = function(e) {
            var t = document[_securedTouchMetadata_0x56ae("0x15")](_securedTouchMetadata_0x56ae("0x16"))
              , a = null;
            try {
                a = e === _securedTouchMetadata_0x56ae("0x19") ? t[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x19")) || t[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x1a")) : t[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x1b"))
            } catch (e) {}
            return a || (a = null),
            a
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x1c")] = function(e) {
            if (!this[_securedTouchMetadata_0x56ae("0x14")]())
                return !1;
            var t = this[_securedTouchMetadata_0x56ae("0x18")](e);
            return (e === _securedTouchMetadata_0x56ae("0x19") ? !!window[_securedTouchMetadata_0x56ae("0x1d")] : !!window[_securedTouchMetadata_0x56ae("0x1e")]) && !!t
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x1f")] = function(e) {
            return !!this[_securedTouchMetadata_0x56ae("0x1c")](e) && !!this[_securedTouchMetadata_0x56ae("0x18")](e)
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x20")] = function(e) {
            try {
                if (this[_securedTouchMetadata_0x56ae("0x1c")](e)) {
                    var t = this[_securedTouchMetadata_0x56ae("0x18")](e)
                      , a = t[_securedTouchMetadata_0x56ae("0x21")](_securedTouchMetadata_0x56ae("0x22"));
                    return t[_securedTouchMetadata_0x56ae("0x23")](a[_securedTouchMetadata_0x56ae("0x24")]) + "~" + t[_securedTouchMetadata_0x56ae("0x23")](a[_securedTouchMetadata_0x56ae("0x25")])
                }
            } catch (e) {}
            return null
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x26")] = function() {
            if (typeof navigator[_securedTouchMetadata_0x56ae("0x27")] !== _securedTouchMetadata_0x56ae("0x28"))
                try {
                    if (navigator[_securedTouchMetadata_0x56ae("0x27")][0][_securedTouchMetadata_0x56ae("0x29")](0, 2) !== navigator[_securedTouchMetadata_0x56ae("0x2a")][_securedTouchMetadata_0x56ae("0x29")](0, 2))
                        return !0
                } catch (e) {
                    return !0
                }
            return !1
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x2b")] = function() {
            return window[_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x2d")] < window[_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x2e")] || window[_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x2f")] < window[_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x30")]
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x31")] = function() {
            var e, t = navigator[_securedTouchMetadata_0x56ae("0x32")][_securedTouchMetadata_0x56ae("0x33")](), a = navigator[_securedTouchMetadata_0x56ae("0x34")], r = navigator[_securedTouchMetadata_0x56ae("0x35")][_securedTouchMetadata_0x56ae("0x33")]();
            if (e = t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x37")) >= 0 ? _securedTouchMetadata_0x56ae("0x38") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x39")) >= 0 ? _securedTouchMetadata_0x56ae("0x3a") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3b")) >= 0 ? _securedTouchMetadata_0x56ae("0x3c") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3d")) >= 0 || t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3e")) >= 0 ? _securedTouchMetadata_0x56ae("0x3f") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x40")) >= 0 || t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x41")) >= 0 ? _securedTouchMetadata_0x56ae("0x42") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x43")) >= 0 ? _securedTouchMetadata_0x56ae("0x44") : _securedTouchMetadata_0x56ae("0x45"),
            (_securedTouchMetadata_0x56ae("0x46")in window || navigator[_securedTouchMetadata_0x56ae("0x47")] > 0 || navigator[_securedTouchMetadata_0x56ae("0x48")] > 0) && e !== _securedTouchMetadata_0x56ae("0x38") && e !== _securedTouchMetadata_0x56ae("0x3c") && e !== _securedTouchMetadata_0x56ae("0x42") && e !== _securedTouchMetadata_0x56ae("0x45"))
                return !0;
            if (typeof a !== _securedTouchMetadata_0x56ae("0x28")) {
                if ((a = a[_securedTouchMetadata_0x56ae("0x33")]())[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x39")) >= 0 && e !== _securedTouchMetadata_0x56ae("0x3a") && e !== _securedTouchMetadata_0x56ae("0x38"))
                    return !0;
                if (a[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3d")) >= 0 && e !== _securedTouchMetadata_0x56ae("0x3f") && e !== _securedTouchMetadata_0x56ae("0x3c"))
                    return !0;
                if (a[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x43")) >= 0 && e !== _securedTouchMetadata_0x56ae("0x44") && e !== _securedTouchMetadata_0x56ae("0x42"))
                    return !0;
                if ((-1 === a[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x39")) && -1 === a[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3d")) && -1 === a[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x43"))) != (e === _securedTouchMetadata_0x56ae("0x45")))
                    return !0
            }
            return r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x39")) >= 0 && e !== _securedTouchMetadata_0x56ae("0x3a") && e !== _securedTouchMetadata_0x56ae("0x38") || ((r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3d")) >= 0 || r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3b")) >= 0 || r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x49")) >= 0) && e !== _securedTouchMetadata_0x56ae("0x3f") && e !== _securedTouchMetadata_0x56ae("0x3c") || ((r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x43")) >= 0 || r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x41")) >= 0 || r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x4a")) >= 0 || r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x40")) >= 0) && e !== _securedTouchMetadata_0x56ae("0x44") && e !== _securedTouchMetadata_0x56ae("0x42") || ((r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x39")) < 0 && r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x3d")) < 0 && r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x43")) < 0 && r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x40")) < 0 && r[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x41")) < 0) !== (e === _securedTouchMetadata_0x56ae("0x45")) || typeof navigator[_securedTouchMetadata_0x56ae("0x4b")] === _securedTouchMetadata_0x56ae("0x28") && e !== _securedTouchMetadata_0x56ae("0x3a") && e !== _securedTouchMetadata_0x56ae("0x38"))))
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x4c")] = function() {
            var e, t = navigator[_securedTouchMetadata_0x56ae("0x32")][_securedTouchMetadata_0x56ae("0x33")](), a = navigator[_securedTouchMetadata_0x56ae("0x4d")];
            if (((e = t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x4e")) >= 0 ? _securedTouchMetadata_0x56ae("0x4f") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x50")) >= 0 || t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x51")) >= 0 ? _securedTouchMetadata_0x56ae("0x52") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x53")) >= 0 ? _securedTouchMetadata_0x56ae("0x54") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x55")) >= 0 ? _securedTouchMetadata_0x56ae("0x56") : t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x57")) >= 0 ? _securedTouchMetadata_0x56ae("0x58") : _securedTouchMetadata_0x56ae("0x45")) === _securedTouchMetadata_0x56ae("0x54") || e === _securedTouchMetadata_0x56ae("0x56") || e === _securedTouchMetadata_0x56ae("0x52")) && a !== _securedTouchMetadata_0x56ae("0x59"))
                return !0;
            var r, n = eval[_securedTouchMetadata_0x56ae("0x5a")]()[_securedTouchMetadata_0x56ae("0x11")];
            if (37 === n && e !== _securedTouchMetadata_0x56ae("0x56") && e !== _securedTouchMetadata_0x56ae("0x4f") && e !== _securedTouchMetadata_0x56ae("0x45"))
                return !0;
            if (39 === n && e !== _securedTouchMetadata_0x56ae("0x58") && e !== _securedTouchMetadata_0x56ae("0x45"))
                return !0;
            if (33 === n && e !== _securedTouchMetadata_0x56ae("0x54") && e !== _securedTouchMetadata_0x56ae("0x52") && e !== _securedTouchMetadata_0x56ae("0x45"))
                return !0;
            try {
                throw "a"
            } catch (e) {
                try {
                    e[_securedTouchMetadata_0x56ae("0x5b")](),
                    r = !0
                } catch (e) {
                    r = !1
                }
            }
            return r && e !== _securedTouchMetadata_0x56ae("0x4f") && e !== _securedTouchMetadata_0x56ae("0x45")
        }
        ,
        e
    }();
    e[_securedTouchMetadata_0x56ae("0x5c")] = t
}(_securedTouchMetadata || (_securedTouchMetadata = {})),
function(e) {
    var t = function() {
        function t(e, t, a) {
            this[_securedTouchMetadata_0x56ae("0x5d")] = e,
            this[_securedTouchMetadata_0x56ae("0x5e")] = t,
            this[_securedTouchMetadata_0x56ae("0x5f")] = a,
            this[_securedTouchMetadata_0x56ae("0x60")] = null,
            this[_securedTouchMetadata_0x56ae("0x61")] = null,
            this[_securedTouchMetadata_0x56ae("0x62")] = null,
            this[_securedTouchMetadata_0x56ae("0x63")] = null,
            this[_securedTouchMetadata_0x56ae("0x64")] = null,
            this[_securedTouchMetadata_0x56ae("0x65")] = null,
            this[_securedTouchMetadata_0x56ae("0x66")] = null,
            this[_securedTouchMetadata_0x56ae("0x67")] = null,
            this[_securedTouchMetadata_0x56ae("0x68")] = new Map,
            this[_securedTouchMetadata_0x56ae("0x69")] = {},
            this[_securedTouchMetadata_0x56ae("0x6a")] = null,
            this[_securedTouchMetadata_0x56ae("0x6b")] = new Set([_securedTouchMetadata_0x56ae("0x6c"), _securedTouchMetadata_0x56ae("0x6d"), _securedTouchMetadata_0x56ae("0x6e"), _securedTouchMetadata_0x56ae("0x6f"), _securedTouchMetadata_0x56ae("0x70"), _securedTouchMetadata_0x56ae("0x71"), _securedTouchMetadata_0x56ae("0x72"), _securedTouchMetadata_0x56ae("0x73"), _securedTouchMetadata_0x56ae("0x74"), _securedTouchMetadata_0x56ae("0x75"), _securedTouchMetadata_0x56ae("0x76"), _securedTouchMetadata_0x56ae("0x77"), _securedTouchMetadata_0x56ae("0x78"), _securedTouchMetadata_0x56ae("0x79"), _securedTouchMetadata_0x56ae("0x7a"), _securedTouchMetadata_0x56ae("0x35"), _securedTouchMetadata_0x56ae("0x16"), _securedTouchMetadata_0x56ae("0x7b"), _securedTouchMetadata_0x56ae("0x7c"), _securedTouchMetadata_0x56ae("0x7d"), _securedTouchMetadata_0x56ae("0x7e"), _securedTouchMetadata_0x56ae("0x7f"), _securedTouchMetadata_0x56ae("0x4d"), _securedTouchMetadata_0x56ae("0x80"), _securedTouchMetadata_0x56ae("0x81"), _securedTouchMetadata_0x56ae("0x53"), _securedTouchMetadata_0x56ae("0x82")]),
            this[_securedTouchMetadata_0x56ae("0x83")] = -1,
            this[_securedTouchMetadata_0x56ae("0x84")] = 0,
            this[_securedTouchMetadata_0x56ae("0x85")] = 0,
            this[_securedTouchMetadata_0x56ae("0x86")] = [],
            this[_securedTouchMetadata_0x56ae("0x87")] = [],
            this[_securedTouchMetadata_0x56ae("0x88")] = [],
            this[_securedTouchMetadata_0x56ae("0x89")] = new Map,
            this[_securedTouchMetadata_0x56ae("0x8a")] = !1,
            this[_securedTouchMetadata_0x56ae("0x8b")] = !1
        }
        return Object[_securedTouchMetadata_0x56ae("0x8c")](t[_securedTouchMetadata_0x56ae("0x13")], _securedTouchMetadata_0x56ae("0x8d"), {
            get: function() {
                return this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x8f")],
                ""
            },
            enumerable: !1,
            configurable: !0
        }),
        Object[_securedTouchMetadata_0x56ae("0x8c")](t[_securedTouchMetadata_0x56ae("0x13")], _securedTouchMetadata_0x56ae("0x90"), {
            get: function() {
                if (!this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x8f")])
                    return 0;
                var e = this[_securedTouchMetadata_0x56ae("0x5d")][_securedTouchMetadata_0x56ae("0xe")];
                return e || (e = this[_securedTouchMetadata_0x56ae("0x91")](),
                this[_securedTouchMetadata_0x56ae("0x5d")][_securedTouchMetadata_0x56ae("0xe")] = e),
                e
            },
            enumerable: !1,
            configurable: !0
        }),
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x92")] = function(t) {
            return __awaiter(this, void 0, void 0, function() {
                var a, r, n, o, c, s, i, u, d = this;
                return __generator(this, function(h) {
                    switch (h[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return a = _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x94")](),
                        this[_securedTouchMetadata_0x56ae("0x6a")] = null != navigator[_securedTouchMetadata_0x56ae("0x95")],
                        r = this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x96")],
                        n = [this[_securedTouchMetadata_0x56ae("0x97")](r)[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x9b"), e[_securedTouchMetadata_0x56ae("0x9c")]),
                            t && t[_securedTouchMetadata_0x56ae("0x9d")](d[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x9e")], _securedTouchRemoteLogger[_securedTouchMetadata_0x56ae("0x9f")][_securedTouchMetadata_0x56ae("0xa0")], e[_securedTouchMetadata_0x56ae("0x9c")], e[_securedTouchMetadata_0x56ae("0xa1")])
                        }), this[_securedTouchMetadata_0x56ae("0xa2")]()[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xa3"), e)
                        }), e[_securedTouchMetadata_0x56ae("0xa4")][_securedTouchMetadata_0x56ae("0xa5")]()[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xa6"), e)
                        }), this[_securedTouchMetadata_0x56ae("0xa7")]()[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xa8"), e)
                        }), new (e[_securedTouchMetadata_0x56ae("0xa9")])(r)[_securedTouchMetadata_0x56ae("0xaa")]()[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xab"), e)
                        }), new (e[_securedTouchMetadata_0x56ae("0xac")])(r)[_securedTouchMetadata_0x56ae("0xad")]()[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xae"), e)
                        }), this[_securedTouchMetadata_0x56ae("0xaf")]()[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xb0"), e)
                        }), this[_securedTouchMetadata_0x56ae("0xb1")]()[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xb2"), e)
                        })],
                        [4, Promise[_securedTouchMetadata_0x56ae("0xb3")](n)];
                    case 1:
                        return u = h[_securedTouchMetadata_0x56ae("0xb4")](),
                        this[_securedTouchMetadata_0x56ae("0xb5")] = u[0],
                        this[_securedTouchMetadata_0x56ae("0xa5")] = u[1],
                        this[_securedTouchMetadata_0x56ae("0xb6")] = u[2],
                        this[_securedTouchMetadata_0x56ae("0xb7")] = u[3],
                        this[_securedTouchMetadata_0x56ae("0x68")] = u[4],
                        this[_securedTouchMetadata_0x56ae("0x69")] = u[5],
                        o = {
                            ops: this[_securedTouchMetadata_0x56ae("0x90")],
                            webGl: this[_securedTouchMetadata_0x56ae("0x8d")],
                            devicePixelRatio: window[_securedTouchMetadata_0x56ae("0xb8")],
                            screenWidth: window[_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x2d")],
                            screenHeight: window[_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x2f")]
                        },
                        _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xb9")](o, screen, !1),
                        c = (new Date)[_securedTouchMetadata_0x56ae("0xba")](),
                        i = {
                            deviceType: this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0xbb")],
                            deviceId: this[_securedTouchMetadata_0x56ae("0x5d")][_securedTouchMetadata_0x56ae("0xbc")]()[_securedTouchMetadata_0x56ae("0xbd")],
                            appSessionId: this[_securedTouchMetadata_0x56ae("0x5d")][_securedTouchMetadata_0x56ae("0xbe")],
                            osVersion: (this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0xbf")] + " " + this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0xc0")])[_securedTouchMetadata_0x56ae("0xc1")]() || "",
                            display: o,
                            sensorsMetadata: this[_securedTouchMetadata_0x56ae("0xc2")]()
                        },
                        [4, this[_securedTouchMetadata_0x56ae("0xc3")](r)];
                    case 2:
                        return i[_securedTouchMetadata_0x56ae("0xc4")] = h[_securedTouchMetadata_0x56ae("0xb4")](),
                        i[_securedTouchMetadata_0x56ae("0xc5")] = this[_securedTouchMetadata_0x56ae("0xc6")](),
                        i[_securedTouchMetadata_0x56ae("0xc7")] = c,
                        i[_securedTouchMetadata_0x56ae("0xc8")] = c,
                        s = i,
                        this[_securedTouchMetadata_0x56ae("0x5e")][_securedTouchMetadata_0x56ae("0xc9")][_securedTouchMetadata_0x56ae("0xca")](a),
                        [2, s]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xb1")] = function() {
            return __awaiter(this, void 0, void 0, function() {
                var e, t = this;
                return __generator(this, function(a) {
                    switch (a[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return e = this,
                        [4, _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xcb")](50, new Promise(function(a, r) {
                            navigator[_securedTouchMetadata_0x56ae("0xcc")] ? (t[_securedTouchMetadata_0x56ae("0x63")] = !0,
                            navigator[_securedTouchMetadata_0x56ae("0xcc")]()[_securedTouchMetadata_0x56ae("0x5")](function(t) {
                                t && (e[_securedTouchMetadata_0x56ae("0x64")] = t[_securedTouchMetadata_0x56ae("0xcd")],
                                e[_securedTouchMetadata_0x56ae("0x65")] = t[_securedTouchMetadata_0x56ae("0xce")],
                                e[_securedTouchMetadata_0x56ae("0x66")] = t[_securedTouchMetadata_0x56ae("0xcf")],
                                e[_securedTouchMetadata_0x56ae("0x67")] = t[_securedTouchMetadata_0x56ae("0xd0")]),
                                a()
                            })[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xd1") + e),
                                a()
                            })) : (_securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0xd2")](_securedTouchMetadata_0x56ae("0xd3")),
                            a())
                        }
                        ))];
                    case 1:
                        return a[_securedTouchMetadata_0x56ae("0xb4")](),
                        [2]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xd4")] = function() {
            var e = /^((?!chrome|android).)*safari/i[_securedTouchMetadata_0x56ae("0xd5")](navigator[_securedTouchMetadata_0x56ae("0x32")]);
            return !_securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xd6")]() || !e
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xd7")] = function() {
            var e = window[_securedTouchMetadata_0x56ae("0xd8")] || window[_securedTouchMetadata_0x56ae("0xd9")] || window[_securedTouchMetadata_0x56ae("0xda")];
            if (!e) {
                var t = window[_securedTouchMetadata_0x56ae("0xdb")];
                t && (e = t[_securedTouchMetadata_0x56ae("0xd8")] || t[_securedTouchMetadata_0x56ae("0xd9")] || t[_securedTouchMetadata_0x56ae("0xda")])
            }
            return e
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xdc")] = function() {
            var e = this;
            try {
                var t = {}
                  , a = this[_securedTouchMetadata_0x56ae("0xd7")]()
                  , r = new a({
                    iceServers: [{
                        urls: this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0xdd")][_securedTouchMetadata_0x56ae("0xc1")]()
                    }]
                },{
                    optional: [{
                        RtpDataChannels: !0
                    }]
                });
                r[_securedTouchMetadata_0x56ae("0xde")] = function(a) {
                    if (a[_securedTouchMetadata_0x56ae("0xdf")]) {
                        var r = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/[_securedTouchMetadata_0x56ae("0xe0")](a[_securedTouchMetadata_0x56ae("0xdf")][_securedTouchMetadata_0x56ae("0xdf")])[1];
                        void 0 === t[r] && (a[_securedTouchMetadata_0x56ae("0xdf")][_securedTouchMetadata_0x56ae("0xdf")][_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0xe1")) > 0 ? e[_securedTouchMetadata_0x56ae("0x89")][_securedTouchMetadata_0x56ae("0xe2")](_securedTouchMetadata_0x56ae("0xe3"), r) : a[_securedTouchMetadata_0x56ae("0xdf")][_securedTouchMetadata_0x56ae("0xdf")][_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0xe4")) > 0 && e[_securedTouchMetadata_0x56ae("0x89")][_securedTouchMetadata_0x56ae("0xe2")](_securedTouchMetadata_0x56ae("0xe5"), r)),
                        t[r] = !0
                    }
                }
                ,
                r[_securedTouchMetadata_0x56ae("0xe6")](""),
                r[_securedTouchMetadata_0x56ae("0xe7")](function(e) {
                    r[_securedTouchMetadata_0x56ae("0xe8")](e, function() {}, function() {})
                }, function() {})
            } catch (e) {}
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xaf")] = function() {
            return __awaiter(this, void 0, void 0, function() {
                var e, t = this;
                return __generator(this, function(a) {
                    switch (a[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return e = this,
                        [4, _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xcb")](50, new Promise(function(a, r) {
                            return t[_securedTouchMetadata_0x56ae("0xd4")]() ? navigator[_securedTouchMetadata_0x56ae("0xea")] && navigator[_securedTouchMetadata_0x56ae("0xea")][_securedTouchMetadata_0x56ae("0xeb")] ? void navigator[_securedTouchMetadata_0x56ae("0xea")][_securedTouchMetadata_0x56ae("0xeb")]()[_securedTouchMetadata_0x56ae("0x5")](function(t) {
                                t[_securedTouchMetadata_0x56ae("0xed")](function(t) {
                                    t[_securedTouchMetadata_0x56ae("0xee")] && (t[_securedTouchMetadata_0x56ae("0xee")][_securedTouchMetadata_0x56ae("0x33")]() == _securedTouchMetadata_0x56ae("0xef") ? (e[_securedTouchMetadata_0x56ae("0x60")] = !0,
                                    e[_securedTouchMetadata_0x56ae("0x85")]++,
                                    t[_securedTouchMetadata_0x56ae("0xd")] && e[_securedTouchMetadata_0x56ae("0x87")][_securedTouchMetadata_0x56ae("0x12")](t[_securedTouchMetadata_0x56ae("0xd")])) : t[_securedTouchMetadata_0x56ae("0xee")][_securedTouchMetadata_0x56ae("0x33")]() == _securedTouchMetadata_0x56ae("0xf0") ? (e[_securedTouchMetadata_0x56ae("0x62")] = !0,
                                    e[_securedTouchMetadata_0x56ae("0x84")]++,
                                    t[_securedTouchMetadata_0x56ae("0xd")] && e[_securedTouchMetadata_0x56ae("0x86")][_securedTouchMetadata_0x56ae("0x12")](t[_securedTouchMetadata_0x56ae("0xd")])) : t[_securedTouchMetadata_0x56ae("0xee")][_securedTouchMetadata_0x56ae("0x33")]() == _securedTouchMetadata_0x56ae("0xf1") && (e[_securedTouchMetadata_0x56ae("0x61")] = !0,
                                    e[_securedTouchMetadata_0x56ae("0x85")]++,
                                    t[_securedTouchMetadata_0x56ae("0xd")] && e[_securedTouchMetadata_0x56ae("0x88")][_securedTouchMetadata_0x56ae("0x12")](t[_securedTouchMetadata_0x56ae("0xd")])))
                                }),
                                a()
                            })[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xf2"), e),
                                a()
                            }) : (_securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0xd2")](_securedTouchMetadata_0x56ae("0xec")),
                            void a()) : (_securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0xd2")](_securedTouchMetadata_0x56ae("0xe9")),
                            void a())
                        }
                        ))];
                    case 1:
                        return a[_securedTouchMetadata_0x56ae("0xb4")](),
                        [2]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x97")] = function(e) {
            return __awaiter(this, void 0, void 0, function() {
                var t, a, r = this;
                return __generator(this, function(n) {
                    switch (n[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return e[_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0xf4")) ? [2, Promise[_securedTouchMetadata_0x56ae("0xf5")]("")] : (t = new Promise(function(e, t) {
                            return __awaiter(r, void 0, void 0, function() {
                                var a, r, n;
                                return __generator(this, function(o) {
                                    switch (o[_securedTouchMetadata_0x56ae("0xd")]) {
                                    case 0:
                                        return o[_securedTouchMetadata_0x56ae("0x10")][_securedTouchMetadata_0x56ae("0x12")]([0, 3, , 4]),
                                        [4, _securedTouchDependencies[_securedTouchMetadata_0x56ae("0xf6")][_securedTouchMetadata_0x56ae("0xf7")]()];
                                    case 1:
                                        return [4, o[_securedTouchMetadata_0x56ae("0xb4")]()[_securedTouchMetadata_0x56ae("0xf8")]()];
                                    case 2:
                                        return a = o[_securedTouchMetadata_0x56ae("0xb4")](),
                                        this[_securedTouchMetadata_0x56ae("0xb5")] = a[_securedTouchMetadata_0x56ae("0xf9")],
                                        this[_securedTouchMetadata_0x56ae("0xfa")] = a[_securedTouchMetadata_0x56ae("0xfb")],
                                        e(a[_securedTouchMetadata_0x56ae("0xf9")]),
                                        [3, 4];
                                    case 3:
                                        return r = o[_securedTouchMetadata_0x56ae("0xb4")](),
                                        _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0xfc") + r),
                                        n = {
                                            err: r,
                                            message: _securedTouchMetadata_0x56ae("0xfd")
                                        },
                                        t(n),
                                        [3, 4];
                                    case 4:
                                        return [2]
                                    }
                                })
                            })
                        }
                        ),
                        a = new Promise(function(e, t) {
                            return __awaiter(r, void 0, void 0, function() {
                                var e;
                                return __generator(this, function(a) {
                                    switch (a[_securedTouchMetadata_0x56ae("0xd")]) {
                                    case 0:
                                        return [4, _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xfe")](this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0xff")])];
                                    case 1:
                                        return a[_securedTouchMetadata_0x56ae("0xb4")](),
                                        e = {
                                            message: _securedTouchMetadata_0x56ae("0x100")
                                        },
                                        t(e),
                                        [2]
                                    }
                                })
                            })
                        }
                        ),
                        [4, Promise[_securedTouchMetadata_0x56ae("0x101")]([t, a])]);
                    case 1:
                        return [2, n[_securedTouchMetadata_0x56ae("0xb4")]()]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xc2")] = function() {
            var e = {};
            return this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x103"), function() {
                return _securedTouchMetadata_0x56ae("0x104")in window
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x105"), function() {
                return _securedTouchMetadata_0x56ae("0x46")in window
            }),
            window[_securedTouchMetadata_0x56ae("0x106")] || this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x107"), function() {
                return !1
            }),
            window[_securedTouchMetadata_0x56ae("0x108")] || this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x109"), function() {
                return !1
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x10a"), function() {
                return _securedTouchMetadata_0x56ae("0x10b")in window
            }),
            e
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xc3")] = function(a) {
            return __awaiter(this, void 0, void 0, function() {
                var r, n, o, c, s, i, u, d, h, _, l, T, x, f, p, g, M, m, b, v, S = this;
                return __generator(this, function(y) {
                    switch (y[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return r = this,
                        n = {},
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x10c"), function() {
                            return S[_securedTouchMetadata_0x56ae("0xb5")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x10d")] && (this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x10e"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0xbf")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x10f"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0xc0")]
                        })),
                        this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x10d")] && (this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x110"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x111")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x112"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x113")]
                        })),
                        this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x10d")] && (this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x114"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x115")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x116"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x117")]
                        })),
                        this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x10d")] && this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x118"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x8e")][_securedTouchMetadata_0x56ae("0x119")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x11a"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x11b")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x11c"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x4b")] ? navigator[_securedTouchMetadata_0x56ae("0x4b")][_securedTouchMetadata_0x56ae("0x11")] : null
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x11d"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x11e")] ? navigator[_securedTouchMetadata_0x56ae("0x11e")][_securedTouchMetadata_0x56ae("0x11")] : null
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x11f"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x2a")] || navigator[_securedTouchMetadata_0x56ae("0x120")] || navigator[_securedTouchMetadata_0x56ae("0x121")] || navigator[_securedTouchMetadata_0x56ae("0x122")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x123"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x27")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x124"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x47")] || navigator[_securedTouchMetadata_0x56ae("0x48")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x125"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x126")] || navigator[_securedTouchMetadata_0x56ae("0x127")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x128"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x129")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x12a"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x70")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x12b"), function() {
                            return null != navigator[_securedTouchMetadata_0x56ae("0x12c")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x12d"), function() {
                            return _securedTouchMetadata_0x56ae("0x12e")in window
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x12f"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x130")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x131"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x132")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x133"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x134")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x135"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x136")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x137"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x35")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x138"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x139")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x13a"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x32")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x13b"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x6e")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x13c"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x13d")] ? navigator[_securedTouchMetadata_0x56ae("0x13d")][_securedTouchMetadata_0x56ae("0x13e")] : null
                        }),
                        a[_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0x13f")) ? [3, 2] : [4, this[_securedTouchMetadata_0x56ae("0x140")](n)];
                    case 1:
                        y[_securedTouchMetadata_0x56ae("0xb4")](),
                        y[_securedTouchMetadata_0x56ae("0xd")] = 2;
                    case 2:
                        if ((o = window[_securedTouchMetadata_0x56ae("0x141")] || window[_securedTouchMetadata_0x56ae("0x142")]) ? this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x143"), function() {
                            return o
                        }) : this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x143"), function() {
                            return _securedTouchMetadata_0x56ae("0x144")
                        }),
                        c = new (e[_securedTouchMetadata_0x56ae("0x5c")]),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x145"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x1f")](_securedTouchMetadata_0x56ae("0x19"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x146"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x20")](_securedTouchMetadata_0x56ae("0x19"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x147"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x1f")](_securedTouchMetadata_0x56ae("0x1b"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x148"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x20")](_securedTouchMetadata_0x56ae("0x1b"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x149"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x26")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x14a"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x2b")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x14b"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x31")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x14c"), function() {
                            return c[_securedTouchMetadata_0x56ae("0x4c")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0xfa")])
                            for (u in s = function(e) {
                                if (!i[_securedTouchMetadata_0x56ae("0xfa")][_securedTouchMetadata_0x56ae("0x14d")](e))
                                    return _securedTouchMetadata_0x56ae("0x14e");
                                var t = i[_securedTouchMetadata_0x56ae("0xfa")][e];
                                e == _securedTouchMetadata_0x56ae("0x7d") ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x14f"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")][_securedTouchMetadata_0x56ae("0x11")]
                                }) : e == _securedTouchMetadata_0x56ae("0x16") ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x150"), function() {
                                    return null != t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x71") && t[_securedTouchMetadata_0x56ae("0x4")] && t[_securedTouchMetadata_0x56ae("0x4")][_securedTouchMetadata_0x56ae("0x11")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x151"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")][_securedTouchMetadata_0x56ae("0x152")](",")
                                }) : e == _securedTouchMetadata_0x56ae("0x72") && t[_securedTouchMetadata_0x56ae("0x4")] && t[_securedTouchMetadata_0x56ae("0x4")][_securedTouchMetadata_0x56ae("0x11")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x153"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")][_securedTouchMetadata_0x56ae("0x152")](",")
                                }) : e == _securedTouchMetadata_0x56ae("0x7c") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x154"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x7e") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x155"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x7f") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x156"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x4d") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x157"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x80") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x158"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x81") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x159"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x53") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x15a"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : e == _securedTouchMetadata_0x56ae("0x82") && t[_securedTouchMetadata_0x56ae("0x4")] ? i[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x15b"), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                }) : r[_securedTouchMetadata_0x56ae("0x6b")][_securedTouchMetadata_0x56ae("0xf3")](e) && null != e && i[_securedTouchMetadata_0x56ae("0x102")](n, e[_securedTouchMetadata_0x56ae("0x15c")](), function() {
                                    return t[_securedTouchMetadata_0x56ae("0x4")]
                                })
                            }
                            ,
                            i = this,
                            this[_securedTouchMetadata_0x56ae("0xfa")])
                                s(u);
                        for (T in this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x15d"), function() {
                            return S[_securedTouchMetadata_0x56ae("0xa5")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x15e"), function() {
                            return S[_securedTouchMetadata_0x56ae("0xb6")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x15f"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x83")]
                        }),
                        d = {
                            selenium: navigator[_securedTouchMetadata_0x56ae("0x129")] || _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x160")](window[_securedTouchMetadata_0x56ae("0x161")][_securedTouchMetadata_0x56ae("0x162")], _securedTouchMetadata_0x56ae("0x129")) || "",
                            phantomjs: {
                                _phantom: window[_securedTouchMetadata_0x56ae("0x163")] || "",
                                __phantomas: window[_securedTouchMetadata_0x56ae("0x164")] || "",
                                callPhantom: window[_securedTouchMetadata_0x56ae("0x165")] || ""
                            },
                            nodejs: {
                                Buffer: window[_securedTouchMetadata_0x56ae("0x166")] || ""
                            },
                            couchjs: {
                                emit: window[_securedTouchMetadata_0x56ae("0x167")] || ""
                            },
                            rhino: {
                                spawn: window[_securedTouchMetadata_0x56ae("0x168")] || ""
                            },
                            chromium: {
                                domAutomationController: window[_securedTouchMetadata_0x56ae("0x169")] || "",
                                domAutomation: window[_securedTouchMetadata_0x56ae("0x16a")] || ""
                            },
                            outerWidth: window[_securedTouchMetadata_0x56ae("0x16b")],
                            outerHeight: window[_securedTouchMetadata_0x56ae("0x16c")]
                        },
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x16d"), function() {
                            return d
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x16d"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x68")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x16e"), function() {
                            var e = {};
                            for (var t in S[_securedTouchMetadata_0x56ae("0x69")])
                                e[t] = JSON[_securedTouchMetadata_0x56ae("0x16f")](S[_securedTouchMetadata_0x56ae("0x69")][t]);
                            return Object[_securedTouchMetadata_0x56ae("0x170")](e)[_securedTouchMetadata_0x56ae("0x11")] > 0 ? e : null
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x171"), function() {
                            return new (e[_securedTouchMetadata_0x56ae("0x172")])(a)[_securedTouchMetadata_0x56ae("0x173")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x174"), function() {
                            return document[_securedTouchMetadata_0x56ae("0x175")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x176"), function() {
                            for (var e = {
                                length: navigator[_securedTouchMetadata_0x56ae("0x4b")][_securedTouchMetadata_0x56ae("0x11")],
                                details: []
                            }, t = 0; t < e[_securedTouchMetadata_0x56ae("0x11")]; t++)
                                e[_securedTouchMetadata_0x56ae("0x177")][_securedTouchMetadata_0x56ae("0x12")]({
                                    length: navigator[_securedTouchMetadata_0x56ae("0x4b")][t][_securedTouchMetadata_0x56ae("0x11")],
                                    name: navigator[_securedTouchMetadata_0x56ae("0x4b")][t][_securedTouchMetadata_0x56ae("0x178")],
                                    version: navigator[_securedTouchMetadata_0x56ae("0x4b")][t][_securedTouchMetadata_0x56ae("0x179")],
                                    filename: navigator[_securedTouchMetadata_0x56ae("0x4b")][t][_securedTouchMetadata_0x56ae("0x17a")]
                                });
                            return e
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x17b"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x85")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x17c"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x84")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x17d"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x86")][_securedTouchMetadata_0x56ae("0x5a")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x17e"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x87")][_securedTouchMetadata_0x56ae("0x5a")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x17f"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x88")][_securedTouchMetadata_0x56ae("0x5a")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x180"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x181")](_securedTouchMetadata_0x56ae("0x182"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x183"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x181")](_securedTouchMetadata_0x56ae("0x184"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x185"), function() {
                            return S[_securedTouchMetadata_0x56ae("0x181")](_securedTouchMetadata_0x56ae("0x186"))
                        }),
                        h = this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x187")],
                        _ = function(e) {
                            if (!h[_securedTouchMetadata_0x56ae("0x14d")](e))
                                return _securedTouchMetadata_0x56ae("0x14e");
                            l[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x188") + e, function() {
                                return S[_securedTouchMetadata_0x56ae("0x181")](h[e])
                            })
                        }
                        ,
                        l = this,
                        h)
                            _(T);
                        window[_securedTouchMetadata_0x56ae("0x189")] && window[_securedTouchMetadata_0x56ae("0x189")][_securedTouchMetadata_0x56ae("0x18a")] && (this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x18b"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x189")][_securedTouchMetadata_0x56ae("0x18a")][_securedTouchMetadata_0x56ae("0x18c")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x18d"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x189")][_securedTouchMetadata_0x56ae("0x18a")][_securedTouchMetadata_0x56ae("0x18e")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x18f"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x189")][_securedTouchMetadata_0x56ae("0x18a")][_securedTouchMetadata_0x56ae("0x190")]
                        })),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x191"), function() {
                            return navigator[_securedTouchMetadata_0x56ae("0x192")]
                        }),
                        !a[_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0x193")) && navigator[_securedTouchMetadata_0x56ae("0x192")] && (x = 30,
                        f = _securedTouchMetadata_0x56ae("0x194"),
                        _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x195")](f, _securedTouchMetadata_0x56ae("0x196"), x + 10),
                        _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xfe")](1e3 * x)[_securedTouchMetadata_0x56ae("0x5")](function() {
                            S[_securedTouchMetadata_0x56ae("0x8a")] = !0,
                            S[_securedTouchMetadata_0x56ae("0x8b")] = !_securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x197")](f),
                            _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x198")](f)
                        })),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x199"), function() {
                            return e[_securedTouchMetadata_0x56ae("0x19a")][_securedTouchMetadata_0x56ae("0x19b")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x19c"), function() {
                            return e[_securedTouchMetadata_0x56ae("0x19a")][_securedTouchMetadata_0x56ae("0x19d")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x19e"), function() {
                            return e[_securedTouchMetadata_0x56ae("0x19a")][_securedTouchMetadata_0x56ae("0x19f")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1a0"), function() {
                            return e[_securedTouchMetadata_0x56ae("0x19a")][_securedTouchMetadata_0x56ae("0x1a1")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1a2"), function() {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x160")](window[_securedTouchMetadata_0x56ae("0x161")][_securedTouchMetadata_0x56ae("0x162")], _securedTouchMetadata_0x56ae("0x1a3"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1a4"), function() {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x160")](window[_securedTouchMetadata_0x56ae("0x161")][_securedTouchMetadata_0x56ae("0x162")], _securedTouchMetadata_0x56ae("0x129"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1a5"), function() {
                            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x160")](window[_securedTouchMetadata_0x56ae("0x161")][_securedTouchMetadata_0x56ae("0x162")], _securedTouchMetadata_0x56ae("0x1a6"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1a7"), function() {
                            return !!_securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x160")](document[_securedTouchMetadata_0x56ae("0x1a8")](_securedTouchMetadata_0x56ae("0x1a9"))[0], _securedTouchMetadata_0x56ae("0x129"))
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1aa"), function() {
                            return !!window[_securedTouchMetadata_0x56ae("0x1ab")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1ac"), function() {
                            return !!window[_securedTouchMetadata_0x56ae("0x1ad")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1ae"), function() {
                            return !!window[_securedTouchMetadata_0x56ae("0x1af")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1b0"), function() {
                            return !!window[_securedTouchMetadata_0x56ae("0x1b1")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1b2"), function() {
                            return _securedTouchMetadata_0x56ae("0x1b2")in document
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1b3"), function() {
                            return _securedTouchMetadata_0x56ae("0x1b3")in XMLHttpRequest[_securedTouchMetadata_0x56ae("0x13")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1b4"), function() {
                            return _securedTouchMetadata_0x56ae("0x1b4")in XMLHttpRequest[_securedTouchMetadata_0x56ae("0x13")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1b5"), function() {
                            return _securedTouchMetadata_0x56ae("0x1b5")in HTMLIFrameElement[_securedTouchMetadata_0x56ae("0x13")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1b6"), function() {
                            return localStorage[_securedTouchMetadata_0x56ae("0x11")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1b7"), function() {
                            return sessionStorage[_securedTouchMetadata_0x56ae("0x11")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x5d")][_securedTouchMetadata_0x56ae("0x1b8")][_securedTouchMetadata_0x56ae("0xed")](function(e) {
                            S[_securedTouchMetadata_0x56ae("0x102")](n, e[_securedTouchMetadata_0x56ae("0x15c")]() + _securedTouchMetadata_0x56ae("0x1b9"), function() {
                                return !0
                            })
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1ba"), function() {
                            return !!S[_securedTouchMetadata_0x56ae("0xd7")]()
                        }),
                        this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0xdd")] && this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0xdd")][_securedTouchMetadata_0x56ae("0x11")] > 0 && (this[_securedTouchMetadata_0x56ae("0xdc")](),
                        this[_securedTouchMetadata_0x56ae("0x89")][_securedTouchMetadata_0x56ae("0xed")](function(e, t) {
                            null != t && null != e && S[_securedTouchMetadata_0x56ae("0x102")](n, t, function() {
                                return e
                            })
                        }),
                        this[_securedTouchMetadata_0x56ae("0x89")][_securedTouchMetadata_0x56ae("0x1bb")]()),
                        window[_securedTouchMetadata_0x56ae("0x1bc")] && this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1bd"), function() {
                            var e = window[_securedTouchMetadata_0x56ae("0x1bc")](_securedTouchMetadata_0x56ae("0x1be") + (window[_securedTouchMetadata_0x56ae("0x1bf")] - 1) + _securedTouchMetadata_0x56ae("0x1c0"));
                            return {
                                matches: e[_securedTouchMetadata_0x56ae("0x1c1")],
                                media: e[_securedTouchMetadata_0x56ae("0x1c2")]
                            }
                        }),
                        this[_securedTouchMetadata_0x56ae("0x1c3")](n, a),
                        window[_securedTouchMetadata_0x56ae("0x12e")] && this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1c4"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x12e")][_securedTouchMetadata_0x56ae("0x1c5")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1c6"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x53")] && _securedTouchMetadata_0x56ae("0x1c7")in window[_securedTouchMetadata_0x56ae("0x53")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1c8"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x53")] && _securedTouchMetadata_0x56ae("0x1c9")in window[_securedTouchMetadata_0x56ae("0x53")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1ca"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x53")] && _securedTouchMetadata_0x56ae("0x1cb")in window[_securedTouchMetadata_0x56ae("0x53")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1cc"), function() {
                            return window[_securedTouchMetadata_0x56ae("0x53")] && _securedTouchMetadata_0x56ae("0x1cd")in window[_securedTouchMetadata_0x56ae("0x53")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1ce"), t[_securedTouchMetadata_0x56ae("0x1cf")]),
                        y[_securedTouchMetadata_0x56ae("0xd")] = 3;
                    case 3:
                        return y[_securedTouchMetadata_0x56ae("0x10")][_securedTouchMetadata_0x56ae("0x12")]([3, 6, , 7]),
                        a[_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0x1d0")) || !_securedTouchEntities[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x1d1")](document[_securedTouchMetadata_0x56ae("0x1d2")]) ? [3, 5] : [4, _securedTouchEntities[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xcb")](500, document[_securedTouchMetadata_0x56ae("0x1d2")]())];
                    case 4:
                        p = y[_securedTouchMetadata_0x56ae("0xb4")](),
                        g = p.id,
                        M = p[_securedTouchMetadata_0x56ae("0x179")],
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1d3"), function() {
                            return g
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](n, _securedTouchMetadata_0x56ae("0x1d4"), function() {
                            return M
                        }),
                        y[_securedTouchMetadata_0x56ae("0xd")] = 5;
                    case 5:
                        return [3, 7];
                    case 6:
                        return y[_securedTouchMetadata_0x56ae("0xb4")](),
                        [3, 7];
                    case 7:
                        for (b in m = this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x1d5")])
                            m[_securedTouchMetadata_0x56ae("0x14d")](b) && (v = b === _securedTouchMetadata_0x56ae("0x1d6") ? window : window[b]) && this[_securedTouchMetadata_0x56ae("0x1d7")](v, b[_securedTouchMetadata_0x56ae("0x15c")]() + _securedTouchMetadata_0x56ae("0x1d8"), m[b], n);
                        return [2, n]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x1d7")] = function(e, t, a, r) {
            try {
                for (var n = function(a) {
                    o[_securedTouchMetadata_0x56ae("0x102")](r, t + "_" + a[_securedTouchMetadata_0x56ae("0x15c")](), function() {
                        var t = e[_securedTouchMetadata_0x56ae("0x13")] ? e[_securedTouchMetadata_0x56ae("0x13")] : e
                          , r = Object[_securedTouchMetadata_0x56ae("0x1d9")](t, a);
                        if (r) {
                            var n = r[_securedTouchMetadata_0x56ae("0xf8")] ? r[_securedTouchMetadata_0x56ae("0xf8")][_securedTouchMetadata_0x56ae("0x5a")]() : void 0;
                            return JSON[_securedTouchMetadata_0x56ae("0x16f")]({
                                configurable: r[_securedTouchMetadata_0x56ae("0x1da")],
                                enumerable: r[_securedTouchMetadata_0x56ae("0x1db")],
                                value: r[_securedTouchMetadata_0x56ae("0x4")],
                                writable: r[_securedTouchMetadata_0x56ae("0x1dc")],
                                getter: null != n && n[_securedTouchMetadata_0x56ae("0x11")] < 100 ? n : void 0
                            })
                        }
                        return _securedTouchMetadata_0x56ae("0x28")
                    })
                }, o = this, c = 0, s = a; c < s[_securedTouchMetadata_0x56ae("0x11")]; c++) {
                    n(s[c])
                }
            } catch (e) {
                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x1dd"), e)
            }
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x1c3")] = function(e, t) {
            if (!t[_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0x1de")))
                try {
                    var a = _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x1df")](_securedTouchMetadata_0x56ae("0x1e0"));
                    if (!a)
                        return;
                    a[_securedTouchMetadata_0x56ae("0x1e1")] = _securedTouchMetadata_0x56ae("0x1e2"),
                    document[_securedTouchMetadata_0x56ae("0x1e3")][_securedTouchMetadata_0x56ae("0x1e4")](a),
                    this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x1e5"), function() {
                        return typeof a[_securedTouchMetadata_0x56ae("0x1e6")][_securedTouchMetadata_0x56ae("0x53")]
                    }),
                    this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x1e7"), function() {
                        return a[_securedTouchMetadata_0x56ae("0x1e6")][_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x2d")]
                    }),
                    this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x1e8"), function() {
                        return a[_securedTouchMetadata_0x56ae("0x1e6")][_securedTouchMetadata_0x56ae("0x2c")][_securedTouchMetadata_0x56ae("0x2f")]
                    }),
                    a[_securedTouchMetadata_0x56ae("0x1e9")]()
                } catch (e) {
                    _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x1ea"), e)
                }
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xa7")] = function() {
            return __awaiter(this, void 0, void 0, function() {
                var e, t, a, r, n, o;
                return __generator(this, function(c) {
                    switch (c[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        if (e = {},
                        t = [_securedTouchMetadata_0x56ae("0x1eb"), _securedTouchMetadata_0x56ae("0x1ec"), _securedTouchMetadata_0x56ae("0x1ed"), _securedTouchMetadata_0x56ae("0x1ee"), _securedTouchMetadata_0x56ae("0x1ef"), _securedTouchMetadata_0x56ae("0x1f0"), _securedTouchMetadata_0x56ae("0x1f1"), _securedTouchMetadata_0x56ae("0x95"), _securedTouchMetadata_0x56ae("0x1f2"), _securedTouchMetadata_0x56ae("0x1f3"), _securedTouchMetadata_0x56ae("0x1f4"), _securedTouchMetadata_0x56ae("0x1f5"), _securedTouchMetadata_0x56ae("0x1f6"), _securedTouchMetadata_0x56ae("0x1f7"), _securedTouchMetadata_0x56ae("0x1f8"), _securedTouchMetadata_0x56ae("0x12")],
                        a = [],
                        navigator[_securedTouchMetadata_0x56ae("0xb7")])
                            for (n in r = function(r) {
                                var n = t[r];
                                a[_securedTouchMetadata_0x56ae("0x12")](navigator[_securedTouchMetadata_0x56ae("0xb7")][_securedTouchMetadata_0x56ae("0x1f9")]({
                                    name: n
                                })[_securedTouchMetadata_0x56ae("0x5")](function(t) {
                                    e[n] = t[_securedTouchMetadata_0x56ae("0x1fa")]
                                })[_securedTouchMetadata_0x56ae("0x98")](function(e) {}))
                            }
                            ,
                            t)
                                r(n);
                        c[_securedTouchMetadata_0x56ae("0xd")] = 1;
                    case 1:
                        return c[_securedTouchMetadata_0x56ae("0x10")][_securedTouchMetadata_0x56ae("0x12")]([1, 3, , 4]),
                        [4, Promise[_securedTouchMetadata_0x56ae("0xb3")](a)];
                    case 2:
                        return c[_securedTouchMetadata_0x56ae("0xb4")](),
                        [3, 4];
                    case 3:
                        return o = c[_securedTouchMetadata_0x56ae("0xb4")](),
                        _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](o),
                        [3, 4];
                    case 4:
                        return [2, e]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x181")] = function(e) {
            var t = document[_securedTouchMetadata_0x56ae("0x15")](_securedTouchMetadata_0x56ae("0x1fb"));
            if (t && t[_securedTouchMetadata_0x56ae("0x1fc")])
                return t[_securedTouchMetadata_0x56ae("0x1fc")](e)
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x140")] = function(e) {
            return __awaiter(this, void 0, void 0, function() {
                var t, a, r, n, o, c;
                return __generator(this, function(s) {
                    switch (s[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return _securedTouchDependencies[_securedTouchMetadata_0x56ae("0x1fd")](),
                        t = this,
                        a = _securedTouchDependencies[_securedTouchMetadata_0x56ae("0x1fe")],
                        r = a[_securedTouchMetadata_0x56ae("0x1ff")],
                        n = a[_securedTouchMetadata_0x56ae("0x200")],
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x201"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x202")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x203"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x204")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x7e"), function() {
                            return !!a[_securedTouchMetadata_0x56ae("0x7e")]
                        }),
                        a[_securedTouchMetadata_0x56ae("0x7e")] && this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x7e"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x7e")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x205"), function() {
                            return !!r(_securedTouchMetadata_0x56ae("0x206"), navigator) || !!r(_securedTouchMetadata_0x56ae("0xcc"), navigator)
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x207"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x208")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x209"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x20a")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x20b"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x20b")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x20c"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x20c")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x20d"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x20e")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x20f"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x210")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x211"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x212")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x213"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x213")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x214"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x215")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x216"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x217")]
                        }),
                        [4, this[_securedTouchMetadata_0x56ae("0x218")](_securedTouchMetadata_0x56ae("0x219"))];
                    case 1:
                        return o = s[_securedTouchMetadata_0x56ae("0xb4")](),
                        t[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x21a"), function() {
                            return o
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x21b"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x21c")]
                        }),
                        a[_securedTouchMetadata_0x56ae("0x21c")] && (this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x21d"), function() {
                            return n(r(_securedTouchMetadata_0x56ae("0x21e"), window, !1), window)
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x21f"), function() {
                            return MouseEvent[_securedTouchMetadata_0x56ae("0x220")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x221"), function() {
                            return MouseEvent[_securedTouchMetadata_0x56ae("0x222")]
                        })),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x223"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x224")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x225"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x226")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x227"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x95")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x228"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x228")]
                        }),
                        [4, this[_securedTouchMetadata_0x56ae("0x218")](_securedTouchMetadata_0x56ae("0x229"))];
                    case 2:
                        return c = s[_securedTouchMetadata_0x56ae("0xb4")](),
                        t[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x22a"), function() {
                            return c
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x22b"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x22c")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x22d"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x22e")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x22f"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x22f")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x230"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x230")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x231"), function() {
                            return _securedTouchMetadata_0x56ae("0x232")in window
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x233"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x234")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x235"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x235")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x236"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x237")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x189"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x189")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x238"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x239")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x23a"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x23b")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x23c"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x23c")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x23d"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x23e")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x23f"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x240")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x241"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x242")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x243"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x244")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x245"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x246")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x247"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x248")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x12c"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x12c")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x1fb"), function() {
                            return !!a[_securedTouchMetadata_0x56ae("0x1fb")]
                        }),
                        a[_securedTouchMetadata_0x56ae("0x1fb")] && this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x1fb"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x1fb")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x249"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x19")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x24a"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x24b")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x24c"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x24d")]
                        }),
                        this[_securedTouchMetadata_0x56ae("0x102")](e, _securedTouchMetadata_0x56ae("0x24e"), function() {
                            return a[_securedTouchMetadata_0x56ae("0x24e")]
                        }),
                        [2]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xc6")] = function() {
            var e = this
              , t = {}
              , a = navigator[_securedTouchMetadata_0x56ae("0x13d")] || navigator[_securedTouchMetadata_0x56ae("0x24f")] || navigator[_securedTouchMetadata_0x56ae("0x250")];
            return this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x251"), function() {
                return a ? a[_securedTouchMetadata_0x56ae("0x252")] : null
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x253"), function() {
                return a ? a[_securedTouchMetadata_0x56ae("0x254")] : null
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x255"), function() {
                return !!navigator[_securedTouchMetadata_0x56ae("0x256")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x257"), function() {
                return e[_securedTouchMetadata_0x56ae("0x61")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x258"), function() {
                return e[_securedTouchMetadata_0x56ae("0x60")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x259"), function() {
                return e[_securedTouchMetadata_0x56ae("0x62")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x25a"), function() {
                return e[_securedTouchMetadata_0x56ae("0x63")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x25b"), function() {
                return e[_securedTouchMetadata_0x56ae("0x64")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x25c"), function() {
                return e[_securedTouchMetadata_0x56ae("0x65")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x25d"), function() {
                return e[_securedTouchMetadata_0x56ae("0x66")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x25e"), function() {
                return e[_securedTouchMetadata_0x56ae("0x67")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x25f"), function() {
                return e[_securedTouchMetadata_0x56ae("0x6a")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x260"), function() {
                return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x261")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x262"), function() {
                return _securedTouchMetadata_0x56ae("0x46")in document[_securedTouchMetadata_0x56ae("0x162")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x263"), function() {
                return e[_securedTouchMetadata_0x56ae("0xb7")]
            }),
            this[_securedTouchMetadata_0x56ae("0x102")](t, _securedTouchMetadata_0x56ae("0x264"), function() {
                return window[_securedTouchMetadata_0x56ae("0x1bc")](_securedTouchMetadata_0x56ae("0x265"))[_securedTouchMetadata_0x56ae("0x1c1")] ? _securedTouchMetadata_0x56ae("0x266") : window[_securedTouchMetadata_0x56ae("0x1bc")](_securedTouchMetadata_0x56ae("0x267"))[_securedTouchMetadata_0x56ae("0x1c1")] ? _securedTouchMetadata_0x56ae("0x268") : void 0
            }),
            t
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x269")] = function(e, t, a) {
            try {
                var r = new Set(this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x96")] || []);
                null == t || null == a || r[_securedTouchMetadata_0x56ae("0xf3")](t) || (e[t] = a)
            } catch (e) {
                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x26a") + t + _securedTouchMetadata_0x56ae("0x26b") + a + ", " + e)
            }
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x218")] = function(e) {
            return __awaiter(this, void 0, void 0, function() {
                var t, a;
                return __generator(this, function(r) {
                    switch (r[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return t = new Promise(function(t) {
                            try {
                                _securedTouchDependencies[_securedTouchMetadata_0x56ae("0x1fe")].on(e, function(e) {
                                    t(e)
                                })
                            } catch (a) {
                                t(null),
                                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x26c") + e, a)
                            }
                        }
                        ),
                        a = _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xfe")](1e3)[_securedTouchMetadata_0x56ae("0x5")](function() {
                            return null
                        }),
                        [4, Promise[_securedTouchMetadata_0x56ae("0x101")]([t, a])];
                    case 1:
                        return [2, r[_securedTouchMetadata_0x56ae("0xb4")]()]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x102")] = function(e, t, a) {
            try {
                var r = new Set(this[_securedTouchMetadata_0x56ae("0x5f")][_securedTouchMetadata_0x56ae("0x96")] || []);
                if (!t || r[_securedTouchMetadata_0x56ae("0xf3")](t))
                    return;
                var n = a();
                if (typeof n === _securedTouchMetadata_0x56ae("0x26d") && null !== n) {
                    var o = _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x26e")](n);
                    for (var c in o)
                        this[_securedTouchMetadata_0x56ae("0x269")](e, t + "." + c, o[c])
                } else
                    this[_securedTouchMetadata_0x56ae("0x269")](e, t, n)
            } catch (e) {
                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x26a") + t, e)
            }
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x91")] = function() {
            var e, t = new Date, a = 0;
            do {
                a++,
                e = (new Date)[_securedTouchMetadata_0x56ae("0xba")]() - t[_securedTouchMetadata_0x56ae("0xba")](),
                Math[_securedTouchMetadata_0x56ae("0x26f")](a * Math[_securedTouchMetadata_0x56ae("0x270")]())
            } while (e < 500);
            var r = a / e;
            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0xd2")](_securedTouchMetadata_0x56ae("0x271") + r),
            r
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x272")] = function() {
            var e = ""
              , t = "";
            try {
                var a = document[_securedTouchMetadata_0x56ae("0x15")](_securedTouchMetadata_0x56ae("0x16"))
                  , r = a[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x19")) ? a[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x19")) : a[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x1a")) ? a[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x1a")) : a[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x273")) ? a[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x273")) : a[_securedTouchMetadata_0x56ae("0x17")](_securedTouchMetadata_0x56ae("0x274"));
                if (r) {
                    var n = r[_securedTouchMetadata_0x56ae("0x21")](_securedTouchMetadata_0x56ae("0x22"));
                    e = r[_securedTouchMetadata_0x56ae("0x23")](r[_securedTouchMetadata_0x56ae("0x275")])[_securedTouchMetadata_0x56ae("0x33")](),
                    n && (_securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0xd2")](_securedTouchMetadata_0x56ae("0x276") + n),
                    t = r[_securedTouchMetadata_0x56ae("0x23")](n[_securedTouchMetadata_0x56ae("0x25")])[_securedTouchMetadata_0x56ae("0x33")]()),
                    this[_securedTouchMetadata_0x56ae("0x83")] = 1
                } else
                    _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x277")),
                    this[_securedTouchMetadata_0x56ae("0x83")] = 0
            } catch (e) {
                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x278") + e)
            }
            return _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0xd2")](_securedTouchMetadata_0x56ae("0x279") + t || e),
            t || e
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xa2")] = function() {
            return __awaiter(this, void 0, void 0, function() {
                var e;
                return __generator(this, function(t) {
                    return e = this,
                    [2, new Promise(function(t, a) {
                        e[_securedTouchMetadata_0x56ae("0x27a")](function(e) {
                            t(e)
                        })
                    }
                    )]
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x27a")] = function(e) {
            var t, a = e[_securedTouchMetadata_0x56ae("0x27b")](null, !0), r = e[_securedTouchMetadata_0x56ae("0x27b")](null, !1);
            window[_securedTouchMetadata_0x56ae("0x27d")] ? window[_securedTouchMetadata_0x56ae("0x27d")](0, 0, r, a) : _securedTouchMetadata_0x56ae("0x27e")in document[_securedTouchMetadata_0x56ae("0x162")][_securedTouchMetadata_0x56ae("0x27f")] ? ((t = indexedDB[_securedTouchMetadata_0x56ae("0x280")](_securedTouchMetadata_0x56ae("0xd5")))[_securedTouchMetadata_0x56ae("0x281")] = a,
            t[_securedTouchMetadata_0x56ae("0x282")] = r) : /constructor/i[_securedTouchMetadata_0x56ae("0xd5")](window[_securedTouchMetadata_0x56ae("0x283")]) || window[_securedTouchMetadata_0x56ae("0x55")] ? function() {
                try {
                    localStorage[_securedTouchMetadata_0x56ae("0x11")] ? r() : (localStorage.x = 1,
                    localStorage[_securedTouchMetadata_0x56ae("0x27c")]("x"),
                    r())
                } catch (e) {
                    navigator[_securedTouchMetadata_0x56ae("0x192")] ? a() : r()
                }
            }() : window[_securedTouchMetadata_0x56ae("0x77")] || !window[_securedTouchMetadata_0x56ae("0x284")] && !window[_securedTouchMetadata_0x56ae("0x285")] ? r() : a()
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x1cf")] = function() {
            return 1.4474840516030247 == Math[_securedTouchMetadata_0x56ae("0x286")](.123) && .881373587019543 == Math[_securedTouchMetadata_0x56ae("0x287")](Math[_securedTouchMetadata_0x56ae("0x288")]) && 1.1071487177940904 == Math[_securedTouchMetadata_0x56ae("0x289")](2) && .5493061443340548 == Math[_securedTouchMetadata_0x56ae("0x28a")](.5) && 1.4645918875615231 == Math[_securedTouchMetadata_0x56ae("0x28b")](Math.PI) && -.4067775970251724 == Math[_securedTouchMetadata_0x56ae("0x28c")](21 * Math[_securedTouchMetadata_0x56ae("0x28d")]) && 9.199870313877772e307 == Math[_securedTouchMetadata_0x56ae("0x28e")](492 * Math[_securedTouchMetadata_0x56ae("0x28f")]) && 1.718281828459045 == Math[_securedTouchMetadata_0x56ae("0x290")](1) && 101.76102278593319 == Math[_securedTouchMetadata_0x56ae("0x291")](6 * Math.PI, -100) && .4971498726941338 == Math[_securedTouchMetadata_0x56ae("0x292")](Math.PI) && 1.2246467991473532e-16 == Math[_securedTouchMetadata_0x56ae("0x293")](Math.PI) && 11.548739357257748 == Math[_securedTouchMetadata_0x56ae("0x294")](Math.PI) && -3.3537128705376014 == Math[_securedTouchMetadata_0x56ae("0x295")](10 * Math[_securedTouchMetadata_0x56ae("0x28f")]) && .12238344189440875 == Math[_securedTouchMetadata_0x56ae("0x296")](.123) && 1.9275814160560204e-50 == Math[_securedTouchMetadata_0x56ae("0x297")](Math.PI, -100)
        }
        ,
        t
    }();
    e[_securedTouchMetadata_0x56ae("0x298")] = t
}(_securedTouchMetadata || (_securedTouchMetadata = {})),
function(e) {
    var t = function() {
        function e() {}
        return e[_securedTouchMetadata_0x56ae("0x19b")] = function() {
            for (var e = 0, t = [_securedTouchMetadata_0x56ae("0x299"), _securedTouchMetadata_0x56ae("0x29a"), _securedTouchMetadata_0x56ae("0x29b"), _securedTouchMetadata_0x56ae("0x29c"), _securedTouchMetadata_0x56ae("0x29d"), _securedTouchMetadata_0x56ae("0x29e"), _securedTouchMetadata_0x56ae("0x29f"), _securedTouchMetadata_0x56ae("0x2a0"), _securedTouchMetadata_0x56ae("0x2a1"), _securedTouchMetadata_0x56ae("0x2a2"), _securedTouchMetadata_0x56ae("0x2a3")]; e < t[_securedTouchMetadata_0x56ae("0x11")]; e++) {
                if (document[t[e]])
                    return !0
            }
            return !1
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x19d")] = function() {
            for (var e = 0, t = [_securedTouchMetadata_0x56ae("0x163"), _securedTouchMetadata_0x56ae("0x2a4"), _securedTouchMetadata_0x56ae("0x2a5"), _securedTouchMetadata_0x56ae("0x165"), _securedTouchMetadata_0x56ae("0x2a6"), _securedTouchMetadata_0x56ae("0x2a7"), _securedTouchMetadata_0x56ae("0x2a8")]; e < t[_securedTouchMetadata_0x56ae("0x11")]; e++) {
                if (window[t[e]])
                    return !0
            }
            return !1
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x19f")] = function() {
            for (var e = 0, t = [_securedTouchMetadata_0x56ae("0x129"), _securedTouchMetadata_0x56ae("0x2a1"), _securedTouchMetadata_0x56ae("0x299"), _securedTouchMetadata_0x56ae("0x29a"), _securedTouchMetadata_0x56ae("0x29e"), _securedTouchMetadata_0x56ae("0x29f"), _securedTouchMetadata_0x56ae("0x2a0"), _securedTouchMetadata_0x56ae("0x2a2"), _securedTouchMetadata_0x56ae("0x2a3"), _securedTouchMetadata_0x56ae("0x2a8"), _securedTouchMetadata_0x56ae("0x2a5"), _securedTouchMetadata_0x56ae("0x2a6"), _securedTouchMetadata_0x56ae("0x2a9"), _securedTouchMetadata_0x56ae("0x2aa"), _securedTouchMetadata_0x56ae("0x2ab"), _securedTouchMetadata_0x56ae("0x2ac"), _securedTouchMetadata_0x56ae("0x2ad"), _securedTouchMetadata_0x56ae("0x2ae"), _securedTouchMetadata_0x56ae("0x2af"), _securedTouchMetadata_0x56ae("0x2b0"), _securedTouchMetadata_0x56ae("0x29d"), _securedTouchMetadata_0x56ae("0x2b1"), _securedTouchMetadata_0x56ae("0x2b2"), _securedTouchMetadata_0x56ae("0x2b3"), _securedTouchMetadata_0x56ae("0x2b4"), _securedTouchMetadata_0x56ae("0x2b5"), _securedTouchMetadata_0x56ae("0x2b6")]; e < t[_securedTouchMetadata_0x56ae("0x11")]; e++) {
                if (navigator[t[e]])
                    return !0
            }
            return !1
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x1a1")] = function() {
            return window[_securedTouchMetadata_0x56ae("0x2b7")] && window[_securedTouchMetadata_0x56ae("0x2b7")][_securedTouchMetadata_0x56ae("0x5a")]() && -1 != window[_securedTouchMetadata_0x56ae("0x2b7")][_securedTouchMetadata_0x56ae("0x5a")]()[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x2b8"))
        }
        ,
        e
    }();
    e[_securedTouchMetadata_0x56ae("0x19a")] = t
}(_securedTouchMetadata || (_securedTouchMetadata = {})),
function(e) {
    var t = function() {
        function t(e) {
            this[_securedTouchMetadata_0x56ae("0x2b9")] = e,
            this[_securedTouchMetadata_0x56ae("0x2ba")] = {}
        }
        return t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x2bb")] = function(e, t) {
            if (t[_securedTouchMetadata_0x56ae("0x2bc")])
                for (var a = 0, r = t[_securedTouchMetadata_0x56ae("0x2bd")]; a < r[_securedTouchMetadata_0x56ae("0x11")]; a++) {
                    var n = r[a];
                    this[_securedTouchMetadata_0x56ae("0x2ba")][n] || (this[_securedTouchMetadata_0x56ae("0x2ba")][n] = []),
                    this[_securedTouchMetadata_0x56ae("0x2ba")][n][_securedTouchMetadata_0x56ae("0x12")](e)
                }
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x2be")] = function(e, a, r) {
            var n = this;
            if (void 0 === r && (r = null),
            typeof e != _securedTouchMetadata_0x56ae("0x8"))
                return {
                    lied: !1,
                    lieTypes: []
                };
            var o = e[_securedTouchMetadata_0x56ae("0x178")][_securedTouchMetadata_0x56ae("0x2bf")](/get\s/, "")
              , c = {
                undefined_properties: function() {
                    return !!r && t[_securedTouchMetadata_0x56ae("0x2c0")](r, o)
                },
                to_string: function() {
                    return t[_securedTouchMetadata_0x56ae("0x2c1")](e, o, n[_securedTouchMetadata_0x56ae("0x2c2")])
                },
                prototype_in_function: function() {
                    return t[_securedTouchMetadata_0x56ae("0x2c3")](e)
                },
                own_property: function() {
                    return t[_securedTouchMetadata_0x56ae("0x2c4")](e)
                },
                object_to_string_error: function() {
                    return t[_securedTouchMetadata_0x56ae("0x2c5")](e)
                }
            }
              , s = Object[_securedTouchMetadata_0x56ae("0x170")](c)[_securedTouchMetadata_0x56ae("0x2c6")](function(e) {
                return !n[_securedTouchMetadata_0x56ae("0x2b9")][_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0x2c7") + e) && !!c[e]()
            });
            return {
                lied: s[_securedTouchMetadata_0x56ae("0x11")] > 0,
                lieTypes: s
            }
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xad")] = function() {
            return __awaiter(this, void 0, void 0, function() {
                var e;
                return __generator(this, function(t) {
                    switch (t[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return this[_securedTouchMetadata_0x56ae("0x2b9")][_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0x16e")) ? [2, this[_securedTouchMetadata_0x56ae("0x2ba")]] : (this[_securedTouchMetadata_0x56ae("0x2b9")][_securedTouchMetadata_0x56ae("0xf3")](_securedTouchMetadata_0x56ae("0x2c8")) || (e = _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x1df")](_securedTouchMetadata_0x56ae("0x1e0"))) && (document[_securedTouchMetadata_0x56ae("0x1e3")][_securedTouchMetadata_0x56ae("0x1e4")](e),
                        this[_securedTouchMetadata_0x56ae("0x2c2")] = e),
                        [4, Promise[_securedTouchMetadata_0x56ae("0xb3")]([this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return AnalyserNode
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2ca")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return AudioBuffer
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2cb")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return BiquadFilterNode
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2cc")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return CanvasRenderingContext2D
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2cd")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return DOMRect
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2f")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return DOMRectReadOnly
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2ce")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return Element
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2cf")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return HTMLCanvasElement
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2f")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return Math
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x294")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return MediaDevices
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0xeb")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return Navigator
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x4b")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return OffscreenCanvasRenderingContext2D
                        }, {
                            target: [_securedTouchMetadata_0x56ae("0x2cd")]
                        }), this[_securedTouchMetadata_0x56ae("0x2c9")](function() {
                            return SVGRect
                        }, {
                            target: ["x"]
                        })])]);
                    case 1:
                        return t[_securedTouchMetadata_0x56ae("0xb4")](),
                        this[_securedTouchMetadata_0x56ae("0x2c2")][_securedTouchMetadata_0x56ae("0x1e9")](),
                        [2, this[_securedTouchMetadata_0x56ae("0x2ba")]]
                    }
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x2c9")] = function(e, t) {
            var a = void 0 === t ? {} : t
              , r = a[_securedTouchMetadata_0x56ae("0x2d0")]
              , n = void 0 === r ? [] : r
              , o = a[_securedTouchMetadata_0x56ae("0x2d1")]
              , c = void 0 === o ? [] : o;
            return __awaiter(this, void 0, void 0, function() {
                var t, a, r = this;
                return __generator(this, function(o) {
                    try {
                        if (t = e(),
                        typeof (s = t) == _securedTouchMetadata_0x56ae("0x28") || !s)
                            return [2]
                    } catch (e) {
                        return [2]
                    }
                    var s;
                    return a = t[_securedTouchMetadata_0x56ae("0x13")] ? t[_securedTouchMetadata_0x56ae("0x13")] : t,
                    Object[_securedTouchMetadata_0x56ae("0x2d2")](a)[_securedTouchMetadata_0x56ae("0xed")](function(e) {
                        if (!(e == _securedTouchMetadata_0x56ae("0x2d3") || n[_securedTouchMetadata_0x56ae("0x11")] && !new Set(n)[_securedTouchMetadata_0x56ae("0xf3")](e) || c[_securedTouchMetadata_0x56ae("0x11")] && new Set(c)[_securedTouchMetadata_0x56ae("0xf3")](e))) {
                            var a = /\s(.+)\]/
                              , o = (t[_securedTouchMetadata_0x56ae("0x178")] ? t[_securedTouchMetadata_0x56ae("0x178")] : a[_securedTouchMetadata_0x56ae("0xd5")](t) ? a[_securedTouchMetadata_0x56ae("0xe0")](t)[1] : void 0) + "." + e;
                            try {
                                var s = t[_securedTouchMetadata_0x56ae("0x13")] ? t[_securedTouchMetadata_0x56ae("0x13")] : t;
                                try {
                                    if (typeof s[e] == _securedTouchMetadata_0x56ae("0x8")) {
                                        var i = r[_securedTouchMetadata_0x56ae("0x2be")](s[e], s);
                                        return void r[_securedTouchMetadata_0x56ae("0x2bb")](o, i)
                                    }
                                } catch (e) {}
                                var u = Object[_securedTouchMetadata_0x56ae("0x1d9")](s, e)[_securedTouchMetadata_0x56ae("0xf8")]
                                  , d = r[_securedTouchMetadata_0x56ae("0x2be")](u, s, t);
                                r[_securedTouchMetadata_0x56ae("0x2bb")](o, d)
                            } catch (t) {
                                _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x2d4") + e + _securedTouchMetadata_0x56ae("0x2d5"), t)
                            }
                        }
                    }),
                    [2]
                })
            })
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x2c0")] = function(e, t) {
            var a = e[_securedTouchMetadata_0x56ae("0x178")]
              , r = window[a[_securedTouchMetadata_0x56ae("0x2d6")](0)[_securedTouchMetadata_0x56ae("0x33")]() + a[_securedTouchMetadata_0x56ae("0x2d7")](1)];
            return !!r && (typeof Object[_securedTouchMetadata_0x56ae("0x1d9")](r, t) != _securedTouchMetadata_0x56ae("0x28") || typeof Reflect[_securedTouchMetadata_0x56ae("0x1d9")](r, t) != _securedTouchMetadata_0x56ae("0x28"))
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x2c1")] = function(e, t, a) {
            var r, n;
            try {
                r = a[_securedTouchMetadata_0x56ae("0x2d8")][_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x5a")][_securedTouchMetadata_0x56ae("0xc")](e)
            } catch (e) {}
            try {
                n = a[_securedTouchMetadata_0x56ae("0x2d8")][_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x5a")][_securedTouchMetadata_0x56ae("0xc")](e[_securedTouchMetadata_0x56ae("0x5a")])
            } catch (e) {}
            var o = r || e[_securedTouchMetadata_0x56ae("0x5a")]()
              , c = n || e[_securedTouchMetadata_0x56ae("0x5a")][_securedTouchMetadata_0x56ae("0x5a")]()
              , s = function(e) {
                var t;
                return (t = {})[_securedTouchMetadata_0x56ae("0x2d9") + e + _securedTouchMetadata_0x56ae("0x2da")] = !0,
                t[_securedTouchMetadata_0x56ae("0x2db") + e + _securedTouchMetadata_0x56ae("0x2da")] = !0,
                t[_securedTouchMetadata_0x56ae("0x2dc")] = !0,
                t[_securedTouchMetadata_0x56ae("0x2d9") + e + _securedTouchMetadata_0x56ae("0x2dd") + "\n" + _securedTouchMetadata_0x56ae("0x2de") + "\n}"] = !0,
                t[_securedTouchMetadata_0x56ae("0x2db") + e + _securedTouchMetadata_0x56ae("0x2dd") + "\n" + _securedTouchMetadata_0x56ae("0x2de") + "\n}"] = !0,
                t[_securedTouchMetadata_0x56ae("0x2df") + "\n" + _securedTouchMetadata_0x56ae("0x2de") + "\n}"] = !0,
                t
            };
            return !s(t)[o] || !s(_securedTouchMetadata_0x56ae("0x5a"))[c]
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x2c3")] = function(e) {
            return _securedTouchMetadata_0x56ae("0x13")in e
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x2c4")] = function(e) {
            return e[_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x2e0")) || e[_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x2e1")) || e[_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x13")) || e[_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x5a"))
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x2c5")] = function(t) {
            try {
                return Object[_securedTouchMetadata_0x56ae("0x2e2")](t)[_securedTouchMetadata_0x56ae("0x5a")](),
                !0
            } catch (t) {
                var a = t[_securedTouchMetadata_0x56ae("0x2e3")][_securedTouchMetadata_0x56ae("0x2e4")]("\n")
                  , r = /at Object\.apply/
                  , n = !a[_securedTouchMetadata_0x56ae("0x2d7")](1)[_securedTouchMetadata_0x56ae("0x2e5")](function(e) {
                    return r[_securedTouchMetadata_0x56ae("0xd5")](e)
                })
                  , o = t[_securedTouchMetadata_0x56ae("0x2d3")][_securedTouchMetadata_0x56ae("0x178")] == _securedTouchMetadata_0x56ae("0x2e6") && a[_securedTouchMetadata_0x56ae("0x11")] > 1
                  , c = _securedTouchMetadata_0x56ae("0x53")in window || e[_securedTouchMetadata_0x56ae("0x298")][_securedTouchMetadata_0x56ae("0x1cf")]();
                return !(!o || !c || /at Function\.toString/[_securedTouchMetadata_0x56ae("0xd5")](a[1]) && n) || !o
            }
        }
        ,
        t
    }();
    e[_securedTouchMetadata_0x56ae("0xac")] = t
}(_securedTouchMetadata || (_securedTouchMetadata = {})),
function(e) {
    var t = function() {
        function t(e) {
            this[_securedTouchMetadata_0x56ae("0x2b9")] = e,
            this[_securedTouchMetadata_0x56ae("0x2ba")] = new Map
        }
        return t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x173")] = function() {
            return this[_securedTouchMetadata_0x56ae("0x2e7")](_securedTouchMetadata_0x56ae("0x2e8"), function() {
                try {
                    return !!document[_securedTouchMetadata_0x56ae("0x15")](_securedTouchMetadata_0x56ae("0x1e0"))[_securedTouchMetadata_0x56ae("0x1e1")]
                } catch (e) {
                    return !0
                }
            }),
            this[_securedTouchMetadata_0x56ae("0x2e7")](_securedTouchMetadata_0x56ae("0x2e9"), function() {
                var e = document[_securedTouchMetadata_0x56ae("0x15")](_securedTouchMetadata_0x56ae("0x1e0"));
                return e[_securedTouchMetadata_0x56ae("0x1e1")] = "" + _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x2ea")](crypto[_securedTouchMetadata_0x56ae("0x2eb")](new Uint32Array(10))),
                !!e[_securedTouchMetadata_0x56ae("0x1e6")]
            }),
            this[_securedTouchMetadata_0x56ae("0x2e7")](_securedTouchMetadata_0x56ae("0x2ec"), function() {
                var e = _securedTouchMetadata_0x56ae("0x2ed")in window ? _securedTouchMetadata_0x56ae("0x2ed") : _securedTouchMetadata_0x56ae("0x2ee")in window ? _securedTouchMetadata_0x56ae("0x2ee") : _securedTouchMetadata_0x56ae("0x2ef")
                  , t = [];
                for (var a in window)
                    t[_securedTouchMetadata_0x56ae("0x12")](a);
                return t[_securedTouchMetadata_0x56ae("0x36")](_securedTouchMetadata_0x56ae("0x53")) > t[_securedTouchMetadata_0x56ae("0x36")](e)
            }),
            this[_securedTouchMetadata_0x56ae("0x2e7")](_securedTouchMetadata_0x56ae("0x2f0"), function() {
                if (!(_securedTouchMetadata_0x56ae("0x53")in window && _securedTouchMetadata_0x56ae("0x1cd")in window[_securedTouchMetadata_0x56ae("0x53")]))
                    return !1;
                try {
                    return _securedTouchMetadata_0x56ae("0x13")in window[_securedTouchMetadata_0x56ae("0x53")][_securedTouchMetadata_0x56ae("0x1cd")][_securedTouchMetadata_0x56ae("0x2f1")] || _securedTouchMetadata_0x56ae("0x13")in window[_securedTouchMetadata_0x56ae("0x53")][_securedTouchMetadata_0x56ae("0x1cd")][_securedTouchMetadata_0x56ae("0x2f2")] || (new (window[_securedTouchMetadata_0x56ae("0x53")][_securedTouchMetadata_0x56ae("0x1cd")][_securedTouchMetadata_0x56ae("0x2f1")]),
                    new (window[_securedTouchMetadata_0x56ae("0x53")][_securedTouchMetadata_0x56ae("0x1cd")][_securedTouchMetadata_0x56ae("0x2f2")]),
                    !0)
                } catch (e) {
                    return e[_securedTouchMetadata_0x56ae("0x2d3")][_securedTouchMetadata_0x56ae("0x178")] != _securedTouchMetadata_0x56ae("0x2e6")
                }
            }),
            this[_securedTouchMetadata_0x56ae("0x2e7")](_securedTouchMetadata_0x56ae("0x2f3"), function() {
                var e = new (t[_securedTouchMetadata_0x56ae("0x2f4")]);
                return e[_securedTouchMetadata_0x56ae("0x2f5")](Function[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x5a")]) || e[_securedTouchMetadata_0x56ae("0x2f5")](function() {})
            }),
            this[_securedTouchMetadata_0x56ae("0x2ba")]
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x2e7")] = function(e, t) {
            if (!this[_securedTouchMetadata_0x56ae("0x2b9")][_securedTouchMetadata_0x56ae("0xf3")](e))
                try {
                    this[_securedTouchMetadata_0x56ae("0x2ba")][e] = t()
                } catch (t) {
                    _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](_securedTouchMetadata_0x56ae("0x2f6") + e + _securedTouchMetadata_0x56ae("0x2f7"), t)
                }
        }
        ,
        t[_securedTouchMetadata_0x56ae("0x2f4")] = function() {
            function t() {}
            return t[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x2f5")] = function(t) {
                var a = this;
                try {
                    return this[_securedTouchMetadata_0x56ae("0x2f8")] = function() {
                        return Object[_securedTouchMetadata_0x56ae("0x2e2")](t)[_securedTouchMetadata_0x56ae("0x5a")]()
                    }
                    ,
                    this[_securedTouchMetadata_0x56ae("0x2f9")] = function() {
                        return a[_securedTouchMetadata_0x56ae("0x2f8")]()
                    }
                    ,
                    this[_securedTouchMetadata_0x56ae("0x2fa")] = function() {
                        return a[_securedTouchMetadata_0x56ae("0x2f9")]()
                    }
                    ,
                    this[_securedTouchMetadata_0x56ae("0x2fa")](),
                    !0
                } catch (t) {
                    var r = t[_securedTouchMetadata_0x56ae("0x2e3")][_securedTouchMetadata_0x56ae("0x2e4")]("\n")
                      , n = !/at Object\.apply/[_securedTouchMetadata_0x56ae("0xd5")](r[1])
                      , o = t[_securedTouchMetadata_0x56ae("0x2d3")][_securedTouchMetadata_0x56ae("0x178")] == _securedTouchMetadata_0x56ae("0x2e6") && r[_securedTouchMetadata_0x56ae("0x11")] >= 5
                      , c = _securedTouchMetadata_0x56ae("0x53")in window || e[_securedTouchMetadata_0x56ae("0x298")][_securedTouchMetadata_0x56ae("0x1cf")]();
                    return !(!o || !c || n && /at Function\.toString/[_securedTouchMetadata_0x56ae("0xd5")](r[1]) && /\.you/[_securedTouchMetadata_0x56ae("0xd5")](r[2]) && /\.cant/[_securedTouchMetadata_0x56ae("0xd5")](r[3]) && /\.hide/[_securedTouchMetadata_0x56ae("0xd5")](r[4])) || !o
                }
            }
            ,
            t
        }(),
        t
    }();
    e[_securedTouchMetadata_0x56ae("0x172")] = t
}(_securedTouchMetadata || (_securedTouchMetadata = {})),
function(e) {
    var t = function() {
        function e(e) {
            this[_securedTouchMetadata_0x56ae("0x2b9")] = e
        }
        return e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xaa")] = function() {
            return __awaiter(this, void 0, void 0, function() {
                var e, t = this;
                return __generator(this, function(a) {
                    switch (a[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return [4, this[_securedTouchMetadata_0x56ae("0x2fb")](window)];
                    case 1:
                        return e = a[_securedTouchMetadata_0x56ae("0xb4")](),
                        [4, this[_securedTouchMetadata_0x56ae("0xd5")](e, _securedTouchMetadata_0x56ae("0x2fc"), function() {
                            return __awaiter(t, void 0, void 0, function() {
                                var e, t;
                                return __generator(this, function(a) {
                                    switch (a[_securedTouchMetadata_0x56ae("0xd")]) {
                                    case 0:
                                        return Object[_securedTouchMetadata_0x56ae("0x2fd")] && (e = _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0x1df")](_securedTouchMetadata_0x56ae("0x1e0"))) ? (e[_securedTouchMetadata_0x56ae("0x1e1")] = _securedTouchMetadata_0x56ae("0x2fe"),
                                        document[_securedTouchMetadata_0x56ae("0x1e3")][_securedTouchMetadata_0x56ae("0x1e4")](e),
                                        Object[_securedTouchMetadata_0x56ae("0x2fd")](HTMLIFrameElement[_securedTouchMetadata_0x56ae("0x13")])[_securedTouchMetadata_0x56ae("0x1e6")][_securedTouchMetadata_0x56ae("0xf8")][_securedTouchMetadata_0x56ae("0x5a")]() !== _securedTouchMetadata_0x56ae("0x2ff") ? [2, !0] : e[_securedTouchMetadata_0x56ae("0x1e6")] === window ? [2, !0] : [4, this[_securedTouchMetadata_0x56ae("0x2fb")](e[_securedTouchMetadata_0x56ae("0x1e6")])]) : [2];
                                    case 1:
                                        return t = a[_securedTouchMetadata_0x56ae("0xb4")](),
                                        e[_securedTouchMetadata_0x56ae("0x1e9")](),
                                        [2, t]
                                    }
                                })
                            })
                        })];
                    case 2:
                        return a[_securedTouchMetadata_0x56ae("0xb4")](),
                        [2, e]
                    }
                })
            })
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0x2fb")] = function(e) {
            return __awaiter(this, void 0, void 0, function() {
                var t, a, r = this;
                return __generator(this, function(n) {
                    switch (n[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return t = new Map,
                        (a = [])[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x300"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                return __generator(this, function(t) {
                                    return [2, /HeadlessChrome/[_securedTouchMetadata_0x56ae("0xd5")](e[_securedTouchMetadata_0x56ae("0x301")][_securedTouchMetadata_0x56ae("0x32")])]
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x302"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                return __generator(this, function(t) {
                                    return [2, _securedTouchMetadata_0x56ae("0x129")in e[_securedTouchMetadata_0x56ae("0x301")]]
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x303"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                return __generator(this, function(t) {
                                    return [2, /Chrome/[_securedTouchMetadata_0x56ae("0xd5")](e[_securedTouchMetadata_0x56ae("0x301")][_securedTouchMetadata_0x56ae("0x32")]) && !e[_securedTouchMetadata_0x56ae("0x53")]]
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x304"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                var t;
                                return __generator(this, function(a) {
                                    switch (a[_securedTouchMetadata_0x56ae("0xd")]) {
                                    case 0:
                                        return e[_securedTouchMetadata_0x56ae("0x301")][_securedTouchMetadata_0x56ae("0xb7")] && e[_securedTouchMetadata_0x56ae("0x12e")] ? [4, e[_securedTouchMetadata_0x56ae("0x301")][_securedTouchMetadata_0x56ae("0xb7")][_securedTouchMetadata_0x56ae("0x1f9")]({
                                            name: _securedTouchMetadata_0x56ae("0x1f6")
                                        })] : [3, 2];
                                    case 1:
                                        return t = a[_securedTouchMetadata_0x56ae("0xb4")](),
                                        [2, e[_securedTouchMetadata_0x56ae("0x12e")][_securedTouchMetadata_0x56ae("0x1c5")] === _securedTouchMetadata_0x56ae("0x305") && t[_securedTouchMetadata_0x56ae("0x1fa")] === _securedTouchMetadata_0x56ae("0x306")];
                                    case 2:
                                        return [2]
                                    }
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x307"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                var t;
                                return __generator(this, function(a) {
                                    return (t = e[_securedTouchMetadata_0x56ae("0x301")][_securedTouchMetadata_0x56ae("0xb7")]) ? t[_securedTouchMetadata_0x56ae("0x1f9")][_securedTouchMetadata_0x56ae("0x5a")]() !== _securedTouchMetadata_0x56ae("0x308") ? [2, !0] : t[_securedTouchMetadata_0x56ae("0x1f9")][_securedTouchMetadata_0x56ae("0x5a")][_securedTouchMetadata_0x56ae("0x5a")]() !== _securedTouchMetadata_0x56ae("0x309") ? [2, !0] : t[_securedTouchMetadata_0x56ae("0x1f9")][_securedTouchMetadata_0x56ae("0x5a")][_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x30a")) && t[_securedTouchMetadata_0x56ae("0x1f9")][_securedTouchMetadata_0x56ae("0x5a")][_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x30b")) && t[_securedTouchMetadata_0x56ae("0x1f9")][_securedTouchMetadata_0x56ae("0x5a")][_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x30c")) ? [2, !0] : [2, t[_securedTouchMetadata_0x56ae("0x14d")](_securedTouchMetadata_0x56ae("0x1f9"))] : [2]
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x30d"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                return __generator(this, function(e) {
                                    return [2, 0 === navigator[_securedTouchMetadata_0x56ae("0x4b")][_securedTouchMetadata_0x56ae("0x11")]]
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x30e"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                return __generator(this, function(e) {
                                    return [2, "" === navigator[_securedTouchMetadata_0x56ae("0x27")]]
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x30f"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                var e;
                                return __generator(this, function(t) {
                                    return e = PluginArray[_securedTouchMetadata_0x56ae("0x13")] === navigator[_securedTouchMetadata_0x56ae("0x4b")][_securedTouchMetadata_0x56ae("0x310")],
                                    navigator[_securedTouchMetadata_0x56ae("0x4b")][_securedTouchMetadata_0x56ae("0x11")] > 0 && (e = e && Plugin[_securedTouchMetadata_0x56ae("0x13")] === navigator[_securedTouchMetadata_0x56ae("0x4b")][0][_securedTouchMetadata_0x56ae("0x310")]),
                                    [2, e]
                                })
                            })
                        })),
                        a[_securedTouchMetadata_0x56ae("0x12")](this[_securedTouchMetadata_0x56ae("0xd5")](t, _securedTouchMetadata_0x56ae("0x311"), function() {
                            return __awaiter(r, void 0, void 0, function() {
                                var e;
                                return __generator(this, function(t) {
                                    return e = MimeTypeArray[_securedTouchMetadata_0x56ae("0x13")] === navigator[_securedTouchMetadata_0x56ae("0x11e")][_securedTouchMetadata_0x56ae("0x310")],
                                    navigator[_securedTouchMetadata_0x56ae("0x11e")][_securedTouchMetadata_0x56ae("0x11")] > 0 && (e = e && MimeType[_securedTouchMetadata_0x56ae("0x13")] === navigator[_securedTouchMetadata_0x56ae("0x11e")][0][_securedTouchMetadata_0x56ae("0x310")]),
                                    [2, e]
                                })
                            })
                        })),
                        [4, Promise[_securedTouchMetadata_0x56ae("0xb3")](a)];
                    case 1:
                        return n[_securedTouchMetadata_0x56ae("0xb4")](),
                        [2, t]
                    }
                })
            })
        }
        ,
        e[_securedTouchMetadata_0x56ae("0x13")][_securedTouchMetadata_0x56ae("0xd5")] = function(e, t, a) {
            return __awaiter(this, void 0, void 0, function() {
                var r, n;
                return __generator(this, function(o) {
                    switch (o[_securedTouchMetadata_0x56ae("0xd")]) {
                    case 0:
                        return o[_securedTouchMetadata_0x56ae("0x10")][_securedTouchMetadata_0x56ae("0x12")]([0, 3, , 4]),
                        this[_securedTouchMetadata_0x56ae("0x2b9")][_securedTouchMetadata_0x56ae("0xf3")](t) ? [3, 2] : [4, _securedTouchUtils[_securedTouchMetadata_0x56ae("0x93")][_securedTouchMetadata_0x56ae("0xcb")](1500, a())];
                    case 1:
                        null != (r = o[_securedTouchMetadata_0x56ae("0xb4")]()) && (e[t] = r),
                        o[_securedTouchMetadata_0x56ae("0xd")] = 2;
                    case 2:
                        return [3, 4];
                    case 3:
                        return n = o[_securedTouchMetadata_0x56ae("0xb4")](),
                        _securedTouchUtils[_securedTouchMetadata_0x56ae("0x99")][_securedTouchMetadata_0x56ae("0x9a")](t + _securedTouchMetadata_0x56ae("0x312"), n),
                        [3, 4];
                    case 4:
                        return [2]
                    }
                })
            })
        }
        ,
        e
    }();
    e[_securedTouchMetadata_0x56ae("0xa9")] = t
}(_securedTouchMetadata || (_securedTouchMetadata = {})),
function(e) {
    var t = function() {
        function e() {}
        return e[_securedTouchMetadata_0x56ae("0xa5")] = function() {
            return new Promise(function(e) {
                var t, a, r = function() {
                    return e(!0)
                }, n = function() {
                    return e(!1)
                };
                try {
                    if ((a = navigator && /(?=.*(opera|chrome)).*/i[_securedTouchMetadata_0x56ae("0xd5")](navigator[_securedTouchMetadata_0x56ae("0x32")]) && navigator[_securedTouchMetadata_0x56ae("0x313")] && navigator[_securedTouchMetadata_0x56ae("0x313")][_securedTouchMetadata_0x56ae("0x314")]) && navigator[_securedTouchMetadata_0x56ae("0x313")][_securedTouchMetadata_0x56ae("0x314")]()[_securedTouchMetadata_0x56ae("0x5")](function(e) {
                        e[_securedTouchMetadata_0x56ae("0x315")] < 12e7 ? r() : n()
                    })[_securedTouchMetadata_0x56ae("0x98")](function(e) {
                        n()
                    }),
                    a)
                        return;
                    if (function() {
                        var e = _securedTouchMetadata_0x56ae("0x27e")in document[_securedTouchMetadata_0x56ae("0x162")][_securedTouchMetadata_0x56ae("0x27f")];
                        if (e)
                            if (null == indexedDB)
                                r();
                            else {
                                var t = indexedDB[_securedTouchMetadata_0x56ae("0x280")](_securedTouchMetadata_0x56ae("0x316"));
                                t[_securedTouchMetadata_0x56ae("0x282")] = n,
                                t[_securedTouchMetadata_0x56ae("0x281")] = r
                            }
                        return e
                    }())
                        return;
                    if (function() {
                        var e = navigator && navigator[_securedTouchMetadata_0x56ae("0x32")] && navigator[_securedTouchMetadata_0x56ae("0x32")][_securedTouchMetadata_0x56ae("0x317")](/Version\/([0-9\._]+).*Safari/);
                        if (e) {
                            if (parseInt(e[1], 10) < 11)
                                return function() {
                                    try {
                                        localStorage[_securedTouchMetadata_0x56ae("0x11")] ? n() : (localStorage[_securedTouchMetadata_0x56ae("0x318")](_securedTouchMetadata_0x56ae("0x316"), "0"),
                                        localStorage[_securedTouchMetadata_0x56ae("0x27c")](_securedTouchMetadata_0x56ae("0x316")),
                                        n())
                                    } catch (e) {
                                        navigator[_securedTouchMetadata_0x56ae("0x192")] ? r() : n()
                                    }
                                    return !0
                                }();
                            try {
                                window[_securedTouchMetadata_0x56ae("0x79")](null, null, null, null),
                                n()
                            } catch (e) {
                                r()
                            }
                        }
                        return !!e
                    }())
                        return;
                    if ((t = !window[_securedTouchMetadata_0x56ae("0x77")] && (window[_securedTouchMetadata_0x56ae("0x284")] || window[_securedTouchMetadata_0x56ae("0x285")])) && r(),
                    t)
                        return
                } catch (e) {}
                return n()
            }
            )
        }
        ,
        e
    }();
    e[_securedTouchMetadata_0x56ae("0xa4")] = t
}(_securedTouchMetadata || (_securedTouchMetadata = {}));
var __awaiter = this && this.__awaiter || function(e, t, a, r) {
    return new (a || (a = Promise))(function(n, o) {
        function c(e) {
            try {
                i(r.next(e))
            } catch (e) {
                o(e)
            }
        }
        function s(e) {
            try {
                i(r.throw(e))
            } catch (e) {
                o(e)
            }
        }
        function i(e) {
            var t;
            e.done ? n(e.value) : (t = e.value,
            t instanceof a ? t : new a(function(e) {
                e(t)
            }
            )).then(c, s)
        }
        i((r = r.apply(e, t || [])).next())
    }
    )
}
, __generator = this && this.__generator || function(e, t) {
    var a, r, n, o, c = {
        label: 0,
        sent: function() {
            if (1 & n[0])
                throw n[1];
            return n[1]
        },
        trys: [],
        ops: []
    };
    return o = {
        next: s(0),
        throw: s(1),
        return: s(2)
    },
    "function" == typeof Symbol && (o[Symbol.iterator] = function() {
        return this
    }
    ),
    o;
    function s(o) {
        return function(s) {
            return function(o) {
                if (a)
                    throw new TypeError("Generator is already executing.");
                for (; c; )
                    try {
                        if (a = 1,
                        r && (n = 2 & o[0] ? r.return : o[0] ? r.throw || ((n = r.return) && n.call(r),
                        0) : r.next) && !(n = n.call(r, o[1])).done)
                            return n;
                        switch (r = 0,
                        n && (o = [2 & o[0], n.value]),
                        o[0]) {
                        case 0:
                        case 1:
                            n = o;
                            break;
                        case 4:
                            return c.label++,
                            {
                                value: o[1],
                                done: !1
                            };
                        case 5:
                            c.label++,
                            r = o[1],
                            o = [0];
                            continue;
                        case 7:
                            o = c.ops.pop(),
                            c.trys.pop();
                            continue;
                        default:
                            if (!(n = (n = c.trys).length > 0 && n[n.length - 1]) && (6 === o[0] || 2 === o[0])) {
                                c = 0;
                                continue
                            }
                            if (3 === o[0] && (!n || o[1] > n[0] && o[1] < n[3])) {
                                c.label = o[1];
                                break
                            }
                            if (6 === o[0] && c.label < n[1]) {
                                c.label = n[1],
                                n = o;
                                break
                            }
                            if (n && c.label < n[2]) {
                                c.label = n[2],
                                c.ops.push(o);
                                break
                            }
                            n[2] && c.ops.pop(),
                            c.trys.pop();
                            continue
                        }
                        o = t.call(e, c)
                    } catch (e) {
                        o = [6, e],
                        r = 0
                    } finally {
                        a = n = 0
                    }
                if (5 & o[0])
                    throw o[1];
                return {
                    value: o[0] ? o[1] : void 0,
                    done: !0
                }
            }([o, s])
        }
    }
}
, __extends = this && this.__extends || function() {
    var e = function(t, a) {
        return (e = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var a in t)
                t.hasOwnProperty(a) && (e[a] = t[a])
        }
        )(t, a)
    };
    return function(t, a) {
        function r() {
            this.constructor = t
        }
        e(t, a),
        t.prototype = null === a ? Object.create(a) : (r.prototype = a.prototype,
        new r)
    }
}(), _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities, _securedTouchEntities;
!function(e) {
    !function(e) {
        e[e.Unknown = 0] = "Unknown",
        e[e.FlingRight = 1] = "FlingRight",
        e[e.FlingLeft = 2] = "FlingLeft",
        e[e.FlingUp = 3] = "FlingUp",
        e[e.FlingDown = 4] = "FlingDown",
        e[e.Diagonal = 5] = "Diagonal",
        e[e.ScrollRight = 6] = "ScrollRight",
        e[e.ScrollLeft = 7] = "ScrollLeft",
        e[e.ScrollUp = 8] = "ScrollUp",
        e[e.ScrollDown = 9] = "ScrollDown",
        e[e.Tap = 10] = "Tap",
        e[e.DoubleTap = 11] = "DoubleTap"
    }(e.GestureType || (e.GestureType = {}))
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(e, t, a) {
            this.clientVersion = e,
            this.stMetrics = a,
            this.customHeaders = new Map,
            this.customHeaders.set("clientVersion", this.clientVersion),
            this.customHeaders.set("instanceUUID", t)
        }
        return t.prototype.setHeader = function(e, t) {
            this.customHeaders.set(e, t)
        }
        ,
        t.prototype.removeHeader = function(e) {
            this.customHeaders.delete(e)
        }
        ,
        t.prototype.setCustomHeaders = function(e, t) {
            e.setRequestHeader("Accept", "application/json"),
            e.setRequestHeader("Content-Type", "application/json"),
            e.setRequestHeader("Attempt", "" + t),
            e.setRequestHeader("clientEpoch", "" + (new Date).getTime()),
            this.customHeaders.forEach(function(t, a) {
                e.setRequestHeader(a, t)
            })
        }
        ,
        t.isGzipEnabled = function() {
            try {
                return !!_securedTouchDependencies.pako
            } catch (e) {
                return !1
            }
        }
        ,
        t.prototype.encryptionString = function(e, t) {
            for (var a = [], r = 0; r < e.length; r++) {
                var n = e.charCodeAt(r) ^ t.charCodeAt(r % t.length);
                a.push(String.fromCharCode(n))
            }
            return a.join("")
        }
        ,
        t.prototype.encryptionBytes = function(e, t) {
            for (var a = new Uint8Array(e.length), r = 0; r < e.length; r++)
                a[r] = e[r] ^ t.charCodeAt(r % t.length);
            return a
        }
        ,
        t.prototype.postJson = function(t, a, r, n, o, c, s) {
            var i = this
              , u = this;
            return new Promise(function(d, h) {
                if (o) {
                    var _ = new XMLHttpRequest;
                    _.open("POST", t, !0),
                    _.withCredentials = !0,
                    _.timeout = 1e3 * r,
                    _.setRequestHeader("Authorization", o),
                    u.setCustomHeaders(_, n),
                    _.onload = function() {
                        if (_.status >= 200 && _.status < 400)
                            try {
                                var e = JSON.parse(_.responseText ? _.responseText : "{}");
                                d(e)
                            } catch (e) {
                                h(_securedTouchUtils.SecuredTouchUtil.createError(_securedTouchRemoteLogger.SecuredTouchErrorCodes.PARSING_ERROR, "failed to parse json response. ", null))
                            }
                        else {
                            var t = 0 !== _.status ? {
                                status: _.status,
                                statsText: _.statusText
                            } : null;
                            h(_securedTouchUtils.SecuredTouchUtil.createError(_securedTouchRemoteLogger.SecuredTouchErrorCodes.SERVER_ERROR, "server returned error. ", t))
                        }
                    }
                    ,
                    _.ontimeout = function(e) {
                        h(_securedTouchUtils.SecuredTouchUtil.createError(_securedTouchRemoteLogger.SecuredTouchErrorCodes.SERVER_ERROR, "server timed out", null))
                    }
                    ,
                    _.onerror = function(e) {
                        _securedTouchUtils.STLogger.warn("request.onerror", e),
                        h(_securedTouchUtils.SecuredTouchUtil.createError(_securedTouchRemoteLogger.SecuredTouchErrorCodes.SERVER_ERROR, "network failure", null))
                    }
                    ;
                    var l = JSON.stringify(a);
                    if (!window["unzip-securedtouch"] && (c && e.STHttpClient.isGzipEnabled() && (l = _securedTouchDependencies.pako.gzip(l),
                    _.setRequestHeader("Content-Encoding", "gzip")),
                    s)) {
                        var T = "eG9yLWVuY3J5cHRpb24";
                        l = "string" == typeof l ? i.encryptionString(l, T) : i.encryptionBytes(l, T),
                        _.setRequestHeader("encrypted", "1")
                    }
                    0 != l.length ? (_.send(l),
                    i.stMetrics.network.setAttempt(n)) : h(_securedTouchUtils.SecuredTouchUtil.createError(_securedTouchRemoteLogger.SecuredTouchErrorCodes.SERVER_ERROR, "empty request", {
                        status: 400,
                        statsText: "Aborted, request is empty"
                    }))
                } else
                    h(_securedTouchUtils.SecuredTouchUtil.createError(_securedTouchRemoteLogger.SecuredTouchErrorCodes.SERVER_ERROR, "token is missing", {
                        status: 401,
                        statsText: "Aborted, Auth token is missing"
                    }))
            }
            )
        }
        ,
        t
    }();
    e.STHttpClient = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function e(e) {
            this.mapKey = e
        }
        return Object.defineProperty(e.prototype, "asMap", {
            get: function() {
                var t = e.stSessionStorage.getItem(this.mapKey);
                return t || (t = JSON.stringify({})),
                JSON.parse(t)
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.set = function(t, a) {
            var r = this.asMap;
            r[t] = a,
            e.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.SESSION_STORAGE_UPDATE_TS, (new Date).getTime()),
            e.stSessionStorage.setItem(this.mapKey, JSON.stringify(r))
        }
        ,
        e.prototype.get = function(e) {
            return this.asMap[e]
        }
        ,
        e.prototype.delete = function(t) {
            var a = this.asMap;
            delete a[t],
            e.stSessionStorage.setItem(this.mapKey, JSON.stringify(a))
        }
        ,
        e.prototype.values = function() {
            var e = this.asMap;
            return _securedTouchUtils.SecuredTouchUtil.values(e)
        }
        ,
        e.prototype.clear = function() {
            e.stSessionStorage.removeItem(this.mapKey)
        }
        ,
        e.stSessionStorage = _securedTouchStorage.SecuredTouchSessionStorage.instance.sessionStorage,
        e
    }();
    e.SecuredTouchStorageMap = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {
            this._token = t.TOKEN_DEFAULT,
            this._checksum = t.CHECKSUM_DEFAULT,
            this._sdkModesParams = new Map,
            this._currentSdkMode = t._DEFAULT_SDK_MODE,
            this._pointerParams = new e.SecuredTouchPointerParams
        }
        return Object.defineProperty(t, "instance", {
            get: function() {
                return t._instance || (t._instance = new t),
                t._instance
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.loadPointerFromCache = function(a) {
            var r = 6e4 * a.getInitParamsTTLInMinutes(e.SecuredTouchPointerParams.POINTER_CACHE_TTL_MINUTES_DEFAULT);
            if (Date.now() - a.lastInitParamsTs < r) {
                var n = a.initParams
                  , o = _securedTouchStorage.SecuredTouchSessionStorage.instance.getSdkMode() || t.DEFAULT_SDK_MODE;
                if (n)
                    if (n.CLIENT_POINTER_VERSION === t.POINTER_VERSION && this.refreshPointerParams(n, o))
                        return n
            }
            return a.removeInitParams(),
            null
        }
        ,
        t.prototype.updateSdkMode = function(e) {
            e !== this._currentSdkMode && (this.updatePointerParams(e),
            _securedTouchStorage.SecuredTouchSessionStorage.instance.setSdkMode(e))
        }
        ,
        t.prototype.loadPointerFromServer = function(e, t, a, r) {
            return void 0 === r && (r = 0),
            __awaiter(this, void 0, void 0, function() {
                var n, o, c;
                return __generator(this, function(s) {
                    switch (s.label) {
                    case 0:
                        n = null,
                        s.label = 1;
                    case 1:
                        return s.trys.push([1, 3, , 4]),
                        [4, e.getPointer(t, a, r)];
                    case 2:
                        return (o = s.sent()) && this.refreshPointerParams(o, a) ? (this.cachePointer(o, a),
                        [2, o]) : (n = {
                            errCode: _securedTouchRemoteLogger.SecuredTouchErrorCodes.PARSING_ERROR,
                            errMsg: "got invalid pointer config json",
                            error: null
                        },
                        [3, 4]);
                    case 3:
                        return c = s.sent(),
                        n = c,
                        [3, 4];
                    case 4:
                        return [2, Promise.reject(n)]
                    }
                })
            })
        }
        ,
        t.prototype.cachePointer = function(e, a) {
            var r = _securedTouchStorage.SecuredTouchSessionStorage.instance;
            e.CLIENT_POINTER_VERSION = t.POINTER_VERSION,
            r.setInitParams(e, this.pointerParams.pointerCacheTtlMinutes, a)
        }
        ,
        t.prototype.isValidPointer = function(a, r) {
            var n, o;
            if (!a.clientConfiguration)
                return !1;
            var c = a.token || t.TOKEN_DEFAULT
              , s = a.checksum || t.CHECKSUM_DEFAULT
              , i = (null === (n = a.clientConfiguration[r]) || void 0 === n ? void 0 : n.url) || (null === (o = a.clientConfiguration[t._DEFAULT_SDK_MODE]) || void 0 === o ? void 0 : o.url) || e.SecuredTouchPointerParams.URL_DEFAULT;
            return Boolean(i) && Boolean(c) && Boolean(s)
        }
        ,
        t.prototype.refreshPointerParams = function(e, a) {
            if (!this.isValidPointer(e, a))
                return !1;
            for (var r in e.deviceId && _securedTouchStorage.SecuredTouchSessionStorage.instance.resetDeviceCredentials(e.deviceId),
            this._token = e.token || t.TOKEN_DEFAULT,
            this._checksum = e.checksum || t.CHECKSUM_DEFAULT,
            this._sdkModesParams = new Map,
            e.clientConfiguration)
                this._sdkModesParams.set(r, e.clientConfiguration[r]);
            return this.updatePointerParams(a),
            !0
        }
        ,
        t.prototype.updatePointerParams = function(e) {
            var a = this._sdkModesParams.get(t._DEFAULT_SDK_MODE);
            if (this._sdkModesParams.has(e) || (e = t._DEFAULT_SDK_MODE),
            e !== t._DEFAULT_SDK_MODE) {
                var r = this._sdkModesParams.get(e);
                a = Object.assign({}, a, r)
            }
            this._pointerParams.updateParams(a),
            this._currentSdkMode = e
        }
        ,
        Object.defineProperty(t, "DEFAULT_SDK_MODE", {
            get: function() {
                return this._DEFAULT_SDK_MODE
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "pointerParams", {
            get: function() {
                return this._pointerParams
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "token", {
            get: function() {
                return this._token ? String(this._token) : t.TOKEN_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "checksum", {
            get: function() {
                return this._checksum ? String(this._checksum) : t.CHECKSUM_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "currentSdkMode", {
            get: function() {
                return this._currentSdkMode
            },
            enumerable: !1,
            configurable: !0
        }),
        t.POINTER_VERSION = 3,
        t._DEFAULT_SDK_MODE = "0",
        t.TOKEN_DEFAULT = "",
        t.CHECKSUM_DEFAULT = "",
        t
    }();
    e.SecuredTouchPointerConfig = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t;
    !function(e) {
        e[e.pointer = 0] = "pointer",
        e[e.interactions = 1] = "interactions",
        e[e.metadata = 2] = "metadata",
        e[e.initSession = 3] = "initSession"
    }(t || (t = {}));
    var a = function() {
        function a() {
            this.canceledInteractions = new e.SecuredTouchStorageMap(_securedTouchUtils.SecuredTouchConstants.CANCELED_INTERACTIONS),
            this.pointerQueue = new _securedTouchDependencies.StPromiseQueue(1)
        }
        return a.prototype.init = function(t, a, r, n, o, c, s, i) {
            this.applicationId = t,
            this.appSecretBase64 = _securedTouchUtils.SecuredTouchUtil.encodeBase64(a),
            this.pointerUrlPrefix = r,
            this.clientVersion = n,
            this.deviceType = o,
            this.stMetrics = c,
            this.sessionStorage = i || _securedTouchStorage.SecuredTouchSessionStorage.instance,
            this.http = s || new e.STHttpClient(n,this.sessionStorage.windowId,this.stMetrics),
            this.interactionsQueue || (this.interactionsQueue = new _securedTouchDependencies.StPromiseQueue(1,e.SecuredTouchPointerConfig.instance.pointerParams.interactionsQueueSize))
        }
        ,
        a.prototype.enqueue = function(e) {
            return this.stMetrics.network.setQueueSize(this.interactionsQueue.getQueueLength()),
            this.interactionsQueue.add(e)
        }
        ,
        a.prototype.sendCanceledPayloads = function(t) {
            var a = this
              , r = this.canceledInteractions.values();
            this.canceledInteractions.clear(),
            r && r.length > 0 && r.forEach(function(r) {
                a.sendInteractions(r).catch(function(a) {
                    var r = _securedTouchUtils.SecuredTouchUtil.validateAndCreateError(a, "Failed to resend canceled interactions after page reload.");
                    r.errCode === _securedTouchRemoteLogger.SecuredTouchErrorCodes.PARSING_ERROR && (null === t || void 0 === t || t.sendRemoteLog(e.SecuredTouchPointerConfig.instance.pointerParams.remoteLogs, r.errCode, r.errMsg, r.error)),
                    _securedTouchUtils.STLogger.warn(r.errMsg, r)
                })
            })
        }
        ,
        a.prototype.clearCanceledPayloads = function() {
            this.canceledInteractions.clear()
        }
        ,
        a.prototype.initSessionWithRetry = function(a, r) {
            var n = this
              , o = this;
            return new Promise(function(c, s) {
                o.http.postJson(e.SecuredTouchPointerConfig.instance.pointerParams.url + "v2/initSession/" + n.applicationId, a, e.SecuredTouchPointerConfig.instance.pointerParams.timeoutSeconds, r, e.SecuredTouchPointerConfig.instance.token, !0, e.SecuredTouchPointerConfig.instance.pointerParams.encryptionEnabled).then(function(e) {
                    c(e)
                }).catch(function(e) {
                    o.handleNetworkFailure(e, t.initSession, r + 1).then(function() {
                        return o.initSessionWithRetry(a, r + 1)
                    }).then(function(e) {
                        c(e)
                    }).catch(function(e) {
                        s(e)
                    })
                })
            }
            )
        }
        ,
        a.prototype.initSession = function(e) {
            var t = this;
            return this.enqueue(function() {
                return t.initSessionWithRetry(e, 0)
            })
        }
        ,
        a.prototype.getPointer = function(r, n, o) {
            return void 0 === o && (o = 0),
            __awaiter(this, void 0, void 0, function() {
                var c = this;
                return __generator(this, function(s) {
                    return [2, new Promise(function(s, i) {
                        c.http.postJson(c.pointerUrlPrefix + "/SecuredTouch/rest/services/v2/starter/" + c.applicationId, r, a.POINTER_TIMEOUT, o, c.appSecretBase64, !0, !1).then(function(e) {
                            s(e)
                        }).catch(function(a) {
                            c.handleNetworkFailure(a, t.pointer, o + 1).then(function() {
                                var t = c.sessionStorage.getDeviceCredentials();
                                return e.SecuredTouchPointerConfig.instance.loadPointerFromServer(c, {
                                    device_id: t.deviceId,
                                    clientVersion: c.clientVersion,
                                    deviceType: c.deviceType,
                                    authToken: e.SecuredTouchPointerConfig.instance.token
                                }, n, o + 1)
                            }).then(function(e) {
                                s(e)
                            }).catch(function(e) {
                                i(e)
                            })
                        })
                    }
                    )]
                })
            })
        }
        ,
        a.prototype.sendMetadata = function(e) {
            var t = this;
            return this.enqueue(function() {
                return t.sendMetadataWithRetry(e, 0)
            })
        }
        ,
        a.prototype.sendMetadataWithRetry = function(a, r) {
            var n = this
              , o = this;
            return new Promise(function(c, s) {
                o.http.postJson(e.SecuredTouchPointerConfig.instance.pointerParams.url + "v2/metadata/" + n.applicationId, a, e.SecuredTouchPointerConfig.instance.pointerParams.timeoutSeconds, r, e.SecuredTouchPointerConfig.instance.token, !0, e.SecuredTouchPointerConfig.instance.pointerParams.encryptionEnabled).then(function(e) {
                    c(e)
                }).catch(function(e) {
                    o.handleNetworkFailure(e, t.metadata, r + 1).then(function() {
                        return o.sendMetadataWithRetry(a, r + 1)
                    }).then(function(e) {
                        c(e)
                    }).catch(function(e) {
                        s(e)
                    })
                })
            }
            )
        }
        ,
        a.prototype.sendInteractions = function(t) {
            var a = this
              , r = _securedTouchUtils.SecuredTouchUtil.newGuid();
            this.canceledInteractions.set(r, t);
            var n = _securedTouchUtils.SecuredTouchUtil.now();
            return this.enqueue(function() {
                return _securedTouchUtils.SecuredTouchUtil.now() - n > 1e3 * e.SecuredTouchPointerConfig.instance.pointerParams.interactionTtlSeconds ? Promise.reject("interaction expired") : a.sendInteractionsWithRetry(t, r, 0)
            })
        }
        ,
        a.prototype.sendInteractionsWithRetry = function(a, r, n) {
            var o = this
              , c = this;
            return a.deviceId !== this.sessionStorage.getDeviceCredentials().deviceId ? (_securedTouchUtils.STLogger.warn("Send Interactions failed, interaction's deviceID not matching the current deviceId"),
            this.canceledInteractions.delete(r),
            Promise.reject("Interaction's deviceID not matching the current deviceId")) : new Promise(function(s, i) {
                var u = _securedTouchUtils.SecuredTouchUtil.now();
                c.http.postJson(e.SecuredTouchPointerConfig.instance.pointerParams.url + "v2/interactions/" + o.applicationId, a, e.SecuredTouchPointerConfig.instance.pointerParams.timeoutSeconds, n, e.SecuredTouchPointerConfig.instance.token, !0, e.SecuredTouchPointerConfig.instance.pointerParams.encryptionEnabled).then(function(e) {
                    o.stMetrics.network.onInteractionSuccess(u);
                    var t = a.keyboardInteractionPayloads ? a.keyboardInteractionPayloads.length : 0
                      , n = a.mouseInteractionPayloads ? a.mouseInteractionPayloads.length : 0
                      , c = a.gestures ? a.gestures.length : 0;
                    _securedTouchUtils.STLogger.info(t + " Keyboard Interactions, " + n + " Mouse interactions and " + c + " Gestures sent to server."),
                    o.canceledInteractions.delete(r),
                    s(e)
                }).catch(function(e) {
                    c.handleNetworkFailure(e, t.interactions, n + 1).then(function() {
                        return c.sendInteractionsWithRetry(a, r, n + 1)
                    }).then(function(e) {
                        s(e)
                    }).catch(function(e) {
                        o.canceledInteractions.delete(r),
                        i(e)
                    })
                })
            }
            )
        }
        ,
        a.prototype.handleNetworkFailure = function(r, n, o) {
            var c;
            return __awaiter(this, void 0, void 0, function() {
                var s, i, u;
                return __generator(this, function(d) {
                    switch (d.label) {
                    case 0:
                        if (o >= a.MAX_REQUEST_RETRIES)
                            return [2, Promise.reject(r)];
                        d.label = 1;
                    case 1:
                        return d.trys.push([1, 6, , 7]),
                        401 != (s = null === (c = r.error) || void 0 === c ? void 0 : c.status) && 403 != s ? [3, 2] : n == t.pointer ? [2, Promise.reject("Wrong app credentials, appId or appSecret incorrect")] : (i = this.sessionStorage.getDeviceCredentials(),
                        [2, e.SecuredTouchPointerConfig.instance.loadPointerFromServer(this, {
                            device_id: i.deviceId,
                            clientVersion: this.clientVersion,
                            deviceType: this.deviceType,
                            authToken: e.SecuredTouchPointerConfig.instance.token
                        }, e.SecuredTouchPointerConfig.instance.currentSdkMode)]);
                    case 2:
                        return s >= 400 && s < 500 && 408 !== s ? [2, Promise.reject(r)] : [3, 3];
                    case 3:
                        return [4, _securedTouchUtils.SecuredTouchUtil.delay(a.REQUESTS_COOL_DOWN[o] || a.REQUESTS_COOL_DOWN[a.REQUESTS_COOL_DOWN.length - 1])];
                    case 4:
                        return d.sent(),
                        [2, Promise.resolve()];
                    case 5:
                        return [3, 7];
                    case 6:
                        return u = d.sent(),
                        [2, Promise.reject(u)];
                    case 7:
                        return [2]
                    }
                })
            })
        }
        ,
        a.POINTER_TIMEOUT = 1e4,
        a.MAX_REQUEST_RETRIES = 3,
        a.REQUESTS_COOL_DOWN = [0, 1e3, 2e3],
        a
    }();
    e.STServer = a
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    "use strict";
    var t = function() {
        function e(e, t) {
            this.handler = e,
            this.isOnce = t,
            this.isExecuted = !1
        }
        return e.prototype.execute = function(e, t, a) {
            if (!this.isOnce || !this.isExecuted) {
                this.isExecuted = !0;
                var r = this.handler;
                e ? setTimeout(function() {
                    r.apply(t, a)
                }, 1) : r.apply(t, a)
            }
        }
        ,
        e
    }()
      , a = function() {
        function e() {
            this._wrap = new c(this),
            this._subscriptions = new Array
        }
        return e.prototype.subscribe = function(e) {
            e && this._subscriptions.push(new t(e,!1))
        }
        ,
        e.prototype.sub = function(e) {
            this.subscribe(e)
        }
        ,
        e.prototype.one = function(e) {
            e && this._subscriptions.push(new t(e,!0))
        }
        ,
        e.prototype.has = function(e) {
            if (e)
                for (var t = 0, a = this._subscriptions; t < a.length; t++) {
                    if (a[t].handler == e)
                        return !0
                }
            return !1
        }
        ,
        e.prototype.unsubscribe = function(e) {
            if (e)
                for (var t = 0; t < this._subscriptions.length; t++) {
                    if (this._subscriptions[t].handler == e) {
                        this._subscriptions.splice(t, 1);
                        break
                    }
                }
        }
        ,
        e.prototype.unsub = function(e) {
            this.unsubscribe(e)
        }
        ,
        e.prototype._dispatch = function(e, t, a) {
            for (var r = 0; r < this._subscriptions.length; r++) {
                var n = this._subscriptions[r];
                if (n.isOnce) {
                    if (!0 === n.isExecuted)
                        continue;
                    this._subscriptions.splice(r, 1),
                    r--
                }
                n.execute(e, t, a)
            }
        }
        ,
        e.prototype.asEvent = function() {
            return this._wrap
        }
        ,
        e
    }();
    e.DispatcherBase = a;
    var r = function(e) {
        function t() {
            return null !== e && e.apply(this, arguments) || this
        }
        return __extends(t, e),
        t.prototype.dispatch = function(e, t) {
            this._dispatch(!1, this, arguments)
        }
        ,
        t.prototype.dispatchAsync = function(e, t) {
            this._dispatch(!0, this, arguments)
        }
        ,
        t
    }(a);
    e.EventDispatcher = r;
    var n = function(e) {
        function t() {
            return null !== e && e.apply(this, arguments) || this
        }
        return __extends(t, e),
        t.prototype.dispatch = function(e) {
            this._dispatch(!1, this, arguments)
        }
        ,
        t.prototype.dispatchAsync = function(e) {
            this._dispatch(!0, this, arguments)
        }
        ,
        t
    }(a)
      , o = function(e) {
        function t() {
            return null !== e && e.apply(this, arguments) || this
        }
        return __extends(t, e),
        t.prototype.dispatch = function() {
            this._dispatch(!1, this, arguments)
        }
        ,
        t.prototype.dispatchAsync = function() {
            this._dispatch(!0, this, arguments)
        }
        ,
        t
    }(a)
      , c = function() {
        function e(e) {
            this._subscribe = function(t) {
                return e.subscribe(t)
            }
            ,
            this._unsubscribe = function(t) {
                return e.unsubscribe(t)
            }
            ,
            this._one = function(t) {
                return e.one(t)
            }
            ,
            this._has = function(t) {
                return e.has(t)
            }
        }
        return e.prototype.subscribe = function(e) {
            this._subscribe(e)
        }
        ,
        e.prototype.sub = function(e) {
            this.subscribe(e)
        }
        ,
        e.prototype.unsubscribe = function(e) {
            this._unsubscribe(e)
        }
        ,
        e.prototype.unsub = function(e) {
            this.unsubscribe(e)
        }
        ,
        e.prototype.one = function(e) {
            this._one(e)
        }
        ,
        e.prototype.has = function(e) {
            return this._has(e)
        }
        ,
        e
    }()
      , s = function() {
        function e() {
            this._events = {}
        }
        return e.prototype.get = function(e) {
            var t = this._events[e];
            return t || (t = this.createDispatcher(),
            this._events[e] = t,
            t)
        }
        ,
        e.prototype.remove = function(e) {
            this._events[e] = null
        }
        ,
        e
    }()
      , i = function(e) {
        function t() {
            return null !== e && e.apply(this, arguments) || this
        }
        return __extends(t, e),
        t.prototype.createDispatcher = function() {
            return new r
        }
        ,
        t
    }(s)
      , u = function(e) {
        function t() {
            return null !== e && e.apply(this, arguments) || this
        }
        return __extends(t, e),
        t.prototype.createDispatcher = function() {
            return new n
        }
        ,
        t
    }(s)
      , d = function(e) {
        function t() {
            return null !== e && e.apply(this, arguments) || this
        }
        return __extends(t, e),
        t.prototype.createDispatcher = function() {
            return new o
        }
        ,
        t
    }(s);
    (function() {
        function e() {
            this._events = new i
        }
        Object.defineProperty(e.prototype, "events", {
            get: function() {
                return this._events
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.subscribe = function(e, t) {
            this._events.get(e).subscribe(t)
        }
        ,
        e.prototype.sub = function(e, t) {
            this.subscribe(e, t)
        }
        ,
        e.prototype.unsubscribe = function(e, t) {
            this._events.get(e).unsubscribe(t)
        }
        ,
        e.prototype.unsub = function(e, t) {
            this.unsubscribe(e, t)
        }
        ,
        e.prototype.one = function(e, t) {
            this._events.get(e).one(t)
        }
        ,
        e.prototype.has = function(e, t) {
            return this._events.get(e).has(t)
        }
    }
    )(),
    function() {
        function e() {
            this._events = new u
        }
        Object.defineProperty(e.prototype, "events", {
            get: function() {
                return this._events
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.subscribe = function(e, t) {
            this._events.get(e).subscribe(t)
        }
        ,
        e.prototype.sub = function(e, t) {
            this.subscribe(e, t)
        }
        ,
        e.prototype.one = function(e, t) {
            this._events.get(e).one(t)
        }
        ,
        e.prototype.has = function(e, t) {
            return this._events.get(e).has(t)
        }
        ,
        e.prototype.unsubscribe = function(e, t) {
            this._events.get(e).unsubscribe(t)
        }
        ,
        e.prototype.unsub = function(e, t) {
            this.unsubscribe(e, t)
        }
    }(),
    function() {
        function e() {
            this._events = new d
        }
        Object.defineProperty(e.prototype, "events", {
            get: function() {
                return this._events
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.one = function(e, t) {
            this._events.get(e).one(t)
        }
        ,
        e.prototype.has = function(e, t) {
            return this._events.get(e).has(t)
        }
        ,
        e.prototype.subscribe = function(e, t) {
            this._events.get(e).subscribe(t)
        }
        ,
        e.prototype.sub = function(e, t) {
            this.subscribe(e, t)
        }
        ,
        e.prototype.unsubscribe = function(e, t) {
            this._events.get(e).unsubscribe(t)
        }
        ,
        e.prototype.unsub = function(e, t) {
            this.unsubscribe(e, t)
        }
    }()
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function e(e) {
            this._isStarted = !1,
            this._isEventsStarted = !1,
            this._gestureTimestamps = [],
            this._maxSensorSamples = 0,
            this._sensorsTimestampDeltaInMillis = 0,
            this._accelerometerList = [],
            this._gyroscopeList = [],
            this._linearAccelerometerList = [],
            this._rotationList = [],
            this.orientationImplementationFix = 1,
            this.delegate = e,
            window.navigator.userAgent.match(/^.*(iPhone|iPad).*(OS\s[0-9]).*(CriOS|Version)\/[.0-9]*\sMobile.*$/i) && (this.orientationImplementationFix = -1),
            this.accelerometerUpdateHandle = this.accelerometerUpdate.bind(this),
            this.orientationUpdateHandle = this.orientationUpdate.bind(this)
        }
        return Object.defineProperty(e.prototype, "LAST_GESTURE_SENSOR_TIMEOUT_MILI_SECONDS", {
            get: function() {
                return 3e3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "accX", {
            get: function() {
                return this._accX
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "accY", {
            get: function() {
                return this._accY
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "accZ", {
            get: function() {
                return this._accZ
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "lienarAccX", {
            get: function() {
                return this._lienarAccX
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "lienarAccY", {
            get: function() {
                return this._lienarAccY
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "lienarAccZ", {
            get: function() {
                return this._lienarAccZ
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "rotX", {
            get: function() {
                return this._rotX
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "rotY", {
            get: function() {
                return this._rotY
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "rotZ", {
            get: function() {
                return this._rotZ
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "maxSensorSamples", {
            get: function() {
                return this._maxSensorSamples
            },
            set: function(e) {
                this._maxSensorSamples = e
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "sensorsTimestampDeltaInMillis", {
            get: function() {
                return this._sensorsTimestampDeltaInMillis
            },
            set: function(e) {
                this._sensorsTimestampDeltaInMillis = e
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "accelerometerList", {
            get: function() {
                return this.getRelevantSensorSamples(this._accelerometerList)
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "gyroscopeList", {
            get: function() {
                return this.getRelevantSensorSamples(this._gyroscopeList)
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "linearAccelerometerList", {
            get: function() {
                return this.getRelevantSensorSamples(this._linearAccelerometerList)
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "rotationList", {
            get: function() {
                return this._rotationList
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.start = function() {
            this._isStarted || (this._isStarted = !0,
            _securedTouchUtils.STLogger.debug("Sensor events started..."))
        }
        ,
        e.prototype.getRotationListCopy = function() {
            return this._rotationList ? Array.from(this._rotationList) : []
        }
        ,
        e.prototype.stop = function() {
            this._isStarted && (void 0 != window.DeviceMotionEvent && window.removeEventListener("devicemotion", this.accelerometerUpdateHandle, !0),
            window.DeviceOrientationEvent && window.removeEventListener("deviceorientation", this.orientationUpdateHandle, !0),
            this._isStarted = !1,
            _securedTouchUtils.STLogger.debug("Sensor events stopped"))
        }
        ,
        e.prototype.getRelevantSensorSamples = function(e) {
            if (0 == e.length || this._sensorsTimestampDeltaInMillis < 1 || 0 == this._gestureTimestamps.length)
                return e;
            for (var t = new Map, a = null, r = 0, n = 0; n < e.length; n++)
                for (var o = 0; o < this._gestureTimestamps.length; o++)
                    (r = e[n].timestamp) >= (a = this._gestureTimestamps[o]).start - this._sensorsTimestampDeltaInMillis && r <= a.end + this._sensorsTimestampDeltaInMillis && t.set(e[n].timestamp, e[n]);
            return _securedTouchUtils.SecuredTouchUtil.getValuesOfMap(t)
        }
        ,
        e.prototype.stopEvents = function() {
            this._isEventsStarted && (void 0 != window.DeviceMotionEvent && window.removeEventListener("devicemotion", this.accelerometerUpdateHandle, !0),
            window.DeviceOrientationEvent && window.removeEventListener("deviceorientation", this.orientationUpdateHandle, !0),
            this._isEventsStarted = !1,
            _securedTouchUtils.STLogger.debug("Sensor events stopped listening"))
        }
        ,
        e.prototype.startEvents = function() {
            this._isEventsStarted || (void 0 != window.DeviceMotionEvent ? this.delegate.addEventListener(window, "devicemotion", this.accelerometerUpdateHandle, !0) : _securedTouchUtils.STLogger.warn("DeviceMotion not supported!"),
            window.DeviceOrientationEvent ? this.delegate.addEventListener(window, "deviceorientation", this.orientationUpdateHandle, !0) : _securedTouchUtils.STLogger.warn("DeviceOrientation not supported!"),
            _securedTouchUtils.STLogger.debug("Sensor events start listening..."),
            this._isEventsStarted = !0)
        }
        ,
        e.prototype.reset = function() {
            this._accelerometerList = [],
            this._gyroscopeList = [],
            this._linearAccelerometerList = [],
            this._rotationList = [],
            this._gestureTimestamps.length > 0 ? this._gestureTimestamps = [this._gestureTimestamps[this._gestureTimestamps.length - 1]] : this._gestureTimestamps = [],
            this._accX = 0,
            this._accY = 0,
            this._accZ = 0,
            this._rotX = 0,
            this._rotY = 0,
            this._rotZ = 0
        }
        ,
        e.prototype.onGesture = function(e) {
            this._isEventsStarted || this.startEvents(),
            e.snapshots.length > 1 && this._gestureTimestamps.push({
                start: e.snapshots[0].timestamp,
                end: e.snapshots[e.snapshots.length - 1].timestamp
            })
        }
        ,
        e.prototype.puaseSensorsCollectionIfNoActivity = function(e) {
            return (this._gestureTimestamps.length > 0 ? this._gestureTimestamps[this._gestureTimestamps.length - 1].end : 0) > 0 ? Math.abs(e - this._gestureTimestamps[this._gestureTimestamps.length - 1].end) > this.LAST_GESTURE_SENSOR_TIMEOUT_MILI_SECONDS && (this.stopEvents(),
            !0) : (this.stopEvents(),
            !0)
        }
        ,
        e.prototype.getDeviceAcceleration = function(e) {
            return e && null != e.x && null != e.y && null != e.z ? e : null
        }
        ,
        e.prototype.accelerometerUpdate = function(e) {
            try {
                if (!this.delegate.collectBehavioralData() || this.puaseSensorsCollectionIfNoActivity(_securedTouchUtils.SecuredTouchUtil.now()))
                    return;
                var t = this.getDeviceAcceleration(e.accelerationIncludingGravity);
                t && (this._accX = t.x * this.orientationImplementationFix,
                this._accY = t.y * this.orientationImplementationFix,
                this._accZ = t.z,
                this.safeAddSensorSample({
                    x: this._accX,
                    y: this._accY,
                    z: this._accX,
                    timestamp: _securedTouchUtils.SecuredTouchUtil.now()
                }, this._accelerometerList));
                var a = this.getDeviceAcceleration(e.acceleration);
                a && (this._lienarAccX = a.x * this.orientationImplementationFix,
                this._lienarAccY = a.y * this.orientationImplementationFix,
                this._lienarAccZ = a.z,
                this.safeAddSensorSample({
                    x: this._lienarAccX,
                    y: this._lienarAccY,
                    z: this._lienarAccZ,
                    timestamp: _securedTouchUtils.SecuredTouchUtil.now()
                }, this._linearAccelerometerList)),
                e.rotationRate && null != e.rotationRate.alpha && null != e.rotationRate.beta && null != e.rotationRate.gamma && (this._rotX = e.rotationRate.alpha,
                this._rotY = e.rotationRate.beta,
                this._rotZ = e.rotationRate.gamma,
                this.safeAddSensorSample({
                    x: this._rotX,
                    y: this._rotY,
                    z: this._rotZ,
                    timestamp: _securedTouchUtils.SecuredTouchUtil.now()
                }, this._gyroscopeList))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in accelerometer handler", e)
            }
        }
        ,
        e.prototype.orientationUpdate = function(e) {
            try {
                if (!this.delegate.collectBehavioralData() || this.puaseSensorsCollectionIfNoActivity(_securedTouchUtils.SecuredTouchUtil.now()))
                    return;
                null != e.alpha && null != e.beta && null != e.gamma && this.safeAddSensorSample({
                    x: e.alpha,
                    y: e.beta,
                    z: e.gamma,
                    timestamp: _securedTouchUtils.SecuredTouchUtil.now()
                }, this._rotationList)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in orientation handler", e)
            }
        }
        ,
        e.prototype.safeAddSensorSample = function(e, t) {
            this.maxSensorSamples > t.length && t.push(e)
        }
        ,
        e
    }();
    e.SecuredTouchSensors = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t;
    !function(e) {
        e[e.Up = 1] = "Up",
        e[e.Down = 2] = "Down",
        e[e.Left = 3] = "Left",
        e[e.Right = 4] = "Right"
    }(t || (t = {}));
    var a = function() {
        function a(t, a) {
            this.BEHAVIORAL_TYPE = "gestures",
            this._isStarted = !1,
            this._onGesture = new e.EventDispatcher,
            this.touchSnapshotsMap = new Map,
            this.snapshotStartTime = new Map,
            this.delegate = t,
            this.sensors = a,
            this.touchStartHandler = this.touchStart.bind(this),
            this.touchMoveHandler = this.touchMove.bind(this),
            this.touchEndHandler = this.touchEnd.bind(this),
            this.touchCancelHandler = this.touchCancel.bind(this)
        }
        return Object.defineProperty(a.prototype, "onGesture", {
            get: function() {
                return this._onGesture.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a.prototype, "SCROLL_MIN_DURATION", {
            get: function() {
                return 500
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a.prototype, "SWIPE_MAX_ANGLE", {
            get: function() {
                return 45
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a.prototype, "TAP_MOVEMENT_TRESHOLD", {
            get: function() {
                return 10
            },
            enumerable: !1,
            configurable: !0
        }),
        a.prototype.clearTouchSnapshots = function(e) {
            this.touchSnapshotsMap.delete(e),
            this.snapshotStartTime.delete(e)
        }
        ,
        a.prototype.getTouchSnapshots = function(e) {
            var t;
            return this.touchSnapshotsMap.has(e) ? t = this.touchSnapshotsMap.get(e) : (t = [],
            this.touchSnapshotsMap.set(e, t)),
            t
        }
        ,
        a.prototype.isEmpty = function() {
            return 0 === this.touchSnapshotsMap.size
        }
        ,
        a.prototype.start = function() {
            this._isStarted || (this.delegate.addEventListener(document, "touchstart", this.touchStartHandler),
            this.delegate.addEventListener(document, "touchmove", this.touchMoveHandler),
            this.delegate.addEventListener(document, "touchend", this.touchEndHandler),
            this.delegate.addEventListener(document, "touchcancel", this.touchCancelHandler),
            this._isStarted = !0)
        }
        ,
        a.prototype.stop = function() {
            this._isStarted && (document.removeEventListener("touchstart", this.touchStartHandler),
            document.removeEventListener("touchmove", this.touchMoveHandler),
            document.removeEventListener("touchend", this.touchEndHandler),
            document.removeEventListener("touchcancel", this.touchCancelHandler),
            this._isStarted = !1)
        }
        ,
        a.prototype.touchStart = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                _securedTouchUtils.STLogger.debug("touchstart(" + e.changedTouches.length + ")", e),
                e.changedTouches.length > 0 && this.pushSnapshot(e)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in touchStart handler", e)
            }
        }
        ,
        a.prototype.touchMove = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                _securedTouchUtils.STLogger.debug("touchmove(" + e.changedTouches.length + ")", e),
                e.changedTouches.length > 0 && this.pushSnapshot(e)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in touchMove handler", e)
            }
        }
        ,
        a.prototype.touchEnd = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return void this._onGesture.dispatch(this, null);
                _securedTouchUtils.STLogger.debug("touchend(" + e.changedTouches.length + ")", e),
                this.gestureEnd(e)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in touchEnd handler", e)
            }
        }
        ,
        a.prototype.touchCancel = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return void this._onGesture.dispatch(this, null);
                _securedTouchUtils.STLogger.debug("touchcancel(" + e.changedTouches.length + ")", e),
                this.gestureEnd(e)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in touchCancel handler", e)
            }
        }
        ,
        a.prototype.gestureEnd = function(t) {
            t.changedTouches.length > 0 && this.pushSnapshot(t);
            for (var a = 0; a < t.changedTouches.length; a++) {
                var r = t.changedTouches.item(a)
                  , n = this.getTouchSnapshots(r.identifier);
                n.length > 0 && (this.isTap(n) ? this.dispatchGesture(e.GestureType.Tap, r.identifier) : this.dispatchGesture(this.calcGestureType(n), r.identifier))
            }
        }
        ,
        a.prototype.calcGestureType = function(a) {
            var r, n = this.getDirection(a);
            if (this.isFling(a))
                switch (n) {
                case t.Up:
                    r = e.GestureType.FlingUp;
                    break;
                case t.Right:
                    r = e.GestureType.FlingRight;
                    break;
                case t.Down:
                    r = e.GestureType.FlingDown;
                    break;
                case t.Left:
                    r = e.GestureType.FlingLeft
                }
            else if (this.isScroll(a))
                switch (n) {
                case t.Up:
                    r = e.GestureType.ScrollUp;
                    break;
                case t.Right:
                    r = e.GestureType.ScrollRight;
                    break;
                case t.Down:
                    r = e.GestureType.ScrollDown;
                    break;
                case t.Left:
                    r = e.GestureType.ScrollLeft
                }
            return r
        }
        ,
        a.prototype.pushSnapshot = function(t) {
            if (t.changedTouches && t.changedTouches.length > 0)
                for (var a = 0; a < t.changedTouches.length; a++) {
                    var r = t.changedTouches.item(a)
                      , n = r.radiusX && r.radiusY ? (r.radiusX + r.radiusY) / 2 : null;
                    this.snapshotStartTime.has(r.identifier) || this.snapshotStartTime.set(r.identifier, (new Date).getTime());
                    var o = this.getTouchSnapshots(r.identifier);
                    o.length < e.SecuredTouchPointerConfig.instance.pointerParams.maxSnapshotsCount && o.push({
                        timestamp: _securedTouchUtils.SecuredTouchUtil.now(),
                        relativeX: r.screenX,
                        relativeY: r.screenY,
                        x: r.clientX,
                        y: r.clientY,
                        pressure: r.force,
                        size: n,
                        xaccelerometer: this.sensors.accX,
                        yaccelerometer: this.sensors.accY,
                        zaccelerometer: this.sensors.accZ,
                        xlinearaccelerometer: this.sensors.lienarAccX,
                        ylinearaccelerometer: this.sensors.lienarAccY,
                        zlinearaccelerometer: this.sensors.lienarAccZ,
                        xrotation: this.sensors.rotX,
                        yrotation: this.sensors.rotY,
                        zrotation: this.sensors.rotZ,
                        additionalData: {
                            radiusX: r.radiusX,
                            radiusY: r.radiusY,
                            rotationAngle: r.rotationAngle,
                            pageX: r.pageX,
                            pageY: r.pageY,
                            eventTimeStamp: t.timeStamp
                        }
                    })
                }
        }
        ,
        a.prototype.dispatchGesture = function(t, a) {
            var r = this.touchSnapshotsMap.get(a) || []
              , n = _securedTouchUtils.SecuredTouchUtil.getDeviceOrientation();
            this._onGesture.dispatch(this, {
                timestamp: r.length > 0 ? r[0].timestamp : 0,
                epochTs: this.snapshotStartTime.get(a) || 0,
                counter: null,
                type: t,
                snapshots: r,
                vector: {},
                attributes: {},
                additionalData: {
                    width: screen.width,
                    height: screen.height,
                    availWidth: screen.availWidth,
                    availHeight: screen.availHeight,
                    deviceOrientation: n.orientation,
                    deviceAngle: n.angle,
                    locationHref: window.location.href || "",
                    windowOuterWidth: window.outerWidth,
                    windowOuterHeight: window.outerHeight,
                    windowInnerWidth: window.innerWidth,
                    windowInnerHeight: window.innerHeight,
                    bodyClientWidht: document.body.clientWidth,
                    bodyClientHeight: document.body.clientHeight,
                    devicePixelRatio: window.devicePixelRatio,
                    checksum: e.SecuredTouchPointerConfig.instance.checksum,
                    windowId: _securedTouchStorage.SecuredTouchSessionStorage.instance.windowId
                },
                identified: null
            }),
            this.clearTouchSnapshots(a)
        }
        ,
        a.prototype.isTap = function(e) {
            var t = Math.abs(e[0].x - e[1].x)
              , a = Math.abs(e[0].y - e[1].y);
            return 2 == e.length && t < this.TAP_MOVEMENT_TRESHOLD && a < this.TAP_MOVEMENT_TRESHOLD
        }
        ,
        a.prototype.isFling = function(e) {
            return e.length > 1 && e[e.length - 1].timestamp - e[0].timestamp < this.SCROLL_MIN_DURATION
        }
        ,
        a.prototype.isScroll = function(e) {
            return e.length > 1 && e[e.length - 1].timestamp - e[0].timestamp > this.SCROLL_MIN_DURATION
        }
        ,
        a.prototype.getDirection = function(e) {
            var a = this.calcAngle(e[0], e[e.length - 1]);
            return a > 90 - this.SWIPE_MAX_ANGLE && a <= 90 + this.SWIPE_MAX_ANGLE ? t.Up : a > 180 - this.SWIPE_MAX_ANGLE && a <= 180 + this.SWIPE_MAX_ANGLE ? t.Right : a > 270 - this.SWIPE_MAX_ANGLE && a <= 270 + this.SWIPE_MAX_ANGLE ? t.Down : t.Left
        }
        ,
        a.prototype.calcAngle = function(e, t) {
            return 180 * Math.atan2(t.y - e.y, t.x - e.x) / Math.PI + 180
        }
        ,
        a
    }();
    e.SecuredTouchGestureEvents = a
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {
            this._tags = []
        }
        return Object.defineProperty(t, "instance", {
            get: function() {
                return t._instance || (t._instance = new t),
                t._instance
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "tags", {
            get: function() {
                return this._tags
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.getTagsCopy = function() {
            return this._tags ? Array.from(this._tags) : []
        }
        ,
        t.prototype.setTag = function(t, a) {
            if (t) {
                var r = a ? t + ":" + a : t
                  , n = e.SecuredTouchPointerConfig.instance.pointerParams.tagsBlacklistRegex;
                if (!n || !r.match(n))
                    return this._tags.push({
                        name: r,
                        epochTs: Date.now(),
                        timestamp: Date.now()
                    }),
                    _securedTouchUtils.STLogger.info("Add tag: " + r),
                    r;
                _securedTouchUtils.STLogger.info("Tag " + t + " is blacklisted")
            }
            return ""
        }
        ,
        t.prototype.reset = function() {
            this._tags = []
        }
        ,
        t
    }();
    e.SecuredTouchTags = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t;
    !function(e) {
        e.tag = "TAG",
        e.refreshUser = "REFRESH_USER",
        e.indirect = "INDIRECT",
        e.flush = "FLUSH",
        e.appSession = "APP_SESSION_ID"
    }(t = e.ForceReason || (e.ForceReason = {}));
    var a = function() {
        function a(e, t) {
            this.dataRepository = e,
            this.sessionData = t,
            this._retryNumber = 1,
            this._pauseTimestamp = 0,
            this._isBehavioralDataPaused = !1,
            this.logWasSent = !1,
            this.started = !1,
            this.checksumProcessing = !1,
            this.startTasks = [],
            this.lastRetryTimestamp = Date.now(),
            this.lastPayloadTimestamp = Date.now(),
            this._modeToUpdate = "",
            this.initQueue = new _securedTouchDependencies.StPromiseQueue(1)
        }
        return Object.defineProperty(a, "MAX_NUMBER_OF_TRIES", {
            get: function() {
                return 3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a, "RETRY_UPDATE_INTERVAL_MS", {
            get: function() {
                return 6e4
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a, "RETRY_INTERVAL_MS", {
            get: function() {
                return 15e3
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a, "START_INTERACTION_INTERVAL_MS", {
            get: function() {
                return 12e4
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(a.prototype, "initST", {
            get: function() {
                return this.sessionData.initST
            },
            enumerable: !1,
            configurable: !0
        }),
        a.prototype.isRunning = function(e) {
            return 0 === this._pauseTimestamp || Boolean(e && e <= this._pauseTimestamp)
        }
        ,
        a.instance = function() {
            if (!this._instance) {
                var t = new e.STServer
                  , a = _securedTouchStorage.SecuredTouchSessionStorage.instance;
                if (!document.body)
                    throw _securedTouchUtils.STLogger.error("Securedtouch can be started only after DOM Ready!"),
                    "SecuredTouch can be started only after DOM Ready!";
                this._instance = new e.SecuredTouchClient(t,a)
            }
            return this._instance
        }
        ,
        a.prototype.flush = function() {
            return this.started && this.isRunning() ? this.forceSendCapturedEvents(t.flush) : Promise.resolve()
        }
        ,
        a.prototype.login = function(e, t) {
            var a = this
              , r = _securedTouchUtils.SecuredTouchUtil.now();
            return this.doAfterSdkInit(function() {
                return void 0 !== t && a.updateSessionId(t),
                a.refreshUsernameAndModes(e, !1, r)
            })
        }
        ,
        a.prototype.setTagAndFindInRegex = function(t, a) {
            if (this.isRunning()) {
                var r = e.SecuredTouchTags.instance.setTag(t, a)
                  , n = e.SecuredTouchPointerConfig.instance.pointerParams.tagsToFlushRegex;
                if (r && n && r.match(n))
                    return !0
            }
            return !1
        }
        ,
        a.prototype.addTag = function(t, a) {
            if (this.isRunning()) {
                var r = e.SecuredTouchTags.instance.setTag(t, a)
                  , n = e.SecuredTouchPointerConfig.instance.pointerParams.tagsToFlushRegex;
                r && n && r.match(n) && this.flush()
            }
        }
        ,
        a.prototype.setAppSessionId = function(e) {
            this.updateSessionId(e),
            this.started && this.isRunning() && this.forceSendCapturedEvents(t.appSession)
        }
        ,
        a.prototype.start = function(t) {
            return __awaiter(this, void 0, void 0, function() {
                var a, r, n, o, c, s, i, u = this;
                return __generator(this, function(d) {
                    switch (d.label) {
                    case 0:
                        return !t.hasOwnProperty("waitForWindowLoad") || !!t.waitForWindowLoad ? [4, this.loadEventPromise()] : [3, 2];
                    case 1:
                        d.sent(),
                        d.label = 2;
                    case 2:
                        return a = _securedTouchUtils.SecuredTouchUtil.now(),
                        this.startParams = t,
                        this.validateStartParams(t),
                        this.clientVersion = t.isDebugMode ? _securedTouchUtils.SecuredTouchConstants.CLIENT_VERSION + "-debug" : _securedTouchUtils.SecuredTouchConstants.CLIENT_VERSION,
                        this.started ? (this.sessionData.initST = !0,
                        _securedTouchUtils.STLogger.warn("SDK already initialized"),
                        [2, Promise.resolve()]) : (this.browserInfo = new _securedTouchUtils.BrowserInfo,
                        this.stMetrics = new _securedTouchMetrics.SecuredTouchMetrics(this.sessionData.sessionStorage),
                        r = {
                            url: t.url,
                            appId: t.appId,
                            externalLogsUrl: t.externalLogsUrl,
                            externalLogsEnabled: t.externalLogsEnabled
                        },
                        this.stRemoteLogger = new _securedTouchRemoteLogger.SecuredTouchRemoteLogger(r,_securedTouchUtils.SecuredTouchConstants.CLIENT_VERSION,this.browserInfo),
                        _securedTouchUtils.STLogger.isLogEnabled = t.enableLog,
                        _securedTouchUtils.STLogger.info("Starting STClient..."),
                        this.sessionData.applicationId = t.appId,
                        this.initEnvelope(),
                        [4, this.sessionData.initDeviceStorage(t.disableHub || t.isSingleDomain, t.hubUrl)]);
                    case 3:
                        return d.sent(),
                        this.dataRepository.init(this.startParams.appId, this.startParams.appSecret, this.startParams.url, this.clientVersion, this.browserInfo.deviceType, this.stMetrics),
                        n = this.sessionData.getDeviceCredentials(),
                        this.stRemoteLogger.deviceId = n.deviceId,
                        o = e.SecuredTouchPointerConfig.instance,
                        c = o.loadPointerFromCache(this.sessionData),
                        s = _securedTouchStorage.SecuredTouchSessionStorage.instance.getSdkMode() || e.SecuredTouchPointerConfig.DEFAULT_SDK_MODE,
                        [4, this.refreshInitParams(c, s).catch(function(e) {
                            var t = _securedTouchUtils.SecuredTouchUtil.validateAndCreateError(e, "Send init failed.");
                            throw u.sendRemoteLog(_securedTouchRemoteLogger.SecuredTouchErrorCodes.SEND_INIT_FAILED, t.errMsg, t.error),
                            u.logWasSent = !0,
                            t.errMsg + " " + _securedTouchUtils.SecuredTouchUtil.getErrorAsString(t.error)
                        })];
                    case 4:
                        return d.sent(),
                        i = {
                            additionalMediaCodecs: o.pointerParams.additionalMediaCodecs,
                            browserInfo: this.browserInfo,
                            fingerprintTimeoutMillis: o.pointerParams.fingerprintTimeoutMillis,
                            metadataBlackList: o.pointerParams.metadataBlackList,
                            propertyDescriptors: o.pointerParams.propertyDescriptors,
                            remoteLogs: o.pointerParams.remoteLogs,
                            webRtcUrl: o.pointerParams.webRtcUrl
                        },
                        this.stMetadata = new _securedTouchMetadata.SecuredTouchMetadata(this.sessionData,this.stMetrics,i),
                        this.setUsername(t),
                        this.updateSessionId(t.sessionId),
                        this.isEnabled() ? [3, 5] : (_securedTouchUtils.STLogger.warn("StClient disabled!"),
                        [3, 8]);
                    case 5:
                        return t.initSession ? [4, this.startNewSession().catch(function(e) {
                            _securedTouchUtils.STLogger.warn("failed to init session", e)
                        })] : [3, 7];
                    case 6:
                        d.sent(),
                        d.label = 7;
                    case 7:
                        this.sendMetadata(),
                        this.sessionData.passedBufferTimeout ? this.dataRepository.clearCanceledPayloads() : this.dataRepository.sendCanceledPayloads(),
                        d.label = 8;
                    case 8:
                        return this.sessionData.initST = !0,
                        this.refreshListening(),
                        this.started = !0,
                        this.stMetrics.init.onInitEnded(a),
                        [4, this.postSdkInit()];
                    case 9:
                        return d.sent(),
                        _securedTouchUtils.STLogger.info("SecuredTouch deviceId: " + this.sessionData.getDeviceCredentials().deviceId),
                        _securedTouchUtils.STLogger.info("SecuredTouch instanceUUID: " + this.sessionData.windowId),
                        [2]
                    }
                })
            })
        }
        ,
        a.prototype.isEnabled = function() {
            return e.SecuredTouchPointerConfig.instance.pointerParams.enabled
        }
        ,
        Object.defineProperty(a.prototype, "isBehavioralDataPaused", {
            get: function() {
                return this._isBehavioralDataPaused
            },
            enumerable: !1,
            configurable: !0
        }),
        a.prototype.isInitAndEnabled = function() {
            return !(!this.isEnabled() || !this.sessionData.initST) || (this.sessionData.initST || this.tryRecconect(),
            !1)
        }
        ,
        a.prototype.logout = function(e) {
            var t = this
              , a = _securedTouchUtils.SecuredTouchUtil.now();
            return this.doAfterSdkInit(function() {
                var r = t.refreshUsernameAndModes(null, !0, a);
                return t.updateSessionId(e),
                r
            })
        }
        ,
        a.prototype.handleEnvelope = function(e) {
            e && (this.updateWindowToken(e),
            this.sessionData.setEnvelope({
                envelope: e,
                timestamp: (new Date).getTime()
            }))
        }
        ,
        a.prototype.getStToken = function() {
            var e = "";
            if ("string" == typeof window._securedTouchToken && 0 <= window._securedTouchToken.indexOf(":")) {
                var t = window._securedTouchToken.match(/t:(.*?)(&|$)/g);
                t && 0 < t.length && (e = t[0].replace(/&s*$/, "").replace(/t:/, ""))
            } else
                "string" == typeof window._securedTouchToken && (e = window._securedTouchToken);
            return e
        }
        ,
        a.prototype.initEnvelope = function() {
            var t = this.sessionData.getEnvelope();
            t.envelope && t.timestamp && (new Date).getTime() - t.timestamp < 1e3 * e.SecuredTouchPointerConfig.instance.pointerParams.envelopeTtlSeconds && this.updateWindowToken(t.envelope)
        }
        ,
        a.prototype.updateWindowToken = function(e) {
            var t = window._securedTouchToken;
            t = "string" == typeof t && t.indexOf(":") >= 0 ? t.indexOf("e:") >= 0 ? t.replace(/e:(.*?)(&|$)/, "e:" + e + "&").replace(/&s*$/, "") : t + "&e:" + e : "string" == typeof t && 0 < t.length ? "t:" + t + "&e:" + e : "e:" + e,
            window._securedTouchToken = t
        }
        ,
        a.prototype.doAfterSdkInit = function(e) {
            return this.started ? e() : (this.startTasks.push(e),
            Promise.resolve())
        }
        ,
        a.prototype.pauseSecuredTouch = function() {
            var e = this;
            this.addTag("SDK paused"),
            this.flush(),
            this._pauseTimestamp = _securedTouchUtils.SecuredTouchUtil.now(),
            this.doAfterSdkInit(function() {
                return e.stopListening(),
                Promise.resolve()
            })
        }
        ,
        a.prototype.refreshUsernameAndModes = function(e, t, a) {
            return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(r) {
                    return this.sessionData.initST ? this.isEnabled() ? this.isRunning(a) ? t ? (_securedTouchUtils.STLogger.info("Logout user"),
                    [2, this.resetSession()]) : (_securedTouchUtils.STLogger.info("Login with user: " + e),
                    [2, this.updateUser(e)]) : (_securedTouchUtils.STLogger.info("SDK paused"),
                    this.sessionData.setUsername(e),
                    [2, Promise.resolve()]) : (_securedTouchUtils.STLogger.warn("Refresh User Name FAILED, SDK is disabled"),
                    [2, Promise.resolve()]) : (_securedTouchUtils.STLogger.error("Refresh User Name FAILED, SDK wasn't initialized"),
                    [2, Promise.resolve()])
                })
            })
        }
        ,
        a.prototype.updateSessionId = function(t) {
            _securedTouchStorage.SecuredTouchSessionStorage.instance.appSessionId = t,
            e.SecuredTouchPointerConfig.instance.pointerParams.sendPongOnAppSessionChange && window.dispatchEvent(new CustomEvent("_appsessionchange",{
                detail: {
                    appSessionId: t
                }
            }))
        }
        ,
        a.prototype.resumeSecuredTouch = function() {
            var e = this;
            this._pauseTimestamp = 0,
            this.addTag("SDK resumed"),
            this.doAfterSdkInit(function() {
                return e.refreshListening(),
                Promise.resolve()
            })
        }
        ,
        a.prototype.pauseBehavioralData = function() {
            var e = this;
            this._isBehavioralDataPaused || (this._isBehavioralDataPaused = !0,
            this.addTag("SDK paused behaviorally"),
            this.doAfterSdkInit(function() {
                return e.flush()
            }))
        }
        ,
        a.prototype.resumeBehavioralData = function() {
            this._isBehavioralDataPaused && (this._isBehavioralDataPaused = !1,
            this.addTag("SDK resumed behaviorally"))
        }
        ,
        a.prototype.sendHeartBeat = function() {
            return (new Date).getTime() - this.lastPayloadTimestamp >= 1e3 * e.SecuredTouchPointerConfig.instance.pointerParams.heartBeatFrequencySeconds ? (this.lastPayloadTimestamp = (new Date).getTime(),
            this.addTag(_securedTouchUtils.SecuredTouchConstants.HEART_BEAT_TAG),
            this.flush()) : Promise.resolve()
        }
        ,
        a.prototype.isIdentified = function() {
            var e = this.sessionData.getUsername();
            return e && e !== this.sessionData.getDeviceCredentials().deviceId
        }
        ,
        a.prototype.resetSession = function() {
            return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(e) {
                    switch (e.label) {
                    case 0:
                        return this.isIdentified() && this.addTag("LOGOUT"),
                        this.clearBuffer(),
                        [4, this.forceSendCapturedEvents(t.refreshUser)];
                    case 1:
                        return e.sent(),
                        [4, this.startNewSession()];
                    case 2:
                        return e.sent(),
                        this.sessionData.setUsername(null),
                        [2]
                    }
                })
            })
        }
        ,
        a.prototype.updateUser = function(e) {
            return this.isIdentified() && this.sessionData.getUsername() === e || this.addTag("SUCCESS_LOGIN"),
            this.sessionData.setUsername(e),
            this.forceSendCapturedEvents(t.refreshUser)
        }
        ,
        a.prototype.startST = function(e) {
            return __awaiter(this, void 0, void 0, function() {
                var t, a = this;
                return __generator(this, function(r) {
                    switch (r.label) {
                    case 0:
                        this.logWasSent = !1,
                        r.label = 1;
                    case 1:
                        return r.trys.push([1, 3, , 4]),
                        [4, this.initQueue.add(function() {
                            return a.start(e)
                        })];
                    case 2:
                        return [2, r.sent()];
                    case 3:
                        throw t = r.sent(),
                        this.logWasSent || this.sendRemoteLog(_securedTouchRemoteLogger.SecuredTouchErrorCodes.INITIALIZATION_ERROR, "SDK initialization failed", t),
                        t;
                    case 4:
                        return [2]
                    }
                })
            })
        }
        ,
        a.prototype.validateStartParams = function(e) {
            if (!e.appId)
                throw this.logWasSent = !0,
                _securedTouchUtils.STLogger.error("ApplicationId is mandatory (Start parameters)!"),
                "ApplicationId is mandatory (Start parameters)!";
            if (!e.appSecret)
                throw this.logWasSent = !0,
                _securedTouchUtils.STLogger.error("Application secret is mandatory (Start parameters)!"),
                "Application secret is mandatory (Start parameters)!";
            if (!document.body)
                throw this.logWasSent = !0,
                _securedTouchUtils.STLogger.error("Securedtouch can be started only after DOM Ready!"),
                "SecuredTouch can be started only after DOM Ready!"
        }
        ,
        a.prototype.sendRemoteLog = function(t, a, r) {
            try {
                this.stRemoteLogger && this.stRemoteLogger.sendRemoteLog(e.SecuredTouchPointerConfig.instance.pointerParams.remoteLogs, t, a, r)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("sendRemoteLog failed", e)
            }
        }
        ,
        a.prototype.startNewSession = function() {
            var e = this
              , t = this.sessionData.getDeviceCredentials().deviceId;
            return this.dataRepository.initSession({
                username: this.sessionData.getUsername() || t,
                applicationId: this.startParams.appId,
                deviceType: this.browserInfo.deviceType,
                deviceId: t
            }).then(function(t) {
                t && t.checksum && e.updateChecksumAndMode(t.checksum, t.sdkMode),
                e.handleEnvelope(null === t || void 0 === t ? void 0 : t.envelope)
            }).catch(function(t) {
                var a = _securedTouchUtils.SecuredTouchUtil.validateAndCreateError(t, "Failed to init session.");
                a.errCode === _securedTouchRemoteLogger.SecuredTouchErrorCodes.PARSING_ERROR && e.sendRemoteLog(a.errCode, a.errMsg, a.error),
                _securedTouchUtils.STLogger.warn(a.errMsg, a.error)
            })
        }
        ,
        a.prototype.loadEventPromise = function() {
            return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(e) {
                    return [2, new Promise(function(e) {
                        "complete" === document.readyState ? e() : window.addEventListener("load", function(t) {
                            e()
                        })
                    }
                    )]
                })
            })
        }
        ,
        a.prototype.updateChecksumAndMode = function(t, a) {
            var r = this
              , n = a || e.SecuredTouchPointerConfig.instance.currentSdkMode
              , o = Promise.resolve();
            if (!this.isRunning())
                return o;
            var c = !!n && n !== e.SecuredTouchPointerConfig.instance.currentSdkMode;
            return this.checksumProcessing || e.SecuredTouchPointerConfig.instance.checksum === t ? c && !this.checksumProcessing ? (e.SecuredTouchPointerConfig.instance.updateSdkMode(n),
            this.refreshListening()) : c && (this._modeToUpdate = n) : (this.checksumProcessing = !0,
            o = this.refreshInitParams(null, n).then(function() {
                r.checksumProcessing = !1,
                r._modeToUpdate && (e.SecuredTouchPointerConfig.instance.updateSdkMode(r._modeToUpdate),
                r._modeToUpdate = ""),
                r.refreshListening()
            }).catch(function(e) {
                r.checksumProcessing = !1;
                var t = _securedTouchUtils.SecuredTouchUtil.validateAndCreateError(e, "failed to get pointer.");
                t.errCode === _securedTouchRemoteLogger.SecuredTouchErrorCodes.PARSING_ERROR && r.sendRemoteLog(t.errCode, t.errMsg, t.error),
                _securedTouchUtils.STLogger.warn("refreshInitParams failed", t)
            })),
            o
        }
        ,
        a.prototype.refreshInitParams = function(t, a) {
            return void 0 === t && (t = null),
            __awaiter(this, void 0, void 0, function() {
                var r, n, o;
                return __generator(this, function(c) {
                    switch (c.label) {
                    case 0:
                        return r = e.SecuredTouchPointerConfig.instance.pointerParams.enabled,
                        n = Promise.resolve(),
                        t ? [3, 2] : (o = this.sessionData.getDeviceCredentials(),
                        [4, e.SecuredTouchPointerConfig.instance.loadPointerFromServer(this.dataRepository, {
                            device_id: o.deviceId,
                            clientVersion: this.clientVersion,
                            deviceType: this.browserInfo.deviceType,
                            authToken: e.SecuredTouchPointerConfig.instance.token
                        }, a).catch(function(e) {
                            n = Promise.reject(e)
                        })]);
                    case 1:
                        c.sent(),
                        c.label = 2;
                    case 2:
                        return _securedTouchUtils.STLogger.debug("Refreshing pointer config"),
                        r && !e.SecuredTouchPointerConfig.instance.pointerParams.enabled && _securedTouchUtils.STLogger.warn("ST client disabled by init params!"),
                        [2, n]
                    }
                })
            })
        }
        ,
        a.prototype.tryRecconect = function() {
            var t = this
              , r = this;
            !this.sessionData.initST && Date.now() - this.lastRetryTimestamp > a.RETRY_UPDATE_INTERVAL_MS && (this.lastRetryTimestamp = Date.now(),
            this.startST(this.startParams).catch(function(n) {
                "object" == typeof n && (n = JSON.stringify(n)),
                _securedTouchUtils.STLogger.error("FAILED to start STClient! (" + n + ")"),
                t._retryNumber < e.SecuredTouchClientBase.MAX_NUMBER_OF_TRIES ? (window.setTimeout(r.tryRecconect, a.RETRY_INTERVAL_MS),
                t._retryNumber++) : (_securedTouchUtils.STLogger.error("Connecting retries exhausted!"),
                t._retryNumber = 1)
            }),
            _securedTouchUtils.STLogger.debug("Reconnecting..."))
        }
        ,
        a.prototype.sendMetadata = function() {
            return __awaiter(this, void 0, void 0, function() {
                var t, a, r, n, o, c;
                return __generator(this, function(s) {
                    switch (s.label) {
                    case 0:
                        return s.trys.push([0, 3, , 4]),
                        e.SecuredTouchPointerConfig.instance.pointerParams.sendMetadata ? (t = this.sessionData.getLastMetadataTimeStamp(),
                        (new Date).getTime() - t > _securedTouchUtils.SecuredTouchConstants.METADATA_TTL_MILLIS ? (a = this.sessionData.getMetadataStartedTimeStamp(),
                        (new Date).getTime() - a > e.SecuredTouchPointerConfig.instance.pointerParams.metadataStartedTimeoutMillis ? (_securedTouchUtils.STLogger.debug("Updating Metadata"),
                        this.sessionData.setMetadataStartedTimeStamp((new Date).getTime()),
                        [4, this.stMetadata.getDeviceMetadata(this.stRemoteLogger)]) : [2]) : [2]) : [2];
                    case 1:
                        return r = s.sent(),
                        [4, this.dataRepository.sendMetadata(r)];
                    case 2:
                        return n = s.sent(),
                        this.sessionData.setLastMetadataTimeStamp((new Date).getTime()),
                        this.handleEnvelope(null === n || void 0 === n ? void 0 : n.envelope),
                        [3, 4];
                    case 3:
                        return o = s.sent(),
                        c = _securedTouchUtils.SecuredTouchUtil.validateAndCreateError(o, "Failed to send metadata."),
                        this.sendRemoteLog(_securedTouchRemoteLogger.SecuredTouchErrorCodes.SENDING_METADATA_ERROR, c.errMsg, c.error),
                        _securedTouchUtils.STLogger.warn(c.errMsg, c),
                        [3, 4];
                    case 4:
                        return [2]
                    }
                })
            })
        }
        ,
        a.prototype.setUsername = function(e) {
            try {
                e.hasOwnProperty("userId") ? this.sessionData.setUsername(e.userId) : e.hasOwnProperty("username") && this.sessionData.setUsername(e.username)
            } catch (e) {
                this.sendRemoteLog(_securedTouchRemoteLogger.SecuredTouchErrorCodes.UPDATING_USER_NAME_ERROR, "Failed to update username", e),
                _securedTouchUtils.STLogger.warn("Failed to update username", e)
            }
        }
        ,
        a.prototype.postSdkInit = function() {
            return __awaiter(this, void 0, void 0, function() {
                var e, t, a, r;
                return __generator(this, function(n) {
                    switch (n.label) {
                    case 0:
                        for (t in n.trys.push([0, 2, , 3]),
                        document.referrer && this.addTag("referrer", document.referrer),
                        this.addTag("location", window.location.href),
                        this.addTag("SDK started"),
                        e = [],
                        this.addTagToLocalStorage(e),
                        this.startTasks)
                            a = this.startTasks[t],
                            _securedTouchUtils.SecuredTouchUtil.isFunction(a) && e.push(a());
                        return [4, Promise.all(e)];
                    case 1:
                        return n.sent(),
                        [3, 3];
                    case 2:
                        return r = n.sent(),
                        this.sendRemoteLog(_securedTouchRemoteLogger.SecuredTouchErrorCodes.POST_INIT_ERROR, "Post init failed", r),
                        _securedTouchUtils.STLogger.warn("SDK post init failed", r),
                        [3, 3];
                    case 3:
                        return [2]
                    }
                })
            })
        }
        ,
        a.prototype.addTagToLocalStorage = function(t) {
            if (-1 === this.sessionData.disabledStorage.indexOf("localStorage")) {
                var a = this.sessionData.getFirstLoadedTimeMillis()
                  , r = (new Date).getTime();
                (!a || e.SecuredTouchPointerConfig.instance.pointerParams.firstLoadExpirationTimeMillis < r - a) && (this.setTagAndFindInRegex("SDK first load") || e.SecuredTouchPointerConfig.instance.pointerParams.flushFirstLoad) && t.push(this.flush()),
                this.sessionData.setFirstLoadedTimeMillis((new Date).getTime())
            } else
                _securedTouchUtils.STLogger.warn("SDK local storage blocked")
        }
        ,
        a.prototype.getEnvironmentData = function() {
            return {
                ops: this.stMetadata.OPS,
                webGl: this.stMetadata.WEB_GL_ID,
                devicePixelRatio: window.devicePixelRatio,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height
            }
        }
        ,
        a.prototype.getDevToolsState = function() {
            var e = window.outerWidth - window.innerWidth > 160
              , t = window.outerHeight - window.innerHeight > 160
              , a = e ? "vertical" : "horizontal";
            return t && e || !(window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized || e || t) ? {
                open: !1,
                orientation: null
            } : {
                open: !0,
                orientation: a
            }
        }
        ,
        a.prototype.addCommonAdditionalData = function(t) {
            var a;
            if (e.SecuredTouchPointerConfig.instance.pointerParams.devtoolsEnabled) {
                var r = this.getDevToolsState();
                r && (r.open && (t.DEV_TOOLS_OPEN = r.open),
                r.orientation && (t.DEV_TOOLS_ORIENTATION = r.orientation))
            }
            (null === (a = this.stMetadata) || void 0 === a ? void 0 : a.isDelayPassed) && (this.stMetadata.isDelayPassed = !1,
            t.IS_AUTODLTE_COOKIES = this.stMetadata.isAutoDeleteCookie)
        }
        ,
        a
    }();
    e.SecuredTouchClientBase = a
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "indirect",
            this._isStarted = !1,
            this._onClipboardEvent = new e.EventDispatcher,
            this.delegate = t,
            this.onClipboardEventHandler = this.onEvent.bind(this)
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onClipboardEvent", {
            get: function() {
                return this._onClipboardEvent.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.onEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                this._onClipboardEvent.dispatch(this, this.createClipboardEvent(e))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in clipboard handler", e)
            }
        }
        ,
        t.prototype.createClipboardEvent = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.getSrcElement(e);
            return {
                category: "ClipboardEvent",
                type: e.type,
                eventTs: e.timeStamp,
                epochTs: (new Date).getTime(),
                additionalData: _securedTouchUtils.SecuredTouchUtil.flatten({
                    stId: this.delegate.getElementsStID(t),
                    elementId: t ? t.id : ""
                })
            }
        }
        ,
        t.prototype.start = function() {
            this._isStarted || (this._isStarted = !0,
            this.delegate.addEventListener(document, "cut", this.onClipboardEventHandler),
            this.delegate.addEventListener(document, "copy", this.onClipboardEventHandler),
            this.delegate.addEventListener(document, "paste", this.onClipboardEventHandler))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted && (this._isStarted = !1,
            document.removeEventListener("cut", this.onClipboardEventHandler),
            document.removeEventListener("copy", this.onClipboardEventHandler),
            document.removeEventListener("paste", this.onClipboardEventHandler))
        }
        ,
        t
    }();
    e.SecuredTouchClipboardEvents = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "indirect",
            this._isStarted = !1,
            this._onDragEvent = new e.EventDispatcher,
            this.delegate = t,
            this.onDragEventHandler = this.onEvent.bind(this)
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onDragEvent", {
            get: function() {
                return this._onDragEvent.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.createDataTransferObject = function(e) {
            var t = ""
              , a = ""
              , r = []
              , n = [];
            if (e && (t = e.dropEffect,
            a = e.effectAllowed,
            r = e.types || [],
            e.files && e.files.length > 0))
                for (var o in e.files)
                    n.push({
                        lastModified: e.files[o].lastModified,
                        size: e.files[o].size,
                        type: e.files[o].type
                    });
            return {
                dropEffect: t,
                effectAllowed: a,
                types: r.toString(),
                files: n
            }
        }
        ,
        t.prototype.createDragEvent = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.modifiersKeys(e)
              , a = this.createDataTransferObject(e.dataTransfer);
            return {
                category: "DragEvent",
                type: e.type,
                eventTs: e.timeStamp,
                epochTs: (new Date).getTime(),
                additionalData: _securedTouchUtils.SecuredTouchUtil.flatten({
                    button: e.button,
                    buttons: e.buttons,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    movementX: e.movementX,
                    movementY: e.movementY,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    which: e.which,
                    modifierKeys: t.toString(),
                    dataTransfer: a
                })
            }
        }
        ,
        t.prototype.onEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                this._onDragEvent.dispatch(this, this.createDragEvent(e))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in drag handler", e)
            }
        }
        ,
        t.prototype.start = function() {
            this._isStarted || (this._isStarted = !0,
            this.delegate.addEventListener(document, "dragstart", this.onDragEventHandler),
            this.delegate.addEventListener(document, "dragexit", this.onDragEventHandler),
            this.delegate.addEventListener(document, "drop", this.onDragEventHandler),
            this.delegate.addEventListener(document, "dragend", this.onDragEventHandler))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted && (this._isStarted = !1,
            document.removeEventListener("dragstart", this.onDragEventHandler),
            document.removeEventListener("dragexit", this.onDragEventHandler),
            document.removeEventListener("drop", this.onDragEventHandler),
            document.removeEventListener("dragend", this.onDragEventHandler))
        }
        ,
        t
    }();
    e.SecuredTouchDragEvents = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "indirect",
            this._isStarted = !1,
            this._onFocusEvent = new e.EventDispatcher,
            this.delegate = t,
            this.onFocusEventHandler = this.onEvent.bind(this)
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onFocusEvent", {
            get: function() {
                return this._onFocusEvent.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.getRelatedTarget = function(e) {
            if (!e.relatedTarget)
                return {
                    type: "",
                    stId: "",
                    elementId: ""
                };
            var t = {
                type: _securedTouchUtils.SecuredTouchUtil.getObjectType(e.relatedTarget),
                stId: "",
                elementId: ""
            };
            e.relatedTarget.id && (t.elementId = e.relatedTarget.id);
            try {
                var a = e.relatedTarget;
                t.stId = this.delegate.getElementsStID(a)
            } catch (e) {}
            return t
        }
        ,
        t.prototype.createFocusEvent = function(e) {
            var t = _securedTouchUtils.SecuredTouchUtil.getSrcElement(e)
              , a = this.getRelatedTarget(e);
            return {
                category: "FocusEvent",
                type: e.type,
                eventTs: e.timeStamp,
                epochTs: (new Date).getTime(),
                additionalData: _securedTouchUtils.SecuredTouchUtil.flatten({
                    stId: this.delegate.getElementsStID(t),
                    elementId: t ? t.id : "",
                    relatedTarget: a
                })
            }
        }
        ,
        t.prototype.onEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                this._onFocusEvent.dispatch(this, this.createFocusEvent(e))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in focus handler", e)
            }
        }
        ,
        t.prototype.start = function() {
            this._isStarted || (this._isStarted = !0,
            this.delegate.addEventListener(document, "DOMFocusIn", this.onFocusEventHandler),
            this.delegate.addEventListener(document, "DOMFocusOut", this.onFocusEventHandler),
            this.delegate.addEventListener(document, "focus", this.onFocusEventHandler),
            this.delegate.addEventListener(document, "focusin", this.onFocusEventHandler),
            this.delegate.addEventListener(document, "focusout", this.onFocusEventHandler))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted && (this._isStarted = !1,
            document.removeEventListener("DOMFocusIn", this.onFocusEventHandler),
            document.removeEventListener("DOMFocusOut", this.onFocusEventHandler),
            document.removeEventListener("focus", this.onFocusEventHandler),
            document.removeEventListener("focusin", this.onFocusEventHandler),
            document.removeEventListener("focusout", this.onFocusEventHandler))
        }
        ,
        t
    }();
    e.SecuredTouchFocusEvents = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "indirect",
            this._isStarted = !1,
            this._onUIEvent = new e.EventDispatcher,
            this.delegate = t,
            this.onUIEventHandler = this.onEvent.bind(this)
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onUIEvent", {
            get: function() {
                return this._onUIEvent.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.createUIEvent = function(e) {
            return {
                category: "UIEvent",
                type: e.type,
                eventTs: e.timeStamp,
                epochTs: (new Date).getTime(),
                additionalData: _securedTouchUtils.SecuredTouchUtil.flatten({
                    detail: e.detail
                })
            }
        }
        ,
        t.prototype.onEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                this._onUIEvent.dispatch(this, this.createUIEvent(e))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in UIEvent handler", e)
            }
        }
        ,
        t.prototype.start = function() {
            this._isStarted || (this._isStarted = !0,
            this.delegate.addEventListener(document, "resize", this.onUIEventHandler),
            this.delegate.addEventListener(document, "scroll", this.onUIEventHandler),
            this.delegate.addEventListener(document, "select", this.onUIEventHandler))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted && (this._isStarted = !1,
            document.removeEventListener("resize", this.onUIEventHandler),
            document.removeEventListener("scroll", this.onUIEventHandler),
            document.removeEventListener("select", this.onUIEventHandler))
        }
        ,
        t
    }();
    e.SecuredTouchUIEvents = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "indirect",
            this.visibilityChangeEventName = "visibilitychange",
            this.hiddenProperty = "hidden",
            this._isStarted = !1,
            this._onGeneralEvent = new e.EventDispatcher,
            this.delegate = t,
            this.onGeneralEventHandler = this.onEvent.bind(this),
            this.onLangChangeHandler = this.onLangChangeEvent.bind(this),
            this.onOrientationChangeHandler = this.onOrientationChangeEvent.bind(this),
            this.onVisibilityChangeHandler = this.onVisibilityChangeEvent.bind(this),
            void 0 !== document.msHidden ? (this.hiddenProperty = "msHidden",
            this.visibilityChangeEventName = "msvisibilitychange") : void 0 !== document.webkitHidden && (this.hiddenProperty = "webkitHidden",
            this.visibilityChangeEventName = "webkitvisibilitychange")
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onGeneralEvent", {
            get: function() {
                return this._onGeneralEvent.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.onEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                this._onGeneralEvent.dispatch(this, this.createGeneralEvent(e))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in general event handler", e)
            }
        }
        ,
        t.prototype.onLangChangeEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                var t = this.createGeneralEvent(e);
                navigator && navigator.language && (t.additionalData["navigator.language"] = navigator.language),
                this._onGeneralEvent.dispatch(this, t)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in LangChange event handler", e)
            }
        }
        ,
        t.prototype.onOrientationChangeEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                var t = this.createGeneralEvent(e)
                  , a = _securedTouchUtils.SecuredTouchUtil.getDeviceOrientation();
                t.additionalData.orientation = a.orientation,
                t.additionalData.angle = a.angle,
                this._onGeneralEvent.dispatch(this, t)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in OrientationChange event handler", e)
            }
        }
        ,
        t.prototype.onVisibilityChangeEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                var t = this.createGeneralEvent(e);
                t.additionalData.hidden = !!document[this.hiddenProperty],
                document.visibilityState && (t.additionalData.visibilityState = document.visibilityState.toString()),
                this._onGeneralEvent.dispatch(this, t)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in VisibilityChange event handler", e)
            }
        }
        ,
        t.prototype.createGeneralEvent = function(e) {
            return {
                category: "Event",
                type: e.type,
                eventTs: e.timeStamp,
                epochTs: (new Date).getTime(),
                additionalData: {}
            }
        }
        ,
        t.prototype.start = function() {
            this._isStarted || (this._isStarted = !0,
            this.delegate.addEventListener(document, this.visibilityChangeEventName, this.onVisibilityChangeHandler),
            this.delegate.addEventListener(document, "change", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "fullscreenchange", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "invalid", this.onGeneralEventHandler),
            this.delegate.addEventListener(window, "languagechange", this.onLangChangeHandler),
            this.delegate.addEventListener(window, "orientationchange", this.onOrientationChangeHandler),
            this.delegate.addEventListener(document, "seeked", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "seeking", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "selectstart", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "selectionchange", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "submit", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "volumechange", this.onGeneralEventHandler),
            this.delegate.addEventListener(document, "reset", this.onGeneralEventHandler))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted && (this._isStarted = !1,
            document.removeEventListener(this.visibilityChangeEventName, this.onVisibilityChangeHandler),
            document.removeEventListener("change", this.onGeneralEventHandler),
            document.removeEventListener("fullscreenchange", this.onGeneralEventHandler),
            document.removeEventListener("invalid", this.onGeneralEventHandler),
            window.removeEventListener("languagechange", this.onLangChangeHandler),
            window.removeEventListener("orientationchange", this.onOrientationChangeHandler),
            document.removeEventListener("seeked", this.onGeneralEventHandler),
            document.removeEventListener("seeking", this.onGeneralEventHandler),
            document.removeEventListener("selectstart", this.onGeneralEventHandler),
            document.removeEventListener("selectionchange", this.onGeneralEventHandler),
            document.removeEventListener("submit", this.onGeneralEventHandler),
            document.removeEventListener("volumechange", this.onGeneralEventHandler),
            document.removeEventListener("reset", this.onGeneralEventHandler))
        }
        ,
        t
    }();
    e.SecuredTouchGeneralEvents = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "indirect",
            this._isStarted = !1,
            this._onUnloadEvent = new e.EventDispatcher,
            this.delegate = t,
            this.onUnloadEventHandler = this.onEvent.bind(this)
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onUnloadEvent", {
            get: function() {
                return this._onUnloadEvent.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.createUnloadEvent = function(e) {
            return {
                category: "UIEvent",
                type: e.type,
                eventTs: e.timeStamp,
                epochTs: (new Date).getTime(),
                additionalData: _securedTouchUtils.SecuredTouchUtil.flatten({
                    detail: e.detail
                })
            }
        }
        ,
        t.prototype.onEvent = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return void this._onUnloadEvent.dispatch(this, null);
                this._onUnloadEvent.dispatch(this, this.createUnloadEvent(e))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in UnloadEvent handler", e)
            }
        }
        ,
        t.prototype.start = function() {
            this._isStarted || (this._isStarted = !0,
            e.SecuredTouchPointerConfig.instance.pointerParams.beforeunloadEnabled && this.delegate.addEventListener(window, "beforeUnloadEnabled", this.onUnloadEventHandler))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted && (this._isStarted = !1,
            window.removeEventListener("beforeunload", this.onUnloadEventHandler))
        }
        ,
        t
    }();
    e.SecuredTouchUnloadEvents = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.DEFAULT_INDIRECT_IDLE_INTERVAL = 1e3,
            this.MAX_INDIRECT_EVENTS = 500,
            this._onIndirect = new e.EventDispatcher,
            this._onWindowDispose = new e.EventDispatcher,
            this.indirectEvents = [],
            this.eventCounterByType = {},
            this.idleTimeInMillis = this.DEFAULT_INDIRECT_IDLE_INTERVAL,
            this.lastIndirectEventTimestamp = 0,
            this._isStarted = !1,
            this.stClipboardEvents = new e.SecuredTouchClipboardEvents(t),
            this.stClipboardEvents.onClipboardEvent.subscribe(this.handleEvent.bind(this)),
            this.stDragEvents = new e.SecuredTouchDragEvents(t),
            this.stDragEvents.onDragEvent.subscribe(this.handleEvent.bind(this)),
            this.stFocusEvents = new e.SecuredTouchFocusEvents(t),
            this.stFocusEvents.onFocusEvent.subscribe(this.handleEvent.bind(this)),
            this.stUIEvents = new e.SecuredTouchUIEvents(t),
            this.stUIEvents.onUIEvent.subscribe(this.handleEvent.bind(this)),
            this.stGeneralEvents = new e.SecuredTouchGeneralEvents(t),
            this.stGeneralEvents.onGeneralEvent.subscribe(this.handleEvent.bind(this)),
            this.stUnloadEvent = new e.SecuredTouchUnloadEvents(t),
            this.stUnloadEvent.onUnloadEvent.subscribe(this.windowUnload.bind(this)),
            this.onTimeElapsedHandler = this.onTimeElapsed.bind(this)
        }
        return Object.defineProperty(t.prototype, "onIndirect", {
            get: function() {
                return this._onIndirect.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onWindowDispose", {
            get: function() {
                return this._onWindowDispose.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.onTimeElapsed = function() {
            return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(e) {
                    return this.indirectEvents.length > 0 && (new Date).getTime() - this.lastIndirectEventTimestamp >= this.idleTimeInMillis && this.dispatch(),
                    [2]
                })
            })
        }
        ,
        t.prototype.handleEvent = function(e, t) {
            this.lastIndirectEventTimestamp = (new Date).getTime(),
            this.pushEvent(t)
        }
        ,
        t.prototype.windowUnload = function(t, a) {
            a && e.SecuredTouchPointerConfig.instance.pointerParams.beforeunloadEnabled && (this.lastIndirectEventTimestamp = (new Date).getTime(),
            this.pushEvent(a),
            this._onWindowDispose.dispatch(this, this.clearBuffer()))
        }
        ,
        t.prototype.pushEvent = function(t) {
            e.SecuredTouchPointerConfig.instance.pointerParams.eventsToCountList.has(t.type) ? this.countEvent(t) : (t.additionalData.windowId = _securedTouchStorage.SecuredTouchSessionStorage.instance.windowId,
            t.additionalData.locationHref = window.location.href || "",
            t.additionalData.checksum = e.SecuredTouchPointerConfig.instance.checksum,
            this.indirectEvents.push(t),
            this.indirectEvents.length >= this.MAX_INDIRECT_EVENTS && this.dispatch())
        }
        ,
        t.prototype.countEvent = function(e) {
            this.eventCounterByType[e.type] = Number(this.eventCounterByType[e.type]) + 1 || 1
        }
        ,
        t.prototype.clearBuffer = function() {
            var e = {
                events: this.indirectEvents,
                eventCounters: this.eventCounterByType
            };
            return this.indirectEvents = [],
            this.eventCounterByType = {},
            e
        }
        ,
        t.prototype.dispatch = function() {
            try {
                clearInterval(this.updateIntervalHandle),
                this._onIndirect.dispatch(this, this.clearBuffer()),
                this.updateIntervalHandle = setInterval(this.onTimeElapsedHandler, e.SecuredTouchPointerConfig.instance.pointerParams.indirectIntervalMillis)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("Failed to dispatch indirect events", e)
            }
        }
        ,
        Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.start = function() {
            this._isStarted || (this.updateIntervalHandle = setInterval(this.onTimeElapsedHandler, e.SecuredTouchPointerConfig.instance.pointerParams.indirectIntervalMillis),
            this.stClipboardEvents.start(),
            this.stDragEvents.start(),
            this.stFocusEvents.start(),
            this.stUIEvents.start(),
            this.stGeneralEvents.start(),
            this.stUnloadEvent.start(),
            this._isStarted = !0)
        }
        ,
        t.prototype.stop = function() {
            this._isStarted && (this.stClipboardEvents.stop(),
            this.stDragEvents.stop(),
            this.stFocusEvents.stop(),
            this.stUIEvents.stop(),
            this.stGeneralEvents.stop(),
            this.stUnloadEvent.stop(),
            clearInterval(this.updateIntervalHandle),
            this.updateIntervalHandle = null,
            this._isStarted = !1)
        }
        ,
        t.prototype.unsubscribe = function() {
            this.stClipboardEvents.onClipboardEvent.unsubscribe(this.handleEvent.bind(this)),
            this.stDragEvents.onDragEvent.unsubscribe(this.handleEvent.bind(this)),
            this.stFocusEvents.onFocusEvent.unsubscribe(this.handleEvent.bind(this)),
            this.stUIEvents.onUIEvent.unsubscribe(this.handleEvent.bind(this)),
            this.stGeneralEvents.onGeneralEvent.unsubscribe(this.handleEvent.bind(this)),
            this.stUnloadEvent.onUnloadEvent.unsubscribe(this.windowUnload.bind(this))
        }
        ,
        t
    }();
    e.SecuredTouchIndirectClient = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function e() {
            this.config = {},
            this._cacheHash = 0,
            this.cache = new Map
        }
        return e.prototype.refreshCssSelectors = function(e) {
            try {
                if (!e)
                    return;
                var t = _securedTouchUtils.SecuredTouchUtil.hashCode(JSON.stringify(e));
                if (this._cacheHash === t)
                    return;
                this.config = e,
                this._cacheHash = t,
                this.cache = new Map
            } catch (e) {
                _securedTouchUtils.STLogger.warn("Failed to set css selectors", e)
            }
        }
        ,
        e.prototype.getIdentification = function(e, t) {
            if (null === this.cache.get(e))
                return null;
            if (void 0 !== this.cache.get(e))
                return this.cache.get(e);
            for (var a in this.config)
                try {
                    if (!this.config.hasOwnProperty(a))
                        continue;
                    var r = this.config[a] || [];
                    _securedTouchUtils.SecuredTouchUtil.isArray(r) || (r = [].concat(r));
                    for (var n = 0, o = r; n < o.length; n++) {
                        var c = o[n];
                        if (_securedTouchUtils.SecuredTouchUtil.isSelectorMatches(e, c, t))
                            return this.cache.set(e, a),
                            a
                    }
                } catch (e) {
                    _securedTouchUtils.STLogger.warn("Failed to find selector for " + a, e)
                }
            return this.cache.set(e, null),
            null
        }
        ,
        Object.defineProperty(e.prototype, "cacheHash", {
            get: function() {
                return this._cacheHash
            },
            enumerable: !1,
            configurable: !0
        }),
        e
    }();
    e.SecuredTouchElementsIdentifications = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "eventKeyboard",
            this._isStarted = !1,
            this._onInteraction = new e.EventDispatcher,
            this._onEnterPress = new e.EventDispatcher,
            this._onObfuscatedValue = new e.EventDispatcher,
            this.interactionsMap = new Map,
            this._fieldsIdentifications = new e.SecuredTouchElementsIdentifications,
            this.keyStrokeMap = new Map,
            this.delegate = t,
            this.onKeyDownHandle = this.onKeyDown.bind(this),
            this.onKeyUpHandle = this.onKeyUp.bind(this),
            this.onFocusHandle = this.onFocus.bind(this),
            this.onBlurHandle = this.onBlur.bind(this)
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onInteraction", {
            get: function() {
                return this._onInteraction.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onEnterPress", {
            get: function() {
                return this._onEnterPress.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onObfuscatedValue", {
            get: function() {
                return this._onObfuscatedValue.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.refreshKeyboardCssSelectors = function(e) {
            this._fieldsIdentifications.refreshCssSelectors(e)
        }
        ,
        Object.defineProperty(t.prototype, "modifiersKeys", {
            get: function() {
                return ["Alt", "AltGraph", "CapsLock", "Control", "Fn", "FnLock", "Hyper", "Meta", "NumLock", "OS", "ScrollLock", "Shift", "Super", "Symbol", "SymbolLock"]
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "specialKeys", {
            get: function() {
                return ["Tab", "Shift", "Backspace", "Enter", "CapsLock", "Meta", "Delete", "Alt", "ArrowDown", "ArrowUp", "Control", "ArrowLeft", "End", "Unidentified", "Home", "ArrowRight", "Insert", "Pause", "PageDown", "PageUp", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "AltGraph", "Escape"]
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.clearBuffer = function() {
            var e = _securedTouchUtils.SecuredTouchUtil.getValuesOfMap(this.interactionsMap);
            return this.interactionsMap.clear(),
            e
        }
        ,
        t.prototype.start = function() {
            this._isStarted ? _securedTouchUtils.STLogger.debug("Desktop Keyboard events already listening") : (this.delegate.addEventListener(document, "keydown", this.onKeyDownHandle),
            this.delegate.addEventListener(document, "keyup", this.onKeyUpHandle),
            this.delegate.addEventListener(document, "focus", this.onFocusHandle, !0),
            this.delegate.addEventListener(document, "blur", this.onBlurHandle, !0),
            this._isStarted = !0,
            _securedTouchUtils.STLogger.debug("Desktop Keyboard events start listening..."))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted ? (document.removeEventListener("keydown", this.onKeyDownHandle),
            document.removeEventListener("keyup", this.onKeyUpHandle),
            document.removeEventListener("focus", this.onFocusHandle, !0),
            document.removeEventListener("blur", this.onBlurHandle, !0),
            this._isStarted = !1,
            _securedTouchUtils.STLogger.debug("Desktop Keyboard events stop listening...")) : _securedTouchUtils.STLogger.debug("Desktop Keyboard events already stopped")
        }
        ,
        t.prototype.getInteractionFromElement = function(t) {
            var a = null
              , r = null
              , n = _securedTouchUtils.SecuredTouchUtil.getSrcElement(t);
            return n && _securedTouchUtils.SecuredTouchUtil.isFunction(n.getAttribute) && ((r = _securedTouchUtils.SecuredTouchUtil.getAttribute(n, "data-st-field")) || (r = this._fieldsIdentifications.getIdentification(n, 0)),
            r && !e.SecuredTouchPointerConfig.instance.pointerParams.keyboardFieldBlackList.has(r) && ((a = this.interactionsMap.get(n)) || (a = {
                stId: r,
                elementId: _securedTouchUtils.SecuredTouchUtil.getAttribute(n, "id"),
                name: _securedTouchUtils.SecuredTouchUtil.getAttribute(n, "name"),
                type: _securedTouchUtils.SecuredTouchUtil.getAttribute(n, "type"),
                events: [],
                identified: !1,
                counter: 0,
                additionalData: {
                    windowId: _securedTouchStorage.SecuredTouchSessionStorage.instance.windowId,
                    locationHref: window.location.href || "",
                    checksum: e.SecuredTouchPointerConfig.instance.checksum
                }
            },
            this.interactionsMap.set(n, a)))),
            a
        }
        ,
        t.prototype.getKeyCode = function(e) {
            return e.keyCode ? e.keyCode : e.which ? e.which : e.code ? _securedTouchUtils.SecuredTouchUtil.hashCode(e.code) : _securedTouchUtils.SecuredTouchUtil.hashCode(e.key) + (e.location || 0)
        }
        ,
        t.prototype.getKeyboardEvent = function(e) {
            return e || window.event
        }
        ,
        t.prototype.getKeystrokeId = function(e, t) {
            var a, r = this.getKeyCode(e);
            return "keyup" === t && (this.keyStrokeMap.has(r) ? (a = this.keyStrokeMap.get(r),
            this.keyStrokeMap.delete(r)) : a = _securedTouchUtils.SecuredTouchUtil.newGuid()),
            "keydown" === t && (this.keyStrokeMap.has(r) && e.repeat ? a = this.keyStrokeMap.get(r) : (a = _securedTouchUtils.SecuredTouchUtil.newGuid(),
            this.keyStrokeMap.set(r, a))),
            a
        }
        ,
        t.prototype.createKeyboardInteractionEvent = function(e, t) {
            var a = _securedTouchUtils.SecuredTouchUtil.getSrcElement(t)
              , r = a.value ? a.value.toString().length : 0;
            return {
                type: e,
                eventTs: t.timeStamp,
                epochTs: (new Date).getTime(),
                modifierKeys: [],
                selectionStart: _securedTouchUtils.SecuredTouchUtil.getElementSelectionStart(a),
                selectionEnd: _securedTouchUtils.SecuredTouchUtil.getElementSelectionEnd(a),
                repeat: t.repeat,
                key: null,
                keyCode: null,
                keystrokeId: null,
                currentLength: r,
                location: t.location
            }
        }
        ,
        t.prototype.enrichKeyboardEvent = function(e, t, a) {
            (this.modifiersKeys.indexOf(e.key) >= 0 || this.specialKeys.indexOf(e.key) >= 0) && (a.key = e.key,
            a.keyCode = e.keyCode),
            a.keystrokeId = this.getKeystrokeId(e, a.type);
            var r = _securedTouchUtils.SecuredTouchUtil.getSrcElement(e);
            a.currentLength = String(r.value).length,
            e.getModifierState && this.modifiersKeys.forEach(function(t) {
                e.getModifierState(t.toString()) && a.modifierKeys.push(t)
            })
        }
        ,
        t.prototype.onFocus = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return void this._onInteraction.dispatch(this, null);
                e = this.getKeyboardEvent(e);
                var t = this.getInteractionFromElement(e);
                if (t) {
                    var a = this.createKeyboardInteractionEvent("focus", e);
                    t.events.push(a)
                }
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in keyboard focus handler", e)
            }
        }
        ,
        t.prototype.onKeyUp = function(e) {
            try {
                if (13 !== (e = this.getKeyboardEvent(e)).keyCode && 13 !== e.which || this._onEnterPress.dispatch(this, _securedTouchUtils.SecuredTouchUtil.getSrcElement(e)),
                !this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return void this._onInteraction.dispatch(this, null);
                var t = this.getInteractionFromElement(e);
                if (t) {
                    var a = this.createKeyboardInteractionEvent("keyup", e);
                    this.enrichKeyboardEvent(e, t, a),
                    t.events.push(a)
                } else
                    this.keyStrokeMap.delete(this.getKeyCode(e))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in keyUp handler", e)
            }
        }
        ,
        t.prototype.isEmpty = function() {
            return 0 === this.interactionsMap.size
        }
        ,
        t.prototype.onKeyDown = function(e) {
            try {
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return void this._onInteraction.dispatch(this, null);
                e = this.getKeyboardEvent(e);
                var t = this.getInteractionFromElement(e);
                if (t) {
                    var a = this.createKeyboardInteractionEvent("keydown", e);
                    this.enrichKeyboardEvent(e, t, a),
                    t.events.push(a)
                }
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in keyDown handler", e)
            }
        }
        ,
        t.prototype.onBlur = function(e) {
            try {
                e = this.getKeyboardEvent(e);
                var t = this.getInteractionFromElement(e);
                if (!this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return void this._onInteraction.dispatch(this, null);
                if (t) {
                    var a = this.createKeyboardInteractionEvent("blur", e);
                    t.events.push(a);
                    var r = _securedTouchUtils.SecuredTouchUtil.getSrcElement(e);
                    this.interactionsMap.delete(r),
                    this._onInteraction.dispatch(this, t)
                }
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in blur handler", e)
            }
        }
        ,
        Object.defineProperty(t.prototype, "fieldsIdentifications", {
            get: function() {
                return this._fieldsIdentifications
            },
            enumerable: !1,
            configurable: !0
        }),
        t
    }();
    e.SecuredTouchKeyboard = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t(t) {
            this.BEHAVIORAL_TYPE = "mouse",
            this._isStarted = !1,
            this._onInteraction = new e.EventDispatcher,
            this._onClickEvent = new e.EventDispatcher,
            this.lastMouseInteractionTimestamp = null,
            this.mouseEventsCounter = 0,
            this.counterGroupByType = {},
            this.delegate = t,
            this.wheelOptions = !!_securedTouchUtils.SecuredTouchUtil.isPassiveSupported() && {
                passive: !0
            },
            this.onClickHandle = this.onClick.bind(this),
            this.onDblclickHandle = this.onMouseClickEvent.bind(this),
            this.onMousedownHandle = this.onMouseClickEvent.bind(this),
            this.onMousemoveHandle = this.onMouseEvent.bind(this),
            this.onMouseoutHandle = this.onMouseout.bind(this),
            this.onMouseoverHandle = this.onMouseEvent.bind(this),
            this.onMouseupHandle = this.onMouseClickEvent.bind(this),
            this.onWheelHandle = this.onMouseEvent.bind(this),
            this.interactionUpdateHandle = this.interactionUpdate.bind(this)
        }
        return Object.defineProperty(t.prototype, "isStarted", {
            get: function() {
                return this._isStarted
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onInteraction", {
            get: function() {
                return this._onInteraction.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(t.prototype, "onClickEvent", {
            get: function() {
                return this._onClickEvent.asEvent()
            },
            enumerable: !1,
            configurable: !0
        }),
        t.prototype.interactionUpdate = function() {
            this.lastMouseInteraction ? (new Date).getTime() - this.lastMouseInteractionTimestamp >= e.SecuredTouchPointerConfig.instance.pointerParams.mouseIdleTimeoutMillis && this.dispatch() : !this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE) && (new Date).getTime() - this.lastMouseInteractionTimestamp <= e.SecuredTouchPointerConfig.instance.pointerParams.mouseIntervalMillis && this.dispatch()
        }
        ,
        t.prototype.dispatch = function() {
            try {
                this.lastMouseInteraction && (this.lastMouseInteraction.additionalData = Object.assign({}, this.lastMouseInteraction.additionalData, this.counterGroupByType)),
                this._onInteraction.dispatch(this, this.lastMouseInteraction),
                this.lastMouseInteraction = null,
                this.mouseEventsCounter = 0,
                this.counterGroupByType = {}
            } catch (e) {
                _securedTouchUtils.STLogger.warn("Failed to dispatch mouse events", e)
            }
        }
        ,
        t.prototype.updateInteraction = function(t) {
            this.lastMouseInteraction || (this.lastMouseInteraction = {
                events: [],
                identified: !1,
                counter: 0,
                additionalData: {
                    windowId: _securedTouchStorage.SecuredTouchSessionStorage.instance.windowId,
                    locationHref: window.location.href || "",
                    checksum: e.SecuredTouchPointerConfig.instance.checksum
                }
            }),
            this.lastMouseInteraction.events.push(t),
            this.mouseEventsCounter++,
            this.mouseEventsCounter >= e.SecuredTouchPointerConfig.instance.pointerParams.maxMouseEvents && this.dispatch()
        }
        ,
        t.prototype.start = function() {
            this._isStarted ? _securedTouchUtils.STLogger.debug("Desktop Mouse events already listening") : (this.delegate.addEventListener(document, "click", this.onClickHandle, !0),
            this.delegate.addEventListener(document, "dblclick", this.onDblclickHandle),
            this.delegate.addEventListener(document, "mousedown", this.onMousedownHandle),
            this.delegate.addEventListener(document, "mousemove", this.onMousemoveHandle),
            this.delegate.addEventListener(document, "mouseout", this.onMouseoutHandle),
            this.delegate.addEventListener(document, "mouseover", this.onMouseoverHandle),
            this.delegate.addEventListener(document, "mouseup", this.onMouseupHandle),
            this.delegate.addEventListener(document, "wheel", this.onWheelHandle, this.wheelOptions),
            this.updateIntervalHandle = setInterval(this.interactionUpdateHandle, e.SecuredTouchPointerConfig.instance.pointerParams.mouseIntervalMillis),
            this._isStarted = !0,
            _securedTouchUtils.STLogger.debug("Desktop Mouse events start listening..."))
        }
        ,
        t.prototype.stop = function() {
            this._isStarted ? (document.removeEventListener("click", this.onClickHandle, !0),
            document.removeEventListener("dblclick", this.onDblclickHandle),
            document.removeEventListener("mousedown", this.onMousedownHandle),
            document.removeEventListener("mousemove", this.onMousemoveHandle),
            document.removeEventListener("mouseout", this.onMouseoutHandle),
            document.removeEventListener("mouseover", this.onMouseoverHandle),
            document.removeEventListener("mouseup", this.onMouseupHandle),
            document.removeEventListener("wheel", this.onWheelHandle, this.wheelOptions),
            clearInterval(this.updateIntervalHandle),
            this.updateIntervalHandle = null,
            this._isStarted = !1,
            _securedTouchUtils.STLogger.debug("Desktop Mouse events stop listening...")) : _securedTouchUtils.STLogger.debug("Desktop Mouse events already stopped")
        }
        ,
        t.prototype.onClick = function(t) {
            try {
                if (this.lastMouseInteractionTimestamp = (new Date).getTime(),
                this._onClickEvent.dispatch(this, _securedTouchUtils.SecuredTouchUtil.getSrcElement(t)),
                !this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                if (e.SecuredTouchPointerConfig.instance.pointerParams.eventsToCountList.has(t.type))
                    return void this.countEvent(t);
                this.updateInteraction(this.createMouseClickEvent(t.type, t)),
                this.dispatch()
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in " + t.type + " handler", e)
            }
        }
        ,
        t.prototype.onMouseout = function(t) {
            try {
                if (this.lastMouseInteractionTimestamp = (new Date).getTime(),
                !this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                if (e.SecuredTouchPointerConfig.instance.pointerParams.eventsToCountList.has(t.type))
                    return void this.countEvent(t);
                this.updateInteraction(this.createMouseEvent(t.type, t));
                var a = t.relatedTarget || t.toElement;
                a && "HTML" !== a.nodeName || this.dispatch()
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in " + t.type + " handler", e)
            }
        }
        ,
        t.prototype.countEvent = function(e) {
            this.counterGroupByType[e.type] = Number(this.counterGroupByType[e.type]) + 1 || 1
        }
        ,
        t.prototype.onMouseEvent = function(t) {
            try {
                if (this.lastMouseInteractionTimestamp = (new Date).getTime(),
                !this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                if (e.SecuredTouchPointerConfig.instance.pointerParams.eventsToCountList.has(t.type))
                    return void this.countEvent(t);
                this.updateInteraction(this.createMouseEvent(t.type, t))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in " + t.type + " handler", e)
            }
        }
        ,
        t.prototype.onMouseClickEvent = function(t) {
            try {
                if (this.lastMouseInteractionTimestamp = (new Date).getTime(),
                !this.delegate.collectBehavioralData(this.BEHAVIORAL_TYPE))
                    return;
                if (e.SecuredTouchPointerConfig.instance.pointerParams.eventsToCountList.has(t.type))
                    return void this.countEvent(t);
                this.updateInteraction(this.createMouseClickEvent(t.type, t))
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in " + t.type + " handler", e)
            }
        }
        ,
        t.prototype.clearBuffer = function() {
            var e = null;
            return this.lastMouseInteraction && (e = this.lastMouseInteraction),
            this.lastMouseInteraction = null,
            e
        }
        ,
        t.prototype.isEmpty = function() {
            return !this.lastMouseInteraction
        }
        ,
        t.prototype.createMouseEvent = function(e, t) {
            var a = _securedTouchUtils.SecuredTouchUtil.modifiersKeys(t);
            return {
                type: e,
                eventTs: t.timeStamp,
                epochTs: (new Date).getTime(),
                button: t.button,
                buttons: t.buttons,
                clientX: t.clientX,
                clientY: t.clientY,
                movementX: t.movementX,
                movementY: t.movementY,
                offsetX: t.offsetX,
                offsetY: t.offsetY,
                pageX: t.pageX,
                pageY: t.pageY,
                screenX: t.screenX,
                screenY: t.screenY,
                which: t.which,
                modifierKeys: a
            }
        }
        ,
        t.prototype.createMouseClickEvent = function(e, t) {
            var a = this.createMouseEvent(e, t);
            if (t.target && _securedTouchUtils.SecuredTouchUtil.isFunction(t.target.getBoundingClientRect)) {
                var r = t.target.getBoundingClientRect();
                a.targetBottom = r.bottom,
                a.targetHeight = r.height,
                a.targetLeft = r.left,
                a.targetRight = r.right,
                a.targetTop = r.top,
                a.targetWidth = r.width,
                a.targetX = r.x,
                a.targetY = r.y
            }
            return a
        }
        ,
        t
    }();
    e.SecuredTouchMouse = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function e(e) {
            this.key = e
        }
        return Object.defineProperty(e.prototype, "asArray", {
            get: function() {
                var t = e.stSessionStorage.getItem(this.key);
                return t || (t = JSON.stringify([])),
                JSON.parse(t)
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "length", {
            get: function() {
                return this.asArray.length
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.push = function(t) {
            var a = this.asArray
              , r = a.push(t);
            return e.stSessionStorage.setItem(this.key, JSON.stringify(a)),
            e.stSessionStorage.setItem(_securedTouchUtils.SecuredTouchConstants.SESSION_STORAGE_UPDATE_TS, (new Date).getTime()),
            r
        }
        ,
        e.prototype.concat = function(t) {
            var a = this.asArray.concat(t);
            return e.stSessionStorage.setItem(this.key, JSON.stringify(a)),
            this
        }
        ,
        e.prototype.clear = function() {
            e.stSessionStorage.removeItem(this.key)
        }
        ,
        e.stSessionStorage = _securedTouchStorage.SecuredTouchSessionStorage.instance.sessionStorage,
        e
    }();
    e.SecuredTouchStorageArray = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function e() {
            this.config = {},
            this._cacheHash = 0,
            this.cache = new Map
        }
        return e.prototype.refreshConfig = function(e) {
            try {
                if (!e)
                    return;
                var t = _securedTouchUtils.SecuredTouchUtil.hashCode(JSON.stringify(e));
                if (this._cacheHash === t)
                    return;
                this.config = e,
                this._cacheHash = t,
                this.cache = new Map
            } catch (e) {
                _securedTouchUtils.STLogger.warn("Failed to set css selectors", e)
            }
        }
        ,
        e.prototype.getMatchingTags = function(e, t) {
            var a = this.cache.get(e);
            if (a)
                return a;
            var r = {};
            for (var n in this.config)
                try {
                    if (!this.config.hasOwnProperty(n))
                        continue;
                    var o = this.config[n].selector || [];
                    _securedTouchUtils.SecuredTouchUtil.isArray(o) || (o = [].concat(o));
                    for (var c = 0, s = o; c < s.length; c++) {
                        var i = s[c];
                        _securedTouchUtils.SecuredTouchUtil.isSelectorMatches(e, i, t) && (r[n] = this.config[n])
                    }
                } catch (e) {
                    _securedTouchUtils.STLogger.warn("Failed to get the config for " + n + " tag", e)
                }
            return this.cache.set(e, r),
            r
        }
        ,
        e.prototype.getValue = function(e, t) {
            if (t && e)
                switch (t = t.trim(),
                e) {
                case "email_domain":
                    return _securedTouchUtils.SecuredTouchUtil.getEmailDomain(t);
                case "obfuscate":
                    return "" + _securedTouchUtils.SecuredTouchUtil.mod(t, 1e3);
                case "plain":
                    return t;
                case "zip":
                    return t.substr(0, 3)
                }
            return ""
        }
        ,
        Object.defineProperty(e.prototype, "cacheHash", {
            get: function() {
                return this._cacheHash
            },
            enumerable: !1,
            configurable: !0
        }),
        e
    }();
    e.SecuredTouchTagsIdentifications = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function e() {
            this._reduceFactorMap = null,
            this._snapshotsReduceFactor = 0
        }
        return Object.defineProperty(e.prototype, "reduceFactorMap", {
            get: function() {
                return this._reduceFactorMap
            },
            set: function(e) {
                this._reduceFactorMap = e
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "snapshotsReduceFactor", {
            get: function() {
                return this._snapshotsReduceFactor
            },
            set: function(e) {
                this._snapshotsReduceFactor = e
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.eventsWereReduced = function() {
            return this._reduceFactorMap && 0 !== Object.keys(this._reduceFactorMap).length
        }
        ,
        e.prototype.reduceEvents = function(e) {
            var t = this;
            try {
                if (!e || 0 === e.length || !this._reduceFactorMap)
                    return e;
                for (var a = new Map, r = [], n = 0; n < e.length; n++)
                    a.get(e[n].type) ? a.get(e[n].type).push(n) : a.set(e[n].type, [n]);
                a.forEach(function(e, a) {
                    var n = t._reduceFactorMap[a] ? Number(t._reduceFactorMap[a]) : 0;
                    t.reduceByFactor(n, e, function(t) {
                        r[e[t]] = !0
                    })
                });
                var o = [];
                for (n = 0; n < e.length; n++)
                    r[n] && o.push(e[n]);
                return e.length !== o.length && _securedTouchUtils.STLogger.debug(e.length - o.length + " events reduced out of " + e.length),
                o
            } catch (t) {
                return _securedTouchUtils.STLogger.warn("Failed to reduce events", t),
                e
            }
        }
        ,
        e.prototype.reduceSnapshots = function(e) {
            try {
                if (!e || 0 === e.length || 0 === this._snapshotsReduceFactor)
                    return e;
                var t = [];
                return this.reduceByFactor(this._snapshotsReduceFactor, e, function(a) {
                    t.push(e[a])
                }),
                _securedTouchUtils.STLogger.debug(e.length - t.length + " snapshots reduced out of " + e.length),
                t
            } catch (t) {
                return _securedTouchUtils.STLogger.warn("Failed to reduce events", t),
                e
            }
        }
        ,
        e.prototype.reduceByFactor = function(e, t, a) {
            e = Math.min(e, 1);
            for (var r = Math.round(Math.max(t.length * (1 - e), 2)), n = (t.length - 1) / (r - 1), o = Math.min(t.length, r), c = 0; c < o; c++) {
                a(Math.round(c * n))
            }
        }
        ,
        e
    }();
    e.SecuredTouchReduceFactor = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function(t) {
        function a(a, r) {
            var n = t.call(this, a, r) || this;
            return n.capturedKeyboardInteractions = new e.SecuredTouchStorageArray(_securedTouchUtils.SecuredTouchConstants.CAPTURED_KEYBOARD_INTERACTIONS),
            n.capturedMouseInteractions = new e.SecuredTouchStorageArray(_securedTouchUtils.SecuredTouchConstants.CAPTURED_MOUSE_INTERACTIONS),
            n.capturedGestures = new e.SecuredTouchStorageArray(_securedTouchUtils.SecuredTouchConstants.CAPTURED_GESTURES),
            n.capturedIndirectEvents = new e.SecuredTouchStorageArray(_securedTouchUtils.SecuredTouchConstants.CAPTURED_INDIRECT),
            n.indirectCounters = {},
            n.tagsWithValueIdentifications = new e.SecuredTouchTagsIdentifications,
            n.reduceFactorManager = new e.SecuredTouchReduceFactor,
            n.payloadIndex = 0,
            n.totalMouseCounter = 0,
            n.totalKeyboardCounter = 0,
            n.totalGestureCounter = 0,
            n.lastGestureTimestamp = 0,
            n.currentBufferSize = 0,
            n.interactionFailuresCounter = 0,
            n.keyboard = new e.SecuredTouchKeyboard(n),
            n.keyboard.onInteraction.subscribe(n.handleKeyboardInteraction.bind(n)),
            n.keyboard.onEnterPress.subscribe(n.handleStTagOnEnter.bind(n)),
            n.keyboard.onObfuscatedValue.subscribe(n.handleTagValueOnBlur.bind(n)),
            n.mouse = new e.SecuredTouchMouse(n),
            n.mouse.onInteraction.subscribe(n.handleMouseInteraction.bind(n)),
            n.mouse.onClickEvent.subscribe(n.handleStTagOnClick.bind(n)),
            n.sensors = new e.SecuredTouchSensors(n),
            n.gesture = new e.SecuredTouchGestureEvents(n,n.sensors),
            n.gesture.onGesture.subscribe(n.handleGesture.bind(n)),
            n.indirect = new e.SecuredTouchIndirectClient(n),
            n.indirect.onIndirect.subscribe(n.handleIndirect.bind(n)),
            n.indirect.onWindowDispose.subscribe(n.handleWindowDispose.bind(n)),
            n.onUrlChangeHandler = n.onUrlChange.bind(n),
            n.onErrorHandler = n.onError.bind(n),
            n.sessionData.passedBufferTimeout && n.resetLists(),
            n
        }
        return __extends(a, t),
        a.prototype.dispose = function() {
            return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(e) {
                    return this.stopListening(),
                    this.keyboard.onInteraction.unsubscribe(this.handleKeyboardInteraction.bind(this)),
                    this.keyboard.onEnterPress.unsubscribe(this.handleStTagOnEnter.bind(this)),
                    this.keyboard.onObfuscatedValue.unsubscribe(this.handleTagValueOnBlur.bind(this)),
                    this.mouse.onInteraction.unsubscribe(this.handleMouseInteraction.bind(this)),
                    this.mouse.onClickEvent.unsubscribe(this.handleStTagOnClick.bind(this)),
                    this.gesture.onGesture.unsubscribe(this.handleGesture.bind(this)),
                    this.indirect.unsubscribe(),
                    this.indirect.onIndirect.unsubscribe(this.handleIndirect.bind(this)),
                    this.indirect.onWindowDispose.unsubscribe(this.handleWindowDispose.bind(this)),
                    this.clearMouseBuffer(),
                    this.clearIndirectBuffer(),
                    this.sessionData.lastDisposedPayload = this.createInteractionsPayload(),
                    [2]
                })
            })
        }
        ,
        a.prototype.collectBehavioralData = function(t) {
            if (this.isBehavioralDataPaused)
                return !1;
            var a = e.SecuredTouchPointerConfig.instance.pointerParams.behavioralBlacklist;
            return !(t && a && a[t]) || !Boolean(window.location.href.match(a[t]))
        }
        ,
        a.prototype.getElementsStID = function(e) {
            try {
                return _securedTouchUtils.SecuredTouchUtil.getAttribute(e, "data-st-field") || this.keyboard.fieldsIdentifications.getIdentification(e, 0) || ""
            } catch (e) {
                return _securedTouchUtils.STLogger.warn("failed to get element stId", e),
                ""
            }
        }
        ,
        a.prototype.addEventListener = function(t, a, r, n) {
            e.SecuredTouchPointerConfig.instance.pointerParams.eventsBlackList.has(a) || t.addEventListener(a, r, n)
        }
        ,
        a.prototype.isAboveBufferSize = function() {
            return this.currentBufferSize >= e.SecuredTouchPointerConfig.instance.pointerParams.bufferSize
        }
        ,
        a.prototype.enrichMouseInteraction = function(e) {
            e.counter = this.totalMouseCounter++,
            this.enrichInteractionWithAdditionalData(e)
        }
        ,
        a.prototype.refreshListening = function() {
            if (this.sessionData.initST) {
                var t = e.SecuredTouchPointerConfig.instance;
                if (this.tagsWithValueIdentifications.refreshConfig(t.pointerParams.remoteTags),
                this.reduceFactorManager.reduceFactorMap = t.pointerParams.eventsReduceFactorMap,
                this.reduceFactorManager.snapshotsReduceFactor = t.pointerParams.snapshotsReduceFactor,
                this.keyboard.refreshKeyboardCssSelectors(t.pointerParams.keyboardCssSelectors),
                this.sensors.maxSensorSamples = t.pointerParams.maxSensorSamples,
                this.sensors.sensorsTimestampDeltaInMillis = t.pointerParams.sensorsDeltaInMillis,
                this.isEnabled()) {
                    this.mouse.start(),
                    this.keyboard.start(),
                    this.gesture.start(),
                    this.indirect.start(),
                    0 == t.pointerParams.maxSensorSamples ? this.sensors.stop() : this.sensors.start();
                    var a = this.sessionData.lastDisposedPayload;
                    a && this.sendInteractions(a),
                    this.addEventListener(window, "_onlocationchange", this.onUrlChangeHandler),
                    this.addEventListener(window, "popstate", this.onUrlChangeHandler),
                    this.addEventListener(window, "error", this.onErrorHandler)
                } else
                    this.stopListening(),
                    _securedTouchUtils.STLogger.info("Securedtouch is disabled.")
            } else
                this.tryRecconect()
        }
        ,
        a.prototype.addTagsWithValue = function(e) {
            var t = !1;
            for (var a in e)
                try {
                    if (!e.hasOwnProperty(a))
                        continue;
                    if (e[a].context && !Boolean(window.location.href.match(e[a].context)))
                        continue;
                    var r = "";
                    if (e[a].operation && e[a].valueSelector) {
                        var n = document.querySelector(e[a].valueSelector);
                        if (n) {
                            var o = _securedTouchUtils.SecuredTouchUtil.getElementText(n);
                            r = this.tagsWithValueIdentifications.getValue(e[a].operation, o)
                        }
                    }
                    if (e[a].valueMandatory && !r) {
                        _securedTouchUtils.STLogger.warn("tag wasn't added. value is missing");
                        continue
                    }
                    var c = this.setTagAndFindInRegex(a, r);
                    !t && c && (t = !0)
                } catch (e) {
                    _securedTouchUtils.STLogger.warn("failed to add " + a + " tag", e)
                }
            t && this.flush()
        }
        ,
        a.prototype.isClickableInput = function(e) {
            return e && ["button", "checkbox", "radio", "submit", "file", "reset"].indexOf(e.type) >= 0
        }
        ,
        a.prototype.isTextInput = function(e) {
            return e && ["email", "number", "password", "search", "tel", "text", "url"].indexOf(e.type) >= 0
        }
        ,
        a.prototype.handleStTagOnEnter = function(e, t) {
            t instanceof HTMLInputElement && this.isTextInput(t) && this.handleStTagElement(t)
        }
        ,
        a.prototype.handleTagValueOnBlur = function(e, t) {
            t && this.addTag(t.fieldKey, t.obfuscatedValue)
        }
        ,
        a.prototype.handleStTagOnClick = function(e, t) {
            t instanceof HTMLInputElement && !this.isClickableInput(t) || this.handleStTagElement(t)
        }
        ,
        a.prototype.handleMouseInteraction = function(e, t) {
            this.isInitAndEnabled() && (t ? (this.addMouseInteractions(t),
            this.lastGestureTimestamp !== t.events[t.events.length - 1].eventTs && this.currentBufferSize++,
            this.isAboveBufferSize() && this.sendAllCapturedInteractions()) : this.sendHeartBeat())
        }
        ,
        a.prototype.handleIndirect = function(e, t) {
            this.isInitAndEnabled() && (this.addIndirectEvents(t),
            this.isEmpty() && this.sendAllCapturedInteractions())
        }
        ,
        a.prototype.handleWindowDispose = function(e, t) {
            this.isInitAndEnabled() && (this.addIndirectEvents(t),
            this.dispose())
        }
        ,
        a.prototype.enrichKeyboardInteraction = function(e) {
            e.counter = this.totalKeyboardCounter++,
            this.enrichInteractionWithAdditionalData(e)
        }
        ,
        a.prototype.handleKeyboardInteraction = function(e, t) {
            this.isInitAndEnabled() && (t ? (this.addKeyboardInteraction(t),
            this.currentBufferSize++,
            this.isAboveBufferSize() && this.sendAllCapturedInteractions()) : this.sendHeartBeat())
        }
        ,
        a.prototype.handleGesture = function(e, t) {
            this.isInitAndEnabled() && (t ? (this.enrichInteractionWithAdditionalData(t),
            t.counter = this.totalGestureCounter++,
            this.reduceGestureSnapshots(t),
            this.capturedGestures.push(t),
            this.currentBufferSize++,
            this.lastGestureTimestamp = t.snapshots.length > 0 ? t.snapshots[t.snapshots.length - 1].additionalData.eventTimeStamp : t.timestamp,
            this.sensors.onGesture(t),
            this.isAboveBufferSize() && this.sendAllCapturedInteractions()) : this.sendHeartBeat())
        }
        ,
        a.prototype.clearMouseBuffer = function() {
            var e = this.mouse.clearBuffer();
            e && this.addMouseInteractions(e)
        }
        ,
        a.prototype.clearIndirectBuffer = function() {
            var e = this.indirect.clearBuffer();
            this.addIndirectEvents(e)
        }
        ,
        a.prototype.clearKeyboardBuffer = function() {
            for (var e = 0, t = this.keyboard.clearBuffer(); e < t.length; e++) {
                var a = t[e];
                a && this.addKeyboardInteraction(a)
            }
        }
        ,
        a.prototype.clearBuffer = function() {
            this.clearKeyboardBuffer(),
            this.clearMouseBuffer(),
            this.clearIndirectBuffer()
        }
        ,
        a.prototype.addMouseInteractions = function(e) {
            this.enrichMouseInteraction(e),
            this.reduceMouseInteraction(e),
            this.capturedMouseInteractions.push(e)
        }
        ,
        a.prototype.addKeyboardInteraction = function(e) {
            this.enrichKeyboardInteraction(e),
            this.reduceKeyboardInteraction(e),
            this.capturedKeyboardInteractions.push(e)
        }
        ,
        a.prototype.addIndirectEvents = function(e) {
            e && e.events && e.events.length > 0 && this.capturedIndirectEvents.concat(e.events),
            e && e.eventCounters && this.addIndirectCounters(e.eventCounters)
        }
        ,
        a.prototype.addIndirectCounters = function(e) {
            for (var t in e)
                e.hasOwnProperty(t) && (this.indirectCounters[t] = e[t] + (this.indirectCounters[t] || 0))
        }
        ,
        a.prototype.reduceIndirectEvents = function(e) {
            return this.reduceFactorManager.reduceEvents(e)
        }
        ,
        a.prototype.reduceMouseInteraction = function(e) {
            e.events = this.reduceFactorManager.reduceEvents(e.events)
        }
        ,
        a.prototype.reduceKeyboardInteraction = function(e) {
            e.events = this.reduceFactorManager.reduceEvents(e.events)
        }
        ,
        a.prototype.reduceGestureSnapshots = function(e) {
            e.snapshots = this.reduceFactorManager.reduceSnapshots(e.snapshots)
        }
        ,
        a.prototype.isEmpty = function() {
            return 0 === this.capturedKeyboardInteractions.length && 0 === this.capturedMouseInteractions.length && 0 === this.capturedGestures.length && this.gesture.isEmpty() && this.keyboard.isEmpty() && this.mouse.isEmpty()
        }
        ,
        a.prototype.forceSendCapturedEvents = function(e) {
            return this.clearMouseBuffer(),
            this.sendAllCapturedInteractions(e)
        }
        ,
        a.prototype.onUrlChange = function() {
            this.addTag("location", window.location.href)
        }
        ,
        a.prototype.handleStTagElement = function(t) {
            if (t) {
                var a = this.tagsWithValueIdentifications.getMatchingTags(t, e.SecuredTouchPointerConfig.instance.pointerParams.maxSelectorChildren);
                this.addTagsWithValue(a);
                var r = _securedTouchUtils.SecuredTouchUtil.getAttribute(t, "data-st-tag")
                  , n = _securedTouchUtils.SecuredTouchUtil.getAttribute(t, "data-st-tag-value");
                r && this.addTag(r, n)
            }
        }
        ,
        a.prototype.onError = function(e) {
            try {
                var t = e.filename
                  , a = e.message || ""
                  , r = e.error;
                t && t.toLowerCase().indexOf("securedtouch") >= 0 && this.sendRemoteLog(_securedTouchRemoteLogger.SecuredTouchErrorCodes.GENERAL_ERROR, "Unhandled error " + a, r)
            } catch (e) {
                _securedTouchUtils.STLogger.warn("error in error handler", e)
            }
        }
        ,
        a.prototype.stopListening = function() {
            this.keyboard.stop(),
            this.mouse.stop(),
            this.gesture.stop(),
            this.indirect.stop(),
            this.sensors.stop(),
            window.removeEventListener("_onlocationchange", this.onUrlChangeHandler),
            window.removeEventListener("popstate", this.onUrlChangeHandler),
            window.removeEventListener("error", this.onErrorHandler)
        }
        ,
        a.prototype.resetLists = function() {
            this.capturedKeyboardInteractions.clear(),
            this.capturedMouseInteractions.clear(),
            this.capturedGestures.clear(),
            this.capturedIndirectEvents.clear(),
            this.indirectCounters = {},
            this.sensors.reset(),
            e.SecuredTouchTags.instance.reset(),
            this.currentBufferSize = 0
        }
        ,
        a.prototype.setUsernameToPayload = function(e) {
            var t = this.sessionData.getUsername();
            e.username = t || this.sessionData.getDeviceCredentials().deviceId,
            e.keyboardInteractionPayloads.forEach(function(e) {
                e.identified = Boolean(t)
            }),
            e.mouseInteractionPayloads.forEach(function(e) {
                e.identified = Boolean(t)
            }),
            e.gestures.forEach(function(e) {
                e.identified = Boolean(t)
            })
        }
        ,
        a.prototype.isValidGestures = function() {
            return this.capturedGestures && this.capturedGestures.length > 0 && this.capturedGestures.length < e.SecuredTouchPointerConfig.instance.pointerParams.maxSnapshotsCount
        }
        ,
        a.prototype.createInteractionsPayload = function() {
            var t = {
                applicationId: this.startParams.appId,
                deviceId: this.sessionData.getDeviceCredentials().deviceId,
                deviceType: this.browserInfo.deviceType,
                appSessionId: this.sessionData.appSessionId,
                stToken: this.getStToken(),
                keyboardInteractionPayloads: this.capturedKeyboardInteractions.asArray,
                mouseInteractionPayloads: this.capturedMouseInteractions.asArray,
                indirectEventsPayload: this.reduceIndirectEvents(this.capturedIndirectEvents.asArray),
                indirectEventsCounters: this.indirectCounters,
                gestures: this.isValidGestures() ? this.capturedGestures.asArray : [],
                metricsData: this.stMetrics.getMetricsData(this.payloadIndex, e.SecuredTouchPointerConfig.instance.pointerParams.metricsFrequency),
                accelerometerData: this.sensors.accelerometerList,
                gyroscopeData: this.sensors.gyroscopeList,
                linearAccelerometerData: this.sensors.linearAccelerometerList,
                rotationData: this.sensors.getRotationListCopy(),
                index: this.payloadIndex,
                payloadId: _securedTouchUtils.SecuredTouchUtil.newGuid(),
                tags: e.SecuredTouchTags.instance.getTagsCopy(),
                environment: this.getEnvironmentData(),
                isMobile: _securedTouchUtils.SecuredTouchUtil.isMobile,
                usernameTs: this.sessionData.usernameTs,
                username: ""
            };
            return this.payloadIndex++,
            this.resetLists(),
            this.setUsernameToPayload(t),
            t
        }
        ,
        a.prototype.sendAllCapturedInteractions = function(t) {
            var a = this
              , r = Promise.resolve();
            return this.isEnabled() && (t || this.isAboveBufferSize() || e.SecuredTouchTags.instance.tags && e.SecuredTouchTags.instance.tags.length > 0 ? (this.clearIndirectBuffer(),
            r = this.sendInteractions(this.createInteractionsPayload())) : this.resetLists()),
            r.catch(function(e) {
                a.sendRemoteLog(_securedTouchRemoteLogger.SecuredTouchErrorCodes.QUEUE_OR_CREATE_PAYLOAD_ERROR, "failed to queue or create payload", e)
            })
        }
        ,
        a.prototype.sendInteractions = function(t) {
            var a = this;
            return this.lastPayloadTimestamp = (new Date).getTime(),
            this.dataRepository.sendInteractions(t).then(function(e) {
                e && e.checksum && a.updateChecksumAndMode(e.checksum, e.sdkMode),
                a.handleEnvelope(null === e || void 0 === e ? void 0 : e.envelope),
                a.interactionFailuresCounter = 0
            }).catch(function(t) {
                var r = _securedTouchUtils.SecuredTouchUtil.validateAndCreateError(t, "Failed to send Interactions.");
                if (_securedTouchUtils.STLogger.warn(r.errMsg, r),
                ++a.interactionFailuresCounter >= e.SecuredTouchPointerConfig.instance.pointerParams.failedInteractionThreshold) {
                    a.interactionFailuresCounter = 0;
                    var n = _securedTouchRemoteLogger.SecuredTouchErrorCodes.MISSED_INTERACTIONS_ERROR;
                    r.errCode === _securedTouchRemoteLogger.SecuredTouchErrorCodes.PARSING_ERROR && (n = _securedTouchRemoteLogger.SecuredTouchErrorCodes.PARSING_ERROR),
                    a.sendRemoteLog(n, r.errMsg, r.error)
                }
            })
        }
        ,
        a.prototype.enrichInteractionWithAdditionalData = function(e) {
            try {
                var t = e.additionalData || {};
                this.addCommonAdditionalData(t),
                this.addWidthAndHeight(t),
                t.deviceCategory = this.browserInfo.deviceCategory,
                t.snapshotsReduceFactor = this.reduceFactorManager.snapshotsReduceFactor,
                t.eventsWereReduced = this.reduceFactorManager.eventsWereReduced(),
                e.additionalData = t
            } catch (e) {
                _securedTouchUtils.STLogger.warn("Failed to enrich interactions", e)
            }
        }
        ,
        a.prototype.addWidthAndHeight = function(e) {
            e.innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            e.innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
            e.outerWidth = window.outerWidth,
            e.outerHeight = window.outerHeight
        }
        ,
        a
    }(e.SecuredTouchClientBase);
    e.SecuredTouchClient = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {}
        return t.prototype.challengeInvoked = function(a) {
            e.TagStandardization.addStandardTagWithValue(t.CONTEXT, "challenge_invoked", a)
        }
        ,
        t.prototype.challengeSuccess = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "challenge_success")
        }
        ,
        t.prototype.challengeFailed = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "challenge_failed")
        }
        ,
        t.CONTEXT = "challenge",
        t
    }();
    e.Challenge = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {}
        return t.prototype.addToCart = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "add_to_cart")
        }
        ,
        t.prototype.saveItem = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "save_item")
        }
        ,
        t.CONTEXT = "product",
        t
    }();
    e.Product = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {}
        return t.prototype.shippingAddressChanged = function(a) {
            e.TagStandardization.addObfuscatedTag(t.CONTEXT, "shipping_address_changed", a)
        }
        ,
        t.prototype.emailAddressChanged = function(a) {
            e.TagStandardization.addEmailTagInfo(t.CONTEXT, "email_changed", a)
        }
        ,
        t.prototype.notificationChanged = function(a, r) {
            var n = "notification_changed_" + (a ? "on" : "off");
            e.TagStandardization.addStandardTagWithValue(t.CONTEXT, n, r)
        }
        ,
        t.CONTEXT = "account",
        t
    }();
    e.Account = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {}
        return t.prototype.accountCreationTime = function(a) {
            e.TagStandardization.addStandardTagWithValue(t.CONTEXT, "account_creation_time", a)
        }
        ,
        t.prototype.loginAttemptEmail = function(a) {
            e.TagStandardization.addEmailTagInfo(t.CONTEXT, "login_attempt_email", a)
        }
        ,
        t.prototype.loginAttempt = function(a) {
            e.TagStandardization.addStandardTagWithValue(t.CONTEXT, "login_attempt", a)
        }
        ,
        t.prototype.loginFailed = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "login_failed")
        }
        ,
        t.CONTEXT = "login",
        t
    }();
    e.Login = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {}
        return t.prototype.purchaseAttempt = function(a) {
            e.TagStandardization.addStandardTagWithValue(t.CONTEXT, "purchase_attempt", a)
        }
        ,
        t.prototype.purchaseSuccess = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "purchase_success")
        }
        ,
        t.prototype.purchaseFailed = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "purchase_failed")
        }
        ,
        t.CONTEXT = "checkout",
        t
    }();
    e.Checkout = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {}
        return t.prototype.registrationAttemptEmail = function(a) {
            e.TagStandardization.addEmailTagInfo(t.CONTEXT, "registration_attempt_email", a)
        }
        ,
        t.prototype.registrationAttempt = function(a) {
            e.TagStandardization.addStandardTagWithValue(t.CONTEXT, "registration_attempt", a)
        }
        ,
        t.prototype.registrationSuccess = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "registration_success")
        }
        ,
        t.prototype.registrationFailed = function() {
            e.TagStandardization.addStandardTag(t.CONTEXT, "registration_failed")
        }
        ,
        t.CONTEXT = "registration",
        t
    }();
    e.Registration = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    !function(e) {
        e.FACEBOOK = "facebook",
        e.GOOGLE = "google",
        e.APPLE = "apple",
        e.TWITTER = "twitter",
        e.LINKEDIN = "linkedin"
    }(e.SocialType || (e.SocialType = {})),
    function(e) {
        e.RECAPTCHA = "recaptcha",
        e.HIDE_BILLING = "hide_billing"
    }(e.ChallengeType || (e.ChallengeType = {})),
    function(e) {
        e.PAYPAL = "paypal",
        e.CREDIT_CARD = "credit_card"
    }(e.PaymentMethod || (e.PaymentMethod = {}))
}(_securedTouchEntities || (_securedTouchEntities = {}));
var _securedTouch = function() {
    function e() {}
    return Object.defineProperty(e, "isLogEnabled", {
        get: function() {
            return _securedTouchUtils.STLogger.isLogEnabled
        },
        set: function(e) {
            _securedTouchUtils.STLogger.isLogEnabled = e
        },
        enumerable: !1,
        configurable: !0
    }),
    e.login = function(e, t) {
        return _securedTouchEntities.SecuredTouchClientBase.instance().login(e, t)
    }
    ,
    e.logout = function(e) {
        return _securedTouchEntities.SecuredTouchClientBase.instance().logout(e)
    }
    ,
    e.addTag = function(e, t) {
        return _securedTouchEntities.SecuredTouchClientBase.instance().addTag(e, t),
        this
    }
    ,
    e.setTag = function(e, t) {
        return _securedTouchEntities.SecuredTouchClientBase.instance().addTag(e, t),
        Promise.resolve()
    }
    ,
    e.setSessionId = function(e) {
        _securedTouchEntities.SecuredTouchClientBase.instance().setAppSessionId(e)
    }
    ,
    e.getSessionId = function() {
        return _securedTouchStorage.SecuredTouchSessionStorage.instance.appSessionId
    }
    ,
    e.pauseSecuredTouch = function() {
        _securedTouchEntities.SecuredTouchClientBase.instance().pauseSecuredTouch()
    }
    ,
    Object.defineProperty(e, "isRunning", {
        get: function() {
            return _securedTouchEntities.SecuredTouchClientBase.instance().isRunning()
        },
        enumerable: !1,
        configurable: !0
    }),
    e.resumeSecuredTouch = function() {
        _securedTouchEntities.SecuredTouchClientBase.instance().resumeSecuredTouch()
    }
    ,
    e.pauseBehavioralData = function() {
        _securedTouchEntities.SecuredTouchClientBase.instance().pauseBehavioralData()
    }
    ,
    e.resumeBehavioralData = function() {
        _securedTouchEntities.SecuredTouchClientBase.instance().resumeBehavioralData()
    }
    ,
    e.flush = function() {
        return _securedTouchEntities.SecuredTouchClientBase.instance().flush()
    }
    ,
    e.init = function(e) {
        return _securedTouchUtils.SecuredTouchUtil.ieFix(),
        _securedTouchEntities.SecuredTouchClientBase.instance().startST(e)
    }
    ,
    e.CHALLENGE = new _securedTouchEntities.Challenge,
    e.CHECKOUT = new _securedTouchEntities.Checkout,
    e.PRODUCT = new _securedTouchEntities.Product,
    e.LOGIN = new _securedTouchEntities.Login,
    e.ACCOUNT = new _securedTouchEntities.Account,
    e.REGISTRATION = new _securedTouchEntities.Registration,
    e.SocialType = _securedTouchEntities.SocialType,
    e.ChallengeType = _securedTouchEntities.ChallengeType,
    e.PaymentMethod = _securedTouchEntities.PaymentMethod,
    e
}();
window._securedTouch = _securedTouch;
var onDomReady = function(e) {
    "loading" !== document.readyState ? e() : document.addEventListener("DOMContentLoaded", e)
}, _securedTouchEntities, _securedTouchEntities;
onDomReady(function() {
    if (!window._securedTouchReady) {
        var e = new CustomEvent("SecuredTouchReadyEvent");
        document.dispatchEvent(e),
        window._securedTouchReady = !0
    }
}),
function(e) {
    var t = function() {
        function e() {
            this._configuration = {
                enabled: e.ENABLED_DEFAULT,
                url: e.URL_DEFAULT,
                bufferSize: e.BUFFER_SIZE_DEFAULT,
                timeoutSeconds: e.TIMEOUT_SECONDS_DEFAULT,
                maxSnapshotsCount: e.MAX_SNAPSHOTS_COUNT_DEFAULT,
                sensors: e.SENSORS_DEFAULT,
                metadataBlacklist: e.METADATA_BLACK_LIST_DEFAULT,
                tagsBlacklistRegex: e.TAGS_BLACK_LIST_REGEX_DEFAULT,
                tagsToFlushRegex: e.TAGS_TO_FLUSH_BLACK_LIST_REGEX_DEFAULT,
                remoteLogs: e.REMOTE_LOGS_DEFAULT,
                heartBeatFrequencySeconds: e.HEART_BEAT_FREQUENCY_SECONDS_DEFAULT,
                snapshotsReduceFactor: e.SNAPSHOTS_REDUCE_FACTOR_DEFAULT,
                metricsFrequency: e.METRICS_FREQUENCY_DEFAULT,
                interactionTtlSeconds: e.INTERACTION_TTL_SECONDS_DEFAULT,
                interactionsQueueSize: e.INTERACTIONS_QUEUE_SIZE_DEFAULT,
                pointerCacheTtlMinutes: e._POINTER_CACHE_TTL_MINUTES_DEFAULT,
                encryptionEnabled: e.ENCRYPTION_ENABLED_DEFAULT,
                behavioralBlacklist: e.BEHAVIORAL_BLACK_LIST_DEFAULT,
                webRtcUrl: e.WEB_RTC_URL_DEFAULT,
                eventsBlackList: e.EVENTS_BLACK_LIST_DEFAULT,
                eventsToCountList: e.EVENTS_TO_COUNT_LIST_DEFAULT,
                indirectIntervalMillis: e.INDIRECT_INTERVAL_MILLIS_DEFAULT,
                mouseIntervalMillis: e.MOUSE_INTERVAL_MILLIS_DEFAULT,
                mouseIdleTimeoutMillis: e.MOUSE_IDLE_TIMEOUT_MILLIS_DEFAULT,
                maxMouseEvents: e.MAX_MOUSE_EVENTS_DEFAULT,
                keyboardFieldBlackList: e.KEYBOARD_FIELD_BLACK_LIST_DEFAULT,
                keyboardCssSelectors: e.KEYBOARD_CSS_SELECTORS_DEFAULT,
                remoteTags: e.REMOTE_TAGS_DEFAULT,
                maxSelectorChildren: e.MAX_SELECTOR_CHILDREN_DEFAULT,
                beforeunloadEnabled: e.BEFORE_UNLOAD_ENABLED_DEFAULT,
                devtoolsEnabled: e.DEV_TOOLS_ENABLED_DEFAULT,
                eventsReduceFactorMap: e.EVENTS_REDUCE_FACTOR_MAP_DEFAULT,
                propertyDescriptors: e.PROPERTY_DESCRIPTORS_DEFAULT,
                additionalMediaCodecs: e.ADDITIONAL_MEDIA_CODECS_DEFAULT,
                sendPongOnAppSessionChange: e.SEND_PONG_ON_APP_SESSION_CHANGE_DEFAULT,
                fingerprintTimeoutMillis: e.FINGER_PRINT_TIMEOUT_MILLIS_DEFAULT,
                envelopeTtlSeconds: e.ENVELOPE_TTL_SECONDS_DEFAULT,
                firstLoad: e.FIRST_LOAD_DEFAULT,
                metadataStartedTimeoutMillis: e.METADATA_STARTED_TIMEOUT_MILLIS_DEFAULT,
                sendMetadata: e.SEND_METADATA_DEFAULT
            }
        }
        return e.prototype.updateParams = function(e) {
            e && (this._configuration = e)
        }
        ,
        Object.defineProperty(e, "POINTER_CACHE_TTL_MINUTES_DEFAULT", {
            get: function() {
                return this._POINTER_CACHE_TTL_MINUTES_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "enabled", {
            get: function() {
                return "boolean" == typeof this._configuration.enabled ? this._configuration.enabled : e.ENABLED_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "url", {
            get: function() {
                return "string" == typeof this._configuration.url ? this._configuration.url : e.URL_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "bufferSize", {
            get: function() {
                return "number" == typeof this._configuration.bufferSize && this._configuration.bufferSize > 0 ? this._configuration.bufferSize : e.BUFFER_SIZE_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "timeoutSeconds", {
            get: function() {
                return "number" == typeof this._configuration.timeoutSeconds && this._configuration.timeoutSeconds > 0 ? this._configuration.timeoutSeconds : e.TIMEOUT_SECONDS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "maxSnapshotsCount", {
            get: function() {
                return "number" == typeof this._configuration.maxSnapshotsCount && this._configuration.maxSnapshotsCount >= 0 ? this._configuration.maxSnapshotsCount : e.MAX_SNAPSHOTS_COUNT_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "maxSensorSamples", {
            get: function() {
                var t = this._configuration.sensors;
                return t && "number" == typeof t.maxSensorSamples && t.maxSensorSamples >= 0 ? t.maxSensorSamples : e.SENSORS_DEFAULT.maxSensorSamples
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "sensorsDeltaInMillis", {
            get: function() {
                var t = this._configuration.sensors;
                return t && "number" == typeof t.sensorsDeltaInMillis && t.sensorsDeltaInMillis >= 0 ? t.sensorsDeltaInMillis : e.SENSORS_DEFAULT.sensorsDeltaInMillis
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "flushFirstLoad", {
            get: function() {
                var t = this._configuration.firstLoad;
                return t && "boolean" == typeof t.flushFirstLoad ? t.flushFirstLoad : e.FIRST_LOAD_DEFAULT.flushFirstLoad
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "firstLoadExpirationTimeMillis", {
            get: function() {
                var t = this._configuration.firstLoad;
                return t && "number" == typeof t.firstLoadExpirationTimeMillis && t.firstLoadExpirationTimeMillis >= 0 ? t.firstLoadExpirationTimeMillis : e.FIRST_LOAD_DEFAULT.firstLoadExpirationTimeMillis
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "metadataBlackList", {
            get: function() {
                return _securedTouchUtils.SecuredTouchUtil.isArray(this._configuration.metadataBlacklist) && (this._configuration.metadataBlacklist = new Set(this._configuration.metadataBlacklist)),
                this._configuration.metadataBlacklist instanceof Set ? this._configuration.metadataBlacklist : e.METADATA_BLACK_LIST_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "behavioralBlacklist", {
            get: function() {
                return this._configuration.behavioralBlacklist ? this._configuration.behavioralBlacklist : e.BEHAVIORAL_BLACK_LIST_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "tagsBlacklistRegex", {
            get: function() {
                return "string" == typeof this._configuration.tagsBlacklistRegex ? this._configuration.tagsBlacklistRegex : e.TAGS_BLACK_LIST_REGEX_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "tagsToFlushRegex", {
            get: function() {
                return "string" == typeof this._configuration.tagsToFlushRegex ? this._configuration.tagsToFlushRegex : e.TAGS_TO_FLUSH_BLACK_LIST_REGEX_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "remoteLogs", {
            get: function() {
                return {
                    enabled: this.remoteLogsEnabled,
                    failedInteractionThreshold: this.failedInteractionThreshold,
                    maxRemoteLogs: this.maxRemoteLogs
                }
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "remoteLogsEnabled", {
            get: function() {
                var t = this._configuration.remoteLogs;
                return t && "boolean" == typeof t.enabled ? t.enabled : e.REMOTE_LOGS_DEFAULT.enabled
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "maxRemoteLogs", {
            get: function() {
                var t = this._configuration.remoteLogs;
                return t && "number" == typeof t.maxRemoteLogs && t.maxRemoteLogs >= 0 ? t.maxRemoteLogs : e.REMOTE_LOGS_DEFAULT.maxRemoteLogs
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "failedInteractionThreshold", {
            get: function() {
                var t = this._configuration.remoteLogs;
                return t && "number" == typeof t.failedInteractionThreshold && t.failedInteractionThreshold > 0 ? t.failedInteractionThreshold : e.REMOTE_LOGS_DEFAULT.failedInteractionThreshold
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "heartBeatFrequencySeconds", {
            get: function() {
                return "number" == typeof this._configuration.heartBeatFrequencySeconds && this._configuration.heartBeatFrequencySeconds > 0 ? this._configuration.heartBeatFrequencySeconds : e.HEART_BEAT_FREQUENCY_SECONDS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "snapshotsReduceFactor", {
            get: function() {
                return "number" == typeof this._configuration.snapshotsReduceFactor && this._configuration.snapshotsReduceFactor >= 0 ? this._configuration.snapshotsReduceFactor : e.SNAPSHOTS_REDUCE_FACTOR_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "metricsFrequency", {
            get: function() {
                return "number" == typeof this._configuration.metricsFrequency && this._configuration.metricsFrequency > 0 ? this._configuration.metricsFrequency : e.METRICS_FREQUENCY_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "interactionTtlSeconds", {
            get: function() {
                return "number" == typeof this._configuration.interactionTtlSeconds && this._configuration.interactionTtlSeconds > 0 ? this._configuration.interactionTtlSeconds : e.INTERACTION_TTL_SECONDS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "interactionsQueueSize", {
            get: function() {
                return "number" == typeof this._configuration.interactionsQueueSize && this._configuration.interactionsQueueSize > 0 ? this._configuration.interactionsQueueSize : e.INTERACTIONS_QUEUE_SIZE_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "pointerCacheTtlMinutes", {
            get: function() {
                return "number" == typeof this._configuration.pointerCacheTtlMinutes && this._configuration.pointerCacheTtlMinutes > 0 ? this._configuration.pointerCacheTtlMinutes : e._POINTER_CACHE_TTL_MINUTES_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "encryptionEnabled", {
            get: function() {
                return "boolean" == typeof this._configuration.encryptionEnabled ? this._configuration.encryptionEnabled : e.ENCRYPTION_ENABLED_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "webRtcUrl", {
            get: function() {
                return "string" == typeof this._configuration.webRtcUrl ? this._configuration.webRtcUrl : e.WEB_RTC_URL_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "eventsBlackList", {
            get: function() {
                return _securedTouchUtils.SecuredTouchUtil.isArray(this._configuration.eventsBlackList) && (this._configuration.eventsBlackList = new Set(this._configuration.eventsBlackList)),
                this._configuration.eventsBlackList instanceof Set ? this._configuration.eventsBlackList : e.EVENTS_BLACK_LIST_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "eventsToCountList", {
            get: function() {
                return _securedTouchUtils.SecuredTouchUtil.isArray(this._configuration.eventsToCountList) && (this._configuration.eventsToCountList = new Set(this._configuration.eventsToCountList)),
                this._configuration.eventsToCountList instanceof Set ? this._configuration.eventsToCountList : e.EVENTS_TO_COUNT_LIST_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "indirectIntervalMillis", {
            get: function() {
                return "number" == typeof this._configuration.indirectIntervalMillis && this._configuration.indirectIntervalMillis > 0 ? this._configuration.indirectIntervalMillis : e.INDIRECT_INTERVAL_MILLIS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "mouseIntervalMillis", {
            get: function() {
                return "number" == typeof this._configuration.mouseIntervalMillis && this._configuration.mouseIntervalMillis > 0 ? this._configuration.mouseIntervalMillis : e.MOUSE_INTERVAL_MILLIS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "mouseIdleTimeoutMillis", {
            get: function() {
                return "number" == typeof this._configuration.mouseIdleTimeoutMillis && this._configuration.mouseIdleTimeoutMillis > 0 ? this._configuration.mouseIdleTimeoutMillis : e.MOUSE_IDLE_TIMEOUT_MILLIS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "maxMouseEvents", {
            get: function() {
                return "number" == typeof this._configuration.maxMouseEvents && this._configuration.maxMouseEvents >= 0 ? this._configuration.maxMouseEvents : e.MAX_MOUSE_EVENTS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "keyboardFieldBlackList", {
            get: function() {
                return _securedTouchUtils.SecuredTouchUtil.isArray(this._configuration.keyboardFieldBlackList) && (this._configuration.keyboardFieldBlackList = new Set(this._configuration.keyboardFieldBlackList)),
                this._configuration.keyboardFieldBlackList instanceof Set ? this._configuration.keyboardFieldBlackList : e.KEYBOARD_FIELD_BLACK_LIST_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "keyboardCssSelectors", {
            get: function() {
                return this._configuration.keyboardCssSelectors ? this._configuration.keyboardCssSelectors : e.KEYBOARD_CSS_SELECTORS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "remoteTags", {
            get: function() {
                return this._configuration.remoteTags ? this._configuration.remoteTags : e.REMOTE_TAGS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "maxSelectorChildren", {
            get: function() {
                return "number" == typeof this._configuration.maxSelectorChildren && this._configuration.maxSelectorChildren > 0 ? this._configuration.maxSelectorChildren : e.MAX_SELECTOR_CHILDREN_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "beforeunloadEnabled", {
            get: function() {
                return "boolean" == typeof this._configuration.beforeunloadEnabled ? this._configuration.beforeunloadEnabled : e.BEFORE_UNLOAD_ENABLED_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "devtoolsEnabled", {
            get: function() {
                return "boolean" == typeof this._configuration.devtoolsEnabled ? this._configuration.devtoolsEnabled : e.DEV_TOOLS_ENABLED_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "eventsReduceFactorMap", {
            get: function() {
                return this._configuration.eventsReduceFactorMap ? this._configuration.eventsReduceFactorMap : e.EVENTS_REDUCE_FACTOR_MAP_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "propertyDescriptors", {
            get: function() {
                return this._configuration.propertyDescriptors ? this._configuration.propertyDescriptors : e.PROPERTY_DESCRIPTORS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "additionalMediaCodecs", {
            get: function() {
                return this._configuration.additionalMediaCodecs ? this._configuration.additionalMediaCodecs : e.ADDITIONAL_MEDIA_CODECS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "sendPongOnAppSessionChange", {
            get: function() {
                return "boolean" == typeof this._configuration.sendPongOnAppSessionChange ? this._configuration.sendPongOnAppSessionChange : e.SEND_PONG_ON_APP_SESSION_CHANGE_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "fingerprintTimeoutMillis", {
            get: function() {
                return "number" == typeof this._configuration.fingerprintTimeoutMillis && this._configuration.fingerprintTimeoutMillis > 0 ? this._configuration.fingerprintTimeoutMillis : e.FINGER_PRINT_TIMEOUT_MILLIS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "envelopeTtlSeconds", {
            get: function() {
                return "number" == typeof this._configuration.envelopeTtlSeconds && this._configuration.envelopeTtlSeconds > 0 ? this._configuration.envelopeTtlSeconds : e.ENVELOPE_TTL_SECONDS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "metadataStartedTimeoutMillis", {
            get: function() {
                return "number" == typeof this._configuration.metadataStartedTimeoutMillis && this._configuration.metadataStartedTimeoutMillis >= 0 ? this._configuration.metadataStartedTimeoutMillis : e.METADATA_STARTED_TIMEOUT_MILLIS_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "sendMetadata", {
            get: function() {
                return "boolean" == typeof this._configuration.sendMetadata ? this._configuration.sendMetadata : e.SEND_METADATA_DEFAULT
            },
            enumerable: !1,
            configurable: !0
        }),
        e._POINTER_CACHE_TTL_MINUTES_DEFAULT = 10080,
        e.URL_DEFAULT = "",
        e.ENABLED_DEFAULT = !0,
        e.BUFFER_SIZE_DEFAULT = 4,
        e.TIMEOUT_SECONDS_DEFAULT = 10,
        e.MAX_SNAPSHOTS_COUNT_DEFAULT = 500,
        e.METADATA_BLACK_LIST_DEFAULT = new Set,
        e.TAGS_BLACK_LIST_REGEX_DEFAULT = "",
        e.TAGS_TO_FLUSH_BLACK_LIST_REGEX_DEFAULT = "",
        e.BEHAVIORAL_BLACK_LIST_DEFAULT = {},
        e.HEART_BEAT_FREQUENCY_SECONDS_DEFAULT = 600,
        e.SNAPSHOTS_REDUCE_FACTOR_DEFAULT = 0,
        e.METRICS_FREQUENCY_DEFAULT = 5,
        e.INTERACTION_TTL_SECONDS_DEFAULT = 300,
        e.INTERACTIONS_QUEUE_SIZE_DEFAULT = 10,
        e.ENCRYPTION_ENABLED_DEFAULT = !0,
        e.WEB_RTC_URL_DEFAULT = "",
        e.EVENTS_BLACK_LIST_DEFAULT = new Set,
        e.EVENTS_TO_COUNT_LIST_DEFAULT = new Set,
        e.INDIRECT_INTERVAL_MILLIS_DEFAULT = 3e3,
        e.MOUSE_INTERVAL_MILLIS_DEFAULT = 1e3,
        e.MOUSE_IDLE_TIMEOUT_MILLIS_DEFAULT = 1e3,
        e.MAX_MOUSE_EVENTS_DEFAULT = 500,
        e.KEYBOARD_FIELD_BLACK_LIST_DEFAULT = new Set,
        e.KEYBOARD_CSS_SELECTORS_DEFAULT = {},
        e.REMOTE_TAGS_DEFAULT = {},
        e.MAX_SELECTOR_CHILDREN_DEFAULT = 2,
        e.BEFORE_UNLOAD_ENABLED_DEFAULT = !1,
        e.DEV_TOOLS_ENABLED_DEFAULT = !0,
        e.EVENTS_REDUCE_FACTOR_MAP_DEFAULT = {},
        e.PROPERTY_DESCRIPTORS_DEFAULT = {},
        e.ADDITIONAL_MEDIA_CODECS_DEFAULT = {},
        e.SEND_PONG_ON_APP_SESSION_CHANGE_DEFAULT = !0,
        e.FINGER_PRINT_TIMEOUT_MILLIS_DEFAULT = 3e3,
        e.ENVELOPE_TTL_SECONDS_DEFAULT = 900,
        e.METADATA_STARTED_TIMEOUT_MILLIS_DEFAULT = 2e3,
        e.SEND_METADATA_DEFAULT = !0,
        e.FIRST_LOAD_DEFAULT = {
            flushFirstLoad: !1,
            firstLoadExpirationTimeMillis: 9e5
        },
        e.SENSORS_DEFAULT = {
            maxSensorSamples: 1,
            sensorsDeltaInMillis: 0
        },
        e.REMOTE_LOGS_DEFAULT = {
            enabled: !0,
            failedInteractionThreshold: 5,
            maxRemoteLogs: 2
        },
        e
    }();
    e.SecuredTouchPointerParams = t
}(_securedTouchEntities || (_securedTouchEntities = {})),
function(e) {
    var t = function() {
        function t() {}
        return t.trimmed = function(e) {
            return null == e ? "" : String(e).trim()
        }
        ,
        t.addStandardTag = function(t, a) {
            e.SecuredTouchClientBase.instance().addTag(t + "." + a)
        }
        ,
        t.addStandardTagWithValue = function(t, a, r) {
            (r = this.trimmed(r)) ? e.SecuredTouchClientBase.instance().addTag(t + "." + a, r) : _securedTouchUtils.STLogger.error("got an empty string argument")
        }
        ,
        t.addObfuscatedTag = function(t, a, r) {
            (r = this.trimmed(r)) ? e.SecuredTouchClientBase.instance().addTag(t + "." + a + "_hash", String(_securedTouchUtils.SecuredTouchUtil.mod(r, 1e3))) : _securedTouchUtils.STLogger.error("got an empty string argument")
        }
        ,
        t.addEmailTagInfo = function(t, a, r) {
            if (r = this.trimmed(r)) {
                e.SecuredTouchClientBase.instance().addTag(t + "." + a + "_hash", String(_securedTouchUtils.SecuredTouchUtil.mod(r, 1e3)));
                var n = _securedTouchUtils.SecuredTouchUtil.getEmailDomain(r);
                n && e.SecuredTouchClientBase.instance().addTag(t + "." + a + "_domain", n)
            } else
                _securedTouchUtils.STLogger.error("got an empty email argument")
        }
        ,
        t
    }();
    e.TagStandardization = t
}(_securedTouchEntities || (_securedTouchEntities = {}));

// SECUREDTOUCH INC. 
// � ALL RIGHTS RESERVED 
//Build: 36  Sun Sep 26 2021 09:48:34 GMT+0000 (Coordinated Universal Time) 
