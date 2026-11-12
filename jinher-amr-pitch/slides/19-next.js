const Q = [
  ['第一台機器人與第一個場域', '選哪一款機型、哪一個門市或院區？'],
  ['導航系統介面', '是否能開放 ROS 2 或導航系統介面？'],
  ['資料分享範圍', '哪些資料可以共享？資安與個資的界線？'],
  ['智財與發表原則', '成果歸屬、論文發表的原則？'],
  ['實驗室參訪', '歡迎來清華看現場系統，時間如何安排？'],
];
Deck.slide({
  id: '4-4', kicker: '下一步', title: '會議當天想確認的事',
  html: `
    <div class="cols-64">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-content:start">
        ${Q.map(([h, t], i) => `<div class="card" ${i === 4 ? 'style="grid-column:span 2"' : ''}><div class="card-top"><div class="num">${i + 1}</div><div class="card-head">${h}</div></div><p>${t}</p></div>`).join('')}
      </div>
      <div class="card" style="justify-content:center;align-items:center;text-align:center;gap:14px">
        <span style="color:var(--gold)">${Deck.icon('mail', { size: 40 })}</span>
        <div class="card-head" style="font-size:22pt">朱宏國 教授</div>
        <p>國立清華大學 資訊工程學系<br>IGVI Group</p>
        <p style="color:var(--gold-hi)">hkchu@gapp.nthu.edu.tw</p>
      </div>
    </div>`,
  notes: '',
});
