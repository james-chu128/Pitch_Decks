// Restaurant floor-plan schematic: two AMRs loop between the pass and tables; diners cross; elevator queue
const SC = [
  '尖峰人流：客人穿越走道、排隊等位',
  '臨時障礙：推車、清潔車、嬰兒車',
  '跨樓層電梯：進出順序與等待',
  '多台機器交會：出餐口、窄走道互讓',
  '派工與自動補位：車隊層級的調度',
];
const FLOW = ['記錄', '模擬重現', '修正', '回歸測試', '再部署'];
const P1 = [[120, 80], [120, 330], [470, 330], [470, 80], [120, 80]];
const P2 = [[160, 80], [320, 80], [320, 330], [540, 330], [540, 200], [580, 200]];
const along = (P, u) => { const seg = []; let L = 0;
  for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); L += d; }
  let s = (u % 1) * L; for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const k = s / seg[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * k, P[i][1] + (P[i + 1][1] - P[i][1]) * k]; } s -= seg[i]; }
  return P[P.length - 1]; };
const TABLES = []; for (const x of [200, 320, 420]) for (const y of [150, 250]) TABLES.push([x, y]);
Deck.slide({
  id: '2-5', kicker: '核心技術 ② 模擬測試', title: '現場測不完的情境，在模擬裡重複跑',
  anim: { type: 'loop', duration: 8 },
  html: `
    <div class="cols-2">
      <div class="stage framed">
        <svg viewBox="0 0 640 420" id="floor">
          <rect x="40" y="30" width="560" height="360" rx="8" fill="none" style="stroke:var(--viz-node-edge)" stroke-width="2"/>
          <rect x="60" y="45" width="130" height="40" rx="6" style="fill:var(--viz-node-fill);stroke:var(--viz-node-edge)"/>
          <text x="125" y="72" font-size="18" text-anchor="middle" style="fill:var(--viz-text)">出餐口</text>
          <rect x="550" y="160" width="46" height="80" rx="6" style="fill:var(--viz-node-fill);stroke:var(--viz-accent)" stroke-width="2"/>
          <text x="573" y="262" font-size="18" text-anchor="middle" style="fill:var(--viz-title)">電梯</text>
          <text x="320" y="410" font-size="18" text-anchor="middle" style="fill:var(--viz-muted)">入口</text>
          ${TABLES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" style="fill:var(--viz-node-fill);stroke:var(--viz-node-edge)"/>`).join('')}
          <polyline points="${P1.map((p) => p.join(',')).join(' ')}" fill="none" style="stroke:var(--viz-primary)" stroke-width="2" stroke-dasharray="6 6"/>
          <polyline points="${P2.map((p) => p.join(',')).join(' ')}" fill="none" style="stroke:var(--viz-accent)" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>
          <circle id="hot" cx="550" cy="200" r="34" fill="none" style="stroke:var(--viz-title)" stroke-width="3"/>
          <g id="people">${[0, 1, 2, 3, 4].map(() => '<circle r="7" style="fill:var(--viz-muted)"/>').join('')}</g>
          <rect id="amr1" x="-11" y="-11" width="22" height="22" rx="5" style="fill:var(--viz-title)"/>
          <rect id="amr2" x="-11" y="-11" width="22" height="22" rx="5" style="fill:var(--viz-accent)"/>
          <g transform="translate(60,385)"><rect width="14" height="14" rx="3" y="-12" style="fill:var(--viz-title)"/><text x="20" font-size="16" style="fill:var(--viz-muted)">AMR</text>
            <circle cx="88" cy="-5" r="6" style="fill:var(--viz-muted)"/><text x="100" font-size="16" style="fill:var(--viz-muted)">客人</text></g>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;min-height:0">
        <div class="card"><div class="card-head">寫成可重複的測試情境</div>
          <ul class="bullets">${SC.map((s) => `<li>${s}</li>`).join('')}</ul></div>
        <div class="card"><div class="card-head">現場失敗怎麼處理</div>
          <div class="chips">${FLOW.map((s, i) => `<span class="chip">${i + 1} ${s}</span>`).join('')}</div>
          <p style="color:var(--muted)">以 ROS 2 記錄現場運行資料，帶回模擬重現問題。</p></div>
      </div>
    </div>`,
  source: '示意動畫，非實際場域資料；多機排程與派工測試為延伸方向，尚未在場域驗證',
  mount(el, ctx) {
    const a1 = el.querySelector('#amr1'), a2 = el.querySelector('#amr2'), hot = el.querySelector('#hot');
    const ppl = [...el.querySelectorAll('#people circle')];
    const PP = [[[260, 380], [260, 60]], [[380, 60], [380, 380]], [[70, 200], [500, 200]], [[150, 360], [480, 120]], [[500, 360], [150, 110]]];
    ctx.onFrame((t) => {
      const [x1, y1] = along(P1, t / 8); a1.setAttribute('transform', `translate(${x1},${y1})`);
      const [x2, y2] = along(P2, (t / 8 + 0.35) % 1); a2.setAttribute('transform', `translate(${x2},${y2})`);
      ppl.forEach((c, i) => { const [[sx, sy], [ex, ey]] = PP[i]; const k = 0.5 - 0.5 * Math.cos((t / 8 + i * 0.2) * 2 * Math.PI);
        c.setAttribute('cx', sx + (ex - sx) * k); c.setAttribute('cy', sy + (ey - sy) * k); });
      hot.setAttribute('r', 30 + 6 * Math.sin(t * Math.PI));
      hot.setAttribute('opacity', 0.5 + 0.5 * Math.sin(t * Math.PI));
    });
  },
  notes: '',
});
