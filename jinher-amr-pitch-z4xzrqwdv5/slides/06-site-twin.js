Deck.slide({
  id: '2-1', kicker: '核心技術 ① 真實到模擬', title: '把場域搬進電腦：照片或圖面都可以',
  html: `
    <div class="cols-64">
      <div class="col" style="display:flex;flex-direction:column;gap:12px;min-height:0">
        ${Deck.video('assets/T03_s10_v1.mp4', { caption: '少量照片 → 全景 → 3D 場景（實驗室場景）', posterT: 8, style: 'flex:1;min-height:0' })}
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;min-height:0">
        <div class="card"><div class="card-top"><div class="num">A</div><div class="card-head">沒有圖面：拍照重建</div></div>
          <p>手機或相機拍少量照片，自動重建成 3D 場景，保留真實的外觀與格局。</p></div>
        <div class="card"><div class="card-top"><div class="num">B</div><div class="card-head">有 BIM／CAD 圖面</div></div>
          <p>建築圖面轉成模擬格式，整層樓直接匯入模擬器。</p>
          <div class="chips"><span class="chip">圖面</span><span class="chip">→ USD 格式</span><span class="chip">→ Isaac Sim</span></div></div>
        <div class="card" style="flex:1;justify-content:center"><p style="color:var(--gold-hi)">不用停業、不用量尺；重建好的場景可以直接跑導航測試。</p></div>
      </div>
    </div>`,
  notes: '',
});
