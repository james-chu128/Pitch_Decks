// Indoor twin schematic: rooms + clickable hotspots with a popup
const ROOMS = [[40, 40, 220, 150, '臥室'], [270, 40, 160, 150, '衛浴'], [440, 40, 120, 150, '辦公室'], [40, 200, 300, 160, '客廳'], [350, 200, 210, 160, '餐廳']];
const HOT = [[150, 120], [350, 110], [500, 120], [180, 290], [450, 280]];
const INFO = ['床：升降與翻身輔助', '便盆椅：使用說明', '電話：抬起話筒示範', '扶手架：多功能說明', '餐具：輔助進食器具'];
Deck.slide({
  id: '3-3', kicker: '已交付案例 ③ 已交付', title: '長照輔具中心：室內數位孿生與互動導覽',
  anim: { type: 'loop', duration: 10 },
  html: `
    <div class="cols-2">
      <div class="stage framed">
        <svg viewBox="0 0 600 420">
          ${ROOMS.map(([x, y, w, h, n]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:var(--viz-node-fill);stroke:var(--viz-node-edge)"/><text x="${x + 12}" y="${y + h - 14}" font-size="18" style="fill:var(--viz-muted)">${n}</text>`).join('')}
          ${HOT.map(([x, y], i) => `<g class="hs" transform="translate(${x},${y})"><circle class="rp" r="16" fill="none" style="stroke:var(--viz-title)" stroke-width="2"/><circle r="9" style="fill:var(--viz-title)"/></g>`).join('')}
          <g id="pop"><rect x="-120" y="-56" width="240" height="44" rx="8" style="fill:var(--viz-num-fill)"/><text id="popt" y="-27" font-size="18" font-weight="700" text-anchor="middle" style="fill:var(--viz-num-text)"></text></g>
          <text x="300" y="400" font-size="16" text-anchor="middle" style="fill:var(--viz-muted)">網頁即時瀏覽：場景切換、點擊物件看說明與開合動畫</text>
        </svg>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;min-height:0">
        <div class="card"><div class="card-head">情境</div><p>政府委託案，為長照輔具中心建立室內 3D 孿生。</p></div>
        <div class="card"><div class="card-head">我們做了</div><ul class="bullets"><li>室內 3D 重建（3DGS），保留真實外觀</li><li>網頁即時瀏覽與場景切換</li><li>物件點擊說明與開合動畫</li></ul></div>
        <div class="card"><div class="card-head">交付與意義</div><p>網頁版互動導覽系統。餐廳、飯店也能用同樣方式快速建模，作為機器人測試場景與導入前溝通工具。</p></div>
      </div>
    </div>`,
  source: '示意圖，非實際場域格局；實際成果於會議當天現場說明',
  mount(el, ctx) {
    const pop = el.querySelector('#pop'), popt = el.querySelector('#popt'), rps = el.querySelectorAll('.rp');
    ctx.onFrame((t) => {
      const i = Math.floor(t / 2) % HOT.length, ph = (t % 2) / 2;
      const [x, y] = HOT[i];
      pop.setAttribute('transform', `translate(${Math.min(470, Math.max(130, x))},${y})`);
      pop.setAttribute('opacity', ph < 0.85 ? 1 : (1 - ph) / 0.15);
      popt.textContent = INFO[i];
      rps.forEach((r, j) => { const p = ((t + j * 0.4) % 1.6) / 1.6; r.setAttribute('r', 10 + 16 * p); r.setAttribute('opacity', 1 - p); });
    });
  },
  notes: '',
});
