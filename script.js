window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    const newsEl = document.getElementById('news-text');

    // 1. 动态情报库
    const newsPool = [
        "📡 系统监测到 3 名新猎人进入了 [伏尼契手稿] 区域...",
        "🔍 [秘闻]：f18v 的花苞结构疑似具备捕食性特征...",
        "💰 恭喜猎人 [K_92] 成功提交 f02v 关键证据！奖金已汇出...",
        "⚡ 警告：破解算法负载异常升高，正在分配云端节点...",
        "📜 馆长：新的绝密档案已上传，请诸位猎人加紧解析...",
        "⏳ 进度更新：[破解进度] 板块新增 2 项未解谜题..."
    ];

    // 2. 加载任务
    async function loadTasks() {
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerHTML = ''; });

        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        for (const id of ids) {
            try {
                const res = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                if (!res.ok) continue;
                const data = await res.json();

                const isDone = data.status === "已结案";
                if (isDone) stats.completed++; else stats.hunting++;

                // 分流逻辑：已结案去赏金档案馆，否则去原分类
                const targetListId = isDone ? 'bounty-list' : `${data.category || 'voynich'}-list`;
                const tagColor = isDone ? "#444" : "#27ae60";

                const card = `
                    <div class="card" style="${isDone ? 'opacity: 0.6;' : ''}">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=档案解析中...'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag" style="background:${tagColor}">${data.status || '寻找中'}</span></h3>
                            <p>${data.desc}</p>
                            <div class="price">${isDone ? '<span style="color:#666">💰 赏金已结算</span>' : '赏金：' + data.price}</div>
                            ${isDone ? '<div class="done-stamp">SEALED / 已封卷</div>' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                        </div>
                    </div>`;

                const listContainer = document.getElementById(targetListId);
                if (listContainer) listContainer.insertAdjacentHTML('beforeend', card);
            } catch (e) {}
        }
        updateChart(stats.hunting, stats.completed);
    }

    // 3. 统计饼图
    function updateChart(h, c) {
        const dom = document.getElementById('chart');
        if (!dom) return;
        const myChart = echarts.init(dom);
        myChart.setOption({
            backgroundColor: 'transparent',
            series: [{
                type: 'pie', radius: ['45%', '70%'],
                data: [
                    { value: h, name: '寻找中', itemStyle: { color: '#d35400' } },
                    { value: c, name: '已结案', itemStyle: { color: '#222' } }
                ],
                label: { show: false }, silent: true
            }]
        });
    }

    // 4. 定时器：在线人数与情报滚动
    setInterval(() => { 
        if(onlineEl) onlineEl.innerText = Math.floor(Math.random()*20)+45; 
    }, 4000);

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
