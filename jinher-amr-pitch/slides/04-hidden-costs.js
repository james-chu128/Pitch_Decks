const COSTS = [
  ['現場試錯', '營業時間不能停，調機只能趁打烊或離峰。', '在電腦裡調好參數再進場，現場只做確認。', Deck.icon('clock', { size: 26 })],
  ['情境測不完', '尖峰人流、電梯互等、多台機器交會，很難在現場刻意重現。', '情境寫成測試案例，想跑幾次就跑幾次。', Deck.icon('users', { size: 26 })],
  ['失敗難追查', '客訴發生時現場已恢復原狀，事後無法穩定重現。', '運行紀錄帶回模擬，重現、修正、再驗證。', Deck.icon('search', { size: 26 })],
  ['擴點難複製', '每個新門市、新樓層都要重新調一次，經驗留在人身上。', '新場域套用同一套流程與測試。', Deck.icon('copy', { size: 26 })],
];
Deck.slide({
  id: '1-1', kicker: '為什麼需要', title: '服務型 AMR 導入的四個隱藏成本',
  html: `
    <style>
      .cost .fix { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--hair-soft); }
      .cost .lab { font-size: 16pt; letter-spacing: .08em; color: var(--gold); font-family: var(--mono); }
      .cost .fix p { color: var(--gold-hi); }
    </style>
    <div class="cards stretch">
      ${COSTS.map(([h, t, f, ic], i) => `<div class="card cost"><div class="card-top"><div class="num">${i + 1}</div><div class="card-head">${h}</div><span style="margin-left:auto;color:var(--gold)">${ic}</span></div>
        <p>${t}</p><div class="fix"><div class="lab">◆ 數位孿生怎麼解</div><p>${f}</p></div></div>`).join('')}
    </div>
    <div class="card" style="flex:0 0 auto;flex-direction:row;align-items:center;gap:18px">
      <span style="color:var(--gold)">${Deck.icon('arrow-right-circle', { size: 34 })}</span>
      <p style="font-size:18pt;color:var(--text)">把場域與機器人搬進電腦，該測的情境先跑完，再到現場。</p>
    </div>`,
  notes: '',
});
