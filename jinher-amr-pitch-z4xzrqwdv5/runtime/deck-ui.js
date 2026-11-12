/* deck-ui.js — presenter tools for HTML decks (never shown while exporting / recording).
 *
 *   Toolbar (appears when the mouse moves, hides after 2.5 s):
 *     ☰ 目錄   ‹ 3 / 24 ›   備忘稿   雷射筆   全螢幕
 *   Keys:  G 目錄（輸入頁碼＋Enter 直接跳頁）· M 備忘稿模式 · L 雷射筆 · F 全螢幕 · S 雙螢幕講者視窗（reveal 內建）
 *
 *   目錄     every slide with its outline number and title, grouped by section; filter box; click to jump
 *   備忘稿   slide on the left, notes on the right (current notes large, next slide title, elapsed timer,
 *            clock, text size A− / A+); state of size remembered per browser
 *   雷射筆   red glowing dot with a short fading trail that follows the pointer over the slide
 */
(function () {
  'use strict';
  if (!window.Deck || window.Deck.exporting) return;

  const store = {
    get(k, d) { try { const v = localStorage.getItem('deck-ui:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('deck-ui:' + k, JSON.stringify(v)); } catch (e) {} },
  };
  const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const strip = (h) => { const d = document.createElement('div'); d.innerHTML = h || ''; return d.textContent.trim(); };

  function init() {
    const slides = window.__deck.list();
    const total = slides.length;
    const titleOf = (i) => {
      const s = slides[i]; if (!s) return '';
      if (s.title) return strip(s.title);
      const sec = document.querySelectorAll('.reveal .slides > section')[i];
      const h = sec && sec.querySelector('h1, h2');
      return h ? h.textContent.trim() : '（無標題）';
    };

    // ------------------------------------------------------------------ DOM
    const ui = document.createElement('div');
    ui.className = 'deck-ui';
    ui.innerHTML = `
      <div class="dui-bar" role="toolbar" aria-label="簡報工具列">
        <button class="dui-btn" data-act="toc" title="目錄（G）" aria-label="目錄">☰<span>目錄</span></button>
        <span class="dui-sep"></span>
        <button class="dui-btn" data-act="prev" title="上一頁（←）" aria-label="上一頁">‹</button>
        <span class="dui-page" aria-live="polite"><b class="dui-cur">1</b> / ${total}</span>
        <button class="dui-btn" data-act="next" title="下一頁（→）" aria-label="下一頁">›</button>
        <span class="dui-sep"></span>
        <button class="dui-btn" data-act="notes" title="備忘稿模式（M）" aria-pressed="false">✎<span>備忘稿</span></button>
        <button class="dui-btn" data-act="laser" title="雷射筆（L）" aria-pressed="false"><i class="dui-dot"></i><span>雷射筆</span></button>
        <button class="dui-btn" data-act="full" title="全螢幕（F）" aria-label="全螢幕">⛶</button>
      </div>
      <div class="dui-toc" hidden>
        <div class="dui-toc-head"><input class="dui-filter" id="dui-filter" type="search" placeholder="輸入頁碼或關鍵字，Enter 跳頁" aria-label="搜尋投影片"><button class="dui-btn dui-close" data-act="toc" aria-label="關閉目錄">✕</button></div>
        <ol class="dui-list"></ol>
      </div>
      <aside class="dui-notes" hidden>
        <div class="dui-notes-top">
          <div class="dui-timer" title="點一下暫停／繼續"><span class="dui-elapsed">00:00</span><small>經過時間</small></div>
          <div class="dui-clock"><span class="dui-now">--:--</span><small>現在時間</small></div>
          <div class="dui-notes-tools">
            <button class="dui-btn" data-act="reset" title="計時歸零">↺</button>
            <button class="dui-btn" data-act="smaller" title="字小一點">A−</button>
            <button class="dui-btn" data-act="bigger" title="字大一點">A+</button>
          </div>
        </div>
        <div class="dui-notes-cur"><div class="dui-notes-label"></div><div class="dui-notes-text"></div></div>
        <div class="dui-notes-next"><small>下一頁</small><div class="dui-next-title"></div></div>
      </aside>
      <div class="dui-laser" hidden></div>`;
    document.body.appendChild(ui);
    const $ = (s) => ui.querySelector(s);
    const bar = $('.dui-bar'), toc = $('.dui-toc'), list = $('.dui-list'), filter = $('.dui-filter');
    const notes = $('.dui-notes'), laser = $('.dui-laser');

    // ------------------------------------------------------------------ table of contents
    let lastGroup = null;
    list.innerHTML = slides.map((s, i) => {
      const grp = String(s.id || '').split('-')[0];
      const head = grp !== lastGroup && slides.length > 8 ? `<li class="dui-group">${grp === '0' ? '開場' : `段落 ${esc(grp)}`}</li>` : '';
      lastGroup = grp;
      return `${head}<li><button class="dui-item" data-go="${i}"><span class="dui-n">${i + 1}</span><span class="dui-t">${esc(titleOf(i))}</span><span class="dui-id">${esc(s.id)}</span></button></li>`;
    }).join('');
    const openToc = (on) => {
      toc.hidden = !on;
      if (on) { filter.value = ''; applyFilter(); filter.focus(); const cur = list.querySelector(`[data-go="${Reveal.getState().indexh}"]`); cur && cur.scrollIntoView({ block: 'center' }); }
    };
    const applyFilter = () => {
      const q = filter.value.trim().toLowerCase();
      list.querySelectorAll('.dui-item').forEach((b) => { b.parentElement.hidden = !!q && !/^\d+$/.test(q) && !b.textContent.toLowerCase().includes(q); });
      list.querySelectorAll('.dui-group').forEach((g) => { g.hidden = !!q; });
    };
    filter.addEventListener('input', applyFilter);
    filter.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = filter.value.trim();
        const n = /^\d+$/.test(q) ? +q - 1 : (() => { const b = [...list.querySelectorAll('.dui-item')].find((x) => !x.parentElement.hidden); return b ? +b.dataset.go : -1; })();
        if (n >= 0 && n < total) { Reveal.slide(n); openToc(false); }
      }
      if (e.key === 'Escape') openToc(false);
      e.stopPropagation();
    });
    list.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) { Reveal.slide(+b.dataset.go); openToc(false); } });

    // ------------------------------------------------------------------ notes mode
    let fontSize = store.get('notes-size', 22);
    let t0 = Date.now(), paused = false, pausedAt = 0;
    const fmt = (ms) => { const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = s % 60; return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0'); };
    const renderNotes = () => {
      const i = Reveal.getState().indexh, s = slides[i];
      $('.dui-notes-label').textContent = `${i + 1} / ${total}　${titleOf(i)}`;
      const txt = $('.dui-notes-text');
      txt.innerHTML = s && s.notes ? esc(s.notes).replace(/\n/g, '<br>') : '<em>（本頁沒有備忘稿）</em>';
      txt.style.fontSize = fontSize + 'px';
      $('.dui-next-title').textContent = i + 1 < total ? `${i + 2}　${titleOf(i + 1)}` : '（最後一頁）';
    };
    const setNotes = (on) => {
      document.body.classList.toggle('deck-notes-mode', on);
      notes.hidden = !on;
      $('[data-act="notes"]').setAttribute('aria-pressed', on);
      store.set('notes-on', on);
      if (on) renderNotes();
      requestAnimationFrame(() => Reveal.layout());
    };
    setInterval(() => {
      const now = new Date();
      $('.dui-now').textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      $('.dui-elapsed').textContent = fmt((paused ? pausedAt : Date.now()) - t0);
    }, 500);
    $('.dui-timer').addEventListener('click', () => { if (paused) { t0 += Date.now() - pausedAt; paused = false; } else { pausedAt = Date.now(); paused = true; } $('.dui-timer').classList.toggle('paused', paused); });

    // ------------------------------------------------------------------ laser pointer
    let laserOn = false, trail = [];
    const slidesEl = document.querySelector('.reveal');
    const setLaser = (on) => {
      laserOn = on;
      document.body.classList.toggle('deck-laser', on);
      laser.hidden = !on;
      $('[data-act="laser"]').setAttribute('aria-pressed', on);
      if (!on) { trail.forEach((t) => t.remove()); trail = []; }
    };
    window.addEventListener('pointermove', (e) => {
      if (!laserOn) return;
      const r = slidesEl.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && !e.target.closest('.dui-bar, .dui-notes, .dui-toc');
      laser.style.opacity = inside ? 1 : 0;
      laser.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (!inside) return;
      const t = document.createElement('i'); t.className = 'dui-trail'; t.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      ui.appendChild(t); trail.push(t);
      setTimeout(() => { t.remove(); trail = trail.filter((x) => x !== t); }, 260);
    }, { passive: true });

    // ------------------------------------------------------------------ toolbar visibility, actions, keys
    let hideTimer = null;
    const showBar = () => { ui.classList.add('dui-show'); clearTimeout(hideTimer); hideTimer = setTimeout(() => { if (!bar.matches(':hover') && toc.hidden) ui.classList.remove('dui-show'); }, 2500); };
    window.addEventListener('pointermove', showBar, { passive: true });
    const fullscreen = () => { const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); p && p.catch(() => {}); };
    ui.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'toc') openToc(toc.hidden);
      else if (a === 'prev') Reveal.prev();
      else if (a === 'next') Reveal.next();
      else if (a === 'notes') setNotes(notes.hidden);
      else if (a === 'laser') setLaser(!laserOn);
      else if (a === 'full') fullscreen();
      else if (a === 'reset') { t0 = Date.now(); pausedAt = t0; }
      else if (a === 'smaller' || a === 'bigger') { fontSize = Math.max(14, Math.min(44, fontSize + (a === 'bigger' ? 2 : -2))); store.set('notes-size', fontSize); renderNotes(); }
      b.blur();
    });
    window.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const own = { g: () => openToc(toc.hidden), m: () => setNotes(notes.hidden), l: () => setLaser(!laserOn) }[k];
      if (own) { own(); e.preventDefault(); e.stopPropagation(); }   // reveal maps L to "next slide": keep it ours
      else if (k === 'escape' && !toc.hidden) { openToc(false); e.stopPropagation(); }
    }, true);

    const sync = () => { $('.dui-cur').textContent = Reveal.getState().indexh + 1; if (!notes.hidden) renderNotes(); };
    Reveal.on('slidechanged', sync);
    sync();
    if (store.get('notes-on', false)) setNotes(true);
    showBar();
  }

  if (window.__deckReady) init(); else window.addEventListener('deck:ready', init, { once: true });
})();
