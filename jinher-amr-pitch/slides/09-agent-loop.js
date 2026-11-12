const STEPS = ['跑測試', 'Agent 讀證據', '提出修正', '工程師核准', '套用並重測'];
Deck.slide({
  id: '2-4', kicker: '核心技術 ① 真實到模擬', title: 'Agent 自動找出問題，工程師只需核准',
  html: `
    <div class="cols-46">
      <div style="display:flex;flex-direction:column;gap:14px;min-height:0">
        <div class="card"><div class="card-head">實驗：暗中把輪子摩擦力降到 37%</div>
          <p>Agent 不知道故障在哪，只看得到測試結果，依下列流程修正（最多 3 輪）：</p>
          <div class="chips">${STEPS.map((s, i) => `<span class="chip">${i + 1} ${s}</span>`).join('')}</div></div>
        <div class="card" style="flex:1"><div class="card-top"><span style="color:var(--gold)">${Deck.icon('shield-check', { size: 26 })}</span><div class="card-head">可稽核、人在迴路中</div></div>
          <p>每次試驗獨立環境，每個決定附證據紀錄；Agent 只能用受檢查的工具，修改一律要人核准。</p></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;min-height:0">
        ${Deck.video('assets/t19_agent_loop.mp4', { caption: '實際操作畫面：提出修正 → 人工核准 → 重測 → 通過並揭曉故障（剪輯版）', posterT: 30, style: 'flex:1;min-height:0' })}
        <div class="stats" style="display:grid;grid-template-columns:1fr 1fr 1fr">
          <div class="stat"><div class="v">2 次</div><div class="k">提案就修回</div></div>
          <div class="stat"><div class="v">12/12</div><div class="k">測試全部通過</div></div>
          <div class="stat"><div class="v">53.9→17.5</div><div class="k">急停滑行距離（mm）</div></div>
        </div>
      </div>
    </div>`,
  source: '單次實驗結果，可靠度重複實驗進行中',
  notes: '',
});
