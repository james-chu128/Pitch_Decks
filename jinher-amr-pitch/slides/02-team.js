
const TEAM = [
  ['assets/team_1.jpg', '朱宏國', '教授<br>CGV Lab', '3D 重建<br>數位孿生', 'center'],
  ['assets/team_2.jpg', '胡敏君', '教授<br>MIS Lab', '影像分析<br>動作辨識', 'center'],
  ['assets/team_3.jpg', '洪仕軒', '助理教授<br>VM Lab', '神經渲染<br>Physics AI', 'center'],
  ['assets/team_4.jpg', '姚智原', '副教授<br>CGAL Lab', '3D 重建<br>瑕疵檢測', 'center'],
  ['assets/team_5.jpg', '潘則佑', '助理教授<br>MiiS Lab', '機器人學習<br>Sim-to-Real', '75% 30%'],
  ['assets/team_6.jpg', '蕭凱文', '助理教授<br>CG Lab', '即時渲染<br>網格分析', 'center'],
  ['assets/team_7.jpg', '蘇文鈺', '教授<br>SCREAM Lab', '機器人學習<br>數位音訊處理', 'center'],
];
const person = ([img, name, role, area, pos]) => `
  <div class="card person">
    ${img ? `<img src="${img}" alt="${name}" style="object-position:${pos}">` : `<div class="ph">待補<br>照片</div>`}
    <div class="card-head">${name}</div>
    <div class="role">${role}</div>
    <p>${area}</p>
  </div>`;
Deck.slide({
  id: '0-2', kicker: '團隊', title: '清華 IGVI Group：從場域重建到機器人學習',
  html: `
    <style>
      .team { display: grid; grid-template-columns: repeat(7, 1fr); gap: 14px; }
      .team .grp { grid-column: span 3; display: flex; align-items: center; gap: 10px; font-size: 16pt; font-weight: 700; color: var(--gold-hi); }
      .team .grp small { font-size: 16pt; font-weight: 400; color: var(--muted); }
      .person { align-items: center; text-align: center; padding: 12px 6px; gap: 4px; }
      .person img { width: 92px; height: 92px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold); box-shadow: 0 0 16px rgba(212,175,55,.35); }
      .person .role { font-size: 16pt; color: var(--muted); line-height: 1.25; }
      .person p { line-height: 1.35; }
      .team .grp.wide { grid-column: span 4; }
      .person .ph { width: 92px; height: 92px; border-radius: 50%; border: 2px dashed var(--gold); display: flex; align-items: center; justify-content: center; font-size: 16pt; color: var(--muted); }
    </style>
    <div class="team">
      <div class="grp">IGVI Group <small>國立清華大學</small></div>
      <div class="grp wide">合作夥伴 <small>臺灣科技大學 · 成功大學</small></div>
      ${TEAM.map(person).join('')}
    </div>
    <div class="stats">
      <div class="stat"><div class="v">7 位</div><div class="k">三校教授團隊</div></div>
      <div class="stat"><div class="v">10+</div><div class="k">項產學合作</div></div>
      <div class="stat"><div class="v">3 個</div><div class="k">已交付的場域案例</div></div>
      <div class="stat"><div class="v">NVIDIA</div><div class="k">全端模擬工具鏈</div></div>
    </div>`,
  notes: '',
});
