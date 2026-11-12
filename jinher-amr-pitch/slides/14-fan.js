// Fan assembly schematic: sim and real panels moving in sync
const arm = (id) => `<g id="${id}">
  <rect x="-40" y="150" width="80" height="24" rx="4" style="fill:var(--viz-node-edge)"/>
  <line class="l1" x1="0" y1="150" x2="0" y2="60" style="stroke:var(--viz-text)" stroke-width="10" stroke-linecap="round"/>
  <line class="l2" x1="0" y1="60" x2="70" y2="60" style="stroke:var(--viz-text)" stroke-width="8" stroke-linecap="round"/>
  <circle class="j" cx="0" cy="60" r="9" style="fill:var(--viz-accent)"/>
  <g class="fan"><rect x="-22" y="-22" width="44" height="44" rx="6" style="fill:var(--viz-node-fill);stroke:var(--viz-accent)" stroke-width="2"/><circle r="14" fill="none" style="stroke:var(--viz-accent)" stroke-width="2"/></g>
</g>`;
const panel = (x, label, id) => `<g transform="translate(${x},40)">
  <rect width="250" height="300" rx="10" style="fill:var(--viz-3d-bg);stroke:var(--viz-node-edge)"/>
  <text x="125" y="34" font-size="20" font-weight="700" text-anchor="middle" style="fill:var(--viz-title)">${label}</text>
  <rect x="150" y="190" width="80" height="80" rx="6" fill="none" style="stroke:var(--viz-muted)" stroke-dasharray="5 5"/>
  <text x="190" y="290" font-size="16" text-anchor="middle" style="fill:var(--viz-muted)">機櫃槽位</text>
  <g transform="translate(70,90)">${arm(id)}</g></g>`;
Deck.slide({
  id: '3-2', kicker: '已交付案例 ② 已完成實機驗證', title: '伺服器風扇組裝：同一套閉環用在機械手臂',
  anim: { type: 'loop', duration: 6 },
  html: `
    <div class="cols-2">
      <div class="stage framed">
        <svg viewBox="0 0 600 400">
          ${panel(30, '模擬', 'armS')}${panel(320, '實機', 'armR')}
          <g transform="translate(300,190)"><text y="-14" font-size="17" text-anchor="middle" style="fill:var(--viz-accent)">虛實同步</text>
            <path d="M-26 0 H26 M16 -8 L26 0 L16 8 M-16 -8 L-26 0 L-16 8" fill="none" style="stroke:var(--viz-accent)" stroke-width="3"/></g>
          <text x="300" y="380" font-size="16" text-anchor="middle" style="fill:var(--viz-muted)">模擬中完成組裝流程 → 實機驗證</text>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;min-height:0">
        <div class="card"><div class="card-head">情境</div><p>伺服器機櫃風扇組裝，安裝失敗率高，靠人工經驗。</p></div>
        <div class="card"><div class="card-head">我們做了</div><ul class="bullets"><li>6D 姿態估測：看懂零件位置與方向</li><li>順應式插入：用力回饋避免硬碰撞</li><li>模仿學習：從人類示範學動作</li></ul></div>
        <div class="card"><div class="card-head">交付與意義</div><p>模擬完成組裝流程並在實機驗證。季河的送餐、炒菜等加手臂的機器人，可沿用同一套流程。</p></div>
      </div>
    </div>`,
  source: '示意圖，非實際產線畫面；實際成果於會議當天現場說明',
  mount(el, ctx) {
    const parts = ['armS', 'armR'].map((id) => { const g = el.querySelector('#' + id); return { l1: g.querySelector('.l1'), l2: g.querySelector('.l2'), j: g.querySelector('.j'), fan: g.querySelector('.fan') }; });
    ctx.onFrame((t) => {
      const k = 0.5 - 0.5 * Math.cos((t / 6) * 2 * Math.PI);
      const jx = 20 * k, jy = 60 + 50 * k, ex = jx + 70 + 50 * k, ey = jy + 40 * k;
      parts.forEach((p, i) => { const lag = i ? 0.02 : 0; const kk = k - lag;
        p.l1.setAttribute('x2', jx); p.l1.setAttribute('y2', jy); p.j.setAttribute('cx', jx); p.j.setAttribute('cy', jy);
        p.l2.setAttribute('x1', jx); p.l2.setAttribute('y1', jy); p.l2.setAttribute('x2', ex); p.l2.setAttribute('y2', ey);
        p.fan.setAttribute('transform', `translate(${ex},${ey + 26}) rotate(${kk * 0})`); });
    });
  },
  notes: '',
});
