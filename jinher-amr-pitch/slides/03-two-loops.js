// Two interlocking loops: JINHER operations loop × IGVI physical loop; shared node = the robot
const L = { cx: 230, cy: 200, r: 150 }, R = { cx: 490, cy: 200, r: 150 };
const pt = (c, deg) => [c.cx + c.r * Math.cos(deg * Math.PI / 180), c.cy + c.r * Math.sin(deg * Math.PI / 180)];
const pill = (x, y, text, w) => `
  <g class="node" transform="translate(${x},${y})">
    <rect x="${-w / 2}" y="-24" width="${w}" height="48" rx="24" style="fill:var(--viz-node-fill);stroke:var(--viz-node-edge)" stroke-width="1.5"/>
    <text y="8" font-size="21" text-anchor="middle" style="fill:var(--viz-text)">${text}</text>
  </g>`;
const LN = [[-110, '點餐與派工'], [180, '優化動線'], [110, '營運數據']];
const RN = [[-70, '場域重建'], [0, '模擬測試'], [70, '校正部署']];
Deck.slide({
  id: '0-3', kicker: '為什麼是季河 × IGVI', title: '兩個閉環，同一台機器人',
  anim: { type: 'once', duration: 5 },
  html: `
    <style>
      .loops3 { display: grid; grid-template-columns: 1fr 2.3fr 1fr; gap: 20px; flex: 1; min-height: 0; align-items: stretch; }
      .loops3 .card { justify-content: center; }
      .loops3 .stage { height: 100%; min-height: 0; }
      .loops3 .stage svg { width: 100%; height: 100%; }
      .loops3 .tag { display: inline-block; width: 14px; height: 14px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
    </style>
    <div class="loops3">
      <div class="card"><div class="card-head"><span class="tag" style="background:var(--viz-primary)"></span>季河｜營運閉環</div>
        <ul class="bullets"><li>真實場域：餐廳、飯店、醫院</li><li>機器人車隊與派工平台</li><li>營運數據回饋派工與動線</li><li>POS → SaaS → AI → ROS 已整合</li></ul></div>
      <div class="stage">
        <svg viewBox="0 0 720 400" id="loops">
          <defs><filter id="g3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <circle class="ring" cx="${L.cx}" cy="${L.cy}" r="${L.r}" fill="none" style="stroke:var(--viz-primary)" stroke-width="6"/>
          <circle class="ring" cx="${R.cx}" cy="${R.cy}" r="${R.r}" fill="none" style="stroke:var(--viz-accent)" stroke-width="6" filter="url(#g3)"/>
          <circle id="dotL" r="9" style="fill:var(--viz-muted)"/>
          <circle id="dotR" r="9" style="fill:var(--viz-title)" filter="url(#g3)"/>
          ${LN.map(([d, t]) => { const [x, y] = pt(L, d); return pill(x, y, t, 140); }).join('')}
          ${RN.map(([d, t]) => { const [x, y] = pt(R, d); return pill(x, y, t, 140); }).join('')}
          <g class="hub" transform="translate(360,200)">
            <rect x="-92" y="-30" width="184" height="60" rx="30" style="fill:var(--viz-num-fill)"/>
            <text y="9" font-size="23" font-weight="700" text-anchor="middle" style="fill:var(--viz-num-text)">同一台機器人</text>
          </g>
        </svg>
      </div>
      <div class="card"><div class="card-head"><span class="tag" style="background:var(--viz-accent)"></span>IGVI｜物理閉環</div>
        <ul class="bullets"><li>把場域與機器人搬進電腦</li><li>上場前先跑完各種情境</li><li>校正到與真機反應一致</li><li>現場失敗帶回模擬修正</li></ul></div>
    </div>
    <div class="card" style="flex:0 0 auto;flex-direction:row;align-items:center;gap:16px">
      <p style="font-size:18pt;color:var(--text)">季河的場域與車隊 × IGVI 的虛擬試車場</p>
      <div class="chips" style="margin-left:auto"><span class="chip">上線更快</span><span class="chip">現場出錯更少</span><span class="chip">新場域可複製</span></div>
    </div>`,
  mount(el, ctx) {
    gsap.registerPlugin(DrawSVGPlugin);
    const tl = gsap.timeline();
    tl.from(el.querySelectorAll('.ring'), { drawSVG: '0%', duration: 1.2, stagger: 0.4, ease: 'power2.inOut' })
      .from(el.querySelectorAll('.node'), { opacity: 0, scale: 0.85, transformOrigin: '50% 50%', stagger: 0.12, duration: 0.4 }, 0.8)
      .from(el.querySelector('.hub'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)' }, 2.2);
    ctx.timeline(tl);
    const dl = el.querySelector('#dotL'), dr = el.querySelector('#dotR');
    ctx.onFrame((t) => {
      const a = (-110 - t * 60) * Math.PI / 180, b = (-70 + t * 60) * Math.PI / 180;
      dl.setAttribute('cx', L.cx + L.r * Math.cos(a)); dl.setAttribute('cy', L.cy + L.r * Math.sin(a));
      dr.setAttribute('cx', R.cx + R.r * Math.cos(b)); dr.setAttribute('cy', R.cy + R.r * Math.sin(b));
    });
  },
  notes: '',
});
