window.addEventListener('DOMContentLoaded', () => {
    const voynichList = document.getElementById('voynich-list');
    const onlineEl = document.getElementById('online-num');

    // 初始化统计变量
    let stats = {
        hunting: 0,
        completed: 0
    };

    async function loadTasks() {
        if (!voynichList) return;
        voynichList.innerHTML = '<p style="color:orange; text-align:center; width:100%;">🔍 正在扫描猎人情报网...</p>';

        const ids = [];
        for (let i = 1; i <= 150; i++) {
            ids.push(`f${i}v`);
            if (i < 10) ids.push(`f0${i}v`);
        }

        let foundAny = false;

        for (const id of ids) {
            try {
                const response = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                if (response.ok) {
                    const data = await response.json();
                    if (!foundAny) voynichList.innerHTML = '';
                    foundAny = true;

                    // 判断状态（如果在JSON里没写status，默认是“寻找中”）
                    const isDone = data.status === "已结案";
                    if (isDone) stats.completed++; else stats.hunting++;

                    const imgPath = data.img.startsWith('/') ? data.img : '/' + data.img;

                    const card = `
                        <div class="card ${isDone ? 'completed' : ''}">
                            <img src="${imgPath}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片加载中'">
                            <div class="info">
                                <h3>编号：${data.id} <span class="tag ${isDone ? 'done' : ''}">${isDone ? '已结案' : '寻找中'}</span></h3>
                                <p class="desc">${data.desc}</p>
                                <div class="price">${isDone ? '💰 赏金已发放' : '赏金：' + data.price}</div>
                                ${isDone ? '' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                            </div>
                        </div>`;

                    voynichList.insertAdjacentHTML('beforeend', card);
                }
            } catch (err) { }
        }

        if (!foundAny) {
            voynichList.innerHTML = '<p style="color:gray; text-align:center; width:100%;">⚠️ 暂无情报，等待馆长同步...</p>';
        }

        // 渲染/更新图表
        updateChart(stats.hunting, stats.completed);
    }

    // --- 在线人数逻辑 ---
    function updateOnline() {
        let base = 40; // 基础人数
        let random = Math.floor(Math.random() * 15); // 0-15人波动
        if (onlineEl) onlineEl.innerText = base + random;
    }
    setInterval(updateOnline, 4000);
    updateOnline();

    // --- ECharts 统计图逻辑 ---
    function updateChart(hunting, completed) {
        const chartDom = document.getElementById('chart');
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item' },
            legend: { bottom: '0', textStyle: { color: '#ccc' } },
            series: [{
                name: '任务状态',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 10, borderColor: '#1a1a1a', borderWidth: 2 },
                label: { show: false },
                data: [
                    { value: hunting, name: '寻找中', itemStyle: { color: '#d35400' } },
                    { value: completed, name: '已结案', itemStyle: { color: '#27ae60' } }
                ]
            }]
        };
        myChart.setOption(option);
    }

    loadTasks();
});

// 预览和分类切换保持原样
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
