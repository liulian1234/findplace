// --- 1. Firebase 初始化 (请替换为你自己的配置) ---
const firebaseConfig = {
    apiKey: "你的_API_KEY",
    authDomain: "你的_PROJECT.firebaseapp.com",
    projectId: "你的_PROJECT_ID"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    const newsEl = document.getElementById('news-text');

    // --- 2. 身份状态监听 ---
    firebase.auth().onAuthStateChanged((user) => {
        const loggedOutEl = document.getElementById('user-logged-out');
        const loggedInEl = document.getElementById('user-logged-in');
        const emailDisplay = document.getElementById('user-email');
        if (user) {
            if(loggedOutEl) loggedOutEl.style.display = 'none';
            if(loggedInEl) { loggedInEl.style.display = 'block'; emailDisplay.innerText = `代号：${user.email}`; }
        } else {
            if(loggedOutEl) loggedOutEl.style.display = 'block';
            if(loggedInEl) loggedInEl.style.display = 'none';
        }
    });

    // --- 3. 加载与统计逻辑 (修复已结案不统计问题) ---
    async function loadTasks() {
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerHTML = ''; });

        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        const tasks = ids.map(id => 
            fetch(`./tasks/${id}.json?t=${Date.now()}`).then(res => res.ok ? res.json() : null).catch(() => null)
        );

        const results = await Promise.all(tasks);

        results.forEach(data => {
            if (!data) return;
            const isDone = data.status === "已结案";
            if (isDone) stats.completed++; else stats.hunting++;

            const targetListId = isDone ? 'bounty-list' : `${data.category || 'voynich'}-list`;
            const tagColor = isDone ? "#ff9800" : "#27ae60";

            const card = `
                <div class="card" style="${isDone ? 'border-left: 5px solid #ff9800;' : ''}">
                    <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=档案解析中...'">
                    <div class="info">
                        <h3>编号：${data.id} <span class="tag" style="background:${tagColor}">${data.status || '寻找中'}</span></h3>
                        <p>${data.desc}</p>
                        <div class="price">${isDone ? '<span style="color:#ff9800">💰 赏金已发放</span>' : '赏金：' + data.price}</div>
                        ${isDone ? '<div class="done-stamp">SEALED / 已封卷</div>' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                    </div>
                </div>`;

            const listContainer = document.getElementById(targetListId);
            if (listContainer) listContainer.insertAdjacentHTML('beforeend', card);
        });
        updateChart(stats.hunting, stats.completed);
    }

    function updateChart(h, c) {
        const dom = document.getElementById('chart');
        if (!dom) return;
        const myChart = echarts.init(dom);
        myChart.setOption({
            backgroundColor: 'transparent',
            series: [{
                type: 'pie', radius: ['45%', '70%'],
                data: [
                    { value: h, name: '寻找中', itemStyle: { color: '#27ae60' } },
                    { value: c, name: '已结案', itemStyle: { color: '#ff9800' } }
                ],
                label: { show: false }, silent: true
            }]
        });
    }

    // 各种定时器
    setInterval(() => { if(onlineEl) onlineEl.innerText = Math.floor(Math.random()*20)+45; }, 4000);
    setInterval(() => {
        if(newsEl) {
            newsEl.style.opacity = 0;
            setTimeout(() => {
                newsEl.innerText = "🔍 正在监测全球节点... 线索同步中...";
                newsEl.style.opacity = 1;
            }, 500);
        }
    }, 12000);
    loadTasks();
});

// --- 4. 身份操作函数 ---
async function handleSignUp() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    if(!e || !p) return alert("凭证缺失。");
    try { await firebase.auth().createUserWithEmailAndPassword(e, p); alert("激活成功！"); } catch (error) { alert(error.message); }
}
async function handleLogin() {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    try { await firebase.auth().signInWithEmailAndPassword(e, p); } catch (error) { alert("验证失败。"); }
}
function handleLogout() { firebase.auth().signOut(); }
function switchCat(id, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}
function view(s){ document.getElementById('viewer-img').src=s; document.getElementById('viewer').style.display='flex'; }
