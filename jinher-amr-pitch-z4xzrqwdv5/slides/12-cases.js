const CASES = [
  ['醫院 AMR 物流驗證', '已交付評估', '新院區施工前，用設計圖建立數位孿生，驗證 AMR 路線、門寬與多機動線。', '季河的醫療 AMR 進新院區、新樓層前的標準檢查。', Deck.icon('hospital', { size: 30 })],
  ['伺服器風扇組裝', '已完成實機驗證', '實體手臂匯入模擬並虛實同步，組裝流程在模擬完成後於實機驗證。', '加手臂的送餐、炒菜機器人可沿用同一流程。', Deck.icon('cpu', { size: 30 })],
  ['長照輔具中心室內孿生', '已交付', '室內 3D 重建與網頁互動導覽，場景可瀏覽、物件可點擊說明。', '餐廳、飯店的室內場域可用同樣方式快速建模。', Deck.icon('house', { size: 30 })],
];
Deck.slide({
  id: '3-0', bg: 'tint', kicker: '已交付的場域案例', title: '同一套閉環，已在三個場域交付',
  html: `
    <style>.case .st { align-self: flex-start; } .case .map { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--hair-soft); color: var(--gold-hi); } .case .lab { font-size: 16pt; color: var(--gold); }</style>
    <div class="cards stretch">
      ${CASES.map(([h, st, t, m, ic], i) => `<div class="card case"><div class="card-top"><div class="num">${i + 1}</div><div class="card-head">${h}</div><span style="margin-left:auto;color:var(--gold)">${ic}</span></div>
        <span class="chip st">${st}</span><p>${t}</p><div class="map"><div class="lab">◆ 對季河的意義</div><p>${m}</p></div></div>`).join('')}
    </div>
    <div class="card" style="flex:0 0 auto;flex-direction:row;align-items:center;gap:16px">
      <span style="color:var(--gold)">${Deck.icon('lock', { size: 28 })}</span>
      <p style="color:var(--text)">為保護合作單位資料，以下三頁以示意圖呈現；實際畫面與成果於會議當天現場說明。</p>
    </div>`,
  notes: '',
});
