/* NEXIOS TV patch: logo backdrop, focus plate, device dashboard, new channels, YouTube fallback for old WebViews.
   Loaded after the main page script. Does nothing on pages that are not the NEXIOS home build. */
(function () {
  if (!(window.setHero && window.ftHtml && window.SC && window.loadStream && window.CH)) return;

  /* ---------- 1. channels (edit the URLs here) ---------- */
  var STREAMS = {
    f1: "https://thedaddy.li/stream/stream-60.php",
    skyplus: "https://thedaddy.li/stream/stream-60.php",
    skycricket: "https://thedaddy.li/stream/stream-60.php"
  };
  var PIPED = ["https://pipedapi.kavin.rocks", "https://pipedapi.adminforge.de", "https://api.piped.private.coffee"];
  var c1 = byId(1); if (c1) c1.url = STREAMS.f1;
  if (!byId(16)) CH.push({ id: 16, name: "SKY Plus", category: "Entertainment", url: STREAMS.skyplus });
  if (!byId(17)) CH.push({ id: 17, name: "Sky Cricket", category: "Live Match", url: STREAMS.skycricket });
  LG[16] = ["#0072c9", "#003a73", "#fff", "SKY", "PLUS"];
  LG[17] = ["#0b8a4a", "#04381d", "#fff", "SKY", "CRICKET"];

  /* ---------- 2. look ---------- */
  var css = [
    "#stage{background:#06070d}",
    "@-webkit-keyframes kb{from{-webkit-transform:scale(1)}to{-webkit-transform:scale(1.08)}}@keyframes kb{from{transform:scale(1)}to{transform:scale(1.08)}}",
    ".hb .bgw{position:absolute;left:0;top:0;width:1280px;height:720px;overflow:hidden}",
    ".hb .bgt{position:absolute;right:-30px;top:-30px;font-size:400px;font-weight:900;letter-spacing:-12px;line-height:1;white-space:nowrap;opacity:.1}",
    ".hb .bgi{position:absolute;right:30px;top:20px;width:760px;height:430px;object-fit:contain;opacity:.17;-webkit-filter:grayscale(1) invert(1);filter:grayscale(1) invert(1);mix-blend-mode:screen}",
    ".hb .bgb{position:absolute;left:0;top:0;width:1280px;height:720px;object-fit:cover;opacity:.42;-webkit-animation:kb 16s ease-in-out infinite alternate;animation:kb 16s ease-in-out infinite alternate}",
    "#mask{background:linear-gradient(rgba(6,7,13,.5) 0%,rgba(6,7,13,.3) 30%,rgba(6,7,13,.82) 62%,#06070d 88%)}",
    ".tl.ft{width:400px;margin-right:20px}.ft .tn{font-size:19px}",
    "#fp{position:absolute;left:900px;top:92px;width:340px;-webkit-animation:fadeIn .4s;animation:fadeIn .4s}",
    ".fpl{width:340px;height:191px;border-radius:20px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.28),0 24px 54px rgba(0,0,0,.65),0 0 46px var(--ac)}",
    ".fpn{margin-top:16px;font-size:26px;font-weight:800;letter-spacing:-.4px;white-space:nowrap;overflow:hidden}",
    ".fpm{margin-top:10px;font-size:0;white-space:nowrap;overflow:hidden}",
    ".st:before{content:'';display:inline-block;width:5px;height:20px;margin-right:12px;border-radius:3px;background:var(--ac);vertical-align:-3px}",
    "#tnav{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:3px 6px;left:176px;top:5px}",
    ".tl.f .tp{box-shadow:0 0 0 3px #fff,0 0 30px var(--ac),0 26px 50px rgba(0,0,0,.7)}",
    /* device dashboard */
    "#panel{right:40px;top:76px;width:880px;padding:20px 12px 6px;border-radius:26px;background:rgba(12,14,28,.97)}",
    "#panel>h4,#panel>.pr{display:none}",
    "#dp:after{content:'';display:block;clear:both}",
    ".dc{float:left;width:270px;height:188px;margin:0 8px 14px;padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.07);box-sizing:border-box;overflow:hidden}",
    ".dt{font-size:12px;font-weight:700;letter-spacing:2px;color:#8a93b6}",
    ".dv{margin-top:6px;font-size:30px;font-weight:800;letter-spacing:-.5px;white-space:nowrap;overflow:hidden}",
    ".ds{font-size:14px;color:var(--ac);font-weight:600;height:20px;overflow:hidden;white-space:nowrap}",
    ".dl{margin-top:6px}.dl div{height:23px;line-height:23px;font-size:14px;overflow:hidden;white-space:nowrap}",
    ".dl span{color:#8a93b6}.dl b{float:right;font-weight:600;color:#fff;max-width:160px;overflow:hidden;text-overflow:ellipsis}",
    ".dsp{display:block;width:100%;height:30px;margin-top:4px;color:var(--ac)}",
    ".db{height:6px;margin-top:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden}.db i{display:block;height:100%;border-radius:3px}"
  ].join("\n");
  var st = document.createElement("style"); st.innerHTML = css; document.head.appendChild(st);

  var fp = document.createElement("div"); fp.id = "fp"; $("shin").appendChild(fp);
  function fpHtml(c) {
    return '<div class="fpl">' + logo(c, 340, 191, 58) + '</div><div class="fpn">' + c.name + '</div><div class="fpm"><span class="chip live"><i></i>LIVE</span><span class="chip">CH ' + chNo(c) + '</span><span class="chip">' + c.category + "</span></div>";
  }
  window.setHero = function (c) {
    if (!c || c.id === heroId) return; heroId = c.id;
    var g = LG[c.id] || ["#445566", "#111", "#fff", c.name.toUpperCase(), ""], n = hbSel ^ 1, a = $("hb" + n), b = $("hb" + hbSel);
    var lu = c.logo || (window.LOGOS && LOGOS[c.id]), bn = bannerOf(c), h = '<div class="bgw">';
    if (bn) h += '<img class="bgb" referrerpolicy="no-referrer" src="' + bn + '" onerror="this.style.display=\'none\'">';
    h += '<div class="bgt" style="color:' + g[0] + '">' + g[3] + "</div>";
    if (lu) h += '<img class="bgi" referrerpolicy="no-referrer" src="' + lu + '" onerror="this.style.display=\'none\'">';
    a.innerHTML = h + "</div>"; a.style.background = "#06070d";
    a.className = "hb on"; b.className = "hb"; hbSel = n; setAccent(c);
    fp.innerHTML = fpHtml(c);
  };
  window.ftHtml = function () {
    var l = byId(parseInt(LS.get("tvx_last"), 10)), a = l || byId(1) || CH[0], b = (a.id === 1 ? byId(3) : byId(1)) || CH[1] || a, L = [a, b], o = "", i, c;
    for (i = 0; i < 2; i++) { c = L[i]; o += '<div class="fx tl ft" data-r="1" data-c="' + i + '" data-k="ft:' + c.id + '" data-a="ch:' + c.id + '" data-ch="' + c.id + '"><div class="tp" style="width:400px;height:225px">' + logo(c, 400, 225, 70) + bannerHtml(c, 120, 68, 18) + '<span class="lv">' + (c === l ? "RESUME" : "LIVE") + '</span></div><div class="tn">' + c.name + "<small>CH " + chNo(c) + " &middot; " + c.category + "</small></div></div>"; }
    return o;
  };

  /* ---------- 3. device dashboard ---------- */
  var pings = [], fps = 0, sto = null, spd = null, spdT = 0, dpT = 0, tk = 0, upT = new Date(), gpuN = null;
  var LEGACY = (function () { try { new Function("return 1?.a"); return false; } catch (e) { return true; } })();
  function ua() {
    var u = navigator.userAgent, m;
    return { and: (m = u.match(/Android ([\d.]+)/)) ? m[1] : "", chr: (m = u.match(/Chrome\/(\d+)/)) ? +m[1] : 0, mod: (m = u.match(/;\s*([^;)]+?)\s+Build\//)) ? m[1] : "" };
  }
  function qual(n) { return n < 80 ? "Excellent" : n < 160 ? "Good" : n < 320 ? "Fair" : "Poor"; }
  function bar(p, col) { p = Math.max(0, Math.min(100, p)); return '<div class="db"><i style="width:' + p + "%;background:" + (col || "var(--ac)") + '"></i></div>'; }
  function spark() {
    var w = 238, h = 30, m = 100, i, p = [];
    if (pings.length < 2) return '<div class="dsp"></div>';
    for (i = 0; i < pings.length; i++) if (pings[i] > m) m = pings[i];
    for (i = 0; i < pings.length; i++) p.push(Math.round(i * w / (pings.length - 1)) + "," + Math.round(h - 2 - pings[i] / m * (h - 4)));
    return '<svg class="dsp" viewBox="0 0 ' + w + " " + h + '"><polyline points="' + p.join(" ") + '" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  }
  function ln(k, v) { return "<div><span>" + k + "</span><b>" + v + "</b></div>"; }
  function card(t, big, sub, lines, extra) { return '<div class="dc"><div class="dt">' + t + '</div><div class="dv">' + big + '</div><div class="ds">' + sub + "</div>" + (extra || "") + '<div class="dl">' + lines + "</div></div>"; }
  function gpu() {
    if (gpuN !== null) return gpuN; gpuN = "-";
    try { var cv = document.createElement("canvas"), gl = cv.getContext("webgl") || cv.getContext("experimental-webgl"), x = gl.getExtension("WEBGL_debug_renderer_info"); gpuN = String(x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).replace(/^ANGLE \(|\)$/g, ""); } catch (e) {}
    return gpuN;
  }
  function ping2() {
    if (navigator.onLine === false) return;
    var t = new Date(), im = new Image();
    im.onload = im.onerror = function () { var v = new Date() - t; net.ping = v; pings.push(v); if (pings.length > 24) pings.shift(); };
    im.src = "https://www.gstatic.com/generate_204?" + (+t);
  }
  function speedTest() {
    if (new Date() - spdT < 120000) return; spdT = +new Date();
    var x = new XMLHttpRequest(), t = new Date();
    try {
      x.open("GET", "https://cdn.jsdelivr.net/npm/hls.js@0.14.17/dist/hls.min.js?t=" + (+t));
      x.onload = function () { var s = (new Date() - t) / 1000, b = (x.responseText || "").length; if (s > 0 && b) spd = b * 8 / s / 1e6; };
      x.onerror = function () { spdT = 0; }; x.send();
    } catch (e) {}
  }
  function measureFps() {
    var n = 0, t0 = 0;
    function f(ts) { if (!dpT) return; if (!t0) t0 = ts; n++; if (ts - t0 >= 1000) { fps = Math.round(n * 1000 / (ts - t0)); n = 0; t0 = ts; } requestAnimationFrame(f); }
    if (window.requestAnimationFrame) requestAnimationFrame(f);
  }
  function drawDP() {
    var u = ua(), dpr = window.devicePixelRatio || 1, pm = window.performance && performance.memory, c = byId(curId), up = Math.floor((new Date() - upT) / 1000), h = "", tz = "-", nt;
    nt = !net.online ? "Offline" : net.type === "wifi" ? "Wi-Fi" : net.type === "ethernet" ? "Ethernet" : (net.type || "Online");
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "-"; } catch (e) {}
    if (tk++ % 4 === 0) ping2();
    h += card("NETWORK", net.ping ? net.ping + " ms" : "--", net.ping ? qual(net.ping) : "Measuring...", ln("Connection", nt) + ln("Link class", (net.eff || "-").toUpperCase()) + ln("Download", spd ? spd.toFixed(1) + " Mbps" : "Testing..."), spark());
    h += card("DISPLAY", Math.round(screen.width * dpr) + "x" + Math.round(screen.height * dpr), "Scale " + dpr + "x", ln("Viewport", window.innerWidth + " x " + window.innerHeight) + ln("Fullscreen", isFull() ? "On" : "Off") + ln("UI layout", "1280 x 720"));
    h += card("SYSTEM", u.and ? "Android " + u.and : "Device", u.mod || "TV stick / box", ln("WebView", u.chr ? "Chrome " + u.chr + (LEGACY ? " (old)" : "") : "-") + ln("CPU", (navigator.hardwareConcurrency || "-") + " cores") + ln("RAM", navigator.deviceMemory ? "~" + navigator.deviceMemory + " GB" : "-") + ln("GPU", gpu()));
    h += card("PERFORMANCE", fps ? fps + " fps" : "--", fps >= 50 ? "Smooth" : fps >= 30 ? "OK" : fps ? "Slow: set Animations to Off" : "Measuring...", ln("JS memory", pm ? Math.round(pm.usedJSHeapSize / 1048576) + " / " + Math.round(pm.jsHeapSizeLimit / 1048576) + " MB" : "-") + ln("App storage", sto ? Math.round(sto.usage / 1048576) + " MB" : "-"), bar(fps / 60 * 100, fps >= 50 ? "#32d74b" : fps >= 30 ? "#ffd60a" : "#ff453a"));
    h += card("WEATHER", wx ? fmtTemp(wx.t) : "--", wx ? wxText(wx.c) : "Loading...", ln("Wind", wx ? wx.w + " km/h" : "-") + ln("Location", LOCS[CFG.loc || 0].n) + ln("Source", "Open-Meteo"));
    h += card("SESSION", pad(Math.floor(up / 3600)) + ":" + pad(Math.floor(up % 3600 / 60)) + ":" + pad(up % 60), "Uptime", ln("Now playing", state === "live" && c ? c.name : "-") + ln("Time zone", tz) + ln("Bluetooth", $("pBt").innerHTML));
    $("dp").innerHTML = h;
  }
  var dp = document.createElement("div"); dp.id = "dp"; $("panel").insertBefore(dp, $("panel").firstChild);
  var _op = openPanel, _cp = closePanel;
  window.openPanel = function () {
    _op(); if (dpT) return; dpT = setInterval(drawDP, 1000); drawDP(); measureFps(); speedTest();
    try { if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(function (s) { sto = s; }); } catch (e) {}
  };
  window.closePanel = function () { _cp(); clearInterval(dpT); dpT = 0; };

  /* ---------- 4. YouTube on old WebViews ---------- */
  function ytId(u) { var m = (u || "").match(/embed\/([\w-]{11})/); return m ? m[1] : ""; }
  function pipedPlay(c) {
    killStream(); var t = tok, id = ytId(c.url) || ytId(c.alt), i = 0; canVol = "video";
    showMsg(c, "Loading...", "Compatibility mode - " + c.name); showBanner();
    function fail() { if (t === tok) showMsg(c, "NO SIGNAL", "YouTube needs a newer browser (update Android System WebView). Press OK for channel list"); }
    function play(src, hl) {
      if (t !== tok) return; $("screen").innerHTML = "";
      var v = document.createElement("video"); v.setAttribute("autoplay", "autoplay"); v.setAttribute("playsinline", "");
      v.onplaying = function () { if (t === tok) { showMsg(null, ""); applyVol(); } };
      v.onerror = function () { if (t === tok) next(); };
      $("screen").appendChild(v);
      if (hl && !(v.canPlayType && v.canPlayType("application/vnd.apple.mpegurl"))) useHls(v, src, t, next);
      else { v.src = src; try { v.play(); } catch (e) {} }
    }
    function pick(d) {
      var v = d.videoStreams || [], k, b = null, q;
      for (k = 0; k < v.length; k++) { q = parseInt(v[k].quality, 10) || 0; if (!v[k].videoOnly && /mp4/i.test((v[k].mimeType || "") + (v[k].format || "")) && q <= 720 && (!b || q > (parseInt(b.quality, 10) || 0))) b = v[k]; }
      return b;
    }
    function next() {
      if (t !== tok) return; if (i >= PIPED.length) { fail(); return; }
      var x = new XMLHttpRequest();
      try {
        x.open("GET", PIPED[i++] + "/streams/" + id); x.timeout = 9000;
        x.onreadystatechange = function () {
          if (x.readyState !== 4 || t !== tok) return;
          if (x.status === 200) { try { var d = JSON.parse(x.responseText), b; if (d.hls) { play(d.hls, true); return; } b = pick(d); if (b) { play(b.url, false); return; } } catch (e) {} }
          next();
        };
        x.send();
      } catch (e) { next(); }
    }
    if (!id) { fail(); return; } next();
  }
  var _ls = loadStream;
  window.loadStream = function (c, a, nc, mu) {
    var yt = /youtube\.com\/embed/.test(c.url);
    if (yt && LEGACY) { pipedPlay(c); return; }
    _ls(c, a, nc, mu);
    if (yt) { var t0 = tok, cid = c.id; setTimeout(function () { if (tok === t0 && curId === cid && state === "live" && !ytOk) pipedPlay(c); }, 22000); }
  };
})();
