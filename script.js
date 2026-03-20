window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');

    async function loadTasks() {
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerHTML = ''; });

        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        // 1. 抓取所有 JSON 数据
        const promises = ids.map(id => 
            fetch(`./tasks/${id}.json?t=${Date.now()}`).then(res => res.ok ? res.json() : null).catch(() => null)
        );

        const results = await Promise.all(promises);

        // 2. 遍历结果进行统计与渲染
        results.forEach(data => {
            if (!data) return;

            const isDone = data.status === "已结案";
            if (isDone) stats.completed++; else stats.hunting++;

            // 分流：已结案去档案馆，否则去原分类
            const targetListId = isDone ? 'bounty-list' : `${data.category || 'voynich'}-list`;
            const tagColor = isDone ? "#ff9800" : "#27ae60";

            const card = `
                <div class="card" style="${isDone ? 'border-left: 5px solid #ff9800; opacity: 0.8;' : ''}">
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

        // 3. 数据抓取完毕，最后更新饼图
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

    setInterval(() => { if(onlineEl) onlineEl.innerText = Math.floor(Math.random()*15)+40; }, 4000);
    loadTasks();
});

function switchCat(id, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}
function view(s){ document.getElementById('viewer-img').src=s; document.getElementById('viewer').style.display='flex'; }
