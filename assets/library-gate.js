/* Password gate for /library — SHA-256 of the shared leaders password. */
(function () {
  var HASH = "f97ce142766437b9f54580dc3fcef7a8558ef828eeea5df7b0d7ddb3aef74ba2";
  var KEY = "c316-library-auth";

  function hex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function digest(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(hex);
  }

  function isOpen() {
    try { return localStorage.getItem(KEY) === HASH; } catch (e) { return false; }
  }

  function openSesame() {
    document.documentElement.classList.remove("library-wait");
    var gate = document.getElementById("libraryGate");
    if (gate) gate.remove();
  }

  function paintGate() {
    if (document.getElementById("libraryGate")) return;
    var gate = document.createElement("div");
    gate.id = "libraryGate";
    gate.innerHTML =
      '<div class="library-gate-card">' +
        '<img src="/assets/logo-circle.png" alt="C316" />' +
        '<p class="kicker">Leaders</p>' +
        '<h1>THE LIBRARY</h1>' +
        '<p class="library-gate-copy">Preach notes, slides, and studies. Enter the C316 leaders password.</p>' +
        '<form id="libraryGateForm" autocomplete="on">' +
          '<label class="sr-only" for="libraryPass">Password</label>' +
          '<input id="libraryPass" name="password" type="password" autocomplete="current-password" placeholder="Password" required />' +
          '<button class="btn btn-primary" type="submit">Enter</button>' +
          '<p class="library-gate-err" id="libraryGateErr" hidden>That’s not the one.</p>' +
        '</form>' +
        '<a class="library-gate-back" href="/">Back to the site</a>' +
      "</div>";
    document.body.appendChild(gate);
    var input = document.getElementById("libraryPass");
    var err = document.getElementById("libraryGateErr");
    document.getElementById("libraryGateForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var value = (input.value || "").trim().toLowerCase();
      digest(value).then(function (got) {
        if (got === HASH) {
          try { localStorage.setItem(KEY, HASH); } catch (err2) {}
          openSesame();
        } else if (err) {
          err.hidden = false;
          input.value = "";
          input.focus();
        }
      });
    });
    if (input) input.focus();
  }

  if (!document.getElementById("libraryGateStyle")) {
    var st = document.createElement("style");
    st.id = "libraryGateStyle";
    st.textContent =
      "html.library-wait body>*:not(#libraryGate){visibility:hidden!important;pointer-events:none}" +
      "#libraryGate{position:fixed;inset:0;z-index:5000;display:grid;place-items:center;padding:1.25rem;" +
      "background:linear-gradient(180deg,rgba(8,8,8,.55),rgba(8,8,8,.92)),url('/assets/hero-sanctuary.jpg') center 40%/cover no-repeat}" +
      ".library-gate-card{width:min(100%,420px);text-align:center;background:rgba(10,10,10,.78);border:1px solid rgba(196,168,106,.28);border-radius:18px;padding:2rem 1.5rem 1.5rem}" +
      ".library-gate-card img{width:88px;height:88px;margin:0 auto .85rem;object-fit:contain;display:block}" +
      ".library-gate-card .kicker{font-size:.72rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#c4a86a}" +
      ".library-gate-card h1{font-family:'Bebas Neue',Impact,sans-serif;font-size:clamp(2.2rem,8vw,3rem);letter-spacing:.04em;line-height:.95;margin:.35rem 0 .7rem;color:#fff}" +
      ".library-gate-copy{color:rgba(255,255,255,.78);font-size:.95rem;line-height:1.5;margin-bottom:1.25rem}" +
      "#libraryGateForm{display:grid;gap:.75rem}" +
      "#libraryPass{width:100%;padding:.9rem 1rem;border-radius:999px;border:1px solid rgba(196,168,106,.28);background:rgba(255,255,255,.04);color:#fff;font:inherit;font-size:1rem;text-align:center}" +
      "#libraryGateForm .btn{display:inline-flex;align-items:center;justify-content:center;padding:.95rem 1.6rem;border-radius:999px;background:#c4a86a;color:#0a0a0a;border:0;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}" +
      ".library-gate-err{color:#ffb3d0;font-size:.85rem}" +
      ".library-gate-back{display:inline-block;margin-top:1.1rem;font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#dcc896;text-decoration:none}";
    document.documentElement.appendChild(st);
  }

  document.documentElement.classList.add("library-wait");
  if (isOpen()) {
    document.documentElement.classList.remove("library-wait");
    return;
  }
  if (document.body) paintGate();
  else document.addEventListener("DOMContentLoaded", paintGate);
})();
