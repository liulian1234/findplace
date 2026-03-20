window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    const newsEl = document.getElementById('news-text');

    const newsPool = ["📡 正在同步全球猎人节点...", "🔍 发现 f18v 的新线索...", "💰 赏金大厅今日已发放 $1,200 奖金...", "⚡ 警告：破解算法负载异常升高..."];

    async function loadTasks() {
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerHTML = ''; });

        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        // 强力抓取逻辑
        const results = await Promise.all(ids.map(id => 
            fetch(`./tasks/${id}.json`).then(res => res.ok ? res.json() : null).catch(() => null)
        ));

        results.forEach(data => {
            if (!data) return;

            const isDone = (data.status === "已结案");
            if (isDone) stats.completed++; else stats.hunting++;

            // 归档判断：只要是已结案，全部塞进 bounty-list
            const targetId = isDone ? 'bounty-list' : `${data.category || 'voynich'}-list`;
            const listContainer = document.getElementById(targetId);
            
            if (listContainer) {
                const tagColor = isDone ? "#ff9800" : "#27ae60";
                const card = `
                    <div class="card" style="${isDone ? 'border-left: 5px solid #ff9800; opacity: 0.8;' : ''}">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片加载失败'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag" style="background:${tagColor}">${data.status}</span></h3>
                            <p>${data.desc}</p>
                            <div class="price">${isDone ? '<span style="color:#ff9800">💰 赏金已结算</span>' : '赏金：' + data.price}</div>
                            ${isDone ? '<div class="done-stamp">SEALED / 已封卷</div>' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                        </div>
                    </div>`;
                listContainer.insertAdjacentHTML('beforeend', card);
            }
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

    if(onlineEl) setInterval(() => { onlineEl.innerText = Math.floor(Math.random()*15)+40; }, 4000);
    setInterval(() => {
        if(newsEl) {
            newsEl.style.opacity = 0;
            setTimeout(() => { newsEl.innerText = newsPool[Math.floor(Math.random()*newsPool.length)]; newsEl.style.opacity = 1; }, 500);
        }
    }, 12000);

    loadTasks();
});

function switchCat(id, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}
function view(s){ document.getElementById('viewer-img').src=s; document.getElementById('viewer').style.display='flex'; }
