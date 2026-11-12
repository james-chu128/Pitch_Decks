// Hospital floor schematic: corridors coloured by clearance risk, door warnings, AMR route
Deck.slide({
  id: '3-1', kicker: '已交付案例 ① 已交付評估', title: '醫院 AMR 物流：大樓還沒蓋好，就先驗證',
  anim: { type: 'loop', duration: 8 },
  html: `
    <div class="cols-2">
      <div class="stage framed">
        <svg viewBox="0 0 600 420" id="hosp">
          <defs><linearGradient id="heat" x1="0" x2="1"><stop offset="0" style="stop-color:var(--viz-primary)"/><stop offset=".55" style="stop-color:var(--viz-accent)"/><stop offset="1" style="stop-color:var(--viz-title)"/></linearGradient></defs>
          <rect x="30" y="30" width="540" height="350" rx="6" fill="none" style="stroke:var(--viz-node-edge)" stroke-width="2"/>
          ${[[60, 60, 140, 90], [230, 60, 140, 90], [400, 60, 140, 90], [60, 260, 140, 90], [230, 260, 140, 90], [400, 260, 140, 90]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" style="fill:var(--viz-node-fill);stroke:var(--viz-node-edge)"/>`).join('')}
          <rect x="45" y="170" width="510" height="70" rx="4" fill="url(#heat)" opacity=".55"/>
          <rect x="200" y="60" width="30" height="290" rx="4" fill="url(#heat)" opacity=".35"/>
          <rect x="370" y="60" width="30" height="290" rx="4" fill="url(#heat)" opacity=".35"/>
          <path id="route" d="M70 205 H530 M385 205 V90 M215 205 V320" fill="none" style="stroke:var(--viz-text)" stroke-width="2" stroke-dasharray="7 7"/>
          ${[[385, 150], [215, 255], [470, 240]].map(([x, y]) => `<g class="warn" transform="translate(${x},${y})"><circle r="16" style="fill:var(--viz-num-fill)"/><text y="7" font-size="20" font-weight="700" text-anchor="middle" style="fill:var(--viz-num-text)">!</text></g>`).join('')}
          <rect id="bot" x="-10" y="-10" width="20" height="20" rx="4" style="fill:var(--viz-title)"/>
          <g transform="translate(45,405)"><rect width="120" height="12" y="-10" rx="3" fill="url(#heat)"/><text x="130" font-size="16" style="fill:var(--viz-muted)">通行餘裕：寬 → 窄</text>
            <circle cx="330" cy="-4" r="8" style="fill:var(--viz-num-fill)"/><text x="344" font-size="16" style="fill:var(--viz-muted)">門寬不足</text></g>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;min-height:0">
        <div class="card"><div class="card-head">情境</div><p>教學醫院新建大樓，施工前以設計圖建立數位孿生。</p></div>
        <div class="card"><div class="card-head">我們做了</div><ul class="bullets"><li>AMR 路線模擬與定位容差分析</li><li>門框與走道淨寬檢查</li><li>多機會車與行人情境</li></ul></div>
        <div class="card"><div class="card-head">交付與意義</div><p>施工前評估報告，問題在圖面階段修正。季河的醫療 AMR 進新院區、新樓層前，可用同一套檢查。</p></div>
      </div>
    </div>`,
  source: '示意圖，非實際院區圖面；實際成果於會議當天現場說明',
  mount(el, ctx) {
    const bot = el.querySelector('#bot'), warns = el.querySelectorAll('.warn');
    const P = [[70, 205], [385, 205], [385, 90], [385, 205], [530, 205], [215, 205], [215, 320], [215, 205], [70, 205]];
    const seg = []; let L = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); L += d; }
    ctx.onFrame((t) => {
      let s = ((t / 8) % 1) * L; let x = P[0][0], y = P[0][1];
      for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const k = s / seg[i]; x = P[i][0] + (P[i + 1][0] - P[i][0]) * k; y = P[i][1] + (P[i + 1][1] - P[i][1]) * k; break; } s -= seg[i]; }
      bot.setAttribute('transform', `translate(${x},${y})`);
      warns.forEach((w, i) => w.setAttribute('opacity', 0.55 + 0.45 * Math.sin(t * Math.PI + i)));
    });
  },
  notes: '',
});
