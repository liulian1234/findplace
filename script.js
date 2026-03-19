window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    
    async function loadTasks() {
        // 清理所有列表容器
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.innerHTML = '';
        });

        // 彻底解决 f01v：只循环标准编号 f1v, f2v...
        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        for (const id of ids) {
            try {
                const res = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                if (!res.ok) continue;
                const data = await res.json();

                const isDone = data.status === "已结案";
                if (isDone) stats.completed++; else stats.hunting++;

                // 颜色设定：结案为橙色 #ff9800
                const tagColor = isDone ? "#ff9800" : "#27ae60";

                const card = `
                    <div class="card">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片加载中'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag" style="background:${tagColor}">${data.status || '寻找中'}</span></h3>
                            <p>${data.desc}</p>
                            <div class="price">${isDone ? '💰 赏金已发放' : '赏金：' + data.price}</div>
                            ${isDone ? '' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                        </div>
                    </div>`;

                const cat = data.category || 'voynich';
                const listContainer = document.getElementById(`${cat}-list`);
                if (listContainer) listContainer.insertAdjacentHTML('beforeend', card);
            } catch (e) {}
        }
        updateChart(stats.hunting, stats.completed);
    }

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
