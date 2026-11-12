const COLS = ['修正前：路徑偏移', '修正前：前後晃動', '修正後：穩定直行'];
const TOP = ['assets/T16_s06_v1.mp4', 'assets/T16_s06_v2.mp4', 'assets/T16_s06_v3.mp4'];
const BOT = ['assets/T16_s06_v4.mp4', 'assets/T16_s06_v5.mp4', 'assets/T16_s06_v6.mp4'];
Deck.slide({
  id: '2-2', kicker: '核心技術 ① 真實到模擬', title: '把機器人搬進電腦：同一個指令，要走出同樣的路',
  html: `
    <style>
      .wall { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px 14px; flex: 1; min-height: 0; align-content: start; }
      .wall .h { font-size: 17pt; font-weight: 700; text-align: center; color: var(--text); }
      .wall .h.ok { color: var(--gold-hi); }
      .wall .video-box { margin: 0; }
    </style>
    <p style="font-size:16pt;color:var(--muted)">上排俯視看路徑（青線＝直行參考、橘線＝實際路徑）；下排側視看車身晃動。三欄都是同一個前進指令。</p>
    <div class="wall">
      ${COLS.map((c, i) => `<div class="h ${i === 2 ? 'ok' : ''}">${c}</div>`).join('')}
      ${Deck.video('assets/T16_s06_v1.mp4')}${Deck.video('assets/T16_s06_v2.mp4')}${Deck.video('assets/T16_s06_v3.mp4')}
      ${Deck.video('assets/T16_s06_v4.mp4')}${Deck.video('assets/T16_s06_v5.mp4')}${Deck.video('assets/T16_s06_v6.mp4')}
    </div>`,
  source: '模擬環境：NVIDIA Isaac Sim 5.1／PhysX；以上皆為模擬結果',
  notes: '',
});
