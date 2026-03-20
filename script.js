window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    const newsEl = document.getElementById('news-text');

    // 诗意情报内容
    const newsPool = [
        "📡 正在同步全球猎人节点... 系统监测到新的情报上传...",
        "🔍 [秘闻]：f18v 的花苞结构疑似具备捕食性特征...",
        "💰 恭喜猎人 [K_92] 成功提交 f02v 关键证据！",
        "⚡ 警告：破解算法负载异常升高...",
        "📜 馆长：新的绝密档案已上传，请诸位猎人加紧解析。"
    ];

    async function loadTasks() {
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerHTML = ''; });

        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        // 使用相对路径读取 ./tasks/
        const results = await Promise.all(ids.map(id => 
            fetch(`./tasks/${id}.json`).then(res => res.ok ? res.json() : null).catch(() => null)
        ));

        results.forEach(data => {
            if (!data) return;

            const isDone = (data.status === "已结案");
            if (isDone) stats.completed++; else stats.hunting++;

            // 逻辑：已结案去档案馆，否则去原分类
            const targetId = isDone ? 'bounty-list' : `${data.category || 'voynich'}-list`;
            const listContainer = document.getElementById(targetId);
            
            if (listContainer) {
                const tagColor = isDone ? "#ff9800" : "#27ae60";
                const card = `
                    <div class="card" style="${isDone ? 'border-left: 5px solid #ff9800; opacity: 0.8;' : ''}">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片解析中...'">
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

    // 在线人数随机化
    setInterval(() => { if(onlineEl) onlineEl.innerText = Math.floor(Math.random()*15)+40; }, 4000);
    
    // 轮播情报
    setInterval(() => {
        if(newsEl) {
            newsEl.style.opacity = 0;
            setTimeout(() => {
                newsEl.innerText = newsPool[Math.floor(Math.random()*newsPool.length)];
                newsEl.style.opacity = 1;
            }, 500);
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
