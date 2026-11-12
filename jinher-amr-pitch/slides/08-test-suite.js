const TESTS = ['靜置', '單輪旋轉', '多速直行', '倒車', '加減速', '原地旋轉', '定弧行駛', '急停', '方形路徑'];
Deck.slide({
  id: '2-3', kicker: '核心技術 ① 真實到模擬', title: '調參從「好幾天」縮到「一次測完」',
  html: `
    <div class="cols-64">
      <div style="display:flex;flex-direction:column;gap:14px;min-height:0">
        ${Deck.video('assets/T19_s18_v1.mp4', { caption: '自動運動測試：每項動作的俯視示意', posterT: 6 })}
        <div class="card"><div class="card-head">9 項自動運動測試</div>
          <div class="chips">${TESTS.map((t, i) => `<span class="chip">${i + 1} ${t}</span>`).join('')}</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;min-height:0">
        <div class="stats" style="grid-auto-flow:row;grid-template-columns:1fr 1fr">
          <div class="stat"><div class="v">9 項</div><div class="k">運動測試</div></div>
          <div class="stat"><div class="v">12 次</div><div class="k">一鍵自動執行</div></div>
          <div class="stat"><div class="v">約 2 分</div><div class="k">跑完全部並評分</div></div>
          <div class="stat"><div class="v">12/12</div><div class="k">參考設定全數通過</div></div>
        </div>
        <div class="card" style="flex:1"><div class="card-head">故障看得出來，也分得出來</div>
          <p>刻意注入 5 種故障（馬力、扭矩、摩擦、重量、模擬頻率），測試全部抓到，而且每種故障的失敗型態不同，這正是 Agent 判斷原因的線索。</p></div>
      </div>
    </div>`,
  source: '測試取材自 ISO 18646-1（服務型機器人運動性能）與 UMBmark，非合規認證；門檻為研究值',
  notes: '',
});
