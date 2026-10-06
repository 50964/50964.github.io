/* C316 site interactions */
(function () {
  var NAV = [
    { href: "/sundays", label: "Sundays" },
    { href: "/messages", label: "Watch" },
    { href: "/library", label: "Library" },
    { href: "/about", label: "About" }
  ];

  /* One Story wall chart, Sep 2026 – Feb 2027. Public announcements
     always show the next four Sundays and drop a Sunday after 13:00. */
  var PLAN = [
    { date: "2026-09-06", series: "Come As You Are", theme: "Welcome and identity", title: "Room at the Table", ref: "Luke 14:15–24", line: "Jesus still makes space for the ones who feel left out." },
    { date: "2026-09-13", series: "Come As You Are", theme: "Welcome and identity", title: "Curious Is Welcome", ref: "John 1:35–46", line: "You don’t need all the answers to take a first step." },
    { date: "2026-09-20", series: "Come As You Are", theme: "Welcome and identity", title: "The Name on Our Door", ref: "John 3:16–17", line: "For God so loved the world — including Halesowen." },
    { date: "2026-09-27", series: "Come As You Are", theme: "Welcome and identity", title: "Bring Them With You", ref: "Mark 2:1–12", line: "Faith often starts when friends carry someone to Jesus." },
    { date: "2026-10-04", series: "Gone Fishing", theme: "Mission · people", title: "The Call", ref: "Matthew 4:18–22", line: "Jesus still calls ordinary people from ordinary places." },
    { date: "2026-10-11", series: "Gone Fishing", theme: "Mission · people", title: "Restored", ref: "John 21:9–17", line: "Failure is not the end of your calling." },
    { date: "2026-10-18", series: "Gone Fishing", theme: "Mission · people", title: "The Net", ref: "Luke 5:1–11", line: "The miracle is on the other side of obedience." },
    { date: "2026-10-25", series: "Gone Fishing", theme: "Mission · people", title: "Sent", ref: "Matthew 28:16–20", line: "You do not need to feel ready to be sent." },
    { date: "2026-11-01", series: "Roots", theme: "Scripture and trust", title: "Why This Book?", ref: "2 Timothy 3:14–17", line: "We open this book because God still speaks." },
    { date: "2026-11-08", series: "Roots", theme: "Scripture and trust", title: "When God Feels Quiet", ref: "Psalm 13", line: "You can tell God the truth and still trust him." },
    { date: "2026-11-15", series: "Roots", theme: "Scripture and trust", title: "Trust Over Control", ref: "Proverbs 3:5–6 · Romans 12:1–2", line: "Control is often fear in a smart coat." },
    { date: "2026-11-22", series: "Roots", theme: "Scripture and trust", title: "People of the Word", ref: "Colossians 3:12–17", line: "The word of Christ belongs in the room, not only on the stand." },
    { date: "2026-11-29", series: "Roots", theme: "Scripture and trust", title: "Advent Prelude: Hope", ref: "Isaiah 9:2–7", line: "Hope does not deny the night. It names the Light." },
    { date: "2026-12-06", series: "Light for the Street", theme: "Advent · Christmas", title: "Promise Kept", ref: "Luke 1:26–38", line: "Christmas is a kept promise — and a human yes." },
    { date: "2026-12-13", series: "Light for the Street", theme: "Advent · Christmas", title: "Room for Jesus?", ref: "Luke 2:1–7", line: "The King arrives at the edge. A manger is enough." },
    { date: "2026-12-20", series: "Light for the Street", theme: "Advent · Christmas", title: "Good News of Great Joy", ref: "Luke 2:8–20", line: "Good news finds the night shift first." },
    { date: "2026-12-27", series: "Light for the Street", theme: "Advent · Christmas", title: "What Will You Do?", ref: "Matthew 2:1–12", line: "Meeting Jesus changes the way back." },
    { date: "2027-01-03", series: "New Mercies", theme: "Reset · depth", title: "Mercies, Not Resolutions", ref: "Lamentations 3:22–24", line: "Start the year on mercy, not on shame." },
    { date: "2027-01-10", series: "New Mercies", theme: "Reset · depth", title: "One Step Toward Jesus", ref: "Mark 1:14–20", line: "You do not need a five-year plan. You need one step." },
    { date: "2027-01-17", series: "New Mercies", theme: "Reset · depth", title: "Practices That Form Us", ref: "Acts 2:42–47", line: "Following Jesus is a rhythm, not a vibe." },
    { date: "2027-01-24", series: "New Mercies", theme: "Reset · depth", title: "When Community Costs", ref: "Hebrews 10:24–25", line: "Presence is a gift. Absence is easy." },
    { date: "2027-01-31", series: "New Mercies", theme: "Reset · depth", title: "Stay Soft", ref: "Hebrews 3:12–15", line: "Stay interruptible. Stay soft." },
    { date: "2027-02-07", series: "Love That Stays", theme: "Neighbours · vision", title: "Loved First", ref: "1 John 4:7–12", line: "We love because he first loved us." },
    { date: "2027-02-14", series: "Love That Stays", theme: "Neighbours · vision", title: "Love Your Neighbours", ref: "Luke 10:25–37", line: "Mercy crosses the road." },
    { date: "2027-02-21", series: "Love That Stays", theme: "Neighbours · vision", title: "Church Like Family", ref: "Romans 12:9–18", line: "Church is a people you belong to, not an event you attend." },
    { date: "2027-02-28", series: "Love That Stays", theme: "Neighbours · vision", title: "Still Sent", ref: "John 20:19–23", line: "The story does not end in the locked room." }
  ];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function londonNow(from) {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(from || new Date());
    var map = {};
    parts.forEach(function (p) { if (p.type !== "literal") map[p.type] = p.value; });
    return {
      iso: map.year + "-" + map.month + "-" + map.day,
      minutes: Number(map.hour) * 60 + Number(map.minute)
    };
  }
  function planWhen(iso) {
    var bits = iso.split("-");
    return Number(bits[2]) + " " + MONTHS[Number(bits[1]) - 1];
  }
  function upcoming(count, from) {
    var london = londonNow(from);
    return PLAN.filter(function (s) {
      if (s.date > london.iso) return true;
      return s.date === london.iso && london.minutes < 13 * 60;
    }).slice(0, count || 4);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c];
    });
  }
  function paintComing() {
    var london = londonNow();
    var next = upcoming(4);
    document.querySelectorAll("[data-services]").forEach(function (el) {
      var n = Number(el.getAttribute("data-services")) || 4;
      el.innerHTML = upcoming(n).map(function (s) {
        var thisSunday = s.date === london.iso;
        var when = (thisSunday ? "This Sunday" : "Sunday") + " " + planWhen(s.date) + " · 11:30–13:00 · " + s.series;
        return '<article class="series-row">' +
          "<div>" +
          '<p class="week">' + esc(when) + "</p>" +
          "<h3>" + esc(s.title) + "</h3>" +
          '<p class="verse-line">' + esc(s.line) + "</p>" +
          '<p class="ref">' + esc(s.ref) + "</p>" +
          "</div></article>";
      }).join("");
    });
    var first = next[0];
    var kicker = document.getElementById("seriesKicker");
    var title = document.getElementById("seriesTitle");
    var blurb = document.getElementById("seriesBlurb");
    if (first && kicker && title && blurb) {
      kicker.textContent = first.series;
      title.textContent = first.series;
      var prefix = first.date === london.iso ? "This Sunday" : "Next";
      blurb.textContent = first.theme + ". " + prefix + ": " + first.title + ", " + planWhen(first.date) + ".";
    }
    return next;
  }

  function paintChrome() {
    var nav = document.querySelector(".nav-links");
    if (nav) {
      nav.innerHTML = NAV.map(function (l) {
        return '<a href="' + l.href + '">' + l.label + "</a>";
      }).join("");
    }
    var mobile = document.getElementById("mobileNav");
    if (mobile) {
      mobile.innerHTML =
        '<a class="nav-word" href="/">C316</a>' +
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
  var coming = paintComing();

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

  /* Live / Watch — Mevo streams to the C316 Facebook Page. */
  var LIVE = {
    facebookPageUrl: "https://www.facebook.com/profile.php?id=61586615711328",
    facebookPageId: "61586615711328"
  };

  var stage = document.getElementById("liveStage");
  if (stage) {
    var london = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/London" }));
    var day = london.getDay();
    var mins = london.getHours() * 60 + london.getMinutes();
    var forceLive = params.get("live");
    var liveNow = forceLive === "1" || forceLive === "true"
      ? true
      : forceLive === "0" || forceLive === "false"
        ? false
        : day === 0 && mins >= 11 * 60 + 15 && mins < 13 * 60;
    var badge = document.getElementById("liveBadge");
    var status = document.getElementById("liveStatus");
    var player = document.getElementById("livePlayer");
    var nextDate = document.getElementById("liveNextDate");
    var fbUrl = (LIVE.facebookPageUrl || "").trim();
    var fbId = (LIVE.facebookPageId || "").trim();
    /* Never use facebook.com/{id}/live — Facebook often sends that
       to a different Church 3:16 that happens to be streaming. */
    var fbLive = fbUrl || (fbId ? "https://www.facebook.com/" + fbId : "");

    var nextPlan = (coming && coming[0]) || upcoming(1)[0];
    var londonPlan = londonNow();
    var planWhenLabel = nextPlan ? planWhen(nextPlan.date) : "";
    var planIsToday = nextPlan && nextPlan.date === londonPlan.iso;
    if (nextDate && nextPlan) {
      nextDate.textContent = (planIsToday ? "This Sunday · " : "Sunday ") + planWhenLabel + " · " + nextPlan.title;
    }

    stage.classList.add("has-video");
    if (liveNow && fbLive && player) {
      stage.classList.add("is-live");
      if (!player.querySelector("iframe")) {
        var frame = document.createElement("iframe");
        frame.src = "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(fbLive) + "&show_text=false&width=860";
        frame.title = "Church 316 live on Facebook";
        frame.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
        frame.setAttribute("allowfullscreen", "");
        frame.setAttribute("scrolling", "no");
        frame.setAttribute("allowTransparency", "true");
        player.appendChild(frame);
      }
    } else if (player) {
      var existing = player.querySelector("iframe");
      if (existing) existing.remove();
      stage.classList.remove("is-live");
    }

    var fbBtn = document.getElementById("liveFacebook");
    if (fbBtn && fbUrl) {
      fbBtn.href = fbUrl;
      fbBtn.hidden = false;
    }

    if (liveNow) {
      if (badge) badge.textContent = "Live now";
      if (status) {
        status.textContent = fbLive
          ? "We're gathered. Watch below — or be in the room."
          : "We're gathered. Press play to join in from wherever you are.";
      }
    } else if (status && nextPlan) {
      status.textContent = "Next live service: " + nextPlan.title + ", " + planWhenLabel + ". " + nextPlan.ref + ". The stream appears here when we go live.";
    } else if (status) {
      status.textContent = "Next live service: Sunday 11:30am. The stream appears here when we go live.";
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

  var filters = document.getElementById("libFilters");
  if (filters) {
    var buttons = filters.querySelectorAll("button[data-filter]");
    var items = document.querySelectorAll("[data-kind]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.getAttribute("data-filter");
        buttons.forEach(function (b) { b.classList.toggle("is-on", b === btn); });
        items.forEach(function (el) {
          var show = kind === "all" || el.getAttribute("data-kind") === kind;
          el.hidden = !show;
        });
        document.querySelectorAll("[data-kind-group]").forEach(function (group) {
          var visible = group.querySelector("[data-kind]:not([hidden])");
          group.hidden = !visible;
        });
      });
    });
  }
})();
