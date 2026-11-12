
const ST = [
  ['真實到模擬', '把場域與機器人搬進電腦', '照片或 BIM 建場域；機器人模型自動調參'],
  ['模擬測試', '在虛擬場域跑完各種情境', '尖峰人流、電梯、多機交會，可重複執行'],
  ['模擬到真實', '通過測試才部署到真機', '以 ROS 2 串接感測與控制，校正虛實落差'],
  ['現場回饋', '失敗帶回模擬重現與修正', '修正後跑回歸測試，再重新部署'],
];
const C = { x: 230, y: 230, r: 170 };
const arc = (i) => { const a0 = (-90 + i * 90 + 6) * Math.PI / 180, a1 = (-90 + (i + 1) * 90 - 6) * Math.PI / 180;
  return `M${C.x + C.r * Math.cos(a0)} ${C.y + C.r * Math.sin(a0)} A${C.r} ${C.r} 0 0 1 ${C.x + C.r * Math.cos(a1)} ${C.y + C.r * Math.sin(a1)}`; };
const mid = (i, rr) => { const a = (-90 + i * 90 + 45) * Math.PI / 180; return [C.x + rr * Math.cos(a), C.y + rr * Math.sin(a)]; };
Deck.slide({
  id: '1-2', bg: 'tint', kicker: '我們的方法', title: 'Real-to-Sim-to-Real：四個階段，一個閉環',
  anim: { type: 'once', duration: 4 },
  html: `
    <div class="cols-46">
      <div class="stage">
        <svg viewBox="0 0 460 460" id="ring4" style="max-height:100%">
          <defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" style="fill:var(--viz-accent)"/></marker>
            <filter id="g4"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          ${ST.map((_, i) => `<path class="seg" d="${arc(i)}" fill="none" style="stroke:var(--viz-accent)" stroke-width="10" stroke-linecap="round" marker-end="url(#ah)" filter="url(#g4)"/>`).join('')}
          ${ST.map((_, i) => { const [x, y] = mid(i, C.r); return `<g class="badge"><circle cx="${x}" cy="${y}" r="26" style="fill:var(--viz-num-fill)"/><text x="${x}" y="${y + 9}" font-size="24" font-weight="700" text-anchor="middle" style="fill:var(--viz-num-text)">${i + 1}</text></g>`; }).join('')}
          <text x="${C.x}" y="${C.y - 6}" font-size="26" font-weight="700" text-anchor="middle" style="fill:var(--viz-title)">持續改善</text>
          <text x="${C.x}" y="${C.y + 26}" font-size="21" text-anchor="middle" style="fill:var(--viz-muted)">的閉環</text>
        </svg>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:18px;min-height:0">
        ${ST.map(([h, t, d], i) => `<div class="card step"><div class="card-top"><div class="num">${i + 1}</div><div class="card-head">${h}</div></div><p style="color:var(--text)">${t}</p><p style="color:var(--muted)">${d}</p></div>`).join('')}
      </div>
    </div>`,
  source: '流程內容整理自 IGVI Group AMR Real-Sim-Real 簡報（2026-10）；部署以 ROS 2 串接感測與控制',
  mount(el, ctx) {
    gsap.registerPlugin(DrawSVGPlugin);
    const tl = gsap.timeline();
    const segs = el.querySelectorAll('.seg'), badges = el.querySelectorAll('.badge'), steps = el.querySelectorAll('.step');
    segs.forEach((s, i) => {
      tl.from(s, { drawSVG: '0%', duration: 0.6, ease: 'power1.inOut' }, i * 0.7)
        .from(badges[i], { opacity: 0, scale: 0.5, transformOrigin: '50% 50%', duration: 0.3 }, i * 0.7 + 0.3)
        .from(steps[i], { opacity: 0, x: 30, duration: 0.4 }, i * 0.7 + 0.2);
    });
    ctx.timeline(tl);
  },
  notes: '',
});
