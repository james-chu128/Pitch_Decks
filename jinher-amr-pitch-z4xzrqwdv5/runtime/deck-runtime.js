/* deck-runtime.js — slide registry, clock-driven animation, export hooks.
 *
 * Every slide file calls Deck.slide({...}). All motion on a slide is driven by ONE slide-local
 * clock t (seconds), live or while exporting, so a recording is frame-exact and matches what the
 * audience sees:
 *   - ctx.timeline(gsapTimeline)  → runtime seeks it to t (create timelines paused or let us pause them)
 *   - ctx.onFrame(t => ...)       → called every frame with t (three.js render, d3 updates…)
 *   - CSS / Web Animations inside the slide are seeked to t automatically
 *   - <video> plays natively live; while exporting it is seeked to t
 *
 * Slide definition:
 *   Deck.slide({
 *     id: '1-3',                      // outline number
 *     bg: 'white' | 'tint' | 'dark',
 *     layout: 'content' | 'title' | 'section' | 'full',
 *     kicker: 'SECTION', title: 'Slide title',
 *     html: `...`,                    // body (inside .content)
 *     notes: `...`,                   // speaker notes (language per outline)
 *     anim: { type: 'loop' | 'once', duration: 8 },          // what the recorder captures
 *     pdf:  { mode: 'final' | 'steps' | 'time', t: 3 },      // static frame for PDF / PNG
 *     pptx: { editable: false, region: [x, y, w, h] },        // export option (b) per slide
 *     mount(el, ctx) { ...; return () => cleanup() },
 *   });
 */
(function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  const EXPORT = params.has('export');
  const CFG = Object.assign({ title: '', footer: '', width: 1280, height: 720 }, window.DECK_CONFIG || {});
  const defs = [];
  const states = [];
  let current = null;

  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function buildSection(def, i) {
    const sec = document.createElement('section');
    sec.className = `bg-${def.bg || 'white'} layout-${def.layout || 'content'}${def.source ? ' has-source' : ''}${CFG.sectionClass ? ' ' + CFG.sectionClass : ''}${def.cls ? ' ' + def.cls : ''}`;
    sec.dataset.slideId = def.id || String(i + 1);
    if (def.anim) sec.dataset.anim = def.anim.type;
    let inner = '';
    if (def.layout === 'title' || def.layout === 'section') {
      inner = def.html || '';
    } else {
      if (def.kicker || def.title)
        inner += `<header class="head">${def.kicker ? `<div class="kicker">${def.kicker}</div>` : ''}${def.title ? `<h2 class="title">${def.title}</h2>` : ''}</header>`;
      inner += `<div class="content">${def.html || ''}</div>`;
    }
    if (def.source) inner += `<div class="source">${def.source}</div>`;
    if (def.footer !== false && CFG.footer)
      inner += `<footer class="deck-footer"><span class="ft">${CFG.footer}</span><span class="pageno">${i + 1}</span></footer>`;
    if (def.notes) inner += `<aside class="notes">${esc(def.notes).replace(/\n/g, '<br>')}</aside>`;
    sec.innerHTML = inner;
    return sec;
  }

  function makeState(def, sec, index) {
    const st = { def, sec, index, mounted: false, cleanup: null, frameCbs: [], timelines: [], startedAt: 0, t: 0 };
    st.ctx = {
      el: sec, index, exporting: EXPORT, width: CFG.width, height: CFG.height,
      duration: def.anim ? def.anim.duration : 0,
      state: {},
      onFrame(cb) { st.frameCbs.push(cb); },
      timeline(tl) { if (tl && tl.pause) tl.pause(); st.timelines.push(tl); return tl; },
      asset: Deck.asset,
    };
    return st;
  }

  function mount(st) {
    if (st.mounted) return;
    st.mounted = true;
    if (typeof st.def.mount === 'function') {
      try { const c = st.def.mount(st.sec, st.ctx); if (typeof c === 'function') st.cleanup = c; }
      catch (e) { console.error(`[deck] mount failed on slide ${st.def.id}`, e); }
    }
  }

  function clampT(st, raw) {
    const a = st.def.anim;
    if (!a || !a.duration) return raw;
    return a.type === 'loop' ? raw % a.duration : Math.min(raw, a.duration);
  }

  function applyTime(st, t) {
    st.t = t;
    for (const tl of st.timelines) { try { tl.seek(t, false); } catch (e) {} }
    // sync only CSS keyframe animations inside the slide; leave Reveal page transitions and fragment transitions alone
    if (st.sec.getAnimations) for (const an of st.sec.getAnimations({ subtree: true })) {
      if (typeof CSSTransition !== 'undefined' && an instanceof CSSTransition) continue;
      if (an.effect && an.effect.target === st.sec) continue;
      an.pause(); an.currentTime = t * 1000;
    }
    for (const cb of st.frameCbs) { try { cb(t); } catch (e) { console.error(e); } }
  }

  // ---- live clock: only the current slide ticks (3D pauses when you leave the slide)
  function tick(now) {
    if (current && !EXPORT) {
      const raw = (now - current.startedAt) / 1000;
      if (current.frameCbs.length || current.timelines.length || current.def.anim) applyTime(current, clampT(current, raw));
    }
    requestAnimationFrame(tick);
  }

  function enter(index) {
    const st = states[index];
    if (!st) return;
    mount(st);
    st.startedAt = performance.now();
    current = st;
    if (!EXPORT) applyTime(st, 0);
  }

  // ---- helpers usable from slides -------------------------------------------------------
  const Deck = window.Deck = {
    config: CFG,
    exporting: EXPORT,
    slide(def) { defs.push(def); },

    // Loads a binary asset. Works from file:// when pack embedded it (deck.json "embedAssets").
    async asset(p) {
      const emb = window.__DECK_ASSETS && window.__DECK_ASSETS[p];
      if (emb) { const bin = atob(emb); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
      const r = await fetch(p); if (!r.ok) throw new Error(`asset ${p}: ${r.status}`); return r.arrayBuffer();
    },

    // Lucide icon as inline SVG (registry generated by `deck.mjs build` from Deck.icon('name') calls)
    icon(name, o = {}) {
      const svg = (window.__DECK_ICONS || {})[name];
      if (!svg) return `<span class="icon-missing">[${name}]</span>`;
      const size = o.size || 28, sw = o.stroke || 2;
      return svg.replace('<svg', `<svg class="icon ${o.cls || ''}" style="${o.color ? `color:${o.color};` : ''}"`)
        .replace(/width="\d+"/, `width="${size}"`).replace(/height="\d+"/, `height="${size}"`)
        .replace(/stroke-width="[\d.]+"/, `stroke-width="${sw}"`);
    },

    // Code block pre-highlighted at build time by shiki (files in src/code/)
    code(file, o = {}) {
      const html = (window.__DECK_CODE || {})[file];
      return html ? `<div class="code ${o.cls || ''}" style="${o.size ? `font-size:${o.size}pt` : ''}">${html}</div>` : `<div class="placeholder">code/${file} not built</div>`;
    },

    // Theme colour for JS-drawn visuals, e.g. Deck.token('--viz-accent'). Lets one slide file work in every theme.
    token(name, el) { return getComputedStyle(el || document.querySelector('.reveal') || document.documentElement).getPropertyValue(name).trim(); },

    math(tex, display = false) {
      if (!window.katex) return `<code>${esc(tex)}</code>`;
      return window.katex.renderToString(tex, { displayMode: display, throwOnError: false });
    },

    // Grey "missing asset" box — listed in the outline's 缺漏素材總表 and in the delivery report
    placeholder(label, style = '') { return `<div class="placeholder" data-missing="${esc(label)}" style="${style}"><span>待補：${esc(label)}</span></div>`; },

    // Video keeping its aspect ratio, as large as the box allows; caption under it.
    video(src, o = {}) {
      const attrs = `${o.loop !== false ? 'loop' : ''} muted playsinline ${o.autoplay !== false ? 'data-autoplay' : ''}`;
      return `<figure class="video-box ${o.cls || ''}" style="${o.style || ''}"><div class="frame"><video src="${src}" ${attrs} preload="auto" data-poster-t="${o.posterT ?? ''}"></video></div>${o.caption ? `<figcaption class="caption">${o.caption}</figcaption>` : ''}</figure>`;
    },
    image(src, o = {}) {
      return `<figure class="image-box ${o.cls || ''}" style="${o.style || ''}"><div class="frame"><img src="${src}" alt=""></div>${o.caption ? `<figcaption class="caption">${o.caption}</figcaption>` : ''}</figure>`;
    },

    start() {
      const host = document.querySelector('.reveal .slides');
      defs.forEach((d, i) => { const sec = buildSection(d, i); host.appendChild(sec); states.push(makeState(d, sec, i)); });
      const plugins = (!EXPORT && window.RevealNotes) ? [window.RevealNotes] : [];
      Reveal.initialize({
        width: CFG.width, height: CFG.height, margin: 0, minScale: 0.1, maxScale: 4, center: false,
        hash: !EXPORT && !CFG.preview, controls: false, controlsTutorial: false, progress: !EXPORT, slideNumber: false,
        transition: EXPORT ? 'none' : (CFG.transition || 'fade'), transitionSpeed: 'fast', backgroundTransition: 'none',
        autoPlayMedia: EXPORT ? false : null, preloadIframes: true, viewDistance: 2,
        keyboard: { 70: () => Reveal.isOverview() || document.documentElement.requestFullscreen() },
        plugins,
      }).then(() => {
        enter(Reveal.getState().indexh);
        Reveal.on('slidechanged', (e) => enter(e.indexh));
        requestAnimationFrame(tick);
        document.title = CFG.title || document.title;
        window.__deckReady = true;
        window.dispatchEvent(new Event('deck:ready'));
      });
    },
  };

  // ---- export hooks used by tools/deck.mjs (Playwright) ---------------------------------
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  window.__deck = {
    list() {
      return states.map((st) => ({
        index: st.index, id: st.def.id || String(st.index + 1),
        anim: st.def.anim || null, pdf: st.def.pdf || null, pptx: st.def.pptx || null,
        fragments: st.sec.querySelectorAll('.fragment').length,
        videos: [...st.sec.querySelectorAll('video')].map((v) => v.getAttribute('src')),
        notes: st.def.notes || '', missing: [...st.sec.querySelectorAll('[data-missing]')].map((e) => e.dataset.missing),
        title: st.def.title || '',
      }));
    },
    async goto(index, fragment = 'last') {
      const st = states[index];
      const nFrag = st.sec.querySelectorAll('.fragment').length;
      const f = fragment === 'last' ? nFrag - 1 : fragment;
      Reveal.slide(index, 0, nFrag ? f : undefined);
      enter(index);
      st.sec.querySelectorAll('video').forEach((v) => v.pause());
      await document.fonts.ready;
      await Promise.all([...st.sec.querySelectorAll('img')].map((im) => im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })));
      await nextFrame();
      return nFrag;
    },
    async seek(t) {
      const st = current;
      applyTime(st, t);
      await Promise.all([...st.sec.querySelectorAll('video')].map((v) => new Promise((r) => {
        const go = () => {
          const d = v.duration || 0;
          const target = d ? (v.loop ? t % d : Math.min(t, d - 0.05)) : 0;
          if (Math.abs(v.currentTime - target) < 0.001) return r();
          v.addEventListener('seeked', r, { once: true }); v.currentTime = target;
        };
        v.readyState >= 1 ? go() : v.addEventListener('loadedmetadata', go, { once: true });
      })));
      await nextFrame();
    },
    // PDF stills: show each video at its poster frame with a ▶ badge + file name
    async videoStills() {
      const st = current;
      for (const v of st.sec.querySelectorAll('video')) {
        await new Promise((r) => { const go = () => { const pt = v.dataset.posterT; v.addEventListener('seeked', r, { once: true }); v.currentTime = pt !== '' && pt != null ? +pt : (v.duration || 0) / 2; }; v.readyState >= 1 ? go() : v.addEventListener('loadedmetadata', go, { once: true }); });
        const frame = v.closest('.frame') || v.parentElement;
        if (!frame.querySelector('.play-badge')) frame.insertAdjacentHTML('beforeend', `<div class="play-badge"><span>▶</span><em>${esc(v.getAttribute('src').split('/').pop())}</em></div>`);
      }
      await nextFrame();
    },
  };
})();
