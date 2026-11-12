const ROWS = [
  ['場域', '餐廳、飯店、醫院的真實場域與進場經驗', '拍照或 BIM 快速建立場域孿生'],
  ['機器人', '機器人車隊、派工平台、自動補位', '機器人孿生、自動測試與 Agent 調參'],
  ['資料', '營運數據與機器人運行紀錄', '情境測試庫與現場失敗重播'],
  ['落地', '場域 SOP 與客戶關係', '虛實校正與完整模擬工具鏈'],
];
Deck.slide({
  id: '4-1', kicker: '合作提案', title: '雙方各自帶來什麼',
  html: `
    <style>.big td, .big th { padding: 12px 14px !important; font-size: 18pt; }</style>
    <table class="tbl big">
      <thead><tr><th style="width:14%"></th><th>季河資訊</th><th>清華 IGVI Group</th></tr></thead>
      <tbody>${ROWS.map(([k, a, b]) => `<tr><td><b>${k}</b></td><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody>
    </table>
    <div class="cols-2" style="flex:0 0 auto">
      <div class="card"><div class="card-top"><span style="color:var(--gold)">${Deck.icon('handshake', { size: 26 })}</span><div class="card-head">一句話</div></div>
        <p style="color:var(--gold-hi)">季河最懂場域；我們讓場域可以在電腦裡被測試。</p></div>
      <div class="card"><div class="card-top"><span style="color:var(--gold)">${Deck.icon('server', { size: 26 })}</span><div class="card-head">資料可以不出場域</div></div>
        <p>Agent 與模型可改在地端主機執行，配合季河的資安與個資管理要求。</p></div>
    </div>`,
  notes: '',
});
