window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');

    async function loadTasks() {
        // 1. 清空所有列表（确保 ID 存在）
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });

        // 2. 定义要扫描的编号（f1v 到 f150v）
        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        // 3. 异步抓取
        const promises = ids.map(id => 
            fetch(`./tasks/${id}.json`) // 恢复最简单的路径
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
        );

        const results = await Promise.all(promises);

        results.forEach(data => {
            if (!data) return;

            const isDone = data.status === "已结案";
            if (isDone) stats.completed++; else stats.hunting++;

            // 自动归类逻辑
            let targetListId = isDone ? 'bounty-list' : `${data.category || 'voynich'}-list`;
            const listContainer = document.getElementById(targetListId);
            
            if (listContainer) {
                const tagColor = isDone ? "#ff9800" : "#27ae60";
                
                // 🛠️ 修复：如果 JSON 里没写 img 路径，或者路径不对，尝试自动匹配
                let imgSrc = data.img;
                
                const card = `
                    <div class="card" style="${isDone ? 'border-left: 5px solid #ff9800; opacity: 0.8;' : ''}">
                        <img src="${imgSrc}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=档案解析中...'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag" style="background:${tagColor}">${data.status || '寻找中'}</span></h3>
                            <p>${data.desc}</p>
                            <div class="price">${isDone ? '<span style="color:#ff9800">💰 赏金已发放</span>' : '赏金：' + data.price}</div>
                            ${isDone ? '<div class="done-stamp">SEALED / 已封卷</div>' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                        </div>
                    </div>`;
                listContainer.insertAdjacentHTML('beforeend', card);
            }
        });

        // 4. 更新饼图
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

    // 在线人数随机跳动
    if(onlineEl) {
        setInterval(() => { onlineEl.innerText = Math.floor(Math.random()*15)+40; }, 4000);
    }
    
    loadTasks();
});

function switchCat(id, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}
function view(s){ document.getElementById('viewer-img').src=s; document.getElementById('viewer').style.display='flex'; }
