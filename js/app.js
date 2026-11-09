/** 《月见公寓》官网渲染逻辑 */

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* ---------- 主视觉 + 开始游戏链接 ---------- */

document.getElementById('heroIntro').textContent = HERO_INTRO;
for (const id of ['startBtn', 'startBtn2']) {
  document.getElementById(id).href = GAME_URL;
}

/* ---------- 角色卡 ---------- */

const charCards = document.getElementById('charCards');
for (const c of CHARACTERS) {
  const card = el('button', 'charCard');
  card.style.background = c.bg;
  card.innerHTML = `
    <img class="charThumb" src="${c.full}" alt="${c.name}立绘" />
    <div class="charInfo">
      <div class="charName">${c.name}</div>
      <div class="charRoom">${c.room} · ${c.title}</div>
      <div class="charTagline">${c.tagline}</div>
      <div class="charMore">点开看详细介绍 →</div>
    </div>`;
  card.onclick = () => openCharModal(c);
  charCards.appendChild(card);
}

const mask = document.getElementById('charModal');

function openCharModal(c) {
  document.getElementById('charImg').src = c.smile;
  document.getElementById('charMName').textContent = c.name;
  document.getElementById('charMTag').textContent = `${c.room} · ${c.title} · ${c.tagline}`;
  const dl = document.getElementById('charMProfile');
  dl.innerHTML = '';
  for (const [k, v] of Object.entries(c.profile)) {
    dl.appendChild(el('div', 'pRow', `<dt>${k}</dt><dd>${v}</dd>`));
  }
  mask.classList.add('open');
}

document.getElementById('charClose').onclick = () => mask.classList.remove('open');
mask.onclick = (e) => {
  if (e.target === mask) mask.classList.remove('open');
};

/* ---------- 7 层楼 ---------- */

const building = document.getElementById('building');
const roomPanel = document.getElementById('roomPanel');

function showRoom(room) {
  document.getElementById('roomIcon').textContent = room.icon;
  document.getElementById('roomName').textContent = room.name;
  document.getElementById('roomText').textContent = room.text;
  roomPanel.hidden = false;
}

for (const floor of FLOORS) {
  const row = el('div', 'floorRow' + (floor.floor === '天台' ? ' roof' : ''));
  const label = el('div', 'floorLabel', floor.floor);
  row.appendChild(label);

  const windows = el('div', 'floorWindows');
  if (floor.rooms && floor.rooms.length > 1) {
    // 一层多间（1F / 天台）
    for (const room of floor.rooms) {
      const w = el('button', 'floorWin wide');
      w.innerHTML = `<span class="winIcon">${room.icon}</span><span class="winName">${room.name.replace(/^.*· /, '')}</span>`;
      w.onclick = () => showRoom(room);
      windows.appendChild(w);
    }
  } else {
    // 一层一户：画一排窗，住人的那扇亮灯可点
    const room = floor.rooms ? floor.rooms[0] : null;
    for (let i = 0; i < 5; i++) {
      const lit = floor.lit && i === 2;
      const w = el('button', 'floorWin' + (lit ? ' lit' : ''));
      if (lit) {
        w.innerHTML = `<span class="winIcon">${room.icon}</span>`;
        w.title = room.name;
        w.onclick = () => showRoom(room);
      }
      windows.appendChild(w);
    }
    if (floor.resident) {
      row.appendChild(el('div', 'floorResident', `${floor.resident}`));
    }
  }
  row.appendChild(windows);
  building.appendChild(row);
}

document.getElementById('roomClose').onclick = () => roomPanel.hidden = true;

/* ---------- 猫 ---------- */

const catText = document.getElementById('catText');
const catChoices = document.getElementById('catChoices');
for (const name of CAT_NAMES) {
  const b = el('button', 'catChoice', name);
  b.onclick = () => {
    localStorage.setItem('yuejian-cat-name', name);
    catText.textContent = `它现在叫「${name}」了。它蹭了蹭你的裤脚，继续沿着楼梯往上走。`;
    catChoices.innerHTML = '';
  };
  catChoices.appendChild(b);
}
const savedCat = localStorage.getItem('yuejian-cat-name');
if (savedCat) {
  catText.textContent = `楼道里的猫叫「${savedCat}」。它蹭了蹭你的裤脚。`;
}

/* ---------- 玩法 ---------- */

const gameplay = document.getElementById('gameplay');
for (const g of GAMEPLAY) {
  gameplay.appendChild(el('div', 'gpCard', `<div class="gpIcon">${g.icon}</div><div><div class="gpTitle">${g.title}</div><p>${g.body}</p></div>`));
}

/* ---------- 音乐 ---------- */

const music = document.getElementById('music');
for (const m of MUSIC) {
  music.appendChild(el('div', 'musicRow', `<span class="mWhere">${m.where}</span><span class="mName">♪ ${m.name}</span><span class="mMood">${m.mood}</span>`));
}
