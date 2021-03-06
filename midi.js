!function(e) {
    function n() {
        var e, n, t, r = navigator.userAgent, o = navigator.appName, a = "" + parseFloat(navigator.appVersion), i = parseInt(navigator.appVersion, 10);
        (n = r.indexOf("Opera")) != -1 ? (o = "Opera",
        a = r.substring(n + 6),
        (n = r.indexOf("Version")) != -1 && (a = r.substring(n + 8))) : (n = r.indexOf("MSIE")) != -1 ? (o = "Microsoft Internet Explorer",
        a = r.substring(n + 5)) : (n = r.indexOf("Trident")) != -1 ? (o = "Microsoft Internet Explorer",
        a = (n = r.indexOf("rv:")) != -1 ? r.substring(n + 3) : "0.0") : (n = r.indexOf("Chrome")) != -1 ? (o = "Chrome",
        a = r.substring(n + 7)) : (n = r.indexOf("Android")) != -1 ? (o = "Android",
        a = r.substring(n + 8)) : (n = r.indexOf("Safari")) != -1 ? (o = "Safari",
        a = r.substring(n + 7),
        (n = r.indexOf("Version")) != -1 && (a = r.substring(n + 8))) : (n = r.indexOf("Firefox")) != -1 ? (o = "Firefox",
        a = r.substring(n + 8)) : (e = r.lastIndexOf(" ") + 1) < (n = r.lastIndexOf("/")) && (o = r.substring(e, n),
        a = r.substring(n + 1),
        o.toLowerCase() == o.toUpperCase() && (o = navigator.appName)),
        (t = a.indexOf(";")) != -1 && (a = a.substring(0, t)),
        (t = a.indexOf(" ")) != -1 && (a = a.substring(0, t)),
        i = parseInt("" + a, 10),
        isNaN(i) && (a = "" + parseFloat(navigator.appVersion),
        i = parseInt(navigator.appVersion, 10));
        var s = new Object;
        return s.browserName = o,
        s.fullVersion = a,
        s.majorVersion = i,
        s.appName = navigator.appName,
        s.userAgent = navigator.userAgent,
        s.platform = navigator.platform,
        s
    }
    function t(e, n) {
        var t = document.getElementsByTagName("script")[0]
          , r = document.createElement("script");
        r.onreadystatechange = function() {
            "loaded" !== r.readyState && "complete" !== r.readyState || (r.onreadystatechange = null,
            n())
        }
        ,
        r.onload = function() {
            n()
        }
        ,
        r.onerror = function() {
            x("Error: Cannot load  JavaScript file " + e)
        }
        ,
        r.src = e,
        r.type = "text/javascript",
        t.parentNode.insertBefore(r, t)
    }
    function r(e) {
        if (F = Module.ccall("mid_song_read_wave", "number", ["number", "number", "number", "number"], [H, C, 2 * B, G]),
        0 == F)
            return void p();
        for (var n = Math.pow(2, 15), t = 0; t < B; t++)
            t < F ? e.outputBuffer.getChannelData(0)[t] = Module.getValue(C + 2 * t, "i16") / n : e.outputBuffer.getChannelData(0)[t] = 0;
        0 == q && (q = N.currentTime)
    }
    function o(e, n, t) {
        var o = new XMLHttpRequest;
        o.open("GET", n + t, !0),
        o.responseType = "arraybuffer",
        o.onerror = function() {
            x("Error: Cannot retrieve patch file " + n + t)
        }
        ,
        o.onload = function() {
            if (200 != o.status)
                return void x("Error: Cannot retrieve patch file " + n + t + " : " + o.status);
            if (R--,
            FS.createDataFile("pat/", t, new Int8Array(o.response), !0, !0),
            MIDIjs.message_callback && R > 0 && MIDIjs.message_callback("Instruments to be loaded: " + R),
            x("Instruments to be loaded: " + R),
            0 == R) {
                var a = Module.ccall("mid_istream_open_mem", "number", ["number", "number", "number"], [O, E.length, !1])
                  , s = 32784
                  , u = Module.ccall("mid_create_options", "number", ["number", "number", "number", "number"], [N.sampleRate, s, 1, 2 * B]);
                H = Module.ccall("mid_song_load", "number", ["number", "number"], [a, u]);
                Module.ccall("mid_istream_close", "number", ["number"], [a]);
                Module.ccall("mid_song_start", "void", ["number"], [H]),
                S = N.createScriptProcessor(B, 0, 1),
                C = Module._malloc(2 * B),
                S.onaudioprocess = r,
                S.connect(N.destination),
                P = setInterval(i, U),
                MIDIjs.message_callback && MIDIjs.message_callback("Playing: " + e),
                x("Playing: " + e + " ...")
            }
        }
        ,
        o.send()
    }
    function a(e) {
        var n = new XMLHttpRequest;
        n.open("GET", e, !0),
        n.responseType = "arraybuffer",
        n.onerror = function() {
            x("Error: Cannot preload file " + e)
        }
        ,
        n.onload = function() {
            if (200 != n.status)
                return void x("Error: Cannot preload file " + e + " : " + n.status)
        }
        ,
        n.send()
    }
    function i() {
        var e = new Object;
        0 != q ? e.time = N.currentTime - q : e.time = 0,
        MIDIjs.player_callback && MIDIjs.player_callback(e)
    }
    function s() {
        N && N.suspend()
    }
    function u() {
        return N ? N.resume() : (window.AudioContext = window.AudioContext || window.webkitAudioContext,
        N = new AudioContext,
        N.resume())
    }
    function l(e) {
        g(),
        G = !1,
        B = V,
        c(e)
    }
    function c(e) {
        u().then(d(e))
    }
    function d(e) {
        q = 0,
        i();
        for (var n = 0; n < document.scripts.length; n++) {
            var r = document.scripts[n].src;
            if (T == r)
                return void m(e)
        }
        x("Loading libtimidity ... "),
        t(T, function() {
            m(e)
        })
    }
    function m(e) {
        if (-1 != e.indexOf("data:")) {
            var n = e.indexOf(",") + 1
              , t = atob(e.substring(n));
            E = new Uint8Array(new ArrayBuffer(t.length));
            for (var r = 0; r < t.length; r++)
                E[r] = t.charCodeAt(r);
            return void f("data:audio/x-midi ...", E)
        }
        x("Loading MIDI file " + e + " ..."),
        MIDIjs.message_callback("Loading MIDI file " + e + " ...");
        var o = new XMLHttpRequest;
        o.open("GET", e, !0),
        o.responseType = "arraybuffer",
        o.onerror = function() {
            x("Error: Cannot retrieve MIDI file " + e)
        }
        ,
        o.onload = function() {
            return 200 != o.status ? void x("Error: Cannot retrieve MIDI file " + e + " : " + o.status) : (x("MIDI file loaded: " + e),
            E = new Int8Array(o.response),
            void f(e, E))
        }
        ,
        o.send()
    }
    function f(e, n) {
        O = Module._malloc(n.length),
        Module.writeArrayToMemory(n, O);
        var t = Module.ccall("mid_init", "number", [], [])
          , a = Module.ccall("mid_istream_open_mem", "number", ["number", "number", "number"], [O, n.length, !1])
          , s = 32784
          , u = Module.ccall("mid_create_options", "number", ["number", "number", "number", "number"], [N.sampleRate, s, 1, 2 * B]);
        if (H = Module.ccall("mid_song_load", "number", ["number", "number"], [a, u]),
        t = Module.ccall("mid_istream_close", "number", ["number"], [a]),
        R = Module.ccall("mid_song_get_num_missing_instruments", "number", ["number"], [H]),
        0 < R)
            for (var l = 0; l < R; l++) {
                var c = Module.ccall("mid_song_get_missing_instrument", "string", ["number", "number"], [H, l]);
                o(e, W + "pat/", c)
            }
        else
            Module.ccall("mid_song_start", "void", ["number"], [H]),
            S = N.createScriptProcessor(B, 0, 1),
            C = Module._malloc(2 * B),
            S.onaudioprocess = r,
            S.connect(N.destination),
            P = setInterval(i, U),
            MIDIjs.message_callback && MIDIjs.message_callback("Playing: " + e),
            x("Playing: " + e + " ...")
    }
    function b(e, n, t) {
        G || (G = !0,
        B = L,
        c(W + "../midi/initsynth.midi")),
        0 != H && Module.ccall("mid_song_note_on", "void", ["number", "number", "number", "number"], [H, e, n, t])
    }
    function I() {
        MIDIjs.noteOn(0, 60, 0)
    }
    function p() {
        S && (S.disconnect(),
        S.onaudioprocess = 0,
        S = 0),
        H && (Module._free(C),
        Module._free(O),
        Module.ccall("mid_song_free", "void", ["number"], [H]),
        Module.ccall("mid_exit", "void", [], []),
        H = 0)
    }
    function g() {
        p(),
        clearInterval(P),
        x(z)
    }
    function M(e) {
        return "undefined" == typeof k && (k = document.createElement("a")),
        k.href = e,
        k.href
    }
    function v(e) {
        if (e.indexOf("http:") != -1)
            return e;
        var n = M(e)
          , t = n.replace("https:", "http:");
        return t
    }
    function _() {
        var e = new Object;
        0 == q && (q = (new Date).getTime()),
        e.time = ((new Date).getTime() - q) / 1e3,
        MIDIjs.player_callback && MIDIjs.player_callback(e)
    }
    function j(e) {
        D(),
        url = v(e);
        var n = document.getElementById("scorioMIDI");
        n ? n.lastChild.setAttribute("src", url) : (n = document.createElement("div"),
        n.setAttribute("id", "scorioMIDI"),
        n.innerHTML = '&nbsp;<bgsound src="' + url + '" volume="0"/>',
        document.body && document.body.appendChild(n)),
        P = setInterval(_, U),
        q = 0,
        S = n,
        x("Playing " + url + " ...")
    }
    function D() {
        if (S) {
            var e = S;
            e.lastChild.setAttribute("src", v(W) + "silence.mid"),
            clearInterval(P),
            S = 0
        }
        x(z)
    }
    function y(e) {
        h();
        var n = document.getElementById("scorioMIDI");
        n ? n.lastChild.setAttribute("data", e) : (n = document.createElement("div"),
        n.setAttribute("id", "scorioMIDI"),
        n.innerHTML = '<object data="' + e + '" autostart="true" volume="0" type="audio/mid"></object>',
        document.body && document.body.appendChild(n)),
        P = setInterval(_, U),
        q = 0,
        S = n,
        x("Playing " + e + " ...")
    }
    function h() {
        if (S) {
            var e = S;
            e.parentNode.removeChild(e),
            clearInterval(P),
            S = 0
        }
        x(z)
    }
    function w() {
        for (var e = 0; e < document.scripts.length; e++) {
            var n = document.scripts[e].src
              , t = n.lastIndexOf("/midi.js");
            if (t == n.length - 8)
                return n.substr(0, t + 1)
        }
        return null
    }
    function x(e) {
        X && console.log(e)
    }
    try {
        e.MIDIjs = new Object,
        e.MIDIjs.initError = "initializing ...";
        var A, C, O, E, T, k, P, N = null, S = 0, L = 512, V = 8192, B = V, R = 0, F = 0, H = 0, W = "", q = 0, z = "", G = !1, X = !1, U = 100;
        W = w(),
        T = W + "libtimidity.js";
        var J = n();
        try {
            ("iPhone" == J.platform || "iPod" == J.platform || "iPad" == J.platform) && J.majorVersion <= 6 ? A = "none" : (window.AudioContext = window.AudioContext || window.webkitAudioContext,
            N = new AudioContext,
            A = "WebAudioAPI")
        } catch (K) {
            A = "Microsoft Internet Explorer" == J.browserName ? "bgsound" : "Android" == J.browserName ? "none" : "object"
        }
        e.MIDIjs.set_logging = function(e) {
            X = e
        }
        ,
        e.MIDIjs.get_loggging = function() {
            return X
        }
        ,
        e.MIDIjs.player_callback = function(e) {}
        ,
        e.MIDIjs.message_callback = function(e) {}
        ,
        e.MIDIjs.get_audio_status = function() {
            return z
        }
        ,
        e.MIDIjs.pause = s,
        e.MIDIjs.resume = u,
        e.MIDIjs.resumeWebAudioContext = u,
        "WebAudioAPI" == A ? (t(T, function() {}),
        e.MIDIjs.play = l,
        e.MIDIjs.stop = g,
        z = "audioMethod: WebAudioAPI, sampleRate (Hz): " + N.sampleRate + ", audioBufferSize (Byte): " + B,
        e.MIDIjs.noteOn = b,
        e.MIDIjs.startSynth = I) : "bgsound" == A ? (e.MIDIjs.play = j,
        e.MIDIjs.stop = D,
        z = "audioMethod: &lt;bgsound&gt;") : "object" == A ? (e.MIDIjs.play = y,
        e.MIDIjs.stop = h,
        z = "audioMethod: &lt;object&gt;") : (e.MIDIjs.play = function(e) {}
        ,
        e.MIDIjs.stop = function(e) {}
        ,
        z = "audioMethod: No method found"),
        "Microsoft Internet Explorer" == J.browserName && "https:" == location.protocol.toLowerCase() && setTimeout(function() {
            j(v(W) + "silence.mid"),
            clearInterval(P)
        }, 1),
        -1 == location.href.indexOf("scorio.com") && -1 == location.href.indexOf("weblily.net") && -1 == location.href.indexOf("local") || "WebAudioAPI" == A && (a(W + "pat/arachno-127.pat"),
        a(W + "pat/MT32Drums/mt32drum-41.pat"),
        a(T)),
        e.MIDIjs.initError = null
    } catch (Q) {
        e.MIDIjs = new Object,
        e.MIDIjs.initError = Q
    }
}(this);
//# sourceMappingURL=/lib/midi.js.map
