/* C316 site interactions */
(function () {
  var NAV = [
    { href: "/sundays", label: "Sundays" },
    { href: "/messages", label: "Watch" },
    { href: "/about", label: "About" }
  ];

  function paintChrome() {
    var nav = document.querySelector(".nav-links");
    if (nav) {
      nav.innerHTML = NAV.map(function (l) {
        return '<a href="' + l.href + '">' + l.label + "</a>";
      }).join("");
    }
    var mobile = document.getElementById("mobileNav");
    if (mobile) {
      var logo = mobile.querySelector(".nav-logo-lg");
      var src = logo ? logo.getAttribute("src") : "/assets/logo-transparent.png";
      mobile.innerHTML =
        '<img class="nav-logo-lg" src="' + src + '" alt="" />' +
        '<a href="/">Home</a>' +
        NAV.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; }).join("") +
        '<a class="btn btn-primary" href="/sundays" style="margin-top:1rem">Plan a Visit</a>';
    }
    var cta = document.querySelector(".nav-cta-btn");
    if (!cta) {
      var toggle = document.querySelector(".nav-toggle");
      if (toggle) {
        var a = document.createElement("a");
        a.className = "btn btn-primary nav-cta-btn";
        a.href = "/sundays";
        a.textContent = "Plan a Visit";
        toggle.parentNode.insertBefore(a, toggle);
      }
    }
  }
  paintChrome();

  var introEl = document.getElementById("logoIntro");
  var audio = document.getElementById("c316Audio");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "c316Audio";
    audio.src = "/assets/c316-anthem.mp3";
    audio.preload = "auto";
    audio.setAttribute("playsinline", "");
    document.body.appendChild(audio);
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var params = new URLSearchParams(location.search);
  var playCode = (params.get("play") || params.get("code") || "").toLowerCase();
  var wantPlay = playCode === "316" || playCode === "c316" || params.has("listen");

  function saveAudio() {
    if (!audio) return;
    try {
      sessionStorage.setItem("c316-audio", JSON.stringify({
        playing: !audio.paused,
        t: audio.currentTime || 0
      }));
    } catch (e) {}
  }
  function loadAudioState() {
    try {
      return JSON.parse(sessionStorage.getItem("c316-audio") || "{}");
    } catch (e) {
      return {};
    }
  }

  function showDock() {
    var dock = document.getElementById("audioDock");
    if (dock) dock.classList.add("is-on");
    paintDock();
  }
  function paintDock() {
    var btn = document.getElementById("audioToggle");
    if (!btn || !audio) return;
    btn.textContent = audio.paused ? "Play" : "Pause";
    btn.setAttribute("aria-label", audio.paused ? "Play music" : "Pause music");
  }

  if (!document.getElementById("audioDock")) {
    var dock = document.createElement("div");
    dock.id = "audioDock";
    dock.className = "audio-dock";
    dock.innerHTML = '<button type="button" id="audioToggle" class="audio-dock-btn">Pause</button>';
    document.body.appendChild(dock);
    dock.querySelector("#audioToggle").addEventListener("click", function () {
      if (!audio) return;
      if (audio.paused) window.C316.playAnthem();
      else {
        audio.pause();
        saveAudio();
        paintDock();
      }
    });
  }

  function fadeAudio(to, ms) {
    if (!audio) return;
    var from = audio.volume;
    var start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / (ms || 600));
      audio.volume = from + (to - from) * t;
      if (t < 1) requestAnimationFrame(step);
      else if (to === 0) audio.pause();
    }
    requestAnimationFrame(step);
  }

  window.C316 = {
    playAnthem: function () {
      if (!audio) return Promise.resolve();
      audio.volume = 0.85;
      return audio.play().then(function () {
        showDock();
        saveAudio();
        paintDock();
      }).catch(function () {});
    },
    stopAnthem: function () { fadeAudio(0, 700); }
  };

  audio.addEventListener("play", function () {
    showDock();
    saveAudio();
    paintDock();
  });
  audio.addEventListener("pause", saveAudio);
  audio.addEventListener("ended", function () {
    saveAudio();
    paintDock();
  });
  audio.addEventListener("timeupdate", function () {
    if (Math.floor(audio.currentTime) % 2 === 0) saveAudio();
  });
  window.addEventListener("pagehide", saveAudio);
  window.addEventListener("beforeunload", saveAudio);

  document.querySelectorAll("a[href]").forEach(function (a) {
    a.addEventListener("click", function () {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) === "/" || href.indexOf(location.origin) === 0) saveAudio();
    });
  });

  var saved = loadAudioState();
  if (saved.t && !isNaN(saved.t)) {
    try { audio.currentTime = saved.t; } catch (e) {}
  }

  function startFromCodeOrResume() {
    if (reduceMotion) return Promise.resolve();
    if (saved.playing || wantPlay || saved.t > 0.4) {
      showDock();
      return window.C316.playAnthem();
    }
    return Promise.resolve();
  }

  const intro = document.getElementById("logoIntro");
  function finishIntro() {
    if (!intro || intro.classList.contains("is-done")) return;
    intro.classList.add("is-done");
    document.body.classList.remove("intro-lock");
    try { sessionStorage.setItem("c316-intro", "1"); } catch (e) {}
    saveAudio();
    setTimeout(function () { intro.remove(); }, 1000);
  }
  if (intro) {
    var skip = false;
    try { skip = sessionStorage.getItem("c316-intro") === "1"; } catch (e) {}
    if (skip || reduceMotion) {
      intro.remove();
      startFromCodeOrResume();
    } else {
      document.body.classList.add("intro-lock");
      window.C316.playAnthem();
      audio.addEventListener("play", function hideGate() {
        intro.classList.remove("needs-tap");
      });
      setTimeout(function () {
        if (audio.paused) intro.classList.add("needs-tap");
      }, 400);
      intro.addEventListener("click", function (e) {
        if (e.target && e.target.closest("[data-skip-intro]")) return;
        window.C316.playAnthem();
      });
      setTimeout(finishIntro, 20000);
      intro.querySelectorAll("[data-skip-intro]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          window.C316.playAnthem();
          finishIntro();
        });
      });
    }
  } else {
    startFromCodeOrResume();
  }

  /* Code 316 anywhere starts / resumes the anthem */
  var typed = "";
  window.addEventListener("keydown", function (e) {
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-8);
    if (typed.indexOf("316") !== -1 || typed.indexOf("c316") !== -1) {
      typed = "";
      window.C316.playAnthem();
    }
  });
  document.addEventListener("pointerdown", function unlock() {
    if (audio && audio.paused && (wantPlay || loadAudioState().playing)) {
      window.C316.playAnthem();
    }
  }, { once: false });

  const nav = document.querySelector(".site-nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-solid", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.classList.remove("open");
    mobileNav.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      const open = mobileNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  window.closeNav = closeNav;

  const modal = document.getElementById("inviteModal");
  const openers = document.querySelectorAll("[data-open-invite]");
  const closers = document.querySelectorAll("[data-close-invite]");

  function openInvite() {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    buildQR();
  }
  function closeInvite() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  openers.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openInvite();
    });
  });
  closers.forEach(function (el) {
    el.addEventListener("click", closeInvite);
  });

  function buildQR() {
    var box = document.getElementById("inviteQR");
    if (!box || typeof QRious === "undefined") return;
    box.innerHTML = "";
    var canvas = document.createElement("canvas");
    box.appendChild(canvas);
    new QRious({
      element: canvas,
      value: "https://churchthreesixteen.co.uk",
      size: 320,
      background: "#ffffff",
      foreground: "#0a0a0a",
      level: "M",
    });
  }

  window.shareInvite = async function () {
    var data = {
      title: "C316 — Come sit with us",
      text: "Church 316 is a church for the curious, the doubters, the followers — why not come and join us this Sunday? Sundays 11:30am · Howley Grange Scout Hut, Halesowen",
      url: "https://churchthreesixteen.co.uk",
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.url + "\n" + data.text);
        alert("Invite link copied!");
      }
    } catch (_) {}
  };

  var path = location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    var clean = href.replace(/\/$/, "") || "/";
    if (clean === path || (path.startsWith(clean) && clean !== "/")) {
      a.classList.add("active");
    }
  });

  /* Live / Watch
     Set youtubeChannelId to your UC… id (YouTube → channel → Share → channel ID).
     Mevo streams to that YouTube Live destination; this page embeds it. */
  var LIVE = {
    youtubeChannelId: ""
  };

  var stage = document.getElementById("liveStage");
  if (stage) {
    var london = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/London" }));
    var day = london.getDay();
    var mins = london.getHours() * 60 + london.getMinutes();
    var liveNow = day === 0 && mins >= 11 * 60 + 15 && mins < 13 * 60;
    var badge = document.getElementById("liveBadge");
    var status = document.getElementById("liveStatus");
    var player = document.getElementById("livePlayer");
    var ytId = (LIVE.youtubeChannelId || "").trim();

    if (ytId && player) {
      stage.classList.add("has-video");
      if (!player.querySelector("iframe")) {
        var frame = document.createElement("iframe");
        frame.src = "https://www.youtube.com/embed/live_stream?channel=" + encodeURIComponent(ytId) + "&rel=0";
        frame.title = "Church 316 live";
        frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        frame.setAttribute("allowfullscreen", "");
        frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        player.appendChild(frame);
      }
    }

    if (liveNow) {
      stage.classList.add("is-live");
      if (badge) badge.textContent = "Live now";
      if (status) {
        status.textContent = ytId
          ? "We're gathered. Watch live below — or be in the room."
          : "We're gathered. Press play to join in from wherever you are.";
      }
    } else if (status) {
      status.textContent = ytId
        ? "Sundays 11:30am. When we go live, the stream appears here."
        : "Sundays 11:30am. Press play to listen — or be in the room.";
    }

    var play = document.getElementById("livePlay");
    var playing = false;
    function setPlay(on) {
      playing = on;
      if (play) play.textContent = on ? "Pause" : "Play";
      stage.classList.toggle("is-playing", on);
    }
    if (play) {
      play.addEventListener("click", function () {
        if (!audio) return;
        if (audio.paused) {
          audio.volume = 0.9;
          audio.play().then(function () { setPlay(true); }).catch(function () {});
        } else {
          audio.pause();
          setPlay(false);
        }
      });
    }
    audio.addEventListener("ended", function () { setPlay(false); });
    audio.addEventListener("pause", function () { if (!intro) setPlay(false); });
  }
})();
