const DIR = [
  ['A', '導入前場域檢查', '平面圖或現場拍攝 → 場域孿生 → 路線、門寬、電梯動線報告。', '機器人進場前就知道哪裡會卡，減少現場調機次數。'],
  ['B', '季河機器人孿生', '規格與實測軌跡 → 自動運動測試與 Agent 調參 → 與真機一致的模擬模型。', '一套可重複使用的機器人模型，是 A 和 C 的基礎。'],
  ['C', '車隊回歸測試', '派工平台接上模擬車隊，測尖峰、互鎖、電梯、自動補位；每次改版前先跑。', '軟體更新上線前先在模擬驗證，降低現場出錯。'],
];
Deck.slide({
  id: '4-2', kicker: '合作提案', title: '三個合作方向',
  html: `
    <style>.dir .gain { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--hair-soft); } .dir .gain .lab { font-size: 16pt; color: var(--gold); } .dir .gain p { color: var(--gold-hi); }</style>
    <div class="cards stretch">
      ${DIR.map(([n, h, t, g]) => `<div class="card dir"><div class="card-top"><div class="num">${n}</div><div class="card-head">${h}</div><span class="chip" style="margin-left:auto;white-space:nowrap;flex:0 0 auto">提案</span></div>
        <p>${t}</p><div class="gain"><div class="lab">◆ 季河得到</div><p>${g}</p></div></div>`).join('')}
    </div>
    <div class="card" style="flex:0 0 auto;flex-direction:row;align-items:center;gap:16px">
      <span style="color:var(--gold)">${Deck.icon('flag', { size: 28 })}</span>
      <p style="color:var(--text)">建議從 <b style="color:var(--gold-hi)">B</b> 開始：先做出一台與真機一致的機器人孿生，A 與 C 都建立在它之上。</p>
    </div>`,
  notes: '',
});
