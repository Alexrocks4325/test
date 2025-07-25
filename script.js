
// NHL Ultimate Team Full Mobile Experience SPA (Single Page Application)

// Global State
const state = {
  view: 'splash',
  coachName: '',
  teamChoice: '',
  team: [],
  coins: 1000,
  level: 1,
  xp: 0,
  packs: [],
  auctions: [],
  sets: [],
  profile: {},
  transactions: [],
  tutorialComplete: false,
  soundOn: true,
  volume: 0.5,
  lastLogin: new Date().toDateString(),
  matchResult: null
};

// App Root
const app = document.getElementById('app');

function renderView() {
  app.innerHTML = '';
  const header = document.createElement('div');
  header.style.textAlign = 'right';
  header.innerHTML = `<strong>Coins: ${state.coins}</strong>`;
  app.appendChild(header);

  switch (state.view) {
    case 'splash': return renderSplash();
    case 'intro': return renderIntro();
    case 'mainMenu': return renderMainMenu();
    case 'team': return renderTeam();
    case 'gameplay': return renderGameplay();
    case 'store': return renderStore();
    case 'packs': return renderPacks();
    case 'auction': return renderAuction();
    case 'sets': return renderSets();
    case 'profile': return renderProfile();
    case 'settings': return renderSettings();
    default: return renderSplash();
  }
}

function renderSplash() {
  const splash = document.createElement('div');
  splash.innerHTML = `<h1>NHL Ultimate</h1><button onclick="startIntro()">Tap to Start</button>`;
  app.appendChild(splash);
}

function startIntro() {
  state.view = 'intro';
  renderView();
}

function renderIntro() {
  const intro = document.createElement('div');
  intro.innerHTML = `
    <h2>Welcome Coach!</h2>
    <p>Enter your coach name:</p>
    <input id="coachName" />
    <p>Select your favorite NHL team:</p>
    <select id="teamChoice">${getNHLTeams()}</select>
    <button onclick="saveIntro()">Continue</button>
  `;
  app.appendChild(intro);
}

function getNHLTeams() {
  const teams = ["Bruins","Maple Leafs","Canadiens","Rangers","Red Wings","Blackhawks","Penguins","Lightning","Avalanche","Oilers","Flames","Senators","Capitals","Sharks","Ducks","Kings"];
  return teams.map(t => `<option value='${t}'>${t}</option>`).join('');
}

function saveIntro() {
  const name = document.getElementById('coachName').value;
  const team = document.getElementById('teamChoice').value;
  if (!name || !team) return alert('Please fill out all fields');
  state.coachName = name;
  state.teamChoice = team;
  state.tutorialComplete = true;
  checkDailyLogin();
  state.view = 'mainMenu';
  renderView();
}

function checkDailyLogin() {
  const today = new Date().toDateString();
  if (state.lastLogin !== today) {
    state.lastLogin = today;
    state.coins += 500;
    alert('Daily Login Bonus: 500 Coins!');
  }
}

function renderMainMenu() {
  const menu = document.createElement('div');
  menu.innerHTML = `
    <h2>Welcome, Coach ${state.coachName}</h2>
    <button onclick="switchView('gameplay')">Play Match</button>
    <button onclick="switchView('team')">My Team</button>
    <button onclick="switchView('packs')">Packs</button>
    <button onclick="switchView('auction')">Auction House</button>
    <button onclick="switchView('sets')">Sets</button>
    <button onclick="switchView('store')">Store</button>
    <button onclick="switchView('profile')">Profile</button>
    <button onclick="switchView('settings')">Settings</button>
  `;
  app.appendChild(menu);
}

function switchView(view) {
  state.view = view;
  renderView();
}

function renderPacks() {
  const packs = [
    { name: 'Bronze Pack', cost: 500, tier: 'bronze' },
    { name: 'Silver Pack', cost: 5000, tier: 'silver' },
    { name: 'Gold Pack', cost: 25000, tier: 'gold' }
  ];
  const container = document.createElement('div');
  container.innerHTML = '<h3>Packs</h3>';

  packs.forEach(pack => {
    const btn = document.createElement('button');
    btn.innerText = `${pack.name} - ${pack.cost} Coins`;
    btn.onclick = () => openPack(pack);
    container.appendChild(btn);
  });

  container.innerHTML += '<button onclick="renderMainMenu()">Back</button>';
  app.appendChild(container);
}

function openPack(pack) {
  if (state.coins < pack.cost) {
    alert('Not enough coins!');
    return;
  }

  state.coins -= pack.cost;
  const players = generatePlayers(pack.tier);
  state.team.push(...players);
  alert(`You opened a ${pack.name} and got:
` + players.map(p => `${p.name} (${p.overall})`).join('
'));
  renderView();
}

function generatePlayers(tier) {
  const nhlPlayers = ["McDavid","Matthews","Crosby","Kucherov","Makar","Rantanen","Marner","Pastrnak","Fox","Vasilevskiy"];
  const players = [];
  for (let i = 0; i < 3; i++) {
    const name = nhlPlayers[Math.floor(Math.random() * nhlPlayers.length)];
    let overall;
    if (tier === 'bronze') overall = Math.floor(Math.random() * 10) + 60; // 60–69
    else if (tier === 'silver') overall = Math.floor(Math.random() * 10) + 75; // 75–84
    else overall = Math.floor(Math.random() * 10) + 85; // 85–94
    players.push({ name, overall });
  }
  return players;
}

function renderTeam() {
  const container = document.createElement('div');
  container.innerHTML = '<h3>My Team</h3>';
  if (state.team.length === 0) {
    container.innerHTML += '<p>No players yet. Open packs to build your team.</p>';
  } else {
    state.team.forEach(player => {
      const card = document.createElement('div');
      card.innerText = `${player.name} - Overall: ${player.overall}`;
      container.appendChild(card);
    });
  }
  container.innerHTML += '<button onclick="renderMainMenu()">Back</button>';
  app.appendChild(container);
}

function simulateMatch() {
  const myAvg = state.team.length ? state.team.reduce((sum, p) => sum + p.overall, 0) / state.team.length : 60;
  const opponent = Math.floor(Math.random() * 20) + 65;
  const result = myAvg > opponent ? 'Win' : 'Lose';
  state.matchResult = {
    you: Math.round(myAvg),
    opponent,
    result
  };
  if (result === 'Win') {
    state.coins += 300;
    state.xp += 50;
    alert('You won the match! +300 coins, +50 XP');
  } else {
    alert('You lost the match! Better luck next time.');
  }
  renderView();
}

function renderGameplay() {
  const container = document.createElement('div');
  container.innerHTML = '<h3>Gameplay</h3>';
  const playBtn = document.createElement('button');
  playBtn.innerText = 'Play Random Match';
  playBtn.onclick = simulateMatch;
  container.appendChild(playBtn);

  if (state.matchResult) {
    container.innerHTML += `
      <p>Your Team Overall: ${state.matchResult.you}</p>
      <p>Opponent Overall: ${state.matchResult.opponent}</p>
      <h4>Result: ${state.matchResult.result}</h4>
    `;
  }

  container.innerHTML += '<button onclick="renderMainMenu()">Back</button>';
  app.appendChild(container);
}

function renderStore() { app.innerHTML = '<h3>Store</h3><button onclick="renderMainMenu()">Back</button>'; }
function renderAuction() { app.innerHTML = '<h3>Auction House</h3><button onclick="renderMainMenu()">Back</button>'; }
function renderSets() { app.innerHTML = '<h3>Sets</h3><button onclick="renderMainMenu()">Back</button>'; }
function renderProfile() { app.innerHTML = '<h3>Coach Profile</h3><p>Level: ' + state.level + '</p><button onclick="renderMainMenu()">Back</button>'; }
function renderSettings() { app.innerHTML = '<h3>Settings</h3><button onclick="renderMainMenu()">Back</button>'; }

// Initial render
renderView();
