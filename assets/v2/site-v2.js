/* Church 316 v2. Sunday plan copied from the current site (index.html / assets/site.js). */
(function () {
  var PLAN = [
    { date: "2026-09-06", title: "Room at the Table", ref: "Luke 14:15–24" },
    { date: "2026-09-13", title: "Curious Is Welcome", ref: "John 1:35–46" },
    { date: "2026-09-20", title: "The Name on Our Door", ref: "John 3:16–17" },
    { date: "2026-09-27", title: "Bring Them With You", ref: "Mark 2:1–12" },
    { date: "2026-10-04", title: "The Call", ref: "Matthew 4:18–22" },
    { date: "2026-10-11", title: "Restored", ref: "John 21:9–17" },
    { date: "2026-10-18", title: "The Net", ref: "Luke 5:1–11" },
    { date: "2026-10-25", title: "Sent", ref: "Matthew 28:16–20" },
    { date: "2026-11-01", title: "Why This Book?", ref: "2 Timothy 3:14–17" },
    { date: "2026-11-08", title: "When God Feels Quiet", ref: "Psalm 13" },
    { date: "2026-11-15", title: "Trust Over Control", ref: "Proverbs 3:5–6 · Romans 12:1–2" },
    { date: "2026-11-22", title: "People of the Word", ref: "Colossians 3:12–17" },
    { date: "2026-11-29", title: "Advent Prelude: Hope", ref: "Isaiah 9:2–7" },
    { date: "2026-12-06", title: "Promise Kept", ref: "Luke 1:26–38" },
    { date: "2026-12-13", title: "Room for Jesus?", ref: "Luke 2:1–7" },
    { date: "2026-12-20", title: "Good News of Great Joy", ref: "Luke 2:8–20" },
    { date: "2026-12-27", title: "What Will You Do?", ref: "Matthew 2:1–12" },
    { date: "2027-01-03", title: "Mercies, Not Resolutions", ref: "Lamentations 3:22–24" },
    { date: "2027-01-10", title: "One Step Toward Jesus", ref: "Mark 1:14–20" },
    { date: "2027-01-17", title: "Practices That Form Us", ref: "Acts 2:42–47" },
    { date: "2027-01-24", title: "When Community Costs", ref: "Hebrews 10:24–25" },
    { date: "2027-01-31", title: "Stay Soft", ref: "Hebrews 3:12–15" },
    { date: "2027-02-07", title: "Loved First", ref: "1 John 4:7–12" },
    { date: "2027-02-14", title: "Love Your Neighbours", ref: "Luke 10:25–37" },
    { date: "2027-02-21", title: "Church Like Family", ref: "Romans 12:9–18" },
    { date: "2027-02-28", title: "Still Sent", ref: "John 20:19–23" }
  ];
  var SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function london() {
    var m = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (p) { if (p.type !== "literal") m[p.type] = p.value; });
    return { iso: m.year + "-" + m.month + "-" + m.day, mins: Number(m.hour) * 60 + Number(m.minute), sunday: m.weekday === "Sun" };
  }
  var now = london();
  /* A Sunday drops off after 13:00 London time, as on the current site. */
  var next = PLAN.filter(function (s) { return s.date > now.iso || (s.date === now.iso && now.mins < 13 * 60); });
  function label(d) { var b = d.split("-"); return Number(b[2]) + " " + SHORT[Number(b[1]) - 1]; }

  /* /one invite page: next Sunday from the same plan */
  var oneWhen = document.getElementById("oneWhen");
  if (oneWhen && next[0]) {
    oneWhen.textContent = (next[0].date === now.iso ? "Today" : "Sunday " + label(next[0].date)) + " · 11:30";
    document.getElementById("onePreach").textContent = next[0].title;
    document.getElementById("oneRef").textContent = next[0].ref;
  }

  var list = document.getElementById("week-list");
  if (list && next.length) {
    list.innerHTML = next.slice(0, 4).map(function (s) {
      return '<li><span class="when">' + label(s.date) + ' <small>11:30</small></span><span class="preach">' +
        esc(s.title) + '</span><span class="ref">' + esc(s.ref) + "</span></li>";
    }).join("");
  }

  /* Invite one: same wording and link as the current site. */
  var send = document.getElementById("sendInvite"), note = document.getElementById("sendNote");
  var inviteUrl = "https://churchthreesixteen.co.uk/one";
  var inviteText = "Come with me on Sunday. Church 316, 11:30, Howley Grange Scout Hut, Halesowen.";
  if (send) send.addEventListener("click", function () {
    if (navigator.share) { navigator.share({ title: "Church 316", text: inviteText, url: inviteUrl }).catch(function () {}); return; }
    var full = inviteText + " " + inviteUrl;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(full).then(function () { if (note) note.textContent = "Link copied. Send it to one person."; });
      return;
    }
    window.prompt("Copy this and send it to one person", full);
  });

  /* Live: Mevo streams to the C316 Facebook Page (same rules as the current site). */
  var stage = document.getElementById("liveStage");
  if (stage) {
    var fb = "https://www.facebook.com/profile.php?id=61586615711328";
    var q = new URLSearchParams(location.search).get("live");
    var liveNow = q === "1" || q === "true" ? true : q === "0" || q === "false" ? false
      : now.sunday && now.mins >= 11 * 60 + 15 && now.mins < 13 * 60;
    var status = document.getElementById("liveStatus"), badge = document.getElementById("liveBadge");
    var nextEl = document.getElementById("liveNext");
    if (nextEl && next[0]) nextEl.textContent = (next[0].date === now.iso ? "Today" : "Sunday " + label(next[0].date)) + " · " + next[0].title + " · " + next[0].ref;
    if (liveNow) {
      stage.classList.add("is-live");
      var f = document.createElement("iframe");
      f.src = "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(fb) + "&show_text=false&width=860";
      f.title = "Church 316 live on Facebook";
      f.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
      f.setAttribute("allowfullscreen", "");
      stage.appendChild(f);
      if (badge) badge.textContent = "Live now";
      if (status) status.textContent = "We're gathered. Watch below, or be in the room.";
    }
  }

  /* Nav */
  var t = document.querySelector(".nav-toggle"), n = document.getElementById("nav");
  if (t && n) {
    t.addEventListener("click", function () { var o = n.classList.toggle("open"); t.setAttribute("aria-expanded", o); });
    document.querySelectorAll(".nav-links a").forEach(function (a) { a.addEventListener("click", function () { n.classList.remove("open"); t.setAttribute("aria-expanded", false); }); });
  }
})();
