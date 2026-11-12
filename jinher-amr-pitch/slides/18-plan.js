const PH = [
  ['階段 0', '約 1 個月', '確認機型、場域與資料範圍；簽訂合作與保密條款'],
  ['階段 1', '3–6 個月', '一台機器人、一個場域的驗證案（方向 B 為主）'],
  ['階段 2', '多年期', '擴大到 A、C；共同申請政府計畫（如智慧雨林、大南方新矽谷相關計畫）'],
];
const NEED = ['機器人規格與 3D 模型', 'ROS 2 或導航系統介面', '一個場域的平面圖與進場許可', '機器人運行紀錄'];
Deck.slide({
  id: '4-3', bg: 'tint', kicker: '合作提案', title: '合作方式與時程',
  anim: { type: 'once', duration: 3 },
  html: `
    <div class="cards" id="phases">
      ${PH.map(([h, d, t], i) => `<div class="card ph"><div class="card-top"><div class="num">${i}</div><div class="card-head">${h}</div><span class="chip" style="margin-left:auto">${d}</span></div><p>${t}</p></div>`).join('')}
    </div>
    <div class="cols-2" style="flex:1;min-height:0">
      <div class="card"><div class="card-head">需要季河提供</div><ul class="bullets">${NEED.map((n) => `<li>${n}</li>`).join('')}</ul></div>
      <div class="card"><div class="card-head">IGVI 提供</div><ul class="bullets"><li>場域與機器人孿生建置</li><li>自動運動測試與 Agent 調參工具</li><li>情境測試與校正方法</li><li>研究人力與 NVIDIA 模擬工具鏈</li></ul></div>
    </div>`,
  mount(el, ctx) {
    const tl = gsap.timeline();
    tl.from(el.querySelectorAll('.ph'), { opacity: 0, x: -30, stagger: 0.4, duration: 0.5 });
    ctx.timeline(tl);
  },
  notes: '',
});
