window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    const newsEl = document.getElementById('news-text');
    
    const newsPool = [
        "📡 全球猎人节点同步中...",
        "🔍 f18v 出现异常植物结构重复...",
        "💰 今日赏金池已累积 $3,450",
        "⚡ 系统检测到高强度解码尝试...",
        "🧠 新理论：生物学章节或为星图投影？"
    ];

    async function loadTasks() {
        const lists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        lists.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<div class="loading">加载任务中...</div>';
        });

        try {
            // 改成加载单一文件，未来可换成 API: fetch('/api/tasks')
            const res = await fetch('./data/tasks.json');
            if (!res.ok) throw new Error('任务数据加载失败');
            const tasks = await res.json();

            let stats = { hunting: 0, completed: 0 };

            tasks.forEach(task => {
                const isDone = task.status === "已结案" || task.status === "completed";
                if (isDone) stats.completed++;
                else stats.hunting++;

                // 更灵活的分类（可扩展）
                let targetId = 'voynich-list'; // 默认
                if (task.category === 'game') targetId = 'game-list';
                if (task.category === 'crack') targetId = 'crack-list';
                if (task.category === 'progress') targetId = 'progress-list';
                if (isDone) targetId = 'bounty-list';

                const container = document.getElementById(targetId);
                if (!container) return;

                const tagColor = isDone ? "#ff9800" : "#27ae60";
                const card = `
                    <div class="card ${isDone ? 'done' : ''}">
                        <img src="${task.img || 'https://www.beinecke.library.yale.edu/sites/default/files/styles/medium/public/voynich_ms_408_f001r.jpg'}" 
                             onclick="view(this.src)" 
                             onerror="this.src='https://via.placeholder.com/160x160?text=No+Image'" 
                             alt="${task.id}">
                        <div class="info">
                            <h3>${task.id} <span class="tag" style="background:${tagColor}">${task.status}</span></h3>
                            <p>${task.desc}</p>
                            <div class="price">
                                ${isDone 
                                    ? '<span style="color:#ff9800">💰 赏金已结算</span>' 
                                    : `赏金：${task.price || '待定'}`}
                            </div>
                            ${isDone 
                                ? '<div class="done-stamp">SEALED / 已封卷</div>' 
                                : `<a href="${task.submitUrl || 'https://forms.gle/qACH4MgrUDwHaiyCA'}" target="_blank" class="btn">📥 提交证据</a>`}
                        </div>
                    </div>`;
                container.insertAdjacentHTML('beforeend', card);
            });

            updateChart(stats.hunting, stats.completed);

        } catch (err) {
            console.error(err);
            document.querySelectorAll('.task-grid').forEach(el => {
                el.innerHTML = '<div class="error">任务加载失败，请稍后刷新</div>';
            });
        }
    }

    function updateChart(hunting, completed) {
        const dom = document.getElementById('chart');
        if (!dom) return;
        const chart = echarts.init(dom);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 8, borderColor: '#121215', borderWidth: 2 },
                data: [
                    { value: hunting, name: '寻找中', itemStyle: { color: '#27ae60' } },
                    { value: completed, name: '已结案', itemStyle: { color: '#ff9800' } }
                ],
                label: { 
                    show: true, 
                    position: 'inside', 
                    formatter: '{d}%', 
                    color: '#fff', 
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                labelLine: { show: false }
            }]
        });
    }

    // 伪在线人数（可未来换成真实 WebSocket）
    if (onlineEl) {
        setInterval(() => {
            onlineEl.innerText = Math.floor(Math.random() * 20) + 45;
        }, 5000);
    }

    // 新闻滚动
    if (newsEl) {
        setInterval(() => {
            newsEl.style.opacity = 0;
            setTimeout(() => {
                newsEl.innerText = newsPool[Math.floor(Math.random() * newsPool.length)];
                newsEl.style.opacity = 1;
            }, 600);
        }, 10000);
    }

    loadTasks();
});

// 切换分类（不变，但建议加平滑过渡）
function switchCat(id, el) {
    document.querySelectorAll('.category-section').forEach(s => {
        s.classList.remove('active');
        s.style.opacity = 0;
    });
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const section = document.getElementById(id);
    if (section) {
        section.classList.add('active');
        setTimeout(() => { section.style.opacity = 1; }, 100);
    }
    el.classList.add('active');
}

function view(src) {
    const viewer = document.getElementById('viewer');
    const img = document.getElementById('viewer-img');
    img.src = src;
    viewer.style.display = 'flex';
}
