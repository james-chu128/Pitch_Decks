Deck.slide({
  id: '2-6', kicker: '核心技術 ③ 模擬到真實', title: '校正讓模擬貼近真機：真實任務的證據',
  html: `
    <div class="cols-64">
      <div style="display:flex;flex-direction:column;min-height:0">
        ${Deck.video('assets/T16_s15_v1.mp4', { caption: '試管放置任務，三個視角｜上排橘框：直接部署　下排藍框：校正後', posterT: 10, style: 'flex:1;min-height:0' })}
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;min-height:0">
        <div class="card"><div class="card-head">方法：用真機影像校正數位孿生</div>
          <p>比對真機與模擬的畫面，修正模擬中的姿態誤差，讓在模擬學會的動作能直接用在真機上。</p></div>
        <div class="stats" style="grid-auto-flow:row;grid-template-columns:1fr 1fr">
          <div class="stat"><div class="v">0/20</div><div class="k">直接部署</div></div>
          <div class="stat"><div class="v">18/20</div><div class="k">校正後（90%）</div></div>
        </div>
        <div class="card" style="flex:1"><div class="card-head">範圍說明</div>
          <p>此結果在<b style="color:var(--gold-hi)">機械手臂</b>上取得。AMR 版本以實測位姿與軌跡校正運動模型，正是與季河合作的第一步。</p></div>
      </div>
    </div>`,
  source: '每種設定各測 20 組；直接部署的 20 組中 18 組觸發安全停止、2 組失敗',
  notes: '',
});
