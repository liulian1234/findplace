window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    
    async function loadTasks() {
        // 清空所有列表
        const lists = ['voynich-list', 'game-list', 'crack-list', 'bounty-list'];
        lists.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.innerHTML = '';
        });

        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };
        let foundAny = false;

        for (const id of ids) {
            // 1. 取消掉 f01v
            if (id === 'f01v') continue;

            try {
                const res = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                if (!res.ok) continue;
                const data = await res.json();
                foundAny = true;

                const isDone = data.status === "已结案";
                if (isDone) stats.completed++; else stats.hunting++;

                // 2. 状态颜色：已结案橙色，寻找中绿色
                const tagColor = isDone ? "#ff9800" : "#27ae60";

                const card = `
                    <div class="card">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片同步中'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag" style="background:${tagColor}">${data.status || '寻找中'}</span></h3>
                            <p>${data.desc}</p>
                            <div class="price">${isDone ? '💰 赏金已发放' : '赏金：' + data.price}</div>
                            ${isDone ? '' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                        </div>
                    </div>`;

                // 3. 动态分类放入对应的容器
                const cat = data.category || 'voynich';
                const targetList = document.getElementById(`${cat}-list`);
                if (targetList) targetList.insertAdjacentHTML('beforeend', card);
            } catch (e) {}
        }
        
        updateChart(stats.hunting, stats.completed);
    }

    // 在线人数波动
    function updateOnline() {
        if (onlineEl) onlineEl.innerText = Math.floor(Math.random() * 20) + 40;
    }
    setInterval(updateOnline, 4000);
    updateOnline();

    // 统计图表 (结案改为橙色)
    function updateChart(h, c) {
        const dom = document.getElementById('chart');
        if (!dom) return;
        const myChart = echarts.init(dom);
        myChart.setOption({
            series: [{
                type: 'pie', radius: ['40%', '70%'],
                data: [
                    { value: h, name: '寻找中', itemStyle: { color: '#27ae60' } },
                    { value: c, name: '已结案', itemStyle: { color: '#ff9800' } }
                ],
                label: { show: false }
            }]
        });
    }

    loadTasks();
});

function switchCat(catId, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(catId).classList.add('active');
    el.classList.add('active');
}

function view(src) {
    const v = document.getElementById('viewer');
    document.getElementById('viewer-img').src = src;
    v.style.display = 'flex';
}
