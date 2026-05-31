/* ============================================================
   NAAXTECH — SYSTEMS VALUE-MAP / interactions
   One map, two languages. Outcomes (for Judith/operators) ⇄
   Architecture (for builders). Reuses the brand scramble motion.
   ============================================================ */
(function () {
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

  /* ── The machine, modelled once. ── */
  const STAGES = [
    {
      id: "input", idx: "01", name: "Business Input",
      sub:  { biz: "Your goals, mapped to systems", arch: "Goals → Requirements → Architecture" },
      title:{ biz: "We start with the number, not the feature list.",
              arch: "Discovery sprint → architecture." },
      desc: { biz: "Every system traces back to a revenue or efficiency outcome you actually care about. We map the goal first — then build only what moves it.",
              arch: "Week-one discovery produces the data model, the integration map, and the build plan. No code before the architecture is agreed." },
      tools:{ biz: ["Goal mapping","Systems audit","Build plan"], arch: ["Discovery sprint","Architecture map","Data model"] },
      metric:{ num:["Week ","1"], lab:{ biz:"From goal to live plan", arch:"To agreed architecture" } }
    },
    {
      id: "core", idx: "02", name: "Automation Core",
      sub:  { biz: "Where repetitive work disappears", arch: "n8n · AI agents · workflows" },
      title:{ biz: "The engine that runs your ops while you sleep.",
              arch: "n8n orchestration core with AI agents." },
      desc: { biz: "Emails, routing, data syncs, reporting, approvals — the work that eats your team's week, running on its own. <strong>You own the outcomes; we own the machine.</strong>",
              arch: "Webhook + scheduled triggers drive n8n workflows and AI agents across your stack. Proprietary execution engine, dedicated app accounts, real-time orchestration." },
      tools:{ biz: ["No more data entry","Auto-reporting","Smart routing"], arch: ["n8n","AI Agents","Webhooks","Schedulers"] },
      metric:{ num:["82","%"], lab:{ biz:"Ops time recovered", arch:"Manual workflows removed" } }
    },
    {
      id: "delivery", idx: "03", name: "Delivery Layer",
      sub:  { biz: "The apps & dashboards you actually use", arch: "Apps · APIs · Dashboards" },
      title:{ biz: "Surfaces built for how you work — not how software forces you.",
              arch: "Custom apps, APIs and real-time dashboards." },
      desc: { biz: "The screens your team lives in: booking systems, admin portals, inventory, dashboards — mapped to your business, not an off-the-shelf template.",
              arch: "React + Vite front ends, FastAPI services, REST APIs and live dashboards. All connected, all yours." },
      tools:{ biz: ["Custom apps","Live dashboards","Internal tools"], arch: ["React","FastAPI","REST APIs","Dashboards"] },
      metric:{ num:["100","%"], lab:{ biz:"Built around your process", arch:"Mapped to your workflows" } }
    },
    {
      id: "infra", idx: "04", name: "Data & Infrastructure",
      sub:  { biz: "Foundations that don't break when you grow", arch: "Cloud · Supabase · VPS" },
      title:{ biz: "Built today for 10× the load you'll have tomorrow.",
              arch: "Supabase + Railway + Docker + CI/CD." },
      desc: { biz: "The bedrock under everything. Architected for the scale you'll hit in 12 months, so the systems you build now still run fast when you grow.",
              arch: "Supabase Postgres with RLS on every table, Railway/Vercel deploys, Docker, CI/CD pipelines, VPS management and database optimization." },
      tools:{ biz: ["Secure by default","Scales with you","Always backed up"], arch: ["Supabase","Railway","Docker","CI/CD"] },
      metric:{ num:["10","×"], lab:{ biz:"Designed for your future load", arch:"Headroom over current load" } }
    },
    {
      id: "monitor", idx: "05", name: "Monitoring",
      sub:  { biz: "Always watched, always accountable", arch: "Cattr · Syncthing · alerts" },
      title:{ biz: "We see the problem before you have to ask.",
              arch: "Uptime, sync and alerting pipelines." },
      desc: { biz: "Real-time visibility into everything we run for you. Uptime, performance and alerts — so issues get caught and fixed, not reported by you.",
              arch: "Cattr time/visibility, Syncthing continuous sync, uptime monitoring and alerting pipelines across the engine." },
      tools:{ biz: ["Real-time alerts","Uptime watch","Weekly updates"], arch: ["Cattr","Syncthing","Uptime","Alerts"] },
      metric:{ num:["24","/7"], lab:{ biz:"Eyes on your systems", arch:"Monitored + alerted" } }
    },
    {
      id: "output", idx: "→", name: "Scaled Operations", output: true,
      sub:  { biz: "Your business, running faster", arch: "Compounding systems" },
      title:{ biz: "Operations that scale without adding headcount.",
              arch: "The machine compounds." },
      desc: { biz: "The output of the whole engine: a business that runs faster, leaner and smarter — where growth no longer means hiring chaos. <strong>The system grows when you do.</strong>",
              arch: "Every layer feeds the next. Add load, add channels, add features — the architecture absorbs it. This is what you're subscribing to." },
      tools:{ biz: ["More output, same team","Faster decisions","Calm growth"], arch: ["Compounding","Self-healing","Documented"] },
      metric:{ num:["14","×"], lab:{ biz:"Faster than hiring a team", arch:"vs. assembling separately" } }
    }
  ];

  /* lanes → which stages they light up */
  const LANES = [
    { n:"01", name:"Automation",       one:{biz:"Hours back, every week",      arch:"n8n · pipelines · agents"},        lit:[0,1] },
    { n:"02", name:"ERP / Ops",        one:{biz:"Tools built around you",      arch:"Platforms · portals · admin"},     lit:[2] },
    { n:"03", name:"AI Systems",       one:{biz:"Intelligence that compounds", arch:"Agents · RAG · routing"},           lit:[1,2] },
    { n:"04", name:"Infrastructure",   one:{biz:"Won't break at scale",        arch:"Cloud · DevOps · CI/CD"},           lit:[3,4] },
    { n:"05", name:"Revenue Marketing",one:{biz:"Traffic → revenue",           arch:"Funnels · attribution · CRM"},      lit:[2,0] }
  ];

  let mode = "biz";          // 'biz' = Outcomes, 'arch' = Architecture
  let selected = 1;          // default: Automation Core

  /* ── scramble morph: time-based + guaranteed to converge. ──
     Always settles on the latest target, even if re-fired mid-run
     (hover-sweep) or starved of frames. A safety timer writes the
     final plain text no matter what, so text can never freeze. ── */
  function morphText(el, text, html) {
    // clear any pending finalizers from a previous call
    if (el._safety) { clearTimeout(el._safety); el._safety = null; }
    if (el._fadeT) { clearTimeout(el._fadeT); el._fadeT = null; }

    if (html) { // desc with markup: no scramble, just a fade swap
      if (el._raf) { cancelAnimationFrame(el._raf); el._raf = null; }
      el.style.opacity = 0;
      el._fadeT = setTimeout(() => {
        el.innerHTML = text; el.style.transition = "opacity .35s"; el.style.opacity = 1;
      }, 120);
      return;
    }

    el._target = text;
    el._start = performance.now();
    el._dur = Math.min(Math.max(text.length, 10), 26) * 28; // ms

    // hard guarantee: clean final text lands within _dur + buffer, always
    el._safety = setTimeout(() => {
      if (el._raf) { cancelAnimationFrame(el._raf); el._raf = null; }
      el.textContent = el._target;
    }, el._dur + 220);

    if (el._raf) return; // a loop is already running — it picks up the new target

    const tick = (now) => {
      const target = el._target;
      const p = Math.min((now - el._start) / el._dur, 1);
      if (p >= 1) { el.textContent = target; el._raf = null; if (el._safety) { clearTimeout(el._safety); el._safety = null; } return; }
      const revealed = Math.floor(p * target.length);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const c = target[i];
        if (c === " ") { out += "<span> </span>"; continue; }
        if (i < revealed) out += `<span class="ch">${c}</span>`;
        else out += `<span class="ch act">${CHARS[(Math.random()*CHARS.length)|0]}</span>`;
      }
      el.innerHTML = out;
      el._raf = requestAnimationFrame(tick);
    };
    el._raf = requestAnimationFrame(tick);
  }

  /* ── render readout for selected stage ── */
  const ro = {
    kicker: document.getElementById("ro-kicker"),
    title:  document.getElementById("ro-title"),
    desc:   document.getElementById("ro-desc"),
    tools:  document.getElementById("ro-tools"),
    num:    document.getElementById("ro-num"),
    lab:    document.getElementById("ro-lab")
  };

  function paintReadout(animate) {
    const s = STAGES[selected];
    ro.kicker.innerHTML = `<span class="dot"></span>STAGE ${s.idx} · ${s.name.toUpperCase()}`;
    if (animate) { morphText(ro.title, s.title[mode]); }
    else ro.title.textContent = s.title[mode];
    morphText(ro.desc, s.desc[mode], true);
    ro.tools.innerHTML = s.tools[mode].map((t,i)=>`<span class="ro-tool${i===0?' t-on':''}">${t}</span>`).join("");
    ro.num.innerHTML = `${s.metric.num[0]}<span>${s.metric.num[1]}</span>`;
    ro.lab.textContent = s.metric.lab[mode];
  }

  /* ── render stage list ── */
  const stageEls = [];
  const list = document.getElementById("stage-list");
  STAGES.forEach((s, i) => {
    const el = document.createElement("div");
    el.className = "stage" + (s.output ? " output" : "") + (i === selected ? " active" : "");
    el.innerHTML = `
      <div class="stage-dot">${s.output ? "<span>◆</span>" : s.idx}</div>
      <div class="stage-body">
        <div class="stage-kicker">${s.output ? "OUTPUT" : "LAYER " + s.idx}</div>
        <div class="stage-name">${s.name}</div>
        <div class="stage-sub" data-sub>${s.sub[mode]}</div>
      </div>`;
    el.addEventListener("mouseenter", () => select(i, true));
    el.addEventListener("click", () => select(i, true));
    list.appendChild(el);
    stageEls.push(el);
  });

  function select(i, animate) {
    selected = i;
    stageEls.forEach((e, j) => e.classList.toggle("active", j === i));
    paintReadout(animate);
  }

  function repaintSubs(animate) {
    STAGES.forEach((s, i) => {
      const sub = stageEls[i].querySelector("[data-sub]");
      if (animate) morphText(sub, s.sub[mode]);
      else sub.textContent = s.sub[mode];
    });
  }

  /* ── lane rail ── */
  const rail = document.getElementById("lane-rail");
  LANES.forEach((l) => {
    const c = document.createElement("div");
    c.className = "lane-chip";
    c.innerHTML = `<div class="lc-n">${l.n} / LANE</div><div class="lc-name">${l.name}</div><div class="lc-one" data-one>${l.one[mode]}</div>`;
    c.addEventListener("mouseenter", () => l.lit.forEach((idx) => stageEls[idx].classList.add("lit")));
    c.addEventListener("mouseleave", () => stageEls.forEach((e) => e.classList.remove("lit")));
    rail.appendChild(c);
  });
  function repaintLanes() {
    rail.querySelectorAll("[data-one]").forEach((el, i) => { el.textContent = LANES[i].one[mode]; });
  }

  /* ── mode toggle ── */
  const modeEl = document.getElementById("mode");
  const thumbEl = modeEl.querySelector(".thumb");
  const btnBiz = document.getElementById("m-biz");
  const btnArch = document.getElementById("m-arch");
  const caption = document.getElementById("mode-caption");
  function setMode(m) {
    if (m === mode) return;
    mode = m;
    modeEl.dataset.mode = m === "biz" ? "biz" : "arch";
    if (thumbEl) thumbEl.style.left = m === "arch" ? "50%" : "0";
    btnBiz.classList.toggle("on", m === "biz");
    btnArch.classList.toggle("on", m === "arch");
    caption.textContent = m === "biz" ? "Speaking to the operator — outcomes first" : "Speaking to the builder — the real stack";
    repaintSubs(true);
    repaintLanes();
    paintReadout(true);
  }
  btnBiz.addEventListener("click", () => setMode("biz"));
  btnArch.addEventListener("click", () => setMode("arch"));

  /* ── init ── */
  paintReadout(false);

  /* CTA sweep */
  document.querySelectorAll(".eng-cta").forEach((btn) => {
    btn.style.position = "relative"; btn.style.overflow = "hidden";
    btn.addEventListener("click", () => {
      const s = document.createElement("span");
      s.style.cssText = "position:absolute;inset:0;background:rgba(255,255,255,.35);transform:translateX(-100%);animation:sweepx .5s cubic-bezier(.16,1,.3,1) forwards;";
      btn.appendChild(s);
      s.addEventListener("animationend", () => s.remove(), { once: true });
    });
  });
  if (!document.getElementById("sweepx-kf")) {
    const st = document.createElement("style"); st.id = "sweepx-kf";
    st.textContent = "@keyframes sweepx{to{transform:translateX(100%)}}";
    document.head.appendChild(st);
  }
})();
