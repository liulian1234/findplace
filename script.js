// ==================== 核心变量 ====================
const modal = document.getElementById('auth-modal');
const authLink = document.getElementById('auth-link');
const authStatus = document.getElementById('auth-status');
let currentUser = localStorage.getItem('hunterName') || null;

// ==================== 登录/注册模拟 ====================
function openModal() { modal.style.display = 'flex'; }
function closeModal() { modal.style.display = 'none'; }

function toggleForm(type) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(type + '-form').classList.add('active');
  event.target.classList.add('active');
}

function togglePassword(el) {
  const input = el.previousElementSibling;
  input.type = input.type === 'password' ? 'text' : 'password';
  el.textContent = input.type === 'text' ? '🙈' : '👁';
}

// 假登录成功
function handleLoginSuccess(username) {
  localStorage.setItem('hunterName', username);
  currentUser = username;
  updateAuthUI();
  closeModal();
  alert(`欢迎归来，猎人 ${username}。秘档已为你开启。`);
}

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim() || '匿名猎人';
  handleLoginSuccess(username);
});

document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim() || '新猎人';
  handleLoginSuccess(username);
});

// 更新顶部登录状态
function updateAuthUI() {
  if (currentUser) {
    authStatus.innerHTML = `
      <span style="color:var(--gold);">欢迎，${currentUser}</span>
      <a href="#" style="margin-left:16px;color:var(--dim);" onclick="logout()">登出</a>
    `;
  } else {
    authStatus.innerHTML = `<a href="#" class="auth-link" onclick="openModal()">🔑 猎人登录/注册</a>`;
  }
}

function logout() {
  localStorage.removeItem('hunterName');
  currentUser = null;
  updateAuthUI();
  alert('已安全登出。欢迎下次狩猎。');
}

// ==================== 任务加载 ====================
async function loadTasks() {
  const lists = {
    voynich: document.getElementById('voynich-list'),
    game: document.getElementById('game-list'),
    crack: document.getElementById('crack-list'),
    progress: document.getElementById('progress-list'),
    bounty: document.getElementById('bounty-list')
  };

  Object.values(lists).forEach(el => {
    if (el) el.innerHTML = '<div style="text-align:center;padding:60px;color:#666;">加载秘档中...</div>';
  });

  try {
    const res = await fetch('./data/tasks.json');
    if (!res.ok) throw new Error();
    const tasks = await res.json();

    let hunting = 0, completed = 0;

    tasks.forEach(t => {
      const isDone = t.status === '已结案' || t.status?.toLowerCase().includes('complete');
      if (isDone) completed++; else hunting++;

      const target = isDone ? lists.bounty : lists[t.category] || lists.voynich;
      if (!target) return;

      const tagColor = isDone ? '#e67e22' : '#27ae60';
      const html = `
        <div class="card ${isDone?'done':''}" style="position:relative;">
          <img src="./images/${t.img || t.filename || 'f1v.jpeg'}" 
               alt="${t.id}" 
               onclick="viewImage(this.src)"
               onerror="this.src='https://via.placeholder.com/140/1e1e28/666?text=加载失败'">
          <div class="info">
            <div>
              <strong>${t.id}</strong>
              <span class="tag" style="background:${tagColor}">${t.status || '寻找中'}</span>
            </div>
            <p style="margin:8px 0;color:#ccc;">${t.desc || '待解析神秘页...'}</p>
            <div class="price">
              ${isDone ? '💰 已结算' : '赏金 ' + (t.price || '待定')}
            </div>
            ${isDone ? '<div class="done-stamp">已封卷</div>' : 
              '<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">提交证据</a>'}
          </div>
        </div>`;
      target.insertAdjacentHTML('beforeend', html);
    });

    renderChart(hunting, completed);
  } catch(e) {
    Object.values(lists).forEach(el => {
      if (el) el.innerHTML = '<div style="text-align:center;padding:60px;color:#c0392b;">档案库连接失败</div>';
    });
  }
}

function renderChart(h, c) {
  const dom = document.getElementById('chart');
  if (!dom) return;
  const chart = echarts.init(dom);
  chart.setOption({
    backgroundColor: 'transparent',
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      data: [
        {value: h, name: '进行中', itemStyle:{color:'#27ae60'}},
        {value: c, name: '已结案', itemStyle:{color:'#e67e22'}}
      ],
      label: {show:true, position:'inside', formatter:'{d}%', color:'#fff', fontSize:14}
    }]
  });
}

// ==================== 其他交互 ====================
function switchCat(id, el) {
  document.querySelectorAll('.category-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  el.classList.add('active');
}

function viewImage(src) {
  document.getElementById('viewer-img').src = src;
  document.getElementById('viewer').style.display = 'flex';
}
function closeViewer(e) {
  if (e.target.id === 'viewer' || e.target.id === 'viewer-img') {
    document.getElementById('viewer').style.display = 'none';
  }
}

// 伪在线 & 新闻
setInterval(() => {
  document.getElementById('online-num').textContent = Math.floor(Math.random()*30 + 50);
}, 6000);

const newsPool = [
  "新线索：f18v 植物重复模式被3位猎人同时报告",
  "赏金池今日突破 $5200",
  "警告：f72v 星图解析负载过高",
  "最新理论：生物章节或为外星基因库索引"
];
let newsIdx = 0;
setInterval(() => {
  const el = document.getElementById('news-text');
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = newsPool[newsIdx = (newsIdx+1)%newsPool.length];
    el.style.opacity = 1;
  }, 800);
}, 11000);

// 初始化
window.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  loadTasks();
});
